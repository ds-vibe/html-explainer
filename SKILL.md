---
name: html-explainer
description: Build a polished, lightly-interactive single-page web explainer for educational, informational, or explanatory content. Use when the user wants to explain, teach, summarize, or visualize a topic, concept, policy, dataset, process, or body of knowledge as an interactive web page — emphasizing progressive complexity, strong visual design, source-grounded accuracy, and an iterative quality loop. Triggers on requests like "make an interactive explainer / guide / walkthrough / one-pager," "turn this into a visual web page people can explore," or "help people get acquainted with X and drill down."
---

# HTML Explainer

Build interactive explanatory web pages that teach a topic well: visually varied,
logically sequenced, accurate, and genuinely polished. The output is a page someone
can land on cold and come away understanding the subject — skimmable at the top,
drill-downable underneath.

This skill is a **process**, not a template. The quality comes from the loop, not from
filling in blanks. The things that matter most:

1. **A clear mental model & progressive complexity** — where the topic has one, give the
   reader a single way to *think* about it early, then sequence concepts so a newcomer can
   follow and reveal depth on demand. (A model that has to be forced is the wrong model —
   see Phase 1.)
2. **Show, don't tell — let the reader poke it.** The standout move: whenever a concept can
   be *demonstrated*, build a tiny **playable micro-demo** instead of writing a paragraph —
   a fill-in-the-blank, a slider that reshapes a live result, a click-to-reveal, a
   manipulable input that updates output instantly. "Learning by doing" is what makes an
   explainer memorable rather than just readable. Look hard for these opportunities.
3. **Visual design quality** — 10x it. Varied, polished, a consistent visual language
   that itself teaches.
4. **A real quality loop** — build, *actually look at it rendered*, critique like a human,
   improve, repeat.
5. **Research, prep & sharpening questions** — get the facts right first; turn a vague
   brief into a tight spec with a few questions.
6. **Trust** — cite sources, distinguish settled from uncertain, never fabricate.

---

