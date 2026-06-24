---
name: html-explainer
description: Build a polished, lightly-interactive single-page web explainer for educational, informational, or explanatory content. Use when the user wants to explain, teach, summarize, or visualize a topic, concept, policy, dataset, process, or body of knowledge as an interactive web page — emphasizing progressive complexity, strong visual design, source-grounded accuracy, and an iterative quality loop. Triggers on requests like "make an interactive explainer / guide / walkthrough / one-pager," "turn this into a visual web page people can explore," or "help people get acquainted with X and drill down."
---

# HTML Explainer

Build interactive explanatory web pages that teach a topic well: visually varied, logically
sequenced, accurate, and genuinely polished. The output is a page someone can land on cold and
come away understanding the subject — skimmable at the top, drill-downable underneath.

This skill is a **process**, not a template. Quality comes from the loop, not from filling in
blanks. What matters most:

1. **A clear mental model & progressive complexity** — give the reader one way to *think* about
   the subject early (where the topic has one), then sequence so a newcomer can follow.
2. **Show, don't tell** — whenever a concept can be *demonstrated*, build a tiny **playable
   micro-demo** instead of writing a paragraph. Learning-by-doing is the standout move.
3. **Visual design quality** — 10x it: varied, polished, a consistent visual language that teaches.
4. **A real quality loop** — build, *actually look at it rendered*, critique like a human, improve.
5. **Research & sharpening questions** — get the facts right first; turn a vague brief into a spec.
6. **Trust** — cite sources, distinguish settled from uncertain, never fabricate.

---

> **STOP — do Phase 0 before writing any HTML or running any research.** Your FIRST response to a
> build request must be a short scoping interview covering **all six** must-ask questions below.
> **Use the environment's richest input UI:** where you have clickable choices / multiple-choice
> cards (cowork, the Claude app), present each axis as its own **option menu** with the recommended
> default pre-selectable (batch as many per round as the tool allows — don't stop at two); in
> plain-text chat (e.g. Claude Code), ask all six in **one consolidated message**. Either way: cover
> all six, don't substitute one or two of your own, and don't jump straight to building or
> web-searching. Quietly defaulting these (especially grounding, format, and style) is the #1
> reason the result comes out wrong.
>
> 1. **Grounding** — does the user have their own material to ground in, research from scratch, or both?
> 2. **Audience & depth** — newcomer / practitioner / both-layered, and how deep?
> 3. **Format** — scrolling page / slide deck / hybrid?
> 4. **Visual style** — minimal-editorial / bold-playful / technical-dark / brand-matched?
> 5. **Quiz** — include a knowledge check?
> 6. **AI chat** — a built-in Q&A bot, or not for v1?
>
> Recommend a sensible default for each so the user can one-click — **except AI chat, which gets no
> recommended default: present it as an open yes/no.** Only after they answer do you
> research and build — and the deliverable is a real **`.html` file**, never pasted inline.
> Detail for each axis is in Phase 0.

## Phase 0 — Research & sharpen (before any HTML)

- **Get the facts first — but only research if the topic needs it.** A confident-but-wrong fact destroys the explainer's reason to exist. But unnecessary research wastes 2–3 minutes on topics you already know cold. Before searching, ask: is this topic **settled** or **possibly dynamic**?
  - **Settled** — the topic is well-understood, stable, and your training data is authoritative. No research needed; go straight to Phase 1. Examples: how airplanes fly, how DNA replication works, how compound interest works, the French Revolution.
  - **Possibly dynamic** — the topic involves anything that changes: current legislation or amendments, a specific company/product, market data, recent events, regulatory status, anything post-cutoff, or a niche area where your training may be incomplete. Research before building.
  - This fork applies to **any domain** — a science topic can be dynamic (a new treatment, a recent discovery), and a legal topic can be settled (the US Constitution's original text). Judge the topic, not the category.
  - **Cap research at 2–3 fetches.** One authoritative primary source + at most 1–2 cross-checks. Stop there — more searches rarely change the content and burn minutes.
- **The six must-ask axes (from the gate above), in detail.** Present each as a **clickable option
  menu** where the environment offers one (cowork, the app); otherwise list them in one message.
  Recommend a default for each (one click); cover all six, never collapse to one or two:
  - **Grounding** — material to ground in (doc, PDF, dataset, notes, URL, existing page), research
    from scratch, or both? If they have material, treat it as the **primary source of truth** —
    draw specifics from it, cite within it, don't invent beyond it. Default: ground in what they
    give, else research from primary sources.
  - **Audience & depth** — newcomer / practitioner / both-layered, and how deep. Drives sequencing.
  - **Format / reading shape** — scrolling page (default) / slide deck / hybrid. Changes the whole
    IA. See *Format & reading shape*.
  - **Visual style / vibe** — the most personal axis. Offer presets + a default: minimal-editorial
    (clean, Stripe-docs — good default) / bold-playful / technical-dark / brand-matched (they supply
    colors/font/URL). All style in centralized tokens.
  - **Quiz / knowledge check?** — don't assume no. A short test-yourself (MC or fill-in, instant
    right/wrong + a one-line *why*) makes it stickier and works in a pure file. Default **yes, small
    end-of-section or end-of-page** unless declined or it's reference-style.
  - **AI chat / Q&A?** — don't assume no. Two ways to build it: **single-file BYOK** (inline
    `chat-dock.js` — reader supplies their own key; stays one portable `.html`) or **server-route
    framework app** (a key *you* control; forks the output target). If yes, ask which providers and
    which path; see *Drop-in widgets*. **Ask this as a genuine yes/no — don't pre-select or
    recommend "no," or quietly assume it.** Only if the user doesn't engage, proceed without chat
    (designed to add later) and say so.
