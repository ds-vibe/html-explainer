# Audio guide (deferred — not part of v1)

> **Status:** Pulled out of the main `SKILL.md` to keep v1 focused. Audio (narration /
> sound effects / music) is a real pipeline that needs its own refinement before it should
> be offered by default. This file preserves the full guidance so it can be folded back in
> later. **To re-integrate:** restore the Phase 0 scoping question, the "Audio" section, the
> two anti-patterns, and the definition-of-done clause below into `SKILL.md` at the marked
> locations.

---

## Phase 0 scoping question (was a bullet under "Ask 4–6 sharp scoping questions")

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

> Also: the Phase 0 "Output target" bullet originally noted the target is "often *determined*
> by the chat/audio answers (server-side chat or runtime audio → framework)." With audio
> deferred, that line now reads "chat answers (server-side chat → framework)."

---

## The "Audio" section (was its own `##` section between Format and Interactivity)

### Audio: narration, sound & music (optional — chosen in Phase 0)

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

---

## Anti-patterns (were bullets in the Anti-patterns section)

- Putting an ElevenLabs/OpenAI (or any provider) **key in client code** → leaked key.
  Pre-generate audio at build time, or proxy through a server route.
  *(Note: the key-in-client-code risk also applies to the chat/BYOK pattern, which stays in
  v1. When re-integrating, make sure the surviving anti-pattern bullet still covers chat
  provider keys generally — see SKILL.md.)*
- **Autoplaying** narration/music, or shipping audio with no mute → hostile; also blocked
  by browsers without a user gesture.

---

## Definition of done (was a clause in the format-specific line)

> if **audio**, it plays only on a gesture, has a mute, and the page is complete in silence;

---

## Appendix — concrete ElevenLabs pre-generation recipe

This is the worked example for the **default** (fixed-content, build-time) path. The key
lives only in a local build script via an env var and is **never** shipped to the browser;
the page only ever fetches static `.mp3` files.

```
Your machine                          Shipped to browser
┌─────────────────────────┐          ┌──────────────────────┐
│ build-audio.mjs         │          │ explainer.html       │
│   reads ELEVENLABS_API_KEY ──┐      │ audio/slide-01.mp3   │  ← just files
│   calls ElevenLabs       │   │      │ audio/slide-02.mp3   │
│   writes mp3s + manifest │   │      │ audio/manifest.json  │
└─────────────────────────┘   │      └──────────────────────┘
        key stays here ───────┘              no key here, ever
```

**Where the key goes** — an environment variable on your machine (or CI), read by the build
script. Never in committed files or client JS:

```bash
export ELEVENLABS_API_KEY="sk_xxxxxxxxxxxxxxxxxxxx"   # or a .gitignored .env
```

**How you "prompt" ElevenLabs** — TTS isn't prompt-y like an LLM. You send the exact text to
speak plus a few knobs: `voice_id` (which voice), `model_id` (quality vs speed), and
`voice_settings` (`stability`, `similarity_boost`, `style`). Write narration *for the ear* —
spoken-style sentences, separate from the on-screen text. Newer expressive models also accept
inline tags like `[excited]` / `[whispers]` in the text. Model IDs move fast — check the docs
for the current best one.

**Build script** (`node build-audio.mjs`):

```js
import { writeFileSync, mkdirSync } from "node:fs";
const VOICE_ID = "your_voice_id";
const narration = [
  { id: 1, text: "How RAG actually works. Why we give language models an open book…" },
  { id: 2, text: "A language model answers from memory. That breaks in three ways…" },
  // …one entry per slide/section
];
mkdirSync("audio", { recursive: true });
const manifest = {};
for (const s of narration) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,   // ← key used here only
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: s.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.4, similarity_boost: 0.75, style: 0.2 },
      }),
    }
  );
  if (!res.ok) throw new Error(`slide ${s.id}: ${res.status} ${await res.text()}`);
  const file = `audio/slide-${String(s.id).padStart(2, "0")}.mp3`;
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  manifest[s.id] = file;
}
writeFileSync("audio/manifest.json", JSON.stringify(manifest, null, 2));
```

**Page-side playback** — a mute/play control plus per-section loading; no autoplay:

```js
const player = new Audio();
let muted = true;                                  // starts silent
function playSectionAudio(id) {
  if (muted || !manifest[id]) return;
  player.src = manifest[id];
  player.play().catch(() => {});                   // ignore until a user gesture exists
}
```

Re-run the build script only when copy changes. The page must remain fully understandable
muted — the on-screen text *is* the transcript.
