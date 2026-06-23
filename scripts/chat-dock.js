/* =====================================================================
   chat-dock.js — drop-in "Ask the page" floating chat for html-explainer

   WHAT IT IS
   A self-contained, client-side floating chat widget that answers questions
   grounded in the current page's content, using the reader's OWN API key
   (BYOK). It is the single-file alternative to a server-backed chatbot: no
   server, no build step — paste this <script> before </body> and you have an
   "ask the page" assistant. Key is held in memory only and sent straight to
   the provider; nothing is stored or logged.

   HOW TO USE (two steps)
   1. (Optional) configure before this script runs:
        <script>
          window.CHAT_DOCK = {
            provider: "anthropic",          // "anthropic" (default) | "openai"
            title: "Ask the page",
            placeholder: "Ask a question…",
            suggestions: ["…","…"],         // quick-start prompts
            // model, accent, grounding, groundChars all optional
          };
        <\/script>
   2. Paste this entire file inside a <script> just before </body>.
      (Note: when inlining, this comment escapes the closing script tag as
       <\/script> on purpose — a literal one would close the tag early.)

   It injects its own styles (using the page's design tokens with fallbacks,
   so it adapts to light OR dark themes) and builds a launcher button bottom-
   right + a docked chat panel. Any element with `data-chat-open` also opens it.

   GROUNDING: by default it reads the page's text (<main> or <body>) and tells
   the model to answer from it. Pass `grounding` to override.

   LIMITS (state in the hand-off): replies depend on the reader's own key and
   on the provider allowing browser calls; this is per-browser, not multi-user.
   For a shared, key-managed chatbot, use a server route (framework build).
   ===================================================================== */
