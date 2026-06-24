# HTML Explainer

A [Claude](https://claude.ai) **Skill** for building polished, lightly-interactive
single-page web explainers — the kind of editorial, source-grounded, genuinely useful page
someone can land on cold and come away understanding a topic.

It's a **process, not a template**: the quality comes from an iterative loop (research →
architect for learning → 10× the visual design → render-and-actually-look → revise), not
from filling in blanks.

➡️ **See it in action: [live examples gallery](https://ds-vibe.github.io/html-explainer/)**
&nbsp;·&nbsp; source in [`examples/`](./examples)

## What it does

Given a topic (or your own source material), the skill:

- **Scopes first** — a short, must-ask interview: grounding, audience/depth, format
  (scrolling page vs slide deck), visual style, quiz, AI chat.
- **Gets the facts right** — grounds in your material and/or primary sources; cites them.
- **Architects for learning** — leads with one mental model, layers depth, builds around a
  single clear centerpiece.
- **Hits a 10× visual bar** — editorial typography, a semantic palette, real use of the
  horizontal space, and an explicit anti-"AI-slop" checklist (no emoji-as-icons, no
  decorative gradients, no generic bento grids).
- **Shows, doesn't tell** — favors small *playable micro-demos* over paragraphs.
- **Runs a real quality loop** — renders the page in a headless browser, screenshots it
  (desktop + mobile + interactive states), critiques it like a human, and fixes what's weak.
- **Ships a real `.html` file** with an optional in-page **Review & edit** overlay so
  non-technical reviewers can annotate or edit in place (and download a copy with both the
  edits and the notes embedded).

## Examples

Built with this skill, hosted on GitHub Pages — each is a self-contained `.html` file:

| Explainer | Format | Live |
|---|---|---|
| How a microwave heats food | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/microwave.html) |
| How transistors work | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/transistors.html) |
| How GPS finds you | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/gps.html) |
| How blockchain works | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/blockchain.html) |
| How RAG works | slide deck | [open](https://ds-vibe.github.io/html-explainer/examples/rag.html) |
| How encryption works | scrolling page + BYOK chatbot | [open](https://ds-vibe.github.io/html-explainer/examples/encryption.html) |
| The EU AI Act | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/ai-act.html) |
| The CCPA | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/ccpa.html) |

Source lives in [`examples/`](./examples).

## Layout

```
SKILL.md                     the process (this is the skill)
scripts/shoot.mjs            Playwright screenshot helper for the quality loop
scripts/review-mode.js       drop-in "Review & edit" overlay (paste before </body>)
scripts/chat-dock.js         drop-in BYOK "ask the page" chat widget
reference/                   visual reference image for the design bar
examples/                    explainers built with the skill (served via GitHub Pages)
index.html                   the examples gallery landing page
```

## Use the skill

**Claude Code** — clone into your skills directory:

```bash
git clone https://github.com/ds-vibe/html-explainer ~/.claude/skills/html-explainer
```

It loads automatically when a request matches (e.g. "make an interactive explainer about X").

> **Heads up — the first build takes a few minutes.** For the quality loop, Claude Code renders
> the page in a headless browser, so on the *first* run it installs Playwright + Chromium (a
> one-time ~100–200 MB download). It's fully automatic — nothing to set up — but that first run is
> slow while it downloads; every run after is fast. (The Claude **app** skips all of this — it has
> no render step.)

**Claude desktop / web app** — download the prebuilt
[`html-explainer-skill.zip`](https://github.com/ds-vibe/html-explainer/releases/latest) and upload
it under **Settings → Capabilities → Skills**, then start a fresh chat. (Or zip the skill files —
`SKILL.md`, `scripts/`, `reference/` — yourself.)

**Manual rendering** (optional — the quality loop already does this for you):

```bash
node scripts/shoot.mjs "file:///path/to/page.html" /tmp/shots
# first time only, if you haven't run a build yet: npx playwright install chromium
```

## License

[MIT](./LICENSE) © 2026 Derek Schwede