> **STOP — do Phase 0 before writing any HTML or running any research.** Your FIRST response to
> a build request must be a short scoping interview covering **all six** must-ask questions below.
> **Use the environment's richest input UI:** where you have clickable choices / multiple-choice
> cards (cowork, the Claude app), present each axis as its own **option menu** with the recommended
> default pre-selectable (batch as many per round as the tool allows — don't stop at two); in
> plain-text chat (e.g. Claude Code), ask all six in **one consolidated message**. Either way:
> cover all six, don't substitute one or two of your own, and don't jump straight to building or
> web-searching. Quietly defaulting these (especially grounding, format, style) is the #1 reason
> the result comes out wrong.
>
> 1. **Grounding** — does the user have their own material to ground in, should you research
>    it from scratch, or both?
> 2. **Audience & depth** — newcomer / practitioner / both-layered, and how deep?
> 3. **Format** — scrolling page / slide deck / hybrid?
> 4. **Visual style** — minimal-editorial / bold-playful / technical-dark / brand-matched?
> 5. **Quiz** — include a knowledge check?
> 6. **AI chat** — a built-in Q&A bot, or not for v1?
>
> Recommend a sensible default for each so the user can one-click. Only after they answer do
> you research and build — and the deliverable is a real **`.html` file**, never pasted
> inline. Full detail for each question is in Phase 0 just below.

## Phase 0 — Research & sharpen (do this before any HTML)

- **Get the facts first. Do not plan or write content from memory** if the topic has
  load-bearing facts (dates, numbers, current state, anything past your training cutoff).
  Ground in the user's provided material and/or web-search / fetch primary sources and
  verify. A confident-but-wrong fact destroys an explainer's whole reason to exist.
- **Run a tight scoping interview before building.** Present the axes using the environment's
  richest input UI — **clickable option menus** (one per axis, default pre-selectable) where they
  exist (cowork, the Claude app); otherwise one consolidated text message (not a drip of
  one-at-a-time questions). Two tiers: a **must-ask set** covered on *every* build, and a
  **default-unless-relevant set** raised only when the topic calls for it. Recommend a default for
  each (one click); never make them design it. **Do NOT collapse the must-ask set to one or two
  questions** — quietly defaulting these (especially grounding, format, and style) is the single
  most common way the result comes out wrong.

  **Always ask (every build — do not skip, do not collapse):**
  - **Source material / grounding** — *ask first; it decides where the facts come from.*
    Does the user have **material to ground this in** (a doc, PDF, dataset, notes,
    transcript, a URL, an existing page), should you **research it from scratch**, or
    **both** (their material as the spine + research to verify and fill gaps)? If they have
    material, get it up front and treat it as the **primary source of truth** — draw
    specifics from it, cite within it, don't invent beyond it. Default: ground in whatever
    they provide; otherwise research from primary sources.
  - **Audience & depth** — newcomer / practitioner / both-layered, and how deep to go.
    Drives sequencing.
  - **Format / reading shape** — **scrolling page** (default — skim, reference,
    depth-on-demand) vs **slide deck / horizontal click-through** (linear narrative, talks,
    guided walkthroughs) vs **hybrid** (scroll within, snap between chapters). Changes the
    whole IA. See the format guide for deck mechanics.
  - **Visual style / vibe** — the most personal axis and the cheapest to get wrong. Offer
    presets + a recommended default: **minimal-editorial** (clean, Stripe-docs — good
    default) / **bold-playful** (color, big type) / **technical-dark** (dev-docs, dark UI) /
    **brand-matched** (they supply colors/font/a URL). Keep all style in centralized tokens.
  - **Quiz / knowledge check?** — don't assume no. A short "test yourself" (multiple-choice
    or fill-in with instant right/wrong feedback + a one-line *why*) makes an explainer
    stickier and works in a pure self-contained file. Place it *after* the teaching. Default
    **yes, a small end-of-section or end-of-page quiz** unless the user declines or it's
    reference-style.
  - **AI chat / Q&A interface?** — don't assume no. A built-in "ask a question" chatbot
    grounded in the content is a fork with **two ways to build it**, so ask which fits:
    - **Single-file, bring-your-own-key (no server):** drop in `scripts/chat-dock.js` — a
      floating "Ask the page" widget where the *reader* supplies their own API key (held in
      memory, sent straight to the provider). Keeps the explainer one portable `.html`. Best
      when there's no backend and you just want the feature on a static page. See the
      *Ask-the-page chat dock* section below.
    - **Server-route framework app (managed key):** when you want a shared, always-on bot
      with a key *you* control, you need a framework app + a server route (never put your own
      provider key in the browser). This forks the output target to a framework build.
    If yes, ask which providers (Claude / OpenAI / Gemini) and which of the two paths. If
    unsure, default **no chat for v1, but designed so it can be added later** — and say so.

  **Default unless the topic or their answers make it relevant (state your default; only ask if it matters):**
  - **Scope** — what's in vs out for v1.
  - **Interactivity depth** — beyond the quiz: filters, timelines, interactive diagrams,
    multiple micro-demos.
  - **Output target** — self-contained HTML file (default) / framework app / Notion page.
    Usually *determined* by the chat answer (server-side chat → framework). Notion trades
    away inline interactivity — flag it if picked. See the output-targets guide.
  - **Delivery / deploy** — the default is simply **the file itself**: hand over the `.html`
    to open and download — assume nothing more. Only deploy to a host (Vercel / Netlify /
    Cloudflare Pages / GitHub Pages) if the user actually wants a **shareable URL**, and only
    when a host CLI is authed or they can drag-drop. Don't assume deployment. See Phase 5.

  **Exception — programmatic harness only:** if this skill is driven by a *wrapper app that
  already collected these answers up front through its own form/inputs* (e.g. Explainer
  Studio), the answers arrive **with the brief** — honor them and don't re-interview. A
  normal chat with a person — including in the Claude app — is **NOT** this case: ask the
  must-ask set.
- Collect a **source list** as you go. Every non-obvious claim should be traceable.

## Phase 1 — Architecture for learning (sequence before you style)

- **Lead with orientation, not with the advanced/most-recent thing.** "What's new/changed"
  is great *for people who already know the topic* and confusing for newcomers. Default to
  a **learning path**: what is it → the core mental model → the specifics/payoff → details →
  the news/edge cases.
