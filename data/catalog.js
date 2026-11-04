const date = "2026-10-07T10:00:00+03:30";

function img(src, alt, caption) {
  return { src, alt, caption: caption || "" };
}

function sockets(map, extras) {
  const order = ["H7", "H1", "H11", "9005", "H4"];
  return order.map((socket) => ({
    id: socket.toLowerCase(),
    socket,
    label: socket,
    available: Boolean(map[socket]),
    ...(extras && extras[socket] ? extras[socket] : {}),
  }));
}

const socketNote =
  "برای هر خودرویی با سوکت سازگار. محدود به تویوتا نیست.";

const catalog = {
  categories: [
    { id: "led", name: "هدلایت LED", blurb: "سری EGLXEN از D45 تا D150، انتخاب با سوکت لامپ", group: "lighting" },
    { id: "xenon", name: "لامپ سوکت D", blurb: "LED و زنون HID در سوکت D2S و D4S", group: "lighting" },
    { id: "projector", name: "لنز پروژکتور", blurb: "به‌زودی به مجموعه اضافه می‌شود", group: "lighting" },
    { id: "monitor", name: "مانیتور خودرو", blurb: "مانیتور اندروید و مولتی‌مدیا", group: "multimedia" },
    { id: "parking", name: "سنسور پارک", blurb: "سنسور و هشدار دنده‌عقب", group: "safety" },
    { id: "safety", name: "ایمنی", blurb: "نقطه کور و هشدار", group: "safety" },
    { id: "comfort", name: "آسایش و امکانات", blurb: "صندوق برقی و آینه تاشو", group: "options" },
    { id: "camera", name: "دوربین", blurb: "دوربین و ثبت وقایع", group: "options" },
    { id: "interior", name: "داخل کابین", blurb: "نمونه‌های این دسته برای نمایش ساختار فروشگاه هستند", group: "example" },
    { id: "exterior", name: "بدنه و محافظ", blurb: "نمونه‌های این دسته برای نمایش ساختار فروشگاه هستند", group: "example" },
    { id: "wheels", name: "چرخ و تعلیق", blurb: "نمونه‌های این دسته برای نمایش ساختار فروشگاه هستند", group: "example" },
    { id: "offroad", name: "آفرود", blurb: "نمونه‌های این دسته برای نمایش ساختار فروشگاه هستند", group: "example" },
  ],
  models: [
    { id: "prado", name: "Prado", nameFa: "پرادو", yearFrom: 2010, yearTo: 2024 },
    { id: "land-cruiser", name: "Land Cruiser", nameFa: "لندکروزر", yearFrom: 2008, yearTo: 2024 },
    { id: "hilux", name: "Hilux", nameFa: "هایلوکس", yearFrom: 2016, yearTo: 2024 },
    { id: "corolla-cross", name: "Corolla Cross", nameFa: "کرولا کراس", yearFrom: 2021, yearTo: 2026 },
    { id: "camry", name: "Camry", nameFa: "کمری", yearFrom: 2018, yearTo: 2024 },
    { id: "corolla", name: "Corolla", nameFa: "کرولا", yearFrom: 2019, yearTo: 2024 },
  ],
  brands: [
    { id: "any", name: "همه خودروها" },
    { id: "toyota", name: "تویوتا" },
    { id: "hyundai", name: "هیوندای" },
    { id: "kia", name: "کیا" },
    { id: "renault", name: "رنو" },
    { id: "peugeot", name: "پژو" },
    { id: "ikco", name: "ایران‌خودرو" },
    { id: "bmw", name: "بی‌ام‌و" },
    { id: "mercedes", name: "مرسدس‌بنز" },
    { id: "changan", name: "چانگان" },
    { id: "jac", name: "جک" },
    { id: "mvm", name: "ام‌وی‌ام" },
    { id: "other", name: "سایر" },
  ],
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
  products: [],
};

function led(partial) {
  return {
    example: false,
    status: "active",
    price: null,
    compareAtPrice: null,
    brand: "EGLXEN",
    category: "led",
    dateAdded: date,
    dateUpdated: date,
    fitment: { scope: "socket", note: socketNote, toyota: [] },
    guarantee: "",
    ...partial,
  };
}

