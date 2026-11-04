const crypto = require("crypto");
const { productIsAvailable, variantList } = require("./catalog-tools");

const TOROB_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAt6Mu4T0pBORY11W+QeM35UsmLO3vsf+6yKpFDEImFk0=
-----END PUBLIC KEY-----`;

const PAGE_SIZE = 100;

function listedProducts(catalog, site) {
  if (!site.showPrices) return [];
  return catalog.products.filter(
    (product) =>
      Number.isInteger(product.price) &&
      product.price > 0 &&
      !product.example &&
      product.status !== "coming_soon" &&
      product.publishToTorob !== false
  );
}

function absolute(site, src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${site.url}${src.startsWith("/") ? "" : "/"}${src}`;
}

function toTorobProduct(product, site, catalog) {
  const category = catalog.categories.find((item) => item.id === product.category);
  const images = (product.images || []).map((image) => absolute(site, image.src)).filter(Boolean);
  if (!images.length) images.push(absolute(site, "/images/hero/eglxen-d-series-studio.jpg"));
  const available = productIsAvailable(product);
  const spec = {};
  for (const row of product.specs || []) spec[row.label] = row.value;
  for (const variant of variantList(product)) {
    spec[`سوکت ${variant.socket || variant.label}`] = variant.available ? "موجود" : "ناموجود";
  }
  return {
    page_unique: product.id,
    page_url: `${site.url}/product/${product.slug}/`,
    product_group_id: product.groupId || product.id,
    title: product.title,
    subtitle: product.subtitle || undefined,
    current_price: available ? product.price : 0,
    old_price: Number.isInteger(product.compareAtPrice) ? product.compareAtPrice : undefined,
    availability: Boolean(available),
    category_name: category ? category.name : product.category,
    image_links: images,
    short_desc: String(product.shortDescription || "").slice(0, 500),
    spec,
    guarantee: product.guarantee || undefined,
    date_added: product.dateAdded,
    date_updated: product.dateUpdated,
  };
}

function sortProducts(products, sort) {
  const copy = products.slice();
  if (sort === "date_updated_desc") {
    copy.sort((a, b) => String(b.dateUpdated).localeCompare(String(a.dateUpdated)) || b.seq - a.seq);
  } else if (sort === "product_id_desc") {
    copy.sort((a, b) => b.seq - a.seq);
  } else {
    copy.sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)) || b.seq - a.seq);
  }
  return copy;
}

function pageResponse(items, page) {
  const maxPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(Math.max(page, 1), maxPages);
  const slice = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  return {
    api_version: "torob_api_v3",
    current_page: current,
    total: items.length,
    max_pages: maxPages,
    next_cursor: null,
    products: slice,
  };
}

function handleTorobRequest(body, catalog, site) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { status: 400, body: { error: "invalid request body" } };
  }
  const keys = Object.keys(body);
  if (!keys.length) return { status: 400, body: { error: "request body is empty" } };

  const mapped = listedProducts(catalog, site).map((product) => toTorobProduct(product, site, catalog));
  const byUnique = new Map(mapped.map((product) => [product.page_unique, product]));
  const byUrl = new Map(mapped.map((product) => [product.page_url, product]));

  if (Array.isArray(body.page_urls)) {
    if (!body.page_urls.length || keys.some((key) => key !== "page_urls")) {
      return { status: 400, body: { error: "invalid page_urls request" } };
    }
    const products = body.page_urls.map((url) => byUrl.get(url)).filter(Boolean);
    return { status: 200, body: pageResponse(products, 1) };
  }

  if (Array.isArray(body.page_uniques)) {
    if (!body.page_uniques.length || keys.some((key) => key !== "page_uniques")) {
      return { status: 400, body: { error: "invalid page_uniques request" } };
    }
    const products = body.page_uniques.map((id) => byUnique.get(String(id))).filter(Boolean);
    return {
      status: 200,
      body: {
        api_version: "torob_api_v3",
        current_page: 1,
        total: products.length,
        max_pages: 1,
        next_cursor: null,
        products,
      },
    };
  }

  const allowedSort = new Set(["date_added_desc", "date_updated_desc", "product_id_desc"]);
  if (body.sort && !allowedSort.has(body.sort)) {
    return { status: 400, body: { error: "invalid sort parameter" } };
  }

  const cursorMode = !Object.prototype.hasOwnProperty.call(body, "page") && (body.sort === "product_id_desc" || body.cursor);
  if (cursorMode) {
    if (body.sort && body.sort !== "product_id_desc") {
      return { status: 400, body: { error: "cursor pagination requires product_id_desc" } };
    }
    if (Object.prototype.hasOwnProperty.call(body, "page")) {
      return { status: 400, body: { error: "cursor request must not include page" } };
    }
    const sorted = sortProducts(listedProducts(catalog, site), "product_id_desc");
    let start = 0;
    if (body.cursor != null) {
      const cursor = Number(body.cursor);
      start = sorted.findIndex((product) => product.seq < cursor);
      if (start === -1) start = sorted.length;
    }
    const slice = sorted.slice(start, start + PAGE_SIZE);
    const more = start + PAGE_SIZE < sorted.length;
    return {
      status: 200,
      body: {
        api_version: "torob_api_v3",
        current_page: null,
        total: sorted.length,
        max_pages: Math.max(1, Math.ceil(sorted.length / PAGE_SIZE)),
        next_cursor: more ? String(slice[slice.length - 1].seq) : null,
        products: slice.map((product) => toTorobProduct(product, site, catalog)),
      },
    };
  }

  if (!Object.prototype.hasOwnProperty.call(body, "page")) {
    return { status: 400, body: { error: "page or a supported query is required" } };
  }
  if (!body.sort) return { status: 400, body: { error: "sort parameter is not provided" } };
  const page = Number(body.page);
  if (!Number.isInteger(page) || page < 1) return { status: 400, body: { error: "invalid page parameter" } };
  const sorted = sortProducts(listedProducts(catalog, site), body.sort);
  const response = pageResponse(
    sorted.map((product) => toTorobProduct(product, site, catalog)),
    page
  );
  return { status: 200, body: response };
}

function verifyTorobToken(token, audience) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("invalid token");
  const [headerPart, payloadPart, signaturePart] = parts;
  const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
  if (header.alg !== "EdDSA") throw new Error("invalid alg");
  const key = crypto.createPublicKey(TOROB_PUBLIC_KEY);
  const valid = crypto.verify(
    null,
    Buffer.from(`${headerPart}.${payloadPart}`),
    key,
    Buffer.from(signaturePart, "base64url")
  );
  if (!valid) throw new Error("bad signature");
  const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && now >= payload.exp) throw new Error("expired");
  if (typeof payload.nbf === "number" && now < payload.nbf) throw new Error("not yet valid");
  const aud = payload.aud;
  const matches = Array.isArray(aud) ? aud.includes(audience) : aud === audience;
  if (!matches) throw new Error("audience mismatch");
  return payload;
}

module.exports = {
  handleTorobRequest,
  verifyTorobToken,
  listedProducts,
  toTorobProduct,
  PAGE_SIZE,
};
