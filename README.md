# html-explainer

A [Claude](https://claude.ai) **Skill** for building polished, lightly-interactive
single-page web explainers — the kind of editorial, source-grounded, genuinely useful
page someone can land on cold and come away understanding a topic.

It's a **process, not a template**: the quality comes from an iterative loop (research →
architect for learning → 10x the visual design → render-and-actually-look → revise), not
from filling in blanks.

## What it does

Given a topic (or your own source material), the skill:

- **Scopes first** — a short, must-ask interview: grounding, audience/depth, format
  (scrolling page vs slide deck), visual style, quiz, AI chat.
- **Gets the facts right** — grounds in your material and/or primary sources; cites them.
- **Architects for learning** — leads with one mental model, layers depth, builds around a
  single clear centerpiece.
- **Hits a 10x visual bar** — editorial typography, a semantic palette, real use of the
  horizontal space, and an explicit anti-"AI-slop" checklist (no emoji-as-icons, no
  decorative gradients, no generic bento grids).
- **Shows, doesn't tell** — favors small *playable micro-demos* over paragraphs.
- **Runs a real quality loop** — renders the page in a headless browser, screenshots it
  (desktop + mobile + interactive states), critiques it like a human, and fixes what's weak.
- **Ships a real `.html` file** with an optional in-page **Review & edit** overlay so
  non-technical reviewers can annotate or edit in place.

## Layout

```
SKILL.md                     the process (this is the skill)
scripts/shoot.mjs            Playwright screenshot helper for the quality loop
scripts/review-mode.js       drop-in "Review & edit" overlay (paste before </body>)
reference/                   visual reference image for the design bar
audio-guide.md               deferred audio feature, parked for later
```

## Use it

**Claude Code** — clone into your skills directory:

```bash
git clone https://github.com/ds-vibe/html-explainer-skill ~/.claude/skills/html-explainer
```

It loads automatically when a request matches (e.g. "make an interactive explainer about X").

**Claude desktop / web app** — zip the folder and upload it under
**Settings → Capabilities → Skills**, then start a fresh chat.

**Screenshot helper** (optional, for the quality loop):

```bash
cd ~/.claude/skills/html-explainer && npm install && npx playwright install chromium
node scripts/shoot.mjs "file:///path/to/page.html" /tmp/shots
```

## License

[MIT](./LICENSE) © 2026 Derek Schwede
