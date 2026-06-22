/* =====================================================================
   review-mode.js — drop-in "Review & edit" overlay for html-explainer pages

   WHAT IT IS
   A self-contained client-side overlay that lets a reader edit or annotate
   an explainer in-place, then export the result — the front end of the
   Phase 6 revise loop. No server. Works deployed or from a local file.

   HOW TO USE (two steps)
   1. Paste this entire block inside a <script> just before </body> in the
      built HTML. It injects its own <style> and builds its own UI; there is
      nothing else to wire up.
   2. If the page has its own keyboard handler (e.g. a slide deck), add
      `|| e.target.isContentEditable` to its "am I typing?" guard so editing
      text doesn't trigger navigation. (Scrolling pages usually need nothing.)

   ACTIVATION
   - Deployed: append `?edit` to the URL. Hand reviewers a *labelled* link
     (View = the plain URL; Review & edit = the URL + `?edit`).
   - Local file (no second URL to give out): add the attribute
     `<body data-review-toggle>` and a prominent top-right "Review & edit"
     button appears that turns the toolbar on.

   OPTIONAL DECK HOOK
   - On a deck where off-screen sections can't be reached by scrollIntoView,
     define `window.reviewGoto = note => goToSlide(note.slideIdx)` so the
     panel's "jump to annotation" works. (Store slideIdx on the note via the
     same hook if you need it.) Falls back to scrollIntoView otherwise.

   LIMITS (state these in the hand-off)
   - Edits/notes are per-browser: no shared live document, no server save
     (localStorage is best-effort and not always available on file://).
   - `contenteditable` edits the rendered markup, NOT JS-rendered content
     (quiz/demo data arrays) — route those changes through the *note* path.
   ===================================================================== */
