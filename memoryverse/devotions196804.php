<!doctype html>
<html lang="en" data-theme="classic">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Devotions — EPHOD entry page</title>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/themes.css?v=4b88e193"><link rel="stylesheet" href="../css/site.css?v=5829af10"><link rel="stylesheet" href="admin.css?v=805be1d9">
</head>
<body>
<header class="site-header"><a class="banner-wrap" href="../index.html" aria-label="EPHOD — Every Person Household Oikos Discipled"><span class="banner" aria-hidden="true"></span></a></header>
<div class="admin-wrap">
  <div class="admin-head">
    <h1>Devotions</h1>
    <nav><a href="memoryverse196804.php">Memory verse</a><a href="../devotions.html">View on website</a></nav>
  </div>

  <div class="admin-cols">
  <div class="admin-col">
  <div class="panel" id="editor-panel">
    <h2 id="editor-title">New devotion</h2>
    <form id="form">
      <p class="muted" style="margin:0 0 .25rem">Devotion for next week</p>
      <h2 id="week-range" style="margin:0 0 .75rem">…</h2>
      <input id="f-date" name="date" type="hidden">
      <div class="row">
        <div class="field grow"><label for="f-title">Title</label><input id="f-title" name="title" required maxlength="255" placeholder="Checkmate"></div>
      </div>
      <div class="row" style="margin-top:.75rem">
        <div class="field grow"><label for="f-reading">Reading (the passage this devotion goes with)</label><input id="f-reading" name="reading" maxlength="255" placeholder="Isaiah 36:1 through 38:22"></div>
      </div>
      <div class="field" style="margin-top:.75rem">
        <label for="f-body">Text</label>
        <div class="toolbar" role="toolbar" aria-label="Formatting">
          <button type="button" data-cmd="bold"><strong>Bold</strong></button>
          <button type="button" data-cmd="italic"><em>Italic</em></button>
          <button type="button" data-cmd="clear">Clear formatting</button>
        </div>
        <div id="f-body" class="editor" contenteditable="true" aria-label="Devotion text"></div>
        <p class="help">Paste the devotion in. The Scripture quotation (the paragraph that ends with its reference, like <em>(Isaiah 36:1–2)</em>) and the closing line (<strong>THOUGHT FOR TODAY</strong>, <strong>PRAYER SUGGESTION</strong>, <strong>CHALLENGE FOR THE DAY</strong> and so on) are styled automatically when you publish. The "Read …" line and the Gospel Publishing House copyright are added by the website — don't type them.</p>
      </div>
      <div class="row" style="margin-top:.75rem">
        <div class="field"><label for="f-image">Photo (optional, JPG or PNG)</label><input id="f-image" name="image" type="file" accept="image/jpeg,image/png,image/webp"></div>
        <div class="field"><label><input type="checkbox" id="f-remove"> Remove current photo</label></div>
        <div class="field"><label><input type="checkbox" id="f-published" checked> Show on the website</label></div>
      </div>
      <img id="f-thumb" class="thumb-preview" alt="" hidden>
      <div class="btn-row" style="margin-top:1rem">
        <button type="button" class="btn btn-quiet" id="preview-btn">Preview</button><button type="submit" class="btn btn-primary" id="save-btn">Publish</button>
        <button type="button" class="btn btn-quiet" id="new-btn">Start a new one</button>
        <button type="button" class="btn btn-quiet danger" id="delete-btn" hidden>Delete this devotion</button>
      </div>
      <div id="status" class="status"></div>
    </form>
    <p class="help" style="margin-top:.75rem">Need to correct the one you just published? <a href="#" id="edit-latest">Open the latest devotion</a></p>
  </div>


  <div class="panel help">
    <h2>Each week</h2>
    <ol>
      <li>This page is always for <strong>next week</strong> — the dates at the top. Type the title.</li>
      <li>Type the reading reference, for example <em>Isaiah 36:1 through 38:22</em>.</li>
      <li>Paste the devotion text. The Scripture quotation and the closing line (Thought, Prayer, Challenge…) are styled for you.</li>
      <li>Add a photo if you have one. Press <strong>Preview</strong> to see it on the right exactly as the website will show it, then <strong>Publish</strong>. It is saved now and appears on the website and in the apps when its week begins (Monday, 12:00 am Manila time).</li>
    </ol>
    <p>To fix something after publishing, press <strong>Open the latest devotion</strong> under the form, make the change, and press Publish again.</p>
  </div>
  <figure class="admin-photo" id="past-photo" hidden><img alt=""><figcaption></figcaption></figure>
  </div>
  <aside class="admin-col preview-col">
    <div class="panel preview-panel">
      <p class="muted" style="margin:0 0 .5rem">Preview — how it will look on the website</p>
      <article class="article" id="preview-article"><p class="muted"><em>Press <strong>Preview</strong> to see the devotion here.</em></p></article>
    </div>
  </aside>
  </div>
