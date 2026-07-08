---
name: html-explainer
description: Build a polished, lightly-interactive single-page web explainer for educational, informational, or explanatory content. Use when the user wants to explain, teach, summarize, or visualize a topic, concept, policy, dataset, process, or body of knowledge as an interactive web page — emphasizing progressive complexity, strong visual design, source-grounded accuracy, and an iterative quality loop. Triggers on requests like "make an interactive explainer / guide / walkthrough / one-pager," "turn this into a visual web page people can explore," or "help people get acquainted with X and drill down."
---

# HTML Explainer

Build useful explainers: interactive, polished and educational. Lets a user land on a page and come away with new understanding, whether they skim or drill down.

This skill is a **process**, not a template. Key goals:

1. **A clear mental model & progressive complexity** — give the reader one way to *think* about
the subject early (where the topic has one), then sequence so a newcomer can follow.
2. **Show, don’t tell** — whenever a concept can be *demonstrated*, build a tiny **playable
micro-demo** instead of writing a paragraph. Learning-by-doing.
3. **Visual design quality** — 10x it: varied, polished, a consistent visual language that teaches.
4. **A real quality loop** — build, actually look at it rendered, critique like a human, improve.
5. **Research & sharpening questions** — get the facts right first; turn a vague brief into a spec.
6. **Trust** — cite sources, distinguish settled from uncertain, never fabricate.

---

> **STOP — do Phase 0 before writing any HTML or running any research.** Your first response must be a short scoping interview covering **all seven** must-ask questions in Phase 0 — **grounding · audience & depth · format · play-it-straight-or-go-bold · visual style · quiz · AI chat.** Ask every one; the last (AI chat) is the most-skipped — do not drop it. You can add more questions (see below), but not subtract.
> 

## Phase 0 — Research & sharpen (before any HTML)

- **Get the facts first — but only research if the topic needs it.** Being wrong is bad, but unnecessary research on a well-established topic wastes 2–3 minutes on topics you already know. Before searching, ask: is this topic **settled** or **possibly dynamic**?
    - **Settled** — the topic is well-understood, stable, and your training data is authoritative. No research needed; go straight to Phase 1. Examples: how airplanes fly, how DNA replication works, how compound interest works, the French Revolution.
    - **Possibly dynamic** — the topic involves anything that changes: current legislation or amendments, a specific company/product, market data, recent events, regulatory status, anything post-cutoff, or a niche area where your training may be incomplete. Research before building.
    - This applies to **any domain** — a science topic can be dynamic (a new treatment, a recent discovery), and a legal topic can be settled (the US Constitution’s original text).
    - **Cap research at 2–3 fetches.** One authoritative primary source + at most 1–2 cross-checks. Stop there, since additional searches add little value and burn tokens and time.
    - **Gather synthesis while you research, not after.** As you read, note the parallels, tensions, ironies, and second-order effects (what does this resonate with? what’s the contradiction? who’s affected?). Use these later if they illuminate the html, but don’t force a connection that doesn’t exist.
- **The seven must-ask questions (from the gate above).** Present each as a **clickable option
menu** in the richest UI available in the environment (Cowork, Claude app); if you’re in plain text (e.g., Claude Code), then list them in one message. **If the menu tool caps how many questions you can ask per prompt (Cowork caps around four), ask them in multiple rounds — a first batch, then the rest — or put the overflow questions in the message text. Either way, ask all seven. NEVER silently apply a default to a must-ask (especially AI chat) just because the menu was full — a tool cap is not permission to skip.** Recommend a default for each (one click) — **except AI chat, which has no recommended default: ask it as an open yes/no.** Never skip any of the seven, including the last. **Labels must be self-explanatory — some surfaces (Cowork) show only the option *label* and drop the per-option description, so never rely on the description field to carry the meaning. If a choice isn’t obvious from a short label alone (e.g. *play it straight / go bold*, *scrolling / deck*), fold the gloss into the label text itself and repeat it in the description; when in doubt, put the key distinction in the question or message body too.**
    - **Grounding** — does the user have their own material (doc, PDF, notes, URL) to ground in? If yes, treat it as the **primary source of truth**. Ask this as: **“Do you have your own material to ground in?”** with options “No” (recommended default) and “Yes — I’ll provide it”.
    - **Audience & depth** — newcomer / practitioner / both-layered, and how deep. Drives sequencing.
    - **Format / reading shape** — scrolling page / slide deck / hybrid. **Neither is the default — pre-select the one that fits the topic** (deck for a linear narrative or an ordered sequence; scroll for reference or layered depth-on-demand). Changes the whole IA. See *Format & reading shape*. **Must be its own question — never combine with style.**
    - **Play it straight, or go bold?** — how far to commit the design, and the axis that decides the look, so **ask it before visual style (it gates that question).** **Never silently default to bland** — an unattended build drifts safe; this is what stops it. *“Bold” means committed and cohesive, not loud or decorated.* **Make the explanation UI-proof — never present the two as bare labels.** Some menu surfaces (e.g. Cowork) render only the option *labels* and drop the description field, so the gloss must live where no renderer can hide it: **fold it into the visible label text itself** — e.g. `Play it straight — sharp & professional, theme as a light accent` and `Go bold — immersive art direction built around the topic` — **and** also fill the per-option description (`Play it straight:` *Sharp and professional.* · `Go bold:` *Immersive art direction built around the topic.*) for surfaces that do show it. If you present the interview as plain text rather than a menu, write the gloss inline in the question. The reader must always see what each choice means without hovering or expanding.
        - **Play it straight** — clean editorial *excellence* (Stripe / FT / Vox): restrained layout, theme as a light accent, one subject-derived color. Sharp and polished, not timid. Best for reference, legal, compliance, or when the user wants it sober. → then ask the visual-style register (next question).
        - **Go bold** — commit to one strong, cohesive concept and turn the ambition up: **full art direction** (theme every surface — body, UI, sliders, quiz — into one immersive world, not just an accent, when it’s cohesive); **adventurous format** (break the standard eyebrow→heading→prose rhythm; asymmetry, dramatic scale, unexpected but purposeful structure and motion); **imaginative demos** (reach for the most vivid concept the topic allows, not the safe stepper - see *Themed interactivity is the gold standard* and *Interactivity Patterns* below); **a strong point of view**, with the prose-flair dial (see *Prose voice*) pushed up to match — they move together. Best for evocative, cultural, historical, or physical-phenomenon topics. → the concept pass drives the look (see visual style, next).
        - **Bold is not a license for slop — it’s the opposite.** Slop is *generic* (emoji icons, stock gradients, bento grids, the templated palette); bold is *specific and crafted*. Every anti-slop rule in Phase 2 still holds, and **legibility is non-negotiable at any intensity.** A bold build is judged **relevant + cohesive + legible** (Phase 2), never on “how much theme is too much.”
        - **Read the topic and recommend** (evocative → go bold; dry reference → straight), but the user chooses. This sets how hard Phases 2–4 commit; honor it — don’t let the QA gate quietly sand a bold build back to safe.
    - **Visual style / vibe** — **conditional on the answer above; all style lives in centralized tokens.**
        - **If “play it straight”:** offer a register + a default — minimal-editorial (clean, Stripe-docs — good default) / technical-dark / brand-matched (they supply colors/font/URL). Theme is at most a light accent.
        - **If “go bold”:** **skip the preset menu** — the concept pass (below) generates a **topic-matched art direction** from the subject itself (palette + typefaces derived from the concept, film-noir-style). You may offer a single **tonal leaning** so the user keeps a dial — e.g. *dark & dramatic* / *warm & vintage* / *bright & playful* — but the concept, not a preset, is the style. See Phase 2 for the build bar (relevant + cohesive + legible).
    - **Quiz / knowledge check?** — yes/no. A short test-yourself (MC or fill-in, instant right/wrong + a one-line *why*) makes it stickier and works in a pure file. Default **yes, small end-of-section or end-of-page** unless declined or it’s reference-style.
    - **AI chat / Q&A?** — **don’t assume no; ask this explicitly even for a single-file build** (it’s the most-skipped question). No recommended default — a genuine yes/no. If yes, build as a **single-file BYOK** (inline
    `chat-dock.js` — reader supplies their own key; stays one portable `.html`); ask which provider. Only proceed without chat if the user declines, and say it’s designed to add later. See *Drop-in widgets*.
