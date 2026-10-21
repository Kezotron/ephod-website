<!doctype html>
<html lang="en" data-theme="classic">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>Memory verse — EPHOD entry page</title>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/themes.css?v=4b88e193"><link rel="stylesheet" href="../css/site.css?v=2a9ae95b"><link rel="stylesheet" href="admin.css?v=805be1d9">
</head>
<body>
<header class="site-header"><a class="banner-wrap" href="../index.html" aria-label="EPHOD — Every Person Household Oikos Discipled"><span class="banner" aria-hidden="true"></span></a></header>
<div class="admin-wrap">
  <div class="admin-head">
    <h1>Weekly memory verse</h1>
    <nav><a href="devotions196804.php">Devotions</a><a href="../index.html">View website</a></nav>
  </div>

  <div class="panel">
    <p class="muted" style="margin:0 0 .25rem">Memory verse for next week</p>
    <h2 id="range" style="margin:0">…</h2>
    <div id="current" class="current" style="margin-top:1rem">Loading…</div>
  </div>

  <div class="panel">
    <h2>Set the verse for this week</h2>
    <form id="form">
      <div class="row">
        <div class="field grow"><label>Book</label><select name="book"></select></div>
        <div class="field"><label>Chapter</label><select name="chapter"></select></div>
        <div class="field"><label>First verse</label><select name="verse"></select></div>
        <div class="field"><label>Last verse</label><select name="lastverse"></select></div>
        <div class="field grow"><label>Version</label><select name="version"></select></div>
      </div>
      <div class="btn-row" style="margin-top:1rem">
        <button type="button" class="btn btn-quiet" id="preview-btn">Preview in every version</button>
        <button type="submit" class="btn btn-primary">Update memory verse</button>
      </div>
      <div id="status" class="status"></div>
      <div id="preview" class="preview"></div>
    </form>
  </div>

  <div class="panel help">
    <h2>How it works</h2>
    <ol>
      <li>This page is always for <strong>next week</strong> — the dates at the top. The verse you set here appears on the website and in the apps from Monday.</li>
      <li>Choose the book, chapter and first verse. If the verse runs over several verses, choose the last verse too; leave it at "single verse" otherwise.</li>
      <li>Preview if you like, then press <strong>Update memory verse</strong>. The box at the top shows what the website and the apps will display.</li>
    </ol>
    <p>Example: John 3:16 → John, 3, 16, single verse. Psalms 103:11–12 → Psalms, 103, 11, 12.</p>
  </div>
  <figure class="admin-photo"><img src="../images/hero-bible.webp" width="1800" height="1350" alt="An open Bible under a reading lamp"></figure>
</div>
<script src="admin.js?v=503bfe39"></script>
<script>
(async () => {
  const A = window.EPHOD_ADMIN, { $, esc, api, status } = A;
  const range = $("#range"), current = $("#current"), st = $("#status");
  let picker, week = null;   // always next week; the server tells us which week that is
  async function load() {
    current.textContent = "Loading…";
    try {
      const j = await api("mv_get", {});
      week = j.week;
      range.textContent = j.range;
      if (j.exists) {
        const e = j.entry, ref = `${e.bookName || e.book} ${e.chapter}:${e.verse}${+e.lastverse ? "–" + e.lastverse : ""}`;
        current.innerHTML = (j.verses ? A.versesHTML(j.verses) : "<em>Text not available in that version</em>") + `<span class="ref">${esc(ref)} · ${esc(j.versionLabel || e.version)}</span>`;
        if (picker) await picker.set(e);
      } else {
        current.innerHTML = `<em>No memory verse set for this week yet.</em>`;
      }
    } catch (err) { current.innerHTML = `<span class="danger">${esc(err.message)}</span>`; }
  }
  await load();
  picker = await A.makePicker($("#form"));
  await load();
  $("#preview-btn").addEventListener("click", () => picker.preview($("#preview")));
  $("#form").addEventListener("submit", async (ev) => {
    ev.preventDefault(); status(st, "busy", "Saving…");
    try { const j = await api("mv_save", null, Object.assign({ week }, picker.values())); status(st, "ok", j.message + "."); await load(); }
    catch (err) { status(st, "err", err.message); }
  });
})();
</script>
</body>
</html>
