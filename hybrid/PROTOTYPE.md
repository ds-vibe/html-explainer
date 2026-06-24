# Hybrid prototype — assembler, not a renderer

**Branch:** `hybrid-prototype` (the working skill stays on `main`, v1.0.0, untouched).

## The goal
Cut generation latency and eliminate the recurring *structural* bug classes
(duplicate IDs, edge-bleed, missing/colliding review pill) **without losing any
of the dynamic formatting or bespoke interactivity** that makes these explainers good.

## The non-goal (this is the important part)
We are **NOT** building a JSON→HTML component grammar that *renders* the page.
A fixed component vocabulary (conceptCard, interactiveSlider, diagram…) handles the
generic 80% but homogenizes output and **cannot express the signature demos** — the
microwave's spinning-plate canvas, the transistor MOSFET cross-section, GPS
trilateration, the fair-use factor balancer. Those are the magic, and they don't
reduce to components. "Script owns component rendering" is exactly the move that
loses dynamic formatting and interactive elements, so we don't make it.

## The architecture: LLM authors everything creative; a script injects invariants + validates
- **LLM owns (unchanged):** the design system / tokens, layout, prose, structured
  data, and **every bespoke demo and interaction** — authored as raw HTML/CSS/JS,
  full creative freedom. It also still runs the Playwright QA loop.
- **Script owns ONLY the invariants:** things that are byte-identical on every build
  and add nothing but latency when hand-typed —
  - inline `review-mode.js` (~378 lines) and, if chat is on, `chat-dock.js`
  - ensure `<body data-review-toggle>`
  - deck-aware: offset the review launcher so it can't collide with a deck's own
    top-right controls (the bug we hand-fixed on fair use)
- **Script validates (deterministic):** no duplicate IDs, overlay present, injected
  `</script>` escaped. Containment + visual correctness stay in the render QA loop
  (can't be checked from static text).

## Why this is the right slice
`review-mode.js` + `chat-dock.js` are ~600 lines the model currently re-emits verbatim
every single build — pure wasted tokens/latency, and the source of the
missing/colliding-pill bugs. Injecting them is free speed with zero quality cost and
**no constraint on the creative surface**.

## Environment constraint
This is a **Claude-Code-side** step — it needs a runtime (Bash/Node). The **Claude app
has no build step**, so the app keeps the pure-LLM path (pasting the inlined overlay as
it does today). The assembler is an optimization for the Code path, not a replacement
for the skill.

## Status
- [x] `assemble.mjs` — inject overlay/chat + deck-aware launcher offset + validate
- [ ] measure latency delta vs. pure-LLM on a few topics
- [ ] (only if it pays off, and only for chrome that can't constrain creativity)
      optional templating of standard quiz/sources scaffolding
