# Toyota Club Iran

فروشگاه تویوتا کلاب ایران. سایت قبلی یک فایل HTML بود و سفارش، فرم و فید ترب را نگه نمی‌داشت. هاست فعلی نتفلی است، برای همین فروشگاه استاتیک ساخته می‌شود و فرم‌ها را خود نتفلی می‌گیرد.

The previous site was a single HTML file. It could not store orders or answer Torob. The live host is Netlify, so the store is a static build: `node scripts/build.js` writes `dist/`, and Netlify Forms receives messages. There is no long-running server to keep deployed.

## Run locally / اجرای محلی

```bash
npm test
npm run build
npx serve dist
```

Open `http://localhost:3000`.

## Add a product / افزودن کالا

Edit `data/catalog.js`. Each product needs a stable `id`, `slug`, `sku`, `title`, `category`, and `price: null` until you are ready to show prices. Socket or memory choices go in `variants` with `available: true` or `false`. Do not put stock counts in the file; the site only says موجود or ناموجود.

Product photos live in `public/images/products/<slug>/`. Name them `1.jpg`, `2.jpg`, `3.jpg` in the order they should appear. The build uses those numbered files when the folder exists, and otherwise falls back to the paths listed on the product. A missing file is skipped, so a page never shows a broken image.

صفحه کالا اول عکس‌های `public/images/products/نامک-کالا/1.jpg` و بعد `2.jpg` و `3.jpg` را نشان می‌دهد. نامک همان `slug` داخل `data/catalog.js` است. عکس را مربع و با پس‌زمینه روشن بگیرید؛ قاب سایت خودش نور ملایم می‌گذارد و عکس را کش نمی‌آید. اگر پوشه خالی باشد، مسیرهای قدیمی همان کالا استفاده می‌شود.

Home banners live in `public/images/banners/`. The site serves WebP at 768 and 1280 pixels for heroes, and 480 and 800 for category tiles, because the source files were upscaled. Product pages stay on the real product photos, not the banners.

For the two Android monitors, the older flat files are still in the repo:

- `public/images/products/monitor-ts18.jpg` cropped to the unit
- `public/images/products/monitor-ts18-full.jpg` the original screenshot
- `public/images/products/monitor-t9.jpg`
- `public/images/products/monitor-t9-full.jpg`

Redeploy by pushing to the branch Netlify builds. There is no separate admin login: the catalog file is the admin, and messages arrive in Netlify Forms.

کالا را در `data/catalog.js` اضافه کنید. `id` و `slug` و `sku` را ثابت نگه دارید. تا روز اعلام قیمت، `price` را `null` بگذارید. برای سوکت یا حافظه، `variants` بسازید و فقط `available` را true یا false کنید. تعداد موجودی را در سایت ننویسید.

عکس کالا را با نام `1.jpg` و `2.jpg` داخل پوشه همان کالا بگذارید. بنر صفحه اول را عوض نکنید مگر فایل هم‌نام در `public/images/banners/` را جایگزین کنید.

پیام‌های مشتری در Netlify Forms جمع می‌شود: فرم‌های `message`، `inquiry`، `part-request`، `interest` و `order`.

## Prices / قیمت

`data/site.js` has `showPrices: false`. Every product shows استعلام قیمت and `۰۹۱۷۴۴۵۰۰۴۰`. Cart totals and the toman label stay hidden.

To turn prices on later:

1. Set integer toman amounts on `product.price`.
2. Set `showPrices` to `true`, or set the Netlify env var `SHOW_PRICES=true`.
3. Rebuild.

Checkout and the cart script already exist for that switch. While prices are empty, `/checkout/` is a request form, not a payment page.

## Payment gateway / درگاه

`config/payment.json` selects `mock`, `zarinpal`, or `idpay`. Leave the merchant fields empty. On Netlify, set:

- `PAYMENT_PROVIDER` (`zarinpal` or `idpay`)
- `ZARINPAL_MERCHANT_ID` and `ZARINPAL_SANDBOX`
- `IDPAY_API_KEY` and `IDPAY_SANDBOX`

