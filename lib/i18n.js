import { escapeAttr, escapeHtml, richHtml } from "./util.js";

const LOCALE_KEY = /^[a-z]{2}(-[A-Z]{2})?$/;

export function isLocaleMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  if (!keys.length) return false;
  return keys.every((k) => LOCALE_KEY.test(k) && typeof value[k] === "string");
}

export function parseLanguages(content) {
  const declared = content.meta?.languages;
  let languages;

  if (Array.isArray(declared) && declared.length) {
    languages = declared.map((item) =>
      typeof item === "string"
        ? { code: item, label: item.toUpperCase() }
        : { code: item.code, label: item.label || item.code.toUpperCase(), dir: item.dir || "ltr" },
    );
  } else {
    languages = [{ code: "en", label: "English", dir: "ltr" }];
  }

  const codes = languages.map((l) => l.code);
  const fallback = content.meta?.fallback || codes[0];

  if (!codes.includes(fallback)) {
    throw new Error(`meta.fallback "${fallback}" is not listed in meta.languages`);
  }

  return { languages, fallback, codes, multi: codes.length > 1 };
}

export function resolveString(value, locale, fallback, codes = []) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (isLocaleMap(value)) {
    if (value[locale]) return value[locale];
    const primary = locale.split("-")[0];
    if (value[primary]) return value[primary];
    if (value[fallback]) return value[fallback];
    for (const code of codes) {
      if (value[code]) return value[code];
    }
    return Object.values(value)[0] || "";
  }
  return String(value);
}

export function resolveDeep(value, locale, fallback, codes) {
  if (value == null) return value;
  if (typeof value === "string" || isLocaleMap(value)) {
    return resolveString(value, locale, fallback, codes);
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveDeep(item, locale, fallback, codes));
  }
  if (typeof value === "object") {
    const out = {};
    for (const [key, nested] of Object.entries(value)) {
      out[key] = resolveDeep(nested, locale, fallback, codes);
    }
    return out;
  }
  return value;
}

export function createI18nContext(content) {
  const { languages, fallback, codes, multi } = parseLanguages(content);
  const strings = {};

  function register(path, value) {
    if (value == null) return;
    if (typeof value === "string") {
      if (!strings[path]) strings[path] = { [fallback]: value };
      else strings[path][fallback] = value;
    } else if (isLocaleMap(value)) {
      strings[path] = { ...value };
    }
  }

  function resolve(value, locale = fallback) {
    return resolveString(value, locale, fallback, codes);
  }

  function el(tag, path, value, { rich = false, className = "", attrs = "" } = {}) {
    if (value == null) return "";
    register(path, value);
    const initial = resolve(value);
    const richAttr = rich ? " data-i18n-rich" : "";
    const cls = className ? ` class="${className}"` : "";
    const body = rich ? richHtml(initial) : escapeHtml(initial);
    return `<${tag}${cls} data-i18n="${escapeAttr(path)}"${richAttr}${attrs ? ` ${attrs}` : ""}>${body}</${tag}>`;
  }

  function htmlBlock(path, value, { className = "", attrs = "" } = {}) {
    if (value == null) return "";
    register(path, value);
    const initial = resolve(value);
    const cls = className ? ` class="${className}"` : "";
    return `<div${cls} data-i18n-html="${escapeAttr(path)}"${attrs ? ` ${attrs}` : ""}>${richHtml(initial)}</div>`;
  }

  return { languages, fallback, codes, multi, strings, register, resolve, resolveDeep: (value, locale = fallback) => resolveDeep(value, locale, fallback, codes), el, htmlBlock };
}

export function registerUiStrings(i18n, content) {
  const defaults = {
    "ui.allAreas": { en: "All areas", fr: "Tous les domaines", de: "Alle Bereiche" },
    "ui.sourcesKicker": { en: "SOURCES", fr: "SOURCES", de: "QUELLEN" },
    "ui.pyrAxisUp": { en: "↑ Fewer systems · heavier rules", fr: "↑ Moins de systèmes · règles plus lourdes" },
    "ui.pyrAxisDown": {
      en: "More systems · lighter rules ↓",
      fr: "Plus de systèmes · règles plus légères ↓",
    },
    "ui.langLabel": { en: "Language", fr: "Langue", de: "Sprache" },
    "ui.quizWhy": { en: "Why:", fr: "Pourquoi :", de: "Warum:" },
    "ui.filterWhy": { en: "Why:", fr: "Pourquoi :", de: "Warum:" },
    "ui.pickCase": {
      en: "← Pick a use case to classify it.",
      fr: "← Choisissez un cas d'usage pour le classer.",
    },
  };

  for (const [path, value] of Object.entries(defaults)) {
    i18n.register(path, content.ui?.[path.split(".").pop()] || value);
  }

  if (content.ui) {
    for (const [key, value] of Object.entries(content.ui)) {
      if (typeof value === "string" || isLocaleMap(value)) {
        i18n.register(`ui.${key}`, value);
      }
    }
  }
}

export function buildLocaleData(ctx, i18n) {
  const localeData = {};
  for (const code of i18n.codes) {
    localeData[code] = {
      tierCards: i18n.resolveDeep(ctx.tierCards, code, i18n.fallback, i18n.codes),
      filterMatrix: i18n.resolveDeep(ctx.filterMatrix, code, i18n.fallback, i18n.codes),
      demos: i18n.resolveDeep(ctx.demos, code, i18n.fallback, i18n.codes),
      quiz: i18n.resolveDeep(ctx.quiz, code, i18n.fallback, i18n.codes),
    };
  }
  return localeData;
}