catalog.products.push(
  led({
    id: "led-d45",
    seq: 45,
    slug: "eglxen-d45",
    sku: "TCI-D45",
    title: "هدلایت LED اگلزن EGLXEN مدل D45",
    titleEn: "EGLXEN D45 LED headlight",
    subtitle: "۶۰ وات · ۱۱۰۰۰ لومن",
    wattage: "۶۰ وات",
    shortDescription:
      "هدلایت LED اگلزن مدل D45 با درایور جدا، فن پرسرعت و چیپ خودرویی. نور سفید و پرقدرت برای رانندگی شب.",
    description:
      "مدل D45 انتخاب پرتوان سری اگلزن است: ۶۰ وات توان، ۱۱۰۰۰ لومن و بدنه نقره‌ای با جزئیات طلایی. درایور جدا پرش نور را کم می‌کند و فن ۱۲۰۰۰ دور، گرما را از لامپ دور نگه می‌دارد.\n\nبرای هر خودرویی با سوکت سازگار مناسب است. سوکت‌های H7، 9005 و H4 موجودند. H1 و H11 در حال حاضر ناموجود است.\n\nدر برخی خودروهای مجهز به کن‌باس ممکن است مقاومت بار لازم باشد. کابل شیلددار، نویز روی رادیو را کاهش می‌دهد.",
    variants: sockets({ H7: true, H1: false, H11: false, "9005": true, H4: true }),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D45" },
      { label: "توان", value: "۶۰ وات" },
      { label: "شار نوری", value: "۱۱۰۰۰ لومن" },
      { label: "چیپ", value: "۱۲ چیپ خودرویی در هر لامپ" },
      { label: "فن", value: "۱۲۰۰۰ دور در دقیقه" },
      { label: "درایور", value: "درایور دوگانه، جدا از لامپ" },
    ],
    claims: [
      {
        title: "درایور دوگانه",
        text: "کنترل دمای هوشمند و روشن‌شدن با توان کامل. عمر پیوسته بیش از ۳۰هزار ساعت. در بعضی خودروهای کن‌باس، مقاومت بار لازم است.",
      },
      {
        title: "فن و خنک‌کاری",
        text: "فن ۱۲۰۰۰ دور با ساختار گرافین، صدای کم، و دوام طولانی در رانندگی پیوسته.",
      },
      {
        title: "چیپ LED",
        text: "۱۱هزار لومن و حدود ۲۰۰ درصد روشنایی بیشتر نسبت به هالوژن، با ۱۲ چیپ خودرویی در هر لامپ.",
      },
    ],
    images: [
      img("/images/products/eglxen-d45-studio.jpg", "هدلایت EGLXEN مدل D45"),
      img("/images/products/eglxen-d45-h7.jpg", "لامپ EGLXEN D45 سوکت H7"),
      img("/images/products/eglxen-d45-h7-angle.jpg", "نمای زاویه‌دار لامپ D45"),
      img("/images/products/eglxen-d45-h1.jpg", "لامپ EGLXEN D45 سوکت H1"),
      img("/images/products/eglxen-d45-h11.jpg", "لامپ EGLXEN D45 سوکت H11"),
      img("/images/products/eglxen-d45-driver.jpg", "درایور هدلایت EGLXEN D45"),
      img("/images/products/eglxen-d45-fan.jpg", "فن خنک‌کننده هدلایت EGLXEN"),
      img("/images/products/eglxen-d45-chip.jpg", "چیپ LED هدلایت EGLXEN"),
      img("/images/products/eglxen-d45-box.jpg", "بسته‌بندی هدلایت EGLXEN مدل D45"),
    ],
  }),
  led({
    id: "led-d55",
    seq: 55,
    slug: "eglxen-d55",
    sku: "TCI-D55",
    title: "هدلایت LED اگلزن EGLXEN مدل D55",
    titleEn: "EGLXEN D55 LED headlight",
    subtitle: "۵۵ وات · High-Power",
    wattage: "۵۵ وات",
    shortDescription: "هدلایت پرتوان EGLXEN مدل D55 با توان ۵۵ وات. همه سوکت‌های پرکاربرد موجود است.",
    description:
      "D55 برای کسی است که نور بیشتر و مصرف کمتر می‌خواهد. توان ۵۵ وات، روشنایی تا ۵۰۰ درصد بیشتر، حدود ۸۰ درصد صرفه‌جویی انرژی و عمر طولانی‌تر نسبت به لامپ معمولی.\n\nسوکت‌های H7، H1، H11، 9005 و H4 موجودند و برای هر خودرویی با همان سوکت قابل استفاده‌اند.",
    variants: sockets({ H7: true, H1: true, H11: true, "9005": true, H4: true }),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D55" },
      { label: "توان", value: "۵۵ وات" },
      { label: "روشنایی", value: "تا ۵۰۰ درصد بیشتر" },
    ],
    claims: [
      { title: "نور و دوام", text: "روشنایی بیشتر، مصرف انرژی کمتر و عمر طولانی‌تر برای استفاده روزانه." },
    ],
    images: [img("/images/products/eglxen-d55-box.jpg", "بسته‌بندی هدلایت EGLXEN مدل D55")],
  }),
  led({
    id: "led-d65",
    seq: 65,
    slug: "eglxen-d65",
    sku: "TCI-D65",
    title: "هدلایت LED اگلزن EGLXEN مدل D65",
    titleEn: "EGLXEN D65 LED headlight",
    subtitle: "۶۵ وات · طرح خاکستری",
    wattage: "۶۵ وات",
    shortDescription: "هدلایت EGLXEN مدل D65 با بدنه خاکستری، دمای پایدار و روشن‌شدن سریع. توان ۶۵ وات.",
    description:
      "D65 نور بالا را با دمای کاری پایدار و روشن‌شدن سریع ترکیب می‌کند. توان ۶۵ وات، روشنایی بیشتر، مصرف کمتر و عمر طولانی‌تر برای استفاده هر روز.\n\nدر سوکت‌های H7، H1، H11 و 9005 موجود است. سوکت H4 برای این مدل ناموجود است.",
    variants: sockets({ H7: true, H1: true, H11: true, "9005": true, H4: false }),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D65" },
      { label: "توان", value: "۶۵ وات" },
      { label: "ویژگی", value: "دمای ثابت، روشن‌شدن سریع، نور بالا" },
    ],
    claims: [
      { title: "نور پایدار", text: "روشنایی بالا، صرفه‌جویی در مصرف و عمر طولانی برای مسیرهای شب." },
    ],
    images: [
      img("/images/products/eglxen-d65-studio.jpg", "هدلایت EGLXEN مدل D65"),
      img("/images/products/eglxen-d65-h7.jpg", "لامپ EGLXEN D65 سوکت H7"),
      img("/images/products/eglxen-d65-h7-angle.jpg", "نمای زاویه‌دار لامپ D65"),
      img("/images/products/eglxen-d65-h7-angle-2.jpg", "نمای دیگر لامپ D65"),
      img("/images/products/eglxen-d65-h7-angle-3.jpg", "جزئیات بدنه لامپ D65"),
      img("/images/products/eglxen-d65-h1.jpg", "لامپ EGLXEN D65 سوکت H1"),
      img("/images/products/eglxen-d65-h11.jpg", "لامپ EGLXEN D65 سوکت H11"),
      img("/images/products/eglxen-d65-box.jpg", "بسته‌بندی هدلایت EGLXEN مدل D65"),
    ],
  }),
  led({
    id: "led-d90",
    seq: 90,
    slug: "eglxen-d90",
    sku: "TCI-D90",
    title: "هدلایت LED اگلزن EGLXEN مدل D90",
    titleEn: "EGLXEN D90 LED headlight",
    subtitle: "۹۰ وات",
    wattage: "۹۰ وات",
    shortDescription: "هدلایت EGLXEN مدل D90 با توان ۹۰ وات. نور قوی، دمای پایدار و روشن‌شدن سریع.",
    description:
      "D90 برای مسیرهای تاریک و رانندگی طولانی ساخته شده است. توان ۹۰ وات، دمای کاری ثابت، روشن‌شدن سریع و عمر بالا.\n\nسوکت‌های H7، H1، H11، 9005 و H4 موجودند.",
    variants: sockets({ H7: true, H1: true, H11: true, "9005": true, H4: true }),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D90" },
      { label: "توان", value: "۹۰ وات" },
    ],
    images: [img("/images/products/eglxen-d90-box.jpg", "جعبه هدلایت EGLXEN مدل D90", "")],
  }),
  led({
    id: "led-d150",
    seq: 150,
    slug: "eglxen-d150",
    sku: "TCI-D150",
    title: "هدلایت LED اگلزن EGLXEN مدل D150",
    titleEn: "EGLXEN D150 LED headlight",
    subtitle: "۱۰۰ وات",
    wattage: "۱۰۰ وات",
    shortDescription: "قوی‌ترین مدل سری D با توان ۱۰۰ وات. برای نور حداکثری در جاده.",
    description:
      "D150 بالای سری اگلزن است: توان ۱۰۰ وات برای کسانی که بیشترین روشنایی را می‌خواهند.\n\nسوکت‌های H7، H1، H11 و H4 موجودند. سوکت 9005 برای این مدل ناموجود است.",
    variants: sockets({ H7: true, H1: true, H11: true, "9005": false, H4: true }),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D150" },
      { label: "توان", value: "۱۰۰ وات" },
    ],
    images: [
      img(
        "/images/products/lineup-sockets.jpg",
        "چیدمان چند سوکت لامپ LED خاکستری",
        ""
      ),
    ],
  }),
  {
    id: "d-led",
    seq: 210,
    slug: "d-socket-led-75w",
    sku: "TCI-DLED",
    example: false,
    status: "active",
    price: null,
    brand: "EGLXEN",
    category: "xenon",
    title: "لامپ LED سوکت D اگلزن EGLXEN، ۷۵ وات",
    titleEn: "EGLXEN D-socket LED 75W",
    subtitle: "جایگزین لامپ زنون · D2S و D4S",
    wattage: "۷۵ وات",
    shortDescription: "جایگزین LED برای لامپ زنون. توان ۷۵ وات، در پایه D2S و D4S.",
    description:
      "اگر خودروی شما زنون فابریک با سوکت D دارد، این لامپ LED همان پایه را می‌گیرد و نور سفید و فوری می‌دهد. هیت‌سینک قرمز گرما را از چیپ دور می‌کند.\n\nهر دو پایه D2S و D4S موجود است و توان هر کدام ۷۵ وات است.",
    dateAdded: date,
    dateUpdated: date,
    fitment: { scope: "socket", note: "برای خودروهایی که لامپ زنون سوکت D2S یا D4S دارند. محدود به تویوتا نیست.", toyota: [] },
    variants: [
      { id: "d2s", socket: "D2S", label: "D2S", available: true },
      { id: "d4s", socket: "D4S", label: "D4S", available: true },
    ],
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "نوع", value: "LED جایگزین زنون" },
      { label: "توان", value: "۷۵ وات" },
      { label: "پایه‌ها", value: "D2S و D4S" },
    ],
    images: [
      img(
        "/images/products/led-d-socket.jpg",
        "لامپ LED با هیت‌سینک قرمز کنار لامپ زنون",
        ""
      ),
    ],
  },
  {
    id: "d-hid",
    seq: 220,
    slug: "d-socket-hid-6000k",
    sku: "TCI-DHID",
    example: false,
    status: "active",
    price: null,
    brand: "EGLXEN",
    category: "xenon",
    title: "لامپ زنون HID سوکت D، ۶۰۰۰ کلوین، ۳۵ وات",
    titleEn: "D-socket HID xenon 6000K 35W",
    subtitle: "D2S و D4S",
    wattage: "۳۵ وات",
    shortDescription: "لامپ زنون HID با دمای رنگ ۶۰۰۰ کلوین و توان ۳۵ وات، در پایه D2S و D4S. هر دو موجودند.",
    description:
      "نور سفید ۶۰۰۰ کلوین با توان ۳۵ وات، برای چراغ‌های زنون فابریک. پایه را بین D2S و D4S انتخاب کنید؛ هر دو موجود است.",
    dateAdded: date,
    dateUpdated: date,
    fitment: { scope: "socket", note: "برای خودروهای زنون سوکت D2S یا D4S. محدود به تویوتا نیست.", toyota: [] },
    variants: [
      { id: "d2s", socket: "D2S", label: "D2S", available: true },
      { id: "d4s", socket: "D4S", label: "D4S", available: true },
    ],
    specs: [
      { label: "نوع", value: "زنون HID" },
      { label: "دمای رنگ", value: "۶۰۰۰ کلوین" },
      { label: "توان", value: "۳۵ وات" },
      { label: "پایه‌ها", value: "D2S و D4S" },
    ],
    images: [
      img("/images/products/xenon-hid-1.jpg", "دو لامپ زنون، یکی ایستاده و یکی خوابیده", ""),
      img("/images/products/xenon-hid-2.jpg", "یک جفت لامپ زنون ایستاده", ""),
    ],
  }
);

