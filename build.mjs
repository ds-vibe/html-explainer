#!/usr/bin/env node
import path from "path";
import { buildFromFile } from "./lib/build-page.js";

function usage() {
  console.error(`Usage: node build.mjs <content.json> [-o output.html]

Example:
  node build.mjs examples/ai-act.content.json -o examples/ai-act-built.html`);
}

const args = process.argv.slice(2);
if (!args.length || args.includes("-h") || args.includes("--help")) {
  usage();
  process.exit(args.length ? 0 : 1);
}

const contentPath = path.resolve(args[0]);
const outFlag = args.indexOf("-o");
const outPath = outFlag >= 0 ? path.resolve(args[outFlag + 1]) : contentPath.replace(/\.content\.json$/, ".html").replace(/\.json$/, ".html");

try {
  const result = buildFromFile(contentPath, outPath);
  console.log(`Built ${result.title}`);
  console.log(`→ ${result.outPath}`);
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