- **Find the load-bearing mental model — then commit to it (where the topic has one).**
  The best explainers hand the reader *one way of thinking* about the subject early — a
  metaphor, a reframing, or a single unifying picture — that the rest hangs on (e.g. "a
  vaccine is a harmless *preview*, so your body remembers"). Name it, introduce it before
  the details, and reuse it as a **throughline**: the centerpiece, the demos, and the
  recurring visual motif should all reinforce the *same* model. The test: a reader who
  finishes can restate it in a sentence.
  - **Don't force it, and don't turn it into a worksheet.** This is a judgment call, not a
    required field to fill in. Some topics — a reference matrix, a list of rules, a
    catalogue — have no single honest model; a clunky or leaky analogy that breaks under
    scrutiny is *worse* than none, because it quietly misleads. If a model only half-fits,
    say where it breaks or drop it. Lock one in when it genuinely makes the topic click;
    otherwise let clean structure carry the weight. One good model beats three half-models.
- **Lead with clarity, not cleverness — keep the model out of the headline.** The `<h1>` must
  **plainly name the topic** ("How compound interest works") — a metaphor may ride alongside but
  never *replace* it, and the small nav/brand label doesn't count as the title. Keep title and
  intro **editorial**, not slogan-y; introduce the model **once, in its own section** — don't
  stack 2–3 metaphors or let it become a slogan/joke/precious copy ("the off-switch", "changes
  outfits", "a wanted poster"). The model is a teaching tool, not a tagline. **State it once, then
  drop it** — don't dress the whole page in its costume (themed "RECIPE:" cards, badges repeating
  the metaphor, cutesy step labels like "throw the card away"); after the intro, use normal,
  professional section treatments.
- **Progressive complexity:** each section assumes only what earlier sections taught.
  Number or signpost the path ("Start here · 1 of 3") when it helps. Map the **concept
  dependencies** first — what must the reader grasp before X? — and order sections to honor them.
  Dependencies guide section *order* only — **never print "depends on:" labels** on the page;
  that exposes the scaffolding.
- **Optional: a "common misconception" callout** — name a classic wrong belief and correct it; only where one truly exists, never forced.
- **Layered depth (3 layers):** (1) plain-language always visible, (2) "go deeper"
  expanders for detail, (3) the raw source/data one click away (drawer/modal/link).
- **One clear centerpiece** — the section that delivers the core payoff (often a clean,
  filterable table/matrix or a single strong diagram). Build everything else around it.
- **Give experts a fast-path:** a sticky nav / table of contents so they can jump.
- Sketch the section order explicitly before building. Reorder freely — IA is usually the
  biggest quality lever, ahead of any visual.

## Phase 2 — Visual design system (the 10x bar)

- **Editorial, not corporate-template.** Aim for the polish of a great explainer
  (Vox / FT / Stripe-docs / The Pudding feel), not a compliance PDF or an AI-generated SaaS
  landing page. The target: confident editorial typography (a real display + text pairing),
  a restrained palette where color is mostly *semantic* (carries meaning, not decoration),
  generous whitespace, and no emoji. A **reference screenshot ships with this skill** at
  `reference/ai-act-explainer.jpg` — open and study it for *type, palette, and restraint
  only*. It is **not** a layout or format template: it happens to be a scrolling page, so
  don't let it bias you toward scroll — a slide deck can hit the exact same bar.
- **Actively avoid the "AI slop" look — it's the fastest way to lose trust.** The tells that
  scream "a robot made this," all to design *out*:
  - **Emoji as icons or UI.** Emoji in section headers, feature cards, step labels, or
    buttons (⏳🔒🚀✨🔍📊) is the #1 slop signal. Use a *cohesive* SVG icon set (one
    style — line **or** solid, not mixed), simple CSS shapes, numerals, or **nothing**.
    Never emoji as iconography.
  - **Decorative gradients & rainbow color.** Pastel purple→blue→pink hero washes,
    iridescent backgrounds, multi-colored titles, rainbow-coded rows. Color must be
    *intentional and mostly semantic* (carrying meaning), not decoration — see the next bullet.
  - **The default bento grid.** A 2×2 / 3×3 grid of identical rounded-white-cards-with-soft-
    shadow as the answer to every section. Cards are *one* device; leaning on them everywhere
    is the template look. Vary the treatment.
  - **Generic SaaS texture:** a drop shadow on every box, faux-3D, "✨ AI-powered" flourishes,
    Inter-on-pure-white blandness. Restraint reads as expensive; decoration reads as auto-generated.
