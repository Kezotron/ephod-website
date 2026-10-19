/* ============================================================
   EPHOD site script — shared helpers and per-page logic.
   Pages opt in with <body data-page="...">.
   ============================================================ */
(function () {
  "use strict";
  const C = window.EPHOD_CONFIG;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  /* ---------- storage (safe) ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode etc. */ } }
  };

  /* ---------- theme ---------- */
  function initTheme() {
    const fromUrl = new URLSearchParams(location.search).get("theme");
    const saved = store.get("ephod-theme-v2");
    const theme = fromUrl || saved || C.DEFAULT_THEME;
    document.documentElement.setAttribute("data-theme", theme);
    if (fromUrl) store.set("ephod-theme-v2", fromUrl);
    const pick = $("#theme-pick");
    if (pick) {
      if (!C.SHOW_THEME_PICKER) { pick.closest(".theme-pick").hidden = true; return; }
      pick.value = theme;
      pick.addEventListener("change", () => {
        document.documentElement.setAttribute("data-theme", pick.value);
        store.set("ephod-theme-v2", pick.value);
      });
    }
  }

  /* ---------- nav ---------- */
  function initNav() {
    const btn = $(".nav-toggle"), nav = $("#site-nav");
    if (btn && nav) {
      btn.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    const here = location.pathname.split("/").pop() || "index.html";
    $$("#site-nav a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === here || (here === "" && href === "index.html")) a.setAttribute("aria-current", "page");
    });
  }

  /* ---------- dates ---------- */
  // EPHOD day of year: Feb 29 is day 366; every other date keeps its non-leap number.
  function dayOfYear(d) {
    const m = d.getMonth(), day = d.getDate();
    if (m === 1 && day === 29) return 366;
    let n = 0;
    for (let i = 0; i < m; i++) n += MDAYS[i];
    return n + day;
  }
  function dateForDay(day, year) {
    year = year || new Date().getFullYear();
    if (day === 366) return new Date(year, 1, 29);
    let m = 0, d = day;
    while (d > MDAYS[m]) { d -= MDAYS[m]; m++; }
    return new Date(year, m, d);
  }
  function fmtDate(d, opts) {
    return d.toLocaleDateString(undefined, opts || { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }
  function todayDay() {
    const p = new URLSearchParams(location.search).get("day");
    const n = parseInt(p, 10);
    if (n >= 1 && n <= 366) return n;
    return dayOfYear(new Date());
  }

  /* ---------- API ---------- */
  async function api(path, params) {
    const url = new URL(C.API_BASE + path);
    Object.entries(params || {}).forEach(([k, v]) => { if (v != null && v !== "") url.searchParams.set(k, v); });
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 15000);
    try {
      const r = await fetch(url, { signal: ctl.signal });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      if (j && j.success === false) throw new Error(j.error || "Request failed");
      return j;
    } finally { clearTimeout(t); }
  }
  async function getJSON(path) {
    const r = await fetch(path, { cache: "no-cache" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }

  /* ---------- versions ---------- */
  function currentVersion() {
    const p = new URLSearchParams(location.search).get("version");
    const v = p || store.get("ephod-version") || C.DEFAULT_VERSION;
    return C.VERSIONS.some((x) => x.table === v) ? v : C.DEFAULT_VERSION;
  }
  function versionLabel(table, info) {
    if (info && info.version) return info.version;
    const v = C.VERSIONS.find((x) => x.table === table);
    return v ? v.label : table;
  }
  function copyrightLine(table, info) {
    if (info && info.copyright) {
      const pub = info.publisher ? " " + info.publisher + "." : "";
      return esc(versionLabel(table, info)) + ". " + esc(info.copyright) + pub;
    }
    return esc(C.COPYRIGHT[table] || versionLabel(table) + ".");
  }
  let versionSelectsReady = false;
  function initVersionSelects(onChange) {
    const cur = currentVersion();
    if (versionSelectsReady) return cur;
    versionSelectsReady = true;
    $$("select.version-select").forEach((sel) => {
      sel.innerHTML = C.VERSIONS.map((v) => `<option value="${v.table}">${esc(v.label)}</option>`).join("");
      sel.value = cur;
      sel.addEventListener("change", () => {
        store.set("ephod-version", sel.value);
        $$("select.version-select").forEach((o) => { if (o !== sel) o.value = sel.value; });
        if (onChange) onChange(sel.value);
      });
    });
    return cur;
  }

  /* ---------- rendering helpers ---------- */
  function versesHTML(verses) {
    return "<p>" + verses.map((v) => `<span class="v">${v.number ?? v.verseNumber}</span>${esc(v.text).trim()}`).join(" ") + "</p>";
  }
  function verseCard(opts) {
    // opts: kicker, title, verses, reference, versionTable, versionInfo, foot
    return `
      <div class="verse-card ${opts.cls || ""}">
        ${opts.kicker ? `<p class="verse-kicker">${esc(opts.kicker)}</p>` : ""}
        ${opts.title ? `<h2>${esc(opts.title)}</h2>` : ""}
        <div class="verse-text">${opts.verses.map((v) => `<sup>${v.number ?? v.verseNumber}</sup>${esc(v.text).trim()}`).join(" ")}</div>
        <p class="verse-ref">${esc(opts.reference)}</p>
        <p class="verse-foot">${copyrightLine(opts.versionTable, opts.versionInfo)}${opts.foot ? " " + opts.foot : ""}</p>
      </div>`;
  }
  function fail(el, msg) {
    el.innerHTML = `<div class="notice error">${esc(msg)}</div>`;
  }
  function devoImage(d, cls) {
    if (d.image) return `<div class="thumb ${cls || ""}"><img src="${esc(d.image)}" alt="" loading="lazy" onerror="this.parentNode.className='thumb placeholder';this.remove()"></div>`;
    const initial = (d.title || "E").trim().charAt(0);
    return `<div class="thumb placeholder ${cls || ""}" aria-hidden="true">${esc(initial)}</div>`;
  }
  function devoCard(d) {
    return `<a class="card devo-card" href="${devoURL(d)}">
      ${devoImage(d)}
      <div class="body">
        <span class="meta">${fmtDate(new Date(d.date + "T12:00:00"), { month: "long", day: "numeric", year: "numeric" })}</span>
        <h3>${esc(d.title)}</h3>
        ${d.reading ? `<span class="reading">Read ${esc(d.reading)}</span>` : ""}
        <p>${esc(d.excerpt || "")}</p>
      </div></a>`;
  }
  function devoURL(d) { return "devotion.html?slug=" + encodeURIComponent(d.slug); }

  /* ---------- reading plan references ---------- */
  let BOOKS = null;
  async function bookNames() {
    if (BOOKS) return BOOKS;
    const cached = store.get("ephod-books");
    if (cached) { try { BOOKS = JSON.parse(cached); return BOOKS; } catch (e) { /* fallthrough */ } }
    const j = await api("get_bible_books.php");
    BOOKS = {}; j.books.forEach((b) => { BOOKS[b.id] = b.name; });
    store.set("ephod-books", JSON.stringify(BOOKS));
    return BOOKS;
  }
  function planRef(books, fb, fc, fv, lb, lc, lv) {
    const n1 = books[fb] || fb, n2 = books[lb] || lb;
    fc = +fc; lc = +lc; fv = +fv; lv = +lv;
    const withVerses = lv > 0 || fv > 1;
    if (!withVerses) return fb === lb ? (fc === lc ? `${n1} ${fc}` : `${n1} ${fc}–${lc}`) : `${n1} ${fc} – ${n2} ${lc}`;
    if (fb !== lb) return `${n1} ${fc}:${fv} – ${n2} ${lc}:${lv}`;
    if (lv === 0) return `${n1} ${fc}:${fv}ff`;
    return fc === lc ? `${n1} ${fc}:${fv}–${lv}` : `${n1} ${fc}:${fv}–${lc}:${lv}`;
  }

  /* ============================================================
     Pages
     ============================================================ */
  const pages = {};

  /* ---------- home ---------- */
  pages.home = async function () {
    const day = dayOfYear(new Date());
    const ver = initVersionSelects(() => pages.home());
    const td = $("#today-date"); if (td) td.textContent = fmtDate(new Date());

    // today's readings, as links under the Daily Bible Reading card
    const rl = $("#today-readings");
    api("get_daily_reading_plan.php", { day }).then((j) => {
      rl.innerHTML = `
        <a class="reading-item" href="am-reading.html"><span class="ampm">AM</span><span><span class="ref">${esc(j.amReading)}</span><br><span class="sub">Morning reading</span></span></a>
        <a class="reading-item" href="pm-reading.html"><span class="ampm">PM</span><span><span class="ref">${esc(j.pmReading)}</span><br><span class="sub">Evening reading</span></span></a>`;
    }).catch(() => { rl.innerHTML = `<a class="reading-item" href="am-reading.html"><span class="ampm">AM</span><span class="ref">Morning reading</span></a><a class="reading-item" href="pm-reading.html"><span class="ampm">PM</span><span class="ref">Evening reading</span></a>`; });

    // memory verse, visible inside its card
    const mv = $("#memory-verse");
    api("get_memory_verse.php", { version: ver }).then((j) => {
      mv.innerHTML = `<p class="meta">${esc(j.dateRange)}</p>
        <p class="verse-ref">${esc(j.reference.replace(/\s*\(.*\)$/, ""))}</p>
        <div class="verse-text small-verse">${j.verses.map((v) => `<sup>${v.number ?? v.verseNumber}</sup>${esc(v.text).trim()}`).join(" ")}</div>
        <p class="verse-foot">${esc(j.version)}</p>`;
    }).catch(() => fail(mv, "The memory verse couldn't be loaded."));

    // gold nugget
    const gn = $("#gold-nugget");
    api("get_golden_nugget.php", { day, version: ver }).then((j) => {
      gn.innerHTML = verseCard({ kicker: "Today's Gold Nugget", verses: j.verses, reference: j.reference, versionTable: j.version, versionInfo: j.versionInfo, foot: `<a href="gold-nugget.html">Past Gold Nuggets</a>` });
    }).catch(() => fail(gn, "Today's Gold Nugget couldn't be loaded."));

    // latest devotion, inside its card
    const ld = $("#latest-devotion");
    if (ld) getJSON(C.DEVOTIONS_INDEX).then((idx) => {
      const d = idx[0]; if (!d) { ld.innerHTML = ""; return; }
      ld.innerHTML = `<p class="meta">${fmtDate(new Date(d.date + "T12:00:00"), { month: "long", day: "numeric", year: "numeric" })}</p>
        <p><a class="devo-title" href="${devoURL(d)}">${esc(d.title)}</a></p>
        ${d.reading ? `<p class="reading">Read ${esc(d.reading)}</p>` : ""}
        <p class="muted small">${esc(d.excerpt || "")}</p>`;
    }).catch(() => { ld.innerHTML = ""; });
  };

  /* ---------- AM / PM reading ---------- */
  pages.reading = async function () {
    const which = document.body.dataset.reading; // "am" | "pm"
    const day = todayDay();
    const ver = initVersionSelects(() => pages.reading());
    const date = dateForDay(day);
    $("#reading-date").textContent = fmtDate(date);
    const out = $("#scripture");
    out.innerHTML = `<p class="loading">Loading ${which === "am" ? "this morning's" : "this evening's"} reading…</p>`;
    // day navigation
    const prev = day === 1 ? 365 : day === 366 ? 59 : day - 1;
    const next = day === 365 ? 1 : day === 366 ? 60 : day + 1;
    $("#daynav").innerHTML = `
      <a class="btn btn-quiet" href="?day=${prev}">← Previous day</a>
      ${day !== dayOfYear(new Date()) ? `<a class="btn btn-quiet" href="${which}-reading.html">Today</a>` : ""}
      <a class="btn btn-quiet" href="?day=${next}">Next day →</a>
      <a class="btn btn-quiet" href="${which === "am" ? "pm" : "am"}-reading.html?day=${day}">${which === "am" ? "Evening" : "Morning"} reading for this day</a>`;
    try {
      const j = await api((which === "am" ? "am_bible_reading.php" : "pm_bible_reading.php"), { day, version: ver });
      $("#reading-ref").textContent = j.reference;
      document.title = `${j.reference} — ${which.toUpperCase()} Bible Reading | EPHOD`;
      let html = "";
      if (j.chapters) {
        j.chapters.forEach((ch) => { html += `<h2>${esc(j.bookName)} ${ch.number}</h2>` + versesHTML(ch.verses); });
      } else if (j.verses) {
        html += `<h2>${esc(j.reference)}</h2>` + versesHTML(j.verses);
      }
      out.innerHTML = html;
      $("#copyright").innerHTML = copyrightLine(ver, Array.isArray(j.versionInfo) ? null : j.versionInfo);
    } catch (e) {
      fail(out, "This reading couldn't be loaded right now. Check your connection and try again.");
    }
    // devotion of the week
    const dw = $("#week-devotion");
    if (dw) getJSON(C.DEVOTIONS_INDEX).then((idx) => {
      const d = idx[0]; if (!d) return;
      dw.innerHTML = `<h3>This week's devotion</h3>${devoCard(d)}`;
    }).catch(() => {});
  };

  /* ---------- catch-up ---------- */
  pages.catchup = async function () {
    const today = dayOfYear(new Date());
    const list = $("#catchup-list");
    const labels = ["Yesterday", "Two days ago", "Three days ago", "Four days ago", "Five days ago", "Six days ago", "One week ago"];
    const rows = [];
    for (let i = 1; i <= 7; i++) {
      let d = today - i; if (d < 1) d += 365;
      rows.push({ day: d, label: labels[i - 1] });
    }
    list.innerHTML = rows.map((r) => `<div class="catchup-row" id="row-${r.day}"><div class="d">${esc(r.label)}<small>${fmtDate(dateForDay(r.day), { month: "long", day: "numeric" })}</small></div><div class="am loading">…</div><div class="pm loading">…</div></div>`).join("");
    rows.forEach((r) => {
      api("get_daily_reading_plan.php", { day: r.day }).then((j) => {
        const row = $("#row-" + r.day);
        $(".am", row).outerHTML = `<a href="am-reading.html?day=${r.day}"><strong>AM</strong> ${esc(j.amReading)}</a>`;
        $(".pm", row).outerHTML = `<a href="pm-reading.html?day=${r.day}"><strong>PM</strong> ${esc(j.pmReading)}</a>`;
      }).catch(() => { const row = $("#row-" + r.day); $(".am", row).textContent = "Couldn't load"; $(".pm", row).textContent = ""; });
    });
    // date picker
    const m = $("#pick-month"), d = $("#pick-day");
    m.innerHTML = MONTHS.map((n, i) => `<option value="${i}">${n}</option>`).join("");
    function fillDays() {
      const mi = +m.value, max = mi === 1 ? 29 : MDAYS[mi];
      d.innerHTML = Array.from({ length: max }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("");
    }
    m.addEventListener("change", fillDays); fillDays();
    const now = new Date(); m.value = now.getMonth(); fillDays(); d.value = now.getDate();
    $("#pick-form").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const day = dayOfYear(new Date(2001, +m.value, +d.value)) ; // 2001 is non-leap; Feb 29 handled below
      const real = (+m.value === 1 && +d.value === 29) ? 366 : day;
      location.href = `${$("input[name=which]:checked").value}-reading.html?day=${real}`;
    });
  };

  /* ---------- full-year plan ---------- */
  pages.plan = async function () {
    const out = $("#plan-table");
    try {
      const [books, j] = await Promise.all([bookNames(), api("export_reading_plan.php")]);
      const byDay = {}; j.readingPlan.forEach((r) => { byDay[+r.id] = r; });
      let html = "";
      let day = 1;
      MONTHS.forEach((name, mi) => {
        const n = MDAYS[mi];
        html += `<section class="plan-month" id="m-${mi + 1}"><h2>${name}</h2><table><thead><tr><th>Day</th><th>Morning (AM)</th><th>Evening (PM)</th></tr></thead><tbody>`;
        for (let i = 1; i <= n; i++, day++) {
          const r = byDay[day]; if (!r) continue;
          html += `<tr><td>${i}</td><td><a href="am-reading.html?day=${day}">${esc(planRef(books, r.fbook, r.fchapter, r.fverse, r.lbook, r.lchapter, r.lverse))}</a></td><td><a href="pm-reading.html?day=${day}">${esc(planRef(books, r.pmfbook, r.pmfchapter, r.pmfverse, r.pmlbook, r.pmlchapter, r.pmlverse))}</a></td></tr>`;
        }
        if (mi === 1 && byDay[366]) {
          const r = byDay[366];
          html += `<tr><td>29 (leap year)</td><td><a href="am-reading.html?day=366">${esc(planRef(books, r.fbook, r.fchapter, r.fverse, r.lbook, r.lchapter, r.lverse))}</a></td><td><a href="pm-reading.html?day=366">${esc(planRef(books, r.pmfbook, r.pmfchapter, r.pmfverse, r.pmlbook, r.pmlchapter, r.pmlverse))}</a></td></tr>`;
        }
        html += `</tbody></table></section>`;
      });
      out.innerHTML = html;
    } catch (e) {
      fail(out, "The reading plan couldn't be loaded right now.");
    }
  };

  /* ---------- memory verses (current + past) ---------- */
  pages.memory = async function () {
    const ver = initVersionSelects(() => pages.memory());
    const out = $("#memory-list");
    try {
      const j = await api("get_past_memory_verses.php", { version: ver });
      out.innerHTML = j.memoryVerses.map((m, i) => verseCard({ kicker: i === 0 ? "This week · week " + m.week : "Week " + m.week, verses: m.verses, reference: m.reference, versionTable: m.version, versionInfo: null })).join("");
    } catch (e) { fail(out, "Memory verses couldn't be loaded right now."); }
  };

  /* ---------- gold nuggets (current + past) ---------- */
  pages.nuggets = async function () {
    const ver = initVersionSelects(() => pages.nuggets());
    const out = $("#nugget-list");
    try {
      const j = await api("get_past_golden_nuggets.php", { version: ver, day: dayOfYear(new Date()) });
      out.innerHTML = j.goldenNuggets.map((m, i) => verseCard({ kicker: (i === 0 ? "Today · " : "") + m.date, verses: m.verses, reference: m.reference, versionTable: m.version, versionInfo: null })).join("");
    } catch (e) { fail(out, "Gold Nuggets couldn't be loaded right now."); }
  };

  /* ---------- devotions archive ---------- */
  pages.devotions = async function () {
    const latest = $("#latest"), arch = $("#archive"), jump = $("#year-jump");
    try {
      const idx = await getJSON(C.DEVOTIONS_INDEX);
      latest.innerHTML = idx.slice(0, 6).map(devoCard).join("");
      const years = {};
      idx.forEach((d) => { const y = d.date.slice(0, 4), m = +d.date.slice(5, 7); (years[y] = years[y] || {}); (years[y][m] = years[y][m] || []).push(d); });
      const ys = Object.keys(years).sort().reverse();
      jump.innerHTML = ys.map((y) => `<a href="#y-${y}">${y}</a>`).join("");
      arch.innerHTML = ys.map((y) => `<section class="archive-year" id="y-${y}"><h2>${y}</h2>` +
        Object.keys(years[y]).map(Number).sort((a, b) => b - a).map((m) => `<div class="archive-month"><h3>${MONTHS[m - 1]}</h3><ul class="archive-list">` +
          years[y][m].map((d) => `<li><time>${MONTHS[m - 1].slice(0, 3)} ${+d.date.slice(8, 10)}</time><a href="${devoURL(d)}">${esc(d.title)}</a>${d.reading ? `<span class="r">${esc(d.reading)}</span>` : ""}</li>`).join("") +
          `</ul></div>`).join("") + `</section>`).join("");
      $("#devo-count").textContent = idx.length;
    } catch (e) { fail(latest, "Devotions couldn't be loaded right now."); }
  };

  /* ---------- single devotion ---------- */
  pages.devotion = async function () {
    const slug = (new URLSearchParams(location.search).get("slug") || "").replace(/[^a-z0-9-]/gi, "");
    const out = $("#devotion");
    if (!slug) { fail(out, "No devotion was selected."); return; }
    try {
      const one = getJSON(C.DEVOTIONS_DIR + slug + ".json").catch(async () => {
        const all = await getJSON(C.DEVOTIONS_DIR + "all.json"); const hit = all.find((x) => x.slug === slug); if (!hit) throw new Error("not found"); return hit;
      });
      const [d, idx] = await Promise.all([one, getJSON(C.DEVOTIONS_INDEX).catch(() => [])]);
      document.title = `${d.title} — Devotions | EPHOD`;
      const i = idx.findIndex((x) => x.slug === slug);
      const newer = i > 0 ? idx[i - 1] : null, older = i >= 0 && i < idx.length - 1 ? idx[i + 1] : null;
      out.innerHTML = `
        ${d.image ? `<div class="article-hero"><img src="${esc(d.image)}" alt="" onerror="this.parentNode.remove()"></div>` : ""}
        <p class="meta">${fmtDate(new Date(d.date + "T12:00:00"), { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        <h1>${esc(d.title)}</h1>
        ${d.reading ? `<p class="read-line">Read ${esc(d.reading)}</p>` : ""}
        <div class="article-body">${d.body}</div>
        <p class="copyright-note">© Gospel Publishing House, 1445 N. Boonville Ave., Springfield, Missouri 65802. Used by permission.</p>
        <nav class="article-nav" aria-label="More devotions">
          <span>${older ? `<a href="${devoURL(older)}"><span class="lbl">Older</span>← ${esc(older.title)}</a>` : ""}</span>
          <span>${newer ? `<a href="${devoURL(newer)}" style="text-align:right"><span class="lbl">Newer</span>${esc(newer.title)} →</a>` : ""}</span>
        </nav>`;
    } catch (e) { fail(out, "This devotion couldn't be found. It may have moved — see all devotions on the Devotions page."); }
  };

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme(); initNav();
    // store buttons
    $$("[data-store]").forEach((a) => {
      const [app, store_] = a.dataset.store.split(":");
      const url = (C.STORES[app] || {})[store_];
      if (url) a.href = url; else { a.setAttribute("aria-disabled", "true"); a.classList.add("muted"); a.title = "Link coming soon"; a.removeAttribute("href"); }
    });
    const p = document.body.dataset.page;
    if (p && pages[p]) pages[p]().catch((e) => console.error(e));
    else initVersionSelects();
  });

  window.EPHOD = { dayOfYear, dateForDay, api, planRef };
})();
