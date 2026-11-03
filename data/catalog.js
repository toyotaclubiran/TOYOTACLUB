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
  "سازگاری بر اساس نوع سوکت لامپ است و محدود به تویوتا نیست. سوکت لامپ فابریک خودرو را قبل از سفارش تطبیق دهید.";

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
    subtitle: "۴۵ وات · طرح نقره‌ای با جزئیات طلایی",
    wattage: "۴۵ وات",
    shortDescription:
      "هدلایت LED اگلزن مدل D45 با درایور جدا، فن و چیپ خودرویی. انتخاب سوکت از همین صفحه انجام می‌شود.",
    description:
      "جعبه این مدل با عنوان LED Headlight Bulb و Premium Lighting System مشخص شده و نشان Germany Technology و Authentic Parts روی بسته‌بندی دیده می‌شود. عکس اصلی، جعبه D45 را کنار لامپ و درایور با برچسب D45-H7 نشان می‌دهد.\n\nتصاویر سوکت H1 و H11 از همین خانواده طراحی نقره‌ای هستند. طبق فهرست موجودی فروشگاه این دو سوکت فعلاً ناموجودند و فقط برای دیدن طرح در گالری مانده‌اند.\n\nتوان مدل در فهرست موجودی ۴۵ وات است. روی تصویر معرفی چیپ، عبارت ۶۰ وات برای هر لامپ هم نوشته شده؛ تا وقتی فروشگاه یکی را ملاک نهایی اعلام کند، هر دو را جدا ذکر کرده‌ایم.",
    variants: sockets(
      { H7: true, H1: false, H11: false, "9005": true, H4: true },
      {
        H1: { note: "تصویر طراحی موجود است؛ خود سوکت فعلاً ناموجود است." },
        H11: { note: "تصویر طراحی موجود است؛ خود سوکت فعلاً ناموجود است." },
      }
    ),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D45" },
      { label: "توان فهرست موجودی", value: "۴۵ وات" },
      { label: "توان نوشته‌شده روی تصویر چیپ", value: "۶۰ وات برای هر لامپ" },
      { label: "شار نوری روی تصویر چیپ", value: "۱۱۰۰۰ لومن" },
      { label: "چیپ", value: "۱۲ چیپ سفارشی درجه خودرویی در هر لامپ" },
      { label: "فن", value: "۱۲۰۰۰ دور در دقیقه" },
      { label: "درایور", value: "درایور دوگانه جدا از لامپ" },
    ],
    claims: [
      {
        title: "درایور دوگانه",
        text: "کنترل هوشمند دما و حفاظت چندگانه. طبق تصویر معرفی، درایور اختصاصی پرش نور را کم می‌کند و توان را از لحظه روشن شدن می‌رساند. عمر پیوسته بیش از ۳۰هزار ساعت ادعا شده است. در بعضی خودروهای کن‌باس پیچیده ممکن است مقاومت بار لازم باشد. کابل برق شیلددار برای کاهش تداخل رادیویی ذکر شده است.",
      },
      {
        title: "فن و دفع حرارت",
        text: "فن پرسرعت ۱۲۰۰۰ دور در دقیقه، دفع حرارت با گرافین، و صدای کم (Super mute). روی همان تصویر، افزایش شار نوری ۹۸ درصد و افزایش عمر ۵۰هزار ساعت هم نوشته شده است.",
      },
      {
        title: "چیپ LED",
        text: "تصویر معرفی چیپ از ۱۱۰۰۰ لومن، ۶۰ وات برای هر عدد، ۱۲ چیپ سفارشی و حدود ۲۰۰ درصد لومن خام بیشتر نسبت به هالوژن می‌گوید. توان ۴۵ وات فهرست موجودی را جدا در جدول مشخصات ببینید.",
      },
    ],
    images: [
      img("/images/products/eglxen-d45-studio.jpg", "جعبه هدلایت EGLXEN مدل D45 کنار لامپ و درایور", "عکس اصلی. درایور جلویی برچسب D45-H7 دارد."),
      img("/images/products/eglxen-d45-h7.jpg", "یک جفت لامپ نقره‌ای سوکت H7", "سوکت H7، طرح نقره‌ای D45."),
      img("/images/products/eglxen-d45-h7-angle.jpg", "زاویه دیگر لامپ نقره‌ای H7", ""),
      img("/images/products/eglxen-d45-h1.jpg", "یک جفت لامپ نقره‌ای سوکت H1", "همان طرح؛ سوکت H1 فعلاً ناموجود است."),
      img("/images/products/eglxen-d45-h11.jpg", "یک جفت لامپ نقره‌ای سوکت H11", "همان طرح؛ سوکت H11 فعلاً ناموجود است."),
      img("/images/products/eglxen-d45-driver.jpg", "برد درایور دوگانه EGLXEN", "تصویر معرفی درایور."),
      img("/images/products/eglxen-d45-fan.jpg", "فن و بدنه لامپ EGLXEN", "تصویر معرفی فن."),
      img("/images/products/eglxen-d45-chip.jpg", "چیپ LED لامپ EGLXEN", "تصویر معرفی چیپ."),
      img("/images/products/eglxen-d45-box.jpg", "جعبه مقوایی EGLXEN مدل D45 روی میز", "عکس جعبه."),
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
    shortDescription: "هدلایت پرتوان EGLXEN مدل D55. همه سوکت‌های H7، H1، H11، 9005 و H4 در فهرست موجودی موجودند.",
    description:
      "روی جعبه عبارت High-Power LED Headlight و نشان‌های روشنایی ۵۰۰ درصد، صرفه‌جویی انرژی ۸۰ درصد و عمر ۳۰۰ درصد بیشتر دیده می‌شود. این عددها ادعای روی بسته‌بندی هستند. عکس جداگانه‌ای از خود لامپ برای این مدل در گالری نیست.",
    variants: sockets({ H7: true, H1: true, H11: true, "9005": true, H4: true }),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D55" },
      { label: "توان", value: "۵۵ وات" },
      { label: "عبارت جعبه", value: "High-Power LED Headlight" },
    ],
    claims: [
      { title: "نوشته‌های جعبه", text: "روشنایی ۵۰۰٪، صرفه‌جویی انرژی ۸۰٪، و عمر ۳۰۰٪ بیشتر؛ هر سه روی بسته‌بندی چاپ شده‌اند." },
    ],
    images: [img("/images/products/eglxen-d55-box.jpg", "جعبه هدلایت EGLXEN مدل D55", "تنها تصویر موجود از این مدل، عکس جعبه است.")],
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
    shortDescription: "هدلایت EGLXEN مدل D65 با بدنه خاکستری. سوکت H4 در فهرست موجودی این مدل ناموجود است.",
    description:
      "عکس اصلی جعبه D65 را کنار لامپ خاکستری و درایور با برچسب D65-H7 نشان می‌دهد. روی جعبه عبارت‌های Constant temperature، روشن‌شدن سریع، روشنایی بالا و عمر طولانی، به همراه نشان‌های ۵۰۰٪ روشنایی، ۸۰٪ صرفه‌جویی انرژی و ۳۰۰٪ عمر بیشتر دیده می‌شود.\n\nتصویر سوکت H7 کنار خود جعبه است. تصاویر H1 و H11 از همین شکل بدنه‌اند و تطبیق‌شان با D65 از روی همین خانواده طراحی است، نه از برچسب جدا روی هر سوکت.",
    mappingNote:
      "سوکت H7 در عکس استودیو کنار جعبه D65 دیده می‌شود. نسبت دادن تصاویر H1 و H11 به همین مدل، بر اساس شباهت طرح است.",
    variants: sockets({ H7: true, H1: true, H11: true, "9005": true, H4: false }),
    specs: [
      { label: "برند", value: "EGLXEN" },
      { label: "مدل", value: "D65" },
      { label: "توان", value: "۶۵ وات" },
      { label: "عبارت جعبه", value: "دمای ثابت، روشن‌شدن سریع، روشنایی بالا، عمر طولانی" },
    ],
    claims: [
      { title: "نوشته‌های جعبه", text: "نشان‌های روی جعبه: روشنایی ۵۰۰٪، صرفه‌جویی انرژی ۸۰٪، عمر ۳۰۰٪ بیشتر." },
    ],
    images: [
      img("/images/products/eglxen-d65-studio.jpg", "جعبه EGLXEN مدل D65 کنار لامپ خاکستری", "عکس اصلی. درایور برچسب D65-H7 دارد."),
      img("/images/products/eglxen-d65-h7.jpg", "یک جفت لامپ خاکستری سوکت H7", "سوکت H7."),
      img("/images/products/eglxen-d65-h7-angle.jpg", "زاویه لامپ خاکستری H7", ""),
      img("/images/products/eglxen-d65-h7-angle-2.jpg", "زاویه دیگر لامپ خاکستری H7", ""),
      img("/images/products/eglxen-d65-h7-angle-3.jpg", "نمای خوابیده لامپ خاکستری H7", "تصویر اضافه گالری H7."),
      img("/images/products/eglxen-d65-h1.jpg", "یک جفت لامپ خاکستری سوکت H1", "همان خانواده طراحی؛ تطبیق با D65 از روی شباهت طرح است."),
      img("/images/products/eglxen-d65-h11.jpg", "یک جفت لامپ خاکستری سوکت H11", "همان خانواده طراحی؛ تطبیق با D65 از روی شباهت طرح است."),
      img("/images/products/eglxen-d65-box.jpg", "جعبه EGLXEN مدل D65", "عکس جعبه روی میز."),
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
    shortDescription: "هدلایت EGLXEN مدل D90. هر پنج سوکت H7، H1، H11، 9005 و H4 در فهرست موجودی موجودند.",
    description:
      "روی جعبه عبارت‌های دمای ثابت، روشن‌شدن سریع، روشنایی بالا و عمر طولانی چاپ شده است. تصویر لامپ جدا از جعبه برای این مدل در گالری نیست.",
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
    shortDescription: "مدل D150 با توان ۱۰۰ وات. سوکت 9005 در این مدل ناموجود است. عکس اختصاصی دستگاه هنوز نیست.",
    description:
      "این مدل در فهرست موجودی هست ولی هنوز عکس بسته‌بندی یا لامپ خودش را نداریم. تصویر گالری، چیدمان چند سوکت از خانواده لامپ خاکستری است و عکس خود D150 نیست. سوکت‌های H7، H1، H11 و H4 موجودند و 9005 ناموجود است.",
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
        "این عکس خود مدل D150 نیست؛ فقط چند شکل سوکت را نشان می‌دهد."
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
    shortDescription: "لامپ LED با سوکت نوع D در دو پایه D2S و D4S، هر دو موجود. توان فهرست موجودی ۷۵ وات است.",
    description:
      "این کالا جایگزین لامپ زنون با سوکت D است. هر دو پایه D2S و D4S در فهرست موجودی موجودند و توان هر دو ۷۵ وات ثبت شده است.\n\nعکس گالری یک لامپ LED با هیت‌سینک قرمز را کنار یک لامپ زنون نشان می‌دهد. برچسب گرد درایور زیر سیم کامل خوانا نیست و عدد توان روی آن با ۷۵ وات فهرست یکی دیده نمی‌شود؛ مشخصات فروش را از همین فهرست بگیرید نه از آن برچسب.",
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
        "نمونه تصویر لامپ LED سوکت D. برچسب درایور کامل خوانا نیست."
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
      "فهرست موجودی این لامپ را با دمای رنگ ۶۰۰۰ کلوین و توان ۳۵ وات، برای هر دو پایه D2S و D4S موجود نشان می‌دهد. عکس‌ها یک جفت لامپ زنون را نشان می‌دهند و کد پایه روی خود شیشه خوانده نمی‌شود؛ پایه را موقع استعلام انتخاب کنید.",
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
      "مانیتور اندروید TS18 با پردازنده هشت‌هسته. حافظه در سه ترکیب، صفحه IPS با وضوح ۱۲۸۰ در ۷۲۰، و پشتیبانی از دوربین AHD.",
    description:
      "اندازه اینچ صفحه و خودروهای سازگار هنوز ثبت نشده و باید تأیید شود. این مانیتور محدود به تویوتا نیست.\n\nترکیب حافظه را هنگام استعلام انتخاب کنید: ۲+۳۲، ۴+۶۴ یا ۶+۱۲۸ گیگابایت.",
    fitment: {
      scope: "unknown",
      note: "اندازه صفحه و سازگاری با خودرو ثبت نشده است. نصب روی خودروهای مختلف ممکن است و باید جدا تأیید شود.",
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
      { label: "اندازه صفحه", value: "ثبت نشده؛ باید تأیید شود" },
      { label: "کارپلی و اندروید اتو", value: "دارد" },
      { label: "دوربین", value: "پشتیبانی از دوربین AHD" },
      { label: "خنک‌کننده", value: "فن" },
      { label: "سیم‌کارت", value: "4G" },
      { label: "صدا", value: "DSP" },
    ],
    images: [
      img("/images/products/monitor-ts18.jpg", "مانیتور اندروید TS18", "برش دستگاه، اگر فایل عکس اضافه شده باشد."),
      img("/images/products/monitor-ts18-full.jpg", "تصویر کامل معرفی TS18", "نسخه کامل اسکرین‌شات در گالری."),
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
      "مانیتور اندروید T9 با پردازنده هشت‌هسته، صفحه IPS با وضوح ۱۲۸۰ در ۷۲۰، خروجی تصویر و HDMI، و کارکرد دوربین ۳۶۰ با ضبط جلو و عقب.",
    description:
      "اندازه اینچ صفحه و خودروهای سازگار هنوز ثبت نشده است. این دستگاه محدود به تویوتا نیست.\n\nحافظه در دو ترکیب ۳+۳۲ و ۴+۶۴ گیگابایت عرضه می‌شود و هر ترکیب با سیم‌کارت 4G یا بدون آن قابل سفارش است. هر دو را در فرم استعلام مشخص کنید.",
    fitment: {
      scope: "unknown",
      note: "اندازه صفحه و سازگاری با خودرو ثبت نشده است و باید تأیید شود.",
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
      { label: "اندازه صفحه", value: "ثبت نشده؛ باید تأیید شود" },
      { label: "تصویر", value: "خروجی تصویر و HDMI" },
      { label: "دوربین ۳۶۰", value: "دارد، با ضبط هم‌زمان جلو و عقب" },
      { label: "سیم‌کارت", value: "قابل سفارش با 4G یا بدون آن" },
    ],
    images: [
      img("/images/products/monitor-t9.jpg", "مانیتور اندروید T9", "برش دستگاه، اگر فایل عکس اضافه شده باشد."),
      img("/images/products/monitor-t9-full.jpg", "تصویر کامل معرفی T9", "نسخه کامل اسکرین‌شات در گالری."),
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
      "در تصویر هشت سنسور، براکت‌های نصب، دسته سیم و یک ماژول مشکی با نوشته Parking Assist Module و کد ORS-3313 دیده می‌شود. نصب به خودرو بستگی دارد و محدود به تویوتا نیست.",
    fitment: { scope: "universal", note: "کیت عمومی است و محدود به تویوتا نیست. محل نصب باید روی خود خودرو بررسی شود.", toyota: [] },
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
      "در تصویر دو جک برقی، جعبه کنترل، موتور و مکانیزم قفل، دکمه با علامت صندوق، دسته سیم و چند قطعه نصب دیده می‌شود. خودروهای سازگار هنوز ثبت نشده و باید جدا تأیید شود.",
    fitment: { scope: "unknown", note: "سازگاری با مدل خودرو ثبت نشده است.", toyota: [] },
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
      "تصویر دو شیشه آینه با آیکن هشدار، دو قطعه حسگر، یک بوق و دسته سیم را نشان می‌دهد. شیشه‌ها متن استاندارد هشدار فاصله را دارند. مدل خودرو روی عکس مشخص نیست.",
    fitment: { scope: "unknown", note: "سازگاری شیشه آینه با مدل خودرو باید تأیید شود. کالا محدود به تویوتا معرفی نشده است.", toyota: [] },
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
      "در تصویر دو قطعه مربعی حسگر، یک بوق، دسته سیم و دو نشانگر کوچک مخصوص آینه دیده می‌شود. یکی از برچسب‌های سیم «Left sensor» است و نام برند نیست. خودروهای سازگار ثبت نشده است.",
    fitment: { scope: "universal", note: "کیت عمومی است. محل نصب و سازگاری باید روی خودرو تأیید شود.", toyota: [] },
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
      "روی عکس، عبارت Corolla Cross/Frontlander و بازه ۲۰۲۳ تا ۲۰۲۶ نوشته شده است. قطعات اصلی دو مجموعه موتور، دسته سیم و پنل کلید شیشه با کلید آینه هستند.",
    fitment: {
      scope: "toyota",
      note: "طبق برچسب عکس برای Corolla Cross و Frontlander از ۲۰۲۳ تا ۲۰۲۶.",
      toyota: [{ model: "corolla-cross", yearFrom: 2023, yearTo: 2026, also: ["Frontlander"] }],
    },
    specs: [
      { label: "خودرو", value: "Corolla Cross / Frontlander" },
      { label: "سال", value: "۲۰۲۳ تا ۲۰۲۶" },
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
    shortDescription: "دو پوسته موتور آینه، دکمه، ماژول و دسته سیم. مدل خودرو روی عکس مشخص نیست.",
    description:
      "تصویر دو مجموعه موتور، یک کلید، یک ماژول و چند دسته سیم را نشان می‌دهد. سازگاری با خودرو باید جدا تأیید شود.",
    fitment: { scope: "unknown", note: "مدل خودرو ثبت نشده است.", toyota: [] },
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
      "روی عکس عبارت Corolla Cross/Frontlander 2026، برچسب دوربین عقب و برچسب original ACC plug دیده می‌شود. بدنه برای قرار گرفتن پشت آینه شکل داده شده است.",
    fitment: {
      scope: "toyota",
      note: "طبق برچسب عکس برای Corolla Cross و Frontlander مدل ۲۰۲۶.",
      toyota: [{ model: "corolla-cross", yearFrom: 2026, yearTo: 2026, also: ["Frontlander"] }],
    },
    specs: [
      { label: "خودرو", value: "Corolla Cross / Frontlander" },
      { label: "سال", value: "۲۰۲۶" },
      { label: "اقلام دیده شده", value: "بدنه پشت آینه، دوربین عقب، سوکت ACC" },
    ],
    images: [img("/images/products/cc-dashcam.jpg", "دوربین ثبت وقایع کرولا کراس ۲۰۲۶", "")],
  }),
  base({
    id: "cc-camera",
    seq: 371,
    slug: "corolla-cross-camera-kit",
    sku: "TCI-CC-CAMERA",
    category: "camera",
    title: "کیت دوربین کرولا کراس",
    titleEn: "Corolla Cross camera kit",
    shortDescription: "کیت دوربین با ماژول، دوربین‌ها و دسته سیم برای کرولا کراس.",
    description:
      "روی عکس فقط عبارت Corolla Cross نوشته شده است. تصویر یک ماژول، دوربین و چند دسته سیم را نشان می‌دهد. نوع دقیق سامانه، از جمله ۳۶۰ درجه بودن آن، روی عکس تأیید نشده و اینجا فقط به‌عنوان کیت دوربین معرفی می‌شود.",
    fitment: {
      scope: "toyota",
      note: "برای Corolla Cross. سال ساخت روی عکس نیست و باید سؤال شود.",
      toyota: [{ model: "corolla-cross", yearFrom: 2021, yearTo: 2026 }],
    },
    specs: [{ label: "خودرو", value: "Corolla Cross" }],
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
      "عکس یک ماژول لنز با شیشه شفاف، بدنه تیره و سیم را نشان می‌دهد. مشخصات نوری و خودروهای سازگار هنوز ثبت نشده است.",
    fitment: { scope: "unknown", note: "سازگاری و مشخصات هنوز ثبت نشده است.", toyota: [] },
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
      "در عکس، بدنه با طرح فیبر کربن، حلقه آبی دور لنز، شیشه شفاف و چند سیم دیده می‌شود. مشخصات فنی و سازگاری خودرو هنوز ثبت نشده است.",
    fitment: { scope: "unknown", note: "سازگاری و مشخصات هنوز ثبت نشده است.", toyota: [] },
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
    description: "این مورد یک محصول نمونه برای نشان دادن دسته‌بندی است و موجودی واقعی فروشگاه نیست.",
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
    shortDescription: "نمونه نمایشی برای دسته داخل کابین. موجودی واقعی نیست.",
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
    shortDescription: "نمونه نمایشی برای دسته آفرود. موجودی واقعی نیست.",
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
    shortDescription: "نمونه نمایشی برای دسته چرخ و تعلیق. موجودی واقعی نیست.",
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
    shortDescription: "نمونه نمایشی برای دسته بدنه. موجودی واقعی نیست.",
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
    shortDescription: "نمونه نمایشی برای کمری. موجودی واقعی نیست.",
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
    shortDescription: "نمونه نمایشی برای کرولا. موجودی واقعی نیست.",
    fitment: { scope: "toyota", note: "نمونه سازگاری.", toyota: [{ model: "corolla", yearFrom: 2019, yearTo: 2024 }] },
  })
);

module.exports = catalog;
