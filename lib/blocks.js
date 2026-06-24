import { isLocaleMap } from "./i18n.js";
import {
  demoShell,
  escapeAttr,
  escapeHtml,
  richHtml,
  sectionHead,
  validateCustomDemo,
  wrapSection,
} from "./util.js";

const TONE_BADGE = {
  red: "background:var(--red-bg);color:var(--red)",
  amber: "background:var(--amber-bg);color:var(--amber)",
  blue: "background:var(--blue-bg);color:var(--blue)",
  green: "background:var(--green-bg);color:var(--green)",
};

function callout(block, i18n, basePath) {
  if (!block) return "";
  return `<div class="callout reveal">
  ${i18n.el("p", `${basePath}.callout.title`, block.title, { className: "ct" })}
  ${i18n.el("p", `${basePath}.callout.body`, block.body, { rich: true })}
</div>`;
}

function registerDemo(ctx, sectionId, demo, label) {
  if (!demo || demo === "none") return "";
  const id = `${sectionId}-${demo.type || demo.demo || "demo"}`;
  const type = demo.type || demo.demo;
  const props = demo.props || demo;

  if (type === "custom") {
    ctx.customCount += 1;
    validateCustomDemo(props, label, ctx.customCount);
    if (props.css) ctx.customCss.push(`[data-demo-id="${props.id}"]{${props.css}}`);
    ctx.demos.push({ id: props.id, type: "custom", props });
    return renderCustomMount(props, ctx.i18n);
  }

  const mountId = props.id || id;
  ctx.demos.push({ id: mountId, type, props: { ...props, id: undefined } });
  return renderDemoByType(type, mountId, props, ctx.i18n, `${sectionId}.demo`);
}

function renderCustomMount(props, i18n) {
  const wrap = props.wrapperClass ? ` ${props.wrapperClass}` : "";
  const path = `demos.${props.id}.html`;
  let inner;
  if (isLocaleMap(props.html) || (props.html && typeof props.html === "object")) {
    inner = i18n.htmlBlock(path, props.html);
  } else {
    inner = props.html || "";
  }
  return `<div class="reveal${wrap}" data-demo-id="${escapeAttr(props.id)}">${inner}</div>`;
}

function renderDemoByType(type, mountId, props, i18n, basePath) {
  if (type === "filter-list") {
    return demoShell(
      mountId,
      props.eyebrow,
      `<div class="demo-grid">
  <div class="demo-cases" data-filter-list-cases="${escapeAttr(mountId)}" role="group" aria-label="Choose an AI use case"></div>
  <div class="demo-result" data-filter-list-result="${escapeAttr(mountId)}">
    ${i18n.el("p", `${basePath}.placeholder`, props.placeholder || { en: "← Pick a use case to classify it.", fr: "← Choisissez un cas d'usage pour le classer." }, { className: "placeholder" })}
  </div>
</div>`,
      i18n,
      props.eyebrow ? `${basePath}.eyebrow` : null,
    );
  }

  if (type === "slider") {
    const min = props.min ?? 0;
    const max = props.max ?? 100;
    const step = props.step ?? 1;
    const value = props.value ?? min;
    return `<div class="flops reveal" data-demo-id="${escapeAttr(mountId)}">
  ${props.label ? i18n.el("p", `${basePath}.label`, props.label, { className: "num", attrs: 'style="color:var(--violet)"' }) : ""}
  ${props.intro ? i18n.el("p", `${basePath}.intro`, props.intro, { rich: true, attrs: 'style="font-size:.92rem;color:var(--ink-2);margin-top:var(--s3)"' }) : ""}
  <div class="read"><span class="big" data-slider-readout="${escapeAttr(mountId)}"></span>${props.unit ? i18n.el("span", `${basePath}.unit`, props.unit, { attrs: 'style="color:var(--ink-3)"' }) : ""}</div>
  <input type="range" data-slider-input="${escapeAttr(mountId)}" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${escapeAttr(i18n.resolve(props.ariaLabel || "Slider"))}">
  ${props.scale ? `<div class="scale">${props.scale.map((s, i) => i18n.el("span", `${basePath}.scale.${i}`, s)).join("")}</div>` : ""}
  <div class="out out-no" data-slider-out="${escapeAttr(mountId)}"></div>
  ${props.note ? i18n.el("p", `${basePath}.note`, props.note, { rich: true, className: "demo-note" }) : ""}
</div>`;
  }

  throw new Error(`Unknown demo type "${type}"`);
}

