/* Shared helpers for the three entry pages */
(function () {
  "use strict";
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  try { document.documentElement.setAttribute("data-theme", localStorage.getItem("ephod-theme") || "morning"); } catch (e) {}

  async function api(action, params, post) {
    const url = new URL("api.php", location.href); url.searchParams.set("action", action);
    let r;
    if (post instanceof FormData) r = await fetch(url, { method: "POST", body: post });
    else if (post) r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(post) });
    else { Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v)); r = await fetch(url); }
    let j; try { j = await r.json(); } catch (e) { throw new Error("The server didn't answer properly (HTTP " + r.status + ")."); }
    if (!j.success) throw new Error(j.error || "Something went wrong");
    return j;
  }
  function status(el, kind, msg) { el.className = "status " + kind; el.textContent = msg; }
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function dayOfYear(d) { if (d.getMonth() === 1 && d.getDate() === 29) return 366; let n = 0; for (let i = 0; i < d.getMonth(); i++) n += MDAYS[i]; return n + d.getDate(); }
  function dayLabel(day) { if (day === 366) return "February 29"; let m = 0, d = day; while (d > MDAYS[m]) { d -= MDAYS[m]; m++; } return MONTHS[m] + " " + d; }
  function versesHTML(vs) { return vs.map((v) => `<sup>${v.number}</sup>${esc(v.text).trim()}`).join(" "); }

  /* Book / chapter / verse picker shared by memory verse and Gold Nugget */
  async function makePicker(root) {
    const book = $("select[name=book]", root), ch = $("select[name=chapter]", root), v1 = $("select[name=verse]", root), v2 = $("select[name=lastverse]", root), ver = $("select[name=version]", root);
    const [b, v] = await Promise.all([api("get_books"), api("get_versions")]);
    book.innerHTML = b.books.map((x) => `<option value="${esc(x.id)}">${esc(x.book)}</option>`).join("");
    ver.innerHTML = v.versions.map((x) => `<option value="${esc(x.table)}">${esc(x.label)}</option>`).join("");
    const fill = (sel, n, zero) => { sel.innerHTML = (zero ? `<option value="0">— single verse —</option>` : "") + Array.from({ length: n }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join(""); };
    async function onBook() { const j = await api("get_chapters", { book: book.value }); fill(ch, j.chapters); await onChapter(); }
    async function onChapter() { const j = await api("get_verses", { book: book.value, chapter: ch.value }); fill(v1, j.verses); fill(v2, j.verses, true); }
    book.addEventListener("change", onBook); ch.addEventListener("change", onChapter);
    await onBook();
    return {
      values: () => ({ book: book.value, chapter: ch.value, verse: v1.value, lastverse: v2.value, version: ver.value }),
      async set(e) { if (!e) return; book.value = e.book; await onBook(); ch.value = e.chapter; await onChapter(); v1.value = e.verse; v2.value = e.lastverse || "0"; if (e.version) ver.value = e.version; },
      async preview(target) {
        const p = this.values(); target.innerHTML = `<p class="loading">Loading preview…</p>`;
        try { const j = await api("preview", p); target.innerHTML = j.previews.map((x) => `<div class="pv"><span class="lbl">${esc(x.label)}</span>${versesHTML(x.verses)}</div>`).join("") || "<p>No text found for that reference.</p>"; }
        catch (err) { target.innerHTML = `<p class="danger">${esc(err.message)}</p>`; }
      }
    };
  }

  window.EPHOD_ADMIN = { $, $$, esc, api, status, makePicker, MONTHS, MDAYS, dayOfYear, dayLabel, versesHTML };
})();
