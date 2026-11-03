function csvCell(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function digikalaRows(catalog) {
  return catalog.products.map((product) => {
    const category = catalog.categories.find((item) => item.id === product.category);
    const variants = (product.variants || [])
      .map((variant) => `${variant.socket || variant.label}:${variant.available ? "available" : "unavailable"}`)
      .join(" | ");
    const models = (product.fitment?.toyota || [])
      .map((row) => `${row.model} ${row.yearFrom || ""}-${row.yearTo || ""} ${row.also ? row.also.join("/") : ""}`.trim())
      .join(" | ");
    return {
      shop_sku: product.sku,
      title_fa: product.title,
      title_en: product.titleEn || "",
      brand: product.brand || "",
      category: category ? category.name : product.category,
      variants,
      fitment_scope: product.fitment?.scope || "",
      toyota_fitment: models,
      fitment_note: product.fitment?.note || "",
      price_toman: Number.isInteger(product.price) ? product.price : "",
      price_rial: Number.isInteger(product.price) ? product.price * 10 : "",
      availability: product.status === "coming_soon" ? "coming_soon" : product.example ? "example" : "see_variants",
      is_example: product.example ? "yes" : "no",
      description: product.shortDescription || "",
      specs: (product.specs || []).map((row) => `${row.label}: ${row.value}`).join(" | "),
      image_paths: (product.images || []).map((image) => image.src).join(" | "),
      seller_note:
        "فایل آماده‌سازی برای پنل فروشندگان دیجی‌کالا است و به دیجی‌کالا ارسال نمی‌شود. قیمت‌ها تا اعلام فروشگاه خالی هستند.",
    };
  });
}

function digikalaCsv(catalog) {
  const rows = digikalaRows(catalog);
  const headers = Object.keys(rows[0] || { shop_sku: "" });
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvCell(row[header])).join(","));
  return `\uFEFF${lines.join("\n")}\n`;
}

module.exports = { digikalaRows, digikalaCsv };
