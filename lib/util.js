export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function escapeAttr(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

/** Allow basic inline markup used in explainers (em, strong, a, sup, b). */
export function richHtml(value) {
  return String(value ?? "");
}

export function sectionHead(section, i18n, basePath) {
  return `<div class="sec-head reveal">
  ${section.num ? i18n.el("p", `${basePath}.num`, section.num, { className: "num" }) : ""}
  ${i18n.el("h2", `${basePath}.title`, section.title)}
  ${section.intro ? i18n.el("p", `${basePath}.intro`, section.intro, { rich: true }) : ""}
</div>`;
}

function validateInitString(init, label) {
  if (typeof init !== "string") {
    throw new Error(`${label}: custom demo init must be a string`);
  }
  const lines = init.split("\n").length;
  if (lines > 150) {
    throw new Error(`${label}: custom demo init exceeds 150 lines (${lines})`);
  }
  const banned = /\b(eval\s*\(|fetch\s*\(|XMLHttpRequest|import\s*\(|document\.write)/;
  if (banned.test(init)) {
    throw new Error(`${label}: custom demo init uses a banned API`);
  }
}

export function wrapSection(id, inner, { band = false, bandInk = false } = {}) {
  const classes = [
    band ? "band" : "",
    bandInk ? "band-ink" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<section id="${escapeAttr(id)}"${classes ? ` class="${classes}"` : ""}>
  <div class="wrap">${inner}</div>
</section>`;
}

export function demoShell(id, eyebrow, inner, i18n, eyebrowPath) {
  const top =
    eyebrow && i18n && eyebrowPath
      ? `<div class="demo-top">${i18n.el("p", eyebrowPath, eyebrow, { className: "eyebrow" })}</div>`
      : eyebrow
        ? `<div class="demo-top"><p class="eyebrow">${escapeHtml(eyebrow)}</p></div>`
        : "";
  return `<div class="demo reveal" data-demo-mount="${escapeAttr(id)}">
  ${top}
  ${inner}
</div>`;
}

export function validateCustomDemo(props, label, customCount) {
  if (!props || typeof props !== "object") {
    throw new Error(`${label}: custom demo requires props`);
  }
  if (!props.id || typeof props.id !== "string") {
    throw new Error(`${label}: custom demo requires props.id`);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(props.id)) {
    throw new Error(`${label}: custom demo id must be kebab-case`);
  }
  if (props.init != null) {
    if (typeof props.init === "object" && !Array.isArray(props.init)) {
      for (const [loc, init] of Object.entries(props.init)) {
        validateInitString(init, `${label} (${loc})`);
      }
    } else {
      validateInitString(props.init, label);
    }
  }
  if (customCount != null && customCount > 2) {
    throw new Error(`At most 2 custom demos per explainer (found ${customCount})`);
  }
}
