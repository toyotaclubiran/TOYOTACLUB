const fs = require("fs");
const path = require("path");
const siteFile = require("../data/site");
const catalog = require("../data/catalog");
const pages = require("../src/pages");
const { handleTorobRequest } = require("../src/torob");
const { digikalaCsv } = require("../src/digikala");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

function loadSite() {
  const site = { ...siteFile };
  if (process.env.SHOW_PRICES === "true") site.showPrices = true;
  if (process.env.PUBLIC_BASE_URL) site.url = process.env.PUBLIC_BASE_URL.replace(/\/$/, "");
  return site;
}

function publicFiles() {
  const files = new Set();
  const base = path.join(root, "public");
  function walk(dir, prefix) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = `${prefix}${entry.name}`;
      if (entry.isDirectory()) walk(path.join(dir, entry.name), `${rel}/`);
      else files.add(`/${rel}`);
    }
  }
  walk(base, "");
  return files;
}

function write(rel, contents) {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
}

function build() {
  const site = loadSite();
  const files = publicFiles();
  fs.rmSync(dist, { recursive: true, force: true });
  fs.cpSync(path.join(root, "public"), dist, { recursive: true });

  write("index.html", pages.renderHome(site, catalog, files));
  write("shop/index.html", pages.renderShop(site, catalog, files));
  write("contact/index.html", pages.renderContact(site));
  write("request/index.html", pages.renderRequest(site, "part"));
  write("wholesale/index.html", pages.renderRequest(site, "wholesale"));
  write("cart/index.html", pages.renderCart(site));
  write("checkout/index.html", pages.renderCheckout(site));
  write("thanks/index.html", pages.renderThanks(site));
  write("404.html", pages.renderNotFound(site));

  for (const category of catalog.categories) {
    write(`category/${category.id}/index.html`, pages.renderCategory(site, catalog, files, category));
  }
  for (const model of catalog.models) {
    write(`model/${model.id}/index.html`, pages.renderModel(site, catalog, files, model));
  }
  for (const socket of catalog.sockets) {
    write(`socket/${socket.id}/index.html`, pages.renderSocket(site, catalog, files, socket));
  }
  for (const product of catalog.products) {
    write(`product/${product.slug}/index.html`, pages.renderProduct(site, catalog, files, product));
  }

  const urls = [
    "/",
    "/shop/",
    "/contact/",
    "/request/",
    ...catalog.categories.map((category) => `/category/${category.id}/`),
    ...catalog.models.map((model) => `/model/${model.id}/`),
    ...catalog.sockets.map((socket) => `/socket/${socket.id}/`),
    ...catalog.products.map((product) => `/product/${product.slug}/`),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${site.url}${url}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  write("sitemap.xml", sitemap);
  write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

  const torob = handleTorobRequest({ page: 1, sort: "date_added_desc" }, catalog, site);
  write("torob/products.json", `${JSON.stringify(torob.body, null, 2)}\n`);
  write("exports/digikala.csv", digikalaCsv(catalog));
  write("exports/digikala.json", `${JSON.stringify({ note: "Preparation file for the Digikala seller panel. It is not sent to Digikala.", products: catalog.products.map((product) => ({ sku: product.sku, title: product.title, price: product.price })) }, null, 2)}\n`);

  return { pages: urls.length, showPrices: site.showPrices };
}

if (require.main === module) {
  const result = build();
  console.log(`Built ${result.pages} routes. showPrices=${result.showPrices}`);
}

module.exports = { build };