- **Default unless the topic/answers make it relevant** (state your default; only ask if it matters):
**depth/length** — *quick one-pager* (~3 min, one idea, ~1 demo) · **standard** (~8–10 min,
default) · *comprehensive deep-dive* (more sections + demos; deeper layers); sets how much you build, distinct from *audience/depth* (who it’s for) · scope (in/out for v1) · interactivity depth (filters, timelines, multiple demos) · output target (see *Output targets*) · delivery/deploy
(default = hand over the file; see Phase 5).
- **Exception — programmatic harness only:** if a *wrapper app* already collected these via its own form (e.g. Explainer Studio), the answers arrive with the brief — honor them, don’t re-interview. A normal chat with a person (including the Claude app) is **NOT** this case: ask the must-ask set.
- Collect a **source list** as you go; every non-obvious claim should be traceable.
- **Prose voice (silent — not a user question).** One house voice: **Professional**.
    - Concrete-first and reportorial — lead with the fact or the object, state it plainly, and let specifics and numbers carry the weight. No reveal structure (“not X, it’s Y”), no aphoristic closers, no mic drops, no cutesy motifs. Em dashes should be rare; ask yourself “do I really need an em dash or will other punctuation do?”
    - Keep sentences lean at roughly newswire length, at or under the word count a showier draft would use; in a deck, treat ~45 words for a cover blurb and ~90 for a body slide as soft ceilings, and if a slide won’t compress it is carrying too much prose — give the weight to a demo or cut it.
    - **Important**: vary tone by **temperature, rhythm and sentence length** - set short, punchy sentences against longer flowing ones. Same length sentences read flat. **Write from the facts, then de-slop (see below):** editing a performed sentence keeps its shape, so rebuild it from what’s underneath. **Toggle**: You can dial the prose flair up or down depending on topic; for a legal writeup, the flair is low, but for a fun or imaginative explainer, it’s higher.

