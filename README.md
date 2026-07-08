# HTML Explainer

A [Claude](https://claude.ai) **Skill** for building polished, interactive HTML explainers as a single page OR a slide deck. Give it a topic, answer a few questions, and it produces a real page that someone can land on cold and come away understanding the basics.

It's a **process, not a template**: the quality comes from an iterative loop (research →
architect for learning → 10× the visual design → render-and-actually-look → revise), not
from filling in blanks.

**See it in action: [live examples gallery](https://ds-vibe.github.io/html-explainer/)**

> **Best results: run it in Claude Code with Opus 4.8 at high effort (or better).** It's both faster and higher quality, since stronger first drafts mean fewer quality-loop fix cycles. Claude Code renders in a real headless browser, so it catches visual bugs the Claude App or Cowork cannot.

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
| How the northern lights happen | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/auroras.html) |
| The machine that multiplied ideas (Gutenberg's press) | slide deck | [open](https://ds-vibe.github.io/html-explainer/examples/gutenberg.html) |
| The Doppler effect (why a siren changes pitch) | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/doppler.html) |
| The grammar of shadow (reading film noir) | slide deck | [open](https://ds-vibe.github.io/html-explainer/examples/film-noir.html) |
| The EU AI Act | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/ai-act.html) |
| What "fair use" actually means | slide deck | [open](https://ds-vibe.github.io/html-explainer/examples/fair-use.html) |
| How fractional reserve banking works | scrolling page | [open](https://ds-vibe.github.io/html-explainer/examples/fractional-reserve.html) |

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

> **Heads up — a build takes 4–10 minutes.** It's doing real work: research, a scoping
> interview, generation, and a visual quality loop. **Claude Code** renders the page in a headless
> browser (desktop + mobile screenshots) and iterates until it passes — this is where the quality
> comes from. The first run installs Playwright + Chromium (~100–200 MB, fully automatic). The
> **Claude app / cowork** has no headless browser, so it runs a rigorous static pre-flight instead
> and skips the install. *(Best results: Opus 4.8 at high effort in Claude Code.)*

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
