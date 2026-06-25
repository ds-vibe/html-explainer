#!/usr/bin/env node
/* Hybrid prototype — the ASSEMBLER.
 *
 * Deterministic injection of invariant boilerplate + structural validation,
 * with ZERO touch to the creative surface. The LLM authors the full page
 * (design, layout, bespoke demos, all interactivity) but does NOT emit the
 * drop-in overlay/chat scripts; this injects those invariants and validates
 * structure. We do NOT render components from a schema — that's what loses
 * the dynamic formatting and interactive elements.
 *
 * Usage: node assemble.mjs <input.html> [--chat] [-o out.html]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const SCRIPTS = __dir; // review-mode.js and chat-dock.js live alongside assemble.mjs in scripts/

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("-"));
if (!input) {
  console.error("usage: node assemble.mjs <input.html> [--chat] [-o out.html]");
  process.exit(1);
}
const withChat = args.includes("--chat");
const oIdx = args.indexOf("-o");
const outPath = oIdx >= 0 ? args[oIdx + 1] : input.replace(/\.html$/i, "") + ".assembled.html";

let html = readFileSync(input, "utf8");
const did = [];

/* Detect the overlay by its JS signature (`launch.id = "rv-launch"`), NOT the bare
 * string "rv-launch" — otherwise the deck-offset CSS rule below (which mentions
 * #rv-launch) is mistaken for the overlay and injection is wrongly skipped. */
const HAS_OVERLAY = (s) => /id\s*=\s*"rv-launch"/.test(s);

/* 1) ensure the page opts the overlay in */
if (!/<body[^>]*\bdata-review-toggle\b/i.test(html)) {
  html = html.replace(/<body([^>]*)>/i, "<body$1 data-review-toggle>");
  did.push("added data-review-toggle to <body>");
}

/* 2) deck-aware: if this is a slide deck, offset the launcher so it can't collide
 *    with the deck's own top-right controls (the bug we hand-fixed on fair use). */
const isDeck = /class="[^"]*\b(slide|deck|deck-viewport)\b|data-deck\b/i.test(html);
if (isDeck && !/#rv-launch\s*\{[^}]*top:64px/.test(html)) {
  html = html.replace(/<\/head>/i,
    "<style>/* assembler: keep launcher clear of deck chrome */ body #rv-launch{top:64px;right:16px}</style>\n</head>");
  did.push("deck detected → offset review launcher (no collision)");
}

/* 3) inject the invariant drop-in scripts before </body>, escaping literal </script> */
function block(file, label) {
  const src = readFileSync(resolve(SCRIPTS, file), "utf8").replace(/<\/script>/g, "<\\/script>");
  return `\n<!-- ${label} — injected by assemble.mjs (invariant; do not hand-edit) -->\n<script>\n${src}\n</script>\n`;
}
let inject = "";
if (!HAS_OVERLAY(html)) { inject += block("review-mode.js", "Review & edit overlay"); did.push("injected review-mode.js"); }
else did.push("review-mode.js already present — skipped");
if (withChat && !/chat-dock/i.test(html)) { inject += block("chat-dock.js", "Ask-the-page chat"); did.push("injected chat-dock.js"); }
const bi = html.lastIndexOf("</body>");
html = bi >= 0 ? html.slice(0, bi) + inject + html.slice(bi) : html + inject;

/* 4) validate the structural bug classes (deterministic) */
const errs = [];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
if (dupes.length) errs.push("duplicate IDs (breaks getElementById widgets): " + dupes.join(", "));
if (!HAS_OVERLAY(html)) errs.push("review overlay missing after assembly");
if (/<\/script>\s*<\/script>/.test(html)) errs.push("possible unescaped </script> in an injected block");

writeFileSync(outPath, html);
console.log("ASSEMBLED →", outPath);
did.forEach((d) => console.log("  • " + d));
if (errs.length) {
  console.log("\nVALIDATION FAILED:");
  errs.forEach((e) => console.log("  ✗ " + e));
  process.exit(2);
}
console.log("\nVALIDATION PASSED — unique IDs, overlay present, scripts escaped.");
console.log("(containment + visual correctness are verified by the Playwright QA loop, not statically.)");
