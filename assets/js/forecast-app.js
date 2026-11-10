/* ==========================================================================
   VITALS FORECAST · the page (steps, result screen, share, print)
   The math is in forecast.js; benchmarks in assets/data/forecast-benchmarks.json.
   ========================================================================== */
(function () {
  "use strict";
  const root = document.querySelector("[data-fc]");
  if (!root || !window.Forecast) return;
  const F = window.Forecast;
  const AR = document.documentElement.lang === "ar";
  const L = (en, ar) => (AR ? ar : en);
  const $ = (sel, el = root) => el.querySelector(sel);
  const $$ = (sel, el = root) => [...el.querySelectorAll(sel)];
  const form = $("[data-fc-form]");
  const steps = $$("[data-fc-step]");
  const resultBox = $("[data-fc-result]");
  const prefix = document.querySelector('script[src*="forecast-app.js"]').getAttribute("src").replace(/assets\/js\/forecast-app\.js.*$/, "");
  let data = null;
  let at = 0;
  let overrides = {};

  const num = v => { const n = parseFloat(String(v ?? "").replace(/,/g, "")); return isFinite(n) ? n : null; };
  const fmt = (v, d = 0) => (v === null || v === undefined || !isFinite(v) ? "—" : Number(v).toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d }));
  const money = (v, cur) => (v === null ? "—" : (AR ? fmt(v) + " " + (cur === "SAR" ? "ريال" : "جنيه") : cur + " " + fmt(v)));
  const pct = (v, d = 1) => (v === null ? "—" : fmt(v * 100, d) + "%");
  const x = v => (v === null ? "—" : fmt(v, 2) + "x");

  /* ---------- state ⇄ form ---------- */
  function state() {
    const fd = new FormData(form);
    const g = k => String(fd.get(k) || "").trim();
    const s = { goal: g("goal"), market: g("market"), industry: g("industry"), budget: g("budget"), aov: g("aov"), margin: g("margin"), cvr: g("cvr"), close: g("close"), mode: g("mode") || "budget", tt: g("tt"), tv: g("tv"), tr: g("tr") };
    s.cur = s.market === "sa" ? "SAR" : s.market === "both" ? g("cur") || "EGP" : "EGP";
    if ($('[data-fc-dunno="cvr"]').checked) s.cvr = "x";
    if ($('[data-fc-dunno="close"]').checked) s.close = "x";
    return s;
  }
  function fill(s) {
    const set = (name, v) => {
      if (v === undefined) return;
      const els = $$(`[name="${name}"]`, form);
      els.forEach(el => { if (el.type === "radio") el.checked = el.value === v; else el.value = v === "x" ? "" : v; });
    };
    ["goal", "market", "industry", "cur", "budget", "aov", "margin", "cvr", "close", "mode", "tt", "tv", "tr"].forEach(k => set(k, s[k]));
    $('[data-fc-dunno="cvr"]').checked = s.cvr === "x";
    $('[data-fc-dunno="close"]').checked = s.close === "x";
    sync();
  }

  /* ---------- labels that follow the answers ---------- */
  const AOV_LABEL = {
    sales: ["Average order value", "متوسط قيمة الطلب"], leads: ["Average deal value", "متوسط قيمة الصفقة"], bookings: ["Average booking value", "متوسط قيمة الحجز"],
    installs: ["Average value per install", "متوسط قيمة كل تحميل"], visits: ["Average spend per visit", "متوسط الصرف في كل زيارة"]
  };
  function sync() {
    const s = state();
    $$("[data-fc-cur]").forEach(el => (el.textContent = AR ? (s.cur === "SAR" ? "ريال" : "جنيه") : s.cur));
    $('[data-fc-field="cur"]').hidden = s.market !== "both";
    $('[data-fc-field="close"]').hidden = s.goal !== "leads";
    const lab = AOV_LABEL[s.goal] || AOV_LABEL.sales;
    $("[data-fc-aov-label]").textContent = L(lab[0], lab[1]);
    const showTv = s.tt === "roas" || s.tt === "cpr";
    $('[data-fc-field="tv"]').hidden = !showTv;
    $("[data-fc-tv-label]").textContent = s.tt === "cpr" ? L("Target cost per result (" + s.cur + ")", "التكلفة المستهدفة لكل نتيجة (" + (s.cur === "SAR" ? "ريال" : "جنيه") + ")") : L("Target ROAS (for example 3 for 3x)", "العائد المستهدف (مثلًا 3 يعني 3 أضعاف)");
    $('[data-fc-field="tr"]').hidden = s.mode !== "target";
    $("[data-fc-mode-note]").textContent = s.mode === "target" ? L("We'll calculate the budget your target needs.", "هنحسب هدفك محتاج ميزانية قد إيه.") : L("We'll forecast what your budget can bring.", "هنتوقّع ميزانيتك ممكن تجيب إيه.");
    ["cvr", "close"].forEach(k => { const box = $(`[data-fc-dunno="${k}"]`); $(`#fc-${k}`).disabled = box.checked; });
  }
  form.addEventListener("change", sync);

  /* ---------- steps ---------- */
  function show(i) {
    at = i;
    steps.forEach((el, k) => (el.hidden = k !== i));
    $("[data-fc-back]").hidden = i === 0;
    $("[data-fc-next] [data-en]").textContent = i === steps.length - 1 ? L("See my forecast", "وريني التوقع") : L("Next", "التالي");
    $("[data-fc-bar]").style.width = ((i + 1) / (steps.length + 1)) * 100 + "%";
    $("[data-fc-count]").textContent = L(`Step ${i + 1} of ${steps.length}`, `خطوة ${i + 1} من ${steps.length}`);
    err("");
  }
  function err(msg) { const e = $("[data-fc-err]"); e.textContent = msg; e.hidden = !msg; }
  function check(i) {
    const s = state();
    const need = [
      () => (s.goal ? true : L("Pick a goal.", "اختار هدف.")),
      () => (s.market && s.industry ? true : L("Pick a market and an industry.", "اختار السوق والمجال.")),
      () => {
        if (!(num(s.budget) > 0)) return L("Enter your monthly ad budget.", "اكتب ميزانية الإعلانات في الشهر.");
        if (!(num(s.aov) > 0)) return L("Enter the average value.", "اكتب متوسط القيمة.");
        const m = num(s.margin); if (!(m > 0 && m <= 100)) return L("Enter a gross margin between 1 and 100.", "اكتب هامش ربح بين 1 و100.");
        return true;
      },
      () => {
        if (!s.tt) return L("Pick a target, or 'Not sure'.", "اختار هدف، أو 'مش متأكد'.");
        if (s.tt !== "none" && !(num(s.tv) > 0)) return L("Enter your target.", "اكتب الهدف.");
        if (s.mode === "target" && !(num(s.tr) > 0)) return L("Enter the results you want per month.", "اكتب عدد النتايج اللي عايزها في الشهر.");
        return true;
      }
    ][i]();
    if (need !== true) { err(need); return false; }
    return true;
  }
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!check(at)) return;
    if (at < steps.length - 1) { show(at + 1); steps[at].querySelector("input, select")?.focus(); return; }
    run(true);
  });
  $("[data-fc-back]").addEventListener("click", () => show(Math.max(0, at - 1)));

  /* ---------- the forecast ---------- */
  function compute(s) {
    const pctIn = v => (v === "x" || v === "" ? null : num(v) !== null ? num(v) / 100 : null);
    const b = F.benchmark(data, s.market, s.industry, s.goal) || {};
    const mid = k => (overrides[k] !== undefined ? overrides[k] : b[k] && b[k].mid !== undefined ? b[k].mid : null);
    const factors = Object.assign({}, data.scenario_factors, overrides.factors || {});
    const learning = overrides.learning !== undefined ? overrides.learning : data.learning_phase_factor;
    const userCvr = pctIn(s.cvr);
    const userClose = pctIn(s.close);
    const unknowns = (s.cvr === "x" ? 1 : 0) + (s.goal === "leads" && s.close === "x" ? 1 : 0);
    const bench = { cpm: mid("cpm"), ctr: mid("ctr"), cvr: userCvr ?? mid("cvr"), cpr: userCvr ? null : mid("cost_per_result") };
    const cpr = F.costPerResult(bench);
    const margin = num(s.margin) / 100;
    const input = { goal: s.goal, aov: num(s.aov), dealValue: num(s.aov), closeRate: s.goal === "leads" ? userClose ?? mid("close_rate") : null };
    const budget = num(s.budget);
    const be = F.breakEvenRoas(margin);
    // the target: a ROAS, a cost per result, or break-even when not sure
    const targetRoas = s.tt === "roas" ? num(s.tv) : s.tt === "none" ? be : null;
    const reqCpr = s.tt === "cpr" ? num(s.tv) : F.requiredCpr(input, targetRoas);
    const reqCvr = F.requiredCvr(reqCpr, bench);
    const gap = F.gapPct(cpr, reqCpr);
    const scen = F.scenarios({ cpr, budget, input, factors, learning, mode: s.mode, targetResults: num(s.tr) });
    return {
      s, b, bench, cpr, margin, input, budget, be, targetRoas, reqCpr, reqCvr, gap, scen,
      reality: F.reality(gap, overrides.stretch !== undefined ? overrides.stretch : data.stretch_max_gap),
      conf: F.confidence({ unknowns, hasBenchmark: cpr !== null }),
      seasons: F.seasonsAhead(data.seasons, new Date().toISOString().slice(0, 10), 60, s.market),
      small: data.min_budget && num(data.min_budget[s.cur]) !== null && budget < data.min_budget[s.cur],
      factors, learning
    };
  }

  function run(focus) {
    const r = compute(state());
    const { s } = r;
    form.hidden = true;
    $(".fc-progress").hidden = true;
    $("[data-fc-count]").hidden = true;
    resultBox.hidden = false;
    $("[data-fc-be]").textContent = x(r.be);
    const conf = { high: ["High confidence", "ثقة عالية"], medium: ["Medium confidence", "ثقة متوسطة"], low: ["Low confidence", "ثقة منخفضة"] }[r.conf];
    const c = $("[data-fc-conf]"); c.textContent = L(conf[0], conf[1]); c.dataset.level = r.conf;
    const re = $("[data-fc-reality]");
    re.hidden = !r.reality;
    if (r.reality) {
      const t = { realistic: ["Realistic with this budget", "واقعي بالميزانية دي"], stretch: ["A stretch with this budget", "صعب شوية بالميزانية دي"], unrealistic: ["Unrealistic with this budget", "مش واقعي بالميزانية دي"] }[r.reality];
      re.textContent = L(t[0], t[1]); re.dataset.level = r.reality;
    }
    $("[data-fc-missing]").hidden = r.cpr !== null && !!r.scen;
    renderScenarios(r);
    renderTrue(r);
    const se = $("[data-fc-season]");
    se.hidden = !r.seasons.length;
    if (r.seasons.length) se.textContent = L("Season ahead: ", "موسم جاي: ") + r.seasons.map(z => (AR ? z.ar : z.en)).join(" · ") + L(". Costs and demand shift around it; plan creative and budget early.", ". التكاليف والطلب بيتغيروا حواليه، فجهّز الكرييتيف والميزانية بدري.");
    renderAssume(r);
    $("[data-fc-cta]").hidden = r.small;
    $("[data-fc-small]").hidden = !r.small;
    $("[data-fc-summary]").value = summary(r);
    history.replaceState(null, "", "?" + F.toQuery(s) + location.hash);
    if (focus) { resultBox.focus({ preventScroll: true }); resultBox.scrollIntoView({ behavior: "smooth", block: "start" }); }
  }

  function renderScenarios(r) {
    const box = $("[data-fc-scen]");
    box.hidden = !r.scen;
    if (!r.scen) { box.innerHTML = ""; return; }
    const names = { conservative: ["Conservative", "متحفظ"], expected: ["Expected", "متوقع"], strong: ["Strong", "قوي"] };
    const unit = { sales: ["purchases", "عملية شرا"], leads: ["leads", "عميل محتمل"], bookings: ["bookings", "حجز"], installs: ["installs", "تحميل"], visits: ["visits", "زيارة"] }[r.s.goal];
    box.innerHTML = F.SCENARIOS.map(k => `<article class="fc-col${k === "expected" ? " fc-col--mid" : ""}"><h4>${L(names[k][0], names[k][1])}</h4>${r.scen[k].map(m => `<dl><dt>${L("Month " + m.month, "شهر " + m.month)}</dt>` +
      (r.s.mode === "target" ? `<dd><span>${L("Budget needed", "الميزانية المطلوبة")}</span><b>${money(m.budget, r.s.cur)}</b></dd>` : `<dd><span>${L("Results", "النتايج")}</span><b>${fmt(m.results)} ${L(unit[0], unit[1])}</b></dd>`) +
      `<dd><span>${L("Revenue", "الإيراد")}</span><b>${money(m.revenue, r.s.cur)}</b></dd><dd><span>ROAS</span><b>${x(m.roas)}</b></dd><dd><span>${L("Cost per result", "تكلفة النتيجة")}</span><b>${money(m.cpr, r.s.cur)}</b></dd></dl>`).join("")}</article>`).join("");
  }

  function renderTrue(r) {
    const rows = [];
    const add = (en, ar, need, bench) => rows.push(`<div><dt>${L(en, ar)}</dt><dd><b>${need}</b>${bench ? `<span>${L("Benchmark", "المرجع")}: ${bench}</span>` : ""}</dd></div>`);
    add("Cost per result" + (r.s.tt === "none" ? " to break even" : " your target needs"), "تكلفة النتيجة" + (r.s.tt === "none" ? " عشان تتعادل" : " اللي هدفك محتاجها"), L("Under ", "أقل من ") + money(r.reqCpr, r.s.cur), r.cpr !== null ? money(r.cpr, r.s.cur) : "");
    if (r.reqCvr !== null) add("Conversion rate it needs", "نسبة التحويل المطلوبة", pct(r.reqCvr, 2), r.bench.cvr !== null ? pct(r.bench.cvr, 2) : "");
    if (r.gap !== null) add("Gap to the benchmark", "الفرق عن المرجع", r.gap <= 0 ? L("None: the benchmark already clears it", "مفيش: المرجع أحسن من المطلوب") : pct(r.gap, 0) + L(" cheaper than the benchmark", " أرخص من المرجع"));
    if (r.targetRoas !== null && r.s.tt !== "none") add("Target ROAS vs break-even", "العائد المستهدف قصاد التعادل", x(r.targetRoas) + " / " + x(r.be));
    $("[data-fc-true]").innerHTML = rows.join("");
  }

  function renderAssume(r) {
    const b = r.b || {};
    const src = (b.source || L("not set yet", "لسه متحددش")) + (b.updated ? " · " + L("updated ", "اتحدّث ") + b.updated : "");
    const item = (key, en, ar, val, unit) => `<label class="field"><span>${L(en, ar)}${unit ? " (" + unit + ")" : ""}</span><input type="number" step="any" min="0" dir="ltr" data-fc-o="${key}" value="${val === null || val === undefined ? "" : val}" placeholder="${L("not set", "مش محدد")}"></label>`;
    $("[data-fc-assume]").innerHTML =
      `<p class="micro fc-assume__src">${L("Source", "المصدر")}: ${src}</p>` +
      item("cpm", "CPM", "تكلفة الألف ظهور", r.bench.cpm, r.s.cur) +
      item("ctr", "Click-through rate", "نسبة الضغط", r.bench.ctr, "0–1") +
      item("cvr", "Conversion rate", "نسبة التحويل", r.bench.cvr, "0–1") +
      item("cost_per_result", "Cost per result", "تكلفة النتيجة", r.bench.cpr, r.s.cur) +
      (r.s.goal === "leads" ? item("close_rate", "Close rate", "نسبة الإغلاق", r.input.closeRate, "0–1") : "") +
      item("f_conservative", "Conservative factor", "معامل المتحفظ", r.factors.conservative) +
      item("f_expected", "Expected factor", "معامل المتوقع", r.factors.expected) +
      item("f_strong", "Strong factor", "معامل القوي", r.factors.strong) +
      item("learning", "Month 1 learning factor", "معامل تعلّم أول شهر", r.learning) +
      item("stretch", "Stretch limit (gap)", "حد 'صعب شوية'", overrides.stretch !== undefined ? overrides.stretch : data.stretch_max_gap, "0–1");
  }
  $("[data-fc-assume]").addEventListener("change", e => {
    const el = e.target.closest("[data-fc-o]"); if (!el) return;
    const k = el.dataset.fcO; const v = num(el.value);
    if (k.startsWith("f_")) { overrides.factors = Object.assign({}, overrides.factors, { [k.slice(2)]: v }); }
    else overrides[k] = v;
    run(false);
  });

  function summary(r) {
    const s = r.s;
    const goal = { sales: "Online sales", leads: "Leads", bookings: "Bookings", installs: "App installs", visits: "Store visits" }[s.goal];
    const lines = [
      "Vitals Forecast",
      `Goal: ${goal} · Market: ${s.market} · Industry: ${s.industry}`,
      `Budget: ${s.cur} ${fmt(r.budget)} / month · Average value: ${s.cur} ${fmt(num(s.aov))} · Margin: ${fmt(num(s.margin), 1)}%`,
      `Break-even ROAS: ${x(r.be)}`,
      `Target: ${s.tt === "none" ? "not sure" : s.tt + " " + s.tv}${s.mode === "target" ? " · results wanted: " + s.tr : ""}`,
      `Required cost per result: ${s.cur} ${fmt(r.reqCpr)}`,
      r.cpr !== null ? `Benchmark cost per result: ${s.cur} ${fmt(r.cpr)}` : "Benchmarks: waiting on the team",
      r.reality ? `Reality check: ${r.reality}` : "",
      `Confidence: ${r.conf}`,
      "Link: " + location.origin + location.pathname + "?" + F.toQuery(s)
    ];
    return lines.filter(Boolean).join("\n");
  }

  /* ---------- share, print, again ---------- */
  $("[data-fc-copy]").addEventListener("click", async e => {
    const url = location.origin + location.pathname + "?" + F.toQuery(state());
    const b = e.currentTarget.querySelector("[data-en]") || e.currentTarget;
    try { await navigator.clipboard.writeText(url); b.textContent = L("Link copied", "اتنسخ اللينك"); }
    catch (_) { window.prompt(L("Copy this link", "انسخ اللينك ده"), url); }
    setTimeout(() => (b.textContent = L("Copy link", "انسخ اللينك")), 2200);
  });
  $("[data-fc-print]").addEventListener("click", () => window.print());
  $("[data-fc-again]").addEventListener("click", () => {
    resultBox.hidden = true; form.hidden = false; $(".fc-progress").hidden = false; $("[data-fc-count]").hidden = false;
    overrides = {}; history.replaceState(null, "", location.pathname); show(0);
  });

  /* ---------- start ---------- */
  fetch(prefix + "assets/data/forecast-benchmarks.json").then(r => r.json()).then(d => {
    data = d;
    const q = F.fromQuery(location.search);
    if (Object.keys(q).length) {
      fill(q);
      for (let i = 0; i < steps.length; i++) if (!check(i)) { show(i); return; }
      show(steps.length - 1);
      run(false);
    } else { sync(); show(0); }
  }).catch(() => { err(L("The forecast data didn't load. Refresh the page to try again.", "بيانات التوقع ماحملتش. اعمل ريفريش وجرّب تاني.")); });
})();
