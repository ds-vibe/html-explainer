#!/usr/bin/env node
// Quality-loop screenshot helper for the html-explainer skill.
//
// Renders a page in a headless browser and captures it so you can ACTUALLY LOOK
// at the result (desktop + mobile + full page). After running, Read the PNGs in
// <outDir> and critique them like a human seeing the page cold.
//
// Usage:
//   node shoot.mjs <url> [outDir]
//   node shoot.mjs http://localhost:3000 /tmp/shots
//   node shoot.mjs "file:///abs/path/to/page.html" /tmp/shots
//
// One-time setup (if needed):
//   npm i -D playwright && npx playwright install chromium
//
// Tips:
//   - Capture interactive STATES too: open the page, click an accordion / filter /
//     drawer, then screenshot. Add your own steps below or duplicate this file.
//   - Mobile rendering matters — this captures a 390px viewport as well.
//
// IMPORTANT — why this script scrolls and advances on mobile:
//   A cover-only mobile screenshot (scroll 0, first slide) hides the most common
//   mobile bug class: fixed chrome (top bars, nav pills, counters, FABs) overlapping
//   content once a slide/section is SCROLLED. So on mobile we also (a) scroll the
//   active scroll container to the bottom, and (b) for slide-deck layouts, advance to
//   a content-dense interior slide and shoot that. Always Read mobile-scrolled and
//   mobile-slide-mid — they are where overlap/cut-off shows up.

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2];
const outDir = process.argv[3] || "/tmp/shots";

if (!url) {
  console.error("usage: node shoot.mjs <url> [outDir]");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

async function snap(page, name, opts = {}) {
  await page.screenshot({ path: `${outDir}/${name}.png`, ...opts });
  console.log("shot", `${outDir}/${name}.png`);
}

// --- Desktop ---
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await snap(page, "desktop-top");
await snap(page, "desktop-fullpage", { fullPage: true });
await ctx.close();

// --- Mobile ---
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});
const mpage = await mctx.newPage();
await mpage.goto(url, { waitUntil: "networkidle" });
await mpage.waitForTimeout(700);
await snap(mpage, "mobile-top");

// Detect a slide-deck / fixed-viewport layout (body doesn't scroll; slides scroll
// internally). For these, fullPage is useless and we must drive the deck by hand.
const isDeck = await mpage.evaluate(() => {
  const deck = document.querySelector(".deck, .slides, [data-deck]");
  const fixed = deck && getComputedStyle(deck).position === "fixed";
  return !!fixed || document.body.scrollHeight <= window.innerHeight + 4;
});

// Helper: scroll whatever the real scroll container is (active slide, else window).
async function scrollActiveToBottom(p) {
  await p.evaluate(() => {
    const cands = Array.from(document.querySelectorAll(".slide, .panel, main, section"));
    const inView = cands.find((el) => {
      const r = el.getBoundingClientRect();
      return r.left < window.innerWidth * 0.5 && r.right > window.innerWidth * 0.5 &&
             el.scrollHeight > el.clientHeight + 4;
    });
    if (inView) inView.scrollTo({ top: inView.scrollHeight, behavior: "instant" });
    else window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
  });
  await p.waitForTimeout(400);
}

if (isDeck) {
  // Advance past the cover to a content-dense interior slide (right arrow ~3x),
  // then scroll that slide to the bottom — the state that exposes chrome overlap.
  for (let i = 0; i < 3; i++) {
    await mpage.keyboard.press("ArrowRight");
    await mpage.waitForTimeout(650);
  }
  await snap(mpage, "mobile-slide-mid");
  await scrollActiveToBottom(mpage);
  await snap(mpage, "mobile-slide-mid-scrolled");
} else {
  // Normal scrolling page: capture a scrolled state + the full page.
  await scrollActiveToBottom(mpage);
  await snap(mpage, "mobile-scrolled");
  await snap(mpage, "mobile-fullpage", { fullPage: true });
}
await mctx.close();

await browser.close();
console.log("DONE — now Read the PNGs in", outDir, "and critique them (esp. the scrolled/interior-slide mobile shots).");