- **Default unless the topic/answers make it relevant** (state your default; only ask if it matters):
  **depth/length** — *quick one-pager* (~3 min, one idea, ~1 demo) · **standard** (~8–10 min,
  default) · *comprehensive deep-dive* (more sections + demos; deeper layers); sets how much you
  build, distinct from *audience/depth* (who it's for) · scope (in/out for v1) · interactivity depth
  (filters, timelines, multiple demos) · output target (see *Output targets*) · delivery/deploy
  (default = hand over the file; see Phase 5).
- **Exception — programmatic harness only:** if a *wrapper app* already collected these via its own
  form (e.g. Explainer Studio), the answers arrive with the brief — honor them, don't re-interview.
  A normal chat with a person (including the Claude app) is **NOT** this case: ask the must-ask set.
- Collect a **source list** as you go; every non-obvious claim should be traceable.

> **Once the interview is answered: think, then immediately write the file. Do NOT output your architecture plan, section order, design token choices, or any "Phase 1/2 thinking" as chat text. All planning happens silently. The next thing after the interview response must be a Write call.**

## Phase 1 — Architecture for learning (sequence before you style)

- **Lead with orientation, not the advanced/latest thing.** Default to a learning path: what is it
  → the core mental model → the specifics/payoff → details → the news/edge cases.
- **Find the load-bearing mental model — then commit to it (where the topic has one).** Hand the
  reader *one way of thinking* early (a metaphor, reframing, or unifying picture) and reuse it as a
  **throughline** — centerpiece, demos, and recurring motif all reinforce the *same* model. Test: a
  reader who finishes can restate it in a sentence.
  - **Don't force it, don't make it a worksheet.** Some topics (reference matrix, list of rules)
    have no honest single model; a leaky analogy that breaks under scrutiny is *worse* than none. If
    a model only half-fits, say where it breaks or drop it. One good model beats three half-models.
- **Lead with clarity, not cleverness — keep the model out of the headline.** The `<h1>` must
  **plainly name the topic** ("How compound interest works") — a metaphor may ride alongside but
  never *replace* it (the nav/brand label is not the title). Keep title and intro **editorial**, not
  slogan-y; introduce the model **once, in its own section** — don't stack 2–3 metaphors or turn it
  into a slogan/joke/precious copy. The model is a teaching tool, not a tagline. **State it once,
  then drop it** — don't dress the whole page in its costume (themed "RECIPE:" cards, metaphor
  badges, cutesy step labels); after the intro, use normal, professional section treatments.
