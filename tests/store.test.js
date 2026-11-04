const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const catalog = require("../data/catalog");
const { handleTorobRequest } = require("../src/torob");
const { digikalaCsv } = require("../src/digikala");
const { build } = require("../scripts/build");

test("D45 socket availability follows the inventory list", () => {
  const d45 = catalog.products.find((product) => product.id === "led-d45");
  const bySocket = Object.fromEntries(d45.variants.map((variant) => [variant.socket, variant.available]));
  assert.equal(bySocket.H7, true);
  assert.equal(bySocket.H1, false);
  assert.equal(bySocket.H11, false);
  assert.equal(bySocket["9005"], true);
  assert.equal(bySocket.H4, true);
  assert.equal(d45.wattage, "۶۰ وات");
});

test("D150 is 100W and 9005 is unavailable", () => {
  const d150 = catalog.products.find((product) => product.id === "led-d150");
  const bySocket = Object.fromEntries(d150.variants.map((variant) => [variant.socket, variant.available]));
  assert.equal(d150.specs.find((row) => row.label === "توان").value, "۱۰۰ وات");
  assert.equal(bySocket["9005"], false);
  assert.equal(bySocket.H4, true);
});

test("D-socket bulbs replace the single xenon product", () => {
  const led = catalog.products.find((product) => product.id === "d-led");
  const hid = catalog.products.find((product) => product.id === "d-hid");
  assert.deepEqual(led.variants.map((variant) => variant.socket), ["D2S", "D4S"]);
  assert.ok(led.variants.every((variant) => variant.available));
  assert.ok(hid.variants.every((variant) => variant.available));
  assert.match(hid.title, /۶۰۰۰/);
});

test("monitors have memory variants and no invented screen size", () => {
  const ts18 = catalog.products.find((product) => product.id === "monitor-ts18");
  const t9 = catalog.products.find((product) => product.id === "monitor-t9");
  assert.equal(ts18.variants.length, 3);
  assert.equal(t9.variants.length, 2);
  assert.ok(t9.options.some((option) => option.id === "sim"));
  assert.match(ts18.specs.map((row) => row.value).join(" "), /استعلام/);
});

test("projector lenses are coming soon and prices are empty", () => {
  const lenses = catalog.products.filter((product) => product.category === "projector");
  assert.equal(lenses.length, 2);
  assert.ok(lenses.every((product) => product.status === "coming_soon"));
  assert.ok(catalog.products.every((product) => product.price == null));
});

test("catalog does not name removed supplier brands or stock counts", () => {
  const blob = JSON.stringify(catalog);
  assert.equal(blob.includes("YUANBA"), false);
  assert.equal(blob.includes("299"), false);
  assert.equal(blob.includes("یوانبا"), false);
});

test("torob rejects an empty body and hides unpriced products", () => {
  const site = { url: "https://toyotaclubiran.com", showPrices: false };
  assert.equal(handleTorobRequest({}, catalog, site).status, 400);
  assert.equal(handleTorobRequest({ page: 1 }, catalog, site).status, 400);
  const listed = handleTorobRequest({ page: 1, sort: "date_added_desc" }, catalog, site);
  assert.equal(listed.status, 200);
  assert.equal(listed.body.products.length, 0);
  assert.equal(listed.body.api_version, "torob_api_v3");
});

test("torob lists a product only after a price is published", () => {
  const priced = {
    ...catalog,
    products: catalog.products.map((product) =>
      product.id === "led-d45" ? { ...product, price: 1000 } : product
    ),
  };
  const site = { url: "https://toyotaclubiran.com", showPrices: true };
  const listed = handleTorobRequest({ page: 1, sort: "date_added_desc" }, priced, site);
  assert.equal(listed.body.products.length, 1);
  assert.equal(listed.body.products[0].current_price, 1000);
  assert.equal(listed.body.products[0].availability, true);
});

test("digikala export is a spreadsheet with empty prices", () => {
  const csv = digikalaCsv(catalog);
  assert.match(csv, /shop_sku/);
  assert.match(csv, /TCI-D45/);
  assert.match(csv, /استعلام|خالی/);
});

test("static build has inquiry UI, Netlify forms, address, and no prices", () => {
  build();
  const dist = path.join(__dirname, "..", "dist");
  const home = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  const product = fs.readFileSync(path.join(dist, "product/eglxen-d45/index.html"), "utf8");
  const monitor = fs.readFileSync(path.join(dist, "product/android-monitor-ts18/index.html"), "utf8");
  const checkout = fs.readFileSync(path.join(dist, "checkout/index.html"), "utf8");
  assert.match(home, /استان فارس، شهرستان لامرد/);
  assert.match(home, /۰۹۱۷۴۴۵۰۰۴۰/);
  assert.match(home, /data-netlify="true"/);
  assert.match(home, /name="form-name"/);
  assert.match(home, /bot-field/);
  assert.match(home, /wa\.me\/989174450040/);
  assert.doesNotMatch(home, /تومان/);
  assert.doesNotMatch(product, /YUANBA/);
  assert.match(product, /EGLXEN/);
  assert.match(product, /استعلام قیمت/);
  assert.match(product, /ناموجود/);
  assert.match(monitor, /۴ \+ ۶۴|۴ \+ ۶۴ گیگابایت|۴ \+ ۶۴/);
  assert.match(checkout, /name="order"/);
  assert.match(fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8"), /eglxen-d45/);
  const torob = JSON.parse(fs.readFileSync(path.join(dist, "torob/products.json"), "utf8"));
  assert.equal(torob.api_version, "torob_api_v3");
  assert.equal(torob.products.length, 0);
});