(function () {
  "use strict";
  var qs = new URLSearchParams(location.search);
  var viaQuery = qs.has("edit");
  var viaToggle = document.body.hasAttribute("data-review-toggle");
  if (!viaQuery && !viaToggle) return;

  // ---- styles (use the page's design tokens, with fallbacks) ----
  var css = [
    "body.rv-on #topbar{top:46px}", // example: offset a known fixed header; harmless if absent
    "body.rv-pad{padding-top:46px}", // scrolling pages: push content below the toolbar (decks skip this)
    "#rv-bar{position:fixed;top:0;left:0;right:0;min-height:46px;z-index:80;display:flex;align-items:center;gap:10px;padding:6px 14px;background:#23211c;color:#f6f3ec;font-family:var(--sans,system-ui,sans-serif);font-size:13px;box-shadow:0 2px 12px rgba(0,0,0,.25);flex-wrap:wrap}",
    "#rv-bar .rv-tag{font-family:var(--mono,ui-monospace,monospace);font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#e6b566;display:flex;align-items:center;gap:7px}",
    "#rv-bar .rv-tag::before{content:'';width:7px;height:7px;border-radius:50%;background:#e6b566}",
    ".rv-seg{display:inline-flex;border:1px solid #4a463d;border-radius:8px;overflow:hidden}",
    ".rv-seg button{background:none;border:none;color:#cfc9bb;font-family:inherit;font-size:12px;padding:6px 11px;cursor:pointer}",
    ".rv-seg button.on{background:#e6b566;color:#23211c;font-weight:600}",
    ".rv-act{background:#3a362e;border:1px solid #4a463d;color:#f6f3ec;font-family:inherit;font-size:12px;padding:6px 11px;border-radius:8px;cursor:pointer}",
    ".rv-act:hover{background:#4a463d}",
    "#rv-bar .rv-spacer{flex:1}",
    "#rv-bar .rv-exit{color:#cfc9bb;text-decoration:none;font-size:12px;border-bottom:1px dashed #6a6456;cursor:pointer}",
    "#rv-launch{position:fixed;top:14px;right:14px;z-index:81;background:#b9772a;color:#fff;border:none;border-radius:24px;padding:11px 18px;font-family:var(--sans,system-ui,sans-serif);font-size:13.5px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.28);display:inline-flex;align-items:center;gap:7px}",
    "#rv-launch:hover{background:#a3641f}",
    "#rv-launch svg{display:block}",
    "body.rv-mode-edit [data-rv-edit]:hover{outline:2px dashed #1f6f8b;outline-offset:3px;cursor:text}",
    "body.rv-mode-edit [data-rv-edit]:focus{outline:2px solid #1f6f8b;outline-offset:3px;background:rgba(31,111,139,.06)}",
    "body.rv-mode-note .rv-target:hover{cursor:crosshair;outline:1px dashed #b9772a;outline-offset:2px}",
    ".rv-annotated{outline:2px dashed #b9772a !important;outline-offset:3px;background:rgba(185,119,42,.09)}",
    ".rv-flash{animation:rvflash 1.2s ease}",
    "@keyframes rvflash{0%,100%{background:transparent}30%{background:rgba(230,181,102,.35)}}",
    "#rv-notes{position:fixed;top:46px;right:0;bottom:0;width:330px;max-width:86vw;z-index:79;background:var(--card,#fffdf8);border-left:1px solid var(--line-strong,#c8bfab);box-shadow:-6px 0 24px rgba(0,0,0,.08);transform:translateX(100%);transition:transform .25s;display:flex;flex-direction:column}",
    "#rv-notes.open{transform:none}",
    "#rv-notes h4{font-family:var(--display,Georgia,serif);font-size:16px;margin:0;padding:16px 18px 10px;color:var(--ink,#23211c)}",
    "#rv-notes .rv-list{flex:1;overflow:auto;padding:0 14px 14px}",
    "#rv-notes .rv-empty{color:var(--ink-faint,#8a8478);font-size:13px;padding:10px 4px;font-style:italic;line-height:1.5}",
    ".rv-note{border:1px solid var(--line,#ddd5c5);border-radius:10px;padding:11px 12px;margin-bottom:9px;background:var(--card,#fffdf8)}",
    ".rv-note .rv-loc{font-family:var(--mono,ui-monospace,monospace);font-size:10px;letter-spacing:.5px;text-transform:uppercase;color:var(--augment,#b9772a);cursor:pointer}",
    ".rv-note .rv-ex{font-size:12px;color:var(--ink-faint,#8a8478);margin:4px 0;line-height:1.4}",
    ".rv-note .rv-txt{font-size:13.5px;color:var(--ink,#23211c);line-height:1.45}",
    ".rv-note .rv-del{float:right;border:none;background:none;color:var(--ink-faint,#8a8478);cursor:pointer;font-size:15px;line-height:1}",
    "#rv-pop{position:fixed;z-index:90;width:280px;background:var(--card,#fffdf8);border:1px solid var(--line-strong,#c8bfab);border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.18);padding:12px;display:none}",
    "#rv-pop.open{display:block}",
    "#rv-pop .rv-ex{font-size:11.5px;color:var(--ink-faint,#8a8478);margin-bottom:8px;line-height:1.4;max-height:48px;overflow:hidden}",
    "#rv-pop textarea{width:100%;height:74px;resize:vertical;font-family:var(--sans,system-ui,sans-serif);font-size:13px;border:1px solid var(--line-strong,#c8bfab);border-radius:8px;padding:8px;box-sizing:border-box}",
    "#rv-pop .rv-pop-act{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}",
    "#rv-pop button{font-family:var(--sans,system-ui,sans-serif);font-size:12px;padding:6px 12px;border-radius:7px;cursor:pointer;border:1px solid var(--line-strong,#c8bfab);background:var(--card,#fffdf8)}",
    "#rv-pop button.rv-save{background:#b9772a;color:#fff;border-color:#b9772a}",
    ".rv-toast{position:fixed;bottom:82px;left:50%;transform:translateX(-50%);background:#23211c;color:#f6f3ec;font-size:13px;padding:9px 16px;border-radius:20px;z-index:95;opacity:0;transition:opacity .25s;pointer-events:none}",
    ".rv-toast.show{opacity:1}",
    "#rv-fallback{position:fixed;inset:0;z-index:96;background:rgba(35,33,28,.5);display:none;align-items:center;justify-content:center;padding:24px}",
    "#rv-fallback.open{display:flex}",
    "#rv-fallback .rv-fb-card{background:var(--card,#fffdf8);border-radius:12px;padding:16px;max-width:560px;width:100%}",
    "#rv-fallback textarea{width:100%;height:240px;font-family:var(--mono,ui-monospace,monospace);font-size:12px;box-sizing:border-box}"
  ].join("\n");
  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // state must be initialised before activate() can render
  var built = false, mode = "interact", pendingEl = null, notes = load();

  function $(id) { return document.getElementById(id); }

  // local files: show a launcher button instead of opening immediately
  if (viaToggle && !viaQuery) {
    var launch = document.createElement("button");
    launch.id = "rv-launch";
    launch.setAttribute("aria-label", "Review & edit this page");
    launch.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span>Review &amp; edit</span>';
    launch.onclick = function () { launch.remove(); activate(); };
    document.body.appendChild(launch);
  } else {
    activate();
  }

  function activate() {
    document.body.classList.add("rv-on");
    if (!document.querySelector(".slide,[data-deck]")) document.body.classList.add("rv-pad");
    if (built) return;
    built = true;
    markEditable();
    buildToolbar();
    buildPanel();
    buildPopover();
    buildFallback();
    renderNotes();
  }

  // ---- editable prose (broad, but never controls or the review UI) ----
  function markEditable() {
    // Skip the overlay's own UI, interactive controls, and anything already
    // covered by an editable ancestor (so we don't double-mark nested text).
    var skip = "#rv-bar,#rv-notes,#rv-pop,#rv-fallback,#rv-launch,button,a,input,textarea,select,label,[data-rv-edit],[contenteditable],[data-rv-edit-exclude]";
    function mark(el) {
      if (el.closest(skip)) return;
      el.setAttribute("data-rv-edit", "");
    }
    // 1) Known text-bearing elements (broadened well past the old p/h/li set:
    //    table cells, summaries, definition lists, captions all hold prose too).
    var sel = "h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,figure,summary,caption,td,th,dt,dd,[data-rv-edit-include]";
    Array.prototype.forEach.call(document.querySelectorAll(sel), mark);
    // 2) Generic containers (div/section/etc.) that hold their OWN text directly
    //    rather than via a block child — extremely common in AI-generated markup,
    //    and the reason "some text wasn't editable". Only mark the ones with loose
    //    text so we don't turn whole layout wrappers into one big editable blob.
    Array.prototype.forEach.call(
      document.querySelectorAll("div,section,article,header,footer,main,aside,span"),
      function (el) {
        var ownText = Array.prototype.some.call(el.childNodes, function (n) {
          return n.nodeType === 3 && n.textContent.trim();
        });
        if (ownText) mark(el);
      }
    );
  }

  function buildToolbar() {
    var bar = document.createElement("div");
    bar.id = "rv-bar";
    bar.innerHTML =
      '<span class="rv-tag">Review mode</span>' +
      '<div class="rv-seg" id="rv-seg">' +
        '<button data-mode="interact" class="on">Preview</button>' +
        '<button data-mode="edit">Edit text</button>' +
        '<button data-mode="note">Add note</button>' +
      "</div>" +
      '<span class="rv-spacer"></span>' +
      '<button class="rv-act" id="rv-toggle-notes">Notes (0)</button>' +
      '<button class="rv-act" id="rv-copy">Copy notes for LLM</button>' +
      '<button class="rv-act" id="rv-download">Download edits</button>' +
      '<span class="rv-exit" id="rv-exit">Exit</span>';
    document.body.appendChild(bar);
    Array.prototype.forEach.call(bar.querySelectorAll("#rv-seg button"), function (b) {
      b.onclick = function () { setMode(b.dataset.mode); };
    });
    $("rv-toggle-notes").onclick = function () { $("rv-notes").classList.toggle("open"); };
    $("rv-copy").onclick = copyBrief;
    $("rv-download").onclick = downloadEdits;
    $("rv-exit").onclick = function () {
      if (viaQuery) location.href = location.pathname; // drop ?edit
      else { document.body.classList.remove("rv-on", "rv-mode-edit", "rv-mode-note"); setMode("interact"); $("rv-bar").style.display = "none"; }
    };
  }

  function buildPanel() {
    var p = document.createElement("div");
    p.id = "rv-notes";
    p.innerHTML = '<h4>Annotations</h4><div class="rv-list" id="rv-list"></div>';
    document.body.appendChild(p);
  }

  function buildPopover() {
    var pop = document.createElement("div");
    pop.id = "rv-pop";
    pop.innerHTML =
      '<div class="rv-ex" id="rv-pop-ex"></div>' +
      '<textarea id="rv-pop-ta" placeholder="What should change here?"></textarea>' +
      '<div class="rv-pop-act"><button id="rv-pop-cancel">Cancel</button>' +
      '<button class="rv-save" id="rv-pop-save">Save note</button></div>';
    document.body.appendChild(pop);
    $("rv-pop-cancel").onclick = closePop;
    $("rv-pop-save").onclick = saveNote;
  }

  function buildFallback() {
    var f = document.createElement("div");
    f.id = "rv-fallback";
    f.innerHTML = '<div class="rv-fb-card"><p style="margin:0 0 8px;font-family:var(--sans,sans-serif);font-size:13px">Copy the revision brief below (clipboard was blocked):</p><textarea id="rv-fb-ta" readonly></textarea><div style="text-align:right;margin-top:8px"><button class="rv-act" id="rv-fb-close" style="background:#23211c">Close</button></div></div>';
    document.body.appendChild(f);
    $("rv-fb-close").onclick = function () { f.classList.remove("open"); };
  }

  function setMode(m) {
    mode = m;
    document.body.classList.toggle("rv-mode-edit", m === "edit");
    document.body.classList.toggle("rv-mode-note", m === "note");
    Array.prototype.forEach.call(document.querySelectorAll("[data-rv-edit]"), function (el) {
      el.contentEditable = (m === "edit" ? "true" : "false");
      el.classList.toggle("rv-target", m === "note");
    });
    Array.prototype.forEach.call(document.querySelectorAll("#rv-seg button"), function (b) {
      b.classList.toggle("on", b.dataset.mode === m);
    });
    if (m !== "note") closePop();
  }

  // ---- note capture (capture-phase so it beats demo handlers) ----
  document.addEventListener("click", function (e) {
    if (mode !== "note") return;
    if (e.target.closest("#rv-bar,#rv-notes,#rv-pop,#rv-fallback,#rv-launch")) return;
    var el = e.target;
    if (!el || el === document.body || el === document.documentElement) return;
    e.preventDefault(); e.stopPropagation();
    pendingEl = el;
    var ex = excerpt(el);
    $("rv-pop-ex").textContent = "“" + ex + "”";
    $("rv-pop-ta").value = "";
    openPop(e.clientX, e.clientY);
    setTimeout(function () { $("rv-pop-ta").focus(); }, 30);
  }, true);

  function saveNote() {
    var txt = $("rv-pop-ta").value.trim();
    if (!txt || !pendingEl) { closePop(); return; }
    pendingEl.classList.add("rv-annotated");
    notes.push({ loc: locate(pendingEl), excerpt: excerpt(pendingEl), note: txt, el: pendingEl });
    closePop(); save(); renderNotes();
    $("rv-notes").classList.add("open"); toast("Note added");
  }

  function openPop(x, y) {
    var pop = $("rv-pop");
    pop.classList.add("open");
    var w = 280, h = pop.offsetHeight || 190;
    pop.style.left = Math.max(12, Math.min(x, window.innerWidth - w - 12)) + "px";
    pop.style.top = Math.max(54, Math.min(y, window.innerHeight - h - 12)) + "px";
  }
  function closePop() { $("rv-pop") && $("rv-pop").classList.remove("open"); pendingEl = null; }

  function renderNotes() {
    $("rv-toggle-notes").textContent = "Notes (" + notes.length + ")";
    var list = $("rv-list");
    if (!notes.length) {
      list.innerHTML = '<div class="rv-empty">No annotations yet. Switch to “Add note”, then click any text to leave a comment for the LLM.</div>';
      return;
    }
    list.innerHTML = "";
    notes.forEach(function (n, i) {
      var d = document.createElement("div");
      d.className = "rv-note";
      d.innerHTML =
        '<button class="rv-del" title="Delete">×</button>' +
        '<div class="rv-loc">' + esc(n.loc) + "</div>" +
        '<div class="rv-ex">“' + esc(n.excerpt) + '”</div>' +
        '<div class="rv-txt">' + esc(n.note) + "</div>";
      d.querySelector(".rv-loc").onclick = function () { gotoNote(n); };
      d.querySelector(".rv-del").onclick = function () { notes.splice(i, 1); save(); renderNotes(); };
      list.appendChild(d);
    });
  }

  function copyBrief() {
    if (!notes.length) { toast("No notes yet"); return; }
    var out = "# Revision requests\n(" + notes.length + " annotation" + (notes.length > 1 ? "s" : "") + " from a reviewer)\n\n";
    notes.forEach(function (n, i) {
      out += (i + 1) + ". " + n.loc + "\n   Text: \"" + n.excerpt + "\"\n   Change: " + n.note + "\n\n";
    });
    out += "Please apply these to the source HTML, keeping the structured data arrays and CSS tokens intact, then re-screenshot to verify.";
    copy(out);
  }

  function downloadEdits() {
    var was = mode; setMode("interact");
    var clone = document.documentElement.cloneNode(true);
    rm(clone, "#rv-bar,#rv-notes,#rv-pop,#rv-fallback,#rv-launch,.rv-toast");
    Array.prototype.forEach.call(clone.querySelectorAll("[data-rv-edit]"), function (n) {
      n.removeAttribute("data-rv-edit"); n.removeAttribute("contenteditable"); n.classList.remove("rv-target");
    });
    Array.prototype.forEach.call(clone.querySelectorAll(".rv-annotated"), function (n) { n.classList.remove("rv-annotated"); });
    var b = clone.querySelector("body");
    if (b) b.classList.remove("rv-on", "rv-mode-edit", "rv-mode-note");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["<!DOCTYPE html>\n" + clone.outerHTML], { type: "text/html" }));
    a.download = (document.title || "page").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + "-edited.html";
    a.click();
    setMode(was); toast("Downloaded edited copy");
  }

  // ---- location label: nearest section heading, deck-agnostic ----
  function locate(el) {
    var sec = el.closest("section,[data-section],.slide,article");
    var head = sec && sec.querySelector("h1,h2,h3,h4");
    if (!head) head = nearestHeading(el);
    return head ? head.innerText.trim().replace(/\s+/g, " ").slice(0, 60) : "Page";
  }
  function nearestHeading(el) {
    var heads = Array.prototype.slice.call(document.querySelectorAll("h1,h2,h3,h4"))
      .filter(function (h) { return !h.closest("#rv-bar,#rv-notes,#rv-pop"); });
    var best = null;
    for (var i = 0; i < heads.length; i++) {
      var h = heads[i];
      if (h === el || (h.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) best = h;
      else break;
    }
    return best;
  }
  function gotoNote(n) {
    if (typeof window.reviewGoto === "function") { window.reviewGoto(n); return; }
    if (n.el && n.el.isConnected) {
      n.el.scrollIntoView({ behavior: "smooth", block: "center" });
      n.el.classList.add("rv-flash");
      setTimeout(function () { n.el.classList.remove("rv-flash"); }, 1200);
    }
  }

  // ---- helpers ----
  function excerpt(el) { return (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 140); }
  function esc(s) { return (s || "").replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function rm(root, sel) { Array.prototype.forEach.call(root.querySelectorAll(sel), function (n) { n.remove(); }); }
  function save() { try { localStorage.setItem("rv-notes", JSON.stringify(notes.map(function (n) { return { loc: n.loc, excerpt: n.excerpt, note: n.note }; }))); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem("rv-notes") || "[]"); } catch (e) { return []; } }
  function copy(t) {
    var ok = false;
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t); ok = true; } } catch (e) {}
    if (ok) { toast("Revision brief copied — paste it to the LLM"); }
    else { $("rv-fb-ta").value = t; $("rv-fallback").classList.add("open"); $("rv-fb-ta").select(); } // clipboard blocked (e.g. file://)
  }
  var tT;
  function toast(m) {
    var el = document.querySelector(".rv-toast");
    if (!el) { el = document.createElement("div"); el.className = "rv-toast"; document.body.appendChild(el); }
    el.textContent = m; el.classList.add("show");
    clearTimeout(tT); tT = setTimeout(function () { el.classList.remove("show"); }, 1900);
  }
})();
