/* ==========================================================================
   BRAND VITALS · Dashboard (CMS)
   Edits the real site files in the browser and publishes them to GitHub in
   one commit. Vercel rebuilds and serves whatever is published.
   The access code only locks this screen. Publishing needs a GitHub token
   that stays in the admin's own browser.
   ========================================================================== */
(() => {
  "use strict";

  /* ======================================================================
     CONSTANTS
     ====================================================================== */
  // Each brand has its own dashboard: dashboard.html?brand=frames etc. Form ids stay as stored (studio, live, hq, recruit).
  const BRANDS = {
    bv: { name: "Brand Vitals", home: "index.html", logo: "assets/img/logo-light.svg", forms: ["contact", "consult", "lead", "careers", "vitals-score", "forecast"] },
    frames: { name: "Vitals Frames", home: "frames.html", logo: "assets/img/brands/frames-light.svg", forms: ["studio"] },
    web: { name: "Vitals Web", home: "web.html", logo: "assets/img/brands/web-light.svg", forms: ["web"] },
    stage: { name: "Vitals Stage", home: "stage.html", logo: "assets/img/brands/stage-light.svg", forms: ["live"] },
    go: { name: "Vitals GO", home: "go.html", logo: "assets/img/brands/go-light.svg", forms: ["hq"] },
    crew: { name: "Vitals Crew", home: "crew.html", logo: "assets/img/brands/crew-light.svg", forms: ["crew"] },
    jobs: { name: "Vitals Hire", home: "hire.html", logo: "assets/img/brands/jobs-light.svg", forms: ["recruit"] }
  };
  // Old brand keys (before the rename) still open the right dashboard and match saved pages.
  const BRAND_ALIAS = { studio: "frames", live: "stage", hq: "go", recruit: "jobs" };
  const brandKey = b => BRAND_ALIAS[b] || b;
  const BRAND = (() => { try { const b = brandKey(new URLSearchParams(location.search).get("brand")); return BRANDS[b] ? b : "bv"; } catch (e) { return "bv"; } })();
  const B = BRANDS[BRAND];
  const HOME = B.home;
  const SUB_PAGES = ["frames.html", "web.html", "stage.html", "go.html", "crew.html", "hire.html"];
  const PAGE_BRAND = { "frames.html": "frames", "web.html": "web", "stage.html": "stage", "go.html": "go", "crew.html": "crew", "hire.html": "jobs" };
  const pageBrand = p => brandKey((p && p.brand) || (p && PAGE_BRAND[p.path])) || "bv";
  const ALL_CORE_PAGES = [
    { path: "index.html", ar: "الرئيسية", en: "Home" },
    { path: "solutions.html", ar: "الخدمات", en: "Services" },
    { path: "work.html", ar: "أعمالنا", en: "Work" },
    { path: "about.html", ar: "من نحن", en: "About" },
    { path: "products.html", ar: "الأسعار", en: "Pricing" },
    { path: "contact.html", ar: "تواصل", en: "Contact" },
    { path: "careers.html", ar: "الوظائف", en: "Careers" },
    { path: "frames.html", ar: "Vitals Frames", en: "Vitals Frames" },
    { path: "web.html", ar: "Vitals Web", en: "Vitals Web" },
    { path: "stage.html", ar: "Vitals Stage", en: "Vitals Stage" },
    { path: "go.html", ar: "Vitals GO", en: "Vitals GO" },
    { path: "crew.html", ar: "Vitals Crew", en: "Vitals Crew" },
    { path: "hire.html", ar: "Vitals Hire", en: "Vitals Hire" },
    { path: "blog.html", ar: "المدونة", en: "Blog" },
    { path: "vitals-score.html", ar: "فحص Vitals المجاني", en: "Free Vitals Score" },
    { path: "performance-marketing.html", ar: "خدمة: تسويق الأداء", en: "Service: Performance marketing" },
    { path: "google-ads.html", ar: "خدمة: إعلانات جوجل", en: "Service: Google Ads" },
    { path: "seo.html", ar: "خدمة: السيو", en: "Service: SEO" },
    { path: "branding.html", ar: "خدمة: العلامة والإبداع", en: "Service: Brand & creative" },
    { path: "web-cro.html", ar: "خدمة: المواقع والتحويل", en: "Service: Websites & CRO" },
    { path: "analytics-tracking.html", ar: "خدمة: التحليلات والتتبع", en: "Service: Analytics & tracking" },
    { path: "ecommerce-marketing.html", ar: "قطاع: التجارة الإلكترونية", en: "Industry: E-commerce" },
    { path: "real-estate-marketing.html", ar: "قطاع: العقارات", en: "Industry: Real estate" },
    { path: "healthcare-marketing.html", ar: "قطاع: الرعاية الصحية", en: "Industry: Healthcare" },
    { path: "case-luxury-beauty.html", ar: "دراسة حالة: الجمال الفاخر", en: "Case: Luxury beauty" },
    { path: "case-heritage-fashion.html", ar: "دراسة حالة: الأزياء التراثية", en: "Case: Heritage fashion" },
    { path: "case-architectural-products.html", ar: "دراسة حالة: منتجات معمارية", en: "Case: Architectural products" },
    { path: "case-healthcare-group.html", ar: "دراسة حالة: مجموعة طبية", en: "Case: Healthcare group" },
    { path: "case-national-hypermarket.html", ar: "دراسة حالة: هايبرماركت", en: "Case: National hypermarket" },
    { path: "case-luxury-real-estate.html", ar: "دراسة حالة: عقارات فاخرة", en: "Case: Luxury real estate" },
    { path: "blog-creative-testing.html", ar: "مقال: اختبار الإبداع", en: "Article: Creative testing" },
    { path: "blog-prospecting-vs-retargeting.html", ar: "مقال: الاستكشاف وإعادة الاستهداف", en: "Article: Prospecting vs retargeting" },
    { path: "blog-focus-your-catalog.html", ar: "مقال: تركيز الكتالوج", en: "Article: Focus your catalog" },
    { path: "blog-ecommerce-kpi-stack.html", ar: "مقال: مؤشرات التجارة الإلكترونية", en: "Article: E-commerce KPI stack" },
    { path: "blog-b2b-to-b2c.html", ar: "مقال: من B2B إلى B2C", en: "Article: B2B to B2C" },
    { path: "blog-arabic-seo-guide.html", ar: "مقال: دليل السيو العربي", en: "Article: Arabic SEO guide" },
    { path: "blog-ksa-seasons.html", ar: "مقال: مواسم السعودية", en: "Article: Saudi calendar" },
    { path: "blog-ksa-snapchat.html", ar: "مقال: سناب شات في السعودية", en: "Article: Snapchat in KSA" },
    { path: "blog-egypt-pricing.html", ar: "مقال: التسويق والأسعار في مصر", en: "Article: Egypt pricing" },
    { path: "blog-egypt-whatsapp.html", ar: "مقال: واتساب في مصر", en: "Article: WhatsApp in Egypt" },
    { path: "privacy.html", ar: "سياسة الخصوصية", en: "Privacy policy" },
    { path: "terms.html", ar: "الشروط والأحكام", en: "Terms of service" },
    { path: "404.html", ar: "صفحة الخطأ 404", en: "404 page" }
  ];
  const CORE_PAGES = ALL_CORE_PAGES.filter(p => pageBrand(p) === BRAND);
  // ?page=about.html (the footer's dashboard link) opens that page in the Pages tab.
  const START_PAGE = (() => { try { const p = new URLSearchParams(location.search).get("page"); return CORE_PAGES.some(x => x.path === p) ? p : null; } catch (e) { return null; } })();
  const CSS_PATH = "assets/css/main.css";
  const JS_PATH = "assets/js/main.js";
  const CONFIG_PATH = "cms/config.json";
  const EXTRA_FILES = ["robots.txt", "sitemap.xml"];
  const CONSULT = "@consult";
  const DEFAULT_HASH = "57d90183cd97055f3107832356966582f75077a3655c25ec04cf0ebf510fa0ec";
  const SALT = "bv-cms|";
  const DEFAULT_REPO = { owner: "brandvitals-Ui-Ux-Team", repo: "brand-vitals", branch: "main" };
  const LS = {
    token: "bv-cms-token", repo: "bv-cms-repo", lang: "bv-cms-lang", draft: "bv-cms-draft-v1" + (BRAND === "bv" ? "" : "-" + BRAND),
    session: "bv-cms-session", remember: "bv-cms-remember", preview: "bv-cms-preview",
    sbCfg: "bv-cms-sb", sbAuth: "bv-cms-sb-auth", sbEmail: "bv-cms-sb-email", noTrack: "bv-no-track"
  };
  const SHARED = [
    { sel: "header.nav", ar: "القائمة العلوية", en: "Top navigation" },
    { sel: "nav.drawer", ar: "قائمة الموبايل", en: "Mobile menu" },
    { sel: "footer.footer", ar: "الفوتر (أسفل الموقع)", en: "Footer" }
  ];
  const MODAL_RE = /(tpl\.innerHTML = `)([\s\S]*?)(`;)/;
  const SVG_NS = "http://www.w3.org/2000/svg";

  const DEFAULT_PALETTE = {
    "--d-bg": "#05080B", "--d-bg-2": "#081016", "--d-surface": "#0B1319", "--d-surface-2": "#101B23",
    "--d-text": "#ECF3F6", "--d-text-2": "#9DADB8", "--d-text-3": "#748490", "--d-line": "#D6ECF5",
    "--d-accent": "#00CFFF", "--d-accent-2": "#00E0C6", "--d-accent-ink": "#02141B",
    "--l-bg": "#F5F7F9", "--l-bg-2": "#ECF0F3", "--l-surface": "#FFFFFF", "--l-surface-2": "#F2F5F7",
    "--l-text": "#07131B", "--l-text-2": "#475864", "--l-text-3": "#5E6D77", "--l-line": "#081822",
    "--l-accent": "#007299", "--l-accent-2": "#007A6A", "--l-accent-ink": "#FFFFFF",
    "--danger": "#FF7A85"
  };
  const PALETTE_KEYS = [
    ["bg", "الخلفية الأساسية", "Background"],
    ["bg-2", "خلفية ثانوية", "Background 2"],
    ["surface", "خلفية الكروت", "Cards"],
    ["surface-2", "خلفية الكروت الثانوية", "Cards 2"],
    ["text", "النص الأساسي", "Text"],
    ["text-2", "النص الثانوي", "Secondary text"],
    ["text-3", "النص الخافت", "Muted text"],
    ["line", "لون الخطوط والحدود", "Lines and borders"],
    ["accent", "لون البراند الأساسي", "Brand accent"],
    ["accent-2", "لون البراند الثاني (التدرج)", "Accent 2 (gradient)"],
    ["accent-ink", "لون النص فوق الأزرار", "Text on accent"]
  ];
  const PRESETS = [
    { id: "brand", ar: "Brand Vitals الأصلي", en: "Brand Vitals original", d: ["#00CFFF", "#00E0C6", "#02141B"], l: ["#007299", "#007A6A", "#FFFFFF"] },
    { id: "emerald", ar: "زمردي", en: "Emerald", d: ["#2EE6A6", "#9BF26B", "#03170F"], l: ["#08956A", "#3C9A1E", "#FFFFFF"] },
    { id: "violet", ar: "بنفسجي", en: "Violet", d: ["#9D8CFF", "#5CC8FF", "#0C0726"], l: ["#5B4BE0", "#1B7FD1", "#FFFFFF"] },
    { id: "amber", ar: "كهرماني", en: "Amber", d: ["#FFB547", "#FF7A59", "#1F1200"], l: ["#B86A00", "#C8441B", "#FFFFFF"] },
    { id: "rose", ar: "وردي", en: "Rose", d: ["#FF6B9A", "#FFA36C", "#24050F"], l: ["#C92A5E", "#D2561A", "#FFFFFF"] }
  ];
  const FONTS = [
    { name: "Alexandria", w: "300;400;500;600;700;800", ar: true },
    { name: "IBM Plex Sans Arabic", w: "300;400;500;600;700", ar: true },
    { name: "Cairo", w: "300;400;500;600;700;800", ar: true },
    { name: "Tajawal", w: "300;400;500;700;800", ar: true },
    { name: "Almarai", w: "300;400;700;800", ar: true },
    { name: "Noto Kufi Arabic", w: "300;400;500;600;700;800", ar: true },
    { name: "Noto Sans Arabic", w: "300;400;500;600;700;800", ar: true },
    { name: "Readex Pro", w: "300;400;500;600;700", ar: true },
    { name: "Rubik", w: "300;400;500;600;700;800", ar: true },
    { name: "Changa", w: "300;400;500;600;700;800", ar: true },
    { name: "El Messiri", w: "400;500;600;700", ar: true },
    { name: "Baloo Bhaijaan 2", w: "400;500;600;700;800", ar: true },
    { name: "Inter", w: "300;400;500;600;700;800" },
    { name: "Manrope", w: "300;400;500;600;700;800" },
    { name: "Plus Jakarta Sans", w: "300;400;500;600;700;800" },
    { name: "Sora", w: "300;400;500;600;700;800" },
    { name: "Outfit", w: "300;400;500;600;700;800" },
    { name: "DM Sans", w: "300;400;500;600;700;800" },
    { name: "Poppins", w: "300;400;500;600;700;800" },
    { name: "Montserrat", w: "300;400;500;600;700;800" },
    { name: "Space Grotesk", w: "300;400;500;600;700" },
    { name: "Syne", w: "400;500;600;700;800" },
    { name: "Unbounded", w: "300;400;500;600;700;800" },
    { name: "Playfair Display", w: "400;500;600;700;800" },
    { name: "Fraunces", w: "300;400;500;600;700;800" }
  ];
  const TOKEN_LABELS = {
    "--fs-hero": ["حجم عنوان الواجهة الرئيسية", "Hero title size"],
    "--fs-h1": ["حجم العنوان الكبير H1", "H1 size"],
    "--fs-h2": ["حجم عناوين الأقسام H2", "Section title size (H2)"],
    "--fs-h3": ["حجم العناوين الفرعية H3", "Subtitle size (H3)"],
    "--fs-lead": ["حجم الفقرات التمهيدية", "Lead paragraph size"],
    "--fs-body": ["حجم النص الأساسي", "Body text size"],
    "--gutter": ["الهامش الجانبي للصفحة", "Page side gutter"],
    "--container": ["أقصى عرض للمحتوى", "Content max width"],
    "--container-wide": ["أقصى عرض واسع", "Wide max width"],
    "--section-y": ["المسافة بين الأقسام", "Section spacing"],
    "--section-y-tight": ["المسافة بين الأقسام (مضغوطة)", "Tight section spacing"],
    "--r-sm": ["استدارة الحواف الصغيرة", "Small radius"],
    "--r-md": ["استدارة الحواف المتوسطة", "Medium radius"],
    "--r-lg": ["استدارة الحواف الكبيرة", "Large radius"],
    "--r-xl": ["استدارة الحواف الأكبر", "XL radius"],
    "--r-pill": ["استدارة الأزرار", "Pill radius"],
    "--font-mono": ["خط الأرقام والرموز", "Mono font"]
  };
  const LIST_NAMES = [
    [/acc-item/, "الأسئلة", "Questions"], [/nav__link|drawer__link/, "روابط القائمة", "Menu links"],
    [/chip|tag/, "الوسوم", "Tags"], [/^OPTION/, "الاختيارات", "Options"], [/^LI/, "عناصر القائمة", "List items"],
    [/btn/, "الأزرار", "Buttons"], [/tick/, "الأرقام", "Stats"], [/field/, "حقول النموذج", "Form fields"],
    [/monitor__row/, "صفوف المؤشرات", "Rows"], [/process-step|step/, "الخطوات", "Steps"],
    [/industry/, "القطاعات", "Industries"], [/result/, "النتائج", "Results"], [/case-card/, "المشاريع", "Projects"],
    [/svc-card|service/, "الخدمات", "Services"], [/post/, "المقالات", "Posts"], [/job|role/, "الوظائف", "Roles"],
    [/plan|price/, "الباقات", "Plans"], [/tile/, "المميزات", "Highlights"], [/\btab\b/, "التبويبات", "Tabs"],
    [/card/, "الكروت", "Cards"], [/^P\b/, "الفقرات", "Paragraphs"], [/^A\b/, "الروابط", "Links"],
    [/^IMG/, "الصور", "Images"], [/^SECTION/, "الأقسام", "Sections"]
  ];

  /* ======================================================================
     STRINGS (Arabic first, English second)
     ====================================================================== */
  const T = {
    dashboard: ["لوحة التحكم", "Dashboard"],
    loginSub: ["أدخل كود الدخول للمتابعة", "Enter your access code to continue"],
    code: ["كود الدخول", "Access code"],
    enter: ["دخول", "Sign in"],
    wrongCode: ["الكود غير صحيح، جرّب تاني", "Wrong code, try again"],
    cooldown: ["محاولات كتير، استنى ثواني وجرّب تاني", "Too many attempts, wait a few seconds"],
    remember: ["افتكرني على الجهاز ده", "Remember this device"],
    loginNote: ["لوحة تحكم موقع " + B.name, B.name + " website control panel"],
    loading: ["بيحمّل ملفات الموقع…", "Loading site files…"],
    errLoad: ["مقدرناش نحمّل ملفات الموقع.", "Could not load the site files."],
    retry: ["حاول تاني", "Try again"],
    tabPages: ["الصفحات", "Pages"],
    tabDesign: ["التصميم", "Design"],
    tabGlobal: ["بيانات عامة", "Global"],
    tabImages: ["الصور", "Images"],
    tabFiles: ["الكود", "Code"],
    tabSettings: ["الإعدادات", "Settings"],
    publish: ["نشر", "Publish"],
    publishNow: ["انشر دلوقتي", "Publish now"],
    publishTitle: ["نشر التغييرات على الموقع", "Publish changes to the site"],
    publishIntro: ["هيتم رفع {n} ملف في commit واحد على GitHub، والموقع هيتحدث تلقائيًا.", "{n} file(s) will be pushed to GitHub in one commit and the site will update automatically."],
    commitMsg: ["وصف التعديل (commit)", "Commit message"],
    forcePublish: ["انشر على أي حال (هيستبدل التعديلات اللي اتعملت من برّه)", "Publish anyway (overwrites the outside changes)"],
    conflict: ["الملفات دي اتعدلت على GitHub بعد ما فتحت اللوحة. الأفضل تعيد التحميل من الإعدادات، أو تنشر على أي حال:", "These files changed on GitHub after you opened the dashboard. Reload from Settings, or publish anyway:"],
    stCheck: ["بيتأكد إن محدش عدّل الملفات…", "Checking for outside changes…"],
    stPrep: ["بيجهّز التعديلات…", "Preparing changes…"],
    stUpload: ["بيرفع الصور…", "Uploading images…"],
    stCommit: ["بيعمل commit…", "Creating commit…"],
    stRef: ["بينشر…", "Publishing…"],
    publishedTitle: ["تم النشر بنجاح", "Published"],
    publishedBody: ["التعديلات اترفعت. Vercel بيبني الموقع في دقيقة أو اتنين وبعدها تظهر.", "Your changes are live on GitHub. Vercel rebuilds the site in a minute or two to show them."],
    openSite: ["افتح الموقع", "Open site"],
    viewCommit: ["شوف الـ commit", "View commit"],
    changes: ["{n} تغيير غير منشور", "{n} unpublished"],
    allSaved: ["مفيش تغييرات جديدة", "No unpublished changes"],
    srcGithub: ["متصل بـ GitHub", "Connected to GitHub"],
    srcSite: ["بدون GitHub (قراءة فقط)", "No GitHub (read only)"],
    undo: ["تراجع", "Undo"],
    undone: ["تم التراجع", "Undone"],
    nothingUndo: ["مفيش حاجة للتراجع عنها", "Nothing to undo"],
    preview: ["معاينة", "Preview"],
    previewHint: ["اضغط على أي نص أو صورة في المعاينة عشان تعدّلها", "Click any text or image in the preview to edit it"],
    selectMode: ["وضع التعديل بالضغط", "Click to edit"],
    browseMode: ["وضع التصفح", "Browse"],
    refresh: ["تحديث المعاينة", "Refresh preview"],
    desktop: ["كمبيوتر", "Desktop"],
    tablet: ["تابلت", "Tablet"],
    mobile: ["موبايل", "Mobile"],
    lock: ["قفل اللوحة", "Lock"],
    viewSite: ["الموقع", "Site"],
    uiLang: ["English", "عربي"],
    searchPh: ["ابحث عن أي نص في الصفحة…", "Search any text on this page…"],
    expandAll: ["فتح الكل", "Expand all"],
    collapseAll: ["قفل الكل", "Collapse all"],
    newPage: ["صفحة جديدة", "New page"],
    pageCode: ["كود الصفحة", "Page code"],
    deletePage: ["حذف الصفحة", "Delete page"],
    openLive: ["افتح على الموقع", "Open live"],
    addSection: ["إضافة قسم", "Add section"],
    consultTitle: ["نافذة طلب الاستشارة (Popup)", "Consultation popup"],
    consultNote: ["النافذة دي بتظهر لما الزائر يدوس على أزرار زي «Get a free audit». المعاينة بتفتحها لك تلقائيًا.", "This popup opens from buttons like “Get a free audit”. The preview opens it for you."],
    noConsult: ["مش لاقيين محتوى النافذة في ملف main.js", "Popup content was not found in main.js"],
    seoCard: ["SEO وإعدادات الصفحة", "SEO and page settings"],
    seoPageTitle: ["عنوان الصفحة (يظهر في جوجل والتبويب)", "Page title (Google and browser tab)"],
    seoDesc: ["وصف الصفحة لجوجل", "Meta description"],
    seoCanonical: ["الرابط الأساسي (Canonical)", "Canonical URL"],
    seoRobots: ["الظهور في محركات البحث", "Search engine visibility"],
    robotsIndex: ["ظاهرة في جوجل", "Visible in search"],
    robotsNoindex: ["مخفية عن جوجل", "Hidden from search"],
    seoOgTitle: ["عنوان المشاركة على السوشيال", "Social share title"],
    seoOgDesc: ["وصف المشاركة على السوشيال", "Social share description"],
    seoOgImage: ["صورة المشاركة على السوشيال", "Social share image"],
    seoOgUrl: ["رابط المشاركة", "Social share URL"],
    seoTwTitle: ["عنوان تويتر / X", "Twitter / X title"],
    seoTwDesc: ["وصف تويتر / X", "Twitter / X description"],
    seoFavicon: ["أيقونة الموقع (Favicon)", "Favicon"],
    seoSchema: ["البيانات المنظمة (Schema)", "Structured data (Schema)"],
    jsonBad: ["الكود فيه خطأ ومش هيتحفظ لحد ما يتصلّح:", "Invalid JSON, not saved until fixed:"],
    shared: ["مشترك", "Shared"],
    sharedSub: ["أي تعديل هنا بيتطبّق على كل الصفحات", "Edits here apply to every page"],
    loaderTitle: ["شاشة التحميل", "Loading screen"],
    content: ["المحتوى", "Content"],
    section: ["قسم", "Section"],
    show: ["إظهار", "Show"],
    hide: ["إخفاء", "Hide"],
    hiddenBadge: ["مخفي", "Hidden"],
    shown: ["اتعرض تاني", "Shown"],
    hiddenMsg: ["اتخفى من الموقع", "Hidden from the site"],
    moveUp: ["لفوق", "Move up"],
    moveDown: ["لتحت", "Move down"],
    moved: ["اتنقل", "Moved"],
    duplicate: ["تكرار", "Duplicate"],
    duplicated: ["اتعمل نسخة", "Duplicated"],
    delete: ["حذف", "Delete"],
    deleted: ["اتحذف", "Deleted"],
    editHtml: ["تعديل كود HTML", "Edit HTML"],
    htmlNote: ["تعديل متقدم: الكود ده هو القسم بالكامل. أي تغيير هيتطبق بعد «تطبيق».", "Advanced: this is the full HTML of the block. Changes apply on “Apply”."],
    htmlNoteShared: ["تعديل متقدم: الجزء ده مشترك، والتعديل هيتطبق على كل الصفحات.", "Advanced: this block is shared, the change applies to every page."],
    htmlEmpty: ["الكود فاضي أو مش صالح", "The code is empty or invalid"],
    htmlApplied: ["اتطبق الكود", "HTML applied"],
    apply: ["تطبيق", "Apply"],
    cancel: ["إلغاء", "Cancel"],
    close: ["إغلاق", "Close"],
    noFields: ["مفيش نصوص قابلة للتعديل هنا. استخدم «تعديل كود HTML».", "No editable text here. Use “Edit HTML”."],
    items: ["عناصر", "Items"],
    item: ["عنصر", "Item"],
    lEyebrow: ["العنوان الصغير", "Eyebrow"],
    lH1: ["العنوان الرئيسي", "Main title"],
    lH2: ["عنوان القسم", "Section title"],
    lH3: ["عنوان فرعي", "Subtitle"],
    lLead: ["فقرة تمهيدية", "Lead paragraph"],
    lBtn: ["نص الزر أو الرابط", "Button / link text"],
    lChip: ["وسم", "Tag"],
    lOption: ["اختيار", "Option"],
    lLabel: ["اسم الحقل", "Field label"],
    lErr: ["رسالة الخطأ", "Error message"],
    lItem: ["عنصر قائمة", "List item"],
    lPara: ["فقرة", "Paragraph"],
    lNumber: ["رقم أو قيمة", "Number / value"],
    lText: ["نص", "Text"],
    lQ: ["السؤال", "Question"],
    lA: ["الإجابة", "Answer"],
    gLink: ["رابط", "Link"],
    gBtn: ["زر", "Button"],
    fLink: ["الرابط (URL)", "Link URL"],
    newTab: ["يفتح في تبويب جديد", "Open in new tab"],
    fImage: ["صورة", "Image"],
    fAlt: ["وصف الصورة (Alt)", "Alt text"],
    upload: ["رفع", "Upload"],
    fPlaceholder: ["النص الإرشادي داخل الخانة", "Placeholder"],
    fCount: ["الرقم (بيتعد لحد الرقم ده)", "Counter target number"],
    fCat: ["التصنيف (للفلتر)", "Filter category"],
    fValue: ["القيمة الداخلية", "Internal value"],
    fAria: ["وصف للقارئ الصوتي", "Accessible label"],
    fEmbed: ["رابط التضمين (خريطة أو فيديو)", "Embed URL (map or video)"],
    mapPh: ["اكتب العنوان لإنشاء خريطة جوجل", "Type an address to build a Google map"],
    mapApply: ["عمل خريطة", "Build map"],
    bothLangs: ["نفس النص في اللغتين", "Same text in both languages"],
    dashWarn: ["ممنوع استخدام الشرطة الطويلة (—) في المحتوى، استخدم فاصلة أو نقطة", "Avoid the long dash (—) in content, use a comma or period"],
    designIntro: ["غيّر ألوان وخطوط ومقاسات الموقع كله. المعاينة بتتحدث فورًا.", "Change colors, fonts and sizes across the whole site. The preview updates live."],
    colors: ["الألوان", "Colors"],
    darkMode: ["الوضع الداكن (الأساسي)", "Dark theme (default)"],
    lightMode: ["الوضع الفاتح", "Light theme"],
    presets: ["ألوان جاهزة", "Presets"],
    presetApplied: ["اتطبقت الألوان", "Preset applied"],
    contrast: ["فحص وضوح الألوان", "Contrast check"],
    cTextBg: ["النص على الخلفية", "Text on background"],
    cText2Bg: ["النص الثانوي على الخلفية", "Secondary text on background"],
    cInk: ["نص الزر على لون البراند", "Button text on accent"],
    cAccentBg: ["لون البراند على الخلفية", "Accent on background"],
    fonts: ["الخطوط", "Fonts"],
    fontDisplay: ["خط العناوين", "Headings font"],
    fontBody: ["خط النصوص (إنجليزي)", "Body font (English)"],
    fontAr: ["الخط العربي", "Arabic font"],
    fontsNote: ["الخطوط من Google Fonts وبتتغير في كل الصفحات.", "Fonts load from Google Fonts and change on every page."],
    fontsApplied: ["اتغيرت الخطوط", "Fonts updated"],
    sizes: ["المقاسات والمسافات", "Sizes and spacing"],
    sizesNote: ["تقبل قيم CSS زي 16px أو 1.2rem أو clamp(...)", "Accepts CSS values like 16px, 1.2rem or clamp(...)"],
    advancedCss: ["تعديل متقدم", "Advanced"],
    openCss: ["افتح ملف التصميم main.css", "Open main.css"],
    resetDesign: ["رجّع ألوان Brand Vitals الأصلية", "Restore original Brand Vitals colors"],
    globalIntro: ["بيانات بتظهر في كذا مكان في الموقع. التعديل هنا بيغيّرها في كل الصفحات مرة واحدة.", "Details that appear in many places. Edits here change every page at once."],
    contact: ["بيانات التواصل", "Contact details"],
    cWa: ["رقم واتساب (أرقام بس، بكود الدولة)", "WhatsApp number (digits with country code)"],
    cPhone: ["رقم التليفون كما يظهر", "Phone as displayed"],
    cEmail: ["البريد الإلكتروني", "Email"],
    cAddress: ["العنوان", "Address"],
    cHours: ["مواعيد العمل", "Working hours"],
    applyAll: ["غيّر في كل الموقع", "Change everywhere"],
    replaced: ["اتغيرت {n} مرة", "Replaced {n} time(s)"],
    notFound: ["النص ده مش موجود", "Text not found"],
    findReplace: ["بحث واستبدال في كل الموقع", "Find and replace across the site"],
    findPh: ["ابحث عن…", "Find…"],
    replacePh: ["استبدل بـ…", "Replace with…"],
    matchCase: ["حساس لحالة الحروف", "Match case"],
    inCode: ["يشمل ملفات CSS و JS", "Include CSS and JS files"],
    find: ["بحث", "Find"],
    replaceAll: ["استبدال الكل", "Replace all"],
    matches: ["{n} نتيجة في {f} ملف", "{n} match(es) in {f} file(s)"],
    frNote: ["البحث بيشمل النصوص والروابط وكود الصفحات. راجع النتائج قبل الاستبدال.", "Search covers text, links and page code. Review before replacing."],
    logos: ["اللوجو والأيقونة", "Logo and icon"],
    logoLight: ["اللوجو الفاتح (للخلفية الداكنة)", "Light logo (for dark backgrounds)"],
    logoDark: ["اللوجو الغامق (للخلفية الفاتحة)", "Dark logo (for light backgrounds)"],
    imagesIntro: ["كل الصور المستخدمة في الموقع. تقدر تستبدل أي صورة وهتتغير في كل مكان بتظهر فيه.", "Every image on the site. Replace one and it changes everywhere it appears."],
    uploadNew: ["رفع صورة أو ملف جديد", "Upload a new image or file"],
    uses: ["مستخدمة {n} مرة", "Used {n} time(s)"],
    unused: ["مرفوعة ولسه مش مستخدمة", "Uploaded, not used yet"],
    replaceImg: ["استبدال", "Replace"],
    editPath: ["تغيير الرابط", "Change path"],
    copyPath: ["نسخ الرابط", "Copy path"],
    copied: ["اتنسخ", "Copied"],
    uploaded: ["اترفعت: {p}", "Uploaded: {p}"],
    bigFile: ["الملف كبير جدًا (أقصى حجم 15 ميجا)", "File too large (max 15 MB)"],
    pending: ["هتترفع مع النشر", "Uploads on publish"],
    filesIntro: ["تعديل الكود مباشرة، للمحترفين. اضغط «تطبيق» أو Ctrl+S بعد التعديل.", "Edit the raw code, for experts. Press “Apply” or Ctrl+S."],
    applyCode: ["تطبيق", "Apply"],
    revertFile: ["رجّع النسخة المنشورة", "Revert to published"],
    reverted: ["رجعت النسخة المنشورة", "Reverted"],
    noChange: ["مفيش تغيير", "No change"],
    applied: ["اتطبق", "Applied"],
    lines: ["{n} سطر", "{n} lines"],
    settingsIntro: ["ربط اللوحة بـ GitHub عشان تقدر تنشر، وتغيير كود الدخول.", "Connect GitHub to publish, and change the access code."],
    conn: ["الربط مع GitHub", "GitHub connection"],
    owner: ["اسم الحساب", "Owner"],
    repoName: ["اسم المستودع", "Repository"],
    branch: ["الفرع", "Branch"],
    token: ["توكن GitHub (Fine-grained token)", "GitHub token (fine-grained)"],
    showToken: ["إظهار", "Show"],
    save: ["حفظ", "Save"],
    saved: ["اتحفظ", "Saved"],
    test: ["اختبار الاتصال", "Test connection"],
    testing: ["بيختبر…", "Testing…"],
    connOk: ["الاتصال شغال وعندك صلاحية النشر على {r}", "Connected with publish access to {r}"],
    noToken: ["لسه مفيش توكن. أضفه عشان تقدر تنشر.", "No token yet. Add one to publish."],
    forget: ["مسح التوكن من الجهاز", "Remove token"],
    forgot: ["اتمسح التوكن", "Token removed"],
    tokenHow: ["إزاي تعمل توكن (مرة واحدة بس)", "How to create a token (one time)"],
    tokenSteps: [
      "افتح صفحة إنشاء التوكن على GitHub من الزرار اللي تحت.|اكتب أي اسم، واختار مدة الصلاحية.|من Repository access اختار Only select repositories واختار brand-vitals-website.|من Permissions > Repository permissions خلّي Contents على Read and write.|دوس Generate token، انسخه وحطه هنا ودوس حفظ.",
      "Open GitHub's token page with the button below.|Give it a name and pick an expiry.|Under Repository access choose Only select repositories, then brand-vitals-website.|Under Permissions > Repository permissions set Contents to Read and write.|Click Generate token, copy it here and press Save."
    ],
    openTokenPage: ["افتح صفحة التوكن على GitHub", "Open GitHub token page"],
    tokenNote: ["التوكن بيتحفظ لحد ما تقفل المتصفح، إلا لو اخترت تفتكره على الجهاز ده. عمره ما بيترفع على الموقع. ما تستخدمش اللوحة من جهاز عام.", "The token is kept until you close the browser, unless you choose to remember it on this device. It is never published. Do not use the dashboard on a shared device."],
    rememberToken: ["افتكر التوكن على الجهاز ده", "Remember on this device"],
    access: ["كود الدخول", "Access code"],
    accessNote: ["الكود بيقفل شاشة اللوحة بس. الحماية الحقيقية للنشر هي التوكن.", "The code only locks this screen. Real publishing protection is the token."],
    newCode: ["الكود الجديد", "New code"],
    confirmCode: ["أكّد الكود", "Confirm code"],
    codeMismatch: ["الكودين مش زي بعض", "Codes do not match"],
    codeShort: ["الكود لازم يكون 4 حروف أو أرقام على الأقل", "Use at least 4 characters"],
    codeChanged: ["الكود الجديد هيشتغل بعد النشر", "The new code works after you publish"],
    changeCode: ["تغيير الكود", "Change code"],
    data: ["البيانات", "Data"],
    reload: ["إعادة تحميل الملفات", "Reload files"],
    reloadConfirm: ["عندك تعديلات مش منشورة وهتضيع. تكمل؟", "You have unpublished edits that will be lost. Continue?"],
    discardAll: ["إلغاء كل التعديلات غير المنشورة", "Discard all unpublished edits"],
    discardConfirm: ["متأكد إنك عايز تلغي كل التعديلات غير المنشورة؟", "Discard every unpublished edit?"],
    discarded: ["اتلغت التعديلات", "Edits discarded"],
    source: ["مصدر الملفات: {s}", "Files source: {s}"],
    srcGithubLong: ["GitHub (أحدث نسخة)", "GitHub (latest)"],
    srcSiteLong: ["الموقع المنشور", "Published site"],
    errNetwork: ["مشكلة في الاتصال بالإنترنت أو بـ GitHub", "Network problem reaching GitHub"],
    err401: ["التوكن غلط أو انتهت صلاحيته", "The token is invalid or expired"],
    err403: ["التوكن مالوش صلاحية الكتابة (Contents: Read and write) على المستودع ده", "The token lacks Contents: Read and write on this repository"],
    err404: ["المستودع أو الفرع مش موجود، أو التوكن مش مسموح له بالمستودع ده", "Repository or branch not found, or the token cannot access it"],
    err409: ["حصل تعارض مع تعديل تاني، جرّب تاني", "Conflict with another change, try again"],
    ghFallback: ["مقدرناش نتصل بـ GitHub، الملفات اتحملت من الموقع المنشور:", "Could not reach GitHub, files loaded from the published site:"],
    draftTitle: ["في تعديلات محفوظة", "Saved edits found"],
    draftBody: ["لقينا {n} ملف فيهم تعديلات مش منشورة من {time}. ترجّعهم؟", "Found {n} file(s) with unpublished edits from {time}. Restore them?"],
    draftStale: ["تنبيه: الملفات دي اتغيرت بعدها على الموقع:", "Note: these files changed on the site since:"],
    draftDiscard: ["تجاهل وامسحهم", "Discard"],
    draftRestore: ["رجّع التعديلات", "Restore"],
    draftRestored: ["رجعت التعديلات", "Edits restored"],
    draftSaved: ["اتحفظت كمسودة على الجهاز", "Saved as a draft on this device"],
    draftQuota: ["الصور المرفوعة كبيرة ومش هتتحفظ في المسودة، انشر قبل ما تقفل", "Uploaded images are too big for the draft, publish before closing"],
    newPageTitle: ["إنشاء صفحة جديدة", "Create a new page"],
    npTemplate: ["ابدأ من نسخة من صفحة", "Start from a copy of"],
    npFile: ["اسم الملف (إنجليزي، بدون مسافات)", "File name (no spaces)"],
    npNameEn: ["اسم الصفحة بالإنجليزي", "Page name (English)"],
    npNameAr: ["اسم الصفحة بالعربي", "Page name (Arabic)"],
    npBadFile: ["اسم الملف لازم يكون حروف إنجليزي صغيرة وأرقام وشرطة وينتهي بـ .html", "Use lowercase letters, numbers and hyphens, ending in .html"],
    npExists: ["في صفحة بنفس الاسم", "A page with this name exists"],
    npCreated: ["اتعملت الصفحة. ضيف لها رابط في القائمة من «القائمة العلوية».", "Page created. Link it from the top navigation."],
    create: ["إنشاء", "Create"],
    delPageTitle: ["حذف الصفحة", "Delete page"],
    delPageBody: ["هتتحذف صفحة {p} من الموقع بعد النشر. الروابط اللي بتوديها هتبقى مكسورة.", "{p} will be removed from the site when you publish. Links to it will break."],
    pageDeleted: ["اتحذفت الصفحة", "Page deleted"],
    addSectionTitle: ["إضافة قسم", "Add a section"],
    addSectionFrom: ["انسخ قسم من صفحة", "Copy a section from"],
    sectionAdded: ["اتضاف القسم في آخر الصفحة", "Section added at the end of the page"],
    cantAddHere: ["الصفحة دي مفيهاش أقسام تتضاف عليها", "This page has no sections to add to"],
    needTokenTitle: ["محتاج توكن GitHub", "GitHub token needed"],
    needTokenBody: ["عشان تنشر لازم تربط اللوحة بـ GitHub مرة واحدة من الإعدادات. تعديلاتك محفوظة على الجهاز لحد ما تنشر.", "Connect GitHub once in Settings to publish. Your edits are saved on this device meanwhile."],
    goSettings: ["روح للإعدادات", "Go to settings"],
    nothingToPublish: ["مفيش تغييرات للنشر", "Nothing to publish"],
    k_mod: ["تعديل", "Edited"],
    k_new: ["جديد", "New"],
    k_del: ["حذف", "Deleted"],
    k_img: ["ملف", "File"],
    yes: ["أيوه", "Yes"],
    confirmTitle: ["تأكيد", "Confirm"],
    openFile: ["افتح", "Open"],
    tabOverview: ["نظرة عامة", "Overview"],
    tabLeads: ["العملاء", "Leads"],
    overviewIntro: ["زوار الموقع والعملاء المحتملين في مكان واحد.", "Website visitors and leads in one place."],
    leadsIntro: ["كل الطلبات اللي جت من فورم التواصل ونافذة الاستشارة.", "Every request from the contact form and the consultation popup."],
    lastDays: ["آخر {n} يوم", "Last {n} days"],
    refreshData: ["تحديث", "Refresh"],
    liveNow: ["{n} على الموقع دلوقتي", "{n} on the site now"],
    kVisitors: ["الزوار", "Visitors"],
    kViews: ["مشاهدات الصفحات", "Page views"],
    kLeads: ["عملاء محتملين", "Leads"],
    kConv: ["معدل التحويل", "Conversion rate"],
    kBounce: ["معدل الخروج السريع", "Bounce rate"],
    kPPV: ["صفحات لكل زيارة", "Pages per visit"],
    vsPrev: ["عن الفترة اللي قبلها", "vs previous period"],
    newPeriod: ["جديد", "New"],
    chartOf: ["{m} يوم بيوم", "Daily {m}"],
    showTable: ["عرض الأرقام كجدول", "Show as table"],
    hideTable: ["إخفاء الجدول", "Hide table"],
    colDay: ["اليوم", "Day"],
    topPages: ["أكتر الصفحات زيارة", "Top pages"],
    sources: ["الناس جاية منين", "Traffic sources"],
    devices: ["الأجهزة", "Devices"],
    languages: ["لغة التصفح", "Browsing language"],
    regions: ["الدول (تقريبي)", "Countries (approx.)"],
    regionsNote: ["محسوبة من توقيت الجهاز، من غير أي تتبع للموقع الجغرافي.", "Estimated from the device time zone, no location tracking."],
    latestLeads: ["أحدث العملاء", "Latest leads"],
    leadsByService: ["العملاء حسب الخدمة", "Leads by service"],
    viewAll: ["عرض الكل", "View all"],
    direct: ["دخول مباشر", "Direct"],
    unknown: ["غير معروف", "Unknown"],
    other: ["أخرى", "Other"],
    dMobile: ["موبايل", "Mobile"],
    dDesktop: ["كمبيوتر", "Desktop"],
    dTablet: ["تابلت", "Tablet"],
    noData: ["لسه مفيش بيانات في الفترة دي.", "No data for this period yet."],
    justNow: ["دلوقتي", "just now"],
    loadingData: ["بيحمّل البيانات…", "Loading data…"],
    setupTitle: ["اربط قاعدة البيانات عشان تشوف الزوار والعملاء", "Connect the database to see visitors and leads"],
    setupBody: ["الموقع static ومالوش سيرفر خاص، فالزيارات والطلبات محتاجة مكان تتسجل فيه. هنستخدم Supabase المجاني. الإعداد مرة واحدة بس وبياخد حوالي 10 دقايق.", "The site is static with no server of its own, so visits and requests need somewhere to be stored. We use Supabase's free plan. Setup is one time and takes about 10 minutes."],
    setupStart: ["ابدأ الإعداد", "Start setup"],
    demoShow: ["شوف الشكل ببيانات تجريبية", "Preview with sample data"],
    demoBanner: ["دي بيانات تجريبية للعرض بس، مش زوار أو عملاء حقيقيين.", "Sample data for preview only, not real visitors or leads."],
    demoStop: ["اقفل العرض التجريبي", "Exit sample mode"],
    sbTitle: ["قاعدة البيانات (الزوار والعملاء)", "Database (visitors and leads)"],
    anTitle: ["التتبع والإعلانات (GA4 · Pixel)", "Tracking & ads (GA4 · Pixel)"],
    anIntro: ["حط الأكواد هنا وانشر. الموقع بيحمّلها تلقائيًا مع شريط موافقة على ملفات الارتباط (Consent Mode v2)، وبيبعت أحداث العملاء (Lead) وتواصل واتساب لجوجل وميتا.", "Paste the IDs and publish. The site loads them automatically with a cookie-consent banner (Consent Mode v2) and sends Lead and WhatsApp-contact events to Google and Meta."],
    anSaved: ["اتحفظت الأكواد. انشر عشان تشتغل على الموقع.", "IDs saved. Publish to make them live on the site."],
    anBad: ["فيه كود شكله غلط، راجعه.", "One of the IDs doesn't look right. Please check it."],
    anSave: ["حفظ الأكواد", "Save IDs"],
    sbSteps: [
      "افتح Supabase من الزرار اللي تحت، اعمل حساب مجاني، ودوس New project.|من زرار Connect أو من Project Settings ثم API Keys، انسخ Project URL والمفتاح العام (publishable أو anon) وحطهم تحت ودوس «حفظ الربط».|من Authentication ثم Users دوس Add user، واعمل يوزر بإيميلك وباسورد، وفعّل Auto Confirm User.|اكتب نفس الإيميل في خانة «إيميل الأدمن»، ودوس «نسخ كود الإعداد»، وافتح SQL Editor في Supabase والصق الكود ودوس Run.|سجّل دخول هنا بنفس الإيميل والباسورد، وبعدين انشر الموقع من زرار «نشر» عشان يبدأ يسجّل الزيارات والعملاء.",
      "Open Supabase with the button below, create a free account, and click New project.|From Connect or Project Settings > API Keys, copy the Project URL and the public key (publishable or anon), paste them below and press Save connection.|In Authentication > Users click Add user, create a user with your email and a password, and tick Auto Confirm User.|Type the same email in Admin email, press Copy setup SQL, open the SQL Editor in Supabase, paste and press Run.|Sign in here with that email and password, then publish the site so it starts recording visits and leads."
    ],
    sbOpen: ["افتح Supabase", "Open Supabase"],
    sbUrl: ["رابط المشروع (Project URL)", "Project URL"],
    sbKey: ["المفتاح العام (publishable أو anon key)", "Public key (publishable or anon)"],
    sbKeyNote: ["المفتاح العام آمن يتحط في الموقع لأن البيانات مقفولة بصلاحيات، وما حدش يقدر يقرأها غير الأدمن. ممنوع تحط المفتاح السري (secret أو service_role).", "The public key is safe on the site because the data is locked by row level security and only the admin can read it. Never use the secret or service_role key."],
    sbAdmin: ["إيميل الأدمن", "Admin email"],
    sbSave: ["حفظ الربط", "Save connection"],
    sbCopySql: ["نسخ كود الإعداد (SQL)", "Copy setup SQL"],
    sbShowSql: ["عرض كود الإعداد", "Show setup SQL"],
    sbSqlCopied: ["اتنسخ الكود. الصقه في SQL Editor في Supabase ودوس Run.", "Copied. Paste it into the Supabase SQL Editor and press Run."],
    sbSqlSelect: ["انسخ الكود من المربع يدويًا (Ctrl+C)", "Copy the code from the box manually (Ctrl+C)"],
    sbNeedEmail: ["اكتب إيميل الأدمن صح الأول", "Enter a valid admin email first"],
    sbBadUrl: ["الرابط لازم يبدأ بـ https://", "The URL must start with https://"],
    sbNeedKey: ["حط المفتاح العام", "Add the public key"],
    sbSecretKey: ["ده مفتاح سري (secret أو service_role) وما ينفعش يتحط في الموقع أبدًا. استخدم publishable أو anon.", "That is a secret (secret or service_role) key and must never go on the site. Use the publishable or anon key."],
    sbSavedPublish: ["اتحفظ الربط. انشر الموقع عشان يبدأ يسجّل الزيارات والعملاء.", "Connection saved. Publish the site so it starts recording visits and leads."],
    sbDisconnected: ["اتشال الربط", "Connection removed"],
    sbNotSetup: ["قاعدة البيانات لسه مش مربوطة", "The database is not connected yet"],
    sbNeedLogin: ["محتاج تسجّل دخول قاعدة البيانات", "Sign in to the database first"],
    sbNoTables: ["الجداول مش موجودة لسه. شغّل كود الإعداد (SQL) في Supabase الأول.", "The tables do not exist yet. Run the setup SQL in Supabase first."],
    sbNotAdmin: ["الإيميل ده مش أدمن. شغّل كود الإعداد بنفس الإيميل اللي بتسجّل بيه.", "This email is not an admin. Run the setup SQL with the email you sign in with."],
    sbBadKey: ["الجلسة أو المفتاح مش صالح. سجّل دخول تاني.", "Session or key is not valid. Sign in again."],
    sbBadLogin: ["الإيميل أو الباسورد غلط", "Wrong email or password"],
    sbOk: ["كله شغال. أنت أدمن وتقدر تشوف البيانات.", "All good. You are an admin and can read the data."],
    sbStatusNone: ["لسه مش مربوطة", "Not connected"],
    sbStatusNoLogin: ["مربوطة، ومحتاج تسجّل دخول", "Connected, sign in needed"],
    sbLoginTitle: ["سجّل دخول قاعدة البيانات", "Sign in to the database"],
    sbLoginBody: ["استخدم الإيميل والباسورد اللي عملتهم في Supabase.", "Use the email and password you created in Supabase."],
    email: ["الإيميل", "Email"],
    password: ["الباسورد", "Password"],
    signIn: ["تسجيل الدخول", "Sign in"],
    signOut: ["تسجيل خروج", "Sign out"],
    signedAs: ["مسجّل دخول: {e}", "Signed in as {e}"],
    noTrack: ["ما تحسبش زياراتي من الجهاز ده", "Don't count my visits from this device"],
    leadsEmpty: ["لسه مفيش عملاء. أول ما حد يملأ فورم التواصل هيظهر هنا.", "No leads yet. They appear here as soon as someone fills in a form."],
    leadsNoMatch: ["مفيش نتائج بالبحث ده", "No leads match this search"],
    leadsSearch: ["ابحث بالاسم أو الإيميل أو الرقم أو الشركة…", "Search name, email, phone or company…"],
    allServices: ["كل الخدمات", "All services"],
    all: ["الكل", "All"],
    st_new: ["جديد", "New"],
    st_contacted: ["اتكلمنا معاه", "Contacted"],
    st_qualified: ["مهتم جدًا", "Qualified"],
    st_won: ["بقى عميل", "Won"],
    st_lost: ["مش مهتم", "Lost"],
    exportCsv: ["تصدير Excel", "Export CSV"],
    fStatus: ["الحالة", "Status"],
    fNotes: ["ملاحظات داخلية", "Internal notes"],
    notesPh: ["مثلًا: كلمته يوم الأحد، مستني يبعت الـ brief…", "e.g. Called on Sunday, waiting for the brief…"],
    lEmail: ["الإيميل", "Email"],
    lPhone: ["الموبايل", "Phone"],
    lCompany: ["الشركة", "Company"],
    lService: ["الخدمة", "Service"],
    lBudget: ["الميزانية", "Budget"],
    lSource: ["جه منين", "Source"],
    lPage: ["الصفحة", "Page"],
    lLang: ["اللغة", "Language"],
    lDate: ["التاريخ", "Date"],
    lMessage: ["الرسالة", "Message"],
    formContact: ["فورم التواصل", "Contact form"],
    formConsult: ["نافذة الاستشارة", "Consultation popup"],
    formLead: ["فورم الهوم", "Home lead form"],
    formCareers: ["طلب توظيف", "Job application"],
    formStudio: ["فورم Vitals Frames", "Vitals Frames form"],
    formWeb: ["فورم Vitals Web", "Vitals Web form"],
    formLive: ["فورم Vitals Stage", "Vitals Stage form"],
    formHq: ["فورم Vitals GO (وصول مبكر)", "Vitals GO early access form"],
    formCrew: ["فورم Vitals Crew (بريف أو انضمام)", "Vitals Crew brief or join form"],
    deleteLead: ["حذف", "Delete"],
    deleteLeadQ: ["متأكد إنك عايز تحذف «{n}» نهائيًا؟", "Permanently delete “{n}”?"],
    leadDeleted: ["اتحذف العميل", "Lead deleted"],
    statusSaved: ["اتحفظت الحالة", "Status saved"],
    notesSaved: ["اتحفظت الملاحظات", "Notes saved"],
    waBtn: ["واتساب", "WhatsApp"],
    callBtn: ["اتصال", "Call"],
    mailBtn: ["إيميل", "Email"]
  };

  /* ======================================================================
     UTILITIES
     ====================================================================== */
  const $ = (s, r = document) => r.querySelector(s);
  const parser = new DOMParser();
  // Trailing whitespace after </html> would be moved into <body> on every
  // parse, so it is trimmed to keep parse + serialize byte-stable.
  const parseHTML = s => parser.parseFromString(String(s).replace(/\s+$/, ""), "text/html");
  const serialize = d => "<!DOCTYPE html>\n" + d.documentElement.outerHTML + "\n";
  const isHtml = p => /\.html?$/i.test(p);
  const norm = s => (s == null ? null : String(s).replace(/\r\n/g, "\n"));
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const clean = s => (s || "").replace(/\s+/g, " ").trim();
  const clip = (s, n = 64) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  const safeJSON = s => { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } };
  const siteBase = () => new URL("./", location.href).href;
  const debounce = (fn, ms) => { let tm; return (...a) => { clearTimeout(tm); tm = setTimeout(() => fn(...a), ms); }; };
  const fnv = s => { let x = 0x811c9dc5; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 0x01000193); } return (x >>> 0).toString(16); };
  const keepWs = (data, v) => { if (!data.trim()) return v; return data.match(/^\s*/)[0] + v + data.match(/\s*$/)[0]; };
  const escTpl = s => s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  const unescTpl = s => s.replace(/\\([\\`$])/g, "$1");

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
    sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    sdel(k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  /* ======================================================================
     STATE
     ====================================================================== */
  const S = {
    ui: store.get(LS.lang) === "en" ? "en" : "ar",
    repo: Object.assign({}, DEFAULT_REPO, safeJSON(store.get(LS.repo)) || {}),
    token: store.sget(LS.token) || store.get(LS.token) || "",
    codeHash: DEFAULT_HASH,
    source: "site",
    ghError: "",
    pages: CORE_PAGES.slice(),
    orig: {}, docs: {}, base: {}, text: {},
    uploads: {}, cache: {},
    deleted: new Set(),
    tab: START_PAGE ? "pages" : "overview", page: START_PAGE || HOME, file: HOME,
    open: new Set(), seq: 0, keys: new WeakMap(), fieldByKey: new Map(),
    undo: [], lastUndo: null,
    preview: Object.assign({ device: "desktop", lang: "en", theme: "dark", select: true }, safeJSON(store.get(LS.preview)) || {}),
    search: "", loaded: false, consult: null, consultSrc: null, designMode: "d",
    fails: 0, lockUntil: 0, fromPreview: false, lastHl: null
  };

  const t = (k, vars) => {
    const e = T[k];
    let s = e ? e[S.ui === "ar" ? 0 : 1] : k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.split("{" + a + "}").join(String(b));
    return s;
  };

  /* ---------- DOM helpers ---------- */
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v;
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (k === "value" || k === "checked" || k === "disabled" || k === "hidden" || k === "open" || k === "selected") el[k] = v;
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  const ICONS = {
    pages: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    design: '<circle cx="13.5" cy="6.5" r="1.3"/><circle cx="17.5" cy="10.5" r="1.3"/><circle cx="8.5" cy="7.5" r="1.3"/><circle cx="6.5" cy="12.5" r="1.3"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2z"/>',
    global: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    images: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    files: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    up: '<path d="m18 15-6-6-6 6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M17.9 17.9A10 10 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A9 9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2M1 1l22 22"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.8 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
    publish: '<path d="M16 16l-4-4-4 4M12 12v9"/><path d="M20.4 18.4A5 5 0 0 0 18 9h-1.3A8 8 0 1 0 3 16.3"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    desktop: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    tablet: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 18h.01"/>',
    cursor: '<path d="m4 4 7 16 2.5-6.5L20 11z"/>',
    hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    warn: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    refresh: '<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7l10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    branch: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6M18 9a9 9 0 0 1-9 9"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M12 12v6M9 15h6"/>',
    lang: '<path d="M5 8h10M9 4v4M7 8c0 4 3 7 7 8M13 8c-.5 3-3 6-7 8"/><path d="m13 20 4-9 4 9M14.5 17h5"/>',
    type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    drop: '<path d="M12 2.7 17.7 8.3a8 8 0 1 1-11.3 0z"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.7-4 3-9 3s-9-1.3-9-3M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-12.8 7.2L3 20l1.4-4.9A8.4 8.4 0 1 1 21 11.5z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    overview: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    replace: '<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>'
  };
  const icon = (n, cls) => h("span", { class: "ico" + (cls ? " " + cls : ""), "aria-hidden": "true", html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[n] || "") + "</svg>" });

  function btn(label, ic, fn, cls) {
    return h("button", { type: "button", class: "btn" + (cls ? " " + cls.split(" ").map(c => "btn--" + c).join(" ") : ""), onclick: fn }, ic ? icon(ic) : null, label ? h("span", null, label) : null);
  }
  function ctrlBtn(ic, title, fn, disabled, danger) {
    return h("button", {
      type: "button", class: "cb" + (danger ? " cb--danger" : ""), title, "aria-label": title, disabled: !!disabled,
      onclick: e => { e.preventDefault(); e.stopPropagation(); fn(); }
    }, icon(ic));
  }

  /* ---------- toasts, modals ---------- */
  function toast(msg, o = {}) {
    if (typeof o === "string") o = { kind: o };
    const ms = o.ms || 3800;
    const el = h("div", { class: "toast" + (o.kind ? " toast--" + o.kind : ""), role: "status" },
      o.kind === "err" || o.kind === "warn" ? icon("warn") : o.kind === "ok" ? icon("check") : null,
      h("span", { class: "toast__msg" }, msg),
      o.undo ? h("button", { type: "button", class: "toast__btn", onclick: () => { undo(); el.remove(); } }, t("undo")) : null);
    $("#toasts").append(el);
    setTimeout(() => el.classList.add("is-out"), ms);
    setTimeout(() => el.remove(), ms + 400);
  }

  function modal({ title, body, actions = [], foot, wide }) {
    const root = $("#modal-root");
    const dlg = h("div", { class: "mdl" + (wide ? " mdl--wide" : ""), role: "dialog", "aria-modal": "true", "aria-label": title });
    const wrap = h("div", { class: "mdl-wrap" }, dlg);
    const onKey = e => { if (e.key === "Escape") close(); };
    const close = () => { wrap.remove(); document.removeEventListener("keydown", onKey); };
    wrap.addEventListener("mousedown", e => { if (e.target === wrap) close(); });
    const footEl = h("div", { class: "mdl__foot" });
    for (const a of actions) {
      footEl.append(h("button", {
        type: "button", class: "btn" + (a.primary ? " btn--primary" : "") + (a.danger ? " btn--danger" : ""),
        onclick: async () => { if (a.fn) { const r = await a.fn(); if (r === false) return; } close(); }
      }, a.label));
    }
    if (foot) footEl.append(...[].concat(foot));
    dlg.append(
      h("div", { class: "mdl__head" }, h("h3", null, title), h("button", { type: "button", class: "cb", "aria-label": t("close"), onclick: close }, icon("close"))),
      h("div", { class: "mdl__body" }, body),
      footEl.childNodes.length ? footEl : null);
    root.append(wrap);
    document.addEventListener("keydown", onKey);
    setTimeout(() => { const f = dlg.querySelector(".mdl__body input:not([type=checkbox]), .mdl__body textarea, .mdl__body select"); if (f) f.focus(); }, 40);
    return { close, dlg, foot: footEl };
  }
  function confirmBox(msg, danger) {
    return new Promise(res => {
      let done = false;
      const m = modal({
        title: t("confirmTitle"), body: h("p", null, msg),
        actions: [{ label: t("cancel"), fn: () => { done = true; res(false); } }, { label: t("yes"), primary: !danger, danger: !!danger, fn: () => { done = true; res(true); } }]
      });
      const obs = new MutationObserver(() => { if (!m.dlg.isConnected) { obs.disconnect(); if (!done) res(false); } });
      obs.observe($("#modal-root"), { childList: true });
    });
  }

  /* ======================================================================
     GITHUB + FILE LOADING
     ====================================================================== */
  const GH = {
    base() { return "/repos/" + encodeURIComponent(S.repo.owner) + "/" + encodeURIComponent(S.repo.repo); },
    async req(path, opts = {}) {
      const headers = Object.assign({ Accept: "application/vnd.github+json", Authorization: "Bearer " + S.token }, opts.headers || {});
      if (opts.body) headers["Content-Type"] = "application/json";
      let res;
      try {
        res = await fetch("https://api.github.com" + path, { method: opts.method || "GET", headers, body: opts.body, cache: "no-store" });
      } catch (e) { const err = new Error(t("errNetwork")); err.status = 0; throw err; }
      if (!res.ok) {
        let msg = "";
        try { msg = (await res.json()).message || ""; } catch (e) { /* ignore */ }
        const err = new Error(msg || res.statusText); err.status = res.status; throw err;
      }
      if (opts.raw) return res.text();
      return res.status === 204 ? null : res.json();
    },
    raw(p) {
      const path = p.split("/").map(encodeURIComponent).join("/");
      return this.req(this.base() + "/contents/" + path + "?ref=" + encodeURIComponent(S.repo.branch), { raw: true, headers: { Accept: "application/vnd.github.raw+json" } });
    }
  };
  function ghErrorText(e) {
    if (!e) return "";
    if (e.status === 0) return t("errNetwork");
    if (e.status === 401) return t("err401");
    if (e.status === 403) return t("err403");
    if (e.status === 404) return t("err404");
    if (e.status === 409 || e.status === 422) return t("err409") + (e.message ? " (" + e.message + ")" : "");
    return e.message || String(e);
  }
  async function fetchText(p) {
    if (S.source === "github") {
      try { return await GH.raw(p); } catch (e) { if (e.status === 404) return null; throw e; }
    }
    const r = await fetch(p + (p.includes("?") ? "&" : "?") + "cms=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return null;
    return await r.text();
  }

  function cfg() { return safeJSON(S.text[CONFIG_PATH]) || {}; }
  function setCfg(o) { S.text[CONFIG_PATH] = JSON.stringify(o, null, 2) + "\n"; }
  function syncPages() {
    const c = cfg();
    const list = Array.isArray(c.pages) && c.pages.length ? c.pages.filter(p => p && p.path) : ALL_CORE_PAGES;
    S.pages = list.filter(p => pageBrand(p) === BRAND);
    for (const p of CORE_PAGES) if (!S.pages.some(q => q.path === p.path)) S.pages.push(p);
  }
  // Pages of the other brands, kept untouched when this dashboard saves the config.
  function otherPages(c) {
    const list = Array.isArray(c.pages) && c.pages.length ? c.pages.filter(p => p && p.path) : ALL_CORE_PAGES;
    return list.filter(p => pageBrand(p) !== BRAND);
  }
  const htmlPaths = () => Object.keys(S.docs);
  const pageName = p => { const x = S.pages.find(q => q.path === p); return x ? (x[S.ui] || x.en || p) : p; };
  const repoId = () => S.repo.owner + "/" + S.repo.repo + "@" + S.repo.branch;

  async function loadAll() {
    S.source = "site"; S.ghError = "";
    if (S.token) {
      try { await GH.req(GH.base()); S.source = "github"; }
      catch (e) { S.ghError = ghErrorText(e); }
    }
    const cfgText = await fetchText(CONFIG_PATH).catch(() => null);
    S.orig = {}; S.docs = {}; S.base = {}; S.text = {}; S.uploads = {}; S.deleted = new Set();
    S.undo = []; S.consult = null; S.lastUndo = null;
    S.orig[CONFIG_PATH] = cfgText;
    if (cfgText != null) S.text[CONFIG_PATH] = cfgText;
    syncPages();
    const paths = [...S.pages.map(p => p.path), CSS_PATH, JS_PATH, ...EXTRA_FILES];
    const got = await Promise.all(paths.map(p => fetchText(p).then(x => [p, x])));
    for (const [p, x] of got) {
      if (isHtml(p)) {
        if (x == null) continue;
        S.orig[p] = x;
        const d = parseHTML(x);
        S.docs[p] = d; S.base[p] = serialize(d);
      } else {
        S.orig[p] = x;
        if (x != null) S.text[p] = x;
      }
    }
    if (S.text[CSS_PATH] == null || !S.docs[HOME]) throw new Error(t("errLoad"));
    S.pages = S.pages.filter(p => S.docs[p.path]);
    if (S.page !== CONSULT && !S.docs[S.page]) S.page = HOME;
    const c = cfg();
    if (typeof c.codeHash === "string" && /^[0-9a-f]{64}$/.test(c.codeHash)) S.codeHash = c.codeHash;
    S.loaded = true;
  }

  /* ---------- file state ---------- */
  function currentText(p) { if (S.docs[p]) return serialize(S.docs[p]); return S.text[p]; }
  function setText(p, txt) {
    if (isHtml(p)) {
      if (txt == null) { delete S.docs[p]; return; }
      S.docs[p] = parseHTML(txt);
      if (!(p in S.base)) S.base[p] = "";
    } else if (txt == null) delete S.text[p];
    else S.text[p] = txt;
    if (p === JS_PATH) S.consult = null;
  }
  function dirtyList() {
    const out = [];
    for (const p of Object.keys(S.docs)) if (S.orig[p] == null || serialize(S.docs[p]) !== S.base[p]) out.push(p);
    for (const p of Object.keys(S.text)) if (norm(S.text[p]) !== norm(S.orig[p])) out.push(p);
    for (const p of Object.keys(S.uploads)) out.push(p);
    for (const p of S.deleted) if (!S.docs[p]) out.push(p);
    return out;
  }
  function kindOf(p) {
    if (S.uploads[p]) return "img";
    if (S.deleted.has(p) && !S.docs[p]) return "del";
    if (S.orig[p] == null) return "new";
    return "mod";
  }
  function fileLabel(p) {
    if (isHtml(p)) return pageName(p);
    if (p === CSS_PATH) return S.ui === "ar" ? "ملف التصميم" : "Stylesheet";
    if (p === JS_PATH) return S.ui === "ar" ? "ملف البرمجة (فيه نافذة الاستشارة)" : "Script (includes the popup)";
    if (p === CONFIG_PATH) return S.ui === "ar" ? "إعدادات اللوحة" : "Dashboard config";
    return p.split("/").pop();
  }

  /* ---------- consultation popup (lives inside main.js) ---------- */
  function consultDoc() {
    const js = S.text[JS_PATH] || "";
    if (S.consult && S.consultSrc === js) return S.consult;
    const m = MODAL_RE.exec(js);
    if (!m) return null;
    const d = document.implementation.createHTMLDocument("consult");
    d.body.innerHTML = unescTpl(m[2]);
    S.consult = d; S.consultSrc = js;
    return d;
  }
  function syncConsult() {
    const d = S.consult;
    if (!d) return;
    S.text[JS_PATH] = (S.text[JS_PATH] || "").replace(MODAL_RE, (a, p1, p2, p3) => p1 + escTpl(d.body.innerHTML) + p3);
    S.consultSrc = S.text[JS_PATH];
  }

  /* ======================================================================
     EDIT PIPELINE
     A field edits one element; for shared blocks (nav, drawer, footer) the
     same element is found by position in every other page and edited too.
     ====================================================================== */
  function mkCtx(page, root, shared) { return { page, root, shared: shared || null, after: page === CONSULT ? syncConsult : null }; }
  function affected(ctx) {
    if (ctx.page === CONSULT) return [JS_PATH];
    if (!ctx.shared) return [ctx.page];
    return htmlPaths().filter(p => S.docs[p].querySelector(ctx.shared));
  }
  function elPath(root, el) {
    const p = [];
    while (el && el !== root) {
      const par = el.parentElement;
      if (!par) return null;
      p.unshift(Array.prototype.indexOf.call(par.children, el));
      el = par;
    }
    return el === root ? p : null;
  }
  function elAt(root, path) { let n = root; for (const i of path) { n = n && n.children[i]; } return n || null; }
  function equivalents(ctx, el) {
    if (!ctx.shared) return [];
    const path = elPath(ctx.root, el);
    if (!path) return [];
    const out = [];
    for (const p of htmlPaths()) {
      if (p === ctx.page) continue;
      const r = S.docs[p].querySelector(ctx.shared);
      if (!r) continue;
      const x = elAt(r, path);
      if (x && x.tagName === el.tagName && x.className === el.className) out.push(x);
    }
    return out;
  }
  function openKey(ctx, el) { return (ctx.shared ? "s|" + ctx.shared : "p|" + ctx.page) + "|" + (elPath(ctx.root, el) || []).join("."); }

  function snapshot(paths, label) {
    const files = {};
    for (const p of paths) files[p] = (p in S.docs || p in S.text) ? currentText(p) : null;
    S.undo.push({ label, files, deleted: [...S.deleted] });
    if (S.undo.length > 60) S.undo.shift();
    refreshUndo();
  }
  function undoMark(paths, key) { if (S.lastUndo === key) return; S.lastUndo = key; snapshot(paths, "edit"); }
  function undo() {
    const s = S.undo.pop();
    if (!s) { toast(t("nothingUndo")); return; }
    for (const [p, x] of Object.entries(s.files)) setText(p, x);
    S.deleted = new Set(s.deleted);
    syncPages();
    if (S.page !== CONSULT && !S.docs[S.page]) S.page = HOME;
    S.lastUndo = null;
    renderTab(true); schedulePreview(0); changed(); refreshUndo();
    toast(t("undone"));
  }

  function edit(ctx, el, fn, key) {
    undoMark(affected(ctx), key);
    fn(el);
    for (const x of equivalents(ctx, el)) fn(x);
    if (ctx.after) ctx.after();
    previewPatch(el, fn);
    changed();
  }
  function structural(ctx, el, op, msg) {
    snapshot(affected(ctx), msg);
    const eq = equivalents(ctx, el);
    op(el); eq.forEach(op);
    if (ctx.after) ctx.after();
    S.lastUndo = null;
    renderTab(true); schedulePreview(0); changed();
    toast(msg, { undo: true });
  }

  /* A block "unit" is the element plus the <!-- comment --> right above it. */
  function unitStart(el) {
    let n = el.previousSibling;
    while (n && n.nodeType === 3 && !n.data.trim()) n = n.previousSibling;
    return n && n.nodeType === 8 ? n : el;
  }
  function unitNodes(el) { const out = []; let n = unitStart(el); while (n) { out.push(n); if (n === el) break; n = n.nextSibling; } return out; }
  function moveBefore(a, b) {
    const sb = unitStart(b);
    const sep = b.nextSibling;
    const sepTxt = sep && sep.nodeType === 3 && !sep.data.trim() ? sep : null;
    for (const n of unitNodes(a)) sb.before(n);
    if (sepTxt) sb.before(sepTxt);
  }
  const OPS = {
    up(el) { const p = el.previousElementSibling; if (p) moveBefore(el, p); },
    down(el) { const n = el.nextElementSibling; if (n) moveBefore(n, el); },
    dup(el) {
      const nodes = unitNodes(el);
      const prev = nodes[0].previousSibling;
      const ws = prev && prev.nodeType === 3 && !prev.data.trim() ? prev.data : "";
      const clones = nodes.map(n => n.cloneNode(true));
      const ce = clones[clones.length - 1];
      if (ce.id) ce.removeAttribute("id");
      el.after(...(ws ? [el.ownerDocument.createTextNode(ws)] : []), ...clones);
    },
    del(el) {
      const nodes = unitNodes(el);
      const prev = nodes[0].previousSibling;
      if (prev && prev.nodeType === 3 && !prev.data.trim()) prev.remove();
      nodes.forEach(n => n.remove());
    },
    hide(el) { el.toggleAttribute("hidden"); }
  };

  /* ======================================================================
     FIELD RENDERING
     ====================================================================== */
  let fseq = 0;
  const nk = () => "f" + (++fseq);
  function keyFor(el) { let k = S.keys.get(el); if (!k) { k = "k" + (++S.seq); S.keys.set(el, k); } return k; }
  function regField(el, wrap) { const k = keyFor(el); if (!S.fieldByKey.has(k)) S.fieldByKey.set(k, wrap); wrap.dataset.k = k; }

  function ctl(value, o = {}) {
    const c = o.long
      ? h("textarea", { class: "inp" + (o.mono ? " inp--mono" : ""), rows: String(o.rows || 2), spellcheck: o.mono ? "false" : null })
      : h("input", { class: "inp" + (o.mono ? " inp--mono" : ""), type: o.type || "text", list: o.list || null });
    c.value = value == null ? "" : value;
    if (o.dir) c.dir = o.dir;
    if (o.placeholder) c.placeholder = o.placeholder;
    return c;
  }
  function fieldBox(label, hint, cls) {
    const wrap = h("div", { class: "fld" + (cls ? " " + cls : "") });
    wrap.dataset.warn = t("dashWarn");
    wrap.append(h("div", { class: "fld__head" }, h("span", { class: "fld__label" }, label), hint ? h("code", { class: "fld__hint" }, hint) : null));
    wrap._search = () => [label, ...[...wrap.querySelectorAll(".inp")].map(i => i.value)].join(" ").toLowerCase();
    return wrap;
  }
  const dashWarn = wrap => wrap.classList.toggle("has-dash", [...wrap.querySelectorAll(".inp")].some(i => i.value.includes("—")));
  function watch(c, key, onVal, wrap) {
    c.addEventListener("focus", () => { S.lastUndo = null; });
    c.addEventListener("input", () => { onVal(c.value); if (wrap) dashWarn(wrap); });
  }
  function counter(c, max) {
    const el = h("span", { class: "cnt" });
    const upd = () => { const n = c.value.length; el.textContent = n + " / " + max; el.classList.toggle("is-over", n > max); };
    c.addEventListener("input", upd); upd();
    return el;
  }

  function labelFor(el) {
    const tag = el.tagName;
    const c = el.classList;
    if (el.closest(".acc-item__btn")) return t("lQ");
    if (el.closest(".acc-item__panel")) return t("lA");
    if (c.contains("eyebrow")) return t("lEyebrow");
    if (tag === "H1" || el.closest("h1")) return t("lH1");
    if (tag === "H2" || el.closest("h2")) return t("lH2");
    if (/^H[3-6]$/.test(tag) || el.closest("h3,h4,h5,h6")) return t("lH3");
    if (c.contains("lead")) return t("lLead");
    if (tag === "OPTION") return t("lOption");
    if (tag === "LABEL") return t("lLabel");
    if (c.contains("err")) return t("lErr");
    if (el.closest("button, a")) return t("lBtn");
    if (c.contains("chip") || c.contains("tag")) return t("lChip");
    if (tag === "LI" || el.closest("li")) return t("lItem");
    if (/num|value|stat|count|unit|idx/.test(el.className)) return t("lNumber");
    if (tag === "P" || el.closest("p")) return t("lPara");
    return t("lText");
  }
  const hintFor = el => { const c = el.classList[0]; return el.tagName.toLowerCase() + (c ? "." + c : ""); };
  const skipEl = el => /^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|BR|HR|META|LINK|BASE)$/.test(el.tagName) || el.namespaceURI === SVG_NS;
  const noText = el => el.matches("[data-year], [data-lang-toggle], [data-count], .loader__pct, .loader__pct *, textarea, select");
  const sigOf = el => el.tagName + "." + (el.classList[0] || "");
  const hasContent = el => !!(clean(el.textContent) || el.matches("img, a[href], iframe") || el.querySelector("img, a[href], iframe, input, textarea, select"));

  function biField(el, ctx) {
    const wrap = fieldBox(labelFor(el), hintFor(el), "fld--bi");
    const en0 = el.getAttribute("data-en") || "", ar0 = el.getAttribute("data-ar") || "";
    const len = Math.max(en0.length, ar0.length);
    const long = len > 64 || (/^(P|LI|BLOCKQUOTE|DD)$/.test(el.tagName) && len > 36);
    const key = nk();
    const row = (lang, val) => {
      const c = ctl(val, { long, dir: lang === "ar" ? "rtl" : "ltr" });
      c.lang = lang;
      watch(c, key + lang, v => setBi(el, ctx, lang, v, key + lang), wrap);
      return h("div", { class: "bi" }, h("span", { class: "bi__tag" }, lang === "ar" ? "ع" : "EN"), c);
    };
    wrap.append(row("en", en0), row("ar", ar0));
    dashWarn(wrap);
    regField(el, wrap);
    return wrap;
  }
  function setBi(el, ctx, lang, v, key) {
    const at = "data-" + lang, old = el.getAttribute(at);
    edit(ctx, el, x => {
      if (x.getAttribute(at) !== old) return;
      x.setAttribute(at, v);
      if (lang === "en") { const ia = x.getAttribute("data-i18n-attr"); if (ia) x.setAttribute(ia, v); else x.textContent = v; }
    }, key);
  }
  function textField(el, node, ctx) {
    const wrap = fieldBox(labelFor(el), hintFor(el));
    const idx = Array.prototype.indexOf.call(el.childNodes, node);
    const val = node.data.trim();
    const c = ctl(val, { long: val.length > 64, dir: "auto" });
    const key = nk();
    watch(c, key, v => {
      const old = node.data.trim();
      edit(ctx, el, x => { const n = x.childNodes[idx]; if (!n || n.nodeType !== 3 || n.data.trim() !== old) return; n.data = keepWs(n.data, v); }, key);
    }, wrap);
    wrap.append(h("div", { class: "bi" }, h("span", { class: "bi__tag bi__tag--both", title: t("bothLangs") }, "EN·ع"), c));
    dashWarn(wrap);
    regField(el, wrap);
    return wrap;
  }
  function attrField(el, ctx, attr, label, o = {}) {
    const wrap = fieldBox(label, o.hint || null);
    const key = nk();
    const c = ctl(el.getAttribute(attr) || "", { dir: o.dir || "auto", type: o.type, long: o.long, list: o.list });
    watch(c, key, v => {
      const old = el.getAttribute(attr);
      edit(ctx, el, x => { if (x.getAttribute(attr) !== old) return; x.setAttribute(attr, v); }, key);
    }, wrap);
    wrap.append(c);
    regField(el, wrap);
    return wrap;
  }
  function biAttrField(el, ctx, aEn, aAr, label, mirror) {
    const wrap = fieldBox(label, hintFor(el), "fld--bi");
    const key = nk();
    for (const [lang, at] of [["en", aEn], ["ar", aAr]]) {
      const c = ctl(el.getAttribute(at) || "", { dir: lang === "ar" ? "rtl" : "ltr" });
      watch(c, key + lang, v => {
        const old = el.getAttribute(at);
        edit(ctx, el, x => { if (x.getAttribute(at) !== old) return; x.setAttribute(at, v); if (lang === "en" && mirror) x.setAttribute(mirror, v); }, key + lang);
      }, wrap);
      wrap.append(h("div", { class: "bi" }, h("span", { class: "bi__tag" }, lang === "ar" ? "ع" : "EN"), c));
    }
    regField(el, wrap);
    return wrap;
  }
  function linkField(el, ctx) {
    const wrap = fieldBox(t("fLink"), null, "fld--link");
    const key = nk();
    const c = ctl(el.getAttribute("href") || "", { dir: "ltr", list: "cms-links" });
    watch(c, key, v => {
      const old = el.getAttribute("href");
      edit(ctx, el, x => { if (x.getAttribute("href") !== old) return; x.setAttribute("href", v); }, key);
    });
    const nb = h("input", { type: "checkbox" });
    nb.checked = el.getAttribute("target") === "_blank";
    nb.addEventListener("change", () => {
      const on = nb.checked;
      S.lastUndo = null;
      edit(ctx, el, x => {
        if (on) {
          x.setAttribute("target", "_blank");
          if (!/noopener/.test(x.getAttribute("rel") || "")) x.setAttribute("rel", ((x.getAttribute("rel") || "") + " noopener").trim());
        } else {
          x.removeAttribute("target");
          const r = (x.getAttribute("rel") || "").replace(/\bnoopener\b/, "").trim();
          if (r) x.setAttribute("rel", r); else x.removeAttribute("rel");
        }
      }, key + "nb");
    });
    wrap.append(c, h("label", { class: "chk" }, nb, h("span", null, t("newTab"))));
    regField(el, wrap);
    return wrap;
  }

  function assetUrl(src) {
    if (!src) return "";
    const u = S.uploads[src] || S.cache[src];
    if (u) return u.url;
    try { return new URL(src, siteBase()).href; } catch (e) { return src; }
  }
  const upUrl = src => { const u = S.uploads[src] || S.cache[src]; return u ? u.url : null; };

  function imageField(el, ctx) {
    const wrap = fieldBox(t("fImage"), hintFor(el), "fld--img");
    const key = nk();
    const thumb = h("img", { class: "thumb__img", alt: "" });
    thumb.src = assetUrl(el.getAttribute("src"));
    const c = ctl(el.getAttribute("src") || "", { dir: "ltr" });
    const setSrc = (v, dims) => {
      const old = el.getAttribute("src");
      edit(ctx, el, x => {
        if (x.getAttribute("src") !== old) return;
        x.setAttribute("src", v);
        x.removeAttribute("srcset");
        if (dims && dims.w && dims.h) {
          const hh = parseFloat(x.getAttribute("height")), ww = parseFloat(x.getAttribute("width"));
          if (hh) x.setAttribute("width", String(Math.round(hh * dims.w / dims.h)));
          else if (ww) x.setAttribute("height", String(Math.round(ww * dims.h / dims.w)));
        }
      }, key);
      thumb.src = assetUrl(v);
    };
    watch(c, key, v => setSrc(v));
    const up = uploadBtn(async file => {
      const u = await addUpload(file);
      if (!u) return;
      S.lastUndo = null;
      c.value = u.path;
      setSrc(u.path, u);
    });
    const alt = ctl(el.getAttribute("alt") || "", { dir: "auto" });
    watch(alt, key + "a", v => {
      const old = el.getAttribute("alt");
      edit(ctx, el, x => { if (x.getAttribute("alt") !== old) return; x.setAttribute("alt", v); }, key + "a");
    });
    wrap.append(
      h("div", { class: "thumb" }, h("div", { class: "thumb__box" }, thumb), h("div", { class: "thumb__side" }, c, up)),
      h("div", { class: "sub" }, h("span", { class: "sub__label" }, t("fAlt")), alt));
    regField(el, wrap);
    return wrap;
  }
  function iframeField(el, ctx) {
    const wrap = attrField(el, ctx, "src", t("fEmbed"), { dir: "ltr", long: true });
    if (/google\.[^/]+\/maps/.test(el.getAttribute("src") || "")) {
      const q = h("input", { class: "inp", placeholder: t("mapPh") });
      const b = btn(t("mapApply"), "global", () => {
        const v = q.value.trim();
        if (!v) return;
        const inp = wrap.querySelector("textarea, input");
        inp.value = "https://www.google.com/maps?q=" + encodeURIComponent(v) + "&output=embed";
        S.lastUndo = null;
        inp.dispatchEvent(new Event("input"));
      }, "sm");
      wrap.append(h("div", { class: "row" }, q, b));
    }
    return wrap;
  }

  function attrFields(el, out, ctx) {
    const tag = el.tagName;
    if (tag === "IMG") out.append(imageField(el, ctx));
    if (tag === "IFRAME" && el.hasAttribute("src")) out.append(iframeField(el, ctx));
    if (el.hasAttribute("data-en-ph")) out.append(biAttrField(el, ctx, "data-en-ph", "data-ar-ph", t("fPlaceholder"), "placeholder"));
    else if (el.hasAttribute("placeholder")) out.append(attrField(el, ctx, "placeholder", t("fPlaceholder"), { dir: "auto", hint: hintFor(el) }));
    if (el.hasAttribute("data-count")) out.append(attrField(el, ctx, "data-count", t("fCount"), { type: "number", dir: "ltr" }));
    if (el.hasAttribute("data-cat")) out.append(attrField(el, ctx, "data-cat", t("fCat"), { dir: "ltr", hint: "data-cat" }));
    if (tag === "OPTION" && el.hasAttribute("value")) out.append(attrField(el, ctx, "value", t("fValue"), { dir: "ltr", hint: "value" }));
    if ((tag === "A" || tag === "BUTTON") && el.hasAttribute("aria-label") && !clean(el.textContent)) out.append(attrField(el, ctx, "aria-label", t("fAria"), { dir: "auto", hint: "aria-label" }));
  }

  /* Contiguous siblings with the same tag + first class form an editable list. */
  function repeatRuns(el) {
    const map = new Map();
    const kids = [...el.children];
    let i = 0;
    while (i < kids.length) {
      const k = kids[i];
      if (skipEl(k) || k.matches("span.wr")) { i++; continue; }
      const sig = sigOf(k);
      let j = i + 1;
      while (j < kids.length && !skipEl(kids[j]) && sigOf(kids[j]) === sig) j++;
      const items = kids.slice(i, j);
      if ((items.length >= 2 || /^(LI|ARTICLE)$/.test(k.tagName)) && items.some(hasContent)) {
        const run = { sig, items };
        items.forEach(x => map.set(x, run));
      }
      i = j;
    }
    return map;
  }
  function walk(el, out, ctx) {
    if (skipEl(el)) return;
    const isLink = el.tagName === "A" && el.hasAttribute("href");
    let target = out;
    if (isLink) {
      target = h("div", { class: "grp" }, h("div", { class: "grp__head" }, icon("link"), h("span", null, t(el.classList.contains("btn") ? "gBtn" : "gLink"))));
      out.append(target);
    }
    if (el.hasAttribute("data-en")) target.append(biField(el, ctx));
    attrFields(el, target, ctx);
    if (!el.hasAttribute("data-en")) {
      const runs = repeatRuns(el);
      const seen = new Set();
      for (const n of [...el.childNodes]) {
        if (n.nodeType === 3) { if (n.data.trim() && !noText(el)) target.append(textField(el, n, ctx)); continue; }
        if (n.nodeType !== 1 || skipEl(n)) continue;
        const run = runs.get(n);
        if (run) { if (!seen.has(run)) { seen.add(run); target.append(listBlock(run, ctx)); } continue; }
        walk(n, target, ctx);
      }
    }
    if (isLink) target.append(linkField(el, ctx));
  }
  function listName(run) {
    const f = run.items[0];
    const sig = f.tagName + " " + f.className;
    for (const [re, ar, en] of LIST_NAMES) if (re.test(sig)) return S.ui === "ar" ? ar : en;
    return t("items");
  }
  function itemTitle(el) {
    const pick = x => clean(S.ui === "ar" ? (x.getAttribute("data-ar") || x.getAttribute("data-en")) : x.getAttribute("data-en")) || clean(x.textContent);
    const hd = el.querySelector("h1,h2,h3,h4,h5,h6");
    let s = hd ? pick(hd) : "";
    if (!s && el.hasAttribute("data-en")) s = pick(el);
    if (!s) s = clean(el.textContent);
    if (!s) {
      const img = el.tagName === "IMG" ? el : el.querySelector("img");
      if (img) s = img.getAttribute("alt") || img.getAttribute("src") || "";
      else s = el.getAttribute("aria-label") || el.getAttribute("href") || "";
    }
    return clip(s || t("item"));
  }
  function listBlock(run, ctx) {
    const box = h("div", { class: "lst" }, h("div", { class: "lst__head" }, icon("layers"), h("span", { class: "lst__title" }, listName(run)), h("span", { class: "lst__n" }, String(run.items.length))));
    run.items.forEach((it, i) => box.append(itemCard(it, i, run, ctx)));
    return box;
  }
  function itemCard(it, i, run, ctx) {
    const key = openKey(ctx, it);
    const n = run.items.length;
    const det = h("details", { class: "it" + (it.hidden ? " is-hidden" : "") });
    det.open = S.open.has(key);
    det.addEventListener("toggle", () => { if (det.open) S.open.add(key); else S.open.delete(key); });
    det.append(
      h("summary", { class: "it__head" },
        h("span", { class: "it__chev" }, icon("chev")),
        h("span", { class: "it__n" }, String(i + 1).padStart(2, "0")),
        h("span", { class: "it__title" }, itemTitle(it)),
        it.hidden ? h("span", { class: "badge badge--muted" }, t("hiddenBadge")) : null,
        h("span", { class: "ctrls" },
          ctrlBtn(it.hidden ? "eyeOff" : "eye", t(it.hidden ? "show" : "hide"), () => structural(ctx, it, OPS.hide, t(it.hidden ? "shown" : "hiddenMsg"))),
          ctrlBtn("up", t("moveUp"), () => structural(ctx, it, OPS.up, t("moved")), i === 0),
          ctrlBtn("down", t("moveDown"), () => structural(ctx, it, OPS.down, t("moved")), i === n - 1),
          ctrlBtn("copy", t("duplicate"), () => structural(ctx, it, OPS.dup, t("duplicated"))),
          ctrlBtn("trash", t("delete"), () => structural(ctx, it, OPS.del, t("deleted")), n <= 1, true))),
      (() => { const b = h("div", { class: "it__body" }); walk(it, b, ctx); if (!b.childNodes.length) b.append(h("p", { class: "muted small" }, t("noFields"))); return b; })());
    return det;
  }
  function regionCard({ key, idx, title, sub, el, ctx, ctrls = [], badge, hidden, cls }) {
    const det = h("details", { class: "rg" + (hidden ? " is-hidden" : "") + (cls ? " " + cls : "") });
    det.open = S.open.has(key);
    det.addEventListener("toggle", () => { if (det.open) S.open.add(key); else S.open.delete(key); });
    det.append(h("summary", { class: "rg__head" },
      h("span", { class: "rg__chev" }, icon("chev")),
      idx ? h("span", { class: "rg__idx" }, idx) : null,
      h("span", { class: "rg__titles" }, h("span", { class: "rg__title" }, title), sub ? h("span", { class: "rg__sub" }, sub) : null),
      badge || null,
      hidden ? h("span", { class: "badge badge--muted" }, t("hiddenBadge")) : null,
      h("span", { class: "ctrls" }, ctrls)));
    const body = h("div", { class: "rg__body" });
    if (el) walk(el, body, ctx);
    if (!body.childNodes.length) body.append(h("p", { class: "muted small" }, t("noFields")));
    det.append(body);
    return det;
  }

  /* ---------- uploads ---------- */
  function uploadBtn(cb, accept, label) {
    const inp = h("input", { type: "file", accept: accept || "image/*", hidden: true });
    inp.addEventListener("change", async () => {
      const f = inp.files[0];
      inp.value = "";
      if (!f) return;
      try { await cb(f); } catch (e) { toast(e.message || String(e), "err"); }
    });
    const b = btn(label || t("upload"), "upload", () => inp.click(), "sm");
    return h("span", { class: "upw" }, b, inp);
  }
  const blobToDataUrl = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
  const slug = s => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 40);
  const stamp = () => { const d = new Date(); const p = n => String(n).padStart(2, "0"); return "" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()); };
  async function imageDims(url) {
    try { const im = new Image(); im.src = url; await im.decode(); return { w: im.naturalWidth, h: im.naturalHeight }; } catch (e) { return { w: 0, h: 0 }; }
  }
  async function addUpload(file) {
    if (file.size > 15 * 1024 * 1024) { toast(t("bigFile"), "err"); return null; }
    let blob = file;
    let ext = ((file.name.match(/\.([a-z0-9]+)$/i) || [])[1] || "bin").toLowerCase();
    const raster = /^image\/(png|jpe?g|webp)$/.test(file.type);
    if (raster && (file.size > 600 * 1024)) {
      try {
        const bmp = await createImageBitmap(file);
        const scale = Math.min(1, 2400 / bmp.width);
        const cv = document.createElement("canvas");
        cv.width = Math.round(bmp.width * scale); cv.height = Math.round(bmp.height * scale);
        cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
        const out = await new Promise(r => cv.toBlob(r, "image/webp", 0.86));
        if (out && out.size < file.size) { blob = out; ext = "webp"; }
      } catch (e) { /* keep original */ }
    }
    const url = await blobToDataUrl(blob);
    const b64 = url.slice(url.indexOf(",") + 1);
    const dir = /^image\//.test(file.type) ? "assets/img/uploads" : "assets/files";
    const path = dir + "/" + stamp() + "-" + (slug(file.name.replace(/\.[^.]+$/, "")) || "file") + "." + ext;
    const dims = /^image\//.test(blob.type || file.type) ? await imageDims(url) : { w: 0, h: 0 };
    S.uploads[path] = { b64, url, size: blob.size, w: dims.w, h: dims.h };
    changed();
    toast(t("uploaded", { p: path }), "ok");
    return Object.assign({ path }, S.uploads[path]);
  }

  /* ======================================================================
     PAGES TAB
     ====================================================================== */
  function sections(doc) {
    const main = doc.querySelector("main");
    if (!main) return [];
    const kids = [...main.children].filter(c => !c.matches("footer.footer, script, style, template"));
    if (!kids.some(k => k.tagName === "SECTION")) return [main];
    return kids;
  }
  function regionTitle(sec, i) {
    let n = sec.previousSibling;
    while (n && n.nodeType === 3 && !n.data.trim()) n = n.previousSibling;
    let name = "";
    if (n && n.nodeType === 8) { const m = n.data.match(/=+\s*(.+?)\s*=+/); if (m) name = m[1]; }
    const pick = x => x ? clean(S.ui === "ar" ? (x.getAttribute("data-ar") || x.getAttribute("data-en")) : x.getAttribute("data-en")) || clean(x.textContent) : "";
    const eb = sec.querySelector(".eyebrow"), hd = sec.querySelector("h1, h2");
    const sub = pick(hd) || pick(eb);
    if (!name) {
      if (sec.tagName === "MAIN") name = t("content");
      else if (sec.matches(".hero, .page-hero")) name = "Hero";
      else name = pick(eb).replace(/^\d+\s*·\s*/, "") || t("section") + " " + (i + 1);
    }
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return { name: clip(name, 40), sub: clip(sub, 70) };
  }

  function renderPages() {
    const P = $("#panel");
    P.append(pagesBar());
    const list = h("div", { class: "regions" });
    if (S.page === CONSULT) {
      const d = consultDoc();
      if (!d) { P.append(h("p", { class: "muted" }, t("noConsult"))); return; }
      list.append(h("p", { class: "note" }, icon("layers"), h("span", null, t("consultNote"))));
      const ctx = mkCtx(CONSULT, d.body);
      if (!S.open.has("consult")) S.open.add("consult");
      list.append(regionCard({ key: "consult", idx: "◆", title: t("consultTitle"), el: d.body, ctx, ctrls: [ctrlBtn("code", t("editHtml"), () => { S.file = JS_PATH; setTab("files"); })] }));
      P.append(list);
      applySearch(S.search);
      return;
    }
    const doc = S.docs[S.page];
    if (!doc) return;
    list.append(seoCard(S.page));
    const body = doc.body;
    for (const sh of SHARED.slice(0, 2)) { const r = body.querySelector(sh.sel); if (r) list.append(sharedCard(sh, r)); }
    const loader = body.querySelector(":scope > .loader");
    if (loader) list.append(sectionCard(loader, 0, 1, { idx: "◌", title: t("loaderTitle"), fixed: true }));
    const secs = sections(doc);
    secs.forEach((sec, i) => list.append(sectionCard(sec, i, secs.length, sec.tagName === "MAIN" ? { fixed: true, noHide: true } : {})));
    if (secs.length && secs[0].tagName !== "MAIN") {
      list.append(h("button", { type: "button", class: "addsec", onclick: addSectionModal }, icon("plus"), h("span", null, t("addSection"))));
    }
    const ft = body.querySelector("footer.footer");
    if (ft) list.append(sharedCard(SHARED[2], ft));
    P.append(list);
    applySearch(S.search);
  }
  function sectionCard(sec, i, n, o = {}) {
    const ctx = mkCtx(S.page, sec.ownerDocument.body);
    const key = openKey(ctx, sec);
    const tt = o.title ? { name: o.title, sub: "" } : regionTitle(sec, i);
    const ctrls = [];
    if (!o.noHide) ctrls.push(ctrlBtn(sec.hidden ? "eyeOff" : "eye", t(sec.hidden ? "show" : "hide"), () => structural(ctx, sec, OPS.hide, t(sec.hidden ? "shown" : "hiddenMsg"))));
    if (!o.fixed) {
      ctrls.push(ctrlBtn("up", t("moveUp"), () => structural(ctx, sec, OPS.up, t("moved")), i === 0));
      ctrls.push(ctrlBtn("down", t("moveDown"), () => structural(ctx, sec, OPS.down, t("moved")), i === n - 1));
      ctrls.push(ctrlBtn("copy", t("duplicate"), () => structural(ctx, sec, OPS.dup, t("duplicated"))));
      ctrls.push(ctrlBtn("trash", t("delete"), () => structural(ctx, sec, OPS.del, t("deleted")), n <= 1, true));
    }
    ctrls.push(ctrlBtn("code", t("editHtml"), () => htmlModal(ctx, sec)));
    return regionCard({ key, idx: o.idx || String(i + 1).padStart(2, "0"), title: tt.name, sub: tt.sub, el: sec, ctx, ctrls, hidden: sec.hidden });
  }
  function sharedCard(sh, root) {
    const ctx = mkCtx(S.page, root, sh.sel);
    return regionCard({
      key: "shared|" + sh.sel, idx: "∞", title: sh[S.ui], sub: t("sharedSub"), el: root, ctx, cls: "rg--shared",
      badge: h("span", { class: "badge badge--shared" }, icon("layers"), t("shared")),
      ctrls: [ctrlBtn("code", t("editHtml"), () => htmlModal(ctx, root))]
    });
  }

  function mutateHead(page, fn, key) { undoMark([page], key); fn(S.docs[page]); changed(); }
  function headInsert(d, x) {
    const metas = d.head.querySelectorAll("meta");
    const last = metas[metas.length - 1];
    if (last) last.after(d.createTextNode("\n  "), x); else d.head.append(x);
  }
  function headField(page, o) {
    const d = S.docs[page];
    const el = d.head.querySelector(o.sel);
    const wrap = fieldBox(o.label, o.hint);
    const key = nk();
    const c = ctl(el ? el.getAttribute(o.attr) || "" : "", { dir: o.dir || "ltr", long: o.long });
    watch(c, key, v => mutateHead(page, dd => {
      let x = dd.head.querySelector(o.sel);
      if (!x) {
        if (!v) return;
        x = dd.createElement(o.tag || "meta");
        for (const [a, b] of Object.entries(o.create)) x.setAttribute(a, b);
        headInsert(dd, x);
      }
      x.setAttribute(o.attr, v);
    }, key), wrap);
    wrap.append(c);
    if (o.max) wrap.querySelector(".fld__head").append(counter(c, o.max));
    if (o.image) {
      const thumb = h("img", { class: "thumb__img", alt: "" });
      const upd = () => { thumb.src = assetUrl(c.value.replace(/^https?:\/\/[^/]+\//, "")); };
      c.addEventListener("input", upd); upd();
      const up = uploadBtn(async file => {
        const u = await addUpload(file);
        if (!u) return;
        c.value = o.absolute ? canonicalOrigin() + "/" + u.path : u.path;
        S.lastUndo = null;
        c.dispatchEvent(new Event("input"));
      });
      c.remove();
      wrap.append(h("div", { class: "thumb" }, h("div", { class: "thumb__box" }, thumb), h("div", { class: "thumb__side" }, c, up)));
    }
    return wrap;
  }
  function canonicalOrigin() {
    const l = S.docs[HOME] && S.docs[HOME].querySelector('link[rel="canonical"]');
    try { return new URL(l.getAttribute("href")).origin; } catch (e) { return "https://brandvitals.io"; }
  }
  function seoCard(page) {
    const d = S.docs[page];
    const key = "seo|" + page;
    const det = h("details", { class: "rg rg--seo" });
    det.open = S.open.has(key);
    det.addEventListener("toggle", () => { if (det.open) S.open.add(key); else S.open.delete(key); });
    det.append(h("summary", { class: "rg__head" }, h("span", { class: "rg__chev" }, icon("chev")), h("span", { class: "rg__idx" }, icon("search")),
      h("span", { class: "rg__titles" }, h("span", { class: "rg__title" }, t("seoCard")), h("span", { class: "rg__sub" }, page))));
    const body = h("div", { class: "rg__body" });
    const root = d.documentElement;
    // Title (both languages)
    const tw = fieldBox(t("seoPageTitle"), "<title>", "fld--bi");
    const k = nk();
    const en = ctl(root.getAttribute("data-title-en") || d.title, { dir: "ltr" });
    const ar = ctl(root.getAttribute("data-title-ar") || "", { dir: "rtl" });
    watch(en, k + "e", v => mutateHead(page, dd => { dd.documentElement.setAttribute("data-title-en", v); dd.title = v; }, k + "e"), tw);
    watch(ar, k + "a", v => mutateHead(page, dd => dd.documentElement.setAttribute("data-title-ar", v), k + "a"), tw);
    tw.append(h("div", { class: "bi" }, h("span", { class: "bi__tag" }, "EN"), en), h("div", { class: "bi" }, h("span", { class: "bi__tag" }, "ع"), ar));
    tw.querySelector(".fld__head").append(counter(en, 60));
    body.append(tw);
    body.append(headField(page, { sel: 'meta[name="description"]', attr: "content", label: t("seoDesc"), long: true, max: 160, dir: "auto", create: { name: "description" } }));
    // Robots
    const rb = d.head.querySelector('meta[name="robots"]');
    const rv = rb ? rb.getAttribute("content") : "index, follow";
    const rw = fieldBox(t("seoRobots"), "robots");
    const rs = h("select", { class: "inp sel" });
    const opts = [["index, follow, max-image-preview:large", t("robotsIndex")], ["noindex, nofollow", t("robotsNoindex")]];
    if (!opts.some(o => o[0] === rv)) opts.unshift([rv, rv]);
    for (const [v, l] of opts) rs.append(h("option", { value: v }, l));
    rs.value = rv;
    rs.addEventListener("change", () => { S.lastUndo = null; mutateHead(page, dd => { let x = dd.head.querySelector('meta[name="robots"]'); if (!x) { x = dd.createElement("meta"); x.setAttribute("name", "robots"); headInsert(dd, x); } x.setAttribute("content", rs.value); }, "robots" + page); });
    rw.append(rs);
    body.append(rw);
    body.append(headField(page, { sel: 'link[rel="canonical"]', attr: "href", label: t("seoCanonical"), tag: "link", create: { rel: "canonical" } }));
    body.append(h("div", { class: "divider" }, "Open Graph"));
    body.append(headField(page, { sel: 'meta[property="og:title"]', attr: "content", label: t("seoOgTitle"), dir: "auto", max: 70, create: { property: "og:title" } }));
    body.append(headField(page, { sel: 'meta[property="og:description"]', attr: "content", label: t("seoOgDesc"), dir: "auto", long: true, max: 200, create: { property: "og:description" } }));
    body.append(headField(page, { sel: 'meta[property="og:image"]', attr: "content", label: t("seoOgImage"), image: true, absolute: true, create: { property: "og:image" } }));
    body.append(headField(page, { sel: 'meta[property="og:url"]', attr: "content", label: t("seoOgUrl"), create: { property: "og:url" } }));
    body.append(headField(page, { sel: 'meta[name="twitter:title"]', attr: "content", label: t("seoTwTitle"), dir: "auto", create: { name: "twitter:title" } }));
    body.append(headField(page, { sel: 'meta[name="twitter:description"]', attr: "content", label: t("seoTwDesc"), dir: "auto", long: true, create: { name: "twitter:description" } }));
    body.append(headField(page, { sel: 'link[rel~="icon"]', attr: "href", label: t("seoFavicon"), image: true, tag: "link", create: { rel: "icon" } }));
    // JSON-LD
    const lds = d.head.querySelectorAll('script[type="application/ld+json"]');
    lds.forEach((s, i) => {
      const w = fieldBox(t("seoSchema") + (lds.length > 1 ? " " + (i + 1) : ""), "JSON-LD");
      const c = ctl(s.textContent.trim(), { long: true, mono: true, dir: "ltr", rows: 8 });
      const msg = h("div", { class: "fld__msg" });
      const kk = nk();
      watch(c, kk, v => {
        try {
          JSON.parse(v);
          msg.textContent = ""; c.classList.remove("is-bad");
          mutateHead(page, dd => { const x = dd.head.querySelectorAll('script[type="application/ld+json"]')[i]; if (x) x.textContent = "\n  " + v + "\n  "; }, kk);
        } catch (e) { msg.textContent = t("jsonBad") + " " + e.message; c.classList.add("is-bad"); }
      });
      w.append(c, msg);
      body.append(w);
    });
    det.append(body);
    return det;
  }

  function pagesBar() {
    const dirty = new Set(dirtyList());
    const sel = h("select", { class: "inp sel pbar__sel", "aria-label": t("tabPages") });
    for (const p of S.pages) sel.append(h("option", { value: p.path }, (dirty.has(p.path) ? "● " : "") + (p[S.ui] || p.en) + "  ·  " + p.path));
    if (BRAND === "bv") sel.append(h("option", { value: CONSULT }, (dirty.has(JS_PATH) ? "● " : "") + t("consultTitle")));
    sel.value = S.page;
    sel.addEventListener("change", () => gotoPage(sel.value));
    const search = h("input", { class: "inp search__inp", type: "search", placeholder: t("searchPh"), "aria-label": t("searchPh") });
    search.value = S.search;
    search.addEventListener("input", debounce(() => { S.search = search.value; applySearch(S.search); }, 140));
    const canDel = S.page !== CONSULT && S.page !== HOME && S.page !== "404.html";
    const tools = h("div", { class: "pbar__tools" },
      ctrlBtn("file", t("newPage"), newPageModal),
      S.page !== CONSULT ? ctrlBtn("code", t("pageCode"), () => { S.file = S.page; setTab("files"); }) : null,
      canDel ? ctrlBtn("trash", t("deletePage"), () => deletePage(S.page), false, true) : null,
      h("a", { class: "cb", href: siteBase() + (S.page === CONSULT ? "" : S.page), target: "_blank", rel: "noopener", title: t("openLive"), "aria-label": t("openLive") }, icon("external")));
    const expand = h("button", { type: "button", class: "btn btn--sm btn--ghost", onclick: () => {
      const all = [...$("#panel").querySelectorAll("details.rg")];
      const anyClosed = all.some(d => !d.open);
      all.forEach(d => { d.open = anyClosed; });
    } }, icon("layers"), h("span", null, t("expandAll")));
    return h("div", { class: "pbar" },
      h("div", { class: "pbar__row" }, sel, tools),
      h("div", { class: "pbar__row" }, h("label", { class: "search" }, icon("search"), search), expand));
  }
  function applySearch(q) {
    const P = $("#panel");
    if (!P) return;
    q = (q || "").trim().toLowerCase();
    P.classList.toggle("is-searching", !!q);
    P.querySelectorAll(".is-match").forEach(x => x.classList.remove("is-match"));
    P.querySelectorAll(".has-match").forEach(x => x.classList.remove("has-match"));
    if (!q) return;
    P.querySelectorAll(".fld").forEach(f => {
      const s = f._search ? f._search() : f.textContent.toLowerCase();
      if (!s.includes(q)) return;
      f.classList.add("is-match");
      let p = f.parentElement;
      while (p && p !== P) { if (p.tagName === "DETAILS") { p.open = true; p.classList.add("has-match"); } else if (p.matches(".lst, .grp")) p.classList.add("has-match"); p = p.parentElement; }
    });
  }
  function gotoPage(p) {
    S.page = p; S.search = "";
    PV.scroll = 0;
    renderTab();
    schedulePreview(0);
  }

  function htmlModal(ctx, el) {
    const ta = h("textarea", { class: "inp inp--mono code", spellcheck: "false", dir: "ltr", wrap: "off" });
    ta.value = el.outerHTML;
    codeKeys(ta);
    modal({
      title: t("editHtml"), wide: true,
      body: [h("p", { class: "muted" }, t(ctx.shared ? "htmlNoteShared" : "htmlNote")), ta],
      actions: [{ label: t("cancel") }, {
        label: t("apply"), primary: true, fn: () => {
          const v = ta.value.trim();
          const probe = document.createElement("template");
          probe.innerHTML = v;
          if (!probe.content.firstElementChild) { toast(t("htmlEmpty"), "err"); return false; }
          structural(ctx, el, x => { x.outerHTML = v; }, t("htmlApplied"));
        }
      }]
    });
  }
  function addSectionModal() {
    const pageSel = h("select", { class: "inp sel" });
    for (const p of S.pages) if (sections(S.docs[p.path]).some(s => s.tagName !== "MAIN")) pageSel.append(h("option", { value: p.path }, p[S.ui] || p.en));
    pageSel.value = S.page;
    if (!pageSel.value) pageSel.value = HOME;
    const list = h("div", { class: "pick" });
    let m;
    const fill = () => {
      list.replaceChildren();
      sections(S.docs[pageSel.value]).forEach((sec, i) => {
        if (sec.tagName === "MAIN") return;
        const tt = regionTitle(sec, i);
        list.append(h("button", { type: "button", class: "pick__it", onclick: () => { insertSection(sec); m.close(); } },
          h("span", { class: "pick__n" }, String(i + 1).padStart(2, "0")), h("span", { class: "pick__t" }, h("b", null, tt.name), h("span", null, tt.sub))));
      });
    };
    pageSel.addEventListener("change", fill);
    fill();
    m = modal({ title: t("addSectionTitle"), body: [h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("addSectionFrom")), pageSel), list], actions: [{ label: t("cancel") }] });
  }
  function insertSection(src) {
    const d = S.docs[S.page];
    const secs = sections(d);
    if (!secs.length || secs[0].tagName === "MAIN") { toast(t("cantAddHere"), "warn"); return; }
    snapshot([S.page], "add");
    const last = secs[secs.length - 1];
    const clone = d.importNode(src, true);
    clone.removeAttribute("id");
    last.after(d.createTextNode("\n\n    "), clone);
    S.open.add(openKey(mkCtx(S.page, d.body), clone));
    S.lastUndo = null;
    renderTab(true); schedulePreview(0); changed();
    toast(t("sectionAdded"), { undo: true, kind: "ok" });
  }
  function newPageModal() {
    const tpl = h("select", { class: "inp sel" });
    for (const p of S.pages) tpl.append(h("option", { value: p.path }, (p[S.ui] || p.en) + "  ·  " + p.path));
    tpl.value = S.page === CONSULT ? HOME : S.page;
    const en = h("input", { class: "inp", dir: "ltr" });
    const ar = h("input", { class: "inp", dir: "rtl" });
    const file = h("input", { class: "inp inp--mono", dir: "ltr", placeholder: "new-page.html" });
    let touched = false;
    file.addEventListener("input", () => { touched = true; });
    en.addEventListener("input", () => { if (!touched) file.value = (slug(en.value) || "page") + ".html"; });
    modal({
      title: t("newPageTitle"),
      body: [
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("npTemplate")), tpl),
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("npNameEn")), en),
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("npNameAr")), ar),
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("npFile")), file)
      ],
      actions: [{ label: t("cancel") }, {
        label: t("create"), primary: true, fn: () => {
          const f = file.value.trim().toLowerCase();
          if (!/^[a-z0-9][a-z0-9-]*\.html$/.test(f)) { toast(t("npBadFile"), "err"); return false; }
          if (S.docs[f]) { toast(t("npExists"), "err"); return false; }
          createPage(tpl.value, f, en.value.trim() || f.replace(".html", ""), ar.value.trim() || en.value.trim() || f);
        }
      }]
    });
  }
  function createPage(from, file, en, ar) {
    snapshot([file, CONFIG_PATH, "sitemap.xml"], "page");
    const d = parseHTML(currentText(from));
    const origin = canonicalOrigin();
    d.documentElement.setAttribute("data-title-en", en + " | " + B.name);
    d.documentElement.setAttribute("data-title-ar", ar + " | " + (BRAND === "bv" ? "براند فايتلز" : B.name));
    d.title = en + " | " + B.name;
    const can = d.head.querySelector('link[rel="canonical"]'); if (can) can.setAttribute("href", origin + "/" + file);
    const ogu = d.head.querySelector('meta[property="og:url"]'); if (ogu) ogu.setAttribute("content", origin + "/" + file);
    S.docs[file] = d; S.base[file] = ""; S.orig[file] = S.orig[file] == null ? null : S.orig[file];
    S.deleted.delete(file);
    const c = cfg();
    c.pages = otherPages(c).concat(S.pages, [Object.assign({ path: file, ar, en }, BRAND === "bv" ? {} : { brand: BRAND })]);
    if (!c.codeHash) c.codeHash = S.codeHash;
    setCfg(c); syncPages();
    const sm = S.text["sitemap.xml"];
    if (sm && sm.includes("</urlset>") && !sm.includes("/" + file + "<")) S.text["sitemap.xml"] = sm.replace("</urlset>", "  <url><loc>" + origin + "/" + file + "</loc></url>\n</urlset>");
    S.page = file; S.lastUndo = null;
    renderTab(); schedulePreview(0); changed();
    toast(t("npCreated"), { kind: "ok", undo: true, ms: 6000 });
  }
  async function deletePage(p) {
    if (!(await confirmBox(t("delPageBody", { p }), true))) return;
    snapshot([p, CONFIG_PATH, "sitemap.xml"], "del");
    if (S.orig[p] != null) S.deleted.add(p);
    delete S.docs[p];
    const c = cfg();
    c.pages = otherPages(c).concat(S.pages.filter(x => x.path !== p));
    if (!c.codeHash) c.codeHash = S.codeHash;
    setCfg(c); syncPages();
    const sm = S.text["sitemap.xml"];
    if (sm) S.text["sitemap.xml"] = sm.split("\n").filter(l => !l.includes("/" + p + "<")).join("\n");
    S.page = HOME; S.lastUndo = null;
    renderTab(); schedulePreview(0); changed();
    toast(t("pageDeleted"), { undo: true });
  }

  /* ======================================================================
     DESIGN TAB
     ====================================================================== */
  function rootRange(css) { const s = css.indexOf(":root {"); if (s < 0) return null; const e = css.indexOf("\n}", s); return e < 0 ? null : [s, e]; }
  function tokenRe(name) { return new RegExp("((?:^|[\\s;{])" + escRe(name) + "\\s*:\\s*)([^;]*)(;)"); }
  function getToken(name) {
    const css = S.text[CSS_PATH] || "";
    const r = rootRange(css);
    if (!r) return null;
    const m = css.slice(r[0], r[1]).match(tokenRe(name));
    return m ? m[2].trim() : null;
  }
  function setToken(name, val) {
    const css = S.text[CSS_PATH];
    const r = rootRange(css);
    if (!r) return false;
    const blk = css.slice(r[0], r[1]);
    const re = tokenRe(name);
    if (!re.test(blk)) return false;
    S.text[CSS_PATH] = css.slice(0, r[0]) + blk.replace(re, (a, p1, p2, p3) => p1 + val + p3) + css.slice(r[1]);
    return true;
  }
  function listTokens() {
    const css = S.text[CSS_PATH] || "";
    const r = rootRange(css);
    if (!r) return [];
    const out = [];
    const re = /(--[\w-]+)\s*:\s*([^;]*);/g;
    const blk = css.slice(r[0], r[1]);
    let m;
    while ((m = re.exec(blk))) out.push([m[1], m[2].trim()]);
    return out;
  }
  const toHex6 = v => {
    v = (v || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(v)) return v.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(v)) return ("#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toLowerCase();
    return "#000000";
  };
  function lum(hex) {
    const c = toHex6(hex).slice(1).match(/../g).map(x => parseInt(x, 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

  function cssChanged() {
    const d = frontDoc();
    const st = d && d.getElementById("cms-css");
    if (st) st.textContent = S.text[CSS_PATH]; else schedulePreview();
    changed();
  }
  function setPreviewTheme(th) {
    if (S.preview.theme === th) return;
    S.preview.theme = th;
    savePreviewPrefs();
    const d = frontDoc();
    if (d) d.documentElement.setAttribute("data-theme", th);
    renderPvBar();
  }

  function renderDesign() {
    const P = $("#panel");
    P.append(tabHead("tabDesign", "designIntro"));
    const mode = S.designMode;
    const pre = mode === "d" ? "--d-" : "--l-";
    // Colors
    const seg = h("div", { class: "seg seg--wide" },
      h("button", { type: "button", class: mode === "d" ? "is-on" : "", onclick: () => { S.designMode = "d"; setPreviewTheme("dark"); renderTab(true); } }, icon("moon"), t("darkMode")),
      h("button", { type: "button", class: mode === "l" ? "is-on" : "", onclick: () => { S.designMode = "l"; setPreviewTheme("light"); renderTab(true); } }, icon("sun"), t("lightMode")));
    const presets = h("div", { class: "presets" }, PRESETS.map(p => h("button", { type: "button", class: "preset", onclick: () => applyPreset(p), title: p[S.ui] },
      h("span", { class: "preset__sw", style: "background:linear-gradient(115deg," + p.d[0] + "," + p.d[1] + ")" }), h("span", null, p[S.ui]))));
    const rows = h("div", { class: "crows" });
    for (const [k, ar, en] of PALETTE_KEYS) rows.append(colorRow(pre + k, S.ui === "ar" ? ar : en));
    if (mode === "d") rows.append(colorRow("--danger", S.ui === "ar" ? "لون رسائل الخطأ" : "Error color"));
    const con = h("div", { class: "contrast" });
    const refreshContrast = () => {
      const g = n => getToken(pre + n) || "#000000";
      const items = [[t("cTextBg"), g("text"), g("bg")], [t("cText2Bg"), g("text-2"), g("bg")], [t("cInk"), g("accent-ink"), g("accent")], [t("cAccentBg"), g("accent"), g("bg")]];
      con.replaceChildren(h("div", { class: "contrast__title" }, t("contrast")), ...items.map(([l, a, b]) => {
        const r = contrast(a, b);
        const ok = r >= 4.5, mid = r >= 3;
        return h("div", { class: "contrast__row" }, h("span", { class: "contrast__demo", style: "color:" + a + ";background:" + b }, "Aa"), h("span", { class: "contrast__l" }, l),
          h("span", { class: "contrast__v " + (ok ? "is-ok" : mid ? "is-mid" : "is-bad") }, r.toFixed(1) + " " + (ok ? "✓" : "!")));
      }));
    };
    rows.addEventListener("input", debounce(refreshContrast, 60));
    refreshContrast();
    P.append(card("drop", t("colors"), [seg, h("div", { class: "subhead" }, t("presets")), presets, rows, con,
      h("div", { class: "row row--end" }, btn(t("resetDesign"), "refresh", () => applyPreset(PRESETS[0]), "sm ghost"))]));
    // Fonts
    const cur = { d: firstFamily("--font-display"), b: firstFamily("--font-body"), a: firstFamily("--font-ar") };
    const fontSel = (val, arOnly) => {
      const s = h("select", { class: "inp sel" });
      const list = FONTS.filter(f => !arOnly || f.ar);
      if (val && !list.some(f => f.name === val)) s.append(h("option", { value: val }, val));
      for (const f of list) s.append(h("option", { value: f.name }, f.name + (f.ar && !arOnly ? "  (ع)" : "")));
      s.value = val;
      return s;
    };
    const sd = fontSel(cur.d), sb = fontSel(cur.b), sa = fontSel(cur.a, true);
    const sample = (s, txt) => { const el = h("div", { class: "fsample" }, txt); const u = () => { loadFont(s.value); el.style.fontFamily = '"' + s.value + '", system-ui'; }; s.addEventListener("change", u); u(); return el; };
    const onFont = () => applyFonts(sd.value, sb.value, sa.value);
    [sd, sb, sa].forEach(s => s.addEventListener("change", onFont));
    P.append(card("type", t("fonts"), [
      h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("fontDisplay")), sd, sample(sd, "We build brands that grow. نبني علامات تنمو")),
      h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("fontBody")), sb, sample(sb, "Strategy, creative and performance marketing in one system.")),
      h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("fontAr")), sa, sample(sa, "استراتيجية وإبداع وتسويق أداء في نظام واحد.")),
      h("p", { class: "muted small" }, t("fontsNote"))]));
    // Sizes and spacing
    const tokens = listTokens();
    const sz = h("div", { class: "tokens" });
    for (const [name, val] of tokens) {
      if (!TOKEN_LABELS[name]) continue;
      const w = fieldBox(TOKEN_LABELS[name][S.ui === "ar" ? 0 : 1], name);
      const c = ctl(val, { dir: "ltr", mono: true });
      const key = "tok" + name;
      c.addEventListener("focus", () => { S.lastUndo = null; });
      c.addEventListener("input", () => { if (!c.value.trim() || c.value.includes(";")) return; undoMark([CSS_PATH], key); setToken(name, c.value.trim()); cssChanged(); });
      w.append(c);
      sz.append(w);
    }
    P.append(card("sliders", t("sizes"), [h("p", { class: "muted small" }, t("sizesNote")), sz]));
    P.append(card("code", t("advancedCss"), [h("div", { class: "row" }, btn(t("openCss"), "code", () => { S.file = CSS_PATH; setTab("files"); }, "sm"))]));
  }
  function colorRow(name, label) {
    const val = getToken(name) || "#000000";
    const col = h("input", { type: "color", class: "sw", "aria-label": label });
    col.value = toHex6(val);
    const hex = h("input", { class: "inp inp--mono hex", dir: "ltr", maxlength: "7", "aria-label": label });
    hex.value = val;
    const key = "c" + name;
    const apply = v => { undoMark([CSS_PATH], key); setToken(name, v); cssChanged(); };
    [col, hex].forEach(x => x.addEventListener("focus", () => { S.lastUndo = null; }));
    col.addEventListener("input", () => { hex.value = col.value.toUpperCase(); apply(hex.value); });
    hex.addEventListener("input", () => { const v = hex.value.trim(); if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) { col.value = toHex6(v); apply(v.toUpperCase()); } });
    return h("label", { class: "crow" }, col, h("span", { class: "crow__txt" }, h("span", { class: "crow__label" }, label), h("code", { class: "crow__var" }, name)), hex);
  }
  function applyPreset(p) {
    snapshot([CSS_PATH], "preset");
    if (p.id === "brand") for (const [k, v] of Object.entries(DEFAULT_PALETTE)) setToken(k, v);
    else {
      ["accent", "accent-2", "accent-ink"].forEach((n, i) => { setToken("--d-" + n, p.d[i]); setToken("--l-" + n, p.l[i]); });
    }
    S.lastUndo = null;
    cssChanged(); renderTab(true);
    toast(t("presetApplied"), { undo: true, kind: "ok" });
  }
  function firstFamily(tok) { const m = (getToken(tok) || "").match(/"([^"]+)"/); return m ? m[1] : ""; }
  const loadedFonts = new Set();
  function loadFont(name) {
    if (!name || loadedFonts.has(name)) return;
    loadedFonts.add(name);
    document.head.append(h("link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=" + name.replace(/ /g, "+") + ":wght@400;600&display=swap" }));
  }
  function fontsHref(fams) {
    const parts = [...new Set(fams)].map(f => { const def = FONTS.find(x => x.name === f); return "family=" + f.replace(/ /g, "+") + ":wght@" + (def ? def.w : "400;700"); });
    parts.push("family=IBM+Plex+Mono:wght@400;500;600");
    return "https://fonts.googleapis.com/css2?" + parts.join("&") + "&display=swap";
  }
  function applyFonts(display, body, ar) {
    snapshot([CSS_PATH, ...htmlPaths()], "fonts");
    setToken("--font-display", '"' + display + '", "' + ar + '", system-ui, sans-serif');
    setToken("--font-body", '"' + body + '", "' + ar + '", system-ui, -apple-system, "Segoe UI", sans-serif');
    setToken("--font-ar", '"' + ar + '", "' + display + '", system-ui, sans-serif');
    const href = fontsHref([display, body, ar]);
    for (const p of htmlPaths()) {
      const l = S.docs[p].head.querySelector('link[href^="https://fonts.googleapis.com/css2"]');
      if (l) l.setAttribute("href", href);
    }
    S.lastUndo = null;
    schedulePreview(0); changed();
    toast(t("fontsApplied"), { undo: true, kind: "ok" });
  }

  /* ======================================================================
     GLOBAL TAB
     ====================================================================== */
  function textPaths(withCode) {
    const out = htmlPaths().concat([JS_PATH], EXTRA_FILES.filter(f => S.text[f] != null));
    if (withCode) out.push(CSS_PATH);
    return out;
  }
  function variantsOf(f, r) {
    const escT = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");
    const escA = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/ /g, "&nbsp;");
    const list = [[f, r]];
    for (const e of [escT, escA]) { const ef = e(f); if (ef !== f && !list.some(x => x[0] === ef)) list.push([ef, e(r)]); }
    return list;
  }
  function countIn(txt, f, cs) {
    if (!f) return 0;
    const re = new RegExp(escRe(f), cs ? "g" : "gi");
    return (txt.match(re) || []).length;
  }
  function findEverywhere(find, o = {}) {
    const res = [];
    for (const p of textPaths(o.code)) {
      const txt = currentText(p);
      if (txt == null) continue;
      let n = 0;
      for (const [f] of variantsOf(find, "")) n += countIn(txt, f, o.cs);
      if (n) res.push([p, n]);
    }
    return res;
  }
  function replaceEverywhere(find, repl, o = {}) {
    if (!find) return 0;
    const paths = textPaths(o.code);
    snapshot(paths, "replace");
    let total = 0;
    for (const p of paths) {
      let txt = currentText(p);
      if (txt == null) continue;
      let n = 0;
      for (const [f, r] of variantsOf(find, repl)) {
        const re = new RegExp(escRe(f), o.cs ? "g" : "gi");
        txt = txt.replace(re, () => { n++; return r; });
      }
      if (n) { setText(p, txt); total += n; }
    }
    S.lastUndo = null;
    if (!total) S.undo.pop();
    refreshUndo();
    renderTab(true); schedulePreview(0); changed();
    return total;
  }
  function detectContacts() {
    const d = S.docs[HOME] || S.docs[htmlPaths()[0]];
    const rows = [];
    const wa = d.querySelector('a[href*="wa.me/"]');
    if (wa) {
      const num = (wa.getAttribute("href").match(/wa\.me\/(\d+)/) || [])[1];
      if (num) rows.push({ label: t("cWa"), value: num, dir: "ltr", ic: "phone" });
      const disp = (wa.textContent.match(/\+[\d\s]{6,}\d/) || [])[0];
      if (disp) rows.push({ label: t("cPhone"), value: disp.trim(), dir: "ltr", ic: "phone" });
    }
    const mail = d.querySelector('a[href^="mailto:"]');
    if (mail) rows.push({ label: t("cEmail"), value: mail.getAttribute("href").slice(7).split("?")[0], dir: "ltr", ic: "global" });
    d.querySelectorAll(".socials a[href]").forEach(a => rows.push({ label: a.getAttribute("aria-label") || "Social", value: a.getAttribute("href"), dir: "ltr", ic: "link" }));
    const spans = d.querySelectorAll("footer address span[data-en]");
    spans.forEach((s, i) => {
      const nm = i === 0 ? t("cAddress") : i === 1 ? t("cHours") : t("lText");
      rows.push({ label: nm + " (EN)", value: s.getAttribute("data-en"), dir: "ltr", ic: "global" });
      if (s.getAttribute("data-ar")) rows.push({ label: nm + " (ع)", value: s.getAttribute("data-ar"), dir: "rtl", ic: "global" });
    });
    return rows;
  }
  function renderGlobal() {
    const P = $("#panel");
    P.append(tabHead("tabGlobal", "globalIntro"));
    const rows = detectContacts().map(r => {
      const inp = h("input", { class: "inp", dir: r.dir });
      inp.value = r.value;
      const go = btn(t("applyAll"), "replace", () => {
        const v = inp.value.trim();
        if (!v || v === r.value) { toast(t("noChange")); return; }
        const n = replaceEverywhere(r.value, v, { cs: true });
        toast(n ? t("replaced", { n }) : t("notFound"), { kind: n ? "ok" : "warn", undo: !!n });
      }, "sm");
      return h("div", { class: "fld" }, h("div", { class: "fld__head" }, h("span", { class: "fld__label" }, r.label), h("code", { class: "fld__hint" }, clip(r.value, 30))), h("div", { class: "row" }, inp, go));
    });
    P.append(card("phone", t("contact"), rows));
    // Logos and favicon
    // srcs: one path, or several files that are swapped together (all favicon sizes).
    const logoRow = (srcs, label, preview) => {
      const list = [].concat(srcs);
      const shown = preview || list[0];
      const thumb = h("img", { class: "thumb__img", alt: "" });
      thumb.src = assetUrl(shown);
      return h("div", { class: "fld" }, h("span", { class: "fld__label" }, label),
        h("div", { class: "thumb thumb--logo" }, h("div", { class: "thumb__box" + (/light/.test(shown) ? " is-dark" : " is-light") }, thumb),
          h("div", { class: "thumb__side" }, h("code", { class: "fld__hint" }, list.join(" · ")), uploadBtn(async f => { const u = await addUpload(f); if (u) { const n = replaceAsset(list, u.path, u); toast(t("replaced", { n }), { kind: "ok", undo: true }); } }, "image/*", t("replaceImg")))));
    };
    const idx = S.docs[HOME];
    const srcOf = (sel, def) => { const x = idx.querySelector(sel); return x ? x.getAttribute("src") : def; };
    const lightSrc = srcOf("img.logo-light", "assets/img/logo-light.svg");
    const darkSrc = srcOf("img.logo-dark", "assets/img/logo.svg");
    const icons = [...new Set([...idx.querySelectorAll('link[rel~="icon"][href], link[rel="apple-touch-icon"][href]')].map(l => l.getAttribute("href")))];
    const iconPreview = icons.find(s => /\.svg$/i.test(s)) || icons[0];
    P.append(card("images", t("logos"), [logoRow(lightSrc, t("logoLight")), logoRow(darkSrc, t("logoDark")), icons.length ? logoRow(icons, t("seoFavicon"), iconPreview) : null]));
    // Find and replace
    const fi = h("input", { class: "inp", placeholder: t("findPh"), dir: "auto" });
    const ri = h("input", { class: "inp", placeholder: t("replacePh"), dir: "auto" });
    const cs = h("input", { type: "checkbox" });
    const code = h("input", { type: "checkbox" });
    const out = h("div", { class: "fr-out" });
    const doFind = () => {
      const q = fi.value;
      out.replaceChildren();
      if (!q) return;
      const res = findEverywhere(q, { cs: cs.checked, code: code.checked });
      const total = res.reduce((a, b) => a + b[1], 0);
      out.append(h("div", { class: "fr-sum" }, total ? t("matches", { n: total, f: res.length }) : t("notFound")));
      res.forEach(([p, n]) => out.append(h("div", { class: "fr-row" }, h("span", null, fileLabel(p)), h("code", null, p), h("b", null, String(n)))));
    };
    fi.addEventListener("input", debounce(doFind, 250));
    cs.addEventListener("change", doFind); code.addEventListener("change", doFind);
    P.append(card("search", t("findReplace"), [
      h("p", { class: "muted small" }, t("frNote")), fi, ri,
      h("div", { class: "row" }, h("label", { class: "chk" }, cs, h("span", null, t("matchCase"))), h("label", { class: "chk" }, code, h("span", null, t("inCode")))),
      h("div", { class: "row" }, btn(t("find"), "search", doFind, "sm"), btn(t("replaceAll"), "replace", () => {
        if (!fi.value) return;
        const n = replaceEverywhere(fi.value, ri.value, { cs: cs.checked, code: code.checked });
        toast(n ? t("replaced", { n }) : t("notFound"), { kind: n ? "ok" : "warn", undo: !!n });
      }, "sm primary")), out]));
  }

  /* ======================================================================
     IMAGES TAB
     ====================================================================== */
  function collectImages() {
    const map = new Map();
    const add = (src, p) => {
      if (!src || src.startsWith("data:")) return;
      if (!map.has(src)) map.set(src, { src, uses: 0, pages: new Set(), alt: "" });
      const e = map.get(src); e.uses++; e.pages.add(p);
    };
    for (const p of htmlPaths()) {
      const d = S.docs[p];
      d.querySelectorAll("img[src]").forEach(el => { add(el.getAttribute("src"), p); const e = map.get(el.getAttribute("src")); if (e && !e.alt) e.alt = el.getAttribute("alt") || ""; });
      d.querySelectorAll('link[rel~="icon"][href], link[rel="apple-touch-icon"][href]').forEach(el => add(el.getAttribute("href"), p));
      d.querySelectorAll('meta[property="og:image"][content], meta[name="twitter:image"][content]').forEach(el => add(el.getAttribute("content"), p));
    }
    for (const path of Object.keys(S.uploads)) if (!map.has(path)) map.set(path, { src: path, uses: 0, pages: new Set(), alt: "" });
    return [...map.values()];
  }
  // oldSrc may be one path or a list (e.g. every favicon file) replaced by the same new file.
  function replaceAsset(oldSrc, newSrc, dims) {
    const olds = [].concat(oldSrc);
    const mime = { png: "image/png", svg: "image/svg+xml", ico: "image/x-icon", webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif" }[(newSrc.split(".").pop() || "").toLowerCase()];
    snapshot(htmlPaths(), "asset");
    let n = 0;
    for (const p of htmlPaths()) {
      S.docs[p].querySelectorAll("img[src], link[href], meta[content]").forEach(el => {
        for (const a of ["src", "href", "content"]) {
          if (!olds.includes(el.getAttribute(a))) continue;
          el.setAttribute(a, newSrc); n++;
          // An icon link keeps a matching type, and a fixed size hint no longer applies.
          if (el.tagName === "LINK" && el.hasAttribute("type") && mime) el.setAttribute("type", mime);
          if (el.tagName === "LINK") el.removeAttribute("sizes");
          if (a === "src") {
            el.removeAttribute("srcset");
            if (dims && dims.w && dims.h) {
              const hh = parseFloat(el.getAttribute("height")), ww = parseFloat(el.getAttribute("width"));
              if (hh) el.setAttribute("width", String(Math.round(hh * dims.w / dims.h)));
              else if (ww) el.setAttribute("height", String(Math.round(ww * dims.h / dims.w)));
            }
          }
        }
      });
    }
    S.lastUndo = null;
    if (!n) S.undo.pop();
    refreshUndo();
    renderTab(true); schedulePreview(0); changed();
    return n;
  }
  function renderImages() {
    const P = $("#panel");
    P.append(tabHead("tabImages", "imagesIntro"));
    P.append(h("div", { class: "row" }, uploadBtn(async f => { const u = await addUpload(f); if (u) { try { await navigator.clipboard.writeText(u.path); } catch (e) { /* ignore */ } renderTab(true); } }, "image/*,application/pdf", t("uploadNew"))));
    const grid = h("div", { class: "igrid" });
    for (const im of collectImages()) {
      const thumb = h("img", { alt: "", loading: "lazy" });
      thumb.src = assetUrl(im.src);
      const pend = S.uploads[im.src];
      grid.append(h("div", { class: "icard" },
        h("div", { class: "icard__img" + (/\.svg$/i.test(im.src) && !/light/i.test(im.src) ? " is-light" : "") }, /\.pdf$/i.test(im.src) ? h("span", { class: "icard__pdf" }, "PDF") : thumb),
        h("div", { class: "icard__body" },
          h("code", { class: "icard__src", title: im.src }, im.src.split("/").pop()),
          h("span", { class: "muted small" }, im.uses ? t("uses", { n: im.uses }) + " · " + [...im.pages].map(pageName).join(S.ui === "ar" ? "، " : ", ") : t("unused")),
          pend ? h("span", { class: "badge badge--pend" }, t("pending")) : null,
          h("div", { class: "row" },
            uploadBtn(async f => { const u = await addUpload(f); if (u) { const n = replaceAsset(im.src, u.path, u); toast(t("replaced", { n }), { kind: "ok", undo: true }); } }, "image/*", t("replaceImg")),
            ctrlBtn("link", t("editPath"), async () => {
              const v = await promptBox(t("editPath"), im.src);
              if (v && v !== im.src) { const n = replaceAsset(im.src, v); toast(t("replaced", { n }), { kind: "ok", undo: true }); }
            }),
            ctrlBtn("copy", t("copyPath"), async () => { try { await navigator.clipboard.writeText(im.src); toast(t("copied"), "ok"); } catch (e) { toast(im.src); } })))));
    }
    P.append(grid);
  }
  function promptBox(title, value) {
    return new Promise(res => {
      const inp = h("input", { class: "inp inp--mono", dir: "ltr" });
      inp.value = value || "";
      let done = false;
      const m = modal({ title, body: inp, actions: [{ label: t("cancel"), fn: () => { done = true; res(null); } }, { label: t("apply"), primary: true, fn: () => { done = true; res(inp.value.trim()); } }] });
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { done = true; res(inp.value.trim()); m.close(); } });
      const obs = new MutationObserver(() => { if (!m.dlg.isConnected) { obs.disconnect(); if (!done) res(null); } });
      obs.observe($("#modal-root"), { childList: true });
    });
  }

  /* ======================================================================
     CODE TAB
     ====================================================================== */
  function codeKeys(ta, onSave) {
    ta.addEventListener("keydown", e => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        ta.setRangeText("  ", s, en, "end");
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (onSave) onSave();
      }
    });
  }
  function renderFiles() {
    const P = $("#panel");
    P.append(tabHead("tabFiles", "filesIntro"));
    const files = [...S.pages.filter(p => S.docs[p.path]).map(p => p.path), CSS_PATH, JS_PATH, ...EXTRA_FILES.filter(f => S.text[f] != null), CONFIG_PATH].filter(p => currentText(p) != null);
    if (!files.includes(S.file)) S.file = files[0];
    const dirty = new Set(dirtyList());
    const sel = h("select", { class: "inp sel" });
    for (const p of files) sel.append(h("option", { value: p }, (dirty.has(p) ? "● " : "") + p + "  ·  " + fileLabel(p)));
    sel.value = S.file;
    sel.addEventListener("change", () => { S.file = sel.value; renderTab(); schedulePreview(0); });
    const ta = h("textarea", { class: "inp inp--mono code code--full", spellcheck: "false", dir: "ltr", wrap: "off", "aria-label": S.file });
    ta.value = currentText(S.file) || "";
    const info = h("span", { class: "muted small" });
    const upd = () => { info.textContent = t("lines", { n: ta.value.split("\n").length }) + " · " + (new Blob([ta.value]).size / 1024).toFixed(1) + " KB"; };
    ta.addEventListener("input", debounce(upd, 200)); upd();
    const apply = () => {
      const v = ta.value;
      if (v === currentText(S.file)) { toast(t("noChange")); return; }
      if (/\.json$/.test(S.file)) { try { JSON.parse(v); } catch (e) { toast(t("jsonBad") + " " + e.message, "err"); return; } }
      snapshot([S.file], "code");
      setText(S.file, v);
      if (S.file === CONFIG_PATH) syncPages();
      S.lastUndo = null;
      changed(); schedulePreview(0);
      toast(t("applied"), { undo: true, kind: "ok" });
    };
    codeKeys(ta, apply);
    const revert = btn(t("revertFile"), "undo", async () => {
      if (S.orig[S.file] == null) return;
      snapshot([S.file], "revert");
      setText(S.file, S.orig[S.file]);
      if (S.file === CONFIG_PATH) syncPages();
      S.lastUndo = null;
      renderTab(); schedulePreview(0); changed();
      toast(t("reverted"), { undo: true });
    }, "sm ghost");
    if (S.orig[S.file] == null) revert.disabled = true;
    P.append(h("div", { class: "codebar" }, sel, h("div", { class: "row" }, btn(t("applyCode"), "check", apply, "sm primary"), revert, info)), ta);
  }

  /* ======================================================================
     SETTINGS TAB
     ====================================================================== */
  const ANALYTICS_RE = /(\/\* @cms-analytics-start \*\/\s*const ANALYTICS = )(\{[^;\n]*\})(;)/;
  function analyticsCard() {
    const cur = (ANALYTICS_RE.exec(S.text[JS_PATH] || "") || [])[2];
    const v = safeJSON(cur) || {};
    const fields = [["ga4", "Google Analytics 4", "G-XXXXXXXXXX", /^G-[A-Z0-9]{4,}$/], ["gtm", "Google Tag Manager", "GTM-XXXXXXX", /^GTM-[A-Z0-9]{4,}$/],
      ["metaPixel", "Meta Pixel ID", "123456789012345", /^\d{8,20}$/], ["clarity", "Microsoft Clarity", "abcd1234ef", /^[a-z0-9]{6,20}$/]];
    const inputs = {};
    const rows = fields.map(([k, label, ph]) => { inputs[k] = h("input", { class: "inp inp--mono", dir: "ltr", placeholder: ph }); inputs[k].value = v[k] || ""; return h("div", { class: "fld" }, h("span", { class: "fld__label" }, label), inputs[k]); });
    const save = () => {
      const out = {};
      for (const [k, , , re] of fields) {
        const val = inputs[k].value.trim();
        if (val && !re.test(val)) { toast(t("anBad") + " (" + k + ")", "err"); return; }
        out[k] = val;
      }
      const js = S.text[JS_PATH];
      if (!js || !ANALYTICS_RE.test(js)) { toast(t("anBad"), "err"); return; }
      snapshot([JS_PATH], "analytics");
      S.text[JS_PATH] = js.replace(ANALYTICS_RE, (a, p1, p2, p3) => p1 + JSON.stringify(out) + p3);
      S.lastUndo = null;
      changed();
      toast(t("anSaved"), { kind: "ok", ms: 6000 });
    };
    return card("overview", t("anTitle"), [h("p", { class: "muted small" }, t("anIntro")), h("div", { class: "grid2" }, rows), h("div", { class: "row" }, btn(t("anSave"), "check", save, "sm primary"))]);
  }

  function renderSettings() {
    const P = $("#panel");
    P.append(tabHead("tabSettings", "settingsIntro"));
    P.append(backendCard());
    if (BRAND === "bv") P.append(analyticsCard());
    const owner = h("input", { class: "inp", dir: "ltr" }); owner.value = S.repo.owner;
    const repo = h("input", { class: "inp", dir: "ltr" }); repo.value = S.repo.repo;
    const branch = h("input", { class: "inp", dir: "ltr" }); branch.value = S.repo.branch;
    const tok = h("input", { class: "inp inp--mono", type: "password", dir: "ltr", autocomplete: "off", spellcheck: "false", placeholder: "github_pat_…" });
    tok.value = S.token;
    const showTok = h("input", { type: "checkbox", onchange: e => { tok.type = e.target.checked ? "text" : "password"; } });
    const keepTok = h("input", { type: "checkbox" }); keepTok.checked = !!store.get(LS.token);
    const status = h("div", { class: "conn" });
    const setStatus = (kind, msg) => { status.className = "conn conn--" + kind; status.replaceChildren(icon(kind === "ok" ? "check" : kind === "err" ? "warn" : "branch"), h("span", null, msg)); };
    if (!S.token) setStatus("idle", t("noToken"));
    else if (S.source === "github") setStatus("ok", t("source", { s: t("srcGithubLong") }));
    else setStatus("err", S.ghError || t("source", { s: t("srcSiteLong") }));
    const save = async () => {
      S.repo = { owner: owner.value.trim() || DEFAULT_REPO.owner, repo: repo.value.trim() || DEFAULT_REPO.repo, branch: branch.value.trim() || "main" };
      store.set(LS.repo, JSON.stringify(S.repo));
      S.token = tok.value.trim();
      store.del(LS.token); store.sdel(LS.token);
      if (S.token) { if (keepTok.checked) store.set(LS.token, S.token); else store.sset(LS.token, S.token); }
      toast(t("saved"), "ok");
      if (S.token) {
        await test();
        if (!dirtyList().length) await reloadAll(true);
      }
    };
    const test = async () => {
      if (!S.token) { setStatus("idle", t("noToken")); return; }
      setStatus("idle", t("testing"));
      try {
        const r = await GH.req(GH.base());
        await GH.req(GH.base() + "/git/ref/heads/" + encodeURIComponent(S.repo.branch));
        await GH.req(GH.base() + "/git/blobs", { method: "POST", body: JSON.stringify({ content: "bv-cms connection test", encoding: "utf-8" }) });
        setStatus("ok", t("connOk", { r: r.full_name }));
      } catch (e) { setStatus("err", ghErrorText(e)); }
    };
    P.append(card("branch", t("conn"), [
      status,
      h("div", { class: "grid3" },
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("owner")), owner),
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("repoName")), repo),
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("branch")), branch)),
      h("div", { class: "fld" }, h("div", { class: "fld__head" }, h("span", { class: "fld__label" }, t("token")), h("label", { class: "chk chk--sm" }, showTok, h("span", null, t("showToken")))), tok),
      h("div", { class: "row" }, btn(t("save"), "check", save, "sm primary"), btn(t("test"), "refresh", test, "sm"),
        btn(t("forget"), "trash", () => { S.token = ""; tok.value = ""; store.del(LS.token); store.sdel(LS.token); keepTok.checked = false; setStatus("idle", t("noToken")); toast(t("forgot")); }, "sm ghost")),
      h("label", { class: "chk chk--sm" }, keepTok, h("span", null, t("rememberToken"))),
      h("p", { class: "note note--warn" }, icon("key"), h("span", null, t("tokenNote")))]));
    const steps = t("tokenSteps").split("|");
    P.append(card("key", t("tokenHow"), [
      h("ol", { class: "steps" }, steps.map(s => h("li", null, s))),
      h("a", { class: "btn btn--sm", href: "https://github.com/settings/personal-access-tokens/new", target: "_blank", rel: "noopener" }, icon("external"), h("span", null, t("openTokenPage")))]));
    // Access code
    const c1 = h("input", { class: "inp inp--mono", type: "password", dir: "ltr", autocomplete: "new-password" });
    const c2 = h("input", { class: "inp inp--mono", type: "password", dir: "ltr", autocomplete: "new-password" });
    P.append(card("lock", t("access"), [
      h("p", { class: "muted small" }, t("accessNote")),
      h("div", { class: "grid2" }, h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("newCode")), c1), h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("confirmCode")), c2)),
      h("div", { class: "row" }, btn(t("changeCode"), "key", async () => {
        const a = c1.value.trim();
        if (a.length < 4) { toast(t("codeShort"), "err"); return; }
        if (a !== c2.value.trim()) { toast(t("codeMismatch"), "err"); return; }
        snapshot([CONFIG_PATH], "code");
        const c = cfg();
        c.codeHash = await sha256(SALT + a);
        setCfg(c);
        S.lastUndo = null;
        c1.value = ""; c2.value = "";
        changed();
        toast(t("codeChanged"), { kind: "ok", ms: 6000 });
      }, "sm"))]));
    // Data
    P.append(card("refresh", t("data"), [
      h("p", { class: "muted small" }, t("source", { s: S.source === "github" ? t("srcGithubLong") : t("srcSiteLong") })),
      h("div", { class: "row" }, btn(t("reload"), "refresh", () => reloadAll(), "sm"), btn(t("discardAll"), "trash", async () => {
        if (!(await confirmBox(t("discardConfirm"), true))) return;
        store.del(LS.draft);
        await reloadAll(true);
        toast(t("discarded"));
      }, "sm danger"))]));
  }

  /* ---------- shared tab chrome ---------- */
  function tabHead(titleKey, introKey) { return h("div", { class: "tabhead" }, h("h2", null, t(titleKey)), h("p", { class: "muted" }, t(introKey))); }
  function card(ic, title, body) { return h("section", { class: "card" }, h("h3", { class: "card__title" }, icon(ic), h("span", null, title)), h("div", { class: "card__body" }, body)); }

  /* ======================================================================
     PUBLISH
     ====================================================================== */
  function defaultMsg(files) {
    const names = files.map(p => p.split("/").pop());
    return "Dashboard update: " + (names.length > 4 ? names.slice(0, 4).join(", ") + " +" + (names.length - 4) : names.join(", "));
  }
  async function publish(message, force, step) {
    const files = dirtyList();
    const base = GH.base();
    if (!force) {
      step(t("stCheck"));
      const conflicts = [];
      await Promise.all(files.map(async p => {
        if (S.uploads[p]) return;
        let remote;
        try { remote = await GH.raw(p); } catch (e) { if (e.status === 404) remote = null; else throw e; }
        if (norm(remote) !== norm(S.orig[p] == null ? null : S.orig[p])) conflicts.push(p);
      }));
      if (conflicts.length) { const e = new Error("conflict"); e.conflicts = conflicts; throw e; }
    }
    step(t("stPrep"));
    const ref = await GH.req(base + "/git/ref/heads/" + encodeURIComponent(S.repo.branch));
    const head = ref.object.sha;
    const commit = await GH.req(base + "/git/commits/" + head);
    const tree = [];
    for (const p of files) {
      if (S.deleted.has(p) && !S.docs[p]) { tree.push({ path: p, mode: "100644", type: "blob", sha: null }); continue; }
      if (S.uploads[p]) {
        step(t("stUpload"));
        const b = await GH.req(base + "/git/blobs", { method: "POST", body: JSON.stringify({ content: S.uploads[p].b64, encoding: "base64" }) });
        tree.push({ path: p, mode: "100644", type: "blob", sha: b.sha });
        continue;
      }
      tree.push({ path: p, mode: "100644", type: "blob", content: currentText(p) });
    }
    step(t("stCommit"));
    const nt = await GH.req(base + "/git/trees", { method: "POST", body: JSON.stringify({ base_tree: commit.tree.sha, tree }) });
    const nc = await GH.req(base + "/git/commits", { method: "POST", body: JSON.stringify({ message, tree: nt.sha, parents: [head] }) });
    step(t("stRef"));
    await GH.req(base + "/git/refs/heads/" + encodeURIComponent(S.repo.branch), { method: "PATCH", body: JSON.stringify({ sha: nc.sha, force: false }) });
    for (const p of files) {
      if (S.deleted.has(p) && !S.docs[p]) { delete S.orig[p]; continue; }
      if (S.uploads[p]) { S.cache[p] = S.uploads[p]; delete S.uploads[p]; continue; }
      const txt = currentText(p);
      S.orig[p] = txt;
      if (S.docs[p]) S.base[p] = txt;
    }
    S.deleted.clear();
    S.undo = []; S.lastUndo = null;
    store.del(LS.draft);
    const c = cfg();
    if (typeof c.codeHash === "string" && /^[0-9a-f]{64}$/.test(c.codeHash) && c.codeHash !== S.codeHash) {
      S.codeHash = c.codeHash;
      store.sset(LS.session, c.codeHash);
      if (store.get(LS.remember)) store.set(LS.remember, c.codeHash);
    }
    refreshDirty();
    return nc;
  }
  function openPublish() {
    const files = dirtyList();
    if (!files.length) { toast(t("nothingToPublish")); return; }
    if (!S.token) {
      modal({ title: t("needTokenTitle"), body: h("p", null, t("needTokenBody")), actions: [{ label: t("cancel") }, { label: t("goSettings"), primary: true, fn: () => setTab("settings") }] });
      return;
    }
    const list = h("ul", { class: "flist" }, files.map(p => h("li", null,
      h("span", { class: "flist__k flist__k--" + kindOf(p) }, t("k_" + kindOf(p))),
      h("span", { class: "flist__name" }, fileLabel(p)), h("code", null, p))));
    const msg = h("input", { class: "inp", dir: "ltr" });
    msg.value = defaultMsg(files);
    const force = h("input", { type: "checkbox" });
    const forceRow = h("label", { class: "chk", hidden: true }, force, h("span", null, t("forcePublish")));
    const status = h("div", { class: "pub-status" });
    const go = h("button", { type: "button", class: "btn btn--primary" }, icon("publish"), h("span", null, t("publishNow")));
    const cancel = h("button", { type: "button", class: "btn" }, t("cancel"));
    const m = modal({
      title: t("publishTitle"),
      body: [h("p", { class: "muted" }, t("publishIntro", { n: files.length })), list,
        h("div", { class: "fld" }, h("span", { class: "fld__label" }, t("commitMsg")), msg), forceRow, status],
      foot: [cancel, go]
    });
    cancel.addEventListener("click", () => m.close());
    let busy = false;
    go.addEventListener("click", async () => {
      if (busy) return;
      busy = true; go.disabled = true; cancel.disabled = true;
      status.replaceChildren(h("div", { class: "pub-step" }, h("span", { class: "spin" }), h("span", { class: "pub-step__t" }, t("stPrep"))));
      try {
        const nc = await publish(msg.value.trim() || defaultMsg(files), force.checked, s => { const el = status.querySelector(".pub-step__t"); if (el) el.textContent = s; });
        m.close();
        renderTab(true);
        const commitUrl = "https://github.com/" + S.repo.owner + "/" + S.repo.repo + "/commit/" + nc.sha;
        modal({
          title: t("publishedTitle"),
          body: h("div", { class: "done" }, h("div", { class: "done__ico" }, icon("check")), h("p", null, t("publishedBody"))),
          foot: [h("a", { class: "btn", href: commitUrl, target: "_blank", rel: "noopener" }, icon("branch"), h("span", null, t("viewCommit"))),
            h("a", { class: "btn btn--primary", href: siteBase() + (S.page === CONSULT ? "" : S.page), target: "_blank", rel: "noopener" }, icon("external"), h("span", null, t("openSite")))]
        });
      } catch (e) {
        busy = false; go.disabled = false; cancel.disabled = false;
        if (e.conflicts) {
          status.replaceChildren(h("div", { class: "warnbox" }, h("p", null, t("conflict")), h("ul", null, e.conflicts.map(p => h("li", null, h("code", null, p))))));
          forceRow.hidden = false;
        } else status.replaceChildren(h("div", { class: "errbox" }, icon("warn"), h("span", null, ghErrorText(e))));
      }
    });
  }

  /* ======================================================================
     DRAFTS (auto-saved on this device until published)
     ====================================================================== */
  let draftWarned = false;
  function saveDraft(list) {
    if (!S.loaded) return;
    const dirty = list || dirtyList();
    if (!dirty.length) { store.del(LS.draft); return; }
    const d = { at: Date.now(), repo: repoId(), files: {}, uploads: {}, deleted: [...S.deleted] };
    for (const p of dirty) {
      if (S.uploads[p]) { d.uploads[p] = S.uploads[p]; continue; }
      if (S.deleted.has(p) && !S.docs[p]) continue;
      d.files[p] = { text: currentText(p), base: fnv(norm(S.orig[p] == null ? "" : S.orig[p])) };
    }
    if (!store.set(LS.draft, JSON.stringify(d))) {
      d.uploads = {};
      store.set(LS.draft, JSON.stringify(d));
      if (!draftWarned) { draftWarned = true; toast(t("draftQuota"), { kind: "warn", ms: 7000 }); }
    }
  }
  function checkDraft() {
    const d = safeJSON(store.get(LS.draft));
    if (!d || d.repo !== repoId() || !d.files) return;
    const n = Object.keys(d.files).length + Object.keys(d.uploads || {}).length + (d.deleted || []).length;
    if (!n) return;
    const stale = Object.keys(d.files).filter(p => d.files[p].base !== fnv(norm(S.orig[p] == null ? "" : S.orig[p])));
    const when = new Date(d.at).toLocaleString(S.ui === "ar" ? "ar-EG" : "en-GB");
    modal({
      title: t("draftTitle"),
      body: [h("p", null, t("draftBody", { n, time: when })), stale.length ? h("div", { class: "warnbox" }, h("p", null, t("draftStale")), h("ul", null, stale.map(p => h("li", null, h("code", null, p))))) : null],
      actions: [{ label: t("draftDiscard"), danger: true, fn: () => store.del(LS.draft) }, { label: t("draftRestore"), primary: true, fn: () => applyDraft(d) }]
    });
  }
  function applyDraft(d) {
    for (const [p, f] of Object.entries(d.files)) {
      if (isHtml(p) && !(p in S.orig)) { S.orig[p] = null; S.base[p] = ""; }
      setText(p, f.text);
    }
    for (const [p, u] of Object.entries(d.uploads || {})) S.uploads[p] = u;
    for (const p of d.deleted || []) { S.deleted.add(p); delete S.docs[p]; }
    syncPages();
    if (S.page !== CONSULT && !S.docs[S.page]) S.page = HOME;
    renderTab(); schedulePreview(0); changed();
    toast(t("draftRestored"), "ok");
  }

  /* ======================================================================
     LIVE PREVIEW
     Rendered from the edited documents into a srcdoc iframe (double
     buffered so it never flashes). Text edits are patched in place.
     ====================================================================== */
  const PV = { frames: [], front: 0, timer: 0, blob: null, scroll: 0, stale: true, id: 0, flashT: 0 };
  const PREVIEW_CSS = [
    ".loader{display:none!important}",
    "[data-reveal]{opacity:1!important;animation:none!important}",
    ".wr>span{transform:none!important;transition:none!important}",
    "html.cms-select [data-cms-k]{cursor:pointer}",
    "html.cms-select [data-cms-k]:hover:not(:has([data-cms-k]:hover)){outline:2px dashed #00CFFF!important;outline-offset:3px!important}",
    ".cms-flash{outline:2px solid #00CFFF!important;outline-offset:4px!important;box-shadow:0 0 0 8px rgba(0,207,255,.18)!important}"
  ].join("\n");
  const SHIM = function (o) {
    window.__BV_PREVIEW = true;
    try {
      var g = Storage.prototype.getItem, s = Storage.prototype.setItem, has = function (k) { return Object.prototype.hasOwnProperty.call(o, k); };
      Storage.prototype.getItem = function (k) { return has(k) ? o[k] : g.call(this, k); };
      Storage.prototype.setItem = function (k, v) { if (has(k)) { o[k] = String(v); parent.postMessage({ cms: 1, type: "pref", k: k, v: String(v) }, "*"); return; } s.call(this, k, v); };
      // The editor preview skips JS entrance motion so counters and reveals show final state.
      var mm = window.matchMedia, noop = function () {};
      window.matchMedia = function (q) {
        if (/prefers-reduced-motion/.test(q)) return { matches: true, media: q, onchange: null, addListener: noop, removeListener: noop, addEventListener: noop, removeEventListener: noop, dispatchEvent: function () { return false; } };
        return mm.call(window, q);
      };
    } catch (e) { /* ignore */ }
  };
  const AGENT = function (o) {
    var de = document.documentElement, post = function (m) { m.cms = 1; parent.postMessage(m, "*"); };
    de.style.scrollBehavior = "auto";
    window.__cmsSel = !!o.select;
    de.classList.toggle("cms-select", window.__cmsSel);
    window.addEventListener("message", function (e) {
      if (e.data && e.data.cmsSel !== undefined) { window.__cmsSel = !!e.data.cmsSel; de.classList.toggle("cms-select", window.__cmsSel); }
    });
    document.addEventListener("click", function (e) {
      var t = e.target && e.target.nodeType === 1 ? e.target : e.target && e.target.parentElement;
      if (!t) return;
      if (window.__cmsSel) {
        e.preventDefault(); e.stopPropagation();
        var k = t.closest("[data-cms-k]");
        if (k) post({ type: "select", key: k.getAttribute("data-cms-k") });
        return;
      }
      var a = t.closest("a[href]");
      if (!a || a.hasAttribute("data-consult")) return;
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) === "#") return;
      e.preventDefault();
      var file = href.split("#")[0].split("?")[0];
      if (o.pages.indexOf(file) > -1) post({ type: "nav", page: file });
      else if (/^(https?:|mailto:|tel:)/.test(href)) window.open(a.href, "_blank", "noopener");
    }, true);
    document.addEventListener("submit", function (e) { if (window.__cmsSel) e.preventDefault(); }, true);
    var st = 0;
    window.addEventListener("scroll", function () { if (st) return; st = setTimeout(function () { st = 0; post({ type: "scroll", y: window.scrollY }); }, 150); }, { passive: true });
    window.addEventListener("load", function () {
      document.querySelectorAll("[data-count]").forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
      if (o.scroll) window.scrollTo(0, o.scroll);
      if (o.consult) { var m = document.getElementById("consultModal"); if (m) { m.classList.add("is-open"); document.body.classList.add("modal-open"); } }
    });
  };

  const frontFrame = () => PV.frames[PV.front];
  function frontDoc() { try { const f = frontFrame(); return f && f.classList.contains("is-front") ? f.contentDocument : null; } catch (e) { return null; } }
  function previewPage() {
    if (S.tab === "files" && isHtml(S.file) && S.docs[S.file]) return S.file;
    return S.page === CONSULT || !S.docs[S.page] ? HOME : S.page;
  }
  const consultMode = () => S.page === CONSULT && S.tab === "pages";
  function previewVisible() { const st = $(".stage"); return !!st && getComputedStyle(st).display !== "none"; }
  function schedulePreview(ms = 400) { clearTimeout(PV.timer); PV.timer = setTimeout(renderPreview, ms); }
  function markKeys(a, b) {
    const A = a.getElementsByTagName("*"), B = b.getElementsByTagName("*");
    for (let i = 0; i < A.length; i++) { const k = S.keys.get(A[i]); if (k && B[i]) B[i].setAttribute("data-cms-k", k); }
  }
  function buildPreview(page) {
    const doc = S.docs[page];
    const clone = doc.cloneNode(true);
    markKeys(doc, clone);
    const head = clone.head;
    const base = clone.createElement("base");
    base.setAttribute("href", siteBase());
    const shim = clone.createElement("script");
    shim.textContent = "(" + SHIM + ")(" + JSON.stringify({ "oso-theme": S.preview.theme, "oso-lang": S.preview.lang }) + ");";
    head.prepend(base, shim);
    const link = head.querySelector('link[rel="stylesheet"][href*="main.css"]');
    const st = clone.createElement("style");
    st.id = "cms-css";
    st.textContent = S.text[CSS_PATH] || "";
    if (link) link.replaceWith(st); else head.append(st);
    const pst = clone.createElement("style");
    pst.textContent = PREVIEW_CSS;
    head.append(pst);
    clone.querySelectorAll("img[src]").forEach(im => { const u = upUrl(im.getAttribute("src")); if (u) im.setAttribute("src", u); });
    let js = S.text[JS_PATH] || "";
    const consult = consultMode();
    if (consult) {
      const cd = consultDoc();
      if (cd) { const cc = cd.cloneNode(true); markKeys(cd, cc); js = js.replace(MODAL_RE, (a, p1, p2, p3) => p1 + escTpl(cc.body.innerHTML) + p3); }
    }
    if (PV.blob) URL.revokeObjectURL(PV.blob);
    PV.blob = URL.createObjectURL(new Blob([js], { type: "text/javascript" }));
    const sc = clone.querySelector('script[src*="main.js"]');
    if (sc) sc.setAttribute("src", PV.blob);
    const agent = clone.createElement("script");
    agent.textContent = "(" + AGENT + ")(" + JSON.stringify({ scroll: PV.scroll, select: S.preview.select, consult, pages: S.pages.map(p => p.path) }) + ");";
    clone.body.append(agent);
    return "<!DOCTYPE html>\n" + clone.documentElement.outerHTML;
  }
  function renderPreview() {
    if (!S.loaded || !PV.frames.length) return;
    if (!previewVisible()) { PV.stale = true; return; }
    PV.stale = false;
    const page = previewPage();
    const front = PV.frames[PV.front], back = PV.frames[1 - PV.front];
    try { if (front.dataset.page === page && front.contentWindow) PV.scroll = front.contentWindow.scrollY || PV.scroll; } catch (e) { /* ignore */ }
    const id = ++PV.id;
    const view = $("#pvView");
    if (view && !front.dataset.page) view.classList.add("is-loading");
    const swap = () => {
      if (id !== PV.id || back.classList.contains("is-front")) return;
      back.classList.add("is-front"); front.classList.remove("is-front");
      PV.front = 1 - PV.front;
      if (view) view.classList.remove("is-loading");
    };
    back.onload = () => setTimeout(swap, 50);
    setTimeout(swap, 3500);
    back.dataset.page = page;
    back.srcdoc = buildPreview(page);
  }
  function previewPatch(el, fn) {
    const d = frontDoc();
    const k = S.keys.get(el);
    if (!d || !k) { schedulePreview(); return; }
    const pel = d.querySelector('[data-cms-k="' + k + '"]');
    if (!pel) { schedulePreview(); return; }
    try { fn(pel); } catch (e) { schedulePreview(); return; }
    const lang = S.preview.lang;
    if (pel.hasAttribute("data-en")) {
      const v = pel.getAttribute("data-" + lang);
      if (v != null) { const ia = pel.getAttribute("data-i18n-attr"); if (ia) pel.setAttribute(ia, v); else pel.textContent = v; }
    }
    if (pel.hasAttribute("data-en-ph")) pel.setAttribute("placeholder", pel.getAttribute(lang === "ar" ? "data-ar-ph" : "data-en-ph") || "");
    if (pel.tagName === "IMG") { const u = upUrl(pel.getAttribute("src")); if (u) pel.setAttribute("src", u); }
    if (pel.hasAttribute("data-count")) pel.textContent = pel.getAttribute("data-count");
  }
  function highlightInPreview(k) {
    const d = frontDoc();
    if (!d) return;
    const el = d.querySelector('[data-cms-k="' + k + '"]');
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = d.defaultView.innerHeight;
    if ((r.width || r.height) && (r.top < 70 || r.bottom > vh - 20)) el.scrollIntoView({ block: "center", behavior: "smooth" });
    d.querySelectorAll(".cms-flash").forEach(x => x.classList.remove("cms-flash"));
    el.classList.add("cms-flash");
    clearTimeout(PV.flashT);
    PV.flashT = setTimeout(() => el.classList.remove("cms-flash"), 1600);
  }
  function focusField(key) {
    if (S.tab !== "pages") setTab("pages");
    const f = S.fieldByKey.get(key);
    if (!f) return;
    if (S.search) { S.search = ""; const s = $(".search__inp"); if (s) s.value = ""; applySearch(""); }
    let p = f.parentElement;
    while (p) { if (p.tagName === "DETAILS") p.open = true; p = p.parentElement; }
    $("#app").classList.remove("show-preview");
    S.fromPreview = true;
    f.scrollIntoView({ block: "center", behavior: "smooth" });
    f.classList.remove("is-flash"); void f.offsetWidth; f.classList.add("is-flash");
    const inp = f.querySelector("input:not([type=checkbox]):not([type=file]), textarea");
    if (inp) inp.focus({ preventScroll: true });
    setTimeout(() => { S.fromPreview = false; }, 50);
  }
  function layoutPreview() {
    const view = $("#pvView"), wrap = $("#pvWrap"), frame = $("#pvFrame");
    if (!view || !wrap || !frame) return;
    const W = view.clientWidth - 32, H = view.clientHeight - 32;
    if (W <= 0 || H <= 0) return;
    const devW = { desktop: 1366, tablet: 820, mobile: 390 }[S.preview.device] || 1366;
    const s = Math.min(1, W / devW);
    wrap.style.width = Math.floor(devW * s) + "px";
    wrap.style.height = H + "px";
    frame.style.width = devW + "px";
    frame.style.height = Math.ceil(H / s) + "px";
    frame.style.transform = "scale(" + s + ")";
    const z = $("#pvZoom");
    if (z) z.textContent = Math.round(s * 100) + "%";
  }
  function savePreviewPrefs() { store.set(LS.preview, JSON.stringify(S.preview)); }

  /* ======================================================================
     BACKEND (Supabase): leads + privacy-friendly visitor analytics.
     The site writes rows with the public key; only admins listed in
     bv_admins can read them (row level security).
     ====================================================================== */
  const BACKEND_RE = /(\/\* @cms-backend-start \*\/\s*const BACKEND = )(\{[^;\n]*\})(;)/;
  const STATUSES = ["new", "contacted", "qualified", "won", "lost"];
  const SOURCES = [[/google\./, "Google"], [/bing\./, "Bing"], [/yahoo\./, "Yahoo"], [/duckduckgo/, "DuckDuckGo"], [/facebook|^fb\.|^m\.fb/, "Facebook"],
    [/instagram/, "Instagram"], [/linkedin|lnkd\.in/, "LinkedIn"], [/^t\.co$|twitter|^x\.com/, "X"], [/whatsapp|wa\.me/, "WhatsApp"], [/tiktok/, "TikTok"],
    [/youtube|youtu\.be/, "YouTube"], [/snapchat/, "Snapchat"], [/chatgpt|openai/, "ChatGPT"], [/perplexity/, "Perplexity"], [/claude\.ai/, "Claude"],
    [/gemini/, "Gemini"], [/behance/, "Behance"]];
  const ZONES = {
    "Africa/Cairo": ["مصر", "Egypt"], "Asia/Riyadh": ["السعودية", "Saudi Arabia"], "Asia/Dubai": ["الإمارات", "UAE"], "Asia/Kuwait": ["الكويت", "Kuwait"],
    "Asia/Qatar": ["قطر", "Qatar"], "Asia/Bahrain": ["البحرين", "Bahrain"], "Asia/Muscat": ["عُمان", "Oman"], "Asia/Amman": ["الأردن", "Jordan"],
    "Asia/Beirut": ["لبنان", "Lebanon"], "Asia/Baghdad": ["العراق", "Iraq"], "Asia/Damascus": ["سوريا", "Syria"], "Asia/Gaza": ["فلسطين", "Palestine"],
    "Asia/Hebron": ["فلسطين", "Palestine"], "Africa/Khartoum": ["السودان", "Sudan"], "Africa/Tripoli": ["ليبيا", "Libya"], "Africa/Tunis": ["تونس", "Tunisia"],
    "Africa/Algiers": ["الجزائر", "Algeria"], "Africa/Casablanca": ["المغرب", "Morocco"], "Europe/Istanbul": ["تركيا", "Türkiye"], "Europe/London": ["بريطانيا", "UK"],
    "Europe/Berlin": ["ألمانيا", "Germany"], "Europe/Paris": ["فرنسا", "France"], "America/New_York": ["أمريكا", "USA"], "America/Chicago": ["أمريكا", "USA"],
    "America/Los_Angeles": ["أمريكا", "USA"], "America/Toronto": ["كندا", "Canada"]
  };
  // Categorical slots validated for the dark panel surface (dataviz validator, all pairs).
  const VIZ = ["#1B9BCB", "#C98500", "#D55181"];
  const DATA = { range: 30, stats: null, leads: null, loadingStats: false, loadingLeads: false, errStats: "", errLeads: "", demo: false, metric: "visitors", filter: "all", q: "", service: "", table: false };

  function siteBackend() { const m = BACKEND_RE.exec(S.text[JS_PATH] || ""); return (m && safeJSON(m[2])) || {}; }
  function backendCfg() {
    const local = safeJSON(store.get(LS.sbCfg));
    if (local && local.url && local.key) return local;
    const s = siteBackend();
    return { url: s.url || "", key: s.key || "" };
  }
  function jwtRole(k) { try { return JSON.parse(atob(k.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).role || ""; } catch (e) { return ""; } }
  const isSecretKey = k => /^sb_secret_/.test(k) || jwtRole(k) === "service_role";
  function writeSiteBackend(url, key) {
    const js = S.text[JS_PATH];
    if (!js || !BACKEND_RE.test(js)) return false;
    const val = JSON.stringify({ url, key });
    if (BACKEND_RE.exec(js)[2] === val) return true;
    snapshot([JS_PATH], "backend");
    S.text[JS_PATH] = js.replace(BACKEND_RE, (a, p1, p2, p3) => p1 + val + p3);
    S.lastUndo = null;
    changed();
    return true;
  }
  const codeErr = code => { const e = new Error(code); e.code = code; return e; };

  const SB = {
    ready() { const c = backendCfg(); return !!(c.url && c.key); },
    base() { return backendCfg().url.replace(/\/+$/, ""); },
    session() { return safeJSON(store.get(LS.sbAuth)); },
    async auth(grant, body) {
      let r;
      try {
        r = await fetch(this.base() + "/auth/v1/token?grant_type=" + grant, {
          method: "POST", headers: { apikey: backendCfg().key, "Content-Type": "application/json" }, body: JSON.stringify(body)
        });
      } catch (e) { throw codeErr("net"); }
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { const e = new Error(j.error_description || j.msg || j.message || r.statusText); e.status = r.status; e.code = j.error_code || j.error || ""; throw e; }
      const a = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Date.now() + (j.expires_in || 3600) * 1000, email: (j.user && j.user.email) || body.email || "" };
      store.set(LS.sbAuth, JSON.stringify(a));
      return a;
    },
    signIn(email, password) { return this.auth("password", { email, password }); },
    signOut() { store.del(LS.sbAuth); },
    async token() {
      let a = this.session();
      if (!a) return null;
      if (Date.now() > (a.expires_at || 0) - 60000) {
        try { a = await this.auth("refresh_token", { refresh_token: a.refresh_token }); }
        catch (e) { if (e.code !== "net") this.signOut(); return null; }
      }
      return a.access_token;
    },
    async req(path, opts = {}) {
      if (!this.ready()) throw codeErr("noBackend");
      const tok = await this.token();
      if (!tok) throw codeErr("noAuth");
      const headers = Object.assign({ apikey: backendCfg().key, Authorization: "Bearer " + tok, "Content-Type": "application/json" }, opts.headers || {});
      let r;
      try { r = await fetch(this.base() + path, { method: opts.method || "GET", headers, body: opts.body, cache: "no-store" }); }
      catch (e) { throw codeErr("net"); }
      if (!r.ok) {
        let j = {};
        try { j = await r.json(); } catch (e) { /* ignore */ }
        const e = new Error(j.message || j.msg || r.statusText); e.status = r.status; e.code = j.code || "";
        if (r.status === 401) this.signOut();
        throw e;
      }
      if (r.status === 204) return null;
      const txt = await r.text();
      return txt ? JSON.parse(txt) : null;
    }
  };
  function sbErrorText(e) {
    if (!e) return "";
    if (e.code === "noBackend") return t("sbNotSetup");
    if (e.code === "noAuth") return t("sbNeedLogin");
    if (e.code === "net") return t("errNetwork");
    if (/invalid login credentials|invalid_credentials/i.test(e.message + " " + e.code)) return t("sbBadLogin");
    if (e.code === "42P01" || e.code === "PGRST205" || e.code === "PGRST202" || /does not exist|schema cache/i.test(e.message)) return t("sbNoTables");
    if (e.code === "42501" || /not allowed|permission denied/i.test(e.message)) return t("sbNotAdmin");
    if (e.status === 401) return t("sbBadKey");
    return e.message || String(e);
  }
  function buildSql(email) {
    const em = email.trim().toLowerCase().replace(/'/g, "''");
    return `-- Brand Vitals dashboard: leads + visitor analytics
-- Paste into Supabase > SQL Editor > New query, then press Run. Safe to run again.

create table if not exists public.bv_admins (email text primary key);
insert into public.bv_admins (email) values ('${em}') on conflict do nothing;

create table if not exists public.bv_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text check (char_length(email) <= 200),
  phone text check (char_length(phone) <= 60),
  company text check (char_length(company) <= 200),
  service text check (char_length(service) <= 120),
  budget text check (char_length(budget) <= 120),
  message text check (char_length(message) <= 5000),
  form text check (char_length(form) <= 40),
  page text check (char_length(page) <= 300),
  lang text check (char_length(lang) <= 8),
  referrer text check (char_length(referrer) <= 300),
  utm_source text check (char_length(utm_source) <= 120),
  utm_medium text check (char_length(utm_medium) <= 120),
  utm_campaign text check (char_length(utm_campaign) <= 160),
  visitor text check (char_length(visitor) <= 64),
  status text not null default 'new' check (status in ('new','contacted','qualified','won','lost')),
  notes text check (char_length(notes) <= 5000),
  updated_at timestamptz
);
create index if not exists bv_leads_created_idx on public.bv_leads (created_at desc);

create table if not exists public.bv_pageviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null check (char_length(path) <= 300),
  title text check (char_length(title) <= 300),
  referrer text check (char_length(referrer) <= 300),
  utm_source text check (char_length(utm_source) <= 120),
  utm_medium text check (char_length(utm_medium) <= 120),
  utm_campaign text check (char_length(utm_campaign) <= 160),
  visitor text check (char_length(visitor) <= 64),
  session text check (char_length(session) <= 64),
  is_new boolean,
  lang text check (char_length(lang) <= 8),
  device text check (char_length(device) <= 16),
  tz text check (char_length(tz) <= 64)
);
create index if not exists bv_pageviews_created_idx on public.bv_pageviews (created_at);

alter table public.bv_admins enable row level security;
alter table public.bv_leads enable row level security;
alter table public.bv_pageviews enable row level security;

create or replace function public.bv_is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.bv_admins a where a.email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- Visitors can only add rows. Only admins can read, update or delete.
drop policy if exists bv_leads_insert on public.bv_leads;
create policy bv_leads_insert on public.bv_leads for insert to anon, authenticated
  with check (status = 'new' and notes is null and updated_at is null);
drop policy if exists bv_leads_admin on public.bv_leads;
create policy bv_leads_admin on public.bv_leads for all to authenticated
  using (public.bv_is_admin()) with check (public.bv_is_admin());
drop policy if exists bv_pv_insert on public.bv_pageviews;
create policy bv_pv_insert on public.bv_pageviews for insert to anon, authenticated with check (true);
drop policy if exists bv_pv_admin on public.bv_pageviews;
create policy bv_pv_admin on public.bv_pageviews for all to authenticated
  using (public.bv_is_admin()) with check (public.bv_is_admin());

grant usage on schema public to anon, authenticated;
grant insert on public.bv_leads, public.bv_pageviews to anon, authenticated;
grant select, update, delete on public.bv_leads, public.bv_pageviews to authenticated;

drop function if exists public.bv_stats(int, text);
create or replace function public.bv_stats(span int default 30, zone text default 'Africa/Cairo', paths text[] default null, forms text[] default null)
returns json language plpgsql stable security definer set search_path = public as $$
declare
  n int := greatest(1, least(coalesce(span, 30), 366));
  since timestamptz := now() - make_interval(days => n);
  prev timestamptz := now() - make_interval(days => n * 2);
  result json;
begin
  if not public.bv_is_admin() then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  begin
    perform now() at time zone zone;
  exception when others then
    zone := 'UTC';
  end;
  with pv as (select * from public.bv_pageviews where created_at >= since and (paths is null or path = any(paths))),
       pp as (select * from public.bv_pageviews where created_at >= prev and created_at < since and (paths is null or path = any(paths))),
       ld as (select * from public.bv_leads where created_at >= since and (forms is null or form = any(forms))),
       ss as (select session, count(*) as c from pv group by session),
       ps as (select session, count(*) as c from pp group by session)
  select json_build_object(
    'days', n,
    'visitors', (select count(distinct visitor) from pv),
    'new_visitors', (select count(distinct visitor) from pv where is_new),
    'pageviews', (select count(*) from pv),
    'sessions', (select count(*) from ss),
    'bounces', (select count(*) from ss where c = 1),
    'leads', (select count(*) from ld),
    'prev_visitors', (select count(distinct visitor) from pp),
    'prev_pageviews', (select count(*) from pp),
    'prev_sessions', (select count(*) from ps),
    'prev_bounces', (select count(*) from ps where c = 1),
    'prev_leads', (select count(*) from public.bv_leads where created_at >= prev and created_at < since and (forms is null or form = any(forms))),
    'live', (select count(distinct visitor) from public.bv_pageviews where created_at >= now() - interval '5 minutes' and (paths is null or path = any(paths))),
    'daily', coalesce((select json_agg(d order by d.day) from (
        select to_char(g.day, 'YYYY-MM-DD') as day,
               coalesce(v.visitors, 0) as visitors, coalesce(v.views, 0) as views, coalesce(l.leads, 0) as leads
        from generate_series(date_trunc('day', since at time zone zone), date_trunc('day', now() at time zone zone), interval '1 day') as g(day)
        left join (select date_trunc('day', created_at at time zone zone) as dd, count(distinct visitor) as visitors, count(*) as views from pv group by 1) v on v.dd = g.day
        left join (select date_trunc('day', created_at at time zone zone) as dd, count(*) as leads from ld group by 1) l on l.dd = g.day
      ) d), '[]'::json),
    'pages', coalesce((select json_agg(x) from (select path as k, count(*) as views, count(distinct visitor) as visitors from pv group by path order by 2 desc limit 12) x), '[]'::json),
    'sources', coalesce((select json_agg(x) from (select coalesce(nullif(utm_source, ''), nullif(referrer, ''), '') as k, count(distinct visitor) as visitors from pv group by 1 order by 2 desc limit 15) x), '[]'::json),
    'devices', coalesce((select json_agg(x) from (select coalesce(nullif(device, ''), 'other') as k, count(distinct visitor) as visitors from pv group by 1 order by 2 desc) x), '[]'::json),
    'langs', coalesce((select json_agg(x) from (select coalesce(nullif(lang, ''), 'en') as k, count(distinct visitor) as visitors from pv group by 1 order by 2 desc) x), '[]'::json),
    'zones', coalesce((select json_agg(x) from (select coalesce(nullif(pv.tz, ''), '') as k, count(distinct visitor) as visitors from pv group by 1 order by 2 desc limit 15) x), '[]'::json)
  ) into result;
  return result;
end;
$$;

revoke execute on function public.bv_stats(int, text, text[], text[]) from public, anon;
grant execute on function public.bv_is_admin() to authenticated;
grant execute on function public.bv_stats(int, text, text[], text[]) to authenticated;
`;
  }

  /* ---------- data ---------- */
  const localTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Cairo"; } catch (e) { return "Africa/Cairo"; } };
  async function loadStats() {
    if (DATA.demo) { DATA.stats = demoStats(DATA.range); return; }
    DATA.loadingStats = true; DATA.errStats = "";
    try { DATA.stats = await SB.req("/rest/v1/rpc/bv_stats", { method: "POST", body: JSON.stringify({ span: DATA.range, zone: localTz(), paths: S.pages.map(p => p.path), forms: B.forms }) }); }
    catch (e) { DATA.errStats = sbErrorText(e); }
    DATA.loadingStats = false;
  }
  async function loadLeads() {
    if (DATA.demo) { if (!DATA.leads) DATA.leads = demoLeads(); return; }
    DATA.loadingLeads = true; DATA.errLeads = "";
    try { DATA.leads = (await SB.req("/rest/v1/bv_leads?select=*&order=created_at.desc&limit=2000&form=in.(" + B.forms.join(",") + ")")) || []; }
    catch (e) { DATA.errLeads = sbErrorText(e); }
    DATA.loadingLeads = false;
    renderRail();
  }
  let refreshing = null;
  function refreshData(which) {
    if (refreshing) return refreshing;
    const jobs = [];
    if (which !== "leads") jobs.push(loadStats());
    if (which !== "stats") jobs.push(loadLeads());
    refreshing = Promise.all(jobs).then(() => {
      refreshing = null;
      if (S.tab === "overview" || S.tab === "leads") renderTab(true);
    });
    return refreshing;
  }
  function resetData() { DATA.stats = null; DATA.leads = null; DATA.errStats = ""; DATA.errLeads = ""; }

  /* ---------- formatting ---------- */
  const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
  const compactFmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
  const fmtNum = v => { v = +v || 0; return Math.abs(v) >= 10000 ? compactFmt.format(v) : numFmt.format(v); };
  const dateLoc = () => (S.ui === "ar" ? "ar-EG-u-nu-latn" : "en-GB");
  const fmtDay = s => { const p = String(s).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(dateLoc(), { day: "numeric", month: "short" }); };
  const fmtDate = s => new Date(s).toLocaleString(dateLoc(), { dateStyle: "medium", timeStyle: "short" });
  function timeAgo(s) {
    const diff = (new Date(s).getTime() - Date.now()) / 1000;
    if (Math.abs(diff) < 60) return t("justNow");
    const rtf = new Intl.RelativeTimeFormat(dateLoc(), { numeric: "auto" });
    for (const [u, sec] of [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]]) {
      if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), u);
    }
    return t("justNow");
  }
  const srcName = k => { if (!k) return t("direct"); const s = String(k).toLowerCase(); for (const [re, n] of SOURCES) if (re.test(s)) return n; return k; };
  const zoneName = k => (ZONES[k] ? ZONES[k][S.ui === "ar" ? 0 : 1] : k ? k.split("/").pop().replace(/_/g, " ") : t("unknown"));
  const deviceName = k => ({ mobile: t("dMobile"), desktop: t("dDesktop"), tablet: t("dTablet") }[k] || t("other"));
  const langName = k => (k === "ar" ? "العربية" : k === "en" ? "English" : k || t("unknown"));
  function merge(rows, nameOf, key = "visitors") {
    const m = new Map();
    for (const r of rows || []) { const n = nameOf(r.k); m.set(n, (m.get(n) || 0) + (+r[key] || 0)); }
    return [...m.entries()].map(([label, v]) => ({ label, v })).sort((a, b) => b.v - a.v);
  }
  function waDigits(phone) {
    let d = String(phone || "").replace(/[^\d]/g, "");
    if (!d) return "";
    if (d.startsWith("00")) d = d.slice(2);
    else if (/^0\d{10}$/.test(d)) d = "20" + d.slice(1); // Egyptian local mobile 01xxxxxxxxx
    return d.length >= 8 ? d : "";
  }
  const initials = n => String(n || "?").trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0)).join("").toUpperCase() || "?";

  /* ---------- sample data (clearly labelled, never mixed with real data) ---------- */
  function prng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }
  const isoDay = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function demoSeries(days, offset) {
    const rnd = prng(97 + offset);
    const out = [];
    for (let i = days; i >= 0; i--) {
      const d = new Date(Date.now() - (i + offset) * 864e5);
      const wk = d.getDay() === 5 || d.getDay() === 6 ? 0.7 : 1;
      const v = Math.round((30 + (days - i) * (offset ? 0.2 : 0.35) + rnd() * 20) * wk);
      out.push({ day: isoDay(d), visitors: v, views: Math.round(v * (1.8 + rnd() * 0.9)), leads: rnd() < 0.42 ? 1 + Math.round(rnd() * 1.4) : 0 });
    }
    return out;
  }
  function demoStats(days) {
    const cur = demoSeries(days, 0), prev = demoSeries(days, days);
    const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
    const visitors = Math.round(sum(cur, "visitors") * 0.8), pageviews = sum(cur, "views"), sessions = Math.round(sum(cur, "visitors") * 0.95);
    const pv = Math.round(sum(prev, "visitors") * 0.8), psess = Math.round(sum(prev, "visitors") * 0.95);
    const share = (arr, total) => arr.map(([k, f]) => ({ k, visitors: Math.round(total * f), views: Math.round(pageviews * f) }));
    return {
      days, visitors, new_visitors: Math.round(visitors * 0.74), pageviews, sessions, bounces: Math.round(sessions * 0.41), leads: sum(cur, "leads"),
      prev_visitors: pv, prev_pageviews: sum(prev, "views"), prev_sessions: psess, prev_bounces: Math.round(psess * 0.46), prev_leads: sum(prev, "leads"),
      live: 3, daily: cur,
      pages: share([["index.html", 0.46], ["solutions.html", 0.16], ["work.html", 0.12], ["contact.html", 0.1], ["about.html", 0.08], ["products.html", 0.05], ["careers.html", 0.02], ["privacy.html", 0.01]], visitors),
      sources: share([["google.com", 0.41], ["", 0.24], ["instagram.com", 0.15], ["facebook.com", 0.09], ["linkedin.com", 0.06], ["chatgpt.com", 0.03], ["wa.me", 0.02]], visitors),
      devices: share([["mobile", 0.63], ["desktop", 0.32], ["tablet", 0.05]], visitors),
      langs: share([["en", 0.57], ["ar", 0.43]], visitors),
      zones: share([["Africa/Cairo", 0.78], ["Asia/Riyadh", 0.09], ["Asia/Dubai", 0.06], ["Asia/Kuwait", 0.03], ["Europe/London", 0.02], ["America/New_York", 0.02]], visitors)
    };
  }
  function demoLeads() {
    const ar = S.ui === "ar";
    const tag = ar ? " (تجريبي)" : " (sample)";
    const rows = [
      ["Ahmed Hassan", "Nile Home Furnishing", "SEM / Google Ads", "30,000 to 50,000 EGP", "new", 0.08, "google.com", "We run two showrooms in New Cairo and want more store visits from Google."],
      ["Mariam Adel", "Glow Clinic", "Social media ads", "10,000 to 30,000 EGP", "new", 0.9, "instagram.com", "Looking for a monthly Instagram and TikTok ads plan for a dermatology clinic."],
      ["Omar Khaled", "Tamr Foods", "Multiple services", "100,000+ EGP", "contacted", 2.4, "", "Launching a new product line, need branding, a website and paid media."],
      ["Nour El Din", "", "SEO", "Under 10,000 EGP", "qualified", 4.2, "linkedin.com", "Our e-commerce site gets little organic traffic. Can you audit it?"],
      ["Sara Mostafa", "Vista Real Estate", "Branding & design", "50,000 to 100,000 EGP", "won", 9.5, "google.com", "Rebrand for a real estate developer ahead of a new compound launch."],
      ["Youssef Tarek", "Pulse Gym", "Content production", "", "lost", 15, "facebook.com", "Need monthly reels and photography for three branches."]
    ];
    return rows.map((r, i) => ({
      id: "demo-" + i, created_at: new Date(Date.now() - r[5] * 864e5).toISOString(), name: r[0] + tag, company: r[1], service: r[2], budget: r[3], status: r[4],
      email: "sample" + (i + 1) + "@example.com", phone: "+20 100 000 00" + String(i + 1).padStart(2, "0"), message: r[7], referrer: r[6],
      form: i % 3 === 1 ? "consult" : "contact", page: i % 3 === 1 ? "index.html" : "contact.html", lang: i % 2 ? "ar" : "en", notes: i === 2 ? (ar ? "كلمته، مستني يبعت الـ brief." : "Called, waiting for the brief.") : ""
    }));
  }

  /* ---------- shared building blocks ---------- */
  function loadBox() { return h("div", { class: "loadbox" }, h("span", { class: "spin" }), h("span", null, t("loadingData"))); }
  function errBox(msg, retry) { return h("div", { class: "errbox errbox--row" }, icon("warn"), h("span", null, msg), retry ? btn(t("retry"), "refresh", retry, "sm") : null); }
  function demoBanner() {
    return h("div", { class: "demo-banner" }, icon("warn"), h("span", null, t("demoBanner")),
      btn(t("demoStop"), "close", () => { DATA.demo = false; resetData(); renderTab(); }, "sm"));
  }
  function setupHero() {
    return h("section", { class: "setup" },
      h("div", { class: "setup__ico" }, icon("database")),
      h("h3", null, t("setupTitle")),
      h("p", { class: "muted" }, t("setupBody")),
      h("div", { class: "row row--center" },
        btn(t("setupStart"), "settings", () => { S.open.add("sb-card"); setTab("settings"); }, "primary"),
        btn(t("demoShow"), "eye", () => { DATA.demo = true; resetData(); renderTab(); }, "ghost")));
  }
  function signInForm(onDone) {
    const em = h("input", { class: "inp", type: "email", dir: "ltr", autocomplete: "username", placeholder: "you@brandvitals.io" });
    em.value = store.get(LS.sbEmail) || "";
    const pw = h("input", { class: "inp", type: "password", dir: "ltr", autocomplete: "current-password" });
    const msg = h("p", { class: "fld__msg" });
    const go = h("button", { type: "submit", class: "btn btn--primary" }, icon("key"), h("span", null, t("signIn")));
    const form = h("form", { class: "signin", onsubmit: async e => {
      e.preventDefault();
      msg.textContent = "";
      go.disabled = true;
      try {
        await SB.signIn(em.value.trim(), pw.value);
        store.set(LS.sbEmail, em.value.trim());
        store.set(LS.noTrack, "1");
        resetData();
        toast(t("signedAs", { e: em.value.trim() }), "ok");
        if (onDone) onDone();
      } catch (err) { msg.textContent = sbErrorText(err); }
      go.disabled = false;
    } },
      h("div", { class: "grid2" }, h("label", { class: "fld" }, h("span", { class: "fld__label" }, t("email")), em), h("label", { class: "fld" }, h("span", { class: "fld__label" }, t("password")), pw)),
      h("div", { class: "row" }, go), msg);
    return form;
  }
  function loginCard() {
    return h("section", { class: "setup setup--sm" },
      h("div", { class: "setup__ico" }, icon("key")),
      h("h3", null, t("sbLoginTitle")), h("p", { class: "muted" }, t("sbLoginBody")),
      signInForm(() => renderTab()));
  }
  // Returns true when the tab can show data (connected + signed in, or sample mode).
  function dataGate(P) {
    if (DATA.demo) { P.append(demoBanner()); return true; }
    if (!SB.ready()) { P.append(setupHero()); return false; }
    if (!SB.session()) { P.append(loginCard()); return false; }
    return true;
  }
  function statusPill(st) { return h("span", { class: "st st--" + st }, h("i"), t("st_" + st)); }

  /* ---------- charts ---------- */
  function niceStep(x) { if (x <= 1) return 1; const p = Math.pow(10, Math.floor(Math.log10(x))); const f = x / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
  const escXml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  function lineChart(rows, key, label) {
    const wrap = h("div", { class: "chart", tabindex: "0", role: "img", "aria-label": label });
    const tip = h("div", { class: "tip", hidden: true });
    wrap.append(tip);
    let idx = -1, geo = null;
    const draw = () => {
      const old = wrap.querySelector("svg");
      if (old) old.remove();
      const W = Math.max(280, Math.floor(wrap.clientWidth)), H = 250, pl = 44, pr = 46, pt = 14, pb = 30;
      const n = rows.length;
      const vals = rows.map(r => +r[key] || 0);
      const step = niceStep(Math.max(...vals, 1) / 4), max = step * 4;
      const x = i => pl + (n <= 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (n - 1));
      const y = v => pt + (H - pt - pb) * (1 - v / max);
      geo = { x, y, n, pl, pr, W, vals };
      let s = '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">';
      for (let i = 0; i <= 4; i++) {
        const yy = Math.round(y(step * i)) + 0.5;
        s += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" class="' + (i ? "c-grid" : "c-base") + '"/>';
        s += '<text x="' + (pl - 10) + '" y="' + (yy + 4) + '" class="c-tick" text-anchor="end">' + escXml(fmtNum(step * i)) + "</text>";
      }
      const every = Math.max(1, Math.ceil(n / 6));
      for (let i = 0; i < n; i += every) s += '<text x="' + x(i).toFixed(1) + '" y="' + (H - 9) + '" class="c-tick" text-anchor="middle">' + escXml(fmtDay(rows[i].day)) + "</text>";
      if (n) {
        const pts = vals.map((v, i) => x(i).toFixed(1) + "," + y(v).toFixed(1));
        s += '<path class="c-area" d="M' + x(0).toFixed(1) + "," + y(0) + " L" + pts.join(" L") + " L" + x(n - 1).toFixed(1) + "," + y(0) + ' Z"/>';
        s += '<polyline class="c-line" points="' + pts.join(" ") + '"/>';
        const lv = vals[n - 1];
        s += '<circle class="c-dot" cx="' + x(n - 1).toFixed(1) + '" cy="' + y(lv).toFixed(1) + '" r="4"/>';
        s += '<text class="c-end" x="' + (x(n - 1) + 9).toFixed(1) + '" y="' + (y(lv) + 4).toFixed(1) + '">' + escXml(fmtNum(lv)) + "</text>";
      }
      s += '<line class="c-cross" y1="' + pt + '" y2="' + (H - pb) + '" x1="0" x2="0" visibility="hidden"/><circle class="c-hdot" r="4" cx="0" cy="0" visibility="hidden"/>';
      s += '<rect class="c-hit" x="' + pl + '" y="0" width="' + Math.max(1, W - pl - pr) + '" height="' + H + '"/></svg>';
      wrap.insertAdjacentHTML("afterbegin", s);
      const svg = wrap.querySelector("svg");
      svg.addEventListener("pointermove", e => {
        const r = svg.getBoundingClientRect();
        show(Math.round((e.clientX - r.left - pl) / ((W - pl - pr) / Math.max(1, n - 1))));
      });
      svg.addEventListener("pointerleave", hide);
      if (idx >= 0) show(idx);
    };
    const show = i => {
      if (!geo || !geo.n) return;
      idx = Math.max(0, Math.min(geo.n - 1, i));
      const svg = wrap.querySelector("svg"), r = rows[idx], cx = geo.x(idx), cy = geo.y(geo.vals[idx]);
      const cr = svg.querySelector(".c-cross"), hd = svg.querySelector(".c-hdot");
      cr.setAttribute("x1", cx); cr.setAttribute("x2", cx); cr.setAttribute("visibility", "visible");
      hd.setAttribute("cx", cx); hd.setAttribute("cy", cy); hd.setAttribute("visibility", "visible");
      tip.replaceChildren(h("div", { class: "tip__date" }, fmtDay(r.day)),
        ...[["visitors", t("kVisitors")], ["views", t("kViews")], ["leads", t("kLeads")]].map(([k, l]) =>
          h("div", { class: "tip__row" + (k === key ? " is-key" : "") }, h("i"), h("b", null, fmtNum(r[k])), h("span", null, l))));
      tip.hidden = false;
      const tw = tip.offsetWidth;
      tip.style.left = Math.round(cx + 14 + tw > geo.W ? cx - 14 - tw : cx + 14) + "px";
    };
    const hide = () => {
      idx = -1;
      tip.hidden = true;
      const svg = wrap.querySelector("svg");
      if (svg) { svg.querySelector(".c-cross").setAttribute("visibility", "hidden"); svg.querySelector(".c-hdot").setAttribute("visibility", "hidden"); }
    };
    wrap.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); show((idx < 0 ? rows.length : idx) + (e.key === "ArrowRight" ? 1 : -1)); }
      else if (e.key === "Escape") hide();
    });
    wrap.addEventListener("blur", hide);
    requestAnimationFrame(draw);
    if (window.ResizeObserver) { let w0 = 0; new ResizeObserver(() => { const w = Math.floor(wrap.clientWidth); if (w && w !== w0) { w0 = w; draw(); } }).observe(wrap); }
    return wrap;
  }
  function barList(items, fmt, emptyText) {
    if (!items.length) return h("p", { class: "muted small" }, emptyText || t("noData"));
    const max = Math.max(...items.map(i => i.v), 1);
    return h("div", { class: "blist" }, items.map(i => h("div", { class: "brow", title: i.label + ": " + fmtNum(i.v) },
      h("div", { class: "brow__top" }, h("span", { class: "brow__l" }, i.label, i.hint ? h("code", null, i.hint) : null), h("span", { class: "brow__v" }, fmt ? fmt(i.v) : fmtNum(i.v))),
      h("div", { class: "brow__track" }, h("i", { style: "width:" + Math.max(2, i.v / max * 100).toFixed(1) + "%" })))));
  }
  function splitBar(items) {
    const total = items.reduce((s, i) => s + i.v, 0);
    if (!total) return h("p", { class: "muted small" }, t("noData"));
    const top = items.slice(0, 3);
    return h("div", { class: "split" },
      h("div", { class: "split__bar", role: "img", "aria-label": top.map(i => i.label + " " + Math.round(i.v / total * 100) + "%").join(", ") },
        top.map((i, n) => h("i", { style: "flex:" + i.v + ";background:" + VIZ[n], title: i.label + ": " + Math.round(i.v / total * 100) + "%" }))),
      h("ul", { class: "legend" }, top.map((i, n) => h("li", null, h("span", { class: "legend__sw", style: "background:" + VIZ[n] }), h("span", { class: "legend__l" }, i.label),
        h("b", null, Math.round(i.v / total * 100) + "%"), h("span", { class: "muted small" }, fmtNum(i.v))))));
  }
  function deltaEl(cur, prev, goodUp = true, unit) {
    let d, txt, unitTxt = "";
    if (unit === "pp") {
      if (!prev && !cur) return null;
      d = cur - prev;
      txt = (d > 0 ? "+" : "") + d.toFixed(1);
      unitTxt = S.ui === "ar" ? "نقطة" : "pts";
    } else {
      if (!prev) return cur ? h("span", { class: "kpi__delta is-flat" }, t("newPeriod")) : null;
      d = (cur - prev) / prev * 100;
      txt = (d > 0 ? "+" : "") + d.toFixed(0) + "%";
    }
    const dir = Math.abs(d) < (unit === "pp" ? 0.05 : 0.5) ? "flat" : d > 0 ? "up" : "down";
    if (dir === "flat") txt = unit === "pp" ? "0" : "0%";
    const good = dir === "flat" ? "is-flat" : (dir === "up") === goodUp ? "is-good" : "is-bad";
    return h("span", { class: "kpi__delta " + good, title: t("vsPrev") }, dir === "flat" ? "" : icon(dir === "up" ? "up" : "down"),
      h("bdi", { dir: "ltr" }, txt), unitTxt ? h("span", null, unitTxt) : null, h("span", { class: "kpi__vs" }, t("vsPrev")));
  }

  /* ---------- OVERVIEW TAB ---------- */
  function rangeRow(onRefresh) {
    const live = DATA.stats && DATA.stats.live != null ? h("span", { class: "live" }, h("i"), t("liveNow", { n: fmtNum(DATA.stats.live) })) : null;
    return h("div", { class: "filters" },
      h("div", { class: "seg" }, [7, 30, 90].map(n => h("button", { type: "button", class: DATA.range === n ? "is-on" : "", onclick: () => { if (DATA.range === n) return; DATA.range = n; DATA.stats = null; renderTab(true); } }, t("lastDays", { n })))),
      btn(t("refreshData"), "refresh", onRefresh, "sm ghost"), live);
  }
  function renderOverview() {
    const P = $("#panel");
    P.append(tabHead("tabOverview", "overviewIntro"));
    if (!dataGate(P)) return;
    P.append(rangeRow(() => { DATA.stats = null; resetData(); renderTab(true); }));
    if (DATA.errStats) { P.append(errBox(DATA.errStats, () => { DATA.errStats = ""; refreshData(); })); return; }
    const s = DATA.stats;
    if (!s) { P.append(loadBox()); if (!DATA.loadingStats) refreshData(); return; }
    const conv = s.visitors ? s.leads / s.visitors * 100 : 0, pconv = s.prev_visitors ? s.prev_leads / s.prev_visitors * 100 : 0;
    const bounce = s.sessions ? s.bounces / s.sessions * 100 : 0, pbounce = s.prev_sessions ? s.prev_bounces / s.prev_sessions * 100 : 0;
    const ppv = s.sessions ? s.pageviews / s.sessions : 0;
    const tile = (id, label, value, delta, chartable) => h(chartable ? "button" : "div", {
      type: chartable ? "button" : null, class: "kpi" + (chartable ? " kpi--btn" : "") + (DATA.metric === id ? " is-on" : ""), "aria-pressed": chartable ? String(DATA.metric === id) : null,
      onclick: chartable ? () => { DATA.metric = id; renderTab(true); } : null
    }, h("span", { class: "kpi__label" }, label), h("span", { class: "kpi__value" }, value), delta || h("span", { class: "kpi__delta is-flat" }, " "));
    P.append(h("div", { class: "kpis" },
      tile("visitors", t("kVisitors"), fmtNum(s.visitors), deltaEl(s.visitors, s.prev_visitors), true),
      tile("views", t("kViews"), fmtNum(s.pageviews), deltaEl(s.pageviews, s.prev_pageviews), true),
      tile("leads", t("kLeads"), fmtNum(s.leads), deltaEl(s.leads, s.prev_leads), true),
      tile("conv", t("kConv"), conv.toFixed(1) + "%", deltaEl(conv, pconv, true, "pp")),
      tile("bounce", t("kBounce"), bounce.toFixed(0) + "%", deltaEl(bounce, pbounce, false, "pp")),
      tile("ppv", t("kPPV"), ppv.toFixed(1), null)));
    const mLabel = { visitors: t("kVisitors"), views: t("kViews"), leads: t("kLeads") }[DATA.metric] || t("kVisitors");
    const key = DATA.metric === "views" ? "views" : DATA.metric === "leads" ? "leads" : "visitors";
    const daily = s.daily || [];
    const table = h("table", { class: "dtable", hidden: !DATA.table },
      h("thead", null, h("tr", null, h("th", null, t("colDay")), h("th", null, t("kVisitors")), h("th", null, t("kViews")), h("th", null, t("kLeads")))),
      h("tbody", null, daily.slice().reverse().map(r => h("tr", null, h("td", null, fmtDay(r.day)), h("td", null, fmtNum(r.visitors)), h("td", null, fmtNum(r.views)), h("td", null, fmtNum(r.leads))))));
    const tbtn = btn(DATA.table ? t("hideTable") : t("showTable"), "sliders", () => { DATA.table = !DATA.table; table.hidden = !DATA.table; tbtn.querySelector("span:last-child").textContent = DATA.table ? t("hideTable") : t("showTable"); }, "sm ghost");
    P.append(h("section", { class: "card chartcard" },
      h("div", { class: "chartcard__head" }, h("h3", { class: "card__title card__title--plain" }, icon("overview"), h("span", null, t("chartOf", { m: mLabel }))), tbtn),
      daily.length ? lineChart(daily, key, t("chartOf", { m: mLabel })) : h("p", { class: "muted small pad" }, t("noData")), table));
    const pages = (s.pages || []).map(r => ({ label: pageName(r.k), hint: r.k, v: +r.views || 0 }));
    const recent = (DATA.leads || []).slice(0, 5);
    const since = Date.now() - DATA.range * 864e5;
    const byService = merge((DATA.leads || []).filter(l => new Date(l.created_at).getTime() >= since).map(l => ({ k: l.service || "", visitors: 1 })), k => k || t("other"));
    P.append(h("div", { class: "ov-grid" },
      card("pages", t("topPages"), [h("p", { class: "muted small" }, t("kViews")), barList(pages)]),
      card("global", t("sources"), [h("p", { class: "muted small" }, t("kVisitors")), barList(merge(s.sources, srcName).slice(0, 8))]),
      card("desktop", t("devices"), splitBar(merge(s.devices, deviceName))),
      card("lang", t("languages"), splitBar(merge(s.langs, langName))),
      card("global", t("regions"), [barList(merge(s.zones, zoneName).slice(0, 8)), h("p", { class: "muted small" }, t("regionsNote"))]),
      card("users", t("leadsByService"), barList(byService.slice(0, 8), null, t("leadsEmpty"))),
      h("section", { class: "card ov-wide" },
        h("div", { class: "chartcard__head" }, h("h3", { class: "card__title card__title--plain" }, icon("users"), h("span", null, t("latestLeads"))), btn(t("viewAll"), "external", () => setTab("leads"), "sm ghost")),
        h("div", { class: "card__body" }, recent.length ? h("div", { class: "mini-leads" }, recent.map(l => h("button", {
          type: "button", class: "mini-lead", onclick: () => { S.open.add("lead|" + l.id); setTab("leads"); }
        }, h("span", { class: "lead__av" }, initials(l.name)), h("span", { class: "mini-lead__who" }, h("b", null, l.name), h("span", null, l.service || l.company || l.email || "")),
          h("span", { class: "lead__time" }, timeAgo(l.created_at)), statusPill(l.status)))) : h("p", { class: "muted small" }, DATA.loadingLeads ? t("loadingData") : t("leadsEmpty"))))));
  }

  /* ---------- LEADS TAB ---------- */
  async function updateLead(l, patch, msgKey) {
    const before = Object.assign({}, l);
    Object.assign(l, patch);
    if (DATA.demo) { toast(t(msgKey), "ok"); return true; }
    try {
      await SB.req("/rest/v1/bv_leads?id=eq." + encodeURIComponent(l.id), { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(Object.assign({ updated_at: new Date().toISOString() }, patch)) });
      toast(t(msgKey), "ok");
      return true;
    } catch (e) { Object.assign(l, before); toast(sbErrorText(e), "err"); return false; }
  }
  async function deleteLead(l) {
    if (!(await confirmBox(t("deleteLeadQ", { n: l.name }), true))) return;
    if (!DATA.demo) {
      try { await SB.req("/rest/v1/bv_leads?id=eq." + encodeURIComponent(l.id), { method: "DELETE", headers: { Prefer: "return=minimal" } }); }
      catch (e) { toast(sbErrorText(e), "err"); return; }
    }
    DATA.leads = DATA.leads.filter(x => x !== l);
    toast(t("leadDeleted"));
    renderTab(true); renderRail();
  }
  function exportCsv(rows) {
    const cols = ["created_at", "name", "company", "email", "phone", "service", "budget", "message", "status", "notes", "form", "page", "lang", "referrer", "utm_source", "utm_medium", "utm_campaign"];
    const esc = v => { let s = v == null ? "" : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
    const csv = "﻿" + cols.join(",") + "\r\n" + rows.map(r => cols.map(c => esc(r[c])).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = h("a", { href: url, download: "brand-vitals-leads-" + isoDay(new Date()) + ".csv" });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
  function leadMatches(l) {
    if (DATA.filter !== "all" && l.status !== DATA.filter) return false;
    if (DATA.service && (l.service || "") !== DATA.service) return false;
    const q = DATA.q.trim().toLowerCase();
    if (!q) return true;
    return [l.name, l.email, l.phone, l.company, l.message, l.service, l.notes].some(v => String(v || "").toLowerCase().includes(q));
  }
  function applyLeadFilter() {
    const P = $("#panel");
    let n = 0;
    P.querySelectorAll(".lead").forEach(el => { const ok = leadMatches(el._lead); el.hidden = !ok; if (ok) n++; });
    const none = P.querySelector(".leads__none");
    if (none) none.hidden = n > 0;
    P.querySelectorAll(".chipf").forEach(c => c.classList.toggle("is-on", c.dataset.st === DATA.filter));
  }
  function leadRow(l) {
    const key = "lead|" + l.id;
    const det = h("details", { class: "lead lead--" + l.status });
    det._lead = l;
    det.open = S.open.has(key);
    det.addEventListener("toggle", () => { if (det.open) S.open.add(key); else S.open.delete(key); });
    const stop = e => e.stopPropagation();
    const wa = waDigits(l.phone);
    const acts = h("span", { class: "lead__acts" },
      wa ? h("a", { class: "cb cb--wa", href: "https://wa.me/" + wa, target: "_blank", rel: "noopener", title: t("waBtn"), "aria-label": t("waBtn"), onclick: stop }, icon("chat")) : null,
      l.phone ? h("a", { class: "cb", href: "tel:" + String(l.phone).replace(/[^\d+]/g, ""), title: t("callBtn"), "aria-label": t("callBtn"), onclick: stop }, icon("phone")) : null,
      l.email ? h("a", { class: "cb", href: "mailto:" + l.email, title: t("mailBtn"), "aria-label": t("mailBtn"), onclick: stop }, icon("mail")) : null);
    det.append(h("summary", { class: "lead__head" },
      h("span", { class: "lead__av" }, initials(l.name)),
      h("span", { class: "lead__who" }, h("b", null, l.name), h("span", { class: "lead__sub" }, [l.company, l.email || l.phone].filter(Boolean).join(" · "))),
      l.service ? h("span", { class: "chip" }, l.service) : null,
      h("span", { class: "lead__time", title: fmtDate(l.created_at) }, timeAgo(l.created_at)),
      statusPill(l.status), acts));
    const src = l.utm_source ? srcName(l.utm_source) + (l.utm_campaign ? " · " + l.utm_campaign : "") : srcName(l.referrer);
    const item = (label, val, ltr) => val ? h("div", { class: "kv" }, h("span", { class: "kv__k" }, label), h("span", { class: "kv__v", dir: ltr ? "ltr" : "auto" }, val)) : null;
    const sel = h("select", { class: "inp sel", "aria-label": t("fStatus") });
    for (const st of STATUSES) sel.append(h("option", { value: st }, t("st_" + st)));
    sel.value = l.status;
    sel.addEventListener("change", async () => { if (await updateLead(l, { status: sel.value }, "statusSaved")) { renderTab(true); renderRail(); } else sel.value = l.status; });
    const notes = h("textarea", { class: "inp", rows: "3", dir: "auto", placeholder: t("notesPh") });
    notes.value = l.notes || "";
    notes.addEventListener("change", () => { if ((l.notes || "") !== notes.value) updateLead(l, { notes: notes.value || null }, "notesSaved"); });
    det.append(h("div", { class: "lead__body" },
      h("div", { class: "kvs" },
        item(t("lEmail"), l.email, true), item(t("lPhone"), l.phone, true), item(t("lCompany"), l.company), item(t("lService"), l.service),
        item(t("lBudget"), l.budget), item(t("lSource"), src), item(t("lPage"), pageName(l.page || "") + " · " + t(({ consult: "formConsult", lead: "formLead", careers: "formCareers", studio: "formStudio", web: "formWeb", live: "formLive", hq: "formHq", crew: "formCrew" })[l.form] || "formContact")),
        item(t("lLang"), langName(l.lang)), item(t("lDate"), fmtDate(l.created_at))),
      l.message ? h("div", { class: "lead__msg" }, h("span", { class: "kv__k" }, t("lMessage")), h("p", { dir: "auto" }, l.message)) : null,
      h("div", { class: "lead__edit" },
        h("label", { class: "fld" }, h("span", { class: "fld__label" }, t("fStatus")), sel),
        h("label", { class: "fld" }, h("span", { class: "fld__label" }, t("fNotes")), notes)),
      h("div", { class: "row row--end" },
        wa ? h("a", { class: "btn btn--sm", href: "https://wa.me/" + wa, target: "_blank", rel: "noopener" }, icon("chat"), h("span", null, t("waBtn"))) : null,
        l.email ? h("a", { class: "btn btn--sm", href: "mailto:" + l.email }, icon("mail"), h("span", null, t("mailBtn"))) : null,
        btn(t("deleteLead"), "trash", () => deleteLead(l), "sm danger"))));
    return det;
  }
  function renderLeads() {
    const P = $("#panel");
    P.append(tabHead("tabLeads", "leadsIntro"));
    if (!dataGate(P)) return;
    if (DATA.errLeads) { P.append(errBox(DATA.errLeads, () => { DATA.errLeads = ""; refreshData("leads"); })); return; }
    const all = DATA.leads;
    if (!all) { P.append(loadBox()); if (!DATA.loadingLeads) refreshData("leads"); return; }
    const count = st => all.filter(l => st === "all" || l.status === st).length;
    const search = h("input", { class: "inp search__inp", type: "search", placeholder: t("leadsSearch"), "aria-label": t("leadsSearch") });
    search.value = DATA.q;
    search.addEventListener("input", () => { DATA.q = search.value; applyLeadFilter(); });
    const services = [...new Set(all.map(l => l.service).filter(Boolean))].sort();
    const svc = h("select", { class: "inp sel svc-sel", "aria-label": t("allServices") }, h("option", { value: "" }, t("allServices")), services.map(s => h("option", { value: s }, s)));
    svc.value = DATA.service;
    svc.addEventListener("change", () => { DATA.service = svc.value; applyLeadFilter(); });
    P.append(h("div", { class: "filters filters--leads" },
      h("label", { class: "search" }, icon("search"), search), svc,
      btn(t("exportCsv"), "download", () => exportCsv(all.filter(leadMatches)), "sm"),
      btn(t("refreshData"), "refresh", () => { DATA.leads = null; renderTab(true); }, "sm ghost")));
    P.append(h("div", { class: "chipfs", role: "group", "aria-label": t("fStatus") }, ["all", ...STATUSES].map(st => h("button", {
      type: "button", class: "chipf" + (DATA.filter === st ? " is-on" : ""), "data-st": st, onclick: () => { DATA.filter = st; applyLeadFilter(); }
    }, st === "all" ? null : h("i", { class: "st-dot st-dot--" + st }), h("span", null, st === "all" ? t("all") : t("st_" + st)), h("b", null, String(count(st)))))));
    if (!all.length) { P.append(h("div", { class: "empty-state" }, icon("users"), h("p", null, t("leadsEmpty")))); return; }
    P.append(h("div", { class: "leads" }, all.map(leadRow), h("p", { class: "muted leads__none", hidden: true }, t("leadsNoMatch"))));
    applyLeadFilter();
  }

  /* ---------- SETTINGS: database card ---------- */
  function backendCard() {
    const c = backendCfg();
    const url = h("input", { class: "inp inp--mono", dir: "ltr", placeholder: "https://xxxx.supabase.co" }); url.value = c.url;
    const key = h("input", { class: "inp inp--mono", dir: "ltr", placeholder: "sb_publishable_… / eyJ…", spellcheck: "false", autocomplete: "off" }); key.value = c.key;
    const email = h("input", { class: "inp", type: "email", dir: "ltr", placeholder: "you@brandvitals.io" });
    email.value = store.get(LS.sbEmail) || (SB.session() || {}).email || "";
    const status = h("div", { class: "conn" });
    const setStatus = (kind, msg) => { status.className = "conn conn--" + kind; status.replaceChildren(icon(kind === "ok" ? "check" : kind === "err" ? "warn" : "database"), h("span", null, msg)); };
    const sess = SB.session();
    if (!SB.ready()) setStatus("idle", t("sbStatusNone"));
    else if (!sess) setStatus("idle", t("sbStatusNoLogin"));
    else setStatus("ok", t("signedAs", { e: sess.email }));
    const save = () => {
      const u = url.value.trim().replace(/\/+$/, ""), k = key.value.trim();
      if (!u && !k) {
        store.del(LS.sbCfg); SB.signOut(); writeSiteBackend("", ""); resetData();
        toast(t("sbDisconnected")); renderTab(true); return;
      }
      if (!/^https:\/\/[^\s/]+/.test(u)) { toast(t("sbBadUrl"), "err"); return; }
      if (!k) { toast(t("sbNeedKey"), "err"); return; }
      if (isSecretKey(k)) { toast(t("sbSecretKey"), { kind: "err", ms: 8000 }); return; }
      store.set(LS.sbCfg, JSON.stringify({ url: u, key: k }));
      const wrote = writeSiteBackend(u, k);
      DATA.demo = false; resetData();
      toast(wrote ? t("sbSavedPublish") : t("saved"), { kind: "ok", ms: 7000 });
      renderTab(true);
    };
    const sqlBox = h("textarea", { class: "inp inp--mono code code--sql", readonly: true, dir: "ltr", spellcheck: "false", wrap: "off" });
    const sqlDet = h("details", { class: "sqldet" }, h("summary", null, t("sbShowSql")), sqlBox);
    sqlDet.addEventListener("toggle", () => { if (sqlDet.open) sqlBox.value = buildSql(email.value || "you@example.com"); });
    const copySql = async () => {
      const em = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { toast(t("sbNeedEmail"), "err"); email.focus(); return; }
      store.set(LS.sbEmail, em);
      const sql = buildSql(em);
      sqlBox.value = sql;
      try { await navigator.clipboard.writeText(sql); toast(t("sbSqlCopied"), { kind: "ok", ms: 7000 }); }
      catch (e) { sqlDet.open = true; sqlBox.select(); toast(t("sbSqlSelect"), "warn"); }
    };
    const test = async () => {
      setStatus("idle", t("testing"));
      try {
        const ok = await SB.req("/rest/v1/rpc/bv_is_admin", { method: "POST", body: "{}" });
        if (ok === true) setStatus("ok", t("sbOk")); else setStatus("err", t("sbNotAdmin"));
      } catch (e) { setStatus("err", sbErrorText(e)); }
    };
    const noTrack = h("input", { type: "checkbox", onchange: e => store.set(LS.noTrack, e.target.checked ? "1" : "0") });
    noTrack.checked = store.get(LS.noTrack) === "1";
    const steps = t("sbSteps").split("|");
    const authBlock = !SB.ready() ? null : sess
      ? h("div", { class: "row" }, btn(t("test"), "refresh", test, "sm"), btn(t("signOut"), "lock", () => { SB.signOut(); resetData(); renderTab(true); }, "sm ghost"))
      : h("div", { class: "subcard" }, h("span", { class: "subhead" }, t("sbLoginTitle")), signInForm(() => renderTab(true)));
    const det = h("details", { class: "card card--det", id: "sb-card" });
    det.open = S.open.has("sb-card") || !SB.ready();
    det.addEventListener("toggle", () => { if (det.open) S.open.add("sb-card"); else S.open.delete("sb-card"); });
    det.append(h("summary", { class: "card__title" }, icon("database"), h("span", null, t("sbTitle")), h("span", { class: "card__chev" }, icon("chev"))),
      h("div", { class: "card__body" },
        status,
        h("ol", { class: "steps" }, steps.map(s => h("li", null, s))),
        h("div", { class: "row" }, h("a", { class: "btn btn--sm", href: "https://supabase.com/dashboard", target: "_blank", rel: "noopener" }, icon("external"), h("span", null, t("sbOpen")))),
        h("label", { class: "fld" }, h("span", { class: "fld__label" }, t("sbUrl")), url),
        h("label", { class: "fld" }, h("span", { class: "fld__label" }, t("sbKey")), key),
        h("p", { class: "note" }, icon("key"), h("span", null, t("sbKeyNote"))),
        h("div", { class: "row" }, btn(t("sbSave"), "check", save, "sm primary")),
        h("div", { class: "divider" }, "SQL"),
        h("label", { class: "fld" }, h("span", { class: "fld__label" }, t("sbAdmin")), email),
        h("div", { class: "row" }, btn(t("sbCopySql"), "copy", copySql, "sm")),
        sqlDet,
        authBlock ? h("div", { class: "divider" }, t("signIn")) : null,
        authBlock,
        h("label", { class: "chk" }, noTrack, h("span", null, t("noTrack")))));
    return det;
  }

  /* ======================================================================
     SHELL
     ====================================================================== */
  const TABS = [["overview", "overview", "tabOverview"], ["leads", "users", "tabLeads"], ["pages", "pages", "tabPages"], ["design", "design", "tabDesign"], ["global", "global", "tabGlobal"], ["images", "images", "tabImages"], ["files", "files", "tabFiles"], ["settings", "settings", "tabSettings"]];
  const brandTabs = () => BRAND === "bv" ? TABS : TABS.filter(x => x[0] !== "design");
  function renderShell() {
    const app = $("#app");
    app.replaceChildren();
    const top = h("header", { class: "top" },
      h("div", { class: "top__brand" }, h("img", { src: B.logo, alt: B.name, class: "top__logo" }), h("span", { class: "top__sep" }), h("span", { class: "top__title" }, t("dashboard"))),
      h("div", { class: "top__status", id: "topStatus" }),
      h("div", { class: "top__actions" },
        h("button", { type: "button", class: "cb cb--lg", id: "undoBtn", title: t("undo") + " (Ctrl+Z)", "aria-label": t("undo"), onclick: undo }, icon("undo")),
        h("button", { type: "button", class: "btn btn--sm btn--ghost pv-toggle", onclick: togglePreview }, icon("eye"), h("span", null, t("preview"))),
        h("a", { class: "cb cb--lg", href: siteBase(), target: "_blank", rel: "noopener", title: t("viewSite"), "aria-label": t("viewSite") }, icon("external")),
        h("button", { type: "button", class: "btn btn--sm btn--ghost", onclick: () => setUiLang(S.ui === "ar" ? "en" : "ar") }, icon("lang"), h("span", null, t("uiLang"))),
        h("button", { type: "button", class: "cb cb--lg", title: t("lock"), "aria-label": t("lock"), onclick: lockApp }, icon("lock")),
        h("button", { type: "button", class: "btn btn--primary btn--pub", id: "pubBtn", onclick: openPublish }, icon("publish"), h("span", null, t("publish")), h("span", { class: "pub-count", id: "pubCount", hidden: true }, "0"))));
    const rail = h("nav", { class: "rail", id: "rail", "aria-label": t("dashboard") });
    const panel = h("section", { class: "panel" }, h("div", { class: "panel__inner", id: "panel" }));
    const stage = h("section", { class: "stage" },
      h("div", { class: "pv-bar", id: "pvBar" }),
      h("div", { class: "pv-view", id: "pvView" },
        h("div", { class: "pv-wrap", id: "pvWrap" }, h("div", { class: "pv-frame", id: "pvFrame" },
          h("iframe", { title: t("preview"), class: "is-front" }), h("iframe", { title: t("preview") }))),
        h("div", { class: "pv-loading" }, h("span", { class: "spin" }))));
    app.append(top, rail, panel, stage, h("datalist", { id: "cms-links" }, S.pages.map(p => h("option", { value: p.path })), ["mailto:", "tel:+", "https://wa.me/", "#"].map(v => h("option", { value: v }))));
    PV.frames = [...stage.querySelectorAll("iframe")];
    PV.front = 0;
    renderRail(); renderPvBar(); renderStatus();
    panel.addEventListener("focusin", e => {
      const f = e.target.closest && e.target.closest(".fld[data-k]");
      if (!f || S.fromPreview || S.lastHl === f.dataset.k) return;
      S.lastHl = f.dataset.k;
      highlightInPreview(f.dataset.k);
    });
    if (window.ResizeObserver) new ResizeObserver(layoutPreview).observe($("#pvView"));
    layoutPreview();
  }
  function renderRail() {
    const rail = $("#rail");
    if (!rail) return;
    const fresh = (DATA.leads || []).filter(l => l.status === "new").length;
    rail.replaceChildren(...brandTabs().map(([id, ic, lab]) => h("button", { type: "button", class: "rail__btn" + (S.tab === id ? " is-active" : ""), "aria-current": S.tab === id ? "page" : null, onclick: () => setTab(id) },
      icon(ic), h("span", null, t(lab)), id === "leads" && fresh ? h("b", { class: "rail__badge", "aria-label": fresh + " " + t("st_new") }, fresh > 99 ? "99+" : String(fresh)) : null)));
  }
  function renderPvBar() {
    const bar = $("#pvBar");
    if (!bar) return;
    const segBtn = (on, ic, title, fn, label) => h("button", { type: "button", class: on ? "is-on" : "", title, "aria-label": title, "aria-pressed": on ? "true" : "false", onclick: fn }, icon(ic), label ? h("span", null, label) : null);
    const setDev = d => { S.preview.device = d; savePreviewPrefs(); renderPvBar(); layoutPreview(); };
    bar.replaceChildren(
      h("div", { class: "seg" },
        segBtn(S.preview.select, "cursor", t("selectMode"), () => setSelect(true), t("selectMode")),
        segBtn(!S.preview.select, "hand", t("browseMode"), () => setSelect(false))),
      h("div", { class: "seg" },
        segBtn(S.preview.device === "desktop", "desktop", t("desktop"), () => setDev("desktop")),
        segBtn(S.preview.device === "tablet", "tablet", t("tablet"), () => setDev("tablet")),
        segBtn(S.preview.device === "mobile", "mobile", t("mobile"), () => setDev("mobile"))),
      h("div", { class: "seg" },
        h("button", { type: "button", class: S.preview.lang === "en" ? "is-on" : "", onclick: () => setPvLang("en") }, "EN"),
        h("button", { type: "button", class: S.preview.lang === "ar" ? "is-on" : "", onclick: () => setPvLang("ar") }, "ع")),
      h("div", { class: "seg" },
        segBtn(S.preview.theme === "dark", "moon", "Dark", () => setPreviewTheme("dark")),
        segBtn(S.preview.theme === "light", "sun", "Light", () => setPreviewTheme("light"))),
      h("span", { class: "pv-zoom", id: "pvZoom" }),
      h("button", { type: "button", class: "cb", title: t("refresh"), "aria-label": t("refresh"), onclick: () => renderPreview() }, icon("refresh")),
      h("button", { type: "button", class: "cb pv-close", title: t("close"), "aria-label": t("close"), onclick: togglePreview }, icon("close")));
    layoutPreview();
  }
  function setSelect(on) {
    S.preview.select = on; savePreviewPrefs(); renderPvBar();
    const f = frontFrame();
    try { f.contentWindow.postMessage({ cmsSel: on }, "*"); } catch (e) { /* ignore */ }
    if (on) toast(t("previewHint"));
  }
  function setPvLang(l) { if (S.preview.lang === l) return; S.preview.lang = l; savePreviewPrefs(); renderPvBar(); renderPreview(); }
  function togglePreview() {
    const app = $("#app");
    app.classList.toggle("show-preview");
    if (app.classList.contains("show-preview")) {
      if (window.innerWidth < 760 && S.preview.device === "desktop") { S.preview.device = "mobile"; renderPvBar(); }
      layoutPreview();
      if (PV.stale) renderPreview();
    }
  }
  function renderStatus() {
    const st = $("#topStatus");
    if (!st) return;
    const n = (S.dirty || []).length;
    st.replaceChildren(
      h("span", { class: "pill " + (S.source === "github" ? "pill--ok" : "pill--warn"), title: S.ghError || "" }, h("i"), S.source === "github" ? t("srcGithub") : t("srcSite")),
      h("span", { class: "top__dirty" + (n ? " is-dirty" : "") }, n ? t("changes", { n }) : t("allSaved")));
  }
  function refreshUndo() { const b = $("#undoBtn"); if (b) b.disabled = !S.undo.length; }
  function refreshDirty() {
    const list = dirtyList();
    S.dirty = list;
    const c = $("#pubCount");
    if (c) { c.textContent = String(list.length); c.hidden = !list.length; }
    renderStatus(); refreshUndo();
    return list;
  }
  const changed = (() => { let tm; return () => { clearTimeout(tm); tm = setTimeout(() => { const l = refreshDirty(); saveDraft(l); }, 300); }; })();

  function renderTab(keep) {
    if (BRAND !== "bv" && S.tab === "design") S.tab = "overview";
    const P = $("#panel");
    if (!P) return;
    const sc = P.parentElement.scrollTop;
    P.replaceChildren();
    P.classList.remove("is-searching");
    S.fieldByKey.clear();
    const wide = S.tab === "overview" || S.tab === "leads";
    $("#app").classList.toggle("is-wide", wide);
    if (!S.loaded) return;
    ({ overview: renderOverview, leads: renderLeads, pages: renderPages, design: renderDesign, global: renderGlobal, images: renderImages, files: renderFiles, settings: renderSettings })[S.tab]();
    P.parentElement.scrollTop = keep ? sc : 0;
    renderRail();
    if (!wide && PV.stale && previewVisible()) schedulePreview(0);
  }
  function setTab(tab) {
    if (S.tab === tab) return;
    const before = previewPage() + consultMode();
    S.tab = tab;
    renderTab();
    if (previewPage() + consultMode() !== before) { PV.scroll = 0; schedulePreview(0); }
  }
  function showLoading(on, err) {
    const P = $("#panel");
    if (!P) return;
    P.replaceChildren();
    if (on) P.append(h("div", { class: "loadbox" }, h("span", { class: "spin" }), h("span", null, t("loading"))));
    if (err) P.append(h("div", { class: "errbox" }, icon("warn"), h("span", null, t("errLoad") + " " + err)), btn(t("retry"), "refresh", enterApp, "sm"));
  }
  async function reloadAll(silent) {
    if (!silent && dirtyList().length && !(await confirmBox(t("reloadConfirm"), true))) return;
    showLoading(true);
    try { await loadAll(); } catch (e) { showLoading(false, ghErrorText(e)); return; }
    renderShell(); renderTab(); refreshDirty(); schedulePreview(0);
  }

  /* ======================================================================
     LOGIN
     ====================================================================== */
  async function sha256(s) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  const isAuthed = () => store.sget(LS.session) === S.codeHash || store.get(LS.remember) === S.codeHash;
  function renderLogin() {
    const L = $("#login");
    $("#app").hidden = true;
    L.hidden = false;
    const inp = h("input", { class: "code-inp", id: "codeInp", type: "password", autocomplete: "current-password", "aria-label": t("code"), placeholder: "••••", dir: "ltr" });
    const rem = h("input", { type: "checkbox" });
    const err = h("p", { class: "login__err", role: "alert" });
    const submit = h("button", { type: "submit", class: "btn btn--primary btn--block" }, h("span", null, t("enter")), icon("check"));
    const form = h("form", { class: "login__form", onsubmit: async e => {
      e.preventDefault();
      if (Date.now() < S.lockUntil) { err.textContent = t("cooldown"); return; }
      const hash = await sha256(SALT + inp.value.trim());
      if (hash === S.codeHash) {
        store.sset(LS.session, hash);
        if (rem.checked) store.set(LS.remember, hash);
        S.fails = 0;
        L.classList.add("is-ok");
        setTimeout(enterApp, 280);
      } else {
        S.fails++;
        if (S.fails >= 5) { S.lockUntil = Date.now() + 15000; S.fails = 0; }
        err.textContent = t("wrongCode");
        L.classList.remove("is-error"); void L.offsetWidth; L.classList.add("is-error");
        inp.select();
      }
    } }, inp, h("label", { class: "chk" }, rem, h("span", null, t("remember"))), submit, err);
    L.replaceChildren(
      h("div", { class: "login__grid", "aria-hidden": "true" }),
      h("div", { class: "login__ecg", "aria-hidden": "true", html: '<svg viewBox="0 0 1200 120" preserveAspectRatio="none"><defs><linearGradient id="lgE" x1="0" x2="1"><stop offset="0" stop-color="#00CFFF"/><stop offset="1" stop-color="#00E0C6"/></linearGradient></defs><path pathLength="1000" d="M0 70 H380 L396 62 L412 70 H452 L470 18 L492 112 L510 44 L524 70 H580 L598 58 L618 70 H760 L776 62 L792 70 H832 L850 18 L872 112 L890 44 L904 70 H960 L978 58 L998 70 H1200"/></svg>' }),
      h("div", { class: "login__card" },
        h("div", { class: "login__top" }, h("img", { class: "login__logo", src: B.logo, alt: B.name }),
          h("button", { type: "button", class: "btn btn--sm btn--ghost", onclick: () => setUiLang(S.ui === "ar" ? "en" : "ar") }, icon("lang"), h("span", null, t("uiLang")))),
        h("span", { class: "login__kicker" }, "DASHBOARD"),
        h("h1", null, t("dashboard")),
        h("p", { class: "muted" }, t("loginSub")),
        form,
        h("p", { class: "login__foot" }, icon("lock"), h("span", null, t("loginNote")))));
    setTimeout(() => inp.focus(), 60);
  }
  function lockApp() {
    store.sdel(LS.session);
    store.sdel(LS.token);
    store.del(LS.remember);
    saveDraft();
    S.loaded = false;
    $("#app").replaceChildren();
    renderLogin();
  }
  async function enterApp() {
    const L = $("#login");
    L.hidden = true; L.classList.remove("is-ok", "is-error");
    const app = $("#app");
    app.hidden = false;
    renderShell();
    showLoading(true);
    try { await loadAll(); } catch (e) { showLoading(false, ghErrorText(e)); return; }
    if (store.get(LS.noTrack) == null) store.set(LS.noTrack, "1");
    renderShell();
    renderTab(); refreshDirty(); schedulePreview(0);
    checkDraft();
    if (SB.ready() && SB.session() && S.tab !== "leads" && S.tab !== "overview") loadLeads();
    if (S.ghError) toast(t("ghFallback") + " " + S.ghError, { kind: "warn", ms: 9000 });
  }
  function applyUiLang() {
    document.documentElement.lang = S.ui;
    document.documentElement.dir = S.ui === "ar" ? "rtl" : "ltr";
    document.title = t("dashboard") + " | " + B.name;
  }
  function setUiLang(l) {
    S.ui = l;
    store.set(LS.lang, l);
    applyUiLang();
    if (!$("#login").hidden) { renderLogin(); return; }
    if (S.loaded) { renderShell(); renderTab(true); schedulePreview(0); }
  }

  /* ======================================================================
     GLOBAL EVENTS + BOOT
     ====================================================================== */
  window.addEventListener("message", e => {
    const d = e.data;
    if (!d || d.cms !== 1) return;
    if (!PV.frames.some(f => f.contentWindow === e.source)) return;
    if (e.source !== frontFrame().contentWindow && d.type !== "pref") return;
    if (d.type === "select") focusField(d.key);
    else if (d.type === "nav" && S.pages.some(p => p.path === d.page)) { S.tab = "pages"; gotoPage(d.page); }
    else if (d.type === "scroll") PV.scroll = d.y;
    else if (d.type === "pref") {
      if (d.k === "oso-theme") S.preview.theme = d.v;
      if (d.k === "oso-lang") S.preview.lang = d.v;
      savePreviewPrefs(); renderPvBar();
    }
  });
  const isTyping = el => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
  document.addEventListener("keydown", e => {
    if (!S.loaded || $("#app").hidden) return;
    const mod = e.ctrlKey || e.metaKey;
    const k = (e.key || "").toLowerCase();
    if (mod && k === "z" && !e.shiftKey && !isTyping(e.target)) { e.preventDefault(); undo(); }
    else if (mod && k === "s" && !(e.target.classList && e.target.classList.contains("code"))) { e.preventDefault(); saveDraft(); toast(t("draftSaved"), "ok"); }
  });
  window.addEventListener("beforeunload", e => {
    if (!S.loaded) return;
    saveDraft();
    if (dirtyList().length) { e.preventDefault(); e.returnValue = ""; }
  });
  window.addEventListener("resize", debounce(() => { if (PV.stale && previewVisible()) renderPreview(); layoutPreview(); }, 200));

  // Keep the numbers fresh while the dashboard is open.
  setInterval(() => {
    if (!S.loaded || DATA.demo || !SB.ready() || !SB.session() || document.visibilityState !== "visible") return;
    if (S.tab === "overview") refreshData("stats");
    else if (S.tab !== "leads") loadLeads();
  }, 60000);

  async function boot() {
    applyUiLang();
    const txt = await fetch(CONFIG_PATH + "?cms=" + Date.now(), { cache: "no-store" }).then(r => (r.ok ? r.text() : null)).catch(() => null);
    const c = safeJSON(txt);
    if (c && typeof c.codeHash === "string" && /^[0-9a-f]{64}$/.test(c.codeHash)) S.codeHash = c.codeHash;
    if (isAuthed()) enterApp(); else renderLogin();
  }
  boot();
})();
