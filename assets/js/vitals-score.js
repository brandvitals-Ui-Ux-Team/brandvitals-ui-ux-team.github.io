/* ==========================================================================
   VITALS SCORE · free website + marketing health check
   1. Google PageSpeed Insights (mobile Lighthouse): speed, SEO, a11y, best practices
   2. /api/inspect (our serverless function): Arabic readiness, SEO tags, tracking pixels
   3. Four questions about marketing habits
   → a score out of 100, five vital signs, and the three fixes that matter most.
   ========================================================================== */
(() => {
  "use strict";
  // Optional Google API key (restrict it to your domain in Google Cloud).
  // Without one, PageSpeed Insights still works on a shared, lower quota.
  /* @cms-psi-start */
  const PSI_KEY = "";
  /* @cms-psi-end */
  const WEIGHTS = { speed: 25, seo: 20, arabic: 15, experience: 15, marketing: 25 };

  const root = document.querySelector("[data-vs]");
  if (!root) return;
  const doc = document.documentElement;
  const ar = () => doc.lang === "ar";
  const L = (en, a) => (ar() ? a : en);
  const $ = s => root.querySelector(s);
  const form = $("[data-vs-form]"), scan = $("[data-vs-scan]"), out = $("[data-vs-result]"), msg = $("[data-vs-msg]");
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const normUrl = v => {
    v = v.trim();
    if (!v) return "";
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    try { const u = new URL(v); return /\./.test(u.hostname) ? u.toString() : ""; } catch (e) { return ""; }
  };

  function validate() {
    let ok = true;
    const urlField = $("#vs-url").closest(".field");
    const url = normUrl($("#vs-url").value);
    urlField.classList.toggle("is-error", !url);
    if (!url) ok = false;
    root.querySelectorAll(".vs-q").forEach(q => {
      const name = q.querySelector("input").name;
      const bad = !form.querySelector('input[name="' + name + '"]:checked');
      q.classList.toggle("is-error", bad);
      if (bad) ok = false;
    });
    return ok ? url : null;
  }

  async function psi(url) {
    // Prefer our server proxy (keeps the API key secret); fall back to calling Google directly.
    try {
      const r = await fetch("/api/psi?url=" + encodeURIComponent(url));
      if (r.ok) return r.json();
      if (r.status !== 404) throw new Error("PSI " + r.status);
    } catch (e) { if (!PSI_KEY) throw e; }
    const p = new URLSearchParams({ url, strategy: "mobile" });
    ["performance", "seo", "accessibility", "best-practices"].forEach(c => p.append("category", c));
    if (PSI_KEY) p.set("key", PSI_KEY);
    const r = await fetch("https://www.googleapis.com/pagespeedonline/v5/runPagespeed?" + p.toString());
    if (!r.ok) throw new Error("PSI " + r.status);
    return r.json();
  }
  async function inspect(url) {
    const r = await fetch("/api/inspect?url=" + encodeURIComponent(url));
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "inspect " + r.status);
    return j;
  }

  const pct = v => (v == null ? null : Math.round(v * 100));
  const answer = name => (form.querySelector('input[name="' + name + '"]:checked') || {}).value;
  const QSCORE = { yes: 100, some: 50, rough: 50, unsure: 30, no: 0 };

  function score(url, P, I) {
    const cats = P && P.lighthouseResult ? P.lighthouseResult.categories : null;
    const audits = P && P.lighthouseResult ? P.lighthouseResult.audits : {};
    const s = {};
    s.speed = cats ? pct(cats.performance.score) : null;

    // SEO: Lighthouse SEO, refined by on-page tags we can read directly.
    let tagSeo = null;
    if (I) {
      let t = 0;
      if (I.titleLength >= 10 && I.titleLength <= 65) t += 20; else if (I.titleLength) t += 10;
      if (I.description && I.description.length >= 50) t += 20; else if (I.description) t += 10;
      if (I.canonical) t += 15;
      if (I.h1Count === 1) t += 15; else if (I.h1Count > 1) t += 8;
      if (I.schemaCount) t += 15;
      if (I.ogTitle) t += 5;
      if (I.ogImage) t += 5;
      if (I.https) t += 5;
      tagSeo = t;
    }
    const lhSeo = cats ? pct(cats.seo.score) : null;
    s.seo = lhSeo != null && tagSeo != null ? Math.round(lhSeo * 0.6 + tagSeo * 0.4) : (lhSeo ?? tagSeo);

    // Arabic readiness: separate Arabic URLs linked with hreflang beat a language toggle.
    if (I) {
      let a = 0;
      const pageIsAr = I.lang.startsWith("ar");
      if (I.hasArabicAlternate || pageIsAr) a += 45;
      if (I.hasArabicAlternate && I.hreflang.some(h => h.lang.startsWith("en"))) a += 15;
      if (I.hasXDefault) a += 10;
      if (pageIsAr && I.dir === "rtl") a += 15; else if (!pageIsAr && I.lang) a += 10;
      if (I.arabicRatio > 0.05 || I.hasArabicAlternate) a += 15;
      s.arabic = Math.min(100, a);
    } else s.arabic = null;

    s.experience = cats ? Math.round((pct(cats.accessibility.score) + pct(cats["best-practices"].score)) / 2) : null;

    // Marketing maturity: 60% habits (answers), 40% what we detect on the page.
    const habits = ["ads", "tracking", "testing", "reporting"].map(n => QSCORE[answer(n)] ?? 0);
    let detected = 0;
    if (I) {
      const T = I.tracking;
      if (T.ga4 || T.gtm) detected += 40;
      if (T.metaPixel || T.tiktokPixel || T.snapPixel) detected += 35;
      if (T.googleAds || T.gtm) detected += 10;
      if (T.clarity || T.hotjar) detected += 15;
    }
    const habitAvg = habits.reduce((x, y) => x + y, 0) / habits.length;
    s.marketing = Math.round(I ? habitAvg * 0.6 + detected * 0.4 : habitAvg);

    // Weighted total over the signs we could measure.
    let sum = 0, w = 0;
    for (const k of Object.keys(WEIGHTS)) if (s[k] != null) { sum += s[k] * WEIGHTS[k]; w += WEIGHTS[k]; }
    const total = w ? Math.round(sum / w) : 0;
    return { s, total, fixes: fixes(s, I, audits) };
  }

  function fixes(s, I, A) {
    const list = [];
    const add = (impact, en, ar_, den, dar) => list.push({ impact, t: L(en, ar_), d: L(den, dar) });
    const lcp = A["largest-contentful-paint"] && A["largest-contentful-paint"].displayValue;
    if (s.speed != null && s.speed < 50) add(90 - s.speed, "Make the site load faster on mobile", "اجعل الموقع أسرع على الموبايل",
      "Mobile performance scored " + s.speed + "/100" + (lcp ? ", with the main content appearing after " + lcp : "") + ". Slow pages burn ad spend: compress images, defer scripts and use a CDN.",
      "حصل أداء الموبايل على " + s.speed + "/100" + (lcp ? "، ويظهر المحتوى الرئيسي بعد " + lcp : "") + ". الصفحات البطيئة تحرق الميزانية: اضغط الصور وأجّل السكربتات واستخدم CDN.");
    else if (s.speed != null && s.speed < 80) add(55 - s.speed / 2, "Tighten mobile speed", "حسّن سرعة الموبايل",
      "Speed is " + s.speed + "/100. Fixing the largest images and render-blocking scripts usually moves it above 80.",
      "السرعة " + s.speed + "/100. إصلاح أكبر الصور والسكربتات المعطّلة للعرض يرفعها غالبًا فوق 80.");
    if (I && !I.hasArabicAlternate && !I.lang.startsWith("ar")) add(I.langToggleOnly ? 80 : 70, "Give Arabic its own URLs", "امنح العربية روابط خاصة",
      I.langToggleOnly ? "Your site seems to switch language on the same URL, so Google only sees one language. Publish Arabic pages on /ar/ and link them with hreflang." : "We found no Arabic version linked with hreflang. Arabic searchers in Egypt and the GCC may not find you.",
      I.langToggleOnly ? "يبدو أن موقعك يبدّل اللغة على الرابط نفسه، فيرى جوجل لغة واحدة فقط. انشر الصفحات العربية على /ar/ واربطها بـ hreflang." : "لم نجد نسخة عربية مربوطة بـ hreflang. قد لا يجدك من يبحث بالعربي في مصر والخليج.");
    if (I && !(I.tracking.metaPixel || I.tracking.tiktokPixel || I.tracking.snapPixel)) add(answer("ads") === "no" ? 40 : 85, "Install ad tracking before spending more", "ركّب تتبع الإعلانات قبل زيادة الإنفاق",
      "We could not detect a Meta, TikTok or Snap pixel. Without it, ad platforms optimize blind. Add the pixel plus the server-side Conversions API.",
      "لم نرصد بيكسل ميتا أو تيك توك أو سناب. بدونه تحسّن المنصات الإعلانية بشكل أعمى. أضف البيكسل مع Conversions API من السيرفر.");
    if (I && !(I.tracking.ga4 || I.tracking.gtm)) add(65, "Set up GA4 through Tag Manager", "أعدّ GA4 عبر Tag Manager",
      "No Google Analytics 4 or Tag Manager detected. You cannot see which channels bring customers.",
      "لم نرصد Google Analytics 4 أو Tag Manager، فلا يمكنك معرفة القنوات التي تجلب العملاء.");
    if (answer("tracking") !== "yes") add(60, "Verify your conversion tracking", "تحقّق من تتبع التحويلات",
      "Broken or double-counted conversions are the most common reason ad results look better or worse than reality.",
      "التحويلات المعطّلة أو المحسوبة مرتين هي أكثر سبب شائع لظهور نتائج الإعلانات أفضل أو أسوأ من الواقع.");
    if (answer("testing") !== "yes") add(answer("ads") === "no" ? 20 : 58, "Start a monthly creative testing rhythm", "ابدأ إيقاعًا شهريًا لاختبار الإبداع",
      "On Meta and TikTok, creative is the targeting. Testing three to five new ads a month is the cheapest way to lower acquisition cost.",
      "على ميتا وتيك توك، الإبداع هو الاستهداف. اختبار ثلاثة إلى خمسة إعلانات جديدة شهريًا هو أرخص طريقة لخفض تكلفة الاكتساب.");
    if (answer("reporting") === "no") add(55, "Know your cost per customer", "اعرف تكلفة العميل",
      "Track spend divided by new customers every week. It is the number that tells you whether growth is profitable.",
      "تابع الإنفاق مقسومًا على العملاء الجدد كل أسبوع. هذا الرقم يخبرك إن كان النمو مربحًا.");
    if (I && !I.description) add(45, "Write a meta description", "اكتب وصف ميتا",
      "Your page has no meta description, so Google writes its own snippet. Write one that sells the click.",
      "صفحتك بلا وصف ميتا، فيكتب جوجل مقتطفه الخاص. اكتب وصفًا يُقنع بالنقر.");
    if (I && I.h1Count === 0) add(40, "Add one clear H1 heading", "أضف عنوانًا رئيسيًا H1 واضحًا",
      "The page has no H1. One clear main heading helps both visitors and search engines understand it.",
      "الصفحة بلا H1. عنوان رئيسي واضح يساعد الزوار ومحركات البحث على فهمها.");
    if (I && !I.schemaCount) add(35, "Add structured data", "أضف بيانات منظّمة",
      "No schema.org markup found. Organization, product or FAQ schema helps Google and AI assistants describe you correctly.",
      "لم نجد بيانات schema.org. بيانات المنظمة أو المنتجات أو الأسئلة تساعد جوجل ومساعدي الذكاء الاصطناعي على وصفك بدقة.");
    if (I && !I.https) add(75, "Switch to HTTPS", "انتقل إلى HTTPS",
      "The site is not served over HTTPS. Browsers warn visitors and ad platforms may reject it.",
      "الموقع لا يعمل عبر HTTPS. المتصفحات تحذّر الزوار وقد ترفضه المنصات الإعلانية.");
    if (s.experience != null && s.experience < 70) add(40, "Fix accessibility and best-practice issues", "أصلح مشكلات سهولة الوصول وأفضل الممارسات",
      "Experience scored " + s.experience + "/100. Contrast, labels and console errors affect trust and conversion.",
      "حصلت التجربة على " + s.experience + "/100. التباين والتسميات وأخطاء الكونسول تؤثر في الثقة والتحويل.");
    return list.sort((a, b) => b.impact - a.impact).slice(0, 3);
  }

  const color = v => (v == null ? "var(--text-3)" : v >= 80 ? "#2BD9A0" : v >= 50 ? "#FFB547" : "#FF6B78");
  const verdict = v => v >= 80 ? L("Healthy. Time to scale.", "صحة جيدة. وقت التوسّع.") : v >= 60 ? L("Stable, with clear room to grow.", "مستقر، مع مساحة واضحة للنمو.") : v >= 40 ? L("Warning signs. Fix these before spending more.", "علامات تحذير. أصلحها قبل زيادة الإنفاق.") : L("Critical. Your marketing is leaking.", "حالة حرجة. تسويقك يتسرّب.");

  function render(url, R, partial) {
    const LABELS = { speed: L("Speed", "السرعة"), seo: L("SEO", "السيو"), arabic: L("Arabic readiness", "جاهزية العربي"), experience: L("Experience", "التجربة"), marketing: L("Marketing maturity", "نضج التسويق") };
    $("[data-vs-site]").textContent = url;
    $("[data-vs-verdict]").textContent = verdict(R.total);
    const g = $("[data-vs-gauge]");
    g.style.setProperty("--vs-c", color(R.total));
    $("[data-vs-bars]").innerHTML = Object.keys(LABELS).map(k => {
      const v = R.s[k];
      return '<div class="vs-bar" style="--vs-c:' + color(v) + '"><span class="vs-bar__l">' + esc(LABELS[k]) + '</span><span class="vs-bar__t"><i data-w="' + (v ?? 0) + '"></i></span>' +
        (v == null ? '<span class="vs-bar__v vs-bar__na">' + L("n/a", "غير متاح") + "</span>" : '<span class="vs-bar__v">' + v + "</span>") + "</div>";
    }).join("") + (partial ? '<p class="micro">' + esc(partial) + "</p>" : "");
    $("[data-vs-fixes]").innerHTML = R.fixes.length ? R.fixes.map(f => "<li><div><b>" + esc(f.t) + "</b><span>" + esc(f.d) + "</span></div></li>").join("")
      : "<li><div><b>" + esc(L("No urgent fixes found", "لا توجد إصلاحات عاجلة")) + "</b><span>" + esc(L("Your foundations look solid. The next gains come from creative testing and scaling what works.", "أساسك يبدو قويًا. المكاسب التالية تأتي من اختبار الإبداع وتوسيع ما ينجح.")) + "</span></div></li>";
    $("[data-vs-summary]").value = "Vitals Score " + R.total + "/100 for " + url + "\n" +
      Object.keys(LABELS).map(k => LABELS[k] + ": " + (R.s[k] ?? "n/a")).join(" · ") + "\nTop fixes: " + R.fixes.map(f => f.t).join(" | ");
    scan.hidden = true;
    out.hidden = false;
    requestAnimationFrame(() => {
      g.style.setProperty("--v", R.total);
      let n = 0; const el = $("[data-vs-total]"); const t0 = performance.now();
      const tick = now => { const p = Math.min(1, (now - t0) / 1200); n = Math.round(R.total * (1 - Math.pow(1 - p, 3))); el.textContent = n; if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      root.querySelectorAll(".vs-bar__t i").forEach(i => { i.style.width = i.dataset.w + "%"; });
    });
    out.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.BVAnalytics) window.BVAnalytics.event("vitals_score", { score: R.total });
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const url = validate();
    if (!url) return;
    form.hidden = true; scan.hidden = false; out.hidden = true;
    const steps = [L("Checking your site…", "نفحص موقعك…"), L("Measuring mobile speed…", "نقيس سرعة الموبايل…"), L("Reading SEO and Arabic signals…", "نقرأ إشارات السيو والعربي…"), L("Looking for tracking pixels…", "نبحث عن بيكسلات التتبع…"), L("Calculating your score…", "نحسب درجتك…")];
    let i = 0; msg.textContent = steps[0];
    const ticker = setInterval(() => { i = Math.min(i + 1, steps.length - 1); msg.textContent = steps[i]; }, 6000);
    const [P, I] = await Promise.allSettled([psi(url), inspect(url)]);
    clearInterval(ticker);
    const pv = P.status === "fulfilled" ? P.value : null;
    const iv = I.status === "fulfilled" ? I.value : null;
    if (!pv && !iv) {
      scan.hidden = true; form.hidden = false;
      const why = I.reason && I.reason.message ? " (" + I.reason.message + ")" : "";
      if (window.BVNotice) window.BVNotice.show({ kind: "err", title: L("We couldn't reach that site", "تعذّر الوصول لهذا الموقع"), text: L("Check the address and try again in a moment.", "تحقّق من العنوان وحاول مرة أخرى بعد قليل.") + why, actions: [{ label: L("OK", "حسنًا"), primary: true }] });
      return;
    }
    const partial = !pv ? L("Google's speed scan was unavailable, so speed and experience are not included this time. Try again in a minute for the full score.", "فحص السرعة من جوجل لم يكن متاحًا، لذا لم تُحتسب السرعة والتجربة هذه المرة. حاول بعد دقيقة للدرجة الكاملة.")
      : !iv ? L("We could not read the page's HTML directly, so Arabic readiness was not checked.", "لم نتمكن من قراءة كود الصفحة مباشرة، فلم تُفحص جاهزية العربي.") : "";
    render(url, score(url, pv, iv), partial);
  });

  $("[data-vs-again]").addEventListener("click", () => {
    out.hidden = true; form.hidden = false;
    form.reset();
    $("#vs-url").focus();
  });
})();
