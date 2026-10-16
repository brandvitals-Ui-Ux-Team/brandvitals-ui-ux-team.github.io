/* ==========================================================================
   BRAND VITALS · Experience Engine v2.0
   Theme (dark/light) · i18n (EN/AR + RTL) · Motion system · Components
   ========================================================================== */
(() => {
  "use strict";

  const doc = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ------------------------------------------------------------------
     THEME — dark default, persisted
  ------------------------------------------------------------------ */
  const Theme = {
    init() {
      // Dark is the brand theme; light is opt-in via the toggle.
      this.set(localStorage.getItem("oso-theme") || doc.dataset.defaultTheme || "dark", false);
      document.querySelectorAll("[data-theme-toggle]").forEach(btn =>
        btn.addEventListener("click", () => this.set(doc.dataset.theme === "dark" ? "light" : "dark", true))
      );
    },
    set(mode, persist) {
      doc.dataset.theme = mode;
      if (persist) localStorage.setItem("oso-theme", mode);
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = getComputedStyle(doc).getPropertyValue("--bg").trim() || (mode === "dark" ? "#05080B" : "#F5F7F9");
    }
  };

  /* ------------------------------------------------------------------
     I18N — EN/AR via data-en / data-ar attributes
  ------------------------------------------------------------------ */
  // Each language has its own URL: English at /page.html, Arabic at /ar/page.html
  // (generated at build time). The toggle moves between the two; the dashboard
  // preview, which renders the source page, still switches in place.
  const I18n = {
    lang: "en",
    // Arabic comes in two settings: Egyptian (/ar/, the default Arabic site) and Saudi (/sa/, a smaller set).
    dialect: "eg",
    SA_PAGES: ["index.html", "performance-marketing.html", "stage.html", "hire.html"],
    inAr() { return /^\/ar(\/|$)/.test(location.pathname); },
    inSa() { return /^\/sa(\/|$)/.test(location.pathname); },
    file() { return location.pathname.replace(/^\/(ar|sa)(?=\/|$)/, "").split("/").pop() || "index.html"; },
    // The same page in another language setting; Saudi falls back to the Saudi home when a page has no Saudi version.
    target(code) {
      const f = this.file(), name = f === "index.html" ? "" : f, q = location.search + location.hash;
      if (code === "en") return "/" + name + q;
      if (code === "ar") return "/ar/" + name + q;
      return "/sa/" + (this.SA_PAGES.includes(f) ? name : "") + q;
    },
    counterpart() { return this.target(this.lang === "en" ? "ar" : "en"); },
    current() { return this.lang === "en" ? "en" : this.dialect === "sa" ? "sa" : "ar"; },
    init() {
      const servedAr = this.inAr() || this.inSa() || /^ar/.test(doc.lang);
      this.dialect = this.inSa() || doc.dataset.dialect === "sa" ? "sa" : "eg";
      this.lang = window.__BV_PREVIEW ? (localStorage.getItem("oso-lang") || "en") : (servedAr ? "ar" : "en");
      this.apply(this.lang);
      const inPlace = () => window.__BV_PREVIEW || !/^https?:$/.test(location.protocol) || doc.dataset.i18n === "inline";
      document.querySelectorAll("[data-lang-toggle]").forEach(btn => {
        // Previews and pages without language twins keep the simple EN / عربي switch, in place.
        if (inPlace()) {
          btn.addEventListener("click", () => {
            const next = this.lang === "en" ? "ar" : "en";
            try { localStorage.setItem("oso-lang", next); } catch (e) { /* ignore */ }
            this.apply(next);
          });
          return;
        }
        this.menu(btn);
      });
    },
    // A small menu under the language button: English · عربي (مصر) · سعودي
    menu(btn) {
      const wrap = document.createElement("span");
      wrap.className = "lang-wrap";
      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
      const list = document.createElement("div");
      list.className = "lang-menu";
      list.id = "langMenu" + Math.random().toString(36).slice(2, 7);
      list.hidden = true;
      [["en", "English", "en"], ["ar", "عربي (مصر)", "ar-EG"], ["sa", "سعودي", "ar-SA"]].forEach(([code, label, hl]) => {
        const a = document.createElement("a");
        a.href = this.target(code);
        a.textContent = label;
        a.lang = hl;
        if (code === this.current()) a.setAttribute("aria-current", "true");
        a.addEventListener("click", () => { try { localStorage.setItem("oso-lang", code === "en" ? "en" : "ar"); localStorage.setItem("bv-dialect", code === "sa" ? "sa" : "eg"); } catch (e) { /* ignore */ } });
        list.appendChild(a);
      });
      wrap.appendChild(list);
      btn.setAttribute("aria-haspopup", "true");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", list.id);
      this.apply(this.lang);
      const set = open => { list.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
      btn.addEventListener("click", e => { e.stopPropagation(); set(list.hidden); if (!list.hidden) list.querySelector("a").focus(); });
      wrap.addEventListener("keydown", e => {
        const items = [...list.querySelectorAll("a")], i = items.indexOf(document.activeElement);
        if (e.key === "Escape") { set(false); btn.focus(); }
        else if (e.key === "ArrowDown" && !list.hidden) { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        else if (e.key === "ArrowUp" && !list.hidden) { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      });
      document.addEventListener("click", e => { if (!wrap.contains(e.target)) set(false); });
      wrap.addEventListener("focusout", e => { if (!wrap.contains(e.relatedTarget)) set(false); });
    },
    apply(lang) {
      this.lang = lang;
      doc.lang = lang === "ar" && this.dialect === "sa" ? "ar-SA" : lang;
      doc.dir = lang === "ar" ? "rtl" : "ltr";
      document.querySelectorAll("[data-en]").forEach(el => {
        const val = el.dataset[lang];
        if (val == null) return;
        if (el.dataset.i18nAttr) el.setAttribute(el.dataset.i18nAttr, val);
        else el.textContent = val;
      });
      document.querySelectorAll("[data-en-ph]").forEach(el => {
        el.placeholder = lang === "ar" ? (el.dataset.arPh || "") : (el.dataset.enPh || "");
      });
      document.querySelectorAll("[data-lang-toggle]").forEach(btn => {
        if (btn.hasAttribute("aria-haspopup")) {
          // menu mode: the button names the current setting and opens the three choices
          btn.textContent = { en: "EN", ar: "عربي", sa: "سعودي" }[this.current()];
          btn.setAttribute("aria-label", lang === "en" ? "Language" : "اللغة");
          return;
        }
        btn.textContent = lang === "en" ? "عربي" : "EN";
        btn.setAttribute("aria-label", lang === "en" ? "التبديل إلى العربية" : "Switch to English");
      });
      document.title = (lang === "ar" && doc.dataset.titleAr) ? doc.dataset.titleAr : (doc.dataset.titleEn || document.title);
    }
  };

  /* ------------------------------------------------------------------
     LOADER — brand ring, then hero choreography
  ------------------------------------------------------------------ */
  const Loader = {
    init() {
      const loader = document.querySelector(".loader");
      const done = () => {
        document.body.classList.add("is-loaded");
        if (loader) loader.classList.add("is-done");
      };
      if (!loader || reduceMotion) { done(); if (loader) loader.style.display = "none"; return; }
      // Full sequence on the first visit of a session, a short one afterwards.
      let quick = false;
      try { quick = sessionStorage.getItem("bv-intro") === "1"; sessionStorage.setItem("bv-intro", "1"); } catch (e) { /* ignore */ }
      if (quick) loader.classList.add("loader--quick");
      const dur = (quick ? 700 : 1600) + 150;
      const pct = loader.querySelector(".loader__pct b");
      let loaded = document.readyState === "complete";
      let finished = false;
      window.addEventListener("load", () => { loaded = true; }, { once: true });
      const finish = () => {
        if (finished) return;
        finished = true;
        if (pct) pct.textContent = "100";
        // Pulse flatlines into one bright line, then the screen splits open along it.
        loader.classList.add("is-flat");
        setTimeout(() => {
          done();
          setTimeout(() => { loader.style.display = "none"; }, 1200);
        }, quick ? 240 : 420);
      };
      const t0 = performance.now();
      const tick = now => {
        if (finished) return;
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        if (pct) pct.textContent = Math.round(e * (loaded ? 100 : 94));
        if (p >= 1 && loaded) { finish(); return; }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      setTimeout(finish, quick ? 1600 : 3400); // hard cap so slow assets never trap the visitor
    }
  };

  /* ------------------------------------------------------------------
     NAV — glass on scroll, hide on scroll down, drawer, active link
  ------------------------------------------------------------------ */
  const Nav = {
    init() {
      const nav = document.querySelector(".nav");
      if (!nav) return;
      const onScroll = () => {
        const y = window.scrollY;
        // Keep the nav pinned and visible while scrolling (glass style once past the top).
        nav.classList.toggle("is-scrolled", y > 24);
        nav.classList.remove("is-hidden");
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      const burger = document.querySelector(".nav__burger");
      const drawer = document.querySelector(".drawer");
      if (burger && drawer) {
        burger.addEventListener("click", () => {
          const open = drawer.classList.toggle("is-open");
          burger.classList.toggle("is-open", open);
          burger.setAttribute("aria-expanded", open);
          document.body.classList.toggle("drawer-open", open);
          document.body.style.overflow = open ? "hidden" : "";
        });
        drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
          drawer.classList.remove("is-open");
          burger.classList.remove("is-open");
          document.body.classList.remove("drawer-open");
          document.body.style.overflow = "";
        }));
      }

      // Active link
      const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      document.querySelectorAll(".nav__link, .drawer__link").forEach(a => {
        const href = (a.getAttribute("href") || "").toLowerCase();
        if (href === here) a.classList.add("is-active");
      });
    }
  };

  /* ------------------------------------------------------------------
     SCROLL PROGRESS + BACK TO TOP
  ------------------------------------------------------------------ */
  const Progress = {
    init() {
      const bar = document.querySelector(".progress");
      const top = document.querySelector(".to-top");
      const onScroll = () => {
        const h = doc.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
        if (top) top.classList.toggle("is-visible", window.scrollY > 900);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      if (top) top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
    }
  };

  /* ------------------------------------------------------------------
     REVEAL — IntersectionObserver
  ------------------------------------------------------------------ */
  const Reveal = {
    init() {
      const els = document.querySelectorAll("[data-reveal]");
      if (!els.length) return;
      if (reduceMotion) { els.forEach(el => el.classList.add("is-inview")); return; }
      // On phones, reveal before the content scrolls in, so a fast scroll never shows empty bands.
      const small = window.matchMedia("(max-width: 767px)").matches;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("is-inview"); io.unobserve(e.target); }
        });
      }, small ? { threshold: 0.01, rootMargin: "0px 0px 20% 0px" } : { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      els.forEach(el => io.observe(el));
    }
  };

  /* ------------------------------------------------------------------
     COUNTERS — [data-count] count-up on view
  ------------------------------------------------------------------ */
  const Counters = {
    init() {
      const els = document.querySelectorAll("[data-count]");
      if (!els.length) return;
      const run = el => {
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        const dur = 1800;
        const t0 = performance.now();
        const step = now => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = (target * eased).toFixed(decimals);
          if (p < 1) requestAnimationFrame(step);
        };
        if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
        requestAnimationFrame(step);
      };
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.5 });
      els.forEach(el => io.observe(el));
    }
  };

  /* ------------------------------------------------------------------
     SIGNAL LINES — draw when visible
  ------------------------------------------------------------------ */
  const Signals = {
    init() {
      const sigs = document.querySelectorAll(".signal[data-draw]");
      if (!sigs.length) return;
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("sig-draw"); io.unobserve(e.target); } });
      }, { threshold: 0.3 });
      sigs.forEach(s => io.observe(s));
    }
  };

  /* ------------------------------------------------------------------
     MAGNETIC BUTTONS
  ------------------------------------------------------------------ */
  const Magnetic = {
    init() {
      if (!finePointer || reduceMotion) return;
      document.querySelectorAll("[data-magnetic]").forEach(el => {
        const strength = 0.18;
        el.addEventListener("mousemove", e => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * strength;
          const y = (e.clientY - r.top - r.height / 2) * strength;
          el.style.transform = `translate(${x}px, ${y}px)`;
        });
        el.addEventListener("mouseleave", () => {
          el.style.transition = "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)";
          el.style.transform = "";
          setTimeout(() => (el.style.transition = ""), 600);
        });
      });
    }
  };

  /* ------------------------------------------------------------------
     RIPPLE
  ------------------------------------------------------------------ */
  const Ripple = {
    init() {
      document.addEventListener("click", e => {
        const btn = e.target.closest(".btn--primary, .btn--dark");
        if (!btn || reduceMotion) return;
        const r = btn.getBoundingClientRect();
        const d = Math.max(r.width, r.height);
        const span = document.createElement("span");
        span.className = "ripple";
        span.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
        btn.appendChild(span);
        setTimeout(() => span.remove(), 700);
      });
    }
  };

  /* ------------------------------------------------------------------
     SPOTLIGHT — cursor-following glow on [data-tilt] cards (no 3D tilt)
  ------------------------------------------------------------------ */
  const Tilt = {
    init() {
      if (!finePointer || reduceMotion) return;
      document.querySelectorAll("[data-tilt]").forEach(card => {
        card.addEventListener("mousemove", e => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
          card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
        });
      });
    }
  };

  /* ------------------------------------------------------------------
     PARALLAX ORBS
  ------------------------------------------------------------------ */
  const Parallax = {
    init() {
      if (reduceMotion) return;
      const orbs = document.querySelectorAll(".orb[data-parallax]");
      if (!orbs.length) return;
      let ticking = false;
      window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          orbs.forEach(o => {
            const speed = parseFloat(o.dataset.parallax) || 0.1;
            o.style.transform = `translateY(${y * speed}px)`;
          });
          ticking = false;
        });
      }, { passive: true });
    }
  };

  /* ------------------------------------------------------------------
     ACCORDION
  ------------------------------------------------------------------ */
  const Accordion = {
    init() {
      document.querySelectorAll(".acc").forEach(acc => {
        acc.querySelectorAll(".acc-item__btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const item = btn.closest(".acc-item");
            const wasOpen = item.classList.contains("is-open");
            acc.querySelectorAll(".acc-item.is-open").forEach(i => {
              i.classList.remove("is-open");
              i.querySelector(".acc-item__btn").setAttribute("aria-expanded", "false");
            });
            if (!wasOpen) {
              item.classList.add("is-open");
              btn.setAttribute("aria-expanded", "true");
            }
          });
        });
      });
    }
  };

  /* ------------------------------------------------------------------
     TABS / FILTER
  ------------------------------------------------------------------ */
  const Filter = {
    init() {
      document.querySelectorAll("[data-filter-group]").forEach(group => {
        const tabs = group.querySelectorAll(".tab");
        const targetSel = group.dataset.filterTarget;
        const items = targetSel ? document.querySelectorAll(targetSel + " [data-cat]") : [];
        tabs.forEach(tab => {
          tab.addEventListener("click", () => {
            tabs.forEach(t => { t.classList.remove("is-active"); t.setAttribute("aria-selected", "false"); });
            tab.classList.add("is-active");
            tab.setAttribute("aria-selected", "true");
            const cat = tab.dataset.cat;
            items.forEach(item => {
              const show = cat === "all" || (item.dataset.cat || "").split(" ").includes(cat);
              item.classList.toggle("is-hidden", !show);
            });
          });
        });
      });
    }
  };

  /* ------------------------------------------------------------------
     FORMS — validate + simulated submit with loading/success states
  ------------------------------------------------------------------ */
  const Forms = {
    init() {
      document.querySelectorAll("form[data-validate]").forEach(form => {
        form.addEventListener("submit", e => {
          e.preventDefault();
          let valid = true;
          form.querySelectorAll("[required]").forEach(input => {
            const field = input.closest(".field");
            const bad = !input.value.trim() ||
              (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
            if (field) field.classList.toggle("is-error", bad);
            if (bad) valid = false;
          });
          if (!valid) return;
          const btn = form.querySelector('button[type="submit"]');
          const data = Forms.collect(form);
          // The visitor stays on the page: the result always appears as a popup notification.
          const succeed = () => {
            if (btn) btn.classList.remove("is-loading");
            if (form.closest("#consultModal")) ConsultModal.close();
            form.reset();
            Forms.successNotice(form);
            Analytics.event("generate_lead", { form: data.form, service: data.service || "" });
          };
          // Bots fill the hidden honeypot field; the dashboard preview never sends anything.
          if (data.website || window.__BV_PREVIEW) { succeed(); return; }
          // Forms marked data-wa-direct (Vitals Forecast) also open WhatsApp with everything prefilled.
          const direct = form.hasAttribute("data-wa-direct");
          if (direct) window.open(Forms.waLink(data), "_blank", "noopener");
          if (!Track.configured()) {
            if (direct) { succeed(); return; }
            // No database connected yet: offer to send the request on WhatsApp, from the popup.
            if (form.closest("#consultModal")) ConsultModal.close();
            Forms.whatsappNotice(form, data);
            return;
          }
          if (btn) btn.classList.add("is-loading");
          Track.lead(data).then(succeed).catch(() => {
            if (btn) btn.classList.remove("is-loading");
            Forms.errorNotice(data);
          });
        });
        form.querySelectorAll("input, select, textarea").forEach(input => {
          input.addEventListener("input", () => {
            const field = input.closest(".field");
            if (field) field.classList.remove("is-error");
          });
        });
      });
    },
    // Select values are stored with their English label so the dashboard reads them the same way.
    label(form, name) {
      const sel = form.querySelector('select[name="' + name + '"]');
      if (!sel || !sel.value) return "";
      const opt = sel.options[sel.selectedIndex];
      return (opt.getAttribute("data-en") || opt.textContent || sel.value).trim();
    },
    collect(form) {
      const fd = new FormData(form);
      const get = k => String(fd.get(k) || "").trim();
      // Any extra fields (event date, city, guests…) travel inside the message as "Label: value" lines.
      const known = ["name", "email", "phone", "company", "interest", "budget", "message", "website"];
      const extra = [];
      form.querySelectorAll("input[name], select[name], textarea[name]").forEach(el => {
        if ((el.type === "radio" || el.type === "checkbox") && !el.checked) return;
        if (known.includes(el.name) || !String(el.value).trim()) return;
        if (el.type === "radio") {
          const q = el.closest("fieldset") && el.closest("fieldset").querySelector("legend");
          const opt = el.closest("label") && el.closest("label").querySelector("[data-en]");
          extra.push(((q && q.getAttribute("data-en")) || el.name) + ": " + ((opt && opt.getAttribute("data-en")) || el.value));
          return;
        }
        const lab = el.id && form.querySelector('label[for="' + el.id + '"]');
        const label = ((lab && (lab.getAttribute("data-en") || lab.textContent)) || el.name).replace(/\s*\*\s*$/, "").trim();
        extra.push(label + ": " + (el.tagName === "SELECT" ? Forms.label(form, el.name) : String(el.value).trim()));
      });
      const msg = get("message");
      return {
        name: get("name"), email: get("email"), phone: get("phone"), company: get("company"),
        service: Forms.label(form, "interest"), budget: Forms.label(form, "budget"),
        message: extra.length ? extra.join("\n") + (msg ? "\n\n" + msg : "") : msg,
        website: get("website"), form: form.dataset.form || (form.closest("#consultModal") ? "consult" : "contact"),
        // Sub-brand forms open WhatsApp with their own first line ("Hi Vitals Frames, …").
        intro: (I18n.lang === "ar" ? form.dataset.waAr : form.dataset.waEn) || ""
      };
    },
    waNumber() {
      const a = document.querySelector('a[href*="wa.me/"]');
      const m = a && a.getAttribute("href").match(/wa\.me\/(\d+)/);
      return m ? m[1] : "201090861397";
    },
    waLink(d) {
      const ar = I18n.lang === "ar";
      const rows = [
        d.intro || (ar ? "طلب جديد من الموقع" : "New inquiry from the website"),
        (ar ? "الاسم: " : "Name: ") + d.name,
        d.company && (ar ? "الشركة: " : "Company: ") + d.company,
        d.email && (ar ? "البريد: " : "Email: ") + d.email,
        d.phone && (ar ? "الهاتف: " : "Phone: ") + d.phone,
        d.service && (ar ? "الخدمة: " : "Service: ") + d.service,
        d.budget && (ar ? "الميزانية: " : "Budget: ") + d.budget,
        d.message && (ar ? "الرسالة: " : "Message: ") + d.message
      ].filter(Boolean);
      return "https://wa.me/" + Forms.waNumber() + "?text=" + encodeURIComponent(rows.join("\n"));
    },
    // Reads the current-language text of an element from the page (so the dashboard can edit it).
    textOf(el) {
      if (!el) return "";
      const v = el.getAttribute("data-" + I18n.lang);
      return (v != null ? v : el.textContent).trim();
    },
    successNotice(form) {
      const ar = I18n.lang === "ar";
      const ok = form.dataset.success ? document.querySelector(form.dataset.success) : null;
      Notice.show({
        kind: "ok",
        title: Forms.textOf(ok && ok.querySelector("h3")) || (ar ? "استلمنا طلبك." : "Request received."),
        text: Forms.textOf(ok && ok.querySelector("p")) || (ar ? "سنتواصل معك خلال يوم عمل واحد." : "We'll reach out within one business day."),
        actions: [
          { label: ar ? "حسنًا" : "Done", primary: true },
          { label: ar ? "تحدّث معنا على واتساب" : "Chat on WhatsApp", href: "https://wa.me/" + Forms.waNumber() }
        ]
      });
    },
    whatsappNotice(form, d) {
      const ar = I18n.lang === "ar";
      Notice.show({
        kind: "wa",
        title: ar ? "خطوة أخيرة" : "One last step",
        text: ar ? "طلبك جاهز. أرسله عبر واتساب وسيرد عليك فريقنا مباشرة." : "Your request is ready. Send it on WhatsApp and our team will reply right away.",
        actions: [
          { label: ar ? "أرسل عبر واتساب" : "Send on WhatsApp", primary: true, href: Forms.waLink(d), onClick: () => { Analytics.event("generate_lead", { form: d.form, channel: "whatsapp" }); setTimeout(() => { form.reset(); Forms.successNotice(form); }, 500); } },
          { label: ar ? "إلغاء" : "Cancel" }
        ]
      });
    },
    errorNotice(d) {
      const ar = I18n.lang === "ar";
      Notice.show({
        kind: "err",
        title: ar ? "تعذّر الإرسال الآن" : "We couldn't send that",
        text: ar ? "حاول مرة أخرى بعد قليل، أو أرسل طلبك عبر واتساب." : "Please try again in a moment, or send your request on WhatsApp.",
        actions: [
          { label: ar ? "أرسل عبر واتساب" : "Send on WhatsApp", primary: true, href: Forms.waLink(d) },
          { label: ar ? "حاول مرة أخرى" : "Try again" }
        ]
      });
    }
  };

  /* ------------------------------------------------------------------
     NOTICE — popup notification shown after a form is sent
  ------------------------------------------------------------------ */
  const Notice = {
    el: null,
    last: null,
    icons: {
      ok: '<svg viewBox="0 0 46 32"><path pathLength="100" d="M1 18h7l3-6 4 12 3-6h4l5 5L43 7"/></svg>',
      wa: '<svg viewBox="0 0 46 32"><path pathLength="100" d="M34 15.5a11 11 0 0 1-16.8 9.4L11 27l1.9-6A11 11 0 1 1 34 15.5z"/></svg>',
      err: '<svg viewBox="0 0 46 32"><path pathLength="100" d="M23 6v13M23 25.5v.5"/></svg>'
    },
    build() {
      if (this.el) return this.el;
      const el = document.createElement("div");
      el.className = "modal-backdrop";
      el.id = "bvNotice";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-modal", "true");
      el.setAttribute("aria-labelledby", "bvNoticeTitle");
      el.innerHTML = '<div class="modal modal--notice" role="document">' +
        '<button class="modal__close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<div class="notice__mark" aria-hidden="true"></div><h3 id="bvNoticeTitle"></h3><p class="notice__text" role="status"></p><div class="notice__actions"></div></div>';
      document.body.appendChild(el);
      el.querySelector(".modal__close").addEventListener("click", () => this.close());
      el.addEventListener("click", e => { if (e.target === el) this.close(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && el.classList.contains("is-open")) this.close(); });
      this.el = el;
      return el;
    },
    show({ kind = "ok", title, text, actions = [] }) {
      const el = this.build();
      if (!el.classList.contains("is-open")) this.last = document.activeElement;
      el.classList.remove("is-open");
      el.classList.toggle("notice--error", kind === "err");
      el.querySelector(".notice__mark").innerHTML = this.icons[kind] || this.icons.ok;
      el.querySelector("h3").textContent = title;
      el.querySelector(".notice__text").textContent = text;
      const box = el.querySelector(".notice__actions");
      box.replaceChildren();
      actions.forEach(a => {
        const b = document.createElement(a.href ? "a" : "button");
        b.className = "btn " + (a.primary ? "btn--primary" : "btn--ghost");
        if (a.href) { b.href = a.href; b.target = "_blank"; b.rel = "noopener"; } else b.type = "button";
        const s = document.createElement("span");
        s.textContent = a.label;
        b.appendChild(s);
        b.addEventListener("click", () => { if (a.onClick) a.onClick(); else if (!a.href) this.close(); });
        box.appendChild(b);
      });
      void el.offsetWidth; // restart the icon animation
      el.classList.add("is-open");
      document.body.classList.add("modal-open");
      setTimeout(() => { const f = box.querySelector(".btn--primary") || box.querySelector(".btn"); if (f) f.focus({ preventScroll: true }); }, 350);
    },
    close() {
      if (!this.el || !this.el.classList.contains("is-open")) return;
      this.el.classList.remove("is-open");
      if (!document.querySelector(".modal-backdrop.is-open")) document.body.classList.remove("modal-open");
      if (this.last && this.last.focus) { try { this.last.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    }
  };

  /* ------------------------------------------------------------------
     TRACK — privacy-friendly visit counter + lead storage (Supabase).
     Configured from the dashboard; does nothing until a URL and key exist.
     No cookies: an anonymous random ID in localStorage counts unique visitors.
  ------------------------------------------------------------------ */
  /* @cms-backend-start */
  const BACKEND = {"url":"","key":""};
  /* @cms-backend-end */
  const Track = {
    configured() { return !!(BACKEND.url && BACKEND.key) && !window.__BV_PREVIEW; },
    trackable() {
      if (!this.configured()) return false;
      if (!/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(location.hostname)) return false;
      if (navigator.webdriver || navigator.doNotTrack === "1" || window.doNotTrack === "1") return false;
      try { if (localStorage.getItem("bv-no-track") === "1") return false; } catch (e) { /* ignore */ }
      return true;
    },
    send(table, row) {
      const headers = { apikey: BACKEND.key, "Content-Type": "application/json", Prefer: "return=minimal" };
      if (/^eyJ/.test(BACKEND.key)) headers.Authorization = "Bearer " + BACKEND.key;
      return fetch(BACKEND.url.replace(/\/+$/, "") + "/rest/v1/" + table, {
        method: "POST", headers, body: JSON.stringify(row), keepalive: true, credentials: "omit"
      }).then(r => { if (!r.ok) throw new Error("HTTP " + r.status); });
    },
    uid() { return window.crypto && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2); },
    visitor() {
      try {
        let id = localStorage.getItem("bv-vid"), fresh = false;
        if (!id) { id = this.uid(); localStorage.setItem("bv-vid", id); fresh = true; }
        return { id, fresh };
      } catch (e) { return { id: "", fresh: false }; }
    },
    session() {
      try { let s = sessionStorage.getItem("bv-sid"); if (!s) { s = this.uid(); sessionStorage.setItem("bv-sid", s); } return s; }
      catch (e) { return ""; }
    },
    // First touch of the visit: external referrer host and UTM tags.
    source() {
      try { const saved = sessionStorage.getItem("bv-src"); if (saved) return JSON.parse(saved); } catch (e) { /* ignore */ }
      const q = new URLSearchParams(location.search);
      let ref = "";
      try { if (document.referrer) { const u = new URL(document.referrer); if (u.host !== location.host) ref = u.host.replace(/^www\./, ""); } } catch (e) { /* ignore */ }
      const cut = (v, n) => String(v || "").slice(0, n);
      const src = { referrer: cut(ref, 300), utm_source: cut(q.get("utm_source"), 120), utm_medium: cut(q.get("utm_medium"), 120), utm_campaign: cut(q.get("utm_campaign"), 160) };
      try { sessionStorage.setItem("bv-src", JSON.stringify(src)); } catch (e) { /* ignore */ }
      return src;
    },
    page() {
      let p = "";
      try { p = decodeURIComponent(location.pathname.split("/").pop() || ""); } catch (e) { /* ignore */ }
      p = p || "index.html";
      if (!/\.html?$/i.test(p)) p += ".html";
      return p.slice(0, 300);
    },
    pageview() {
      if (!this.trackable()) return;
      const v = this.visitor(), w = window.innerWidth;
      let tz = "";
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) { /* ignore */ }
      this.send("bv_pageviews", Object.assign({
        path: this.page(), title: document.title.slice(0, 300), visitor: v.id, session: this.session(), is_new: v.fresh,
        lang: doc.lang || "en", device: w < 768 ? "mobile" : w < 1100 ? "tablet" : "desktop", tz: tz.slice(0, 64)
      }, this.source())).catch(() => { /* never block the page */ });
    },
    lead(d) {
      const cut = (v, n) => String(v || "").slice(0, n);
      return this.send("bv_leads", Object.assign({
        name: cut(d.name, 200), email: cut(d.email, 200), phone: cut(d.phone, 60), company: cut(d.company, 200),
        service: cut(d.service, 120), budget: cut(d.budget, 120), message: cut(d.message, 5000), form: d.form,
        page: this.page(), lang: doc.lang || "en", visitor: this.visitor().id
      }, this.source()));
    }
  };

  /* ------------------------------------------------------------------
     ANALYTICS — GA4 / GTM / Meta Pixel / Microsoft Clarity.
     IDs are set from the dashboard (Settings → Analytics). Nothing loads
     until an ID exists. Google Consent Mode v2 starts "denied"; the Meta
     Pixel and Clarity only load after the visitor accepts.
  ------------------------------------------------------------------ */
  /* @cms-analytics-start */
  const ANALYTICS = {"ga4":"","gtm":"","metaPixel":"","clarity":""};
  /* @cms-analytics-end */
  const Analytics = {
    KEY: "bv-consent",
    any() { return !!(ANALYTICS.ga4 || ANALYTICS.gtm || ANALYTICS.metaPixel || ANALYTICS.clarity) && !window.__BV_PREVIEW; },
    choice() { try { return localStorage.getItem(this.KEY); } catch (e) { return null; } },
    script(src) { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); },
    init() {
      if (!this.any()) return;
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      const granted = this.choice() === "granted";
      gtag("consent", "default", {
        ad_storage: granted ? "granted" : "denied", ad_user_data: granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied", analytics_storage: granted ? "granted" : "denied", wait_for_update: 500
      });
      if (ANALYTICS.gtm) {
        window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
        this.script("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(ANALYTICS.gtm));
      }
      if (ANALYTICS.ga4) {
        this.script("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ANALYTICS.ga4));
        gtag("js", new Date());
        gtag("config", ANALYTICS.ga4, { page_path: location.pathname, language: doc.lang });
      }
      if (granted) this.loadConsented();
      else if (this.choice() !== "denied") this.banner();
    },
    loadConsented() {
      if (this.consentLoaded) return;
      this.consentLoaded = true;
      if (ANALYTICS.metaPixel) {
        /* Meta Pixel base code */
        !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        window.fbq("init", ANALYTICS.metaPixel);
        window.fbq("track", "PageView");
      }
      if (ANALYTICS.clarity) {
        (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, "clarity", "script", ANALYTICS.clarity);
      }
    },
    set(v) {
      try { localStorage.setItem(this.KEY, v); } catch (e) { /* ignore */ }
      if (v === "granted") {
        gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted", analytics_storage: "granted" });
        this.loadConsented();
      }
      const b = document.getElementById("bvConsent");
      if (b) b.remove();
    },
    banner() {
      const ar = doc.lang === "ar";
      const el = document.createElement("div");
      el.id = "bvConsent";
      el.className = "consent";
      el.setAttribute("role", "dialog");
      el.setAttribute("aria-label", ar ? "ملفات تعريف الارتباط" : "Cookies");
      el.innerHTML = '<p>' + (ar ? "بنستخدم ملفات تعريف الارتباط لقياس أداء الموقع وتحسين إعلاناتنا. تقدر ترفض وكل حاجة هتشتغل عادي." : "We use cookies to measure the site and improve our ads. You can decline and everything still works.") +
        ' <a href="' + (ar ? "privacy.html" : "privacy.html") + '">' + (ar ? "سياسة الخصوصية" : "Privacy policy") + "</a></p>" +
        '<div class="consent__btns"><button type="button" class="btn btn--ghost btn--sm" data-c="denied">' + (ar ? "رفض" : "Decline") + "</button>" +
        '<button type="button" class="btn btn--primary btn--sm" data-c="granted">' + (ar ? "موافق" : "Accept") + "</button></div>";
      el.addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (b) this.set(b.dataset.c); });
      document.body.appendChild(el);
    },
    // Conversion events used by forms, WhatsApp buttons and the Vitals Score tool.
    event(name, params) {
      if (!this.any()) return;
      try {
        if (window.gtag) gtag("event", name, params || {});
        if (window.dataLayer) window.dataLayer.push(Object.assign({ event: name }, params || {}));
        if (window.fbq) {
          const map = { generate_lead: "Lead", contact: "Contact", vitals_score: "CompleteRegistration", sign_up: "CompleteRegistration" };
          if (map[name]) window.fbq("track", map[name], params || {});
        }
      } catch (e) { /* never block the page */ }
    }
  };
  window.BVAnalytics = Analytics;

  /* ------------------------------------------------------------------
     WHATSAPP — floating chat button, always in view while scrolling
  ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------
     ECOSYSTEM — nav dropdown (mouse, touch, keyboard) + drawer accordion
  ------------------------------------------------------------------ */
  const Ecosystem = {
    init() {
      const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      const subPage = /^(studio|web|events|approve)(\.html)?$/.test(here);
      document.querySelectorAll(".eco-item").forEach(a => {
        const href = (a.getAttribute("href") || "").toLowerCase();
        if (href === here || href === here + ".html") a.setAttribute("aria-current", "page");
      });
      document.querySelectorAll("[data-eco]").forEach(item => {
        const btn = item.querySelector(".nav__trigger");
        const menu = item.querySelector(".eco-menu");
        if (!btn || !menu) return;
        const links = () => [...menu.querySelectorAll(".eco-item")];
        const isOpen = () => item.classList.contains("is-open");
        const set = open => { item.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", String(open)); };
        const focusAt = i => { const l = links(); if (l.length) l[(i + l.length) % l.length].focus(); };
        btn.addEventListener("click", () => set(!isOpen()));
        btn.addEventListener("keydown", e => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            set(true);
            focusAt(e.key === "ArrowDown" ? 0 : -1);
          } else if (e.key === "Escape" && isOpen()) set(false);
        });
        menu.addEventListener("keydown", e => {
          const i = links().indexOf(document.activeElement);
          if (e.key === "ArrowDown") { e.preventDefault(); focusAt(i + 1); }
          else if (e.key === "ArrowUp") { e.preventDefault(); focusAt(i - 1); }
          else if (e.key === "Home") { e.preventDefault(); focusAt(0); }
          else if (e.key === "End") { e.preventDefault(); focusAt(-1); }
          else if (e.key === "Escape") { e.preventDefault(); set(false); btn.focus(); }
        });
        item.addEventListener("focusout", e => { if (!item.contains(e.relatedTarget)) set(false); });
        document.addEventListener("click", e => { if (isOpen() && !item.contains(e.target)) set(false); });
        if (finePointer) {
          let timer;
          item.addEventListener("mouseenter", () => { clearTimeout(timer); set(true); });
          item.addEventListener("mouseleave", () => { timer = setTimeout(() => set(false), 160); });
        }
      });
      document.querySelectorAll(".drawer__toggle").forEach(tg => {
        const sub = document.getElementById(tg.getAttribute("aria-controls"));
        if (!sub) return;
        const set = open => { tg.setAttribute("aria-expanded", String(open)); sub.hidden = !open; };
        tg.addEventListener("click", () => set(tg.getAttribute("aria-expanded") !== "true"));
      });
    }
  };

  /* ------------------------------------------------------------------
     WHATSAPP CTAS — [data-wa-en] links open a chat with a prefilled line
     in the visitor's language (e.g. "Hi Vitals Web, …")
  ------------------------------------------------------------------ */
  const WaLinks = {
    init() {
      document.querySelectorAll("[data-wa-en]").forEach(a => {
        const go = () => {
          const text = I18n.lang === "ar" ? (a.dataset.waAr || a.dataset.waEn) : a.dataset.waEn;
          a.href = "https://wa.me/" + Forms.waNumber() + "?text=" + encodeURIComponent(text);
        };
        a.target = "_blank";
        a.rel = "noopener";
        a.addEventListener("click", () => { go(); Analytics.event("contact", { channel: "whatsapp" }); });
        go();
      });
    }
  };

  /* ------------------------------------------------------------------
     VITALS WEB PACKAGES — the single source for the package cards on
     web.html. Edit names, timelines, revision rounds and inclusions here.
  ------------------------------------------------------------------ */
  const WEB_PACKAGES = [
    {
      id: "launch",
      name: { en: "Launch", ar: "لانش" },
      kind: { en: "Single landing page", ar: "صفحة هبوط واحدة" },
      for: { en: "For a product, campaign or service that needs to go live now.", ar: "لمنتج أو حملة أو خدمة محتاجة تنزل دلوقتي." },
      weeks: { en: "2 weeks", ar: "أسبوعين" },
      price: { en: "Starting from EGP 25,000", ar: "تبدأ من 25,000 جنيه" },
      revisions: { en: "2 revision rounds", ar: "جولتين تعديل" },
      includes: [
        ["One conversion-focused landing page", "صفحة هبوط واحدة مبنية على التحويل"],
        ["Copy structure and section design", "هيكلة الكلام وتصميم الأقسام"],
        ["Lead form connected to WhatsApp and email", "فورم عملاء مربوط بواتساب والإيميل"],
        ["Analytics and conversion tracking", "تحليلات وتتبع للتحويلات"],
        ["Launch and post-launch support", "إطلاق ودعم بعد الإطلاق"]
      ]
    },
    {
      id: "business",
      name: { en: "Business", ar: "بيزنس" },
      kind: { en: "Multi-page company site", ar: "موقع شركة متعدد الصفحات" },
      for: { en: "For companies that need a credible home for their brand and services.", ar: "للشركات اللي محتاجة بيت رقمي يليق بالبراند والخدمات." },
      weeks: { en: "4 weeks", ar: "4 أسابيع" },
      price: { en: "Starting from EGP 60,000", ar: "تبدأ من 60,000 جنيه" },
      revisions: { en: "3 revision rounds", ar: "3 جولات تعديل" },
      featured: true,
      includes: [
        ["Core pages: home, about, services, work, contact", "الصفحات الأساسية: الرئيسية، من نحن، الخدمات، الأعمال، التواصل"],
        ["Page templates you can reuse and extend", "قوالب صفحات تقدر تكررها وتزود عليها"],
        ["Content editing without a developer", "تعديل المحتوى من غير مطوّر"],
        ["SEO foundations on every page", "أساسيات السيو في كل صفحة"],
        ["Forms, WhatsApp and tracking wired in", "فورمز وواتساب وتتبع متركبين"]
      ]
    },
    {
      id: "commerce",
      name: { en: "Commerce", ar: "كوميرس" },
      kind: { en: "Online store", ar: "متجر إلكتروني" },
      for: { en: "For brands ready to sell online with local payments and shipping.", ar: "للبراندز الجاهزة تبيع أونلاين بدفع وشحن محلي." },
      weeks: { en: "6 weeks", ar: "6 أسابيع" },
      price: { en: "Starting from EGP 90,000", ar: "تبدأ من 90,000 جنيه" },
      note: { en: "Built on Salla, Zid or Shopify, set up and tracked by us.", ar: "على سلة أو زد أو Shopify، واحنا بنجهزه ونربط التتبع." },
      revisions: { en: "3 revision rounds", ar: "3 جولات تعديل" },
      includes: [
        ["Catalog, cart and checkout", "كتالوج وسلة ودفع"],
        ["Local payment gateways and shipping options", "بوابات دفع محلية وخيارات شحن"],
        ["Product and category pages in Arabic and English", "صفحات منتجات وأقسام بالعربي والإنجليزي"],
        ["E-commerce event tracking for ads", "تتبع أحداث المتجر للإعلانات"],
        ["Training to manage products and orders", "تدريب على إدارة المنتجات والطلبات"]
      ]
    }
  ];
  const WebPackages = {
    init() {
      const host = document.querySelector("[data-web-packages]");
      if (!host) return;
      const esc = v => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
      const bi = (o, cls, tag) => "<" + tag + ' class="' + cls + '" data-en="' + esc(o.en) + '" data-ar="' + esc(o.ar) + '">' + esc(o.en) + "</" + tag + ">";
      // The cards ship as static HTML in web.html (for search engines); only render them if the page has none.
      if (!host.children.length) host.innerHTML = WEB_PACKAGES.map((p, i) =>
        '<article class="pkg' + (p.featured ? " pkg--featured" : "") + '" data-reveal style="--rd:' + (i * 0.08) + 's">' +
          '<div class="pkg__top"><span class="pkg__code" dir="ltr">&lt;' + esc(p.id) + "/&gt;</span>" +
          (p.featured ? '<span class="pkg__flag" data-en="Most chosen" data-ar="الأكثر طلبًا">Most chosen</span>' : "") + "</div>" +
          '<div class="pkg__wire pkg__wire--' + esc(p.id) + '" aria-hidden="true">' + Portfolio.wire(p.id) + "</div>" +
          bi(p.name, "pkg__name", "h3") + bi(p.kind, "pkg__kind", "span") + bi(p.for, "pkg__for", "p") +
          '<dl class="pkg__facts"><div><dt data-en="Delivery" data-ar="التسليم">Delivery</dt>' + bi(p.weeks, "pkg__v", "dd") + "</div>" +
          '<div><dt data-en="Revisions" data-ar="التعديلات">Revisions</dt>' + bi(p.revisions, "pkg__v", "dd") + "</div></dl>" +
          '<ul class="pkg__list">' + p.includes.map(([en, ar]) => '<li data-en="' + esc(en) + '" data-ar="' + esc(ar) + '">' + esc(en) + "</li>").join("") + "</ul>" +
          (p.note ? bi(p.note, "pkg__note", "p") : "") +
          '<div class="pkg__price">' + (p.price ? bi(p.price, "pkg__pricev", "span") : '<span data-en="Tailored quote" data-ar="سعر حسب المشروع">Tailored quote</span>') + "</div>" +
          '<a class="btn ' + (p.featured ? "btn--primary" : "btn--ghost") + ' pkg__cta" href="#brief" data-package="' + esc(p.id) + '">' +
            '<span data-en="Choose ' + esc(p.name.en) + '" data-ar="اختار ' + esc(p.name.ar) + '">Choose ' + esc(p.name.en) + "</span></a>" +
        "</article>").join("");
      // "Choose" preselects that package in the brief form.
      host.addEventListener("click", e => {
        const a = e.target.closest("[data-package]");
        const sel = document.querySelector('#brief select[name="interest"]');
        if (a && sel) sel.value = a.dataset.package;
      });
    }
  };

  /* ------------------------------------------------------------------
     WIREFRAMES — proof sections waiting for real work stay hidden; ?wireframe=1 shows them.
  ------------------------------------------------------------------ */
  const Wireframes = {
    init() {
      if (new URLSearchParams(location.search).get("wireframe") !== "1") return;
      document.querySelectorAll("[data-wireframe]").forEach(el => el.removeAttribute("hidden"));
    }
  };

  /* ------------------------------------------------------------------
     CYCLE — [data-cycle] shows its screens in turn every 4 s (each
     screen group keeps one img.is-on). Still under reduced motion,
     paused while off screen or in a background tab.
  ------------------------------------------------------------------ */
  const Cycle = {
    init() {
      document.querySelectorAll("[data-cycle]").forEach(box => {
        if (reduceMotion) return;
        const groups = [...box.querySelectorAll(".bh-laptop__screen, .bh-phone__screen")].map(g => [...g.querySelectorAll("img")]);
        const n = Math.min(...groups.map(g => g.length));
        if (!(n > 1)) return;
        let i = 0, seen = false;
        new IntersectionObserver(es => { seen = es[0].isIntersecting; }).observe(box);
        setInterval(() => {
          if (!seen || document.hidden) return;
          i = (i + 1) % n;
          groups.forEach(g => g.forEach((img, k) => img.classList.toggle("is-on", k === i)));
        }, 4000);
      });
    }
  };


  /* ------------------------------------------------------------------
     MOBILE BAR — under 768 px, a sticky bottom bar with the page's
     primary CTA and a WhatsApp button. Shows once the hero is gone,
     hides while the page's form is on screen.
  ------------------------------------------------------------------ */
  const MobileBar = {
    init() {
      const hero = document.querySelector("main > section");
      const src = hero && (hero.querySelector("a.btn--primary[href]") || document.querySelector(".nav a.btn--primary[href]"));
      if (!src) return;
      const label = src.querySelector("[data-en]") || src;
      const bar = document.createElement("div");
      bar.className = "m-cta";
      bar.inert = true;
      const go = document.createElement("a");
      go.className = "btn btn--primary m-cta__go";
      go.href = src.getAttribute("href");
      const span = document.createElement("span");
      span.textContent = label.textContent.trim();
      if (label.dataset.en) { span.dataset.en = label.dataset.en; span.dataset.ar = label.dataset.ar; }
      go.appendChild(span);
      const wa = document.createElement("a");
      wa.className = "m-cta__wa";
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.href = "https://wa.me/" + Forms.waNumber();
      wa.setAttribute("aria-label", I18n.lang === "ar" ? "كلّمنا على واتساب" : "Chat with us on WhatsApp");
      wa.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm6 15.6c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>';
      wa.addEventListener("click", () => Analytics.event("contact", { channel: "whatsapp_bar" }));
      bar.append(go, wa);
      document.body.appendChild(bar);
      const form = document.querySelector("main form");
      const formSec = form && (form.closest("section") || form);
      const mq = window.matchMedia("(max-width: 767px)");
      let heroIn = true, formIn = false;
      const sync = () => {
        const on = mq.matches && !heroIn && !formIn;
        bar.classList.toggle("is-on", on);
        bar.inert = !on;
        document.body.classList.toggle("has-mcta", on);
      };
      new IntersectionObserver(es => { heroIn = es[0].isIntersecting; sync(); }).observe(hero);
      if (formSec) new IntersectionObserver(es => { formIn = es[0].isIntersecting; sync(); }, { rootMargin: "0px 0px -30% 0px" }).observe(formSec);
      mq.addEventListener("change", sync);
    }
  };

  /* ------------------------------------------------------------------
     STACK CARDS — side-by-side comparisons ([data-stack]) also get one
     card per option for phones; CSS shows one layout or the other.
  ------------------------------------------------------------------ */
  const StackCards = {
    read(box) {
      if (box.classList.contains("cw-vs")) {
        const heads = [...box.querySelectorAll(".cw-vs__side")];
        const rows = [...box.querySelectorAll(".cw-vs__row")].map(r => [r.querySelector(".cw-vs__topic"), ...r.querySelectorAll(".cw-vs__cell")]);
        return { heads: heads.map(h => h.querySelector("b")), rows };
      }
      const [head, ...rest] = [...box.children];
      return { heads: [...head.children].slice(1), rows: rest.map(r => [...r.children]) };
    },
    init() {
      document.querySelectorAll("[data-stack]").forEach(box => {
        const { heads, rows } = this.read(box);
        const wrap = document.createElement("div");
        wrap.className = "stack-cards";
        heads.forEach((h, i) => {
          const card = document.createElement("article");
          card.className = "stack-card" + (box.dataset.stack !== "plain" && i === heads.length - 1 ? " stack-card--us" : "");
          const t = document.createElement("h3");
          t.textContent = h.textContent.trim();
          const dl = document.createElement("dl");
          rows.forEach(r => {
            const d = document.createElement("div");
            const dt = document.createElement("dt"); dt.textContent = r[0].textContent.trim();
            const dd = document.createElement("dd"); dd.textContent = r[i + 1].textContent.trim();
            d.append(dt, dd); dl.appendChild(d);
          });
          card.append(t, dl);
          wrap.appendChild(card);
        });
        box.after(wrap);
      });
    }
  };


  /* ------------------------------------------------------------------
     TABS — [data-tabs] shows one child panel at a time; each panel's
     first [class*="__tag"] becomes its tab label.
  ------------------------------------------------------------------ */
  const Tabs = {
    init() {
      document.querySelectorAll("[data-tabs]").forEach((box, n) => {
        const panels = [...box.children];
        if (panels.length < 2) return;
        const list = document.createElement("div");
        list.className = "tabs";
        list.setAttribute("role", "tablist");
        const tabs = panels.map((p, i) => {
          const lab = p.querySelector('[class*="__tag"]');
          const b = document.createElement("button");
          b.type = "button";
          b.className = "tabs__b";
          b.id = "tab-" + n + "-" + i;
          b.setAttribute("role", "tab");
          b.textContent = lab ? lab.textContent.trim() : String(i + 1);
          if (!p.id) p.id = "panel-" + n + "-" + i;
          b.setAttribute("aria-controls", p.id);
          p.setAttribute("role", "tabpanel");
          p.setAttribute("aria-labelledby", b.id);
          list.appendChild(b);
          return b;
        });
        const pick = i => {
          tabs.forEach((b, k) => { b.setAttribute("aria-selected", String(k === i)); b.tabIndex = k === i ? 0 : -1; });
          panels.forEach((p, k) => { p.hidden = k !== i; });
        };
        tabs.forEach((b, i) => {
          b.addEventListener("click", () => pick(i));
          b.addEventListener("keydown", e => {
            const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
            if (!d) return;
            const k = (i + (document.dir === "rtl" ? -d : d) + tabs.length) % tabs.length;
            pick(k); tabs[k].focus();
          });
        });
        box.classList.add("is-tabbed");
        box.before(list);
        // a link to a panel's id (e.g. #companies) opens that tab
        const fromHash = () => panels.findIndex(p => "#" + p.id === location.hash);
        pick(Math.max(0, fromHash()));
        window.addEventListener("hashchange", () => { const h = fromHash(); if (h >= 0) pick(h); });
      });
    }
  };

  /* ------------------------------------------------------------------
     RAILS — on phones, card lists scroll sideways; any that actually
     scroll become keyboard-focusable regions named after their section.
  ------------------------------------------------------------------ */
  const Rails = {
    init() {
      const sel = "[data-rail], .process__grid, .results-grid, .industry-grid, .eco-grid, .svc-grid, .phases, .pkg-grid, .inc-grid, .svc, .types, .go-steps, .go-plans, .cw-seats, .cw-track, .bh-jobs, .rq-pillars, .plan-cards, .go-sec, .cw-fees, .stack-cards, .go-tour__tabs, .eh-line";
      const sync = () => document.querySelectorAll(sel).forEach(el => {
        const scrolls = el.scrollWidth > el.clientWidth + 4 && getComputedStyle(el).overflowX !== "visible";
        if (scrolls && !el.hasAttribute("tabindex")) {
          el.tabIndex = 0;
          if (!/^(UL|OL|DL)$/.test(el.tagName) && !el.hasAttribute("role")) { el.setAttribute("role", "region"); el.dataset.railRole = ""; }
          const h = el.closest("section")?.querySelector("h2");
          el.setAttribute("aria-label", h ? h.textContent.trim() : (I18n.lang === "ar" ? "قائمة قابلة للتمرير" : "Scrollable list"));
          el.dataset.railFocus = "";
        } else if (!scrolls && el.hasAttribute("data-rail-focus")) {
          el.removeAttribute("tabindex"); el.removeAttribute("aria-label"); delete el.dataset.railFocus;
          if (el.hasAttribute("data-rail-role")) { el.removeAttribute("role"); delete el.dataset.railRole; }
        }
      });
      sync();
      let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(sync, 200); });
    }
  };

  /* ------------------------------------------------------------------
     FAQ MORE — long FAQs show five questions, then "More questions".
  ------------------------------------------------------------------ */
  const FaqMore = {
    init() {
      document.querySelectorAll(".acc").forEach(acc => {
        const items = [...acc.querySelectorAll(":scope > .acc-item")];
        if (items.length <= 5) return;
        items.slice(5).forEach(i => (i.hidden = true));
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn btn--ghost acc-more";
        b.textContent = I18n.lang === "ar" ? "أسئلة تانية" : "More questions";
        b.addEventListener("click", () => { items.forEach(i => (i.hidden = false)); b.remove(); items[5].querySelector("button")?.focus(); });
        acc.after(b);
      });
    }
  };

  /* ------------------------------------------------------------------
     CURRENCY TOGGLE — [data-cur-toggle="selectId"] swaps the select's options
     (EGP set in the select, other sets in a hidden select[data-cur-options])
     and keeps input[name=currency] in step, so the form sends the currency.
  ------------------------------------------------------------------ */
  const CurToggle = {
    init() {
      document.querySelectorAll("[data-cur-toggle]").forEach(box => {
        const sel = document.getElementById(box.dataset.curToggle);
        if (!sel || !sel.form) return;
        const hid = sel.form.querySelector('input[name="currency"]');
        const sets = { EGP: [...sel.options].map(o => o.cloneNode(true)) };
        sel.form.querySelectorAll("select[data-cur-options]").forEach(s => { sets[s.dataset.curOptions] = [...s.options].map(o => o.cloneNode(true)); });
        box.addEventListener("click", e => {
          const b = e.target.closest("[data-cur]");
          if (!b || !sets[b.dataset.cur]) return;
          const lang = document.documentElement.lang === "ar" ? "ar" : "en";
          sel.replaceChildren(...sets[b.dataset.cur].map(o => { const c = o.cloneNode(true); c.textContent = c.getAttribute("data-" + lang) || c.textContent; return c; }));
          if (hid) hid.value = b.dataset.cur;
          box.querySelectorAll("[data-cur]").forEach(x => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-pressed", String(x === b)); });
        });
      });
    }
  };

  /* ------------------------------------------------------------------
     STEPS — multi-step forms ([data-steps]): Next validates the current
     step, the last step shows a review, then the normal Forms submit runs.
  ------------------------------------------------------------------ */
  const Steps = {
    init() {
      document.querySelectorAll("form[data-steps]").forEach(form => {
        const steps = [...form.querySelectorAll(".step")];
        const box = form.closest(".apply") || form.parentElement;
        const nav = box.querySelectorAll(".steps-nav li");
        const bar = box.querySelector(".steps-bar i");
        const back = form.querySelector("[data-step-back]");
        const next = form.querySelector("[data-step-next]");
        const send = form.querySelector("[data-step-submit]");
        let cur = 0;
        const valid = step => {
          let ok = true;
          step.querySelectorAll("[required]").forEach(input => {
            let bad;
            if (input.type === "radio") bad = !step.querySelector('input[name="' + input.name + '"]:checked');
            else bad = !input.value.trim() || (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) || (input.type === "url" && !/^https?:\/\/\S+\.\S+/.test(input.value.trim()));
            const holder = input.type === "radio" ? step : input.closest(".field");
            if (holder) holder.classList.toggle("is-error", bad);
            if (bad) ok = false;
          });
          return ok;
        };
        const review = () => {
          const out = form.querySelector("[data-review]");
          if (!out) return;
          const rows = [];
          steps.slice(0, -1).forEach(st => {
            st.querySelectorAll("input, select, textarea").forEach(el => {
              if (el.closest(".hp") || !el.name) return;
              if (el.type === "radio" && !el.checked) return;
              let label, value;
              if (el.type === "radio") {
                label = st.querySelector("legend").textContent;
                value = el.closest("label").querySelector("b").textContent;
              } else {
                const lab = form.querySelector('label[for="' + el.id + '"]');
                label = lab ? lab.textContent.replace(/\s*\*\s*$/, "") : el.name;
                value = el.tagName === "SELECT" ? (el.value ? el.options[el.selectedIndex].textContent : "") : el.value.trim();
              }
              if (!value) return;
              rows.push("<div><dt></dt><dd></dd></div>");
              rows[rows.length - 1] = [label, value];
            });
          });
          out.replaceChildren(...rows.map(([l, v]) => {
            const d = document.createElement("div");
            const dt = document.createElement("dt"); dt.textContent = l;
            const dd = document.createElement("dd"); dd.textContent = v;
            d.append(dt, dd);
            return d;
          }));
        };
        const show = i => {
          cur = i;
          steps.forEach((st, j) => { st.hidden = j !== i; });
          nav.forEach((li, j) => { li.classList.toggle("is-on", j === i); li.classList.toggle("is-done", j < i); });
          if (bar) bar.style.transform = "scaleX(" + ((i + 1) / steps.length) + ")";
          back.hidden = i === 0;
          next.hidden = i === steps.length - 1;
          send.hidden = i !== steps.length - 1;
          if (i === steps.length - 1) review();
          const first = steps[i].querySelector("input:not([type=radio]), select, textarea, input[type=radio]");
          if (first && i > 0) first.focus({ preventScroll: true });
        };
        next.addEventListener("click", () => { if (valid(steps[cur])) show(cur + 1); });
        back.addEventListener("click", () => show(cur - 1));
        steps.forEach(st => st.addEventListener("change", e => { if (e.target.type === "radio") st.classList.remove("is-error"); }));
        // Enter moves forward instead of submitting early
        form.addEventListener("keydown", e => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && cur < steps.length - 1) { e.preventDefault(); next.click(); }
        });
        form.addEventListener("reset", () => setTimeout(() => show(0)));
        show(0);
      });
    }
  };

  /* ------------------------------------------------------------------
     PORTFOLIO — Vitals Web project showcase. Tabs pick a project; the
     visitor scrolls each capture inside its desktop and phone frames.
  ------------------------------------------------------------------ */
  const Portfolio = {
    // tiny page diagrams for the package cards: one page, a multi-page site, a store
    wire(id) {
      const page = inner => '<span class="wf"><i class="wf__bar"></i>' + inner + "</span>";
      if (id === "launch") return page('<i class="wf__hero"></i><i class="wf__l"></i><i class="wf__l wf__l--s"></i><i class="wf__btn"></i>');
      if (id === "business") return page('<i class="wf__hero"></i><i class="wf__row"><i></i><i></i><i></i></i>') + page('<i class="wf__l"></i><i class="wf__l"></i><i class="wf__l wf__l--s"></i>') + page('<i class="wf__l"></i><i class="wf__row"><i></i><i></i></i>');
      return page('<i class="wf__grid"><i></i><i></i><i></i><i></i><i></i><i></i></i><i class="wf__cart"></i>');
    },
    init() {
      document.querySelectorAll("[data-pf]").forEach(pf => {
        const tabs = [...pf.querySelectorAll('[role="tab"]')];
        const panels = tabs.map(t => document.getElementById(t.getAttribute("aria-controls")));
        const select = (i, focus) => {
          tabs.forEach((t, j) => { t.setAttribute("aria-selected", String(j === i)); t.tabIndex = j === i ? 0 : -1; });
          panels.forEach((p, j) => { p.hidden = j !== i; });
          panels[i].querySelectorAll(".pf__screen").forEach(sc => { sc.scrollTop = 0; });
          if (focus) tabs[i].focus();
        };
        tabs.forEach((t, i) => {
          t.addEventListener("click", () => select(i));
          t.addEventListener("keydown", e => {
            const k = e.key, rtl = doc.dir === "rtl";
            let n = null;
            if (k === "ArrowDown" || k === (rtl ? "ArrowLeft" : "ArrowRight")) n = (i + 1) % tabs.length;
            else if (k === "ArrowUp" || k === (rtl ? "ArrowRight" : "ArrowLeft")) n = (i - 1 + tabs.length) % tabs.length;
            else if (k === "Home") n = 0; else if (k === "End") n = tabs.length - 1;
            if (n != null) { e.preventDefault(); select(n, true); }
          });
        });
      });
    }
  };

  const WhatsAppFab = {
    init() {
      const a = document.createElement("a");
      a.className = "wa-fab";
      a.target = "_blank";
      a.rel = "noopener";
      a.href = "https://wa.me/" + Forms.waNumber();
      a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5 10 9.9 5.2 16 5.2S27 10 27 15.9 22.1 26.4 16 26.4zm6-7.8c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.5-.6-.8-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>' +
        '<span class="wa-fab__label" data-en="Chat with us on WhatsApp" data-ar="تحدّث معنا على واتساب">Chat with us on WhatsApp</span>';
      // Opens the chat with a friendly first line in the visitor's language.
      a.addEventListener("click", () => {
        const msg = I18n.lang === "ar" ? "مرحبًا براند فايتلز، أود معرفة المزيد عن خدماتكم." : "Hi Brand Vitals, I'd like to know more about your services.";
        a.href = "https://wa.me/" + Forms.waNumber() + "?text=" + encodeURIComponent(msg);
        Analytics.event("contact", { channel: "whatsapp_fab" });
      });
      let dock = document.querySelector(".quick-dock");
      if (!dock) {
        dock = document.createElement("aside");
        dock.className = "quick-dock";
        dock.setAttribute("aria-label", I18n.lang === "ar" ? "تواصل سريع" : "Quick contact");
        document.body.appendChild(dock);
      }
      const top = document.querySelector(".to-top");
      if (top) dock.appendChild(top);
      dock.appendChild(a);
      // Appear once the loader has finished, then show the label briefly.
      const show = () => {
        a.classList.add("is-in");
        // No auto-expanding label on phones: it covers the hero (the sticky bar carries WhatsApp there).
        if (reduceMotion || window.matchMedia("(max-width: 767px)").matches) return;
        setTimeout(() => { a.classList.add("is-intro"); setTimeout(() => a.classList.remove("is-intro"), 3600); }, 1400);
      };
      const wait = () => (document.body.classList.contains("is-loaded") ? setTimeout(show, 500) : setTimeout(wait, 200));
      wait();
    }
  };

  /* ------------------------------------------------------------------
     CONSULT MODAL — glass overlay form, opens from any [data-consult]
  ------------------------------------------------------------------ */
  const ConsultModal = {
    injected: false,
    close() { /* replaced once the modal is injected */ },
    inject() {
      if (this.injected || !document.querySelector("[data-consult]")) return;
      const tpl = document.createElement("div");
      tpl.className = "modal-backdrop";
      tpl.id = "consultModal";
      tpl.setAttribute("role", "dialog");
      tpl.setAttribute("aria-modal", "true");
      tpl.innerHTML = `
        <div class="modal">
          <button class="modal__close" type="button" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <p class="eyebrow" data-en="Free consultation" data-ar="استشارة مجانية">Free consultation</p>
          <h3 style="margin-top:.6rem" data-en="Book your 30 minutes." data-ar="احجز الـ30 دقيقة الخاصة بك.">Book your 30 minutes.</h3>
          <p class="sub" data-en="A strategist, not a salesperson, will call you within one business day." data-ar="خبير استراتيجي، لا مندوب مبيعات، سيتصل بك خلال يوم عمل واحد.">A strategist, not a salesperson, will call you within one business day.</p>
          <form data-validate data-success="#modalSuccess" novalidate>
            <div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
            <div class="form-grid">
              <div class="field">
                <label data-en="Full name *" data-ar="الاسم الكامل *">Full name *</label>
                <input name="name" type="text" required autocomplete="name" data-en-ph="Your name" data-ar-ph="اسمك" placeholder="Your name">
                <span class="err" data-en="Please enter your name." data-ar="يرجى إدخال اسمك.">Please enter your name.</span>
              </div>
              <div class="field">
                <label data-en="Phone / WhatsApp *" data-ar="الهاتف / واتساب *">Phone / WhatsApp *</label>
                <input name="phone" type="tel" required autocomplete="tel" dir="ltr" placeholder="+20 …">
                <span class="err" data-en="Please enter your number." data-ar="يرجى إدخال رقمك.">Please enter your number.</span>
              </div>
              <div class="field field--full">
                <label data-en="Business email *" data-ar="البريد الإلكتروني *">Business email *</label>
                <input name="email" type="email" required autocomplete="email" placeholder="you@company.com">
                <span class="err" data-en="Please enter a valid email." data-ar="يرجى إدخال بريد صحيح.">Please enter a valid email.</span>
              </div>
              <div class="field field--full">
                <label data-en="What do you want to grow?" data-ar="ما الذي تريد تنميته؟">What do you want to grow?</label>
                <textarea name="message" rows="3" data-en-ph="Tell us in one or two lines…" data-ar-ph="أخبرنا في سطر أو سطرين…" placeholder="Tell us in one or two lines…"></textarea>
              </div>
              <div class="field--full">
                <button class="btn btn--primary btn--lg" type="submit" style="width:100%">
                  <span class="spinner" aria-hidden="true"></span>
                  <span class="btn__label" data-en="Request my consultation" data-ar="اطلب استشارتي">Request my consultation</span>
                </button>
                <p class="mono" style="margin-top:.9rem; text-align:center; color:var(--text-3)" data-en="No obligation · No pitch deck" data-ar="بلا التزام · بلا عرض بيعي">No obligation · No pitch deck</p>
              </div>
            </div>
          </form>
          <div class="form-success" id="modalSuccess" role="status">
            <span class="ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
            <h3 data-en="Request received." data-ar="استلمنا طلبك.">Request received.</h3>
            <p style="color:var(--text-2)" data-en="We'll reach out within one business day." data-ar="سنتواصل معك خلال يوم عمل واحد.">We'll reach out within one business day.</p>
          </div>
        </div>`;
      document.body.appendChild(tpl);
      this.injected = true;

      const open = () => {
        tpl.classList.add("is-open");
        document.body.classList.add("modal-open");
        const first = tpl.querySelector("input");
        setTimeout(() => first && first.focus(), 420);
      };
      const close = () => {
        tpl.classList.remove("is-open");
        document.body.classList.remove("modal-open");
      };
      this.close = close;
      document.querySelectorAll("[data-consult]").forEach(el =>
        el.addEventListener("click", e => { e.preventDefault(); open(); })
      );
      tpl.querySelector(".modal__close").addEventListener("click", close);
      tpl.addEventListener("click", e => { if (e.target === tpl) close(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    }
  };

  /* ------------------------------------------------------------------
     MOUSE PARALLAX — hero orbs & aurora drift with the cursor
  ------------------------------------------------------------------ */
  const MouseParallax = {
    init() {
      if (!finePointer || reduceMotion) return;
      const els = document.querySelectorAll("[data-mousepara]");
      if (!els.length) return;
      let mx = 0, my = 0, ticking = false;
      window.addEventListener("mousemove", e => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            els.forEach(el => {
              const s = parseFloat(el.dataset.mousepara) || 14;
              el.style.translate = `${mx * s}px ${my * s}px`;
            });
            ticking = false;
          });
        }
      }, { passive: true });
    }
  };

  /* ------------------------------------------------------------------
     MISC — year, marquee duplication
  ------------------------------------------------------------------ */
  const Misc = {
    init() {
      document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));
      // Duplicate marquee tracks for seamless loop
      document.querySelectorAll(".marquee").forEach(mq => {
        const track = mq.querySelector(".marquee__track");
        if (track && mq.children.length === 1) mq.appendChild(track.cloneNode(true));
      });
    }
  };

  /* ------------------------------------------------------------------
     BOOT
  ------------------------------------------------------------------ */
  window.BVTrack = Track;
  window.BVNotice = Notice;
  const boot = () => {
    Analytics.init();
    ConsultModal.inject();
    WhatsAppFab.init();
    WebPackages.init();
    Theme.init();
    I18n.init();
    Ecosystem.init();
    WaLinks.init();
    Steps.init();
    Portfolio.init();
    MouseParallax.init();
    Loader.init();
    Nav.init();
    Progress.init();
    Reveal.init();
    Counters.init();
    CurToggle.init();
    Wireframes.init();
    Cycle.init();
    StackCards.init();
    Rails.init();
    FaqMore.init();
    Tabs.init();
    MobileBar.init();
    Signals.init();
    Magnetic.init();
    Ripple.init();
    Tilt.init();
    Parallax.init();
    Accordion.init();
    Filter.init();
    Forms.init();
    Misc.init();
    Track.pageview();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