(function () {
  "use strict";
  var cfg = (window.CHAT_DOCK || {});
  if (cfg.enabled === false) return;
  if (!document.body) return; // paste this before </body> so the body exists

  var PROVIDER = (cfg.provider || "anthropic").toLowerCase();
  var MODEL = cfg.model || (PROVIDER === "openai" ? "gpt-5.4" : "claude-sonnet-4-6");
  var TITLE = cfg.title || "Ask the page";
  var PLACEHOLDER = cfg.placeholder || "Ask a question…";
  var SUGGEST = cfg.suggestions || [];
  var ACCENT = cfg.accent || "var(--accent,#3b82f6)";
  var KEY_HINT = PROVIDER === "openai" ? "sk-… (your OpenAI API key)" : "sk-ant-… (your Anthropic API key)";
  var KEY_LINK = PROVIDER === "openai" ? "https://platform.openai.com/api-keys" : "https://console.anthropic.com/settings/keys";
  var PROVIDER_NAME = PROVIDER === "openai" ? "OpenAI" : "Anthropic";

  var GROUND = cfg.grounding || (function () {
    var main = document.querySelector("main") || document.body;
    var t = (main.innerText || "").replace(/\s+\n/g, "\n").trim();
    return t.slice(0, cfg.groundChars || 9000);
  })();

  // ---- styles (page tokens w/ fallbacks → adapts to light or dark) ----
  var css = [
    "#cd-fab{position:fixed;bottom:20px;right:20px;z-index:71;background:" + ACCENT + ";color:#fff;border:none;border-radius:100px;padding:13px 18px;font-family:var(--sans,system-ui,sans-serif);font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.32)}",
    "#cd-fab:hover{filter:brightness(1.06)}#cd-fab svg{display:block}#cd-fab[hidden]{display:none}",
    "#cd-panel{position:fixed;bottom:20px;right:20px;z-index:72;width:384px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 40px);background:var(--card,#fff);color:var(--ink,#181818);border:1px solid var(--line-strong,#cfcfcf);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.4);display:flex;flex-direction:column;overflow:hidden;font-family:var(--sans,system-ui,sans-serif)}",
    "#cd-panel[hidden]{display:none}",
    ".cd-head{display:flex;align-items:center;gap:10px;padding:13px 16px;border-bottom:1px solid var(--line,#e3e3e3);background:var(--panel-2,var(--paper-2,rgba(127,127,127,.06)))}",
    ".cd-head .dot{width:9px;height:9px;border-radius:50%;background:" + ACCENT + ";flex-shrink:0}",
    ".cd-head h3{font-size:14px;margin:0;font-family:var(--display,inherit);line-height:1.1;color:var(--ink,#181818)}",
    ".cd-head .sub{font-size:10.5px;color:var(--ink-faint,#8a8a8a);font-family:var(--mono,monospace)}",
    ".cd-head .x{margin-left:auto;background:none;border:none;color:var(--ink-soft,#666);font-size:22px;cursor:pointer;line-height:1;padding:0 4px}.cd-head .x:hover{color:var(--ink,#000)}",
    ".cd-key{padding:11px 14px;border-bottom:1px solid var(--line,#e3e3e3);background:var(--panel,var(--paper,rgba(127,127,127,.03)))}.cd-key[hidden]{display:none}",
    ".cd-key input{width:100%;font-family:var(--mono,monospace);font-size:12.5px;background:var(--bg,var(--paper,#fff));border:1px solid var(--line-strong,#cfcfcf);color:var(--ink,#181818);border-radius:9px;padding:8px 11px;box-sizing:border-box}",
    ".cd-key .note{font-size:11px;color:var(--ink-faint,#8a8a8a);margin-top:6px;line-height:1.4}.cd-key .note b{color:" + ACCENT + "}.cd-key .note a{color:" + ACCENT + "}",
    ".cd-log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}",
    ".cd-msg{max-width:88%;padding:10px 13px;border-radius:12px;font-size:14px;line-height:1.5;white-space:pre-wrap}",
    ".cd-msg.u{align-self:flex-end;background:var(--accent-soft,rgba(127,127,127,.14));color:var(--ink,#181818)}",
    ".cd-msg.a{align-self:flex-start;background:var(--panel-2,var(--paper-2,rgba(127,127,127,.09)));border:1px solid var(--line,#e3e3e3)}",
    ".cd-msg.sys{align-self:center;font-size:11.5px;color:var(--ink-faint,#8a8a8a);font-family:var(--mono,monospace);text-align:center;max-width:100%}",
    ".cd-msg.a strong{font-weight:700;color:var(--ink,#111)}.cd-msg.a code{font-family:var(--mono,monospace);font-size:.9em;background:var(--bg,rgba(127,127,127,.14));padding:1px 5px;border-radius:5px}",
    ".cd-msg.a p{margin:0 0 8px}.cd-msg.a p:last-child{margin:0}.cd-msg.a ul,.cd-msg.a ol{margin:6px 0;padding-left:20px}.cd-msg.a li{margin:3px 0}",
    ".cd-dots{display:inline-flex;gap:4px;padding:3px 0}.cd-dots span{width:6px;height:6px;border-radius:50%;background:var(--ink-faint,#8a8a8a);animation:cdb 1s infinite}",
    ".cd-dots span:nth-child(2){animation-delay:.15s}.cd-dots span:nth-child(3){animation-delay:.3s}",
    "@keyframes cdb{0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}",
    ".cd-suggest{display:flex;flex-direction:column;gap:6px;padding:0 14px 10px}.cd-suggest[hidden]{display:none}",
    ".cd-suggest button{font-family:var(--sans,system-ui,sans-serif);font-size:12.5px;text-align:left;color:var(--ink-soft,#555);background:var(--bg,var(--paper,rgba(127,127,127,.04)));border:1px solid var(--line,#e3e3e3);border-radius:8px;padding:8px 11px;cursor:pointer}",
    ".cd-suggest button:hover{border-color:" + ACCENT + ";color:" + ACCENT + "}",
    ".cd-in{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--line,#e3e3e3);background:var(--panel-2,var(--paper-2,rgba(127,127,127,.06)))}",
    ".cd-in input{flex:1;min-width:0;font-family:var(--sans,system-ui,sans-serif);font-size:14px;background:var(--bg,var(--paper,#fff));border:1px solid var(--line-strong,#cfcfcf);color:var(--ink,#181818);border-radius:9px;padding:10px 12px}",
    ".cd-in button{background:" + ACCENT + ";color:#fff;border:none;border-radius:9px;padding:10px 15px;font-family:var(--sans,system-ui,sans-serif);font-weight:600;font-size:14px;cursor:pointer}",
    "@media(max-width:520px){#cd-panel{bottom:0;right:0;width:100vw;height:82vh;max-height:none;border-radius:16px 16px 0 0}}"
  ].join("\n");
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---- markup ----
  var fab = document.createElement("button");
  fab.id = "cd-fab"; fab.type = "button"; fab.setAttribute("aria-label", TITLE);
  fab.innerHTML = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.8-5.4A8.5 8.5 0 1 1 21 11.5z"/></svg><span>Ask</span>';

  var panel = document.createElement("div");
  panel.id = "cd-panel"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", TITLE);
  var sugHtml = SUGGEST.map(function (s) { return '<button type="button">' + esc(s) + "</button>"; }).join("");
  panel.innerHTML =
    '<div class="cd-head"><span class="dot"></span><div><h3>' + esc(TITLE) + '</h3><div class="sub">grounded · ' + esc(PROVIDER_NAME) + ' · your key</div></div><button class="x" id="cd-x" aria-label="Close">×</button></div>' +
    '<div class="cd-key" id="cd-key"><input id="cd-apikey" type="password" autocomplete="off" placeholder="' + esc(KEY_HINT) + '"><div class="note">Held <b>in memory only</b>, sent straight to ' + esc(PROVIDER_NAME) + ', never stored. <a href="' + KEY_LINK + '" target="_blank" rel="noopener">Get a key</a></div></div>' +
    '<div class="cd-log" id="cd-log"><div class="cd-msg sys">Ask a question about this page.</div></div>' +
    (sugHtml ? '<div class="cd-suggest" id="cd-suggest">' + sugHtml + "</div>" : "") +
    '<div class="cd-in"><input id="cd-input" autocomplete="off" placeholder="' + esc(PLACEHOLDER) + '"><button id="cd-send" type="button">Send</button></div>';

  document.body.appendChild(fab); document.body.appendChild(panel);

  var keyEl = panel.querySelector("#cd-apikey"), keyRow = panel.querySelector("#cd-key"),
      inEl = panel.querySelector("#cd-input"), sendEl = panel.querySelector("#cd-send"),
      log = panel.querySelector("#cd-log"), sug = panel.querySelector("#cd-suggest");

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
  function open(){ panel.hidden = false; fab.hidden = true; (keyEl.value ? inEl : keyEl).focus(); }
  function close(){ panel.hidden = true; fab.hidden = false; }
  fab.onclick = open;
  panel.querySelector("#cd-x").onclick = close;
  document.addEventListener("keydown", function(e){ if(e.key==="Escape" && !panel.hidden) close(); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-chat-open]"), function(el){ el.addEventListener("click", function(e){ e.preventDefault(); open(); }); });

  var history = [], busy = false;
  function add(role, text){ var d=document.createElement("div"); d.className="cd-msg "+role; d.textContent=text; log.appendChild(d); log.scrollTop=log.scrollHeight; return d; }
  // minimal, safe markdown: escape first, then **bold**, `code`, bullet/numbered lists, paragraphs
  function md(s){
    var lines = esc(s).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").split(/\n/);
    var out=[], i=0, bullet=/^\s*([-•*]|\d+[.)])\s+/;
    while(i<lines.length){
      if(bullet.test(lines[i])){
        var ordered=/^\s*\d+[.)]\s+/.test(lines[i]), tag=ordered?"ol":"ul", items=[];
        while(i<lines.length && bullet.test(lines[i])){ items.push("<li>"+lines[i].replace(bullet,"")+"</li>"); i++; }
        out.push("<"+tag+">"+items.join("")+"</"+tag+">");
      } else if(lines[i].trim()===""){ i++; }
      else { var para=[]; while(i<lines.length && lines[i].trim()!=="" && !bullet.test(lines[i])){ para.push(lines[i]); i++; } out.push("<p>"+para.join("<br>")+"</p>"); }
    }
    return out.join("");
  }

  function ask(q){
    if (busy || !q) return;
    var key = keyEl.value.trim();
    if (!key){ add("sys","Paste your " + PROVIDER_NAME + " API key above to start."); keyEl.focus(); return; }
    if (sug) sug.hidden = true;
    if (keyRow) keyRow.hidden = true; // collapse once we have a key → feels like a chat stream
    add("u", q); inEl.value = ""; busy = true;
    var thinking = add("a", ""); thinking.innerHTML = '<span class="cd-dots"><span></span><span></span><span></span></span>';
    history.push({ role: "user", content: q });
    var sys = "You are a friendly assistant embedded in this web page. Answer the user's questions grounded in the page content below. Be concise and clear. If a question goes beyond the page, you may answer briefly from general knowledge but say so. Never invent specifics.\n\n=== PAGE CONTENT ===\n" + GROUND;
    var req = PROVIDER === "openai" ? {
      url: "https://api.openai.com/v1/chat/completions",
      headers: { "content-type":"application/json", "authorization":"Bearer "+key },
      body: { model: MODEL, max_tokens: 700, messages: [{role:"system",content:sys}].concat(history) },
      pick: function(d){ return d && d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content; }
    } : {
      url: "https://api.anthropic.com/v1/messages",
      headers: { "content-type":"application/json", "x-api-key":key, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
      body: { model: MODEL, max_tokens: 700, system: sys, messages: history },
      pick: function(d){ return d && d.content && d.content[0] && d.content[0].text; }
    };
    fetch(req.url, { method:"POST", headers:req.headers, body:JSON.stringify(req.body) })
      .then(function(r){ return r.json(); })
      .then(function(data){
        var text = req.pick(data);
        if (!text){ var em = data && data.error && data.error.message ? data.error.message : "No response — check the key and try again."; thinking.className="cd-msg sys"; thinking.textContent="Error: "+em; busy=false; return; }
        thinking.innerHTML = md(text); history.push({ role:"assistant", content:text }); busy=false;
      })
      .catch(function(err){ thinking.className="cd-msg sys"; thinking.textContent="Request failed: "+err.message+" (some networks block direct API calls)."; busy=false; });
  }
  sendEl.onclick = function(){ ask(inEl.value.trim()); };
  inEl.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); ask(inEl.value.trim()); } });
  if (sug) Array.prototype.forEach.call(sug.querySelectorAll("button"), function(b){ b.onclick = function(){ ask(b.textContent); }; });
})();