function base(partial) {
  return {
    example: false,
    status: "active",
    price: null,
    brand: "",
    dateAdded: date,
    dateUpdated: date,
    variants: [],
    available: true,
    specs: [],
    claims: [],
    images: [],
    ...partial,
  };
}

catalog.products.push(
  base({
    id: "monitor-ts18",
    seq: 301,
    slug: "android-monitor-ts18",
    sku: "TCI-TS18",
    category: "monitor",
    title: "مانیتور اندروید خودرو TS18 هشت‌هسته",
    titleEn: "TS18 8-core Android car monitor",
    subtitle: "CarPlay و Android Auto",
    shortDescription:
      "مانیتور اندروید TS18 با پردازنده هشت‌هسته، کارپلی، اندروید اتو و دوربین AHD.",
    description:
      "مشخصات TS18: پردازنده هشت‌هسته، صفحه IPS با وضوح ۱۲۸۰×۷۲۰، CarPlay و Android Auto، دوربین AHD، فن خنک‌کننده، سیم‌کارت 4G و پردازشگر صدای DSP. برای داشبورد خودروهای سواری، نه فقط تویوتا.\n\nحافظه را بین ۲+۳۲، ۴+۶۴ و ۶+۱۲۸ گیگابایت انتخاب کنید. اندازه اینچ صفحه هنگام استعلام اعلام می‌شود.",
    fitment: {
      scope: "unknown",
      note: "برای خودروهای سواری. اندازه صفحه و قاب نصب را هنگام سفارش هماهنگ کنید.",
      toyota: [],
    },
    variants: [
      { id: "2-32", label: "۲ + ۳۲ گیگابایت", available: true },
      { id: "4-64", label: "۴ + ۶۴ گیگابایت", available: true },
      { id: "6-128", label: "۶ + ۱۲۸ گیگابایت", available: true },
    ],
    specs: [
      { label: "مدل", value: "TS18" },
      { label: "پردازنده", value: "هشت‌هسته" },
      { label: "صفحه", value: "IPS با وضوح ۱۲۸۰×۷۲۰" },
      { label: "اندازه صفحه", value: "هنگام استعلام اعلام می‌شود" },
      { label: "کارپلی و اندروید اتو", value: "دارد" },
      { label: "دوربین", value: "پشتیبانی از دوربین AHD" },
      { label: "خنک‌کننده", value: "فن" },
      { label: "سیم‌کارت", value: "4G" },
      { label: "صدا", value: "DSP" },
    ],
    images: [
      img("/images/products/monitor-ts18.jpg", "مانیتور اندروید TS18", "نمای دستگاه."),
      img("/images/products/monitor-ts18-full.jpg", "مانیتور TS18 و مشخصات آن"),
    ],
  }),
  base({
    id: "monitor-t9",
    seq: 302,
    slug: "android-monitor-t9",
    sku: "TCI-T9",
    category: "monitor",
    title: "مانیتور اندروید خودرو T9 هشت‌هسته",
    titleEn: "T9 8-core Android car monitor",
    subtitle: "خروجی تصویر و HDMI · کارکرد دوربین ۳۶۰",
    shortDescription:
      "مانیتور اندروید T9 با خروجی HDMI و دوربین ۳۶۰، ضبط هم‌زمان جلو و عقب.",
    description:
      "مشخصات T9: پردازنده هشت‌هسته، صفحه IPS با وضوح ۱۲۸۰×۷۲۰، خروجی تصویر و HDMI، کارکرد دوربین ۳۶۰ با ضبط هم‌زمان جلو و عقب، و سفارش با سیم‌کارت 4G یا بدون آن. مناسب خودروهای سواری.\n\nحافظه ۳+۳۲ یا ۴+۶۴ گیگابایت است. اندازه اینچ صفحه هنگام استعلام اعلام می‌شود.",
    fitment: {
      scope: "unknown",
      note: "برای خودروهای سواری. اندازه صفحه و قاب نصب را هنگام سفارش هماهنگ کنید.",
      toyota: [],
    },
    variants: [
      { id: "3-32", label: "۳ + ۳۲ گیگابایت", available: true },
      { id: "4-64", label: "۴ + ۶۴ گیگابایت", available: true },
    ],
    options: [{ id: "sim", label: "سیم‌کارت 4G", choices: ["با سیم‌کارت 4G", "بدون سیم‌کارت 4G"] }],
    specs: [
      { label: "مدل", value: "T9" },
      { label: "پردازنده", value: "هشت‌هسته" },
      { label: "صفحه", value: "IPS با وضوح ۱۲۸۰×۷۲۰" },
      { label: "اندازه صفحه", value: "هنگام استعلام اعلام می‌شود" },
      { label: "تصویر", value: "خروجی تصویر و HDMI" },
      { label: "دوربین ۳۶۰", value: "دارد، با ضبط هم‌زمان جلو و عقب" },
      { label: "سیم‌کارت", value: "قابل سفارش با 4G یا بدون آن" },
    ],
    images: [
      img("/images/products/monitor-t9.jpg", "مانیتور اندروید T9", "نمای دستگاه."),
      img("/images/products/monitor-t9-full.jpg", "مانیتور T9 و مشخصات آن"),
    ],
  }),
  base({
    id: "parking-ors3313",
    seq: 330,
    slug: "parking-sensor-8",
    sku: "TCI-PARK-3313",
    category: "parking",
    title: "کیت سنسور پارک ۸ سنسوره، ماژول ORS-3313",
    titleEn: "8-sensor parking assist kit ORS-3313",
    subtitle: "هشت سنسور، براکت، دسته سیم و ماژول",
    shortDescription: "کیت کمک پارک با هشت سنسور، براکت نصب، دسته سیم و ماژول ORS-3313.",
    description:
      "هشت سنسور، براکت نصب، دسته سیم و ماژول ORS-3313 برای هشدار فاصله هنگام پارک. روی خودروهای مختلف قابل نصب است.",
    fitment: { scope: "universal", note: "برای خودروهای مختلف. محل نصب را هنگام سفارش هماهنگ کنید.", toyota: [] },
    specs: [
      { label: "کد ماژول", value: "ORS-3313" },
      { label: "تعداد سنسور", value: "۸" },
      { label: "اقلام دیده شده", value: "سنسور، براکت، دسته سیم، ماژول" },
    ],
    images: [img("/images/products/parking-ors3313.jpg", "اجزای کیت سنسور پارک هشت‌تایی", "")],
  }),
  base({
    id: "tailgate",
    seq: 340,
    slug: "power-tailgate-kit",
    sku: "TCI-TAILGATE",
    category: "comfort",
    title: "کیت درب صندوق برقی",
    titleEn: "Power tailgate kit",
    shortDescription: "کیت صندوق برقی شامل دو جک، ماژول کنترل، موتور قفل، دکمه و دسته سیم.",
    description:
      "درب صندوق را با دکمه باز و بسته کنید. مجموعه شامل دو جک، جعبه کنترل، موتور قفل و دسته سیم است. مدل خودرو را هنگام استعلام بگویید.",
    fitment: { scope: "unknown", note: "مدل خودرو را هنگام سفارش اعلام کنید.", toyota: [] },
    specs: [{ label: "اقلام دیده شده", value: "دو جک، ماژول، موتور قفل، دکمه، دسته سیم" }],
    images: [img("/images/products/power-tailgate.jpg", "قطعات کیت درب صندوق برقی", "")],
  }),
  base({
    id: "bsm-mirrors",
    seq: 350,
    slug: "blind-spot-mirror-kit",
    sku: "TCI-BSM-MIRROR",
    category: "safety",
    title: "کیت هشدار نقطه کور با شیشه آینه",
    titleEn: "Blind-spot kit with mirror glass",
    shortDescription: "دو شیشه آینه با علامت هشدار، حسگر، بوق و دسته سیم.",
    description:
      "هشدار نقطه کور روی شیشه آینه، همراه حسگر، بوق و سیم‌کشی. مدل آینه را هنگام سفارش بگویید تا شیشه درست انتخاب شود.",
    fitment: { scope: "unknown", note: "مدل آینه را هنگام سفارش اعلام کنید.", toyota: [] },
    specs: [{ label: "اقلام دیده شده", value: "دو شیشه آینه، حسگر، بوق، سیم‌کشی" }],
    images: [img("/images/products/blind-spot-mirrors.jpg", "شیشه آینه و قطعات هشدار نقطه کور", "")],
  }),
  base({
    id: "bsm-sensors",
    seq: 351,
    slug: "blind-spot-sensor-kit",
    sku: "TCI-BSM-SENSOR",
    category: "safety",
    title: "کیت سنسور نقطه کور",
    titleEn: "Blind-spot sensor kit",
    shortDescription: "دو رادار، بوق، سیم‌کشی و دو نشانگر کوچک آینه.",
    description:
      "دو رادار، بوق، سیم‌کشی و دو نشانگر کوچک برای آینه. هشدار نقطه کور را بدون تعویض کامل آینه اضافه می‌کند.",
    fitment: { scope: "universal", note: "برای خودروهای مختلف. محل نصب را هنگام سفارش هماهنگ کنید.", toyota: [] },
    specs: [{ label: "اقلام دیده شده", value: "۲ رادار، بوق، سیم‌کشی، ۲ نشانگر آینه" }],
    images: [img("/images/products/blind-spot-sensors.jpg", "سنسورها و نشانگرهای کیت نقطه کور", "")],
  }),
  base({
    id: "cc-fold",
    seq: 360,
    slug: "corolla-cross-power-fold-2023",
    sku: "TCI-CC-FOLD-2326",
    category: "comfort",
    title: "کیت آینه تاشو برقی کرولا کراس و فرانت‌لندر ۲۰۲۳ تا ۲۰۲۶",
    titleEn: "Corolla Cross / Frontlander power-fold mirror kit 2023-2026",
    shortDescription: "موتور تاشو، دسته سیم و پنل کلید شیشه با دکمه جمع شدن آینه، برای کرولا کراس و فرانت‌لندر ۲۰۲۳ تا ۲۰۲۶.",
    description:
      "آینه‌های کرولا کراس و فرانت‌لندر را برقی و تاشو می‌کند. سازگاری: Corolla Cross / Frontlander 2023–2026. شامل موتور دو طرف، دسته سیم و پنل کلید شیشه با دکمه جمع شدن آینه.",
    fitment: {
      scope: "toyota",
      note: "برای Corolla Cross و Frontlander، سال ۲۰۲۳ تا ۲۰۲۶.",
      toyota: [{ model: "corolla-cross", yearFrom: 2023, yearTo: 2026, also: ["Frontlander"] }],
    },
    specs: [
      { label: "سازگاری", value: "Corolla Cross / Frontlander 2023–2026" },
    ],
    images: [img("/images/products/cc-power-fold.jpg", "کیت آینه تاشو برقی کرولا کراس", "")],
  }),
  base({
    id: "fold-generic",
    seq: 361,
    slug: "power-fold-mirror-kit",
    sku: "TCI-FOLD",
    category: "comfort",
    title: "کیت آینه تاشو برقی",
    titleEn: "Power-fold mirror kit",
    shortDescription: "دو پوسته موتور آینه، دکمه، ماژول و دسته سیم. مدل خودرو را هنگام سفارش بگویید.",
    description:
      "دو موتور آینه، کلید، ماژول و دسته سیم برای جمع شدن برقی آینه‌ها. مدل خودرو را هنگام استعلام بگویید.",
    fitment: { scope: "unknown", note: "مدل خودرو را هنگام سفارش اعلام کنید.", toyota: [] },
    specs: [{ label: "اقلام دیده شده", value: "دو موتور، دکمه، ماژول، دسته سیم" }],
    images: [img("/images/products/power-fold.jpg", "قطعات کیت آینه تاشو برقی", "")],
  }),
  base({
    id: "cc-dashcam",
    seq: 370,
    slug: "corolla-cross-dashcam-2026",
    sku: "TCI-CC-CAM-2026",
    category: "camera",
    title: "دوربین ثبت وقایع پشت آینه کرولا کراس و فرانت‌لندر ۲۰۲۶",
    titleEn: "Corolla Cross / Frontlander 2026 mirror dashcam",
    shortDescription: "بدنه نصب پشت آینه، دوربین عقب و سوکت برق ACC، برای کرولا کراس و فرانت‌لندر ۲۰۲۶.",
    description:
      "دوربین ثبت وقایع که پشت آینه وسط می‌نشیند، به‌همراه دوربین عقب و سوکت برق ACC. سازگاری: Corolla Cross / Frontlander 2026.",
    fitment: {
      scope: "toyota",
      note: "برای Corolla Cross و Frontlander مدل ۲۰۲۶.",
      toyota: [{ model: "corolla-cross", yearFrom: 2026, yearTo: 2026, also: ["Frontlander"] }],
    },
    specs: [
      { label: "سازگاری", value: "Corolla Cross / Frontlander 2026" },
      { label: "دوربین عقب", value: "دارد، همراه سوکت برق ACC" },
    ],
    images: [img("/images/products/cc-dashcam.jpg", "دوربین ثبت وقایع کرولا کراس ۲۰۲۶", "")],
  }),
  base({
    id: "cc-camera",
    seq: 371,
    slug: "corolla-cross-camera-kit",
    sku: "TCI-CC-CAMERA",
    category: "camera",
    title: "کیت دوربین عقب کرولا کراس و فرانت‌لندر ۲۰۲۳ تا ۲۰۲۶",
    titleEn: "Corolla Cross / Frontlander 2023–2026 rear camera kit",
    shortDescription: "دوربین عقب، ماژول و دسته سیم برای Corolla Cross / Frontlander 2023–2026.",
    description:
      "کیت دوربین عقب برای کرولا کراس و فرانت‌لندر. سازگاری: Corolla Cross / Frontlander 2023–2026. شامل دوربین عقب، ماژول و دسته سیم.",
    fitment: {
      scope: "toyota",
      note: "دوربین عقب برای Corolla Cross / Frontlander 2023–2026.",
      toyota: [{ model: "corolla-cross", yearFrom: 2023, yearTo: 2026, also: ["Frontlander"] }],
    },
    specs: [
      { label: "سازگاری", value: "Corolla Cross / Frontlander 2023–2026" },
      { label: "نوع", value: "دوربین عقب" },
    ],
    images: [img("/images/products/cc-camera.jpg", "قطعات کیت دوربین کرولا کراس", "")],
  }),
  base({
    id: "projector",
    seq: 380,
    slug: "projector-lens",
    sku: "TCI-LENS",
    category: "projector",
    status: "coming_soon",
    available: false,
    title: "لنز پروژکتور چراغ جلو",
    titleEn: "Projector headlight lens",
    shortDescription: "ماژول لنز پروژکتور چراغ جلو. به‌زودی به موجودی اضافه می‌شود.",
    description:
      "لنز پروژکتور چراغ جلو با شیشه شفاف و بدنه تیره. به‌زودی برای سفارش باز می‌شود.",
    fitment: { scope: "unknown", note: "به‌زودی. مدل خودرو را در فرم خبرم کن بنویسید.", toyota: [] },
    specs: [{ label: "وضعیت", value: "به‌زودی" }],
    images: [img("/images/products/projector-lens.jpg", "ماژول لنز پروژکتور در دست", "")],
  }),
  base({
    id: "projector-carbon",
    seq: 381,
    slug: "projector-lens-carbon",
    sku: "TCI-LENS-CF",
    category: "projector",
    status: "coming_soon",
    available: false,
    title: "لنز پروژکتور با بدنه طرح کربن",
    titleEn: "Carbon-look projector lens",
    shortDescription: "ماژول لنز با پوسته طرح فیبر کربن و حلقه آبی. به‌زودی.",
    description:
      "لنز پروژکتور با پوسته طرح کربن و حلقه آبی. به‌زودی برای سفارش باز می‌شود.",
    fitment: { scope: "unknown", note: "به‌زودی. مدل خودرو را در فرم خبرم کن بنویسید.", toyota: [] },
    specs: [
      { label: "ظاهر", value: "پوسته طرح کربن و حلقه آبی" },
      { label: "وضعیت", value: "به‌زودی" },
    ],
    images: [img("/images/products/projector-lens-carbon.jpg", "لنز پروژکتور با بدنه طرح کربن", "")],
  })
);

