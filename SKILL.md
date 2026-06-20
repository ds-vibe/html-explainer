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

1. **Logical presentation & progressive complexity** — sequence concepts so a newcomer
   can follow; reveal depth on demand.
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

## Phase 0 — Research & sharpen (do this before any HTML)

- **Get the facts first. Do not plan or write content from memory** if the topic has
  load-bearing facts (dates, numbers, current state, anything past your training cutoff).
  Web-search / fetch primary sources and verify. A confident-but-wrong fact destroys an
  explainer's whole reason to exist.
- **Ask 4–6 sharp scoping questions** before building — only the ones that change the
  architecture. Cover these axes; each has a sensible default, so *ask* the ones that
  genuinely fork the build and just state-and-default the rest:
  - **Audience & depth** (newcomer / practitioner / both-layered) — drives sequencing.
  - **Scope** (what's in vs out for v1).
  - **Interactivity** (static page? filters? timeline? interactive diagrams?).
  - **Quiz / knowledge check?** — *always ask explicitly; don't assume no.* A short "test
    yourself" — multiple-choice or fill-in with instant right/wrong feedback and a brief
    "why" — is a high-value, low-cost addition that makes an explainer stickier (people love
    checking what they retained). Works in a pure self-contained file (no server). Place it
    *after* the relevant teaching, not before. Default **yes, a small end-of-section or
    end-of-page quiz** unless the user declines or the topic is reference-style. See the
    quiz pattern under Interactivity.
  - **AI chat / Q&A interface?** — *always ask this explicitly; don't assume no.* Does the
    user want a built-in "ask a question" chatbot grounded in the content? This is a major
    fork: **yes → you need a framework app + a server route + the BYOK key pattern** (you
    cannot safely call an LLM provider directly from the browser). If yes, also ask which
    providers (OpenAI / Anthropic / Gemini) and whether there's a server key or it's
    BYOK-only. If the user is unsure, default to **no chat for v1, designed so it can be
    added later** — and say so.
  - **Audio — narration / sound / music?** — *ask explicitly when the topic or vibe could
    benefit (walkthroughs, immersive/playful styles); fine to default off otherwise.* Options:
    spoken **narration** per section, subtle **UI/interaction sound effects**, and/or
    **background music/ambience**. Providers: **ElevenLabs** (best-in-class voices + a
    text→**sound-effects** API + music) and **OpenAI** (cheap, steerable TTS via
    `gpt-4o-mini-tts`; no native music). Key fact that drives architecture: **you can't put
    these API keys in the browser.** For *fixed* page content, default to **pre-generating
    the audio at build time** into files you ship next to the page (no server, no runtime
    keys); only reach for a server route + BYOK when audio must be generated from *dynamic*
    input at runtime. Default **off** unless asked; if yes, see the audio guide. Always:
    mute control, no autoplay without a user gesture, and keep the on-page text as the
    transcript.
  - **Output target** (self-contained HTML file / framework app / **Notion page** — see
    the output-targets guide). Often *determined* by the chat/audio answers (server-side
    chat or runtime audio → framework), so ask those first. Notion trades away inline
    interactivity — flag that if they pick it.
  - **Format / reading shape** — *ask this; it changes the whole IA.* **Scrolling page**
    (default — best for skim, reference, and depth-on-demand) vs **slide deck / horizontal
    click-through** (a "PowerPoint-shaped" lateral experience you advance with arrows/clicks
    — great for linear narrative, talks, and guided walkthroughs) vs a **hybrid** (scroll
    within, snap between chapters). The micro-demos and quiz live happily inside either.
    Default **scrolling page**; offer the deck when the content is naturally linear or the
    user wants something presentation-like. See the format guide for the deck mechanics.
  - **Visual style / vibe** — *always ask; it's the most personal axis and the cheapest to
    get wrong.* Offer presets and a recommended default, e.g. **minimal-editorial**
    (clean, Stripe-docs feel — good default) / **bold-playful** (color, big type, fun) /
    **technical-dark** (dev-docs, dark UI) / **brand-matched** (give me colors/font/a URL to
    match). Keep all style decisions in centralized tokens so it's cheap to change later
    (see Phase 6).
  - **Deploy** — where should it end up? (see Phase 5). Options: **Vercel / Netlify /
    Cloudflare Pages / GitHub Pages / none (just the local file)**. Assumes the user has an
    account on the chosen host; if CLI isn't authed, guide them or fall back to the file.
  Recommend a default for each; don't make the user design it.
- Collect a **source list** as you go. Every non-obvious claim should be traceable.

## Phase 1 — Architecture for learning (sequence before you style)

- **Lead with orientation, not with the advanced/most-recent thing.** "What's new/changed"
  is great *for people who already know the topic* and confusing for newcomers. Default to
  a **learning path**: what is it → core mental models → the specifics/payoff → details →
  the news/edge cases.
- **Progressive complexity:** each section assumes only what earlier sections taught.
  Number or signpost the path ("Start here · 1 of 3") when it helps.
- **Layered depth (3 layers):** (1) plain-language always visible, (2) "go deeper"
  expanders for detail, (3) the raw source/data one click away (drawer/modal/link).
- **One clear centerpiece** — the section that delivers the core payoff (often a clean,
  filterable table/matrix or a single strong diagram). Build everything else around it.
- **Give experts a fast-path:** a sticky nav / table of contents so they can jump.
- Sketch the section order explicitly before building. Reorder freely — IA is usually the
  biggest quality lever, ahead of any visual.

## Phase 2 — Visual design system (the 10x bar)

- **Editorial, not corporate-template.** Aim for the polish of a great explainer
  (Vox / FT / Stripe-docs feel), not a slide deck or a compliance PDF.
- **A consistent visual language should teach.** Pick a small semantic system and use it
  *everywhere* so it becomes learnable: e.g. color = category, a recurring motif = state
  (a "before → after" strikethrough/highlight for change; a badge for status/confidence).
- **Variety with rhythm:** each section gets a distinct visual treatment (cards, pyramid,
  flow diagram, timeline, matrix), but share spacing, type scale, and the color system so
  it feels like one thing. Alternate backgrounds to separate sections.
- **Typography & space:** strong hierarchy, comfortable measure (~60–70ch), generous
  whitespace, balanced headings.
- **Motion with purpose:** scroll-reveal and smooth transitions add life; never gratuitous.
- **Don't over-engineer the dataviz.** A clean, legible conventional chart/table beats an
  exotic treemap/sunburst almost every time. Fancy ≠ clear. Reach for advanced viz only
  when the data genuinely needs it.
- Default to **shadcn/ui + Tailwind** in a framework build, or hand-rolled CSS in a single
  file. Either way: design tokens / CSS variables, not magic numbers scattered around.

## Phase 3 — Build

- Pick the delivery target (decision guide below) and build the centerpiece first, then
  the supporting sections, then polish.
- **Accessibility & responsive are not optional:** semantic HTML, keyboard-operable
  controls, sufficient contrast, alt text, and a real mobile layout (test it — see Phase 4).
- Keep content in **structured data** (a JSON array, a JS object) separate from
  presentation when there's any repetition — it makes the 10x loop and edits far easier.

## Phase 4 — The quality loop (this is where quality actually comes from)

After building each slice, **do not declare it done from the code.** Run the loop:

1. **Render it for real** and **look at it.** Use a headless browser to screenshot the
   page — desktop *and* mobile — including **every interactive state** (expanded items,
   filters applied, drawers/modals open, nav scrolled). A bundled helper is at
   `scripts/shoot.mjs` (Playwright): `node scripts/shoot.mjs <url> <outDir>`.
   Then **Read the screenshots** and judge them visually.
2. **Critique like a human seeing it cold:** What's confusing? What looks merely "fine"
   instead of great? What's barren, cramped, misaligned, or low-contrast? Is the *order*
   right? Would a newcomer follow it?
3. **10x the weak spots** — then re-screenshot to confirm. Repeat until you'd be proud to
   ship it without being asked to improve it.
4. "It builds / it renders text" is **not** "it's good." Almost every real improvement in
   a good explainer is found by *looking*, not by testing that it compiles.

## Phase 5 — Verify & ship

- **Fact-check pass:** spot-check claims against the sources; make sure every citation
  resolves to the right place.
- **Trust surface:** include source links/attribution and, where relevant, a short
  disclaimer; distinguish settled facts from uncertain/forecasted ones in the UI.
- **Ship it somewhere shareable.** A self-contained HTML can be opened directly or dropped
  in a host's `public/` dir; a framework app deploys (e.g. Vercel). If the page must be a
  URL someone can send, make sure it's actually served (a file in the repo root is **not**
  a URL) and confirm it returns 200.

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
- **Re-run the quality loop after any visual change.** A token swap can break contrast,
  rhythm, or a chart's legibility — re-screenshot (desktop *and* mobile, every interactive
  state) and *look*, exactly as in Phase 4. Don't declare a restyle done from the diff.