- **A consistent visual language should teach.** Pick a small *semantic* system and use it
  *everywhere* so it becomes learnable: color = category/meaning (e.g. risk tier), a recurring
  motif = state (a "before → after" strikethrough/highlight for change; a badge for
  status/confidence). A considered palette is paper + ink + **one or two** accents that *mean*
  something — not a swatch per section.
- **Variety with rhythm:** each section gets a distinct visual treatment (cards, pyramid,
  flow diagram, timeline, matrix), but share spacing, type scale, and the color system so
  it feels like one thing. Alternate backgrounds to separate sections.
- **Typography & space:** strong hierarchy, comfortable measure (~60–70ch for prose),
  generous whitespace, balanced headings. A real type pairing (e.g. a serif display + a clean
  sans) beats system-Inter-everywhere.
- **Spacing on a scale, not by feel.** Spacing tokens (4/8px scale) used everywhere → consistent
  rhythm: even section padding, hero elements separated, equal gaps in repeated groups.
- **Contrast is per-surface.** A color legible on the page background won't be on a dark band,
  colored chip, or inverted hero — give each surface its own ink (≥4.5:1 body); never a
  near-background tint as text. Light **and** dark → define and verify both.
- **Use the horizontal space — proportioned, not a lonely column.** A ~720px column marooned
  in a sea of side-margin is its own slop tell. Let the *page* use the width while *prose*
  keeps its readable measure: give the **centerpiece** room (wide tables/matrices, timelines,
  galleries, diagrams can span far wider than the text column); use **full-bleed section bands**
  (a background color/rule spanning the viewport, content contained inside) to fill width and
  separate sections; reach for **two-column / asymmetric** layouts (prose beside a sticky
  visual, side-by-side compare) where they help. Cap the outer container generously
  (~1100–1280px) with balanced gutters — wide and composed, never edge-to-edge sprawl.