export function renderHero(hero, i18n) {
  i18n.register("hero.headline", hero.headline);
  i18n.register("hero.lede", hero.lede);
  const stats = (hero.stats || [])
    .map(
      (s, i) =>
        `<div class="m">${i18n.el("span", `hero.stats.${i}.value`, s.value, { className: "k" })}${i18n.el("span", `hero.stats.${i}.label`, s.label, { className: "l" })}</div>`,
    )
    .join("");
  return `<header class="hero">
  <div class="hero-bands" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
  <div class="wrap">
    ${hero.eyebrow ? i18n.el("p", "hero.eyebrow", hero.eyebrow, { className: "eyebrow" }) : ""}
    ${i18n.el("h1", "hero.headline", hero.headline, { rich: true })}
    ${i18n.el("p", "hero.lede", hero.lede, { className: "lede", rich: true })}
    ${stats ? `<div class="meta">${stats}</div>` : ""}
  </div>
</header>`;
}

export function renderNav(nav, brand, i18n) {
  i18n.register("meta.brand", brand);
  const links = nav
    .map((item, i) =>
      i18n.el("a", `nav.${i}.label`, item.label, { attrs: `href="#${escapeAttr(item.id)}"` }),
    )
    .join("");
  const langSwitch = i18n.multi
    ? `<div class="lang-switch" data-lang-switch role="group" aria-label="${escapeAttr(i18n.resolve("ui.langLabel"))}">
  ${i18n.languages
    .map(
      (lang) =>
        `<button type="button" class="lang-btn" data-lang="${escapeAttr(lang.code)}" aria-pressed="false">${escapeHtml(lang.label)}</button>`,
    )
    .join("")}
</div>`
    : "";
  return `<nav class="nav">
  <div class="wrap">
    ${i18n.el("span", "meta.brand", brand, { className: "brand" })}
    <div class="links">${links}</div>
    ${langSwitch}
  </div>
</nav>`;
}

export function renderSources(sources, i18n) {
  const items = (sources.items || [])
    .map((item, i) => {
      if (typeof item === "string") {
        return `<li>· ${i18n.el("span", `sources.items.${i}`, item, { rich: true })}</li>`;
      }
      const link = `<a href="${escapeAttr(item.url)}">${escapeHtml(i18n.resolve(item.label))}</a>`;
      i18n.register(`sources.items.${i}.label`, item.label);
      const note = item.note
        ? ` — ${i18n.el("span", `sources.items.${i}.note`, item.note, { rich: true })}`
        : "";
      return `<li>· ${link}${note}</li>`;
    })
    .join("");
  return wrapSection(
    "sources",
    `<div class="measure">
  ${i18n.el("p", "ui.sourcesKicker", { en: "SOURCES", fr: "SOURCES", de: "QUELLEN" }, { className: "num" })}
  ${i18n.el("h2", "sources.title", sources.title || "Where this comes from", { attrs: 'style="font-size:1.6rem;margin:var(--s3) 0 var(--s5)"' })}
  <ul class="src">${items}</ul>
  ${sources.disclaimer ? i18n.el("div", "sources.disclaimer", sources.disclaimer, { rich: true, className: "disclaimer" }) : ""}
</div>`,
  );
}

export function renderFooter(text, i18n) {
  return `<footer class="foot"><div class="wrap measure">${i18n.el("div", "footer", text, { rich: true })}</div></footer>`;
}

