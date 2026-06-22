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
await snap(mpage, "mobile-fullpage", { fullPage: true });
await mctx.close();

await browser.close();
console.log("DONE — now Read the PNGs in", outDir, "and critique them.");