---

## Output targets (pick one in Phase 0)

- **Single self-contained `.html`** (inline CSS, minimal/no JS, or vanilla JS): default for
  static or lightly-interactive explainers (accordions via `<details>`, tabs, filters,
  scroll-reveal, **playable micro-demos**). Maximally portable, opens offline, trivial to
  share. Prefer this unless you need a server.
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

## Audio: narration, sound & music (optional — chosen in Phase 0)

Audio can lift a walkthrough or a playful piece, but it's an enhancement, not a crutch:
the page must fully work **muted** (the on-page text is the transcript). Default **off**.

**The architecture-deciding fact:** ElevenLabs and OpenAI keys **cannot live in the
browser.** That forces one of two delivery models:

- **Pre-generated at build time (default, and right for fixed content).** Walk your
  structured content data, call the TTS / SFX API once per item in a small build script,
  and save the results as audio files you ship next to the page; the page just plays
  `<audio>`. No server, no runtime keys, works from a self-contained bundle, costs pennies
  once. Keep a **manifest** mapping `sectionId → audio file` (same "data separate from
  presentation" discipline as the rest of the skill). Re-run the script only when copy
  changes.
- **Runtime generation (only when content is dynamic).** Needed if you must narrate the
  reader's *own* input or a live chat answer. Requires a **framework app + server route**;
  the key stays server-side, or **BYOK** (in memory only, per-request header over HTTPS,
  never stored or logged) — same rules as the chat pattern.

**Providers (offer as options; the user has keys for both):**
- **ElevenLabs** — best-in-class **voices** (narration), plus a text→**sound-effects** API
  and **music/ambience** generation. Reach for it when voice quality or generated SFX/music
  matters. Endpoints: text-to-speech and sound-generation.
- **OpenAI** — cheap, steerable **TTS** (`gpt-4o-mini-tts` — you can direct tone/pace;
  `tts-1`/`tts-1-hd`). No native music. Also offers STT (`whisper`/`gpt-4o-transcribe`) if
  you want *voice input* into a demo.

**Three uses, ranked by value for an explainer:**
1. **Section narration** — a per-section "▶ Listen" toggle + a global play/pause; highlight
   the paragraph being read if cheap. Pre-generate. Highest value.
2. **Interaction sound effects** — tiny, subtle cues on demo events (a click, a correct quiz
   answer, an outbreak spreading). Keep them quiet, debounced, and behind the mute. Short
   pre-generated clips, or the Web Audio API for simple synth blips (no key needed).
3. **Background music/ambience** — **off by default**, behind an explicit toggle, low
   volume, loopable. Easy to overdo; use sparingly.

**Non-negotiables:** a visible **mute/volume** control; **no autoplay** without a user
gesture (browsers block it anyway); respect `prefers-reduced-motion` as a hint to keep
things calm; never block comprehension on audio. Captions/transcript come free — it's the
page text.

## Interactivity patterns (reach for the simplest that fits)

- **★ Playable micro-demos (learn-by-doing) — reach for these first.** The highest-impact
  pattern: a small, focused widget that lets the reader *manipulate something and watch the
  result update live*. They turn passive reading into "oh, I get it." Build one per key
  concept where feasible. Forms that work well:
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
- **Chat (optional, advanced):** ground it in your curated content (inject the corpus or
  retrieve over it); render citations. If users bring their own key (**BYOK**), keep the key
  **in memory only** (no localStorage/cookies), send it as a per-request header over HTTPS,
  use it transiently, and **never log or store it server-side**.

## Anti-patterns (the mistakes this skill exists to prevent)

- Planning/writing facts from memory instead of researching → confidently wrong content.
- Leading with the advanced or "latest" material → loses newcomers.
- Over-engineered dataviz (treemap/sunburst when a table would be clearer).
- Declaring it done without ever rendering and *looking* at it.
- A wall of uniform text/cards with no visual variety or hierarchy.
- Citations/claims with no traceable source.
- Shipping a file that isn't actually reachable as a URL when the user wants to share it.
- Putting an ElevenLabs/OpenAI (or any provider) **key in client code** → leaked key.
  Pre-generate audio at build time, or proxy through a server route.
- **Autoplaying** narration/music, or shipping audio with no mute → hostile; also blocked
  by browsers without a user gesture.
- A slide deck that **traps the keyboard**, can't be deep-linked, or hides all sense of
  progress — a deck must be at least as navigable as the scroll it replaced.
- A quiz placed *before* its teaching, or one that scores without explaining *why*.

## Definition of done

Researched & fact-checked · sequenced for a newcomer with an expert fast-path · visually
polished with a consistent learnable language · every interactive state looks good on
desktop and mobile (verified by screenshot) · sources cited · reachable/shareable.
Format-specific: if a **deck**, keyboard + swipe + deep-link + progress all work; if
**audio**, it plays only on a gesture, has a mute, and the page is complete in silence;
if a **quiz**, it gives instant feedback with a one-line *why* and lets the reader retry.
