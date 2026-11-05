const { esc, faNum, paragraphs, jsonLd, waLink } = require("./format");
const { variantList, isComingSoon, categoryById, modelById, relatedProducts, productIsAvailable } = require("./catalog-tools");

function usableImages(product, files) {
  return (product.images || []).filter((image) => image.src && (!files || files.has(image.src)));
}

function productImages(product, files) {
  const listed = (product.images || []).filter((image) => image && image.src && (!files || files.has(image.src)));
  // One main photo drives the card AND the detail page, even without a gallery.
  if (product.image && (!files || files.has(product.image))) {
    const existing = listed.findIndex((image) => image.src === product.image);
    if (existing >= 0) listed.splice(existing, 1);
    listed.unshift({ src: product.image, alt: product.title, caption: "" });
  }
  if (listed.length) {
    return listed.map((image) => ({ src: image.src, alt: image.alt || product.title, caption: image.caption || "" }));
  }
  if (files && product.slug) {
    const prefix = `/images/products/${product.slug}/`;
    const found = [...files]
      .filter((file) => file.startsWith(prefix) && /^\d+\.(jpe?g|png|webp)$/i.test(file.slice(prefix.length)))
      .sort((a, b) => Number(a.match(/(\d+)\./)[1]) - Number(b.match(/(\d+)\./)[1]));
    if (found.length) return found.map((src) => ({ src, alt: product.title, caption: "" }));
  }
  return usableImages(product, files);
}

