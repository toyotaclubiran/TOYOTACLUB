const { esc, faNum, paragraphs, jsonLd, waLink } = require("./format");
const { variantList, isComingSoon, categoryById, modelById, relatedProducts, productIsAvailable } = require("./catalog-tools");

function usableImages(product, files) {
  return (product.images || []).filter((image) => image.src && (!files || files.has(image.src)));
}

function waText(site, product) {
  if (!product) return "سلام، از سایت تویوتا کلاب ایران پیام می‌دهم.";
  return `سلام، برای استعلام «${product.title}» از فروشگاه تویوتا کلاب ایران پیام می‌دهم.`;
}

function layout(opts) {
  const { site, title, description, canonical, path, main, json, robots, product, files } = opts;
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const desc = description || site.description;
  const canon = canonical || `${site.url}${path || "/"}`;
  const wa = waLink(site.phoneIntl, waText(site, product));
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(canon)}">
  ${robots ? `<meta name="robots" content="${esc(robots)}">` : ""}
  <meta name="theme-color" content="#d71920">
  <meta property="og:locale" content="fa_IR">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${esc(canon)}">
  <meta property="og:image" content="${esc(site.url)}/images/hero/eglxen-d-series-studio.jpg">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="/css/store.css">
  ${json ? `<script type="application/ld+json">${jsonLd(json)}</script>` : ""}
</head>
<body data-prices="${site.showPrices ? "on" : "off"}">
  <a class="skip" href="#content">رفتن به محتوا</a>
  ${header(site, path)}
  <main id="content">${main}</main>
  ${footer(site)}
  <a class="wa-float" href="${esc(wa)}" target="_blank" rel="noopener">واتساپ</a>
  ${chatWidget(site, path)}
  <script src="/js/store.js" defer></script>