function example(partial) {
  return base({
    example: true,
    available: false,
    description: "نمونهٔ نمایشی این دسته است.",
    fitment: partial.fitment,
    ...partial,
    example: true,
  });
}

catalog.products.push(
  example({
    id: "ex-prado-mat",
    seq: 901,
    slug: "sample-prado-floor-mat",
    sku: "SAMPLE-PRADO-MAT",
    category: "interior",
    title: "کفپوش کابین پرادو",
    titleEn: "Sample Prado floor mat",
    subtitle: "محصول نمونه",
    shortDescription: "نمونه نمایشی برای دسته داخل کابین.",
    fitment: { scope: "toyota", note: "نمونه سازگاری.", toyota: [{ model: "prado", yearFrom: 2014, yearTo: 2023 }] },
  }),
  example({
    id: "ex-lc-guard",
    seq: 902,
    slug: "sample-landcruiser-guard",
    sku: "SAMPLE-LC-GUARD",
    category: "offroad",
    title: "گارد سپر لندکروزر",
    titleEn: "Sample Land Cruiser bumper guard",
    subtitle: "محصول نمونه",
    shortDescription: "نمونه نمایشی برای دسته آفرود.",
    fitment: { scope: "toyota", note: "نمونه سازگاری.", toyota: [{ model: "land-cruiser", yearFrom: 2016, yearTo: 2021 }] },
  }),
  example({
    id: "ex-hilux-shock",
    seq: 903,
    slug: "sample-hilux-shocks",
    sku: "SAMPLE-HILUX-SHOCK",
    category: "wheels",
    title: "کمک‌فنر تقویت‌شده هایلوکس",
    titleEn: "Sample Hilux shock absorbers",
    subtitle: "محصول نمونه",
    shortDescription: "نمونه نمایشی برای دسته چرخ و تعلیق.",
    fitment: { scope: "toyota", note: "نمونه سازگاری.", toyota: [{ model: "hilux", yearFrom: 2016, yearTo: 2024 }] },
  }),
  example({
    id: "ex-hilux-liner",
    seq: 904,
    slug: "sample-hilux-bed-liner",
    sku: "SAMPLE-HILUX-LINER",
    category: "exterior",
    title: "لاینر کف وانت هایلوکس",
    titleEn: "Sample Hilux bed liner",
    subtitle: "محصول نمونه",
    shortDescription: "نمونه نمایشی برای دسته بدنه.",
    fitment: { scope: "toyota", note: "نمونه سازگاری.", toyota: [{ model: "hilux", yearFrom: 2016, yearTo: 2024 }] },
  }),
  example({
    id: "ex-camry-cover",
    seq: 905,
    slug: "sample-camry-seat-cover",
    sku: "SAMPLE-CAMRY-COVER",
    category: "interior",
    title: "روکش صندلی کمری",
    titleEn: "Sample Camry seat cover",
    subtitle: "محصول نمونه",
    shortDescription: "نمونه نمایشی برای کمری.",
    fitment: { scope: "toyota", note: "نمونه سازگاری.", toyota: [{ model: "camry", yearFrom: 2018, yearTo: 2024 }] },
  }),
  example({
    id: "ex-corolla-trunk",
    seq: 906,
    slug: "sample-corolla-trunk-mat",
    sku: "SAMPLE-COROLLA-TRUNK",
    category: "interior",
    title: "کفی صندوق کرولا",
    titleEn: "Sample Corolla trunk mat",
    subtitle: "محصول نمونه",
    shortDescription: "نمونه نمایشی برای کرولا.",
    fitment: { scope: "toyota", note: "نمونه سازگاری.", toyota: [{ model: "corolla", yearFrom: 2019, yearTo: 2024 }] },
  })
);

module.exports = catalog;
