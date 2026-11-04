const { esc, faNum, paragraphs, jsonLd, waLink } = require("./format");
const { variantList, isComingSoon, categoryById, modelById, relatedProducts, productIsAvailable } = require("./catalog-tools");

function usableImages(product, files) {
  return (product.images || []).filter((image) => image.src && (!files || files.has(image.src)));
}

function waText(site, product) {
  if (!product) return "سلام، از سایت تویوتا کلاب ایران پیام می‌دهم.";
  return `سلام، برای استعلام «${product.title}» از فروشگاه تویوتا کلاب ایران پیام می‌دهم.`;
}

function honeypot() {
  return `<p class="hp" hidden><label>این قسمت را خالی بگذارید <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>`;
}

function wattNumber(product) {
  const map = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
  const latin = String(product.wattage || "").replace(/[۰-۹]/g, (digit) => map[digit]);
  const match = latin.match(/\d+/);
  return match ? match[0] : "";
}

function statusKey(product) {
  if (product.example) return "sample";
  if (isComingSoon(product)) return "soon";
  const variants = variantList(product);
  if (variants.length) return variants.some((item) => item.available) ? "available" : "unavailable";
  return product.available === false ? "unavailable" : "available";
}

function statusBadge(product) {
  const key = statusKey(product);
  if (key === "sample") return `<span class="badge sample">نمونه</span>`;
  if (key === "soon") return `<span class="badge soon">به‌زودی</span>`;
  if (key === "unavailable") return `<span class="badge bad">ناموجود</span>`;
  return `<span class="badge ok">موجود</span>`;
}

