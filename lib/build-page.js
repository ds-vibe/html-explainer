import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { clientRuntime } from "./client-runtime.js";
import {
  createBuildContext,
  renderFooter,
  renderHero,
  renderNav,
  renderSection,
  renderSources,
} from "./blocks.js";
import { buildLocaleData, createI18nContext, parseLanguages, registerUiStrings, resolveString } from "./i18n.js";
import { escapeHtml } from "./util.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const THEMES = {
  "minimal-editorial": "lib/themes/minimal-editorial.css",
};

export function loadContent(contentPath) {
  const raw = fs.readFileSync(contentPath, "utf8");
  return JSON.parse(raw);
}

export function validateContent(content) {
  if (!content.meta?.title) throw new Error("content.meta.title is required");
  if (!content.hero) throw new Error("content.hero is required");
  if (!Array.isArray(content.sections) || !content.sections.length) {
    throw new Error("content.sections must be a non-empty array");
  }
  const theme = content.meta.theme || "minimal-editorial";
  if (!THEMES[theme]) {
    throw new Error(
      `Unknown theme "${theme}". Available: ${Object.keys(THEMES).join(", ")}`,
    );
  }
  parseLanguages(content);
  for (const section of content.sections) {
    if (!section.id) throw new Error(`Section missing id (type=${section.type})`);
    if (!section.type) throw new Error(`Section "${section.id}" missing type`);
  }
}

function loadThemeCss(theme) {
  const rel = THEMES[theme];
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function loadReviewMode() {
  return fs.readFileSync(path.join(ROOT, "scripts/review-mode.js"), "utf8");
}

export function buildPage(content) {
  validateContent(content);
  const theme = content.meta.theme || "minimal-editorial";
  const i18n = createI18nContext(content);
  registerUiStrings(i18n, content);
  i18n.register("meta.title", content.meta.title);

  const ctx = createBuildContext(content, i18n);
  const brand = content.meta.brand || content.meta.title;
  i18n.register("meta.brand", brand);

  const nav = content.nav || content.sections.map((s) => ({ id: s.id, label: s.title }));
  nav.forEach((item, i) => i18n.register(`nav.${i}.label`, item.label));

  const sectionsHtml = content.sections.map((section) => renderSection(section, ctx)).join("\n");
  const quizSection = content.sections.find((s) => s.type === "quiz");
  const quizRoot = quizSection ? quizSection.id : "quiz";

  const localeData = buildLocaleData(ctx, i18n);
  const payload = {
    localeMeta: {
      languages: i18n.languages,
      fallback: i18n.fallback,
      storageKey: "html-explainer-lang",
    },
    strings: i18n.strings,
    localeData,
    quizRoot,
  };

  const customCss = ctx.customCss.join("\n");
  const themeCss = loadThemeCss(theme);
  const reviewMode = loadReviewMode();
  const initialTitle = resolveString(content.meta.title, i18n.fallback, i18n.fallback, i18n.codes);
  const htmlClass = i18n.multi ? ' class="i18n-pending"' : "";

  return `<!DOCTYPE html>
<html lang="${i18n.fallback}"${htmlClass}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title data-i18n="meta.title">${escapeHtml(initialTitle)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${themeCss}
${customCss}
</style>
</head>
<body data-review-toggle>

${renderNav(nav, brand, i18n)}
${renderHero(content.hero, i18n)}
${sectionsHtml}
${content.sources ? renderSources(content.sources, i18n) : ""}
${content.footer ? renderFooter(content.footer, i18n) : ""}

<script>
window.__EXPLAINER__=${JSON.stringify(payload)};
${clientRuntime()}
</script>
<script>
${reviewMode}
</script>
</body>
</html>
`;
}

export function buildFromFile(contentPath, outPath) {
  const content = loadContent(contentPath);
  const html = buildPage(content);
  fs.writeFileSync(outPath, html, "utf8");
  return { outPath, title: resolveString(content.meta.title, parseLanguages(content).fallback, parseLanguages(content).fallback) };
}

export { THEMES };