> **Once the interview is answered: think, then immediately write the file. Do NOT output your architecture plan, section order, design token choices, or any “Phase 1/2 thinking” as chat text. All planning happens silently. You may output ONE scope line first — `Scope: [N sections, centerpiece: X, ~N lines]` — nothing more. The next output after that must be a Write call. Match length to the chosen depth — *one-pager* ~300–500 raw lines, *standard* ~600–1100, *comprehensive* as long as the material earns it. If a build runs past its depth budget, **cut redundancy and padding first (that's the Phase-4 redundancy pass) — never trim real demos, art direction, or teaching just to hit a number**; a ~900–1000-line go-bold page with two or three working demos is expected, not bloat. Past ~1200 raw lines, stop and check it's richness, not sprawl.**

> **The concept pass — this is what “think” means above (silent; don’t output it).** A great page comes from *ideation*, not defaults. Do not build the first thing that works — generate real alternatives and commit to the strongest, deciding:
> - **Art direction — ideate 2–3 *distinct* directions and commit to the strongest. This runs for BOTH straight and bold** — the straight/bold answer sets the *target*, not whether you ideate. Don't settle for the first look that comes to mind; that's the safe default, and defaulting is what makes a build generic (bland-tasteful if straight, era-match costume if bold). **Never reflex-default:** no Inter-on-white, no templated cream + lone-rust palette (banned at *every* intensity — see the Phase 2 slop tells).
>   - **Play it straight:** pick the register that best fits the topic and give it at least one *subject-derived* element — an accent color or a display face that suits the subject — so it reads as *this* topic, not a generic clean template.
>   - **Go bold:** commit to the boldest *cohesive* concept — a world, an angle, a visual metaphor with a point of view. **Reject the era-match skin:** old/historical → parchment/sepia/cream+serif is costume, not a concept (the "parchment for the Black Death" trap).
>   Either way, derive from the chosen direction: **typefaces that express it** (period-/domain-appropriate — never system/Inter by reflex), a **subject-derived semantic palette**, substrate/texture, and one recurring motif. *Litmus (both modes): a look you could swap onto a different topic unchanged isn't finished — bold that fails it is a skin; straight that fails it is generic.*
> - **Throughline:** the mental model, and how the centerpiece, demos, and color all reinforce it.
> - **Demos:** brainstorm **3+ candidate demo concepts** the topic affords, then build the **2 most vivid *and* mechanism-true** — reach for the one that makes someone say *whoa*, not the safe stepper. (A watch → an escapement that ticks beat by beat; a record → a groove whose wobble *is* the waveform. Ask what the equivalent is for *this* topic.)
> - On **“go bold,”** push each of these to the boldest **cohesive** option (study `reference/film-noir-theme.png`). Picking the first serviceable font/demo is how a page ends up bland; the model that skips this pass produces safe defaults.
> 

## Phase 1 — Architecture for learning (sequence before you style)

- **Lead with orientation, not the advanced/latest thing.** Default to a learning path: what is it
→ the core mental model → the specifics/payoff → details → the news/edge cases.
- **Find the mental model that illuminates and unlocks the topic — then commit to it (where the topic has one).** Hand the reader *one way of thinking* early (a metaphor, reframing, or unifying picture) and reuse it as a **throughline** — centerpiece, demos, and recurring motif all reinforce the *same* model. Test: a reader who finishes can restate it in a sentence.
    - **Don’t force it, don’t make it a worksheet.** Some topics (reference matrix, list of rules)
    have no honest single mental model; a forced analogy that breaks under scrutiny is worse than none at all. If a mental model only half-fits, drop it.
- **Lead with clarity, not cleverness — keep the model out of the headline.** The `<h1>` must
**plainly name the topic** (“How compound interest works”) — a metaphor may ride alongside but never *replace* it (the nav/brand label is not the title). Keep title and intro **editorial**, not
slogan-y; introduce the model **once, in its own section** — don’t stack 2–3 metaphors or turn it into a slogan/joke/precious copy. The model is a way of seeing things, but you don’t need to dress up the entire page in the model, so don’t repeat the metaphor after the intro or frame the visuals in cute metaphorical terms. After the intro, use normal, professional section treatments.
- **Optional (where relevant): open on the experience, then the turn, then name it.** When a section (or the page) has a counterintuitive core, open on the concrete experience the reader already has, deliver the surprising turn, *then* name the concept — not the reverse. “When an ambulance passes, the pitch of its siren seems to drop, even though the note never changes. That is the Doppler effect.” Leading with the felt example — not a definition, and not a fronted negation (“An ambulance does *not* change its note…”) — sets up the surprise so it pays, and naming the idea at the moment of recognition makes it stick. Use it for a hero and for individual sections; skip it for reference/matrix content with no such hook — don’t manufacture one.
- **No stacked headers; open on substance.** AI nests multiple layers of framing before any text:
eyebrow → heading → restating sub-head/lede → finally the point. Allow **one** heading layer
before body: the eyebrow (`§N · LABEL`) + the section heading is the only stack. Never add an`<h3>` that restates the heading, and in short sections drop the sub-head — the opening sentence carries it. And cut the **lede that says nothing** (“…landed in a market where denial is hard to enforce”). This is the “so what” test (see Phase 2 dataviz) applied to prose: if the text doesn’t add anything, cut it. Keep a lede only when it’s a real hook or a usage instruction for an interactive.
- **Progressive complexity:** map the **concept dependencies** first (what must the reader grasp
before X?) and order sections so each assumes only what earlier ones taught. Signpost the path (“Start here · 1 of 3”) but only when it helps. Dependencies guide section *order* only — **never print “depends on:” labels** on the page; that exposes the scaffolding.
- **Optional:** a “common misconception” callout — name a classic wrong belief and correct it; only where one truly exists, never forced.
- **Layered depth (3 layers):** (1) plain-language always visible, (2) “go deeper” expanders, (3) the raw source/data one click away.
- **One clear centerpiece** — the section that delivers the core payoff with a killer interactive demo (e.g., filterable toggle, table/matrix or one strong diagram). Build everything else around it.
- **Give experts a fast-path:** a sticky nav / table of contents.
- Sketch the section order before building; reorder freely - Information Architecture (IA) is the biggest quality lever.

## Phase 2 — Visual design system (the 10x bar) — *the source of truth for “what good looks like”*

- **The quality bar: professionally edited, purposeful, polished** — the opposite of auto-generated SaaS texture. **The final product should feel inevitable and seamless, like sashimono woodwork.** Every build — the play-it-straight registers and any go-bold topic-matched theme — must clear this bar. Judge a theme on three things — **relevant + cohesive + legible** — never on *how much* theme there is:
    - *Relevant*: the visual language expresses what the topic IS, not just its surroundings. Letterpress for Gutenberg = good, typography IS the subject. Parchment for the Black Death = bad, mere skin that explains nothing. Blueprint for aerospace = good, schematics are how engineers think about it.
    - *Cohesive*: one intentional world where every choice serves the subject — not a pile of unrelated motifs. **How far the theme goes is set by the Phase-0 play-it-straight / go-bold choice, not by a fixed “accent only” rule.** *Play it straight:* one or two thematic tokens (a display font, a signature color) in the hero and centerpiece; body, UI, and dataviz stay neutral. *Go bold:* commit fully — theme every surface into one coherent world. (The film-noir example themes body, headings, buttons, sliders, and quiz, and it works precisely because it is cohesive and stays perfectly readable.) A bold, fully-committed theme is a *win*, not an overreach, when it holds together.
    - *Legible*: the non-negotiable floor at every intensity — per-surface contrast holds, body text is easy to read, controls are obvious. This is the line that separates art direction from a mess; a bold theme that sacrifices legibility fails. The slop tells below are also banned at every intensity — they are *generic*, which is the opposite of both tasteful and fun. When a forced theme won’t cohere, the clean presets beat it — but don’t confuse “restrained” with “safe”: a committed theme that is relevant, cohesive, and legible is the higher bar.
    - *Benchmarks:* Aim for the  polished approach of The Atlantic, Vox, FT and Stripe Press. Confident typography (a real display + text pairing), a palette where color is mostly *semantic* (carries meaning, not decoration), generous whitespace, no emoji. The reference screenshots in `reference/` — **study the actual image** for the dimension noted (don’t work from the description alone). *Art direction:* `gutenberg-theme` · `film-noir-theme` · `vinyl-theme`. *Demos:* `microwave-demo` · `aiact-coverage` · `pipe-organ-demo` · `noise-cancelling-demo` · `fireflies-demo`.
        - `gutenberg-theme.png` — topic-matched theme + themed interactivity: period type (blackletter display + old-style serif) carries the subject, and the compositor’s-stick demo *is* the letterpress process (full detail below: *Themed interactivity is the gold standard*).
        - `film-noir-theme.png` — the **go-bold exemplar**: full art direction (every surface themed) that stays perfectly legible — one hard amber light on near-black. Dark & dramatic leaning.
        - `vinyl-theme.png` — go-bold in a *warm* register (bold isn’t only dark): Anton poster type + spinning-record hero; the warm counterpart to `film-noir-theme`.
        - `microwave-demo.png` — dark/technical style + “show don’t tell”: the standing-waves heat-map demo is the model for what a playable micro-demo should look and feel like.
        - `aiact-coverage.png` — light editorial style + functional interactivity: multi-slider → live verdict; restrained palette where every color is semantic.
        - `pipe-organ-demo.png` — a demo that makes **real sound**: a length slider drives f = c/2L and plays the note via Web Audio.
        - `noise-cancelling-demo.png` — a physical principle as a manipulable graph: two sliders sum the incoming and anti-noise waves to a flat, silent line; semantic legend.
        - `fireflies-demo.png` — visually striking generative canvas: a coupling slider drives ~80 fireflies from scattered to unison; the demo’s *look* is the teaching.
- **Themed interactivity is the gold standard.** When the topic has a teachable mechanism (a historical craft, a physical process, a step-by-step technique), ask: can the demo *be* that mechanism instead of just looking like it? In the Gutenberg example, letterpress motifs work because typography is the subject. In the compositor’s-stick demo (see `reference/gutenberg-theme.png`), letters appear backwards and mirrored because that’s how metal type actually works; “Pull the press” reveals the printed result. The demo teaches letterpress printing because the mechanic IS the process. Only do this when a topic has a mechanism worth simulating. Also, note the *period type* — a blackletter display + old-style serif body carry the theme; the letters themselves are the history. This is a win; medieval parchment alone is a fail. See *Interactivity Patterns* below for guidance on specific interactivity types.
- **ALWAYS AVOID the “AI slop” look. Don’t use these:**
    - **Emoji as icons/UI** (⏳🔒🚀✨🔍📊 in headers/cards/buttons) — the #1 slop signal. Use a
    *cohesive* SVG icon set (one style), CSS shapes, numerals, or nothing. Never emoji as iconography.
    - **Decorative gradients & rainbow color** — pastel hero washes, iridescent backgrounds,
    multi-colored titles, rainbow rows. Color must be intentional and mostly semantic.
    - **The default bento grid** — a 2×2/3×3 of identical soft-shadow cards as the answer to every section. Cards are *one* device; vary the treatment.
    - **Generic SaaS texture** — drop shadow on every box, faux-3D, “✨ AI-powered” flourishes, Inter-on-pure-white blandness. Restraint reads expensive; decoration reads auto-generated.
    - **Default palette** — cream + a lone rust-orange accent + dark band + green/red chips: the AI house style, reads templated. Derive ≥1 accent from the subject; color semantic, not decorative.
- **A consistent visual language should teach.** Small *semantic* system used everywhere: color = category/meaning (e.g. risk tier); a recurring motif = state (before→after highlight; a status
badge). Paper + ink + **one or two** accents that *mean* something.
- **Variety with rhythm:** each section gets a distinct treatment (cards, pyramid, flow, timeline,
matrix) but shares spacing, type scale, and the color system. Use alternate backgrounds to separate.
- **Typography & space:** strong hierarchy, ~60–70ch measure for prose, generous whitespace, a real type pairing (serif display + clean sans) over system-Inter-everywhere. Section eyebrows/kickers must read as signposts — weight 600–700, ~13–14px, not faint 11px labels.
- **Spacing on a scale, not by feel.** Spacing tokens (4/8px scale) used everywhere → consistent
rhythm: even section padding, hero elements separated, equal gaps in repeated groups.
- **Contrast is per-surface.** A color legible on the page background won’t be on a dark band,
colored chip, or inverted hero — give each surface its own ink (≥4.5:1 body); never a
near-background tint as text. Light **and** dark → define and verify both.
- **Use the horizontal space — proportioned, not a lonely column.** Let the *page* use the width
while *prose* stays ~60–70ch: give the **centerpiece** room (wide tables/timelines/diagrams), use **full-bleed section bands**, reach for **two-column/asymmetric** layouts where they help. Cap the outer container ~1100–1280px with balanced gutters — never a narrow column stranded in margins, or hugged to one side of a wide band with the other half empty (pair it with an aside/visual, or center it).
- **Motion with purpose:** scroll-reveal/transitions add life; never gratuitous. **Never hide content at `opacity:0` depending on `IntersectionObserver` firing** — it doesn’t fire reliably in Playwright full-page screenshots or on some mobile browsers, leaving pages blank. The safe pattern: make `.reveal` a no-op CSS marker only (content always visible by default); use CSS `@keyframes` entrance animations if you want motion on load. Failsafe timers are not reliable enough to fix this — don’t rely on them.
- **Square-tiled grids need explicit rows.** For any grid meant to have uniform/square cells (chessboard, calendar, heatmap, pixel/thumbnail wall), set **both** `grid-template-columns` **and** `grid-template-rows` (`repeat(N,1fr)`). `aspect-ratio:1` squares the *container*, never the inner tracks — implicit rows size to content, so the board looks square while its rows are unequal and any `%`-sized or `border-radius:50%` child distorts (circles become ellipses). Belt-and-suspenders: give anything that must stay round its own `aspect-ratio:1` so it defends its shape even if a cell is ever off.
- **Meaningful graphics — the “so what” test, then form follows data.** Every graphic must encode a *relationship*, not just store facts. If you can’t name its one takeaway in a sentence, it’s decoration — a 2×2 of disconnected stats is a list in costume; use prose. Match the form to the shape of the data (**non-exhaustive lexicon — extend it**): comparison / trade-off → two-up panels or before/after; **position on a spectrum → dot / strip plot on a shared axis** (each item a colored dot along one meaningful axis, e.g. settled→contested, so the *distribution* is the insight); sequence with real gaps → **true-scale timeline** (spacing ∝ elapsed time, not equal-spaced tabs); process / causal arc → flow with connectors; part-to-whole or magnitude → bar / meter, not a number in a box; “what applies to X” → filterable matrix; before↔︎after → two-tier or toggle. Run the **inverse check** too: dense comparative / numeric / sequential *prose* that should be a graphic.
- **Don’t over-engineer the dataviz.** A clean conventional chart/table beats an exotic
treemap/sunburst almost always. Reach for advanced viz only when the data needs it.
- Default to **shadcn/ui + Tailwind** in a framework build, or hand-rolled CSS in a single file.
Either way: design tokens / CSS variables, not scattered magic numbers.

## Phase 3 — Build

- **The deliverable is an actual file, not content pasted into the chat.** Write a single-file explainer to a real **`.html` file** (e.g. `eu-ai-act.html`) the user can open, download, and iterate on. Wherever you can create files (Claude Code, the desktop/web app’s file/artifact tools, Cowork, a repo), create the file and hand over its path/link. Only with genuinely no file-creation capability may you fall back to one fenced code block — and say so. (This is also what makes Phase 4’s render and the review overlay possible.)
- **Hybrid build path (use this by default in Claude Code).** Write a raw HTML file — your page’s
content, CSS, and bespoke JS only. Do **not** inline `review-mode.js` or `chat-dock.js`. Then run the assembler to inject them:
    
    ```
    node scripts/assemble.mjs <raw-file.html> [--chat] -o <output.html>
    ```
    
    Pass `--chat` when the user requested an AI chat dock. The assembler adds `data-review-toggle`, injects the overlay and (optionally) chat-dock, validates unique IDs, and flags escaping issues. This keeps the raw file ~600 lines instead of ~1200, cutting generation time roughly in half.
    
- Build the **centerpiece first**, then supporting sections, then polish.
- **Accessibility & responsive are not optional:** semantic HTML, keyboard-operable controls,
sufficient contrast, alt text, a real mobile layout (test it — Phase 4).
- **Fixed chrome must not overlap scrolling content** (the #1 mobile bug): scrim top bars/nav/FABs, pad slides clear of them + `env(safe-area-inset-*)`, use `100dvh` not `100vh`, collapse long kickers.
- Keep content in **structured data** (a JSON/JS array) separate from presentation wherever there’s repetition — it makes the loop and edits far easier.

## Phase 4 — The quality loop (required for high quality)

**Required. Never skip this, even on a weak model or with no browser.** 

**Step 0 — Static pre-flight (MANDATORY, runs even with no browser).** Re-read your output and fix every one of these — each is a blocker. Do not deliver until all pass:
- [ ] **No emoji as icons/UI** anywhere. Cohesive SVG/icon-font you *actually render*, CSS shapes,
numerals, or nothing. (Loading an icon font then using emoji is an automatic fail.)
- [ ] **A real type pairing** — display/serif + clean sans via web fonts, tokens at `:root`. Not the
bare system stack, not Inter-on-white only.
- [ ] **Horizontal space used** — composed and proportioned (wide centerpiece and/or full-bleed
bands); prose ~60–70ch but the *page* is not a ~720–800px column in empty margins.
- [ ] **No other slop tells** — no decorative/iridescent gradients, no rainbow text/rows, no 2×2
bento grid of identical soft-shadow cards, no drop-shadow-on-everything.
- [ ] **Palette isn’t the templated default** (cream + lone rust/orange accent); ≥1 accent subject-derived, color semantic.
- [ ] **Theme is relevant + cohesive + legible (judged on quality, not amount).** If the build is
“go bold,” a fully themed page (body, UI, sliders, quiz all reskinned) is a *pass* when it’s one
coherent world (every choice serves the subject), expresses the topic (not a costume bolted on), and
stays readable (per-surface contrast holds). If it’s “play it straight,” the theme should read as a
light accent instead. **Never fail a build for committing hard — only for incoherence, irrelevance, or
illegibility.** The floor that always holds: body text and controls are clearly readable on every surface.
- [ ] **The JS actually runs** — no syntax errors (watch unescaped quotes/apostrophes in JS
strings), no undefined refs; every interactive widget works, not just renders.
- [ ] **Interactivity floor — ≥2 genuinely playable micro-demos.** Manipulate → live result (slider
on a real model, step-through, sim, predict-then-reveal), separate from the quiz. Toggles,
accordions, reveal/expand cards, and gov-vs-critic static cards do NOT count. If the page has
fewer than two, it must say on-page why the topic can’t support them — otherwise this is a
blocker, not a pass. (The no-browser path is the usual culprit; build the demos anyway.)
- [ ] **Button hierarchy in interactive widgets** — primary actions (Next, Submit, Check, Next step)
are solid filled buttons with clear visual weight; secondary actions (Back, Reset, Skip) are
ghost/outline. Never give all buttons equal treatment — the primary must be unmissable.
- [ ] **Quiz states its verdict in words.** After answering, each question shows an explicit “✓ Correct” / “✗ Not quite” label *and* marks the right option — never color-only feedback (ambiguous + inaccessible). Actually click a right and a wrong answer to confirm both read clearly.
- [ ] **Canvas/WebGL demos auto-initialize on load.** Any `<canvas>` must render its first frame on
`DOMContentLoaded` or `window.onload` — never require a click/hover to show the first frame.
Check: does `getContext()` and the first draw call happen inside a load-time listener?
- [ ] **SVG viewBox has padding around all content.** SVGs clip to their viewBox by default — any
`<text>` whose ascender or descender falls outside the viewBox is silently cropped. Default:
add at least 16px padding on all sides beyond your content bounds, e.g.
`viewBox="-16 -16 [w+32] [h+32]"`. Also check that adjacent labels at the same y-level don’t
overlap — estimate each label’s width as `font-size × char-count × 0.6` and verify no two
share an x-range.
- [ ] **Visual variety & a learnable semantic language** — sections don’t all look identical (vary
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
- [ ] **Title & voice.** `<h1>` plainly names the topic (not a bare metaphor; nav brand doesn’t
count); title/intro editorial not slogan-y; the model appears once in the body, not stacked.
- [ ] **No stacked headers; open on substance.** At most one heading layer before body (eyebrow + heading); no `<h3>` that restates its heading; no sub-head in a short section the opening
sentence already covers. Every lede states a concrete claim unguessable from the heading, or
is cut so the section opens on the claim. (See Phase 1.)
- [ ] **No flat redundancy.** Each key concept has one home; elsewhere reference it, don’t
re-explain. *Throughline exception:* a recurring mental model restated at **new depth** is
progressive teaching, not repetition. Flag only same-idea-at-same-depth repeats and any
paragraph that survives deletion with no loss.
- [ ] **Prose voice & slop tells.** Does the writing hold the **Professional** voice (concrete-first,
plainly stated, no rhetorical posture, sentence rhythm varied — not every sentence the same length)? Scan for overuse of: em-dashes (one or two fine; three per
paragraph is a tell) · loaded metaphor nouns (“the spine”, “load-bearing”, “the throughline”,
“connective tissue”, “the scaffolding”) · “it’s not just X — it’s Y” contrast framing ·
staccato comparison sentences · filler openers (“at its core”, “put simply”, “in short”, “at
the end of the day”) · rhetorical questions as transitions (“So what does this mean for X?”) ·
meta-narration (“this is where it gets interesting”, “here’s the thing”) · tricolon
everything · every section header as a declarative sentence with a period. Then the slop
**shapes** a wordlist misses (need a fresh-eyes read): **dismiss-and-pivot** (“the real story
is Y”) · **antithesis-to-inflate** (“not X, it’s Y”; “not just X”) · **setup-then-turn**
(“…unprecedented. It was not.”) · **aphoristic one-liner** (“The structure is the point.”) ·
**phantom pointer** (lead-in naming something not in this view: “the thing in the right-hand note”, or a “left/right” ref that collapses on mobile) · **gating closer** (“only once you see…”) · **precious metaphor verbs/nouns** (“doubled as a
roadmap”, “the spine”). Standard: would a human editor at *The Atlantic* flag this?
- [ ] **Visuals match the words.** Every diagram/chart/demo/metaphor depicts the claim — direction,
order, magnitude, legend all agree with the caption (don’t draw an up-slope under “downhill”).
- [ ] **Accessible & responsive** — semantic HTML, keyboard-operable, alt text, real mobile layout
(stacks cleanly, no horizontal overflow, tap targets ≥40px).
- [ ] **Mobile chrome clears content** — scroll a dense slide to its bottom (not just the cover): no
overlap/cut-off behind fixed bars/nav/FABs; full-height uses `dvh`, not `vh`.
- [ ] **Scroll-reveal / mobile visibility** — no content hidden at `opacity:0` or via a class
depending on `IntersectionObserver`. If `.reveal` exists, it must be a no-op marker (content
visible by default). All sections must render fully on mobile without interaction.
- [ ] **Review & edit overlay inlined** — `review-mode.js` is in the page by default (with `<body       data-review-toggle>`) unless the user opted out; the “Review & edit” launcher should appear.
- [ ] **Feels inevitable and seamless (the sashimono test).** Step back and look at the whole page at once: do the parts fit like nail-free joinery — spacing, type, and color consistent, transitions clean, nothing arbitrary or bolted on? If a section reads as grafted-on, or the rhythm breaks between sections, it fails.

> **STOP — you must take a screenshot before declaring done.** In Claude Code: `node scripts/shoot.mjs file://<absolute-path-to-assembled.html> <outDir>` then Read every image. Specifically look for: blank sections, empty canvas elements, **SVG text cut off at diagram edges** (viewBox clipping), **overlapping SVG labels** (two labels at the same y-level whose x-ranges collide), clipped text in general, **template-truncated content** (a card/label rendering only the first item of a list plus a dangling “…” — show a complete short value, never a fake-clipped one), zero-height containers, **distorted shapes on tiled grids** (on any board/calendar/heatmap, cells must be square and dots/circles round — a stretched row or an elliptical “circle” means the grid is missing explicit `grid-template-rows`; check *every* interactive state, since the distorting content may only appear in one). If any are found, fix and re-screenshot. Do NOT hand over the file until you have seen the screenshots and found no major visual bugs. Skipping this is the #1 reason builds ship broken.
> 

Then run the look-and-fix loop:
1. **Render it for real and look.** Headless-browser screenshot — desktop *and* mobile — including
**every interactive state** (expanded, filtered, drawers/modals open, nav scrolled). Helper:
`node scripts/shoot.mjs <url> <outDir>` (Playwright) — auto-detects decks and shoots an interior slide scrolled to its bottom (a cover-only mobile shot hides chrome-overlap bugs). Then **Read the screenshots** and judge.
**Check for a browser first:** `which chromium google-chrome chromium-browser 2>/dev/null | head -1` (≈1s). If none, **don’t install Playwright** — sandboxed/Cowork envs can’t run one and the download wastes 6–10 min; one failure = bail, never retry. Only `npx playwright install chromium` when the check confirms a real machine (e.g. Claude Code). **No browser?** Run Step 0 rigorously (compute contrast from your tokens), then tell the user the visual pass didn’t run and to confirm demos render.
2. **Critique like a human seeing it cold:** What’s confusing, redundant, illogical, barren, cramped, misaligned, low-contrast? Is the *order* right? Would a newcomer follow it? Does the mental model land and hold?
3. **10x the weak spots** — then re-screenshot
4. When you revise, you need to run this loop again (e.g., check for slop).
5. **Repeat this loop until you can look at the whole html page and it passes with fresh eyes.  Then ship.**

**The QA gate — fresh-eyes passes, not a self-skim.** Run the Step-0 pre-flight as **discrete passes** (Slop · Structure · Redundancy · Graphics), ideally with fresh eyes — a sub-agent that didn’t write the draft, since the pass that wrote the prose is the worst judge of its own slop. Rank findings **blocker / should-fix / optional** and fail only on blockers. **Re-run the Slop pass on any section you edit** — slop most often re-enters during revisions.
- **Slop lint (mechanical, on the *final/edited* file — a self-skim misses these):** flags the negation-flip (“not X. It’s Y”) and back-to-back em-dashes; read each hit (appositive dashes pass), then a fresh-eyes read for the shapes. **Done = all passes clear**, not “it builds and looks fine.”
  `grep -oE '>[^<]{12,}<' f.html | grep -nEi '\b(not|never|n.t)\b[^.]*\. (it|that|this|they) (is|was|did|are)|—[^—]{1,40}—'`

## Phase 5 — Verify & ship

- **Fact-check pass:** spot-check claims against sources; every citation resolves to the right place.
- **Trust surface:** source links/attribution, a short disclaimer where relevant; distinguish
settled facts from uncertain/forecasted in the UI.
- **Deliver the file first — deployment is opt-in.** For the default single-file build the deliverable
is the **`.html` file**; most people want exactly that. Don’t deploy by default or push a host. Hand over the file (plus the *Review & edit* link if you included the overlay — see *Drop-in widgets*).
- **Hand off for revision** — if you included the review overlay, deliver **two labelled links**: a
*View (read-only)* link and a *Review & edit* link (URL + `?edit`); for a local file ship `<body data-review-toggle>`. The edit link is safe to share (all client-side). See *Drop-in widgets*.

## Phase 6 — Revise (the first delivery is a draft, not the end)

- **Expect a round of changes** — usually aesthetic (“nice, but I don’t love the look”). Treat v1 as
a draft to react to, and make revision cheap by design.
- **Restyle = token swap, not rewrite.** Because color/type/spacing live in centralized tokens
(Phase 2), changing the whole vibe is editing a handful of variables. If a restyle means hunting through markup, the tokens weren’t centralized — fix that first.
- **Other common revisions:** re-scope (add/cut a section), add/remove interactivity, change output target, refresh a fact. Re-run the relevant earlier phase rather than patching blindly.
- **Non-technical reviewers can feed this loop directly** via the review overlay (*Drop-in widgets*): they edit in-place or leave notes; you apply the revision brief to the *source* and re-run Phase 4.
- **Re-run the quality loop after any visual change** — a token swap can break contrast, rhythm, or a chart’s legibility. Re-screenshot and *look*; don’t declare a restyle done from the diff.

---

## Output target

- **Single self-contained `.html`** (inline CSS, vanilla JS): default for static or lightly-interactive
explainers. Maximally portable, opens offline, trivial to share. Prefer unless you need a server.
Deliver as a real file (Phase 3), never an inline code block.

## Format & reading shape (chosen in Phase 0 — orthogonal to output target)

Same content and demos/quiz inside either; an *IA* choice, decided before sequencing.
**Match the shape to the material — neither format is the default.**

- **Slide deck / horizontal click-through** when the material is a **linear narrative with discrete
beats**: a story with an arc, an ordered step-by-step process or sequence, a walkthrough, or a
chronology — anything where *one idea per beat* and a controlled reveal let each stage sink in before
the next. Decks give pacing and big visual moments a scroll can't (a crisis day by day; a life
cycle stage by stage; a technique in ordered steps). Roughly half of good explainers are
deck-shaped, so **don't reflexively recommend scrolling** — when the topic has a clear
beginning→middle→end or an ordered sequence, recommend the deck. Build it properly:
    - **One concept per slide**, single-viewport; if it overflows, scroll *within* the slide.
    - **Quiz in a deck: one question at a time, never stacked.** Multiple questions on one slide
    overflow the viewport and the deck’s keyboard handler swallows scroll — the user can’t reach question 2+. Fix: paginate the quiz *within* the slide using its own Prev/Next buttons (not the deck’s). Show one question at a time; only the deck advances when the quiz is complete.
    - **All advance controls:** on-screen prev/next **and** keyboard (`←`/`→`, `PageUp`/`PageDown`,
    `Space`) **and** touch-swipe. Never trap the keyboard.
    - **Always-visible progress:** slide counter (“4 / 11”) and/or dots.
    - **Deep-linkable & restorable:** sync the slide to the URL hash (`#3`); read it on load.
    - **Mechanics:** horizontal flex track with `translateX(-N*100vw)` (or x-axis scroll-snap). Respect
    `prefers-reduced-motion`. Move focus to the new slide’s heading on advance.
    - **Accessibility:** each slide a labelled `section`/`region`; real buttons; arrow keys don’t break form fields inside a micro-demo.
    - **Trade-off to state:** worse for skim/reference — offer a “jump to slide” menu.
- **Scrolling page** when the material is **reference, dense, scannable, or layered depth-on-demand**:
the reader skims, jumps around, deep-links, and drills in at their own pace (a policy with tiers and
a calculator; a concept with many facets; a how-things-work with sidebars). One long vertical
document, scroll-reveal, sticky nav, depth-on-demand.
- **Hybrid:** chaptered scroll with `scroll-snap` between chapters — mostly reference, a few narrative stretches.

Keep the chosen shape in **one place** (a layout wrapper + a couple of flags) so switching scroll ⇄
deck later is contained, not a rewrite.

## Drop-in widgets (`scripts/` — paste inline before `</body>`; full usage in each file’s header)

Both are self-contained JS+CSS (single-file pages can’t use `<script src>` and stay portable), inject
their own themed UI, and adapt to light/dark. When inlining, escape any literal `</`+`script>` in the
file (the bundled copies already do). **These are the single source of truth for chat & review.**

- **`review-mode.js` — Review & edit overlay.** Front end of the Phase 6 revise loop. **Inline it by
DEFAULT in every single-file explainer** (before `</body>` + `<body data-review-toggle>`); only
omit if the user opts out. Reviewers get Preview / Edit text / Add note; **Download edits** exports a copy with
notes appended as an HTML comment; **Copy notes for LLM** yields a revision brief. Activate via
`?edit` or `<body data-review-toggle>`. Limits: per-browser, no server; `contenteditable` doesn’t
reach JS-rendered data (use the note path).
- **`chat-dock.js` — “Ask the page” BYOK chat.** The single-file way to do the Phase 0 AI-chat axis
with no backend: grounded in the page, using the *reader’s own* key. Optionally set
`window.CHAT_DOCK={provider,title,placeholder,suggestions}` first (`provider`: `anthropic` default |
`openai`); `[data-chat-open]` opens it. Key stays in memory only — fine *because it’s the reader’s*;
**never ship your own key this way** (that’s the server-route framework path).

## Interactivity Patterns

- **★ Playable micro-demos (learn-by-doing) — reach for these first.** A small widget that lets the reader *manipulate something and watch the result update live*. **Required floor: at least 2
distinct playable micro-demos** (separate from the quiz), enforced in the Phase-4 gate. “Playable” means manipulate → live result: a slider/input driving a real model, a step-through, a sim, a predict-then-reveal. **Toggles, accordions, reveal cards, click-to-expand, and the quiz do NOT count** — they’re lighter disclosure, useful but not demos. Ship fewer than two
only when the topic genuinely can’t support them, and **say so on the page** (the no-browser path under-builds demos — hit the floor anyway). Forms: **fill-in / pick-the-answer** (“what comes next?”, ideally predict-then-reveal); **live input → live output**; **a slider that reshapes a result** (driven by the *real* formula — continuous min/max range, small or absent `step`, update on every`input` not `change`); **click-to-explore**; **step-through**. Keep each tiny and about ONE idea; prefill sensible defaults; label illustrative data as such; keyboard-operable and works on mobile.
- **Progressive disclosure:** `<details>`/accordion, “go deeper” expanders, tabs.
- **Filterable table/matrix:** the workhorse centerpiece for “what applies to / what is X”.
- **Timeline:** for sequence/schedule; before-vs-after overlays and a “today” marker when relevant. Prefer **true-scale** spacing (position ∝ elapsed time) when the gaps themselves tell a story. **Detail goes in one shared panel below the rail, not a floating tooltip** (tooltips collide with neighbors, hide behind the dot’s number, and clip at track edges). When true-scale clustering crowds nodes, dodge them vertically with connector stems and keep date labels on a separate baseline.
- **Dot / strip plot on a shared axis:** plot each item as a colored dot along one meaningful axis
(e.g. settled→contested, cheap→expensive); the *distribution* and the outliers are the insight.
Color = category; click or hover a row to update a shared detail panel. Strong, compact centerpiece for “where does each piece fall.”
- **Click-through citations:** a shared slide-in drawer/modal showing source text + a deep link.
- **Interactive diagram:** pyramid/flow/grid where clicking a node reveals detail.
- **Quiz / knowledge check:** short test-yourself (MC or fill-in) with **instant** right/wrong
feedback + a one-line *why* (the explanation is the point). Place it *after* the teaching it checks.
Keep questions in **structured data** (`{q, options, answer, why}`); friendly tally; allow retry.
**The verdict must be stated in words, not color alone.** On answer, show an explicit **“✓ Correct” / “✗ Not quite”** label *and* mark the right option (e.g. a ✓) so the user knows they were right even when they picked the correct answer. Color-only feedback (green vs. red borders) is the recurring failure — it’s ambiguous (“did I get it right?”) and inaccessible to color-blind users. Green = correct, red = wrong, and always back the color with a mark + a word.
**Button hierarchy is mandatory:** the primary action (Next, Submit, Check) must be a solid filled button with clear visual weight — not a tiny outline pill. Secondary actions (Back, Reset, Skip) get ghost/outline treatment. A “Next →” that blends into the background is the #1 quiz UX failure.
- **Chat / “ask the page”:** use `chat-dock.js` (single-file BYOK) or a server route (managed key) — see *Drop-in widgets*.

## Anti-patterns & definition of done

**Sins to avoid:** visual or textual slop · facts from memory instead of research (when the topic needs it) · leading with jargon or advanced/“latest” material (loses newcomers) · forcing a mental model where the topic has none · introducing a framing then abandoning it ·
declaring it done without ever rendering and *looking* · a key in client code / leaked provider key
(keep keys server-side or BYOK-in-memory) · a deck that traps the keyboard or can’t be deep-linked · a quiz placed before its teaching or one that scores without a *why*.

**Definition of done:** every **Phase-4 Step-0 pre-flight** box passes · researched & fact-checked ·
sources cited · sequenced for a newcomer with an expert fast-path · the file is delivered (and
reachable/shareable if a URL was wanted). Format-specific: a **deck** has working keyboard + swipe + deep-link + progress; a **quiz** gives instant feedback with a *why* and allows retry.