`netlify/functions/payment.js` refuses to start a payment until a provider and its key exist. Amounts in the catalog are toman. Zarinpal and IDPay charge in rial, so the amount sent later must be toman × 10. No live keys are in this repo.

درگاه را با متغیر محیطی وصل کنید، نه با نوشتن رمز در فایل. تا وقتی قیمت روی سایت نیست، دکمه پرداخت نشان داده نمی‌شود.

## Torob / ترب

Torob’s product API is a POST to `/torob_api/v3/products`. Netlify proxies that path to `netlify/functions/torob.js`. A build-time copy is also at `/torob/products.json`.

Products are omitted from the feed until `showPrices` is on and `price` is a positive number. Torob treats a zero price with availability as a free item, so unpublished prices are left out on purpose. After prices are public, set `TOROB_REQUIRE_TOKEN=true` so only Torob’s signed requests are accepted. The checker uses Torob’s published Ed25519 key and the `aud` claim must match the request host.

ترب بدون قیمت، کالا را فهرست نمی‌کند. فید آماده است و تا اعلام قیمت خالی می‌ماند. در پنل ترب آدرس `https://toyotaclubiran.com/torob_api/v3/products` را ثبت کنید.

## Digikala / دیجی‌کالا

Digikala is a marketplace. This repo does not call Digikala. The build writes:

- `/exports/digikala.csv`
- `/exports/digikala.json`

Use the CSV as a worksheet in the seller panel after you have a seller account. Steps the owner still has to do in Digikala, not in this site:

1. Register at the seller panel and finish identity checks.
2. Search for an existing Digikala product (DKP) and choose «شما هم بفروشید», or create the product if it is not listed.
3. Enter category, packaging size and weight, description, and photos that match Digikala’s rules (white background, JPG).
4. Add a variant, warranty, price in the panel’s currency, and stock.
5. Wait for Digikala to approve the content before it can be sold.

فایل خروجی فقط برای آماده‌سازی است و خودش به دیجی‌کالا فرستاده نمی‌شود.

## Contact / تماس

Address on the footer, contact page, and schema.org `AutoPartsStore`: استان فارس، شهرستان لامرد.

Phone and WhatsApp: `09174450040` (`https://wa.me/989174450040`). On a product page the WhatsApp text includes the product name.

The message box on every page is a Netlify Form (`data-netlify="true"`, hidden `form-name`, honeypot `bot-field`). Submissions show up in the Netlify dashboard. No paid chat widget is used.

## Netlify

`netlify.toml` builds with `node scripts/build.js` and publishes `dist/`. Redirects send `www` and `http` to `https://toyotaclubiran.com`. There is no single-page fallback, because each catalog URL is a real HTML file.

### HTTPS currently fails before the site

`https://toyotaclubiran.com` presents Netlify’s `*.netlify.app` certificate, so browsers reject the name. `http://toyotaclubiran.com` returns the current homepage with HTTP 200. A request that ignores the certificate also gets HTTP 200 from the same site, so this is not a crash in the repository and there is no redirect loop in the code today.

In Netlify: Domain management → the custom domain → HTTPS → provision or renew the certificate for `toyotaclubiran.com`. Confirm DNS points at Netlify in the way the dashboard asks. Do that before relying on the new HTTP-to-HTTPS redirect, or visitors who still use `http://` will be sent to the broken certificate.

هیچ تنظیم داخل مخزن، خطای ۵۰۰ را نمی‌سازد. گواهی HTTPS هنوز برای دامنه فروشگاه صادر نشده و گواهی پیش‌فرض `*.netlify.app` نشان داده می‌شود. صدور گواهی را از داشبورد نتفلی انجام دهید.

## Brand / برند

EGLXEN stays in titles and photos. Other supplier names are not written in the catalog. The parking-sensor photo no longer shows the supplier name on the module; the code ORS-3313 remains.