const ICONS = {
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M16.2 16.2 20.5 20.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  cart: '<svg viewBox="0 0 24 24"><path d="M6 7h15l-1.4 8.2a1 1 0 0 1-1 .8H8.2a1 1 0 0 1-1-.8L5.2 4H3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="20" r="1.2" fill="currentColor"/><circle cx="18" cy="20" r="1.2" fill="currentColor"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M8 3.5h2.2l1.2 3.2-1.6 1a12 12 0 0 0 6.5 6.5l1-1.6 3.2 1.2V16a2 2 0 0 1-2.2 2A14.5 14.5 0 0 1 6 6.7 2 2 0 0 1 8 3.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  wa: '<svg viewBox="0 0 24 24"><path d="M12 3.5a8.2 8.2 0 0 0-7.1 12.2L4 20.5l4.9-.9A8.2 8.2 0 1 0 12 3.5Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9.2 8.6c.2 1.6 1.6 3.1 3.2 3.6l.7-.7c.2-.2.5-.2.7 0l1 .5c.2.1.3.4.2.6-.2.6-.7 1.2-1.4 1.3-2.2.2-5.4-2.4-5.8-4.6-.1-.6.3-1.2.9-1.4.2-.1.5 0 .6.2l.5 1c.1.2 0 .4-.2.5l-.4.4Z" fill="currentColor"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  grid: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 14a5.5 5.5 0 1 1 8 0c-.7.7-1.2 1.5-1.4 2.4H9.4C9.2 15.5 8.7 14.7 8 14Z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><path d="M3 7h11v8H3V7Zm11 3h4l3 3v2h-7v-5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="7" cy="17.5" r="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="17.5" r="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 3 19 6v6c0 4.2-2.8 7-7 9-4.2-2-7-4.8-7-9V6l7-3Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M5 6.5h14v9H8l-3 2.5v-11.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
};
function icon(name) {
  return `<span class="ico">${ICONS[name] || ""}</span>`;
}
function picture(base, widths, sizes, alt, ratio = 9 / 16, loading = "lazy") {
  const stem = base.replace(/\.(jpe?g|png)$/i, "");
  if (!/\.(jpe?g|png)$/i.test(base)) return `<img src="${esc(base)}" alt="${esc(alt)}" loading="${loading}">`;
  const srcset = widths.map((w) => `${stem}-${w}.webp ${w}w`).join(", ");
  const w = widths[widths.length - 1];
  return `<picture><source type="image/webp" srcset="${srcset}" sizes="${sizes}"><img src="${esc(base)}" alt="${esc(alt)}" width="${w}" height="${Math.round(w * ratio)}" loading="${loading}" decoding="async"></picture>`;
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
<body class="${opts.bodyClass || ""}" data-prices="${site.showPrices ? "on" : "off"}">
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
        <span class="search-ico">${icon("search")}</span>
        <input id="q" data-search-input name="q" type="search" placeholder="جستجو" autocomplete="off">
        <div class="suggest" data-suggest hidden></div>
      </form>
      <div class="header-tools">
        <a class="cart-link" href="/cart/" aria-label="سبد خرید"><span class="cart-count">۰</span>${icon("cart")}</a>
        <details class="drawer">
          <summary class="icon-btn" aria-label="منو">${icon("menu")}</summary>
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
    <a href="/"${current("/")}>${icon("home")}<span>خانه</span></a>
    <a href="/shop/"${current("/shop/")}>${icon("grid")}<span>فروشگاه</span></a>
    <a href="/category/led/"${current("/category/led/")}>${icon("bulb")}<span>هدلایت</span></a>
    <a href="/cart/"${current("/cart/")}>${icon("cart")}<span>سبد</span></a>
    <a href="/contact/"${current("/contact/")}>${icon("phone")}<span>تماس</span></a>
  </nav>
  <a class="wa-float" href="${esc(waLink(site.phoneIntl, waText(site, product)))}" target="_blank" rel="noopener">${icon("wa")}<span>واتساپ</span></a>
  <details class="chat-float">
    <summary>${icon("chat")}<span>پیام</span></summary>
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

function productImg(src, alt, className, sizes) {
  const match = String(src).match(/^(\/images\/products\/.+)\.(jpe?g|png)$/i);
  const cls = className ? ` class="${className}"` : "";
  const img = `<img${cls} src="${esc(src)}" alt="${esc(alt)}">`;
  if (!match) return img;
  const srcset = [640, 1200].map((w) => `${match[1]}-${w}.webp ${w}w`).join(", ");
  return `<picture><source type="image/webp" srcset="${srcset}" sizes="${sizes}">${img}</picture>`;
}

function cardSrc(src) {
  const match = String(src).match(/^(\/images\/products\/.+)\.(jpe?g|png)$/i);
  if (!match) return src;
  return `${match[1]}-640.webp`;
}

function cardImg(src, alt, className, eager) {
  const priority = eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy" fetchpriority="low"';
  return `<img class="${className}" src="${esc(cardSrc(src))}" alt="${esc(alt)}" width="640" height="640"${priority} decoding="async">`;
}

function frame(images, alt, eager) {
  if (!images.length) return `<span class="fallback">${esc(alt)}</span>`;
  const second = images[1] ? cardImg(images[1].src, "", "alt", false) : "";
  return `${cardImg(images[0].src, images[0].alt || alt, "main", eager)}${second}`;
}

function memoryIds(product) {
  return (product.variants || []).map((item) => item.id).filter((id) => ["2-32", "3-32", "4-64", "6-128"].includes(id));
}

function simModes(product) {
  const option = (product.options || []).find((item) => item.id === "sim");
  if (option) {
    const modes = [];
    option.choices.forEach((choice) => {
      const text = typeof choice === "string" ? choice : choice.choice;
      if (/بدون/.test(text)) modes.push("no");
      else if (/4G/.test(text)) modes.push("yes");
    });
    return [...new Set(modes)];
  }
  const text = (product.specs || []).map((row) => `${row.label} ${row.value}`).join(" ");
  if (/4G/.test(text) && !/بدون/.test(text)) return ["yes"];
  return [];
}

function productCard(product, catalog, files, eager) {
  const images = productImages(product, files);
  const variants = variantList(product);
  const sockets = variants.map((item) => item.socket).filter(Boolean);
  const open = variants.filter((item) => item.available).map((item) => item.socket || item.label);
  const chips = [
    product.wattage ? `<span class="chip">${esc(product.wattage)}</span>` : "",
    ...open.slice(0, 3).map((name) => `<span class="chip">${esc(name)}</span>`),
  ].join("");
  const search = esc(`${product.title} ${product.shortDescription || ""} ${product.sku} ${sockets.join(" ")}`.toLowerCase());
  const wa = `https://wa.me/989174450040?text=${encodeURIComponent(waText({ phoneIntl: "989174450040" }, product))}`;
  return `<article class="card" data-search="${search}" data-sockets="${esc(sockets.join(" "))}" data-memory="${esc(memoryIds(product).join(" "))}" data-sim="${esc(simModes(product).join(" "))}" data-watt="${esc(wattNumber(product))}" data-status="${statusKey(product)}">
    <a class="card-media" href="/product/${esc(product.slug)}/">${frame(images, product.title, eager)}</a>
    <div class="card-body">
      <div>${statusBadge(product)}</div>
      <h3><a href="/product/${esc(product.slug)}/">${esc(product.title)}</a></h3>
      <div class="chips">${chips}</div>
      <div class="card-actions">
        <a class="btn btn-primary" href="/product/${esc(product.slug)}/#inquiry">استعلام قیمت</a>
        <a class="btn btn-wa" href="${esc(wa)}" aria-label="واتساپ">${icon("wa")}</a>
      </div>
    </div>
  </article>`;
}

function cardGrid(products, catalog, files) {
  if (!products.length) return `<p class="empty">کالایی با این فیلتر پیدا نشد. <a href="/request/">درخواست قطعه</a> را ثبت کنید.</p>`;
  return `<div class="product-grid">${products.map((product, index) => productCard(product, catalog, files, index < 4)).join("")}</div>`;
}

function filters(catalog, products) {
  const usedSockets = new Set(products.flatMap((product) => (product.variants || []).map((item) => item.socket).filter(Boolean)));
  const usedWatts = new Set(products.map((product) => wattNumber(product)).filter(Boolean));
  const usedMemory = new Set(products.flatMap(memoryIds));
  const usedSim = new Set(products.flatMap(simModes));
  const usedStatus = new Set(products.map(statusKey).filter((key) => key !== "sample"));
  const blocks = [];
  const sockets = catalog.sockets.filter((socket) => usedSockets.has(socket.id));
  if (sockets.length) {
    blocks.push(`<div class="filter-block"><strong>سوکت</strong>${sockets
      .map((socket) => `<label><input type="checkbox" data-filter="socket" value="${esc(socket.id)}"> ${esc(socket.label)}</label>`)
      .join("")}</div>`);
  }
  const watts = [...usedWatts].sort((a, b) => Number(a) - Number(b));
  if (watts.length) {
    blocks.push(`<div class="filter-block"><strong>توان</strong>${watts
      .map((watt) => `<label><input type="checkbox" data-filter="watt" value="${watt}"> ${faNum(Number(watt))} وات</label>`)
      .join("")}</div>`);
  }
  const memories = [
    ["2-32", "۲ + ۳۲"],
    ["3-32", "۳ + ۳۲"],
    ["4-64", "۴ + ۶۴"],
    ["6-128", "۶ + ۱۲۸"],
  ].filter(([id]) => usedMemory.has(id));
  if (memories.length) {
    blocks.push(`<div class="filter-block"><strong>حافظه</strong>${memories
      .map(([id, label]) => `<label><input type="checkbox" data-filter="memory" value="${id}"> ${label}</label>`)
      .join("")}</div>`);
  }
  const sims = [
    ["yes", "با سیم‌کارت 4G"],
    ["no", "بدون سیم‌کارت 4G"],
  ].filter(([id]) => usedSim.has(id));
  if (sims.length) {
    blocks.push(`<div class="filter-block"><strong>سیم‌کارت 4G</strong>${sims
      .map(([id, label]) => `<label><input type="checkbox" data-filter="sim" value="${id}"> ${label}</label>`)
      .join("")}</div>`);
  }
  const statuses = [
    ["available", "موجود"],
    ["unavailable", "ناموجود"],
    ["soon", "به‌زودی"],
  ].filter(([id]) => usedStatus.has(id));
  if (statuses.length) {
    blocks.push(`<div class="filter-block"><strong>وضعیت</strong>${statuses
      .map(([id, label]) => `<label><input type="checkbox" data-filter="status" value="${id}"> ${label}</label>`)
      .join("")}</div>`);
  }
  if (!blocks.length) return "";
  return `<details class="filters">
    <summary>فیلتر</summary>
    ${blocks.join("")}
  </details>
  <script>if (matchMedia("(min-width: 900px)").matches) document.currentScript.previousElementSibling.open = true;</script>`;
}

function listing(site, catalog, files, { title, description, path, crumbs, products }) {
  const main = `<div class="wrap page">
    <p class="crumbs">${crumbs}</p>
    <div class="section-head"><div><h1>${esc(title)}</h1><p>${esc(description || "")}</p></div></div>
    <div class="catalog" data-catalog>
      ${filters(catalog, products)}
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

function heroTitle(slide) {
  const title = esc(slide.title || "");
  if (!slide.highlight) return title;
  return title.replace(esc(slide.highlight), `<span class="red">${esc(slide.highlight)}</span>`);
}

function heroSlide({ kicker, title, text, href, cta, base, alt, strong, loading }) {
  return `<div class="hero-slide${strong ? " shade-strong" : ""}">
    <div class="hero-visual">${picture(base, [768, 1280], "100vw", alt, 9 / 16, loading || "lazy")}</div>
    <div class="hero-copy">
      <div class="kicker">${kicker}</div>
      <h1>${title}</h1>
      <p>${text}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${href}">${cta}</a>
        <a class="btn btn-ghost" href="tel:+989174450040">${icon("phone")} مشاوره تلفنی</a>
      </div>
    </div>
  </div>`;
}

function bannerTile(href, name, blurb, base) {
  return `<a class="tile cine" href="${href}">
    <div class="frame">${picture(base, [480, 800], "(min-width: 900px) 24vw, 46vw", name, 0.75)}</div>
    <div class="tile-copy"><strong>${esc(name)}</strong><span>${esc(blurb)}</span></div>
  </a>`;
}

function photoTile(href, name, blurb, src) {
  return `<a class="tile cine photo" href="${href}">
    <div class="frame">${src.startsWith("/images/products/") ? productImg(src, name, "", "(min-width: 900px) 24vw, 46vw") : picture(src, [480, 800], "(min-width: 900px) 24vw, 46vw", name, 0.75)}</div>
    <div class="tile-copy"><strong>${esc(name)}</strong><span>${esc(blurb)}</span></div>
  </a>`;
}

function renderHome(site, catalog, files) {
  const home = catalog.home;
  const faqs = catalog.faqs;
  const led = catalog.products.filter((product) => product.category === "led" && !product.example);
  const monitors = catalog.products.filter((product) => product.category === "monitor");
  const cross = catalog.products.filter((product) => (product.fitment?.toyota || []).some((row) => row.model === "corolla-cross") && !product.example);
  const main = `
    <section class="hero hero-slider">
      <input type="radio" name="hero" id="h1" checked>
      <input type="radio" name="hero" id="h2">
      <input type="radio" name="hero" id="h3">
      <div class="hero-track">
        ${home.slides
          .map((slide, index) =>
            heroSlide({
              kicker: esc(slide.kicker),
              title: heroTitle(slide),
              text: esc(slide.text),
              href: slide.href,
              cta: esc(slide.cta),
              base: slide.image,
              alt: slide.alt,
              strong: Boolean(slide.strong),
              loading: index === 0 ? "eager" : "lazy",
            })
          )
          .join("")}
      </div>
      <div class="hero-dots">${home.slides.map((_, index) => `<label for="h${index + 1}"></label>`).join("")}</div>
    </section>
    <div class="wrap"><div class="trust reveal">
      ${home.trust
        .map((item) => {
          const text = item.icon === "phone" && !item.text ? site.phoneDisplay : item.text;
          return `<article>${icon(item.icon)}<div><strong>${esc(item.title)}</strong><span>${esc(text)}</span></div></article>`;
        })
        .join("")}
    </div></div>
    <section class="section reveal"><div class="wrap">
      <div class="section-head"><h2>${esc(home.sections.categories)}</h2><a class="link" href="/shop/">${esc(home.sections.categoriesLink)}</a></div>
      <div class="tile-grid">
        ${home.tiles
          .map((tile) => (tile.photo ? photoTile(tile.href, tile.name, tile.blurb, tile.image) : bannerTile(tile.href, tile.name, tile.blurb, tile.image)))
          .join("")}
      </div>
    </div></section>
    <section class="section reveal" id="compare-light"><div class="wrap ba-layout">
      <div>
        <p class="kicker">${esc(home.comparison.kicker)}</p>
        <h2>${esc(home.comparison.title)}</h2>
        <p>${esc(home.comparison.text)}</p>
      </div>
      <div class="ba" data-ba>
        <img class="ba-after" src="${esc(home.comparison.after)}" alt="نور LED روی جاده" width="800" height="900">
        <div class="ba-before"><img src="${esc(home.comparison.before)}" alt="نور هالوژن روی جاده" width="800" height="900"></div>
        <span class="ba-tag ba-tag-before">هالوژن</span>
        <span class="ba-tag ba-tag-after">LED</span>
        <button class="ba-handle" type="button" aria-label="کشیدن جداکننده هالوژن و LED"></button>
      </div>
    </div></section>
    <section class="section reveal" id="sockets"><div class="wrap">
      <div class="section-head"><div><h2>${esc(home.sections.socketsTitle)}</h2><p>${esc(home.sections.socketsText)}</p></div></div>
      <div class="socket-row">${catalog.sockets.map((socket) => `<a href="/socket/${esc(socket.id)}/">${esc(socket.label)}</a>`).join("")}</div>
    </div></section>
    <section class="section reveal"><div class="wrap">
      <div class="section-head"><h2>${esc(home.sections.ledTitle)}</h2><a class="link" href="/category/led/">${esc(home.sections.ledLink)}</a></div>
      <div class="carousel">${led.map((product) => productCard(product, catalog, files)).join("")}</div>
    </div></section>
    <section class="section reveal"><div class="wrap">
      <div class="section-head"><h2>${esc(home.sections.monitorsTitle)}</h2><a class="link" href="/category/monitor/">${esc(home.sections.monitorsLink)}</a></div>
      <div class="carousel">${monitors.map((product) => productCard(product, catalog, files)).join("")}</div>
    </div></section>
    <section class="section reveal"><div class="wrap">
      <div class="section-head"><h2>${esc(home.sections.crossTitle)}</h2><a class="link" href="/model/corolla-cross/">${esc(home.sections.crossLink)}</a></div>
      <div class="carousel">${cross.map((product) => productCard(product, catalog, files)).join("")}</div>
    </div></section>
    <section class="section reveal"><div class="wrap"><div class="compare">
      <h2>${esc(home.sections.compareTitle)}</h2>
      <p>${esc(home.sections.compareText)}</p>
      <div class="table-scroll"><table>
        <thead><tr><th>مدل</th><th>توان</th><th>سوکت موجود</th></tr></thead>
        <tbody>
          ${home.compare
            .map(
              (row) =>
                `<tr><td><a href="${esc(row.href)}">${esc(row.model)}</a></td><td>${esc(catalog.products.find((p) => row.href === `/product/${p.slug}/`)?.wattage || row.watt)}</td><td>${esc((catalog.products.find((p) => row.href === `/product/${p.slug}/`)?.variants || []).filter((v) => v.available).map((v) => v.socket || v.label).join("، "))}</td></tr>`
            )
            .join("")}
        </tbody>
      </table></div>
    </div></div></section>
    <section class="section reveal brand-strip"><div class="wrap">
      <p>${esc(home.sections.brandsLabel)}</p>
      <div class="brands">${home.sections.brands.map((item) => `<span>${esc(typeof item === "string" ? item : item.brand || item.name)}</span>`).join("")}</div>
    </div></section>
    <section class="section reveal" id="models"><div class="wrap">
      <div class="section-head"><div><h2>${esc(home.sections.modelsTitle)}</h2><p>${esc(home.sections.modelsText)}</p></div></div>
      <div class="model-grid">${catalog.models
        .map((model) => `<a href="/model/${esc(model.id)}/"><strong>${esc(model.name)}</strong><span>${esc(model.nameFa)}</span></a>`)
        .join("")}</div>
    </div></section>
    <section class="section reveal quotes"><div class="wrap">
      <div class="section-head"><h2>${esc(home.sections.quotesTitle)}</h2></div>
      <p class="quote-empty">${esc(home.sections.quotesEmpty)}</p>
    </div></section>
    <section class="ig-slot" hidden aria-hidden="true">
      <div class="wrap"><h2>اینستاگرام</h2></div>
    </section>
    <section class="section reveal"><div class="wrap faq">
      <h2>${esc(home.sections.faqTitle)}</h2>
      ${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
    </div></section>`;
  return layout({
    site,
    catalog,
    title: `${site.name} | هدلایت، مانیتور و قطعات خودرو`,
    description: site.description,
    path: "/",
    bodyClass: "home",
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
      (image) => `<figure><button class="zoom" type="button" data-zoom="${esc(image.src)}" aria-label="بزرگ‌نمایی">${productImg(image.src, image.alt || product.title, "", "(min-width: 900px) 640px, 100vw")}</button></figure>`
    )
    .join("");
  const thumbs = images.map((image, index) => `<label for="g${index}">${productImg(image.src, "", "", "72px")}</label>`).join("");
  return `<div class="gallery">${radios}<div class="slides">${slides}</div><div class="thumbs">${thumbs}</div></div>`;
}

function variantFields(product) {
  const options = (product.options || [])
    .map(
      (option) => `<label>${esc(option.label)}<select name="option-${esc(option.id)}">${option.choices
        .map((choice) => `<option>${esc(typeof choice === "string" ? choice : choice.choice)}</option>`)
        .join("")}</select></label>`
    )
    .join("");
  return options;
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
  const images = productImages(product, files);
  const category = categoryById(catalog, product.category);
  const coming = isComingSoon(product);
  const formName = coming ? "interest" : "inquiry";
  const variants = variantList(product);
  const toyota = (product.fitment?.toyota || [])
    .map((row) => {
      const model = modelById(catalog, row.model);
      const names = (row.also || []).map((item) => (typeof item === "string" ? item : item.name)).filter(Boolean);
      const also = names.length ? ` / ${names.join(" / ")}` : "";
      const year = (n) => String(n).replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
      return `${model ? model.name : row.model}${also} ${year(row.yearFrom)}–${year(row.yearTo)}`;
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
        <div class="p4">${catalog.faqs.map(([q, a]) => `<p><strong>${esc(q)}</strong><br>${esc(a)}</p>`).join("")}</div>
      </div>
    </div>
    ${related.length ? `<h2>کالاهای مرتبط</h2><div class="product-grid">${related.map((item) => productCard(item, catalog, files)).join("")}</div>` : ""}
    <div class="sticky-buy">
      <a class="btn btn-primary" href="#inquiry">${coming ? "خبرم کن" : "استعلام قیمت"}</a>
      <a class="btn btn-wa" href="${esc(waLink(site.phoneIntl, waText(site, product)))}">واتساپ</a>
      <button class="btn btn-line sticky-msg" type="button" data-open-chat aria-label="پیام">${icon("chat")}</button>
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
    bodyClass: "product",
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
