const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const contentDir = path.join(__dirname, "..", "content");

function readYaml(file) {
  return YAML.parse(fs.readFileSync(path.join(contentDir, file), "utf8"));
}

function persianDigits(value) {
  return String(value).replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

function loadSite() {
  const site = readYaml("site.yml");
  const phone = String(site.phone || "").trim();
  const seoDescription = String(site.seoDescription || site.description || "").trim();
  const seoTitle = String(site.seoTitle || `${site.nameFa} | آپشن و نور خودرو، مانیتور و دوربین خودرو`).trim();
  return {
    ...site,
    phone,
    phoneIntl: phone.startsWith("0") ? `98${phone.slice(1)}` : phone.replace(/^\+/, ""),
    phoneDisplay: persianDigits(phone),
    showPrices: Boolean(site.showPrices),
    tagline: String(site.tagline || "آپشن و نور خودرو، مانیتور و دوربین").trim(),
    seoTitle,
    seoDescription,
    description: seoDescription,
  };
}

function normalizeProduct(product) {
  const price = product.price === "" || product.price == null ? null : Number(product.price);
  return {
    example: false,
    status: "active",
    available: true,
    price: Number.isInteger(price) ? price : null,
    compareAtPrice: null,
    brand: product.brand === "EGLXEN" ? "EGLXEN" : "",
    variants: [],
    options: [],
    specs: [],
    claims: [],
    images: [],
    guarantee: "",
    ...product,
    price: Number.isInteger(price) ? price : null,
    brand: product.brand === "EGLXEN" ? "EGLXEN" : product.brand ? "" : "",
  };
}

function loadCatalog() {
  const products = fs
    .readdirSync(path.join(contentDir, "products"))
    .filter((name) => name.endsWith(".yml"))
    .map((name) => normalizeProduct(readYaml(path.join("products", name))))
    .sort((a, b) => (a.seq || 0) - (b.seq || 0));
  const home = readYaml("home.yml");
  return {
    categories: readYaml("categories.yml").categories,
    models: readYaml("models.yml").models,
    brands: readYaml("brands.yml").brands,
    sockets: [
      { id: "H7", label: "H7" },
      { id: "H1", label: "H1" },
      { id: "H11", label: "H11" },
      { id: "9005", label: "9005" },
      { id: "H4", label: "H4" },
      { id: "9006", label: "9006" },
      { id: "D2S", label: "D2S" },
      { id: "D4S", label: "D4S" },
    ],
    products,
    home,
    faqs: (home.faqs || []).map((item) => [item.q, item.a]),
  };
}

module.exports = { loadSite, loadCatalog };