- **Motion with purpose:** scroll-reveal and smooth transitions add life; never gratuitous.
  Make reveals **self-healing** (a failsafe timer that forces everything visible if the observer
  doesn't fire) — content must never stay stuck at `opacity:0` (also why such pages screenshot blank).
- **Don't over-engineer the dataviz.** A clean, legible conventional chart/table beats an
  exotic treemap/sunburst almost every time. Fancy ≠ clear. Reach for advanced viz only
  when the data genuinely needs it.
- Default to **shadcn/ui + Tailwind** in a framework build, or hand-rolled CSS in a single
  file. Either way: design tokens / CSS variables, not magic numbers scattered around.

## Phase 3 — Build

- **The deliverable is an actual file, never pasted into the chat.** A single-file
  explainer must be **written to a real `.html` file** (e.g. `eu-ai-act.html`) that the
  user can open, download, and iterate on — *not* dumped inline as a code block or prose in
  your reply. Wherever you can create files (Claude Code, the desktop/web app's file or
  artifact tools, cowork, a framework repo), create the file and hand over its path/link.
  Only if you genuinely have no file-creation capability may you fall back to a single
  fenced code block the user can save themselves — and say that's what you're doing and why.
  This is also what makes Phase 4 (render & screenshot) and the review overlay possible:
  you can't screenshot or open a page that only exists as chat text.
- Pick the delivery target (decision guide below) and build the centerpiece first, then
  the supporting sections, then polish.
- **Accessibility & responsive are not optional:** semantic HTML, keyboard-operable
  controls, sufficient contrast, alt text, and a real mobile layout (test it — see Phase 4).
- Keep content in **structured data** (a JSON array, a JS object) separate from
  presentation when there's any repetition — it makes the 10x loop and edits far easier.

## Phase 4 — The quality loop (this is where quality actually comes from)

**This phase is not optional and is not "if you have time."** A draft you have not
critiqued is a draft, not a deliverable. The single most common failure of this skill is
declaring it done straight from the generated code — that is exactly how slop ships (emoji
icons, a lonely column, a widget with a JS error nobody ran). Do not skip it, even for a
"quick" page, even on a weak model, even when no browser is available.

**Step 0 — Static pre-flight (MANDATORY, runs even with no browser).** Before any
screenshot, re-read your own output and fix every one of these — each is a blocker, not a
nitpick. Do not deliver until all pass:
- [ ] **No emoji used as icons/UI** anywhere (headers, cards, buttons, lists). If you want
      icons, use a cohesive SVG/icon-font set you *actually render*, simple CSS shapes,
      numerals, or nothing. (Loading an icon font and then using emoji is an automatic fail.)
- [ ] **A real type pairing** — a display/serif face + a clean sans via a web font, with
      design tokens at `:root`. Not the bare system-font stack, not Inter-on-white only.
- [ ] **Horizontal space is used** — the page is composed and proportioned, with a wide
      centerpiece and/or full-bleed section bands; prose stays ~60–70ch but the *page* is not
      a single ~720–800px column stranded in empty margins.
- [ ] **No other AI-slop tells** — no decorative/iridescent gradients, no rainbow text/rows,
      no 2×2 bento grid of identical soft-shadow cards, no drop-shadow-on-everything.
- [ ] **The JS actually runs** — no syntax errors (watch unescaped quotes/apostrophes in JS
      strings), no undefined references; every interactive widget works, not just renders.
- [ ] **Visual variety & a learnable semantic language** — sections don't all look identical
      (vary the treatment — not every section a full-width band of cards); color carries meaning
      consistently.
- [ ] **Containment, unique IDs & rendered widgets** *(critical with no browser — trace each by
      hand)*. Interactive content (quiz options, cards, rows) sits **inset within the content
      column** — verify its left/right edges are within the page gutter, not merely that there's no
      horizontal scroll (full-width spill causes no scroll but still looks broken). Every widget
      actually renders content (no empty cards / blank quiz). **Never reuse an `id`** on a wrapper
      and its inner content — `getElementById` returns the first, so the widget renders into the
      wrong (often full-width) element → blank or edge-bleeding. This single bug causes both
      failures.
- [ ] **Contrast — computed, not eyeballed.** Estimate the WCAG ratio for each text/background
      pair (≥4.5:1 body, ≥3:1 large). Catch the classic fail: a highlight reused on the wrong
      surface (white-on-light, dark-on-dark). Re-derive ink per surface (bands, chips, inverted
      hero); if light **and** dark, both must pass.
- [ ] **Spacing on a scale, not cramped.** Even section padding; hero eyebrow→title→subtitle→meta
      clearly separated; equal gaps in repeated groups; nothing touching edges. Uneven spacing is
      the fastest "unfinished" tell.
- [ ] **Title & voice.** The `<h1>` plainly names the topic (not a bare metaphor; the nav brand
      doesn't count); title/intro read editorial, not slogan-y or jokey; the model appears once
      in the body, not stacked across title + lede + first heading.
- [ ] **Visuals match the words.** Every diagram/chart/demo/metaphor must *depict the claim* —
      direction, order, magnitude, and legend all agree with the sentence next to it (e.g. don't
      draw an up-sloping hill under "rolling downhill"; arrows, axes, sizes, and color keys match
      the text). A visual that contradicts its caption misleads even when each is fine alone.
- [ ] **Accessible & responsive** — semantic HTML, keyboard-operable controls, alt text, and a
      real mobile layout (stacks cleanly, no horizontal overflow, tap targets ≥40px).

Then run the look-and-fix loop:

1. **Render it for real** and **look at it.** Use a headless browser to screenshot the
   page — desktop *and* mobile — including **every interactive state** (expanded items,
   filters applied, drawers/modals open, nav scrolled). A bundled helper is at
   `scripts/shoot.mjs` (Playwright): `node scripts/shoot.mjs <url> <outDir>`.
   Then **Read the screenshots** and judge them. **No browser (e.g. the Claude app)?** Run Step 0
   rigorously, **computing contrast from your own tokens** (where washed-out text is caught);
   then — since the user sees what you can't — ask them to look or paste a screenshot, and say
   the visual pass didn't run. If any code execution exists, render there first.
2. **Critique like a human seeing it cold:** What's confusing? What looks merely "fine"
   instead of great? What's barren, cramped, misaligned, or low-contrast? Is the *order*
   right? Would a newcomer follow it? If the piece leans on a mental model, does it land —
   could the reader restate it — and does the throughline hold, or does it fade after the intro?
3. **10x the weak spots** — then re-screenshot to confirm. Repeat until you'd be proud to
   ship it without being asked to improve it.
4. "It builds / it renders text" is **not** "it's good." Almost every real improvement in
   a good explainer is found by *looking*, not by testing that it compiles.

## Phase 5 — Verify & ship

- **Fact-check pass:** spot-check claims against the sources; make sure every citation
  resolves to the right place.
- **Trust surface:** include source links/attribution and, where relevant, a short
  disclaimer; distinguish settled facts from uncertain/forecasted ones in the UI.
- **Deliver the file first — deployment is opt-in, not assumed.** For the default
  single-file build, the deliverable is the **`.html` file itself**: the user opens it
  locally or downloads it, and most people want exactly that. Do **not** deploy by default
  and do **not** push a host on them. Just hand over the file (plus the *Review & edit* link
  if you included the overlay).
- **Offer a shareable URL only when it's useful — and only deploy if asked or clearly
  wanted.** If the user does want a link they can send, deploying a static file is a thin
  slice: rename it to `index.html`, then either run it for them *if a host CLI is already
  authed* (`vercel --prod --yes`, or `netlify deploy --prod --dir=.`), or point them at the
  zero-CLI path (**Netlify Drop**: drag the folder onto `app.netlify.com/drop`). No
  `vercel.json` / `netlify.toml` needed. If no CLI is authed (e.g. the Claude app), the file
  is the deliverable — don't pretend to deploy. If the page *must* be a real URL, confirm
  it's actually served and returns 200 (a file in a repo root is not a URL).
  - **Framework app (chat / runtime features):** *this* is where deploy earns real guidance —
    env vars for provider keys, a build step, server routes, and optionally git-connected
    auto-deploy. Reserve CI/CD and env-var setup for this path; the static default never needs it.
  - Stay host-neutral — for a static file Vercel / Netlify / Cloudflare Pages / GitHub Pages
    are equivalent; use whatever account the user already has, and fall back to the local
    file if no CLI is authed.
- **Hand off for revision — don't make the reviewer guess a URL.** If you included the
  review overlay (see *Review & edit mode* below), deliver the page as **two labelled
  links**: a **View (read-only)** link and a **Review & edit** link (the same URL +
  `?edit`), with a one-line note on what the edit link does (edit text inline → download, or
  annotate → copy a revision brief for the LLM). For a **local file** (no second URL to give
  out) ship `<body data-review-toggle>` so a discreet in-page "Review" button turns it on.
  The edit link/toggle is safe to share — all edits and notes are client-side and can't
  change what View-link readers see. Surfacing the affordance as a labelled link (or visible
  button) is the point: `?edit` alone is invisible and guessable.

## Phase 6 — Revise (the first delivery is a draft, not the end)

- **Expect a round of changes.** Almost no one loves v1 exactly as-is — the most common
  feedback is *aesthetic* ("nice, but I don't love the look"). Treat the first ship as a
  draft to react to, and make revision cheap by design.
- **Restyle should be a token swap, not a rewrite.** Because all color/type/spacing
  decisions live in centralized design tokens (Phase 2), changing the whole vibe —
  minimal-editorial → bold-playful, light → dark, brand-match — is editing a handful of
  variables, not touching every section. If a restyle request means hunting through markup,
  that's a sign the tokens weren't centralized; fix that first.
- **Other common revisions:** re-scope (add/cut a section), add or remove interactivity
  (e.g. promote a paragraph to a playable micro-demo), change the output target, refresh a
  fact. Re-run the relevant earlier phase for each rather than patching blindly.
- **Let non-technical reviewers feed this loop directly.** The review overlay (next section)
  is the front end of Phase 6: a reviewer edits text in-place or leaves notes on the rendered
  page, and you apply the resulting revision brief to the *source* (keeping structured data +
  tokens intact) and re-run the quality loop.
- **Re-run the quality loop after any visual change.** A token swap can break contrast,
  rhythm, or a chart's legibility — re-screenshot (desktop *and* mobile, every interactive
  state) and *look*, exactly as in Phase 4. Don't declare a restyle done from the diff.

---

## Output targets (pick one in Phase 0)

- **Single self-contained `.html`** (inline CSS, minimal/no JS, or vanilla JS): default for
  static or lightly-interactive explainers (accordions via `<details>`, tabs, filters,
  scroll-reveal, **playable micro-demos**). Maximally portable, opens offline, trivial to
  share. Prefer this unless you need a server. **Deliver it as a real `.html` file** the
  user can open/download (see Phase 3) — never as an inline code block in the chat.
- **Framework app (Next.js on Vercel):** when you need a server — most commonly a **chatbot**
  (to keep an API key off the client), server-side data, or auth. Use the AI SDK for chat.
- **Notion page** (via the Notion API / Notion MCP): when the user lives in Notion or wants
  it editable in their workspace. Map the structure to native blocks — **toggles** =
  go-deeper/progressive disclosure, **callouts** = notes/disclaimers, **tables** = the
  matrix, **columns** = side-by-side, **headings/dividers** = sections, **bookmarks** =
  sources. *Big caveat:* Notion can't run custom JS, so the live micro-demos don't work
  inline — either (a) accept a static (still nicely-structured, toggle-rich) version, or
  (b) **embed a hosted interactive widget** via an `/embed` iframe (build the widget as a
  tiny self-contained HTML, host it, embed it). Tell the user this trade-off before building.
  Requires a Notion integration token / shared parent page.

## Format & reading shape (chosen in Phase 0 — orthogonal to output target)

Two shapes, same content and same micro-demos/quiz inside either. This is an *IA* choice,
not a styling one — decide it before sequencing.

- **Scrolling page (default).** One long vertical document, scroll-reveal, sticky nav,
  depth-on-demand expanders. Best for skim, reference, sharing a deep link to a spot, and
  "let me explore at my own pace." Most explainers want this.
- **Slide deck / horizontal click-through ("PowerPoint shape").** Full-viewport panels you
  advance laterally. Best for a *linear narrative*, a talk, or a guided walkthrough where you
  want one idea on screen at a time and a sense of progress. Build it properly:
  - **One concept per slide**, sized to a single viewport. If a slide overflows, let it
    scroll *vertically within the slide* rather than cramming.
  - **Advance controls, all of them:** on-screen prev/next buttons **and** keyboard
    (`←`/`→`, `PageUp`/`PageDown`, `Space`), **and** touch-swipe on mobile. Never trap the
    keyboard.
  - **Always-visible progress:** a slide counter ("4 / 11") and/or a dot/bar indicator.
  - **Deep-linkable & restorable:** sync the current slide to the URL hash (`#3`) so a slide
    is shareable and refresh-safe; read the hash on load.
  - **Mechanics:** a horizontal flex track with `transform: translateX(-N*100vw)` (or CSS
    scroll-snap on the x-axis). Respect `prefers-reduced-motion` (cut the slide transition).
    Keep focus management sane (move focus to the new slide's heading on advance).
  - **Accessibility:** each slide is a labelled `section`/`region`; controls are real
    buttons; arrow-key handling doesn't break form fields inside a micro-demo.
  - **Trade-off to state up front:** decks are worse for skimming and reference, and a
    reader can't see the whole shape at once — offer a "jump to slide" menu to compensate.
- **Hybrid:** chaptered scroll with `scroll-snap` between chapters — a middle ground when
  the content is mostly linear but some chapters run long.

Keep the chosen shape in **one place** (a layout wrapper + a couple of tokens/flags) so
switching scroll ⇄ deck later is a contained change, not a rewrite (Phase 6).

## Drop-in widgets (`scripts/` — paste inline before `</body>`; full usage in each file's header)

Both are self-contained JS+CSS (single-file pages can't use `<script src>` and stay portable),
inject their own themed UI, and adapt to light/dark. When inlining, escape any literal
`</`+`script>` in the file (the bundled copies already do).

- **`review-mode.js` — Review & edit overlay.** Front end of the Phase 6 revise loop; *default
  to including it.* Gives reviewers Preview / Edit text / Add note; **Download edits** exports a
  copy with notes appended as an HTML comment; **Copy notes for LLM** yields a revision brief.
  Activate via `?edit` or `<body data-review-toggle>`. Limits: per-browser, no server;
  `contenteditable` doesn't reach JS-rendered data (use the note path).
- **`chat-dock.js` — "Ask the page" BYOK chat.** The single-file way to do the Phase 0 "AI chat"
  axis with no backend: grounded in the page, using the *reader's own* key. Optionally set
  `window.CHAT_DOCK={provider,title,placeholder,suggestions}` first (`provider`: `anthropic`
  default | `openai`); `[data-chat-open]` opens it. Key stays in memory only — fine *because
  it's the reader's*; never ship **your** key this way (that's the server route).

## Interactivity patterns (reach for the simplest that fits)

- **★ Playable micro-demos (learn-by-doing) — reach for these first.** The highest-impact
  pattern: a small, focused widget that lets the reader *manipulate something and watch the
  result update live*. They turn passive reading into "oh, I get it." **Aim for at least 2
  distinct playable micro-demos** (separate from the quiz) where the topic supports it — roughly
  one per key concept; ship a single demo only when the topic genuinely can't support more, and
  say why. Forms that work well:
  - **Fill-in / pick-the-answer:** "what comes next?" with selectable options that react.
  - **Live input → live output:** a text box or value the reader edits, output recomputes
    instantly (e.g. type a sentence → see it transform).
  - **A slider that reshapes a result:** map a parameter to a visible change (e.g. a dial
    that re-weights a chart) — ideally driven by the *real* formula so it's correct, not faked.
  - **Click-to-explore:** click an element to reveal what connects to it / what it means.
  - **Step-through:** a "do one more step" button that advances a process token-by-token.
  Keep each demo tiny and about ONE idea; prefill sensible defaults; label clearly if the
  data/model is **illustrative**; ensure it's keyboard-operable and works on mobile.
- **Progressive disclosure:** `<details>`/accordion, "go deeper" expanders, tabs.
- **Filterable table/matrix:** the workhorse centerpiece for "what applies to / what is X".
- **Timeline:** for sequence/schedule; overlay variants (e.g. before vs after) and a "today"
  marker when relevant.
- **Click-through citations:** a shared slide-in drawer/modal that shows the source text +
  a deep link, reused everywhere.
- **Interactive diagram:** pyramid/flow/grid where clicking a node reveals detail.
- **Quiz / knowledge check:** a short "test yourself" — multiple-choice or fill-in — with
  **instant** right/wrong feedback and a one-line *why* for each answer (the explanation is
  the point, not the score). Place it *after* the teaching it checks; an end-of-section
  mini-check or a 3–5 question end-of-page quiz both work. Pure client-side, no server.
  Keep questions about understanding, not trivia recall; show a friendly final tally;
  let the reader retry. Keep the questions in **structured data** (array of
  `{q, options, answer, why}`) so they're easy to edit and re-order.
- **Chat / "ask the page" (optional):** single-file → inline `scripts/chat-dock.js` (grounded BYOK);
  shared/managed-key → a server route (framework build). See *Drop-in widgets*.

## Anti-patterns (the mistakes this skill exists to prevent)

- Planning/writing facts from memory instead of researching → confidently wrong content.
- Leading with the advanced or "latest" material → loses newcomers.
- **Forcing a mental model where the topic doesn't have one** — a clunky, leaky analogy
  that breaks under scrutiny misleads more than it teaches. A wrong model is worse than none.
- **A pile of facts with no organizing idea** when the topic *does* have a natural model —
  introducing a framing in the intro, then abandoning it instead of carrying it through.
- Over-engineered dataviz (treemap/sunburst when a table would be clearer).
- Declaring it done without ever rendering and *looking* at it.
- **The visual-slop & layout sins** — emoji-as-icons, decorative gradients/rainbow color, the
  generic 2×2 bento grid, drop-shadow-on-everything, washed-out text, cramped/uneven spacing, a
  lonely ~720px column, edge-bleeding widgets: all are **blockers in the Phase-4 pre-flight** (see
  there for the specifics) — don't ship them.
- Citations/claims with no traceable source.
- Shipping a file that isn't actually reachable as a URL when the user wants to share it.
- Putting an LLM/provider **key in client code** → leaked key. Keep keys server-side, or BYOK in
  memory only.
- A slide deck that **traps the keyboard**, can't be deep-linked, or hides progress.
- A quiz placed *before* its teaching, or one that scores without explaining *why*.

## Definition of done

Ship only when **every Phase-4 Step-0 pre-flight box passes**, plus: researched & fact-checked,
sources cited; sequenced for a newcomer with an expert fast-path; **≥2 playable demos** where the
topic supports it; every interactive state verified by screenshot (or computed audit + a human
look when no browser); and the file is delivered (reachable/shareable if a URL was wanted).
Format-specific: a **deck** has working keyboard + swipe + deep-link + progress; a **quiz** gives
instant feedback with a *why* and allows retry.
