/* ==========================================================================
   VITALS HQ · product screens (static)
   Renders a still screen of the app into every [data-hq-app] element;
   data-device="phone" shows the mobile app inside a phone frame.
   All data is fictional sample data ("Client A", "Spring Campaign v3").
   Each instance keeps its own state; data-view picks the opening screen.
   ========================================================================== */
(function () {
  "use strict";
  const ar = () => document.documentElement.lang === "ar";
  const L = (en, a) => (ar() ? a : en);
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const ICONS = {
    home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>',
    inbox: '<path d="M3 13h5l2 3h4l2-3h5"/><path d="M5 5h14l2 8v6H3v-6z"/>',
    approvals: '<path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="4"/>',
    scope: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.8 7.2L3 20l1.4-4.9A8.4 8.4 0 1 1 21 11.5z"/>',
    results: '<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    invoices: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  const ico = (k, cls = "") => `<svg class="hq-i ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;

  const NAV = [
    ["home", "Home", "الرئيسية"], ["inbox", "Inbox", "الوارد"], ["approvals", "Approvals", "الموافقات"], ["scope", "Scope", "النطاق"],
    ["whatsapp", "WhatsApp", "واتساب"], ["results", "Results", "النتايج"], ["calendar", "Calendar", "الكالندر"], ["invoices", "Invoices", "الفواتير"]
  ];
  const CLIENTS = [["A", "#2EE6A6"], ["B", "#5B8CFF"], ["C", "#F2A33A"]];

  function initialState() {
    return {
      assets: [
        { id: 1, en: "Hero banner", ar: "بانر رئيسي", client: "A", v: 3, status: "review", due: ["Today", "النهارده"], kind: "design" },
        { id: 2, en: "Reel cut 15s", ar: "ريل 15 ثانية", client: "A", v: 2, status: "changes", due: ["Tomorrow", "بكرة"], kind: "video" },
        { id: 3, en: "Product carousel", ar: "كاروسيل منتجات", client: "B", v: 1, status: "review", due: ["Thu", "الخميس"], kind: "design" },
        { id: 4, en: "Story set, week 2", ar: "ستوريز الأسبوع 2", client: "C", v: 2, status: "approved", due: ["Done", "خلص"], kind: "design" },
        { id: 5, en: "Landing page copy", ar: "كلام صفحة الهبوط", client: "B", v: 4, status: "approved", due: ["Done", "خلص"], kind: "copy" }
      ],
      open: 1,
      ledger: [
        { en: "Story set, week 2", ar: "ستوريز الأسبوع 2", v: 2, who: "C", time: "Mon 11:20" },
        { en: "Landing page copy", ar: "كلام صفحة الهبوط", v: 4, who: "B", time: "Sun 16:05" }
      ],
      scope: [
        { en: "Social posts", ar: "بوستات سوشيال", used: 2, limit: 3, done: "12/12" },
        { en: "Reel cuts", ar: "ريلز", used: 3, limit: 2, done: "3/4", flagged: true },
        { en: "Story sets", ar: "ستوريز", used: 1, limit: 2, done: "2/4" }
      ],
      chat: [
        { me: true, en: "Morning! Spring Campaign v2 is ready for your review.", ar: "صباح الخير! نسخة 2 من حملة الربيع جاهزة للمراجعة.", time: "09:12" },
        { me: false, en: "Thanks. Can the logo be a bit larger on the banner?", ar: "شكرًا. ممكن اللوجو يكبر شوية في البانر؟", time: "09:40" },
        { me: true, en: "Done in v3. Sending it over now.", ar: "اتعدّل في نسخة 3. هبعتهالك دلوقتي.", time: "10:02" }
      ],
      sent: false,
      invoices: [
        { no: "INV-0142", client: "A", cur: "EGP", amt: "24,000", st: "paid" },
        { no: "INV-0143", client: "B", cur: "SAR", amt: "6,500", st: "due" },
        { no: "INV-0144", client: "C", cur: "EGP", amt: "18,500", st: "draft" }
      ],
      toast: ""
    };
  }

  const statusPill = st => ({
    review: `<span class="hq-pill hq-pill--rev">${L("In review", "قيد المراجعة")}</span>`,
    changes: `<span class="hq-pill hq-pill--warn">${L("Changes requested", "مطلوب تعديل")}</span>`,
    approved: `<span class="hq-pill hq-pill--ok">${L("Approved", "متوافق عليه")}</span>`
  })[st];
  const clientChip = c => { const col = (CLIENTS.find(x => x[0] === c) || CLIENTS[0])[1]; return `<span class="hq-client"><i style="background:${col}"></i>${L("Client", "عميل")} ${c}</span>`; };
  const name = o => (ar() ? o.ar : o.en);

  /* ---------------- views ---------------- */
  const V = {};
  V.home = s => {
    const waiting = s.assets.filter(a => a.status === "review").length;
    const approved = s.assets.filter(a => a.status === "approved").length;
    const flagged = s.scope.filter(x => x.used > x.limit).length;
    return `
      <div class="hq-kpis">
        ${kpi(L("Waiting on clients", "مستني رد العميل"), waiting, "approvals")}
        ${kpi(L("Approved this week", "اتوافق عليه الأسبوع ده"), approved, "approvals")}
        ${kpi(L("Out of scope", "برّه النطاق"), flagged, "scope", flagged ? "warn" : "")}
        ${kpi(L("Unread WhatsApp", "واتساب مش مقروء"), s.sent ? 0 : 1, "whatsapp")}
      </div>
      <div class="hq-cols">
        <div class="hq-card">
          <div class="hq-card__h">${L("Needs your attention", "محتاج انتباهك")}</div>
          ${s.assets.filter(a => a.status !== "approved").map(a => `
            <button class="hq-row" data-go="approvals" data-open="${a.id}">
              <span class="hq-row__l"><b>${esc(name(a))} · v${a.v}</b><small>${clientChip(a.client)} · ${L("Due", "التسليم")} ${L(a.due[0], a.due[1])}</small></span>${statusPill(a.status)}
            </button>`).join("")}
        </div>
        <div class="hq-card">
          <div class="hq-card__h">${L("Approval ledger", "سجل الموافقات")}</div>
          <ol class="hq-ledger">${s.ledger.map(l => `<li>${ico("check")}<span><b>${esc(name(l))} · v${l.v}</b><small>${L("Approved by Client", "وافق عليه عميل")} ${l.who} · ${l.time}</small></span></li>`).join("")}</ol>
        </div>
      </div>`;
  };
  const kpi = (label, n, go, tone = "") => `<button class="hq-kpi${tone ? " hq-kpi--" + tone : ""}" data-go="${go}"><small>${label}</small><b>${n}</b></button>`;

  V.inbox = s => `
    <div class="hq-card hq-card--flush">
      ${[
        ["whatsapp", L("Client A replied on WhatsApp", "عميل A رد على واتساب"), L("\"Can the logo be a bit larger?\"", "\"ممكن اللوجو يكبر شوية؟\""), "09:40", "whatsapp", !s.sent],
        ["approvals", L("Reel cut 15s needs changes", "ريل 15 ثانية محتاج تعديل"), L("2 comments at 00:07", "تعليقين عند 00:07"), "09:31", "approvals"],
        ["scope", L("Reel cuts went out of scope", "الريلز عدّت النطاق"), L("Round 3 of 2 agreed", "الجولة 3 من 2 متفق عليهم"), L("Yesterday", "امبارح"), "scope"],
        ["invoices", L("INV-0142 was paid", "فاتورة INV-0142 اتدفعت"), L("Client A · EGP 24,000", "عميل A · 24,000 جنيه"), L("Mon", "الاتنين"), "invoices"]
      ].map(([i, t1, t2, tm, go, unread]) => `<button class="hq-row hq-row--inbox${unread ? " is-unread" : ""}" data-go="${go}"><span class="hq-row__ico">${ico(i)}</span><span class="hq-row__l"><b>${t1}</b><small>${t2}</small></span><span class="hq-row__t">${tm}</span></button>`).join("")}
    </div>`;

  V.approvals = s => {
    const a = s.assets.find(x => x.id === s.open) || s.assets[0];
    const col = (st, en, arr) => `<div class="hq-col"><div class="hq-col__h">${L(en, arr)} <span>${s.assets.filter(x => x.status === st).length}</span></div>
      ${s.assets.filter(x => x.status === st).map(x => `<button class="hq-task${x.id === a.id ? " is-open" : ""}" data-open="${x.id}"><b>${esc(name(x))}</b><small>${clientChip(x.client)} · v${x.v}</small></button>`).join("")}</div>`;
    return `
      <div class="hq-board">
        ${col("review", "In review", "قيد المراجعة")}
        ${col("changes", "Changes requested", "مطلوب تعديل")}
        ${col("approved", "Approved", "متوافق عليه")}
      </div>
      <div class="hq-detail">
        <div class="hq-detail__h"><div><b>${esc(name(a))} · v${a.v}</b><small>${clientChip(a.client)}</small></div>${statusPill(a.status)}</div>
        <div class="hq-canvas hq-canvas--${a.kind}">
          <span class="hq-canvas__logo"></span><span class="hq-canvas__h"></span><span class="hq-canvas__p"></span><span class="hq-canvas__btn"></span>
          <span class="hq-pin" style="inset-inline-start:18%;top:22%">1</span>
          <span class="hq-pin" style="inset-inline-start:64%;top:66%">2</span>
          ${a.kind === "video" ? `<span class="hq-scrub"><i></i><em>00:07</em></span>` : ""}
        </div>
        <div class="hq-comments">
          <div class="hq-cmt"><span class="hq-av">A</span><p><b>${L("Client", "عميل")} ${a.client}</b> ${L("Make the logo a bit larger here.", "كبّر اللوجو شوية هنا.")}<small>📍1 · v${a.v}</small></p></div>
          <div class="hq-cmt hq-cmt--me"><span class="hq-av hq-av--me">YA</span><p><b>${L("Your team", "فريقك")}</b> ${L("Updated in this version.", "اتعدّل في النسخة دي.")}<small>📍1</small></p></div>
        </div>
        <div class="hq-actions">
          ${a.status === "approved"
            ? `<span class="hq-done">${ico("check")} ${L("Logged in the ledger", "اتسجل في السجل")}</span>`
            : `<button class="hq-btn hq-btn--ghost" data-act="changes">${L("Request changes", "اطلب تعديل")}</button><button class="hq-btn" data-act="approve">${ico("check")} ${L("Approve", "موافقة")}</button>`}
        </div>
      </div>`;
  };

  V.scope = s => `
    <div class="hq-card hq-card--flush">
      <div class="hq-table hq-table--scope">
        <div class="hq-tr hq-th"><span>${L("Deliverable", "المطلوب")}</span><span>${L("Delivered", "اتسلم")}</span><span>${L("Revision rounds", "جولات التعديل")}</span><span></span></div>
        ${s.scope.map((x, i) => {
          const over = x.used > x.limit;
          return `<div class="hq-tr${over ? " is-over" : ""}"><span><b>${esc(name(x))}</b><small>${clientChip("A")}</small></span><span>${x.done}</span>
            <span><span class="hq-meter${over ? " is-over" : ""}"><i style="width:${Math.min(100, (x.used / x.limit) * 100)}%"></i></span><small>${x.used} ${L("of", "من")} ${x.limit}</small></span>
            <span>${over && !x.billed ? `<button class="hq-btn hq-btn--sm" data-act="bill" data-i="${i}">${L("Send extra invoice", "ابعت فاتورة إضافية")}</button>` : over ? `<span class="hq-pill hq-pill--rev">${L("Invoiced", "اتعملت فاتورة")}</span>` : `<span class="hq-pill hq-pill--ok">${L("In scope", "جوه النطاق")}</span>`}</span></div>`;
        }).join("")}
      </div>
    </div>
    <p class="hq-hint">${L("Round 3 of the reel cuts goes beyond the 2 rounds agreed, so HQ flags it before anyone starts working.", "الجولة التالتة في الريلز بتعدّي الجولتين المتفق عليهم، فـ HQ بتنبّه قبل ما حد يبدأ يشتغل.")}</p>`;

  V.whatsapp = s => `
    <div class="hq-chat">
      <div class="hq-chat__list">
        <button class="hq-chat__item is-on">${clientChip("A")}<small>${s.sent ? L("Approved. Logged.", "متوافق عليه. اتسجل.") : L("Can the logo be…", "ممكن اللوجو…")}</small></button>
        <button class="hq-chat__item">${clientChip("B")}<small>${L("Thanks, received", "شكرًا، وصلت")}</small></button>
        <button class="hq-chat__item">${clientChip("C")}<small>${L("See you Thursday", "نتقابل الخميس")}</small></button>
      </div>
      <div class="hq-chat__thread">
        ${s.chat.map(m => `<div class="hq-msg${m.me ? " hq-msg--me" : ""}${m.sys ? " hq-msg--sys" : ""}">${esc(name(m))}${m.sys ? "" : `<small>${m.time}</small>`}</div>`).join("")}
        <div class="hq-compose">${s.sent
          ? `<span class="hq-done">${ico("check")} ${L("Reply synced to the task and the ledger", "الرد اتربط بالتاسك والسجل")}</span>`
          : `<span class="hq-compose__f">${L("Hero banner · v3 attached", "بانر رئيسي · نسخة 3 مرفقة")}</span><button class="hq-btn" data-act="send">${ico("send")} ${L("Send for review", "ابعت للمراجعة")}</button>`}</div>
      </div>
    </div>`;

  V.results = () => {
    const bars = [38, 52, 47, 64, 58, 76, 70];
    const days = ar() ? ["سبت", "أحد", "اتنين", "تلات", "أربع", "خميس", "جمعة"] : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    return `
      <div class="hq-kpis">
        ${kpi(L("Spend", "المصروف"), L("EGP 42.6K", "42.6 ألف جنيه"), "results")}
        ${kpi(L("Clicks", "النقرات"), "8,940", "results")}
        ${kpi(L("Leads", "العملاء"), "312", "results")}
        ${kpi(L("Cost per lead", "تكلفة العميل"), L("EGP 137", "137 جنيه"), "results")}
      </div>
      <div class="hq-cols">
        <div class="hq-card">
          <div class="hq-card__h">${L("Hero banner · v3 · leads per day", "بانر رئيسي · نسخة 3 · عملاء في اليوم")}</div>
          <div class="hq-bars">${bars.map((b, i) => `<span style="--h:${b}%"><i></i><em>${days[i]}</em></span>`).join("")}</div>
        </div>
        <div class="hq-card">
          <div class="hq-card__h">${L("Approved ads", "إعلانات متوافق عليها")}</div>
          ${[["Hero banner · v3", "بانر رئيسي · نسخة 3", "2.4%", "184"], ["Story set, week 2", "ستوريز الأسبوع 2", "1.9%", "96"], ["Landing page", "صفحة الهبوط", "3.1%", "32"]].map(([e, a, ctr, ld]) => `<div class="hq-row hq-row--static"><span class="hq-row__l"><b>${L(e, a)}</b><small>CTR ${ctr}</small></span><span class="hq-row__t">${ld} ${L("leads", "عميل")}</span></div>`).join("")}
        </div>
      </div>
      <p class="hq-hint">${L("Sample data for illustration.", "بيانات تجريبية للتوضيح.")}</p>`;
  };

  V.calendar = () => {
    const wd = ar() ? ["سبت", "أحد", "اتنين", "تلات", "أربع", "خميس", "جمعة"] : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const posts = { 2: ["Teaser", "تيزر"], 5: ["Iftar reel", "ريل الفطار"], 9: ["Offer post", "بوست العرض"], 13: ["Story set", "ستوريز"], 16: ["Suhoor reel", "ريل السحور"], 20: ["Giveaway", "مسابقة"], 24: ["Last 10 nights", "العشر الأواخر"], 27: ["Eid teaser", "تيزر العيد"] };
    let cells = "";
    for (let d = 1; d <= 30; d++) {
      const p = posts[d];
      cells += `<div class="hq-day${d === 30 ? " is-eid" : ""}"><span>${d}</span>${p ? `<em>${L(p[0], p[1])}</em>` : ""}${d === 30 ? `<em class="hq-eid">${L("Eid al-Fitr", "عيد الفطر")}</em>` : ""}</div>`;
    }
    return `
      <div class="hq-cal__h"><b>${L("Ramadan campaign · Client A", "حملة رمضان · عميل A")}</b><span class="hq-pill hq-pill--rev">${L("Ramadan", "رمضان")}</span><span class="hq-pill hq-pill--ok">${L("Eid", "العيد")}</span></div>
      <div class="hq-cal">${wd.map(w => `<div class="hq-wd">${w}</div>`).join("")}${cells}</div>`;
  };

  V.invoices = s => `
    <div class="hq-card hq-card--flush">
      <div class="hq-table hq-table--inv">
        <div class="hq-tr hq-th"><span>${L("Invoice", "الفاتورة")}</span><span>${L("Client", "العميل")}</span><span>${L("Amount", "المبلغ")}</span><span>${L("Status", "الحالة")}</span></div>
        ${s.invoices.map(i => `<div class="hq-tr${i.fresh ? " is-new" : ""}"><span><b>${i.no}</b>${i.note ? `<small>${L(i.note[0], i.note[1])}</small>` : ""}</span><span>${clientChip(i.client)}</span><span dir="ltr">${i.cur} ${i.amt}</span><span>${{ paid: `<span class="hq-pill hq-pill--ok">${L("Paid", "مدفوعة")}</span>`, due: `<span class="hq-pill hq-pill--warn">${L("Due", "مستحقة")}</span>`, draft: `<span class="hq-pill hq-pill--rev">${L("Draft", "مسودة")}</span>` }[i.st]}</span></div>`).join("")}
      </div>
    </div>
    <p class="hq-hint">${L("Invoices in EGP and SAR, paid through local gateways.", "فواتير بالجنيه والريال، وبتتدفع عن طريق بوابات دفع محلية.")}</p>`;

  /* ---------------- app shell ---------------- */
  function mount(el) {
    const s = initialState();
    let view = el.dataset.view || "home";
    const counts = () => ({ inbox: s.sent ? 3 : 4, approvals: s.assets.filter(a => a.status === "review").length, whatsapp: s.sent ? 0 : 1 });

    let render = function () {
      const c = counts();
      const title = NAV.find(n => n[0] === view);
      el.innerHTML = `
        <div class="hq-win" dir="${ar() ? "rtl" : "ltr"}">
          <div class="hq-top">
            <span class="hq-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="hq-search">${ico("search")}<span>${L("Search tasks, files and chats", "دوّر في التاسكات والملفات والمحادثات")}</span><kbd>⌘K</kbd></span>
            <span class="hq-top__r"><span class="hq-bell">${ico("bell")}${c.inbox ? "<i></i>" : ""}</span><span class="hq-av hq-av--me">YA</span></span>
          </div>
          <div class="hq-body">
            <aside class="hq-side">
              <div class="hq-ws"><span class="hq-ws__logo">YA</span><span><b>${L("Your Agency", "وكالتك")}</b><small>${L("3 clients", "3 عملاء")}</small></span></div>
              <nav class="hq-nav" aria-label="${L("App sections", "أقسام التطبيق")}">
                ${NAV.map(([k, en, a]) => `<button class="hq-nav__b${k === view ? " is-on" : ""}" data-go="${k}" aria-current="${k === view ? "page" : "false"}">${ico(k)}<span>${L(en, a)}</span>${c[k] ? `<em>${c[k]}</em>` : ""}</button>`).join("")}
              </nav>
              <div class="hq-side__h">${L("Clients", "العملاء")}</div>
              ${CLIENTS.map(([k, col]) => `<span class="hq-side__c"><i style="background:${col}"></i>${L("Client", "عميل")} ${k}</span>`).join("")}
            </aside>
            <section class="hq-main">
              <div class="hq-main__h"><h4>${L(title[1], title[2])}</h4><span class="hq-main__sub">${L("Spring Campaign", "حملة الربيع")}</span>
                <button class="hq-btn hq-btn--ghost hq-btn--sm" data-act="new">${ico("plus")} ${L("New", "جديد")}</button></div>
              <div class="hq-view hq-view--${view}">${V[view](s)}</div>
            </section>
          </div>
        </div>`;
    };
    // Static screens: each one shows a meaningful moment of the product, nothing is clickable.
    if (view === "whatsapp") {
      s.chat.push({ me: true, en: "Hero banner v3 is ready for review.", ar: "البانر الرئيسي نسخة 3 جاهز للمراجعة.", time: "10:05" });
      s.chat.push({ me: false, en: "Looks great. Approved.", ar: "حلو جدًا. موافق.", time: "10:09" });
      s.chat.push({ sys: true, en: "Approval synced to Hero banner v3 and logged in the ledger.", ar: "الموافقة اتربطت بالبانر الرئيسي نسخة 3 واتسجلت في السجل.", time: "" });
      s.sent = true;
    }
    if (el.dataset.device === "phone") {
      const tabs = [["home", "Home", "الرئيسية"], ["approvals", "Approvals", "الموافقات"], ["whatsapp", "Chats", "المحادثات"], ["results", "Results", "النتايج"], ["invoices", "Invoices", "الفواتير"]];
      render = () => {
        const title = NAV.find(n => n[0] === view);
        el.innerHTML = `
        <div class="hq-phone" dir="${ar() ? "rtl" : "ltr"}">
          <div class="hq-phone__screen">
            <span class="hq-phone__notch"></span>
            <div class="hq-phone__status"><span>9:41</span><span>5G</span></div>
            <div class="hq-phone__head"><span class="hq-ws__logo">YA</span><div><h4>${L(title[1], title[2])}</h4><small>${L("Client A · Spring Campaign", "عميل A · حملة الربيع")}</small></div></div>
            <div class="hq-phone__body hq-view--${view}">${V[view](s)}</div>
            <div class="hq-phone__tabs">${tabs.map(([k, en, a]) => `<span class="${k === view ? "is-on" : ""}">${ico(k)}${L(en, a)}</span>`).join("")}</div>
          </div>
        </div>`;
      };
    }
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("inert", "");
    render();
    new MutationObserver(() => render()).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  const start = () => document.querySelectorAll("[data-hq-app]").forEach(mount);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
