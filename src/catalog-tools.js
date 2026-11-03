const SOCKET_ORDER = ["H7", "H1", "H11", "9005", "H4", "9006", "D2S", "D4S"];

function isComingSoon(product) {
  return product.status === "coming_soon";
}

function variantList(product) {
  return Array.isArray(product.variants) ? product.variants : [];
}

function availableVariants(product) {
  return variantList(product).filter((variant) => variant.available);
}

function productIsAvailable(product) {
  if (isComingSoon(product) || product.example) return false;
  const variants = variantList(product);
  if (!variants.length) return product.available !== false;
  return availableVariants(product).length > 0;
}

function canPurchase(product, site) {
  return Boolean(
    site.showPrices &&
      Number.isInteger(product.price) &&
      product.price >= 0 &&
      !product.example &&
      !isComingSoon(product) &&
      productIsAvailable(product)
  );
}

function matchesSocket(product, socket) {
  if (!socket) return true;
  return variantList(product).some((variant) => variant.socket === socket);
}

function matchesModel(product, modelId, year) {
  if (!modelId && !year) return true;
  const rows = product.fitment?.toyota || [];
  if (product.fitment?.scope === "socket" || product.fitment?.scope === "universal") {
    return true;
  }
  if (!rows.length) return false;
  return rows.some((row) => {
    if (modelId && row.model !== modelId) return false;
    if (!year) return true;
    const value = Number(year);
    return value >= row.yearFrom && value <= row.yearTo;
  });
}

function matchesBrand(product, brand) {
  if (!brand || brand === "any") return true;
  if (product.fitment?.scope === "socket" || product.fitment?.scope === "universal") return true;
  if (brand === "toyota") return (product.fitment?.toyota || []).length > 0 || product.fitment?.scope === "unknown";
  return product.fitment?.scope !== "toyota";
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ");
}

function searchText(product, catalog) {
  const models = (product.fitment?.toyota || [])
    .map((row) => catalog.models.find((model) => model.id === row.model))
    .filter(Boolean)
    .map((model) => `${model.name} ${model.nameFa}`)
    .join(" ");
  const sockets = variantList(product)
    .map((variant) => variant.socket || variant.label)
    .join(" ");
  return normalize(
    [product.title, product.subtitle, product.sku, product.brand, product.shortDescription, models, sockets].join(" ")
  );
}

function filterProducts(catalog, query) {
  const q = normalize(query.q || "").trim();
  return catalog.products.filter((product) => {
    if (query.category && product.category !== query.category) return false;
    if (query.example === "only" && !product.example) return false;
    if (query.example === "hide" && product.example) return false;
    if (!matchesSocket(product, query.socket)) return false;
    if (!matchesBrand(product, query.brand)) return false;
    if (query.model && !matchesModel(product, query.model, query.year)) return false;
    if (query.year && !query.model && !matchesModel(product, "", query.year) && product.fitment?.scope === "toyota") {
      return false;
    }
    if (q && !searchText(product, catalog).includes(q)) return false;
    return true;
  });
}

function categoryById(catalog, id) {
  return catalog.categories.find((category) => category.id === id);
}

function modelById(catalog, id) {
  return catalog.models.find((model) => model.id === id);
}

function productBySlug(catalog, slug) {
  return catalog.products.find((product) => product.slug === slug);
}

function relatedProducts(catalog, product, limit = 4) {
  return catalog.products
    .filter((item) => item.id !== product.id && item.category === product.category && !item.example)
    .slice(0, limit);
}

module.exports = {
  SOCKET_ORDER,
  isComingSoon,
  variantList,
  availableVariants,
  productIsAvailable,
  canPurchase,
  filterProducts,
  categoryById,
  modelById,
  productBySlug,
  relatedProducts,
};