</div>
<script src="admin.js?v=503bfe39"></script>
<script>
(async () => {
  const A = window.EPHOD_ADMIN, { $, $$, esc, api, status } = A;
  const form = $("#form"), body = $("#f-body"), st = $("#status"), thumb = $("#f-thumb"), delBtn = $("#delete-btn");
  let id = 0;
  function nextSunday() { const d = new Date(); d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7)); return d.toISOString().slice(0, 10); }
  // the devotion is posted on Sunday for the Monday–Sunday week that follows
  function showWeek(dateStr) {
    const d = new Date(dateStr + "T12:00:00"), a = new Date(d); a.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
    const b = new Date(a); b.setDate(a.getDate() + 6);
    const m = (x) => x.toLocaleDateString(undefined, { month: "long", day: "numeric" });
    $("#week-range").textContent = `${m(a)} – ${m(b)}, ${b.getFullYear()}`;
  }
  function reset() {
    id = 0; form.reset(); body.innerHTML = ""; $("#f-date").value = nextSunday(); showWeek($("#f-date").value); thumb.hidden = true; delBtn.hidden = true;
    $("#editor-title").textContent = "New devotion"; st.className = "status"; window.scrollTo({ top: 0 });
  }
  async function edit(i) {
    const j = await api("devo_get", { id: i }); const d = j.devotion; id = d.id;
    $("#f-title").value = d.title; $("#f-date").value = d.post_date; showWeek(d.post_date); $("#f-reading").value = d.reading || ""; body.innerHTML = d.body || "";
    $("#f-published").checked = +d.published === 1; $("#f-remove").checked = false; $("#f-image").value = "";
    if (d.image) { thumb.src = "../" + d.image + "?v=" + Date.now(); thumb.hidden = false; } else thumb.hidden = true;
    delBtn.hidden = false; $("#editor-title").textContent = "Editing: " + d.title; st.className = "status"; window.scrollTo({ top: 0 });
  }
  $$(".toolbar button").forEach((b) => b.addEventListener("click", () => {
    body.focus(); const c = b.dataset.cmd;
    if (c === "bold" || c === "italic") document.execCommand(c);
    else if (c === "clear") document.execCommand("removeFormat");
    else if (c === "verse") { document.execCommand("bold"); document.execCommand("italic"); }
  }));
  // Style the Scripture quotation and the THOUGHT FOR TODAY line the way the GPH devotions are set,
  // so nobody has to press a formatting button.
  const REF = /\(\s*(?:[1-3]\s*)?[A-Z][A-Za-z]+\.?(?:\s+of\s+[A-Z][a-z]+)?\s+\d+:\d+(?:[–-]\d+(?::\d+)?)?(?:,\s*\d+(?:[–-]\d+)?)*\s*(?:[A-Z]{2,6})?\s*\)\s*\.?\s*$/;
  function autoFormat() {
    body.querySelectorAll("p, div").forEach((p) => {
      const t = p.textContent.replace(/\s+/g, " ").trim(); if (!t) return;
      // closing labels come in many forms: THOUGHT FOR TODAY, PRAYER SUGGESTION, CHALLENGE FOR THE DAY, ACTION STEP ...
      // = a short ALL-CAPS label ending in a colon, or one of the usual words followed by up to a few more words and a colon
      const m = t.match(/^((?:thought|challenge|prayer|action|question|reflection|application|suggestion|memory\s+verse)(?:\s+[a-z']+){0,4})\s*:\s*/i)
             || t.match(/^([A-Z][A-Z'’&\-]*(?:\s+[A-Z][A-Z'’&\-]*){0,4})\s*:\s*/)
             || t.match(/^((?:thought|challenge|prayer|action|question)\s+for\s+(?:the\s+)?(?:day|today))\s*/i);
      if (m && m[1].length <= 40) {
        const rest = esc(t.slice(m[0].length).trim());
        p.innerHTML = "<strong>" + esc(m[1].toUpperCase().replace(/\s+/g, " ")) + ":</strong> <strong><em>" + rest + "</em></strong>";
      } else if (REF.test(t) && !p.querySelector("strong > em, em > strong")) {
        p.innerHTML = "<strong><em>" + esc(t) + "</em></strong>";
      }
    });
  }
  body.addEventListener("paste", (e) => { e.preventDefault(); const t = (e.clipboardData || window.clipboardData).getData("text/plain"); const html = t.split(/\n\s*\n/).map((p) => "<p>" + esc(p.trim()).replace(/\n/g, "<br>") + "</p>").join(""); document.execCommand("insertHTML", false, html); });
  $("#f-image").addEventListener("change", () => { const f = $("#f-image").files[0]; if (f) { thumb.src = URL.createObjectURL(f); thumb.hidden = false; } });
  $("#edit-latest").addEventListener("click", async (e) => { e.preventDefault(); try { const j = await api("devo_list", { limit: 1 }); if (j.devotions[0]) edit(+j.devotions[0].id); } catch (err) { status(st, "err", err.message); } });
  function preview() {
    autoFormat();
    const f = $("#f-image").files[0], img = f ? URL.createObjectURL(f) : (thumb.hidden || $("#f-remove").checked ? "" : thumb.src);
    const d = $("#f-date").value, dt = new Date(d + "T12:00:00"), a = new Date(dt); a.setDate(dt.getDate() + ((8 - dt.getDay()) % 7 || 7)); const b = new Date(a); b.setDate(a.getDate() + 6);
    const m = (x) => x.toLocaleDateString(undefined, { month: "long", day: "numeric" });
    let html = body.innerHTML.replace(/<div>/g, "<p>").replace(/<\/div>/g, "</p>"); if (!/<p|<h3|<blockquote/.test(html)) html = "<p>" + html + "</p>";
    $("#preview-article").innerHTML = `
      ${img ? `<div class="article-hero"><img src="${img}" alt=""></div>` : ""}
      <p class="meta">Week of ${m(a)} to ${m(b)}, ${b.getFullYear()}</p>
      <h1>${esc($("#f-title").value || "(no title yet)")}</h1>
      ${$("#f-reading").value ? `<p class="read-line">Read ${esc($("#f-reading").value)}</p>` : ""}
      <div class="article-body">${html}</div>
      <p class="copyright-note">© Gospel Publishing House, 1445 N. Boonville Ave., Springfield, Missouri 65802. Used by permission.</p>`;
  }
  $("#preview-btn").addEventListener("click", preview);
  $("#new-btn").addEventListener("click", reset);
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault(); status(st, "busy", "Saving…");
    const fd = new FormData(); fd.set("id", id); fd.set("title", $("#f-title").value); fd.set("date", $("#f-date").value); fd.set("reading", $("#f-reading").value);
    autoFormat();
    let html = body.innerHTML.replace(/<div>/g, "<p>").replace(/<\/div>/g, "</p>"); if (!/<p|<h3|<blockquote/.test(html)) html = "<p>" + html + "</p>";
    fd.set("body", html); fd.set("published", $("#f-published").checked ? "1" : "0"); fd.set("remove_image", $("#f-remove").checked ? "1" : "0");
    const f = $("#f-image").files[0]; if (f) fd.set("image", f);
    try { const j = await api("devo_save", null, fd); id = j.id; status(st, "ok", j.message); delBtn.hidden = false; $("#editor-title").textContent = "Editing: " + $("#f-title").value; preview(); }
    catch (err) { status(st, "err", err.message); }
  });
  delBtn.addEventListener("click", async () => {
    if (!id || !confirm("Delete this devotion from the website? This can't be undone.")) return;
    try { const j = await api("devo_delete", null, { id }); reset(); status(st, "ok", j.message);  } catch (err) { status(st, "err", err.message); }
  });
  reset();
  // a different past devotion photo each time, just for the look of it
  try {
    const idx = await (await fetch("../data/devotions/index.json?x=" + Date.now(), { cache: "no-store" })).json();
    const withPhoto = idx.filter((d) => d.image);
    if (withPhoto.length) {
      const d = withPhoto[Math.floor(Math.random() * withPhoto.length)], fig = $("#past-photo");
      fig.querySelector("img").src = "../" + d.image; fig.querySelector("figcaption").textContent = d.title + " · " + d.date;
      fig.querySelector("img").alt = d.title; fig.hidden = false;
    }
  } catch (e) {}
})();
</script>
</body>
</html>