function businessJson(site) {
  return {
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

const faqs = [
  ["چرا قیمت روی سایت نیست؟", "قیمت‌ها با استعلام اعلام می‌شود. شماره ۰۹۱۷۴۴۵۰۰۴۰ یا فرم همین صفحه را استفاده کنید."],
  ["موجودی چطور تأیید می‌شود؟", "موجود یا ناموجود بودن روی کالا نوشته شده است. تعداد دقیق با فروش عوض می‌شود و پیش از ثبت نهایی سفارش تأیید می‌گردد."],
  ["آیا فروشگاه فقط برای تویوتا است؟", "هدلایت و بسیاری از تجهیزات برای هر خودرویی با سوکت یا نصب مناسب است. بخش مدل‌های تویوتا مخصوص قطعاتی است که سازگاری‌شان با تویوتا ثبت شده."],
  ["ارسال به کدام شهرهاست؟", "ارسال به سراسر ایران انجام می‌شود. هزینه و زمان ارسال همراه استعلام قیمت گفته می‌شود. فروشگاه در شهرستان لامرد استان فارس است."],
];

function layout(opts) {
  const { site, catalog, title, description, path, main, json, robots, product } = opts;
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const desc = description || site.description;
  const canon = `${site.url}${path || "/"}`;
  const index = (catalog?.products || []).map((item) => ({ t: item.title, s: item.slug }));
  const current = (href) => (path === href ? ' aria-current="page"' : "");
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${esc(canon)}">
  ${robots ? `<meta name="robots" content="${esc(robots)}">` : ""}
  <meta name="theme-color" content="#0c0d10">
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
  <div class="topbar"><div class="wrap topbar-inner">
    <span>${esc(site.address)}</span>
    <div class="top-links">
      <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a>
      <a href="${esc(waLink(site.phoneIntl, waText(site)))}">واتساپ</a>
    </div>
  </div></div>
  <header class="site-header">
    <div class="wrap header-main">
      <a class="brand" href="/" aria-label="Toyota Club Iran">
        <span class="wordmark">
          <span class="wm-line"><span class="wm-toyota">Toyota</span> <span class="wm-club">Club</span></span>
          <span class="wm-iran">IRAN</span>
        </span>
      </a>
      <form class="search" action="/shop/" method="get" role="search">
        <label class="sr-only" for="q">جستجو</label>
        <input id="q" data-search-input name="q" type="search" placeholder="جستجوی هدلایت، سوکت، مانیتور یا مدل تویوتا" autocomplete="off">
        <div class="suggest" data-suggest hidden></div>
      </form>
      <div class="header-tools">
        <a class="cart-link" href="/cart/" aria-label="سبد خرید"><span class="cart-count">۰</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 7h15l-1.5 9h-12L5 4H3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <details class="drawer">
          <summary class="icon-btn" aria-label="منو"><span class="menu-bars"></span></summary>
          <div class="drawer-panel">
            <a href="/category/led/">هدلایت LED</a>
            <a href="/category/xenon/">زنون و سوکت D</a>
            <a href="/category/monitor/">مانیتور خودرو</a>
            <a href="/category/camera/">سنسور و دوربین</a>
            <a href="/category/comfort/">آینه و صندوق</a>
            <a href="/#models">قطعات تویوتا</a>
            <a href="/category/projector/">لنز پروژکتور، به‌زودی</a>
            <a href="/request/">درخواست قطعه</a>
            <a href="/contact/">تماس</a>
          </div>
        </details>
      </div>
    </div>
    <nav class="wrap mega" aria-label="دسته‌ها">
      ${megaItem("هدلایت LED", "/category/led/", [["H7", "/socket/H7/"], ["H1", "/socket/H1/"], ["H11", "/socket/H11/"], ["9005", "/socket/9005/"], ["H4", "/socket/H4/"]])}
      ${megaItem("زنون / HID", "/category/xenon/", [["D2S", "/socket/D2S/"], ["D4S", "/socket/D4S/"]])}
      ${megaItem("مانیتور", "/category/monitor/", [["TS18", "/product/android-monitor-ts18/"], ["T9", "/product/android-monitor-t9/"]])}
      ${megaItem("سنسور و دوربین", "/category/camera/", [["سنسور پارک", "/category/parking/"], ["ایمنی", "/category/safety/"], ["دوربین", "/category/camera/"]])}
      ${megaItem("آینه و صندوق", "/category/comfort/", [["آسایش", "/category/comfort/"]])}
      ${megaItem("قطعات تویوتا", "/#models", (catalog?.models || []).map((model) => [model.name, `/model/${model.id}/`]))}
      ${megaItem("به‌زودی", "/category/projector/", [["لنز پروژکتور", "/category/projector/"]])}
    </nav>
  </header>
  <main id="content">${main}</main>
  <footer class="site-footer"><div class="wrap footer-grid">
    <div>
      <strong>Toyota Club Iran</strong>
      <p class="muted">فروشگاه مستقل آپشن و قطعه در لامرد. هدلایت EGLXEN و تجهیزات عمومی برای همه خودروها، و قطعاتی که سازگاری‌شان با تویوتا ثبت شده است.</p>
      <p class="muted">${esc(site.stockNote)}</p>
    </div>
    <div>
      <strong>فروشگاه</strong>
      <p><a href="/category/led/">هدلایت LED</a></p>
      <p><a href="/category/monitor/">مانیتور</a></p>
      <p><a href="/category/xenon/">سوکت D</a></p>
      <p><a href="/shop/">همه کالاها</a></p>
    </div>
    <div>
      <strong>تماس</strong>
      <p>${esc(site.address)}</p>
      <p><a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
      <p><a href="${esc(waLink(site.phoneIntl, waText(site, product)))}">واتساپ</a></p>
      <p><a href="/request/">درخواست قطعه</a></p>
    </div>
    <div class="enamad">نماد اعتماد<small>پس از دریافت اینماد اینجا قرار می‌گیرد</small></div>
  </div></footer>
  <nav class="tabbar" aria-label="ناوبری موبایل">
    <a href="/"${current("/")}>خانه</a>
    <a href="/shop/"${current("/shop/")}>فروشگاه</a>
    <a href="/category/led/"${current("/category/led/")}>هدلایت</a>
    <a href="/cart/"${current("/cart/")}>سبد</a>
    <a href="/contact/"${current("/contact/")}>تماس</a>
  </nav>
  <a class="wa-float" href="${esc(waLink(site.phoneIntl, waText(site, product)))}" target="_blank" rel="noopener">واتساپ</a>
  <details class="chat-float">
    <summary>پیام</summary>
    <form class="chat-form" name="message" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="message">
      ${honeypot()}
      <p class="form-title">پیام به فروشگاه</p>
      <label>نام <input name="full-name" required autocomplete="name"></label>
      <label>موبایل <input name="phone" required inputmode="tel" autocomplete="tel" dir="ltr"></label>
      <label>پیام <textarea name="message" required rows="3"></textarea></label>
      <button class="btn btn-primary" type="submit">ارسال</button>
    </form>
  </details>
  <script type="application/json" id="search-index">${jsonLd(index)}</script>
  <script src="/js/store.js" defer></script>
</body>
</html>`;
}

function megaItem(label, href, links) {
  return `<div class="mega-item"><a href="${href}">${esc(label)}</a><div class="mega-panel">${links
    .map(([text, url]) => `<a href="${url}">${esc(text)}</a>`)
    .join("")}</div></div>`;
}

function frame(images, alt) {
  if (!images.length) return `<span class="fallback">${esc(alt)}</span>`;
  const second = images[1] ? `<img class="alt" src="${esc(images[1].src)}" alt="">` : "";
  return `<img class="main" src="${esc(images[0].src)}" alt="${esc(images[0].alt || alt)}">${second}`;
}

function productCard(product, catalog, files) {
  const images = usableImages(product, files);
  const variants = variantList(product);
  const sockets = variants.map((item) => item.socket).filter(Boolean);
  const open = variants.filter((item) => item.available).map((item) => item.socket || item.label);
  const chips = [
    product.wattage ? `<span class="chip">${esc(product.wattage)}</span>` : "",
    ...open.slice(0, 3).map((name) => `<span class="chip">${esc(name)}</span>`),
  ].join("");
  const search = esc(`${product.title} ${product.shortDescription || ""} ${product.sku} ${sockets.join(" ")}`.toLowerCase());
  const wa = `https://wa.me/989174450040?text=${encodeURIComponent(waText({ phoneIntl: "989174450040" }, product))}`;
  return `<article class="card" data-search="${search}" data-sockets="${esc(sockets.join(" "))}" data-watt="${esc(wattNumber(product))}" data-status="${statusKey(product)}">
    <a class="card-media" href="/product/${esc(product.slug)}/">${frame(images, product.title)}</a>
    <div class="card-body">
      <div>${statusBadge(product)}</div>
      <h3><a href="/product/${esc(product.slug)}/">${esc(product.title)}</a></h3>
      <div class="chips">${chips}</div>
      <div class="card-actions">
        <a class="btn btn-primary" href="/product/${esc(product.slug)}/#inquiry">استعلام قیمت</a>
        <a class="btn btn-wa" href="${esc(wa)}" aria-label="واتساپ">W</a>
      </div>
    </div>
  </article>`;
}

function cardGrid(products, catalog, files) {
  if (!products.length) return `<p class="empty">کالایی با این فیلتر پیدا نشد. <a href="/request/">درخواست قطعه</a> را ثبت کنید.</p>`;
  return `<div class="product-grid">${products.map((product) => productCard(product, catalog, files)).join("")}</div>`;
}

function filters(catalog) {
  const sockets = catalog.sockets.map((socket) => `<label><input type="checkbox" data-filter="socket" value="${esc(socket.id)}"> ${esc(socket.label)}</label>`).join("");
  const watts = ["35", "45", "55", "60", "65", "75", "90", "100"]
    .map((watt) => `<label><input type="checkbox" data-filter="watt" value="${watt}"> ${faNum(Number(watt))} وات</label>`)
    .join("");
  return `<aside class="filters">
    <h2>فیلتر</h2>
    <div class="filter-block"><strong>سوکت</strong>${sockets}</div>
    <div class="filter-block"><strong>توان</strong>${watts}</div>
    <div class="filter-block"><strong>وضعیت</strong>
      <label><input type="checkbox" data-filter="status" value="available"> موجود</label>
      <label><input type="checkbox" data-filter="status" value="unavailable"> ناموجود</label>
      <label><input type="checkbox" data-filter="status" value="soon"> به‌زودی</label>
      <label><input type="checkbox" data-filter="status" value="sample"> نمونه</label>
    </div>
  </aside>`;
}

function listing(site, catalog, files, { title, description, path, crumbs, products }) {
  const main = `<div class="wrap page">
    <p class="crumbs">${crumbs}</p>
    <div class="section-head"><div><h1>${esc(title)}</h1><p>${esc(description || "")}</p></div></div>
    <div class="catalog" data-catalog>
      ${filters(catalog)}
      <div>
        <div class="toolbar">
          <span data-count>${faNum(products.length)} کالا</span>
          <select data-sort aria-label="مرتب‌سازی">
            <option value="default">پیش‌فرض</option>
            <option value="name">نام</option>
            <option value="watt">توان</option>
          </select>
          <button class="btn btn-line" type="button" data-view>لیست</button>
        </div>
        ${cardGrid(products, catalog, files)}
      </div>
    </div>
  </div>`;
  return layout({ site, catalog, title, description, path, main });
}

function heroSlide(kicker, title, text, image, alt) {
  return `<div class="hero-slide"><div class="hero-copy">
      <div class="kicker">${kicker}</div>
      <h1>${title}</h1>
      <p>${text}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/category/led/">مشاهده هدلایت‌ها</a>
        <a class="btn btn-ghost" href="tel:+989174450040">مشاوره تلفنی</a>
      </div>
    </div><div class="hero-visual" aria-hidden="true"><img src="${image}" alt="${esc(alt)}"></div></div>`;
}

function renderHome(site, catalog, files) {
  const led = catalog.products.filter((product) => product.category === "led" && !product.example);
  const monitors = catalog.products.filter((product) => product.category === "monitor");
  const cross = catalog.products.filter((product) => (product.fitment?.toyota || []).some((row) => row.model === "corolla-cross") && !product.example);
  const tiles = [
    ["led", "هدلایت LED", "/images/products/eglxen-d45-studio.jpg"],
    ["xenon", "زنون و سوکت D", "/images/products/xenon-hid-2.jpg"],
    ["monitor", "مانیتور خودرو", "/images/products/monitor-ts18.jpg"],
    ["camera", "دوربین", "/images/products/cc-dashcam.jpg"],
    ["parking", "سنسور پارک", "/images/products/parking-ors3313.jpg"],
    ["safety", "ایمنی", "/images/products/blind-spot-sensors.jpg"],
    ["comfort", "آینه و صندوق", "/images/products/cc-power-fold.jpg"],
    ["projector", "لنز پروژکتور", "/images/products/projector-lens.jpg"],
  ];
  const main = `
    <section class="hero hero-slider">
      <input type="radio" name="hero" id="h1" checked>
      <input type="radio" name="hero" id="h2">
      <input type="radio" name="hero" id="h3">
      <div class="hero-track">
        ${heroSlide("EGLXEN D Series", `نور بهتر، با انتخاب <span class="red">سوکت</span>`, "سری D اگلزن، از مدل D45 تا D150. برای هر خودرویی که سوکت لامپش جور باشد، نه فقط تویوتا.", "/images/hero/eglxen-d-series-studio.jpg", "جعبه EGLXEN سری D")}
        ${heroSlide("مدل D45", "درایور دوگانه و فن پرسرعت", "طرح نقره‌ای EGLXEN. سوکت‌های موجود و ناموجود روی کارت کالا مشخص است.", "/images/products/eglxen-d45-studio.jpg", "هدلایت EGLXEN مدل D45")}
        ${heroSlide("مدل D65", "دمای ثابت، روشن‌شدن سریع", "طرح خاکستری EGLXEN با توان ۶۵ وات. سوکت H4 این مدل ناموجود است.", "/images/products/eglxen-d65-studio.jpg", "هدلایت EGLXEN مدل D65")}
      </div>
      <div class="hero-dots"><label for="h1"></label><label for="h2"></label><label for="h3"></label></div>
    </section>
    <div class="wrap"><div class="trust">
      <article><strong>قیمت با یک تماس</strong><span>استعلام سریع، بدون پرداخت آنلاین</span></article>
      <article><strong>انتخاب سوکت درست</strong><span>قبل از ارسال، سوکت را چک می‌کنیم</span></article>
      <article><strong>ارسال به سراسر ایران</strong><span>از لامرد</span></article>
      <article><strong>مشاوره تلفنی</strong><span>${esc(site.phoneDisplay)}</span></article>
    </div></div>
    <section class="section"><div class="wrap">
      <div class="section-head"><h2>دسته‌ها</h2><a class="link" href="/shop/">همه کالاها</a></div>
      <div class="tile-grid">${tiles
        .map(([id, name, src]) => {
          const category = categoryById(catalog, id);
          const image = files && !files.has(src) ? "" : src;
          return `<a class="tile" href="/category/${id}/"><div class="frame">${image ? `<img src="${image}" alt="">` : ""}</div><div><strong>${name}</strong><span class="muted">${esc(category ? category.blurb : "")}</span></div></a>`;
        })
        .join("")}</div>
    </div></section>
    <section class="section" id="sockets"><div class="wrap">
      <div class="section-head"><div><h2>سوکت لامپ را انتخاب کنید</h2><p>هدلایت محدود به تویوتا نیست. کد سوکت را از روی لامپ فابریک بخوانید.</p></div></div>
      <div class="socket-grid">${catalog.sockets.map((socket) => `<a href="/socket/${esc(socket.id)}/">${esc(socket.label)}</a>`).join("")}</div>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="section-head"><h2>سری هدلایت EGLXEN</h2><a class="link" href="/category/led/">مشاهده دسته</a></div>
      <div class="carousel">${led.map((product) => productCard(product, catalog, files)).join("")}</div>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="section-head"><h2>مانیتور خودرو</h2><a class="link" href="/category/monitor/">مشاهده دسته</a></div>
      <div class="carousel">${monitors.map((product) => productCard(product, catalog, files)).join("")}</div>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="section-head"><h2>لوازم کرولا کراس</h2><a class="link" href="/model/corolla-cross/">مدل کرولا کراس</a></div>
      <div class="carousel">${cross.map((product) => productCard(product, catalog, files)).join("")}</div>
    </div></section>
    <section class="section"><div class="wrap"><div class="compare">
      <h2>مقایسه سری D اگلزن</h2>
      <p>توان، روشنایی و سوکت‌های آماده ارسال.</p>
      <table>
        <thead><tr><th>مدل</th><th>توان</th><th>روشنایی</th><th>سوکت موجود</th></tr></thead>
        <tbody>
          <tr><td><a href="/product/eglxen-d45/">D45</a></td><td>۶۰ وات</td><td>۱۱۰۰۰ لومن</td><td>H7، 9005، H4</td></tr>
          <tr><td><a href="/product/eglxen-d55/">D55</a></td><td>۵۵ وات</td><td>—</td><td>H7، H1، H11، 9005، H4</td></tr>
          <tr><td><a href="/product/eglxen-d65/">D65</a></td><td>۶۵ وات</td><td>—</td><td>H7، H1، H11، 9005</td></tr>
          <tr><td><a href="/product/eglxen-d90/">D90</a></td><td>۹۰ وات</td><td>—</td><td>H7، H1، H11، 9005، H4</td></tr>
          <tr><td><a href="/product/eglxen-d150/">D150</a></td><td>۱۰۰ وات</td><td>—</td><td>H7، H1، H11، H4</td></tr>
        </tbody>
      </table>
    </div></div></section>
    <section class="section" id="models"><div class="wrap">
      <div class="section-head"><div><h2>Choose Your Toyota</h2><p>برای قطعاتی که سازگاری تویوتا دارند. هدلایت با این انتخاب حذف نمی‌شود.</p></div></div>
      <div class="model-grid">${catalog.models
        .map((model) => `<a href="/model/${esc(model.id)}/"><strong>${esc(model.name)}</strong><span>${esc(model.nameFa)}</span></a>`)
        .join("")}</div>
    </div></section>
    <section class="section"><div class="wrap faq">
      <h2>پرسش‌های رایج</h2>
      ${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
    </div></section>`;
  return layout({
    site,
    catalog,
    title: `${site.name} | هدلایت، مانیتور و قطعات خودرو`,
    description: site.description,
    path: "/",
    json: { "@context": "https://schema.org", "@graph": [businessJson(site), { "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }] },
    main,
  });
}

function renderShop(site, catalog, files) {
  return listing(site, catalog, files, {
    title: "فروشگاه",
    description: "همه کالاها. قیمت با استعلام و شماره " + site.phoneDisplay,
    path: "/shop/",
    crumbs: `<a href="/">خانه</a> / فروشگاه`,
    products: catalog.products,
  });
}

function renderCategory(site, catalog, files, category) {
  return listing(site, catalog, files, {
    title: category.name,
    description: category.blurb,
    path: `/category/${category.id}/`,
    crumbs: `<a href="/">خانه</a> / <a href="/shop/">فروشگاه</a> / ${esc(category.name)}`,
    products: catalog.products.filter((product) => product.category === category.id),
  });
}

function renderModel(site, catalog, files, model) {
  return listing(site, catalog, files, {
    title: model.name,
    description: `قطعات ${model.nameFa} به همراه کالاهای عمومی`,
    path: `/model/${model.id}/`,
    crumbs: `<a href="/">خانه</a> / ${esc(model.name)}`,
    products: catalog.products.filter((product) => {
      if (product.fitment?.scope === "socket" || product.fitment?.scope === "universal") return true;
      return (product.fitment?.toyota || []).some((row) => row.model === model.id);
    }),
  });
}

function renderSocket(site, catalog, files, socket) {
  return listing(site, catalog, files, {
    title: `سوکت ${socket.label}`,
    description: `کالاهای سوکت ${socket.label}`,
    path: `/socket/${socket.id}/`,
    crumbs: `<a href="/">خانه</a> / <a href="/#sockets">سوکت</a> / ${esc(socket.label)}`,
    products: catalog.products.filter((product) => (product.variants || []).some((variant) => variant.socket === socket.id)),
  });
}

function gallery(product, images) {
  if (!images.length) return `<div class="zoom"><span class="fallback">${esc(product.title)}</span></div>`;
  const radios = images.map((_, index) => `<input type="radio" name="gal" id="g${index}" ${index === 0 ? "checked" : ""}>`).join("");
  const slides = images
    .map(
      (image) => `<figure><button class="zoom" type="button" data-zoom="${esc(image.src)}" aria-label="بزرگ‌نمایی"><img src="${esc(image.src)}" alt="${esc(image.alt || product.title)}"></button></figure>`
    )
    .join("");
  const thumbs = images.map((image, index) => `<label for="g${index}"><img src="${esc(image.src)}" alt=""></label>`).join("");
  return `<div class="gallery">${radios}<div class="slides">${slides}</div><div class="thumbs">${thumbs}</div></div>`;
}

function variantFields(product) {
  const options = (product.options || [])
    .map(
      (option) => `<label>${esc(option.label)}<select name="option-${esc(option.id)}">${option.choices
        .map((choice) => `<option>${esc(choice)}</option>`)
        .join("")}</select></label>`
    )
    .join("");
  return options;
}

function d45Features() {
  return `<div class="features">
    <article><strong>۱۱٬۰۰۰ لومن</strong><span>روشنایی</span></article>
    <article><strong>۶۰ وات توان</strong><span>هر لامپ</span></article>
    <article><strong>فن ۱۲٬۰۰۰ دور</strong><span>خنک‌کاری</span></article>
    <article><strong>درایور دوگانه</strong><span>روشن‌شدن پایدار</span></article>
    <article><strong>کن‌باس</strong><span>نصب روی خودروهای جدید</span></article>
  </div>`;
}

function socketPills(product) {
  const variants = variantList(product);
  if (!variants.length) return "";
  return `<div class="socket-pills">${variants
    .map((variant, index) => {
      const name = variant.socket || variant.label;
      return `<label class="avail-pill ${variant.available ? "is-on" : "is-off"}">
        <input type="radio" name="variant" value="${esc(name)}" ${index === 0 ? "checked" : ""}>
        <span>${esc(name)}</span>
        <small>${variant.available ? "موجود" : "ناموجود"}</small>
      </label>`;
    })
    .join("")}</div>`;
}

function renderProduct(site, catalog, files, product) {
  const images = usableImages(product, files);
  const category = categoryById(catalog, product.category);
  const coming = isComingSoon(product);
  const formName = coming ? "interest" : "inquiry";
  const variants = variantList(product);
  const toyota = (product.fitment?.toyota || [])
    .map((row) => {
      const model = modelById(catalog, row.model);
      const also = row.also?.length ? ` / ${row.also.join(" / ")}` : "";
      return `${model ? model.name : row.model}${also} ${faNum(row.yearFrom)}–${faNum(row.yearTo)}`;
    })
    .join("، ");
  const specs = (product.specs || []).map((row) => `<div><dt>${esc(row.label)}</dt><dd>${esc(row.value)}</dd></div>`).join("");
  const related = relatedProducts(catalog, product);
  const phone = `<a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a>`;
  const main = `<article class="wrap page product">
    <p class="crumbs"><a href="/">خانه</a> / <a href="/category/${esc(product.category)}/">${esc(category ? category.name : "")}</a> / ${esc(product.title)}</p>
    <div class="product-layout">
      ${gallery(product, images)}
      <div class="buy">
        ${statusBadge(product)}
        <h1>${esc(product.title)}</h1>
        ${product.wattage ? `<p class="chip">${esc(product.wattage)}</p>` : ""}
        <p>${esc(product.shortDescription || "")}</p>
        ${product.id === "led-d45" ? d45Features() : ""}
        <div class="inquiry-card" id="inquiry">
          <div class="inquiry-actions">
            <a class="btn btn-primary btn-xl" href="tel:+${site.phoneIntl}">${coming ? "خبرم کن" : "استعلام قیمت"}</a>
            <a class="btn btn-wa btn-xl" href="${esc(waLink(site.phoneIntl, waText(site, product)))}">واتساپ</a>
          </div>
          <form class="stack-form" name="${formName}" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="${formName}">
            ${honeypot()}
            <input type="hidden" name="product" value="${esc(product.title)}">
            <input type="hidden" name="sku" value="${esc(product.sku)}">
            ${socketPills(product)}
            ${variantFields(product)}
            <label>نام <input name="full-name" required autocomplete="name"></label>
            <label>موبایل <input name="phone" required inputmode="tel" dir="ltr"></label>
            <label>پیام <textarea name="message" rows="3" placeholder="مدل خودرو یا سؤال"></textarea></label>
            <button class="btn btn-line" type="submit">ارسال درخواست</button>
          </form>
          <p class="muted">${esc(site.stockNote)} تماس ${phone}</p>
        </div>
      </div>
    </div>
    <div class="tabs">
      <input type="radio" name="tab" id="tab1" checked>
      <input type="radio" name="tab" id="tab2">
      <input type="radio" name="tab" id="tab3">
      <input type="radio" name="tab" id="tab4">
      <div class="tab-nav"><label for="tab1">توضیحات</label><label for="tab2">مشخصات</label><label for="tab3">نصب</label><label for="tab4">پرسش</label></div>
      <div class="tab-panels">
        <div class="p1">${paragraphs(product.description)}${product.fitment?.note ? `<p>${esc(product.fitment.note)}</p>` : ""}${toyota ? `<p>مناسب برای ${esc(toyota)}</p>` : ""}</div>
        <div class="p2">${specs ? `<dl class="specs">${specs}</dl>` : "<p>جزئیات بیشتر را از فروشگاه بپرسید.</p>"}</div>
        <div class="p3"><p>سوکت لامپ فابریک یا مدل خودرو را موقع سفارش بگویید تا قطعه درست برایتان کنار گذاشته شود. اگر به سیم‌کشی خودرو آشنا نیستید، نصب را به برق‌کار بسپارید. برای راهنمایی با ${phone} تماس بگیرید.</p></div>
        <div class="p4">${faqs.map(([q, a]) => `<p><strong>${esc(q)}</strong><br>${esc(a)}</p>`).join("")}</div>
      </div>
    </div>
    ${related.length ? `<h2>کالاهای مرتبط</h2><div class="product-grid">${related.map((item) => productCard(item, catalog, files)).join("")}</div>` : ""}
    <div class="sticky-buy">
      <a class="btn btn-primary" href="#inquiry">${coming ? "خبرم کن" : "استعلام قیمت"}</a>
      <a class="btn btn-wa" href="${esc(waLink(site.phoneIntl, waText(site, product)))}">واتساپ</a>
    </div>
  </article>`;
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
  return layout({
    site,
    catalog,
    product,
    title: product.title,
    description: product.shortDescription,
    path: `/product/${product.slug}/`,
    json: productLd,
    main,
  });
}

function renderContact(site, catalog) {
  const main = `<section class="wrap page narrow">
    <h1>تماس</h1>
    <p>${esc(site.address)}</p>
    <p>استعلام و سفارش: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
    <p><a class="btn btn-wa" href="${esc(waLink(site.phoneIntl, waText(site)))}">واتساپ</a></p>
    <p class="muted">${esc(site.stockNote)}</p>
    <form class="stack-form panel" name="message" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field" style="padding:16px">
      <input type="hidden" name="form-name" value="message">${honeypot()}
      <label>نام <input name="full-name" required></label>
      <label>موبایل <input name="phone" required inputmode="tel" dir="ltr"></label>
      <label>پیام <textarea name="message" required rows="5"></textarea></label>
      <button class="btn btn-primary" type="submit">ارسال پیام</button>
    </form>
  </section>`;
  return layout({ site, catalog, title: "تماس با تویوتا کلاب ایران", description: `${site.address}، تلفن ${site.phone}`, path: "/contact/", json: { "@context": "https://schema.org", ...businessJson(site) }, main });
}

function renderRequest(site, intent, catalog) {
  const wholesale = intent === "wholesale";
  const path = wholesale ? "/wholesale/" : "/request/";
  const main = `<section class="wrap page narrow">
    <h1>${wholesale ? "درخواست همکاری" : "درخواست قطعه"}</h1>
    <p>${wholesale ? "برای همکاری عمده پیام بگذارید." : "اگر قطعه را در فروشگاه ندیدید، مدل خودرو و شرح آن را بنویسید."}</p>
    <p>تلفن: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
    <form class="stack-form panel" name="part-request" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field" style="padding:16px">
      <input type="hidden" name="form-name" value="part-request">
      <input type="hidden" name="intent" value="${wholesale ? "wholesale" : "part"}">
      ${honeypot()}
      <label>نام <input name="full-name" required></label>
      <label>موبایل <input name="phone" required inputmode="tel" dir="ltr"></label>
      <label>برند خودرو <input name="car-brand" placeholder="مثلاً تویوتا، پژو، کیا"></label>
      <label>مدل <input name="car-model"></label>
      <label>سال <input name="year" inputmode="numeric"></label>
      <label>سوکت لامپ <input name="socket" placeholder="H7"></label>
      <label>شرح <textarea name="message" required rows="5"></textarea></label>
      <button class="btn btn-primary" type="submit">ثبت درخواست</button>
    </form>
  </section>`;
  return layout({ site, catalog, title: wholesale ? "همکاری تجاری" : "درخواست قطعه", description: "ثبت درخواست", path, main });
}

function renderCart(site, catalog) {
  const main = `<section class="wrap page narrow">
    <h1>سبد خرید</h1>
    <p>تا وقتی قیمت‌ها روی سایت منتشر نشده، سبد و پرداخت نمایش داده نمی‌شود. سفارش را با استعلام قیمت ثبت کنید.</p>
    <p>تلفن استعلام: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
    <p><a class="btn btn-primary" href="/shop/">بازگشت به فروشگاه</a> <a class="btn btn-line" href="/checkout/">ثبت درخواست سفارش</a></p>
  </section>`;
  return layout({ site, catalog, title: "سبد خرید", description: "سبد خرید", path: "/cart/", robots: "noindex", main });
}

function renderCheckout(site, catalog) {
  const main = `<section class="wrap page narrow">
    <h1>ثبت سفارش</h1>
    <p>قیمت‌ها هنوز روی سایت نیست. این فرم درخواست سفارش است و پرداخت آنلاین بعد از اعلام قیمت فعال می‌شود. درگاه زرین‌پال یا آیدی‌پی از تنظیمات محیط وصل می‌شود و الان اطلاعات ورود ندارد.</p>
    <p>هماهنگی فوری: <a href="tel:+${site.phoneIntl}">${esc(site.phoneDisplay)}</a></p>
    <form class="stack-form panel" name="order" method="POST" action="/thanks/" data-netlify="true" netlify-honeypot="bot-field" style="padding:16px">
      <input type="hidden" name="form-name" value="order">${honeypot()}
      <input type="hidden" name="items" id="order-items" value="">
      <label>نام <input name="full-name" required autocomplete="name"></label>
      <label>موبایل <input name="phone" required inputmode="tel" dir="ltr"></label>
      <label>شهر <input name="city"></label>
      <label>آدرس <textarea name="address" rows="3"></textarea></label>
      <label>شرح کالاها <textarea name="message" required rows="4" placeholder="نام کالا، سوکت یا حافظه، تعداد"></textarea></label>
      <button class="btn btn-primary" type="submit">ثبت درخواست سفارش</button>
    </form>
  </section>`;
  return layout({ site, catalog, title: "ثبت سفارش", description: "ثبت درخواست سفارش", path: "/checkout/", robots: "noindex", main });
}

function renderThanks(site, catalog) {
  const main = `<section class="wrap page narrow"><h1>پیام شما ثبت شد</h1><p>فروشگاه در ${esc(site.address)} آن را می‌بیند. برای پیگیری با ${esc(site.phoneDisplay)} تماس بگیرید.</p><a class="btn btn-primary" href="/">بازگشت به خانه</a></section>`;
  return layout({ site, catalog, title: "ثبت شد", description: "پیام ثبت شد", path: "/thanks/", robots: "noindex", main });
}

function renderNotFound(site, catalog) {
  const main = `<section class="wrap page narrow"><h1>این صفحه پیدا نشد</h1><p><a href="/shop/">رفتن به فروشگاه</a></p></section>`;
  return layout({ site, catalog, title: "صفحه پیدا نشد", description: "صفحه پیدا نشد", path: "/404.html", robots: "noindex", main });
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
