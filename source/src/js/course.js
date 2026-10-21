/* ============================================================
   EPHOD Seminars — the online course.
   Runs on seminars.html (course home), seminar.html?n=N (lesson)
   and certificate.html. Content comes from js/seminars.js.
   Progress is kept on the visitor's own device (localStorage):
   there are no accounts on this site.
   ============================================================ */
(function () {
  "use strict";
  const D = window.EPHOD_SEMINARS;
  if (!D) return;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const S = D.seminars.slice().sort((a, b) => a.n - b.n);
  const TOTAL = S.length;
  const KEY = "ephod-course-v1";
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  /* ---------- progress ---------- */
  function load() {
    try { const p = JSON.parse(localStorage.getItem(KEY) || "{}"); p.done = p.done || {}; p.quiz = p.quiz || {}; return p; } catch (e) { return { done: {}, quiz: {} }; }
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { /* private mode: progress lasts for this visit only */ } }
  let P = load();
  const isDone = (n) => !!P.done[n];
  const isUnlocked = (n) => n === 1 || isDone(n - 1);
  const doneCount = () => S.filter((s) => isDone(s.n)).length;
  const allDone = () => doneCount() === TOTAL;
  const nextSeminar = () => S.find((s) => !isDone(s.n)) || null;
  const byN = (n) => S.find((s) => s.n === n);
  const groupOf = (s) => D.groups.find((g) => g.id === s.group) || { title: "" };
  const lessonURL = (s) => "seminar.html?n=" + s.n;
  const fmtMin = (m) => (m ? m + " min" : "");
  const fmtDate = (iso) => { const d = new Date(iso); return isNaN(d) ? "" : MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(); };
  const todayISO = () => new Date().toISOString();

  function progressBar() {
    const c = doneCount(), pct = Math.round(100 * c / TOTAL);
    return `<div class="course-progress" role="group" aria-label="Course progress">
      <div class="bar" aria-hidden="true"><span style="width:${pct}%"></span></div>
      <p class="meta"><strong>${c} of ${TOTAL}</strong> seminars complete${c === TOTAL ? " — well done!" : ""}</p>
    </div>`;
  }

  /* ---------- course home ---------- */
  function renderHome() {
    const out = $("#course"); if (!out) return;
    const next = nextSeminar();
    let cta;
    if (allDone()) cta = `<a class="btn btn-primary" href="certificate.html">Print your certificate</a> <a class="btn btn-quiet" href="${lessonURL(S[0])}">Watch again from the start</a>`;
    else if (doneCount() === 0) cta = `<a class="btn btn-primary" href="${lessonURL(S[0])}">Start with Seminar 1 · ${esc(S[0].title)}</a>`;
    else cta = `<a class="btn btn-primary" href="${lessonURL(next)}">Continue: Seminar ${next.n} · ${esc(next.title)}</a>`;

    const groups = D.groups.map((g) => {
      const cards = S.filter((s) => s.group === g.id).map((s) => {
        const done = isDone(s.n), open = isUnlocked(s.n);
        const state = done ? "done" : open ? (next && next.n === s.n ? "next" : "open") : "locked";
        const label = done ? "Completed" : state === "next" ? "Up next" : open ? "Available" : `After Seminar ${s.n - 1}`;
        const inner = `
          <span class="sem-num" aria-hidden="true">${s.n}</span>
          <span class="sem-body">
            <span class="sem-title">${esc(s.title)}</span>
            <span class="sem-summary">${esc(s.summary)}</span>
            <span class="sem-foot"><span class="sem-state">${label}</span>${s.minutes ? `<span class="sem-min">${fmtMin(s.minutes)}</span>` : ""}</span>
          </span>`;
        return open
          ? `<a class="sem-card is-${state}" href="${lessonURL(s)}">${inner}</a>`
          : `<div class="sem-card is-${state}" aria-disabled="true">${inner}</div>`;
      }).join("");
      return `<section class="course-group group-${g.id}" aria-labelledby="g-${g.id}">
        <header class="course-group-head${g.cover ? " has-cover" : ""}">
          <div>
            <p class="kicker">${esc(g.kicker)}</p>
            <h2 id="g-${g.id}">${esc(g.title)}</h2>
            <p class="muted">${esc(g.blurb)}</p>
          </div>
          ${g.cover ? `<img class="group-cover" src="${esc(g.cover)}" width="1186" height="911" alt="" loading="lazy">` : ""}
        </header>
        <div class="sem-grid">${cards}</div>
      </section>`;
    }).join("");

    out.innerHTML = `
      <div class="course-status card">
        ${progressBar()}
        <div class="btn-row">${cta}</div>
      </div>
      ${groups}
      <p class="small muted course-reset-row">Your progress is saved on this device only. <button type="button" class="linklike" id="course-reset">Start over</button><span id="course-reset-confirm" hidden> — are you sure? <button type="button" class="linklike" id="course-reset-yes">Yes, clear my progress</button></span></p>`;

    $("#course-reset").addEventListener("click", () => { $("#course-reset-confirm").hidden = false; });
    $("#course-reset-yes").addEventListener("click", () => { P = { done: {}, quiz: {}, name: P.name }; save(P); renderHome(); });
  }

  /* ---------- lesson page ---------- */
  function renderLesson() {
    const out = $("#lesson"); if (!out) return;
    const n = parseInt(new URLSearchParams(location.search).get("n"), 10);
    const s = byN(n);
    if (!s) { out.innerHTML = `<div class="wrap"><p class="muted">That seminar couldn't be found. <a href="seminars.html">See all seminars</a>.</p></div>`; return; }
    const g = groupOf(s), prev = byN(n - 1), next = byN(n + 1);
    const unlocked = isUnlocked(n), done = isDone(n);
    document.title = `Seminar ${n} · ${s.title} | EPHOD Seminars`;
    const quizState = P.quiz[n] || {};
    const hasQuiz = s.quiz && s.quiz.length > 0;
    const canComplete = !hasQuiz || quizState.passed;

    const head = `
      <nav class="crumbs" aria-label="Breadcrumb"><a href="seminars.html">EPHOD Seminars</a> <span aria-hidden="true">›</span> <span>Seminar ${n} of ${TOTAL}</span></nav>
      <p class="kicker group-${g.id}">${esc(g.title)}</p>
      <h1><span class="h-num">${n}</span> ${esc(s.title)}</h1>
      ${s.commitment ? `<p class="commitment">${esc(s.commitment)}</p>` : ""}
      <p class="meta">${s.minutes ? fmtMin(s.minutes) + " · " : ""}${done ? "Completed " + esc(fmtDate(P.done[n])) : unlocked ? "In progress" : "Locked"}</p>`;

    if (!unlocked) {
      out.innerHTML = `<div class="wrap lesson-wrap">
        ${head}
        <div class="card lesson-locked">
          <h2>One step at a time</h2>
          <p>The EPHOD seminars are taken in order — each one builds on the last. Finish <strong>Seminar ${prev.n} · ${esc(prev.title)}</strong> and this one will open.</p>
          <div class="btn-row"><a class="btn btn-primary" href="${lessonURL(prev)}">Go to Seminar ${prev.n}</a><a class="btn btn-quiet" href="seminars.html">All seminars</a></div>
        </div>
      </div>`;
      return;
    }

    const video = `<figure class="video lesson-video">
      <div class="video-frame"><iframe src="https://player.vimeo.com/video/${esc(s.vimeo)}?dnt=1&title=0&byline=0&portrait=0" title="EPHOD Seminar ${n}: ${esc(s.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
      <figcaption>Seminar ${n} · ${esc(s.title)} — Rev. Herb and Rev. Karen Johnson${s.handout ? ` · <a href="${esc(s.handout.href)}" download>Handout (PDF)</a>` : ""}</figcaption>
    </figure>`;

    const body = (s.body || []).map((p) => `<p>${esc(p)}</p>`).join("");
    const scriptures = s.scriptures && s.scriptures.length ? `<h2>Key Scriptures</h2><ul class="scripture-list">${s.scriptures.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : "";
    const reflect = s.reflect && s.reflect.length ? `<h2>For reflection and small groups</h2><ol class="reflect-list">${s.reflect.map((q) => `<li>${esc(q)}</li>`).join("")}</ol>` : "";
    const handout = s.handout ? `<div class="card handout-card">
        <div class="handout-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 2v5h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12h8M9 15.5h8M9 19h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></div>
        <div>
          <h2>Print the handout first</h2>
          <p class="muted">Fill in the blanks as you watch — the answers are underlined on the screen. ${s.handout.pages === 1 ? "One page" : s.handout.pages + " pages"}, PDF.</p>
          <a class="btn btn-primary" href="${esc(s.handout.href)}" download>Seminar ${n} handout</a>
        </div>
      </div>` : "";

    const quiz = hasQuiz ? `
      <section class="quiz card" id="quiz" aria-labelledby="quiz-h">
        <h2 id="quiz-h">Check what you learned</h2>
        <p class="muted">Every question is one of the blanks on the handout. You need ${Math.ceil(s.quiz.length * D.passMark)} of ${s.quiz.length} right to complete this seminar — you can try as often as you like.</p>
        <form id="quiz-form">
          ${s.quiz.map((q, qi) => `<fieldset class="quiz-q"><legend>${qi + 1}. ${esc(q.q)}</legend>
            ${q.c.map((c, ci) => `<label class="quiz-opt"><input type="radio" name="q${qi}" value="${ci}" required> <span>${esc(c)}</span></label>`).join("")}
          </fieldset>`).join("")}
          <div class="btn-row"><button class="btn btn-primary" type="submit">Check my answers</button>${quizState.passed ? `<span class="quiz-passed">Passed${quizState.best != null ? ` · best ${quizState.best}/${s.quiz.length}` : ""}</span>` : ""}</div>
          <p class="quiz-result" id="quiz-result" role="status" aria-live="polite"></p>
        </form>
      </section>` : "";

    const complete = `<div class="card lesson-complete" id="complete-card">
      ${done
        ? `<h2>Seminar ${n} complete</h2><p class="muted">Completed ${esc(fmtDate(P.done[n]))}.</p>`
        : `<h2>Finish this seminar</h2><p class="muted">${hasQuiz ? (canComplete ? "Quiz passed. Mark the seminar complete to open the next one." : "Watch the video and pass the quiz above, then mark the seminar complete.") : "When you have watched the video, mark the seminar complete to open the next one."}</p>`}
      <div class="btn-row">
        ${done ? "" : `<button class="btn btn-primary" type="button" id="mark-complete" ${canComplete ? "" : "disabled"}>Mark seminar ${n} complete</button>`}
        ${done && next ? `<a class="btn btn-primary" href="${lessonURL(next)}">Next: Seminar ${next.n} · ${esc(next.title)} →</a>` : ""}
        ${done && !next ? `<a class="btn btn-primary" href="certificate.html">Print your certificate</a>` : ""}
      </div>
    </div>`;

    const nav = `<nav class="lesson-nav" aria-label="Seminars">
      <span>${prev ? `<a href="${lessonURL(prev)}"><span class="lbl">Previous</span>← ${prev.n} · ${esc(prev.title)}</a>` : `<a href="seminars.html"><span class="lbl">Course</span>← All seminars</a>`}</span>
      <span class="center"><a href="seminars.html">Seminar ${n} of ${TOTAL}</a></span>
      <span>${next ? (isUnlocked(next.n) ? `<a href="${lessonURL(next)}" style="text-align:right"><span class="lbl">Next</span>${next.n} · ${esc(next.title)} →</a>` : `<span class="muted locked-next" style="text-align:right"><span class="lbl">Next</span>${next.n} · ${esc(next.title)} 🔒</span>`) : ""}</span>
    </nav>`;

    out.innerHTML = `<div class="wrap lesson-wrap">
      ${head}
      ${video}
      <div class="lesson-cols">
        <div class="prose lesson-main">
          ${body}
          ${scriptures}
          ${reflect}
        </div>
        <aside class="lesson-side">
          ${handout}
          <div class="card">${progressBar()}<a class="small" href="seminars.html">All seminars</a></div>
          ${quiz}
          ${complete}
        </aside>
      </div>
      ${nav}
    </div>`;

    // quiz behaviour
    const form = $("#quiz-form");
    if (form) {
      // restore a passed quiz's last answers? keep it simple: fresh each visit.
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let right = 0;
        s.quiz.forEach((q, qi) => {
          const fs = form.querySelectorAll(".quiz-q")[qi];
          const picked = form.querySelector(`input[name="q${qi}"]:checked`);
          fs.classList.remove("is-right", "is-wrong");
          const ok = picked && parseInt(picked.value, 10) === q.a;
          if (ok) right++;
          fs.classList.add(ok ? "is-right" : "is-wrong");
        });
        const need = Math.ceil(s.quiz.length * D.passMark);
        const passed = right >= need;
        const prevBest = (P.quiz[n] || {}).best || 0;
        P.quiz[n] = { best: Math.max(prevBest, right), passed: passed || !!(P.quiz[n] || {}).passed, at: todayISO() };
        save(P);
        const res = $("#quiz-result");
        res.textContent = passed
          ? `${right} of ${s.quiz.length} right — passed. You can now mark the seminar complete.`
          : `${right} of ${s.quiz.length} right. You need ${need}. The questions you missed are marked — have another look at the video and try again.`;
        res.className = "quiz-result " + (passed ? "ok" : "no");
        const btn = $("#mark-complete");
        if (btn && passed) { btn.disabled = false; $("#complete-card .muted").textContent = "Quiz passed. Mark the seminar complete to open the next one."; }
        if (passed) $("#complete-card").scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }
    const mark = $("#mark-complete");
    if (mark) mark.addEventListener("click", () => {
      if (mark.disabled) return;
      P.done[n] = todayISO(); save(P); renderLesson();
      const card = $("#complete-card"); if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- certificate ---------- */
  function renderCertificate() {
    const out = $("#certificate"); if (!out) return;
    const preview = new URLSearchParams(location.search).get("preview") === "1";
    if (!allDone() && !preview) {
      const next = nextSeminar();
      out.innerHTML = `<div class="wrap"><div class="card" style="max-width:40rem">
        <h2>Not quite yet</h2>
        ${progressBar()}
        <p>Your certificate will be ready when all ${TOTAL} seminars are complete.</p>
        <div class="btn-row"><a class="btn btn-primary" href="${lessonURL(next)}">Continue: Seminar ${next.n} · ${esc(next.title)}</a><a class="btn btn-quiet" href="seminars.html">All seminars</a></div>
      </div></div>`;
      return;
    }
    const dates = Object.values(P.done).sort();
    const finished = dates.length ? fmtDate(dates[dates.length - 1]) : fmtDate(todayISO());
    const name = P.name || "";
    out.innerHTML = `<div class="wrap cert-wrap">
      <div class="cert-controls card no-print">
        <div class="field"><label for="cert-name">Your name as it should appear</label><input id="cert-name" type="text" autocomplete="name" value="${esc(name)}" placeholder="Type your name"></div>
        <div class="btn-row"><button class="btn btn-primary" type="button" id="cert-print">Print or save as PDF</button><a class="btn btn-quiet" href="seminars.html">Back to the course</a></div>
        <p class="small muted">In the print dialog choose "Save as PDF" to keep a copy. ${preview && !allDone() ? "<strong>Preview only</strong> — the course is not yet complete." : ""}</p>
      </div>
      <div class="cert" id="cert-sheet">
        <div class="cert-inner">
          <p class="cert-top">EPHOD Church Strengthening Seminars</p>
          <h1 class="cert-title">Certificate of Completion</h1>
          <p class="cert-presented">This certifies that</p>
          <p class="cert-name" id="cert-name-out">${esc(name) || "&nbsp;"}</p>
          <p class="cert-text">has completed all thirteen seminars of the EPHOD course on being a disciple and a disciple maker of Jesus Christ — <em>Every Person, Household, Oikos, Discipled</em> — including Purpose, Pattern, Plan, Process, Power, Magnify, Membership, Maturity, Ministry, Monitor, Management, Mission and Mabuhay.</p>
          <p class="cert-verse">“If you hold to my teaching, you are really my disciples.” — John 8:31</p>
          <div class="cert-sign">
            <div><span class="line"></span><span>Rev. Herb Johnson</span></div>
            <div><span class="line"></span><span>Rev. Karen Johnson</span></div>
            <div><span class="line"></span><span>Date completed<br><strong>${esc(finished)}</strong></span></div>
          </div>
          <p class="cert-foot">ephodlifestyle.com · EPHOD Discipleship</p>
        </div>
      </div>
    </div>`;
    const inp = $("#cert-name"), outName = $("#cert-name-out");
    inp.addEventListener("input", () => { outName.innerHTML = esc(inp.value) || "&nbsp;"; P.name = inp.value; save(P); });
    $("#cert-print").addEventListener("click", () => window.print());
  }

  document.addEventListener("DOMContentLoaded", () => {
    const p = document.body.dataset.page;
    if (p === "seminars") renderHome();
    else if (p === "seminar") renderLesson();
    else if (p === "certificate") renderCertificate();
  });
})();