</body>
</html>`;
}

function header(site, path) {
  const link = (href, label) => `<a href="${href}" ${path === href ? 'aria-current="page"' : ""}>${label}</a>`;
  return `<header class="site-header">
    <div class="topbar">
      <span>${esc(site.address)}</span>
      <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a>
    </div>
    <div class="header-inner">
      <a class="brand" href="/">
        <span class="brand-mark">TC</span>
        <span class="brand-name"><span class="red">Toyota</span> Club Iran</span>
      </a>
      <form class="search" action="/shop/" method="get" role="search">
        <label class="sr-only" for="q">جستجو</label>
        <input id="q" name="q" type="search" placeholder="جستجو، مثلاً هدلایت H7 یا پرادو">
      </form>
      <nav class="nav" aria-label="اصلی">
        ${link("/shop/", "فروشگاه")}
        ${link("/category/led/", "هدلایت")}
        ${link("/category/monitor/", "مانیتور")}
        <a href="/#models">مدل تویوتا</a>
        ${link("/request/", "درخواست قطعه")}
        ${link("/contact/", "تماس")}
      </nav>
      <a class="phone-link" href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a>
      <details class="drawer">
        <summary>منو</summary>
        <div class="drawer-panel">
          <a href="/shop/">فروشگاه</a>
          <a href="/category/led/">هدلایت</a>
          <a href="/category/monitor/">مانیتور</a>
          <a href="/category/xenon/">سوکت D</a>
          <a href="/#models">مدل تویوتا</a>
          <a href="/request/">درخواست قطعه</a>
          <a href="/contact/">تماس</a>
          <a href="/cart/">سبد خرید</a>
        </div>
      </details>
    </div>
  </header>`;
}

function footer(site) {
  return `<footer class="site-footer">
    <div class="footer-grid">
      <div>
        <strong>Toyota Club Iran</strong>
        <p>فروشگاه مستقل آپشن و قطعه. هدلایت و بسیاری از تجهیزات برای همه خودروهاست و مرور مدل، مخصوص قطعات تویوتا است.</p>
      </div>
      <div>
        <strong>تماس</strong>
        <p>${esc(site.address)}</p>
        <p><a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
        <p><a href="${esc(waLink(site.phoneIntl, waText(site)))}">واتساپ</a></p>
      </div>
      <div>
        <strong>فروشگاه</strong>
        <p><a href="/category/led/">هدلایت LED</a></p>
        <p><a href="/category/monitor/">مانیتور خودرو</a></p>
        <p><a href="/request/">درخواست قطعه</a></p>
        <p><a href="/checkout/">ثبت سفارش</a></p>
      </div>
    </div>
    <p class="fine">${esc(site.stockNote)}</p>
    <p class="fine">© ${faNum(2026)} Toyota Club Iran</p>
  </footer>`;
}

function chatWidget() {
  return `<details class="chat-float">
    <summary>پیام</summary>
    <form class="chat-form" name="message" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="message">
      <p class="hp" hidden><label>این قسمت را خالی بگذارید <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <p class="form-title">پیام به فروشگاه</p>
      <label>نام <input name="full-name" required autocomplete="name"></label>
      <label>موبایل <input name="phone" required inputmode="tel" autocomplete="tel" dir="ltr"></label>
      <label>پیام <textarea name="message" required rows="3"></textarea></label>
      <button class="btn btn-primary" type="submit">ارسال</button>
    </form>
  </details>`;
}

function honeypot() {
  return `<p class="hp" hidden><label>این قسمت را خالی بگذارید <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>`;
}

function businessJson(site) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: site.name,
    url: site.url,
    telephone: `+${site.phoneIntl}`,
    image: `${site.url}/images/hero/eglxen-d-series-studio.jpg`,
    address: {
      "@type": "PostalAddress",
      addressRegion: site.province,
      addressLocality: site.locality,
      addressCountry: site.country,
    },
    areaServed: "IR",
  };
}

function productCard(product, catalog, files) {
  const images = usableImages(product, files);
  const category = categoryById(catalog, product.category);
  const variants = variantList(product);
  const available = variants.filter((item) => item.available).map((item) => item.socket || item.label);
  let stock = "";
  if (product.example) stock = `<span class="badge sample">نمونه</span>`;
  else if (isComingSoon(product)) stock = `<span class="badge soon">به‌زودی</span>`;
  else if (variants.length) {
    stock = available.length
      ? `<span class="badge ok">موجود: ${esc(available.join("، "))}</span>`
      : `<span class="badge bad">ناموجود</span>`;
  } else if (productIsAvailable(product)) stock = `<span class="badge ok">موجود</span>`;
  else stock = `<span class="badge bad">ناموجود</span>`;
  const media = images[0]
    ? `<img src="${esc(images[0].src)}" alt="${esc(images[0].alt || product.title)}">`
    : `<span class="fallback">${esc(product.title)}</span>`;
  const search = esc(`${product.title} ${product.shortDescription || ""} ${product.sku} ${product.brand || ""}`.toLowerCase());
  return `<article class="card" data-search="${search}">
    <a class="card-media" href="/product/${esc(product.slug)}/">${media}</a>
    <div class="card-body">
      <p class="eyebrow">${esc(category ? category.name : "")}</p>
      <h3><a href="/product/${esc(product.slug)}/">${esc(product.title)}</a></h3>
      <p class="muted">${esc(product.shortDescription || "")}</p>
      <div class="card-meta">${stock}</div>
      <p class="inquiry-line"><a href="/product/${esc(product.slug)}/">استعلام قیمت</a></p>
    </div>
  </article>`;
}

function cardGrid(products, catalog, files) {
  if (!products.length) {
    return `<p class="empty">کالایی با این فیلتر پیدا نشد. <a href="/request/">درخواست قطعه</a> را ثبت کنید.</p>`;
  }
  return `<div class="product-grid">${products.map((product) => productCard(product, catalog, files)).join("")}</div>`;
}

function renderHome(site, catalog, files) {
  const featured = ["led-d45", "led-d65", "led-d55", "led-d90", "monitor-ts18", "monitor-t9"]
    .map((id) => catalog.products.find((product) => product.id === id))
    .filter(Boolean);
  const real = catalog.products.filter((product) => !product.example && !["led", "monitor"].includes(product.category)).slice(0, 8);
  const samples = catalog.products.filter((product) => product.example);
  const main = `
    <section class="hero">
      <div class="hero-copy">
        <p class="pill">لامرد · همه خودروها</p>
        <h1>آپشن و قطعه، با انتخاب سوکت یا مدل <span class="red">Toyota</span></h1>
        <p>هدلایت EGLXEN و تجهیزات عمومی برای هر خودرویی که سوکت یا نصبش جور باشد. قطعات مخصوص تویوتا را با مدل خودرو ببینید.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/category/led/">هدلایت‌ها</a>
          <a class="btn btn-secondary" href="/#models">انتخاب تویوتا</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="/images/hero/eglxen-d-series-studio.jpg" alt="جعبه هدلایت EGLXEN سری D">
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>سوکت لامپ را انتخاب کنید</h2><p>هدلایت‌ها محدود به تویوتا نیستند. سوکت حک‌شده روی لامپ فابریک را پیدا کنید.</p></div>
      <div class="chip-row">
        ${catalog.sockets.map((socket) => `<a class="chip" href="/socket/${esc(socket.id)}/">${esc(socket.label)}</a>`).join("")}
      </div>
      <figure class="banner">
        <img src="/images/products/lineup-sockets.jpg" alt="چند شکل سوکت لامپ LED">
        <figcaption>چند شکل بدنه لامپ. این عکس برچسب کد سوکت ندارد؛ کد را از روی لامپ خودرو بخوانید.</figcaption>
      </figure>
    </section>
    <section class="section">
      <div class="section-head"><h2>کالاهای فروشگاه</h2><p>قیمت همه کالاها با استعلام اعلام می‌شود. شماره ${esc(site.phoneDisplay)}</p></div>
      ${cardGrid(featured, catalog, files)}
    </section>
    <section class="section" id="models">
      <div class="section-head"><h2>Choose Your Toyota</h2><p>برای قطعاتی که به مدل تویوتا وابسته‌اند. هدلایت در این فیلتر حذف نمی‌شود.</p></div>
      <div class="model-grid">
        ${catalog.models
          .map(
            (model) => `<a class="model-card" href="/model/${esc(model.id)}/">
            <span class="model-name">${esc(model.name)}</span>
            <span>${esc(model.nameFa)}</span>
          </a>`
          )
          .join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>دسته‌ها</h2></div>
      <div class="cat-grid">
        ${catalog.categories
          .filter((category) => category.group !== "example")
          .map(
            (category) => `<a class="cat-card" href="/category/${esc(category.id)}/"><strong>${esc(category.name)}</strong><span>${esc(category.blurb)}</span></a>`
          )
          .join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><h2>سایر قطعات</h2></div>
      ${cardGrid(real, catalog, files)}
    </section>
    <section class="section">
      <div class="section-head"><h2>نمونه‌های دسته‌های دیگر</h2><p>این کارت‌ها موجودی واقعی نیستند و فقط شکل کاتالوگ را نشان می‌دهند.</p></div>
      ${cardGrid(samples, catalog, files)}
    </section>
    <section class="section split">
      <article>
        <h2>قطعه را پیدا نکردید؟</h2>
        <p>مدل خودرو و شرح قطعه را بفرستید تا بررسی شود.</p>
        <a class="btn btn-primary" href="/request/">درخواست قطعه</a>
      </article>
      <article>
        <h2>همکاری تجاری</h2>
        <p>برای تأمین عمده با فروشگاه در لامرد هماهنگ کنید.</p>
        <a class="btn btn-secondary" href="/wholesale/">درخواست همکاری</a>
      </article>
    </section>`;
  return layout({
    site,
    title: `${site.name} | هدلایت، مانیتور و قطعات خودرو`,
    description: site.description,
    path: "/",
    canonical: `${site.url}/`,
    files,
    json: businessJson(site),
    main,
  });
}

function listingPage(site, catalog, files, { title, description, path, intro, products }) {
  const main = `<section class="section page-intro"><h1>${esc(title)}</h1>${intro || ""}</section>
    <section class="section">${cardGrid(products, catalog, files)}</section>`;
  return layout({
    site,
    title,
    description: description || title,
    path,
    canonical: `${site.url}${path}`,
    files,
    main,
  });
}

function renderShop(site, catalog, files) {
  return listingPage(site, catalog, files, {
    title: "فروشگاه",
    description: "همه کالاهای تویوتا کلاب ایران",
    path: "/shop/",
    intro: `<p>قیمت‌ها روی سایت نیست. برای هر کالا استعلام بگیرید یا با ${esc(site.phoneDisplay)} تماس بگیرید.</p>
      <div class="chip-row">${catalog.categories.map((category) => `<a class="chip" href="/category/${esc(category.id)}/">${esc(category.name)}</a>`).join("")}</div>`,
    products: catalog.products,
  });
}

function renderCategory(site, catalog, files, category) {
  const products = catalog.products.filter((product) => product.category === category.id);
  return listingPage(site, catalog, files, {
    title: category.name,
    description: category.blurb,
    path: `/category/${category.id}/`,
    intro: `<p>${esc(category.blurb)}</p>`,
    products,
  });
}

function renderModel(site, catalog, files, model) {
  const products = catalog.products.filter((product) => {
    if (product.fitment?.scope === "socket" || product.fitment?.scope === "universal") return true;
    return (product.fitment?.toyota || []).some((row) => row.model === model.id);
  });
  return listingPage(site, catalog, files, {
    title: model.name,
    description: `قطعات مرتبط با ${model.nameFa}`,
    path: `/model/${model.id}/`,
    intro: `<p>قطعاتی که برای ${esc(model.name)} ثبت شده‌اند، به همراه هدلایت و کالاهای عمومی که به برند خودرو محدود نیستند.</p>`,
    products,
  });
}

function renderSocket(site, catalog, files, socket) {
  const products = catalog.products.filter((product) =>
    (product.variants || []).some((variant) => variant.socket === socket.id)
  );
  return listingPage(site, catalog, files, {
    title: `سوکت ${socket.label}`,
    description: `کالاهای سوکت ${socket.label}`,
    path: `/socket/${socket.id}/`,
    intro: `<p>کالاهایی که این سوکت را در تنوع خود دارند. موجود یا ناموجود بودن هر سوکت روی کارت نوشته شده است.</p>`,
    products,
  });
}

function gallery(product, images) {
  if (!images.length) {
    return `<div class="media media-fallback"><span>${esc(product.title)}</span></div>`;
  }
  const radios = images
    .map(
      (image, index) =>
        `<input type="radio" name="gal" id="g${index}" ${index === 0 ? "checked" : ""}>`
    )
    .join("");
  const slides = images
    .map(
      (image) => `<figure><div class="media"><img src="${esc(image.src)}" alt="${esc(image.alt || product.title)}"></div>${
        image.caption ? `<figcaption>${esc(image.caption)}</figcaption>` : ""
      }</figure>`
    )
    .join("");
  const thumbs = images
    .map(
      (image, index) =>
        `<label for="g${index}"><img src="${esc(image.src)}" alt=""></label>`
    )
    .join("");
  return `<div class="gallery">${radios}<div class="slides">${slides}</div><div class="thumbs">${thumbs}</div></div>`;
}

function variantFields(product) {
  const variants = variantList(product);
  if (!variants.length) return "";
  const label = variants[0].socket ? "سوکت" : "حافظه";
  const options = variants
    .map((variant) => {
      const name = variant.socket || variant.label;
      const state = variant.available ? "موجود" : "ناموجود";
      return `<option value="${esc(name)}">${esc(name)} — ${state}</option>`;
    })
    .join("");
  const extra = (product.options || [])
    .map(
      (option) => `<label>${esc(option.label)}
        <select name="option-${esc(option.id)}">${option.choices.map((choice) => `<option>${esc(choice)}</option>`).join("")}</select>
      </label>`
    )
    .join("");
  return `<label>${label}
      <select name="variant">${options}</select>
    </label>${extra}`;
}

function variantTable(product) {
  const variants = variantList(product);
  if (!variants.length) return "";
  return `<ul class="variant-list">${variants
    .map((variant) => {
      const name = variant.socket || variant.label;
      const state = variant.available ? "موجود" : "ناموجود";
      return `<li><span>${esc(name)}</span><strong class="${variant.available ? "ok-text" : "bad-text"}">${state}</strong></li>`;
    })
    .join("")}</ul>`;
}

function renderProduct(site, catalog, files, product) {
  const images = usableImages(product, files);
  const category = categoryById(catalog, product.category);
  const phone = `<a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a>`;
  const coming = isComingSoon(product);
  const formName = coming ? "interest" : "inquiry";
  const formTitle = coming ? "خبرم کن" : "استعلام قیمت";
  const specs = (product.specs || [])
    .map((row) => `<div><dt>${esc(row.label)}</dt><dd>${esc(row.value)}</dd></div>`)
    .join("");
  const claims = (product.claims || [])
    .map((claim) => `<article><h3>${esc(claim.title)}</h3><p>${esc(claim.text)}</p></article>`)
    .join("");
  const fitment = product.fitment?.note ? `<p>${esc(product.fitment.note)}</p>` : "";
  const toyota = (product.fitment?.toyota || [])
    .map((row) => {
      const model = modelById(catalog, row.model);
      const also = row.also && row.also.length ? ` / ${row.also.join(" / ")}` : "";
      return `${model ? model.name : row.model}${also} ${faNum(row.yearFrom)}–${faNum(row.yearTo)}`;
    })
    .join("، ");
  const related = relatedProducts(catalog, product);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    sku: product.sku,
    image: images.map((image) => `${site.url}${image.src}`),
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    category: category ? category.name : undefined,
  };
  const main = `<article class="product">
      <p class="crumbs"><a href="/">خانه</a> / <a href="/category/${esc(product.category)}/">${esc(category ? category.name : "")}</a></p>
      <div class="product-layout">
        ${gallery(product, images)}
        <div class="buy">
          ${product.example ? `<p class="badge sample">نمونه</p>` : ""}
          ${coming ? `<p class="badge soon">به‌زودی</p>` : ""}
          <h1>${esc(product.title)}</h1>
          ${product.wattage ? `<p class="watt">${esc(product.wattage)}</p>` : ""}
          <p>${esc(product.shortDescription || "")}</p>
          ${variantTable(product)}
          <div class="price-box">
            <strong>استعلام قیمت</strong>
            <p>تماس ${phone}</p>
            <p><a href="${esc(waLink(site.phoneIntl, waText(site, product)))}">پیام واتساپ برای همین کالا</a></p>
          </div>
          <form class="stack-form" name="${formName}" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="${formName}">
            ${honeypot()}
            <input type="hidden" name="product" value="${esc(product.title)}">
            <input type="hidden" name="sku" value="${esc(product.sku)}">
            ${variantFields(product)}
            <label>نام <input name="full-name" required autocomplete="name"></label>
            <label>موبایل <input name="phone" required inputmode="tel" autocomplete="tel" dir="ltr"></label>
            <label>توضیح <textarea name="message" rows="3" placeholder="مدل خودرو یا سؤال"></textarea></label>
            <button class="btn btn-primary" type="submit">${formTitle}</button>
          </form>
          <p class="fine">${esc(site.stockNote)}</p>
        </div>
      </div>
      <div class="prose">${paragraphs(product.description)}</div>
      ${product.mappingNote ? `<p class="note">${esc(product.mappingNote)}</p>` : ""}
      ${fitment}
      ${toyota ? `<p>سازگاری ثبت‌شده: ${esc(toyota)}</p>` : ""}
      ${specs ? `<h2>مشخصات</h2><dl class="specs">${specs}</dl>` : ""}
      ${claims ? `<div class="claims">${claims}</div>` : ""}
      ${related.length ? `<h2>کالاهای مرتبط</h2>${cardGrid(related, catalog, files)}` : ""}
    </article>`;
  return layout({
    site,
    product,
    title: product.title,
    description: product.shortDescription,
    path: `/product/${product.slug}/`,
    canonical: `${site.url}/product/${product.slug}/`,
    files,
    json: productLd,
    main,
  });
}

function renderContact(site) {
  const main = `<section class="section narrow">
      <h1>تماس</h1>
      <p>${esc(site.address)}</p>
      <p>تلفن استعلام و سفارش: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
      <p><a class="btn btn-primary" href="${esc(waLink(site.phoneIntl, waText(site)))}">گفتگو در واتساپ</a></p>
      <p>${esc(site.stockNote)}</p>
      <h2>پیام</h2>
      <form class="stack-form" name="message" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="message">
        ${honeypot()}
        <label>نام <input name="full-name" required autocomplete="name"></label>
        <label>موبایل <input name="phone" required inputmode="tel" dir="ltr"></label>
        <label>پیام <textarea name="message" required rows="5"></textarea></label>
        <button class="btn btn-primary" type="submit">ارسال پیام</button>
      </form>
    </section>`;
  return layout({
    site,
    title: "تماس با تویوتا کلاب ایران",
    description: `${site.address}، تلفن ${site.phone}`,
    path: "/contact/",
    canonical: `${site.url}/contact/`,
    json: businessJson(site),
    main,
  });
}

function renderRequest(site, intent) {
  const wholesale = intent === "wholesale";
  const main = `<section class="section narrow">
      <h1>${wholesale ? "درخواست همکاری" : "درخواست قطعه"}</h1>
      <p>${wholesale ? "برای همکاری عمده پیام بگذارید." : "اگر قطعه را در فروشگاه ندیدید، مدل خودرو و شرح آن را بنویسید."}</p>
      <p>تلفن: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
      <form class="stack-form" name="part-request" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="part-request">
        <input type="hidden" name="intent" value="${wholesale ? "wholesale" : "part"}">
        ${honeypot()}
        <label>نام <input name="full-name" required></label>
        <label>موبایل <input name="phone" required inputmode="tel" dir="ltr"></label>
        <label>برند خودرو <input name="car-brand" placeholder="مثلاً تویوتا، پژو، کیا"></label>
        <label>مدل <input name="car-model"></label>
        <label>سال <input name="year" inputmode="numeric"></label>
        <label>سوکت لامپ، اگر مربوط است <input name="socket" placeholder="H7"></label>
        <label>شرح <textarea name="message" required rows="5"></textarea></label>
        <button class="btn btn-primary" type="submit">ثبت درخواست</button>
      </form>
    </section>`;
  const path = wholesale ? "/wholesale/" : "/request/";
  return layout({
    site,
    title: wholesale ? "همکاری تجاری" : "درخواست قطعه",
    description: wholesale ? "درخواست همکاری با تویوتا کلاب ایران" : "ثبت درخواست قطعه",
    path,
    canonical: `${site.url}${path}`,
    main,
  });
}

function renderCart(site) {
  const main = `<section class="section narrow">
      <h1>سبد خرید</h1>
      <p>تا وقتی قیمت‌ها روی سایت منتشر نشده، سبد و پرداخت نمایش داده نمی‌شود. سفارش را با استعلام قیمت ثبت کنید.</p>
      <p>تلفن استعلام: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
      <p><a class="btn btn-primary" href="/shop/">بازگشت به فروشگاه</a> <a class="btn btn-secondary" href="/checkout/">ثبت درخواست سفارش</a></p>
      <div id="cart-root" hidden></div>
    </section>`;
  return layout({
    site,
    title: "سبد خرید",
    description: "سبد خرید تویوتا کلاب ایران",
    path: "/cart/",
    canonical: `${site.url}/cart/`,
    robots: "noindex",
    main,
  });
}

function renderCheckout(site) {
  const main = `<section class="section narrow">
      <h1>ثبت سفارش</h1>
      <p class="price-off">قیمت‌ها هنوز روی سایت نیست. این فرم درخواست سفارش است و پرداخت آنلاین بعد از اعلام قیمت فعال می‌شود. درگاه زرین‌پال یا آیدی‌پی از تنظیمات محیط وصل می‌شود و الان اطلاعات ورود ندارد.</p>
      <p>هماهنگی فوری: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
      <form class="stack-form" name="order" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="order">
        ${honeypot()}
        <input type="hidden" name="items" id="order-items" value="">
        <label>نام <input name="full-name" required autocomplete="name"></label>
        <label>موبایل <input name="phone" required inputmode="tel" dir="ltr"></label>
        <label>شهر <input name="city" autocomplete="address-level2"></label>
        <label>آدرس <textarea name="address" rows="3"></textarea></label>
        <label>شرح کالاها <textarea name="message" required rows="4" placeholder="نام کالا، سوکت یا حافظه، تعداد"></textarea></label>
        <button class="btn btn-primary" type="submit">ثبت درخواست سفارش</button>
      </form>
    </section>`;
  return layout({
    site,
    title: "ثبت سفارش",
    description: "ثبت درخواست سفارش تویوتا کلاب ایران",
    path: "/checkout/",
    canonical: `${site.url}/checkout/`,
    robots: "noindex",
    main,
  });
}

function renderThanks(site) {
  const main = `<section class="section narrow">
      <h1>پیام شما ثبت شد</h1>
      <p>فروشگاه در ${esc(site.address)} آن را می‌بیند. برای پیگیری سریع‌تر با ${esc(site.phoneDisplay)} تماس بگیرید.</p>
      <a class="btn btn-primary" href="/">بازگشت به خانه</a>
    </section>`;
  return layout({
    site,
    title: "ثبت شد",
    description: "پیام شما ثبت شد",
    path: "/thanks/",
    canonical: `${site.url}/thanks/`,
    robots: "noindex",
    main,
  });
}

function renderNotFound(site) {
  const main = `<section class="section narrow"><h1>این صفحه پیدا نشد</h1><p><a href="/shop/">رفتن به فروشگاه</a></p></section>`;
  return layout({
    site,
    title: "صفحه پیدا نشد",
    description: "صفحه پیدا نشد",
    path: "/404.html",
    robots: "noindex",
    main,
  });
}

module.exports = {
  renderHome,
  renderShop,
  renderCategory,
  renderModel,
  renderSocket,
  renderProduct,
  renderContact,
  renderRequest,
  renderCart,
  renderCheckout,
  renderThanks,
  renderNotFound,
  usableImages,
};