export function renderSection(section, ctx) {
  const i18n = ctx.i18n;
  const base = `sections.${section.id}`;
  const head = sectionHead(section, i18n, base);
  const band = section.band ?? false;

  switch (section.type) {
    case "model": {
      const rows = (section.examples || [])
        .map(
          (row, i) =>
            `<div class="row">${i18n.el("span", `${base}.examples.${i}.tool`, row.tool, { className: "tool" })}${i18n.el("span", `${base}.examples.${i}.use`, row.use, { className: "arrow" })}${i18n.el("span", `${base}.examples.${i}.tier`, row.tier, { className: "tier", attrs: `style="${TONE_BADGE[row.tone] || ""}"` })}</div>`,
        )
        .join("");
      const body = (section.paragraphs || [])
        .map((p, i) => i18n.el("p", `${base}.paragraphs.${i}`, p, { rich: true }))
        .join("");
      return wrapSection(
        section.id,
        `<div class="bigidea reveal">
  <div>
    ${i18n.el("p", `${base}.kicker`, section.kicker || "THE MENTAL MODEL", { className: "num" })}
    ${i18n.el("p", `${base}.pull`, section.pull, { className: "pull", rich: true })}
    ${body}
  </div>
  <div class="flip" aria-label="${escapeAttr(i18n.resolve(section.examplesLabel || "Examples"))}">
    ${section.examplesTitle ? i18n.el("p", `${base}.examplesTitle`, section.examplesTitle, { className: "eyebrow", attrs: 'style="margin-bottom:var(--s3)"' }) : ""}
    ${rows}
  </div>
</div>`,
        { band },
      );
    }

    case "tier-cards": {
      ctx.tierCards[section.id] = section.items;
      return wrapSection(
        section.id,
        `${head}
<div class="pyramid reveal" data-tier-cards="${escapeAttr(section.id)}"></div>
<div class="pyr-axis reveal">${i18n.el("span", `${base}.pyrAxisUp`, section.pyrAxisUp || "ui.pyrAxisUp")}${i18n.el("span", `${base}.pyrAxisDown`, section.pyrAxisDown || "ui.pyrAxisDown")}</div>
${callout(section.callout, i18n, base)}`,
        { band },
      );
    }

    case "two-col": {
      const aside = registerDemo(
        ctx,
        section.id,
        section.aside?.demo
          ? { type: section.aside.demo, props: { eyebrow: section.aside.eyebrow, ...section.aside.props } }
          : null,
        section.id,
      );
      const paragraphs = (section.paragraphs || [])
        .map((p, i) => i18n.el("p", `${base}.paragraphs.${i}`, p, { rich: true }))
        .join("");
      return wrapSection(
        section.id,
        `${head}
<div class="bigidea reveal">
  <div class="measure">${paragraphs || (section.body ? i18n.el("p", `${base}.body`, section.body, { rich: true }) : "")}</div>
  <div>${aside}</div>
</div>`,
        { band },
      );
    }

    case "demo-section": {
      const demo = registerDemo(ctx, section.id, section.demo, section.id);
      return wrapSection(section.id, `${head}${demo}${callout(section.callout, i18n, base)}`, { band });
    }

    case "ban-list": {
      const items = (section.items || [])
        .map(
          (item, i) =>
            `<div class="ban">${i18n.el("div", `${base}.items.${i}.index`, item.index ?? item[0], { className: "ix" })}<div>${i18n.el("div", `${base}.items.${i}.title`, item.title ?? item[1], { className: "bt" })}${i18n.el("div", `${base}.items.${i}.body`, item.body ?? item[2], { className: "bd", rich: true })}</div></div>`,
        )
        .join("");
      return wrapSection(
        section.id,
        `${head}<div class="banlist reveal">${items}</div>${callout(section.callout, i18n, base)}`,
        { band },
      );
    }

    case "filter-matrix": {
      ctx.filterMatrix[section.id] = {
        areas: section.areas,
        requirements: section.requirements,
        requirementsTitle: section.requirementsTitle,
      };
      return wrapSection(
        section.id,
        `${head}
<div class="hr-wrap reveal" data-filter-matrix="${escapeAttr(section.id)}">
  <div class="hr-domains" data-filter-matrix-domains="${escapeAttr(section.id)}" role="group" aria-label="Filter areas"></div>
  <div class="hr-body">
    <div data-filter-matrix-list="${escapeAttr(section.id)}"></div>
    <div class="hr-reqs">
      ${section.requirementsTitle ? i18n.el("p", `${base}.requirementsTitle`, section.requirementsTitle, { className: "num", attrs: 'style="color:var(--amber)"' }) : ""}
      <div class="reqgrid" data-filter-matrix-reqs="${escapeAttr(section.id)}"></div>
    </div>
  </div>
</div>`,
        { band },
      );
    }

    case "compare-cols": {
      const cols = (section.columns || [])
        .map((col, i) => {
          const list = (col.bullets || [])
            .map((b, j) => {
              const path = `${base}.columns.${i}.bullets.${j}`;
              i18n.register(path, b);
              return `<li data-i18n="${escapeAttr(path)}" data-i18n-rich>${richHtml(i18n.resolve(b))}</li>`;
            })
            .join("");
          const titleHtml = col.badge
            ? `<span class="badge">${escapeHtml(i18n.resolve(col.badge))}</span>`
            : escapeHtml(i18n.resolve(col.title));
          if (col.badge) i18n.register(`${base}.columns.${i}.badge`, col.badge);
          if (col.title) i18n.register(`${base}.columns.${i}.title`, col.title);
          return `<div class="gpai-card${col.variant === "muted" ? " sys" : ""}">
  <h3>${titleHtml}</h3>
  <ul>${list}</ul>
  ${col.note ? i18n.el("p", `${base}.columns.${i}.note`, col.note, { rich: true, attrs: 'style="font-size:.84rem;color:var(--ink-3);margin-top:var(--s4)"' }) : ""}
</div>`;
        })
        .join("");
      const demo = section.demo ? registerDemo(ctx, section.id, section.demo, section.id) : "";
      return wrapSection(
        section.id,
        `${head}<div class="gpai-cols reveal">${cols}</div>${demo}${callout(section.callout, i18n, base)}`,
        { band },
      );
    }

    case "who-cards": {
      const cards = (section.cards || [])
        .map(
          (card, i) =>
            `<div class="who-card">${i18n.el("p", `${base}.cards.${i}.role`, card.role, { className: "tagrole" })}${i18n.el("p", `${base}.cards.${i}.title`, card.title, { className: "role" })}${i18n.el("p", `${base}.cards.${i}.body`, card.body, { rich: true })}</div>`,
        )
        .join("");
      const reach = section.reach
        ? `<div class="reach reveal">${i18n.el("h3", `${base}.reach.title`, section.reach.title)}${i18n.el("p", `${base}.reach.body`, section.reach.body, { rich: true })}</div>`
        : "";
      return wrapSection(
        section.id,
        `${head}<div class="who reveal">${cards}</div>${reach}`,
        { band },
      );
    }

    case "penalty-tiers": {
      const tiers = (section.tiers || [])
        .map(
          (tier, i) =>
            `<div class="pen pen${i + 1}">${i18n.el("div", `${base}.tiers.${i}.amount`, tier.amount, { className: "amt" })}${i18n.el("div", `${base}.tiers.${i}.percent`, tier.percent, { className: "pct", rich: true })}${i18n.el("div", `${base}.tiers.${i}.label`, tier.label, { className: "pl" })}${i18n.el("div", `${base}.tiers.${i}.detail`, tier.detail, { className: "pd", rich: true })}</div>`,
        )
        .join("");
      const demo = section.demo ? registerDemo(ctx, section.id, section.demo, section.id) : "";
      return wrapSection(
        section.id,
        `${head}<div class="pen-tiers reveal">${tiers}</div>${demo}${section.note ? i18n.el("p", `${base}.note`, section.note, { rich: true, attrs: 'style="font-size:.8rem;color:var(--ink-3);margin-top:var(--s4)"' }) : ""}`,
        { band },
      );
    }

    case "timeline": {
      const events = (section.events || [])
        .map((event, i) => {
          const status = event.status || event.s || "future";
          return `<div class="tl-item ${escapeAttr(status)}">
  ${i18n.el("span", `${base}.events.${i}.date`, event.date || event.d, { className: "tl-date" })}
  ${i18n.el("span", `${base}.events.${i}.label`, event.label || event.l, { className: `tl-status st-${status}` })}
  ${i18n.el("p", `${base}.events.${i}.text`, event.text || event.p, { rich: true })}
  ${event.defer ? i18n.el("div", `${base}.events.${i}.defer`, event.defer, { className: "defer", rich: true }) : ""}
</div>`;
        })
        .join("");
      return wrapSection(
        section.id,
        `${head}<div class="tl reveal">${events}</div>${section.disclaimer ? i18n.el("div", `${base}.disclaimer`, section.disclaimer, { className: "disclaimer reveal", rich: true }) : ""}`,
        { band },
      );
    }

    case "prose": {
      const paragraphs = (section.paragraphs || [])
        .map((p, i) => i18n.el("p", `${base}.paragraphs.${i}`, p, { rich: true }))
        .join("");
      return wrapSection(
        section.id,
        `${head}<div class="measure reveal">${paragraphs}</div>${callout(section.callout, i18n, base)}`,
        { band },
      );
    }

    case "quiz": {
      if (section.questions) ctx.quiz = section.questions;
      return wrapSection(
        section.id,
        `${head}<div class="quiz reveal" data-quiz-root="${escapeAttr(section.id)}"></div>`,
        { band },
      );
    }

    default:
      throw new Error(`Unknown section type "${section.type}" in section "${section.id}"`);
  }
}

export function createBuildContext(content, i18n) {
  return {
    i18n,
    tierCards: {},
    filterMatrix: {},
    demos: [],
    customCss: [],
    customCount: 0,
    quiz: content.quiz || [],
  };
}