- **Progressive complexity:** map the **concept dependencies** first (what must the reader grasp
  before X?) and order sections so each assumes only what earlier ones taught. Signpost the path
  ("Start here · 1 of 3") when it helps. Dependencies guide section *order* only — **never print
  "depends on:" labels** on the page; that exposes the scaffolding.
- **Optional:** a "common misconception" callout — name a classic wrong belief and correct it; only
  where one truly exists, never forced.
- **Layered depth (3 layers):** (1) plain-language always visible, (2) "go deeper" expanders,
  (3) the raw source/data one click away.
- **One clear centerpiece** — the section that delivers the core payoff (a clean filterable
  table/matrix or one strong diagram). Build everything else around it.
- **Give experts a fast-path:** a sticky nav / table of contents.
- Sketch the section order before building; reorder freely — IA is the biggest quality lever.

## Phase 2 — Visual design system (the 10x bar) — *the source of truth for "what good looks like"*

- **Editorial, not corporate-template.** Aim for a great explainer's polish (Vox / FT / Stripe-docs
  / The Pudding), not a compliance PDF or AI-generated SaaS landing page. Target: confident editorial
  typography (a real display + text pairing), a restrained palette where color is mostly *semantic*
  (carries meaning, not decoration), generous whitespace, no emoji. A **reference screenshot** ships
  at `reference/ai-act-explainer.jpg` — study it for *type, palette, and restraint only*; it's not a
  layout/format template (it's a scrolling page — a deck hits the same bar).
- **Actively avoid the "AI slop" look** — the tells to design *out*:
  - **Emoji as icons/UI** (⏳🔒🚀✨🔍📊 in headers/cards/buttons) — the #1 slop signal. Use a
    *cohesive* SVG icon set (one style), CSS shapes, numerals, or nothing. Never emoji as iconography.
  - **Decorative gradients & rainbow color** — pastel hero washes, iridescent backgrounds,
    multi-colored titles, rainbow rows. Color must be intentional and mostly semantic.
  - **The default bento grid** — a 2×2/3×3 of identical soft-shadow cards as the answer to every
    section. Cards are *one* device; vary the treatment.
  - **Generic SaaS texture** — drop shadow on every box, faux-3D, "✨ AI-powered" flourishes,
    Inter-on-pure-white blandness. Restraint reads expensive; decoration reads auto-generated.
- **A consistent visual language should teach.** Small *semantic* system used everywhere: color =
  category/meaning (e.g. risk tier); a recurring motif = state (before→after highlight; a status
  badge). Paper + ink + **one or two** accents that *mean* something.
- **Variety with rhythm:** each section gets a distinct treatment (cards, pyramid, flow, timeline,
  matrix) but shares spacing, type scale, and the color system. Alternate backgrounds to separate.
- **Typography & space:** strong hierarchy, ~60–70ch measure for prose, generous whitespace, a real
  type pairing (serif display + clean sans) over system-Inter-everywhere.
- **Spacing on a scale, not by feel.** Spacing tokens (4/8px scale) used everywhere → consistent
  rhythm: even section padding, hero elements separated, equal gaps in repeated groups.
- **Contrast is per-surface.** A color legible on the page background won't be on a dark band,
  colored chip, or inverted hero — give each surface its own ink (≥4.5:1 body); never a
  near-background tint as text. Light **and** dark → define and verify both.
- **Use the horizontal space — proportioned, not a lonely column.** Let the *page* use the width
  while *prose* stays ~60–70ch: give the **centerpiece** room (wide tables/timelines/diagrams), use
  **full-bleed section bands**, reach for **two-column/asymmetric** layouts where they help. Cap the
  outer container ~1100–1280px with balanced gutters — never a ~720px column stranded in margins.
- **Motion with purpose:** scroll-reveal/transitions add life; never gratuitous. Make reveals
  **self-healing** (a failsafe timer forces everything visible if the observer doesn't fire) — content
  must never stay stuck at `opacity:0` (also why such pages screenshot blank).
- **Don't over-engineer the dataviz.** A clean conventional chart/table beats an exotic
  treemap/sunburst almost always. Reach for advanced viz only when the data needs it.
- Default to **shadcn/ui + Tailwind** in a framework build, or hand-rolled CSS in a single file.
  Either way: design tokens / CSS variables, not scattered magic numbers.

## Phase 3 — Build

- **The deliverable is an actual file, never pasted into the chat.** Write a single-file explainer
  to a real **`.html` file** (e.g. `eu-ai-act.html`) the user can open, download, and iterate on.
  Wherever you can create files (Claude Code, the desktop/web app's file/artifact tools, cowork, a
  repo), create the file and hand over its path/link. Only with genuinely no file-creation capability
  may you fall back to one fenced code block — and say so. (This is also what makes Phase 4's render
  and the review overlay possible.)
- **Hybrid build path (use this by default in Claude Code).** Write a raw HTML file — your page's
  content, CSS, and bespoke JS only. Do **not** inline `review-mode.js` or `chat-dock.js`. Then run
  the assembler to inject them:
  ```
  node ~/dev/html-explainer-hybrid/hybrid/assemble.mjs <raw-file.html> [--chat] -o <output.html>
  ```
  Pass `--chat` when the user requested an AI chat dock. The assembler adds `data-review-toggle`,
  injects the overlay and (optionally) chat-dock, validates unique IDs, and flags escaping issues.
  This keeps the raw file ~600 lines instead of ~1200, cutting generation time roughly in half.
- Build the **centerpiece first**, then supporting sections, then polish.
- **Accessibility & responsive are not optional:** semantic HTML, keyboard-operable controls,
  sufficient contrast, alt text, a real mobile layout (test it — Phase 4).
- Keep content in **structured data** (a JSON/JS array) separate from presentation wherever there's
  repetition — it makes the loop and edits far easier.

## Phase 4 — The quality loop (this is where quality actually comes from)

**Not optional, not "if you have time."** A draft you haven't critiqued is a draft, not a
deliverable. The most common failure of this skill is declaring it done straight from the generated
code — that's how slop ships. Don't skip it, even for a "quick" page, even on a weak model, even with
no browser.

**Step 0 — Static pre-flight (MANDATORY, runs even with no browser).** Re-read your output and fix
every one of these — each is a blocker. This checklist is the verification counterpart to Phase 2; do
not deliver until all pass:
- [ ] **No emoji as icons/UI** anywhere. Cohesive SVG/icon-font you *actually render*, CSS shapes,
      numerals, or nothing. (Loading an icon font then using emoji is an automatic fail.)
- [ ] **A real type pairing** — display/serif + clean sans via web fonts, tokens at `:root`. Not the
      bare system stack, not Inter-on-white only.
- [ ] **Horizontal space used** — composed and proportioned (wide centerpiece and/or full-bleed
      bands); prose ~60–70ch but the *page* is not a ~720–800px column in empty margins.
- [ ] **No other slop tells** — no decorative/iridescent gradients, no rainbow text/rows, no 2×2
      bento grid of identical soft-shadow cards, no drop-shadow-on-everything.
- [ ] **The JS actually runs** — no syntax errors (watch unescaped quotes/apostrophes in JS
      strings), no undefined refs; every interactive widget works, not just renders.
- [ ] **Visual variety & a learnable semantic language** — sections don't all look identical (vary
      the treatment — not every section a full-width band); color carries meaning consistently.
- [ ] **Containment, unique IDs & rendered widgets** *(critical with no browser)*. Interactive
      content (quiz options, cards) sits **inset within the content column** (check left/right edges
      are within the gutter, not just no horizontal scroll); every widget renders content (no empty
      cards/blank quiz). **Never reuse an `id`** on a wrapper and its inner content — `getElementById`
      returns the first → the widget renders into the wrong/full-width element (blank or edge-bleeding).
- [ ] **Contrast — computed, not eyeballed.** Estimate the WCAG ratio per text/background pair
      (≥4.5:1 body, ≥3:1 large). Catch the classic fail: a highlight reused on the wrong surface
      (white-on-light, dark-on-dark). Re-derive ink per surface; if light **and** dark, both pass.
- [ ] **Spacing on a scale, not cramped.** Even section padding; hero eyebrow→title→subtitle→meta
      clearly separated; equal gaps in repeated groups; nothing touching edges.
- [ ] **Title & voice.** `<h1>` plainly names the topic (not a bare metaphor; nav brand doesn't
      count); title/intro editorial not slogan-y; the model appears once in the body, not stacked.
- [ ] **Visuals match the words.** Every diagram/chart/demo/metaphor depicts the claim — direction,
      order, magnitude, legend all agree with the caption (don't draw an up-slope under "downhill").
- [ ] **Accessible & responsive** — semantic HTML, keyboard-operable, alt text, real mobile layout
      (stacks cleanly, no horizontal overflow, tap targets ≥40px).
- [ ] **Review & edit overlay inlined** — `review-mode.js` is in the page by default (with `<body
      data-review-toggle>`) unless the user opted out; the "Review & edit" launcher should appear.

Then run the look-and-fix loop:
1. **Render it for real and look.** Headless-browser screenshot — desktop *and* mobile — including
   **every interactive state** (expanded, filtered, drawers/modals open, nav scrolled). Helper:
   `node scripts/shoot.mjs <url> <outDir>` (Playwright). Then **Read the screenshots** and judge.
   **No browser (e.g. the Claude app)?** Run Step 0 rigorously, **computing contrast from your own
   tokens**; then — since the user sees what you can't — ask them to look or paste a screenshot, and
   say the visual pass didn't run. If any code execution exists, render there first.
2. **Critique like a human seeing it cold:** What's confusing, barren, cramped, misaligned,
   low-contrast? Is the *order* right? Would a newcomer follow it? Does the mental model land and hold?
3. **10x the weak spots** — then re-screenshot. Repeat until you'd ship it proudly unprompted.
4. "It builds / renders text" is **not** "it's good." Real improvements are found by *looking*.

## Phase 5 — Verify & ship

- **Fact-check pass:** spot-check claims against sources; every citation resolves to the right place.
- **Trust surface:** source links/attribution, a short disclaimer where relevant; distinguish
  settled facts from uncertain/forecasted in the UI.
- **Deliver the file first — deployment is opt-in.** For the default single-file build the deliverable
  is the **`.html` file**; most people want exactly that. Don't deploy by default or push a host. Hand
  over the file (plus the *Review & edit* link if you included the overlay — see *Drop-in widgets*).
- **Offer a shareable URL only when useful, and only deploy if asked.** Then it's a thin slice: rename
  to `index.html` and either run it *if a host CLI is authed* (`vercel --prod --yes`, `netlify deploy
  --prod --dir=.`) or point to the zero-CLI path (**Netlify Drop**). No `vercel.json`/`netlify.toml`.
  If no CLI is authed (e.g. the Claude app), the file is the deliverable — don't pretend to deploy. If
  it must be a real URL, confirm it's served and returns 200. **Framework apps** (chat/runtime) are
  where deploy earns real guidance (env vars for keys, build step, server routes). Host-neutral.
- **Hand off for revision** — if you included the review overlay, deliver **two labelled links**: a
  *View (read-only)* link and a *Review & edit* link (URL + `?edit`); for a local file ship `<body
  data-review-toggle>`. The edit link is safe to share (all client-side). See *Drop-in widgets*.

## Phase 6 — Revise (the first delivery is a draft, not the end)

- **Expect a round of changes** — usually aesthetic ("nice, but I don't love the look"). Treat v1 as
  a draft to react to, and make revision cheap by design.
- **Restyle = token swap, not rewrite.** Because color/type/spacing live in centralized tokens
  (Phase 2), changing the whole vibe is editing a handful of variables. If a restyle means hunting
  through markup, the tokens weren't centralized — fix that first.
- **Other common revisions:** re-scope (add/cut a section), add/remove interactivity, change output
  target, refresh a fact. Re-run the relevant earlier phase rather than patching blindly.
- **Non-technical reviewers can feed this loop directly** via the review overlay (*Drop-in widgets*):
  they edit in-place or leave notes; you apply the revision brief to the *source* and re-run Phase 4.
- **Re-run the quality loop after any visual change** — a token swap can break contrast, rhythm, or a
  chart's legibility. Re-screenshot and *look*; don't declare a restyle done from the diff.

---

## Output targets (pick one in Phase 0)

- **Single self-contained `.html`** (inline CSS, vanilla JS): default for static or lightly-interactive
  explainers. Maximally portable, opens offline, trivial to share. Prefer unless you need a server.
  Deliver as a real file (Phase 3), never an inline code block.
- **Framework app (Next.js on Vercel):** when you need a server — most commonly a **chatbot** with a
  managed key, server-side data, or auth. Use the AI SDK.
- **Notion page** (Notion API/MCP): when the user lives in Notion. Map to native blocks (toggles =
  go-deeper, callouts = notes, tables = the matrix, columns = side-by-side). *Caveat:* no custom JS,
  so live micro-demos don't work inline — accept a static toggle-rich version or embed a hosted widget
  via `/embed` iframe. State the trade-off first. Needs an integration token / shared parent page.

## Format & reading shape (chosen in Phase 0 — orthogonal to output target)

Same content and demos/quiz inside either; an *IA* choice, decided before sequencing.

- **Scrolling page (default).** One long vertical document, scroll-reveal, sticky nav,
  depth-on-demand. Best for skim, reference, deep-linking, self-paced. Most explainers want this.
- **Slide deck / horizontal click-through.** Full-viewport panels advanced laterally. Best for a
  linear narrative/talk/walkthrough. Build it properly:
  - **One concept per slide**, single-viewport; if it overflows, scroll *within* the slide.
  - **All advance controls:** on-screen prev/next **and** keyboard (`←`/`→`, `PageUp`/`PageDown`,
    `Space`) **and** touch-swipe. Never trap the keyboard.
  - **Always-visible progress:** slide counter ("4 / 11") and/or dots.
  - **Deep-linkable & restorable:** sync the slide to the URL hash (`#3`); read it on load.
  - **Mechanics:** horizontal flex track with `translateX(-N*100vw)` (or x-axis scroll-snap). Respect
    `prefers-reduced-motion`. Move focus to the new slide's heading on advance.
  - **Accessibility:** each slide a labelled `section`/`region`; real buttons; arrow keys don't break
    form fields inside a micro-demo.
  - **Trade-off to state:** worse for skim/reference — offer a "jump to slide" menu.
- **Hybrid:** chaptered scroll with `scroll-snap` between chapters.

Keep the chosen shape in **one place** (a layout wrapper + a couple of flags) so switching scroll ⇄
deck later is contained, not a rewrite.

## Drop-in widgets (`scripts/` — paste inline before `</body>`; full usage in each file's header)

Both are self-contained JS+CSS (single-file pages can't use `<script src>` and stay portable), inject
their own themed UI, and adapt to light/dark. When inlining, escape any literal `</`+`script>` in the
file (the bundled copies already do). **These are the single source of truth for chat & review.**

- **`review-mode.js` — Review & edit overlay.** Front end of the Phase 6 revise loop. **Inline it by
  DEFAULT in every single-file explainer** (before `</body>` + `<body data-review-toggle>`); only
  omit if the user opts out. Reviewers get Preview / Edit text / Add note; **Download edits** exports a copy with
  notes appended as an HTML comment; **Copy notes for LLM** yields a revision brief. Activate via
  `?edit` or `<body data-review-toggle>`. Limits: per-browser, no server; `contenteditable` doesn't
  reach JS-rendered data (use the note path).
- **`chat-dock.js` — "Ask the page" BYOK chat.** The single-file way to do the Phase 0 AI-chat axis
  with no backend: grounded in the page, using the *reader's own* key. Optionally set
  `window.CHAT_DOCK={provider,title,placeholder,suggestions}` first (`provider`: `anthropic` default |
  `openai`); `[data-chat-open]` opens it. Key stays in memory only — fine *because it's the reader's*;
  **never ship your own key this way** (that's the server-route framework path).

## Interactivity patterns (reach for the simplest that fits)

- **★ Playable micro-demos (learn-by-doing) — reach for these first.** A small widget that lets the
  reader *manipulate something and watch the result update live*. **Aim for at least 2 distinct
  playable micro-demos** (separate from the quiz) where the topic supports it — roughly one per key
  concept; ship a single demo only when the topic genuinely can't support more, and say why.
  Forms: **fill-in / pick-the-answer** ("what comes next?", ideally predict-then-reveal);
  **live input → live output**; **a slider that reshapes a result** (driven by the *real* formula);
  **click-to-explore**; **step-through**. Keep each tiny and about ONE idea; prefill sensible
  defaults; label illustrative data as such; keyboard-operable and works on mobile.
- **Progressive disclosure:** `<details>`/accordion, "go deeper" expanders, tabs.
- **Filterable table/matrix:** the workhorse centerpiece for "what applies to / what is X".
- **Timeline:** for sequence/schedule; before-vs-after overlays and a "today" marker when relevant.
- **Click-through citations:** a shared slide-in drawer/modal showing source text + a deep link.
- **Interactive diagram:** pyramid/flow/grid where clicking a node reveals detail.
- **Quiz / knowledge check:** short test-yourself (MC or fill-in) with **instant** right/wrong
  feedback + a one-line *why* (the explanation is the point). Place it *after* the teaching it checks.
  Keep questions in **structured data** (`{q, options, answer, why}`); friendly tally; allow retry.
- **Chat / "ask the page":** use `chat-dock.js` (single-file BYOK) or a server route (managed key) —
  see *Drop-in widgets*.

## Anti-patterns & definition of done

**Cardinal sins not already covered by the Phase-4 pre-flight:** facts from memory instead of
research · leading with advanced/"latest" material (loses newcomers) · forcing a mental model where
the topic has none (a leaky analogy is worse than none) · introducing a framing then abandoning it ·
declaring it done without ever rendering and *looking* · a key in client code / leaked provider key
(keep keys server-side or BYOK-in-memory) · a deck that traps the keyboard or can't be deep-linked ·
a quiz placed before its teaching or one that scores without a *why* · a file that isn't actually
reachable as a URL when the user wanted to share it.

**Definition of done:** every **Phase-4 Step-0 pre-flight** box passes · researched & fact-checked ·
sources cited · sequenced for a newcomer with an expert fast-path · the file is delivered (and
reachable/shareable if a URL was wanted). Format-specific: a **deck** has working keyboard + swipe +
deep-link + progress; a **quiz** gives instant feedback with a *why* and allows retry.
