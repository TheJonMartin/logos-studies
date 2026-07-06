# Logos Studies — Format Specification (v1)
### The blueprint for every study. When Jon says "study [passage]," this is the standard.

---

## 0 · Purpose & audience

Each study serves **AuDHD-aware discipleship and personal formation** for a conservative, evangelical reader who is training for pastoral ministry. The tone is warm, pastoral, and honest — never gimmicky, never dumbed-down. Depth and correctness come first; accessibility is achieved through *structure*, not by thinning the content.

**Default translations:** NASB 1995 (primary) and ESV. Print both. If another translation is requested, add it; never silently substitute.

---

## 1 · Non-negotiables (correctness guardrails)

These override everything else. When in tension with polish or flow, these win.

1. **Correctness first.** Every Greek/Hebrew form, gloss, parsing, and cross-reference must be accurate. Verify anything uncertain before writing it.
2. **No inferences or assumptions presented as fact.** If a reading is interpretive, say so.
3. **Flag genuine scholarly debates — do not resolve them.** Where the text is legitimately contested (e.g., middle vs. passive, objective vs. subjective genitive, semantic range), present the options honestly and name that standard translations render it a particular way. Use the amber "caution" callout.
4. **Never fabricate quotations.** Commentators may be *named for positions they actually hold* on contested points (Cranfield, Moo, Schreiner, etc.), but do not invent verbatim quotes.
5. **The neuroplasticity bridge stays modest.** Always state the biblical author did not know modern neuroscience; never overclaim; always tie the point to a biblical text and to the Spirit's work, not self-help.
6. **Verify Scripture wording** against the actual translation before printing it.

---

## 2 · The locked arc (structure)

Every study moves once through the whole passage in this order. It does **not** repeat panels verse-by-verse. Sections may be lightly renamed to fit genre (see §4), but the sequence and intent hold.

**0 · The Anchor** — one sentence capturing the whole passage in plain, warm language. Rendered pinned/sticky so it stays on screen. This is the working-memory handle; write it last, after the exegesis is done, so it is earned.

**1 · The Text** — NASB 1995 and ESV, printed in full, verse numbers marked.

**2 · Where This Sits** — brief context: where the passage falls in the book's argument/story, and any hinge word ("therefore," etc.). 2–4 short paragraphs. End with a one-line summary callout.

**3 · The Movement of Thought** — the logical/narrative flow, broken into labeled "beats." Fuller exegesis lives here. End with a one-line summary callout tracing the arc (e.g., "mercy → offering → transformation → discernment").

**4 · Words That Carry Weight** — ~4–6 load-bearing original-language words, each as a word-card with: term + transliteration, grammatical parsing (tense/voice/mood/case as relevant), and 2–4 sentences of meaning tied to at least one cross-reference. Include amber caution callouts for any genuinely contested word. Close with a one-line summary.

**5 · The Neuroplasticity Bridge** — connect the passage to how minds/identities actually change (attention, repetition, self-narrative), under the §1.5 guardrails. Tie to a specific biblical text on renewal/formation. One-line summary.

**6 · AuDHD Reframe** — 3–5 specific, honest points where the passage meets a neurodivergent mind. Draw from these recurring lenses as the text warrants: willpower/executive-function relief, identity-vs-performance, masking vs. inward transformation, embodiment/concreteness, iterative discernment, repetition-as-mechanism, the personal/singular against feeling like "the exception," sensory/pacing. Never force all of them; pick what the text actually supports.

**7 · Formation** — concrete application framed as **"pick one, not all."** 3 options, each a small, doable, embodied action. Reducing choice load is the point.

**8 · Response / Prayer** — a short first-person prayer in the voice of the passage, honest about AuDHD struggle where fitting.

**9 · One Thing to Carry Today** — a single sentence takeaway, rendered as the closing highlighted block. Bookends the Anchor.

---

## 3 · Depth calibration

- **Greek/Hebrew:** always include original-language word study with parsing. Five words is the target; range 4–6. Transliterate everything.
- **Cross-references:** required, woven into word studies and the bridge — not a bare list. Collect them in the Sources line too.
- **Commentators:** cite by name only on contested/interpretive points, only positions they actually hold. Standard Romans/Galatians references: Cranfield, Moo, Schreiner, Longenecker, Bruce, Hays (for pistis Christou).
- **Length:** deep but not exhausting. The one-line callouts carry the gist for a reader who needs to skim; the prose rewards the reader who goes deep. Both must be served.

---

## 4 · Genre adaptations

The arc holds; the emphasis flexes.

- **Epistle (default):** as written above. "Movement of Thought" = logical argument.
- **OT narrative:** §3 becomes scene/plot movement; §2 emphasizes placement in the larger story; watch for narrator's point of view. Hebrew words in §4.
- **Psalm / poetry:** §3 traces poetic structure (parallelism, strophes, turns); note imagery and emotional movement; Hebrew word studies; be careful not to flatten metaphor into proposition.
- **Gospel:** §2 notes placement in the Gospel's flow and synoptic parallels where relevant; §3 traces the pericope's movement.
- **Wisdom / Prophecy:** §2 handles historical setting and genre conventions; flag figurative vs. literal honestly.

In every genre, §1 guardrails apply without exception.

---

## 5 · Output format (how it reaches the app)

Studies live in `bible-study-app.html` as objects appended to the `STUDIES` array. Adding a study = appending one object; Jon never edits code.

**Before adding a study, check existing work first.** Scan the `STUDIES` array for verse-adjacency (same book, nearby chapter/verse) or topical overlap with the new passage. If there's meaningful overlap, ask Jon whether the new passage should be merged into the existing study or added as its own standalone entry — don't decide unilaterally either way. (Adopted after Romans 6:5 and 6:6 were built as separate studies without this check.)

**Expand to the full paragraph by default.** When Jon pastes a single verse (or short verse range), don't study just that verse — expand to the full paragraph that contains it, per the actual NASB 1995 / ESV paragraph/section breaks (verify the boundary from the printed text; don't guess). The `reference`, `title`, and Scripture text reflect the full expanded range. Run the verse-adjacency/overlap check above against the *expanded* range, since a wider range is more likely to already overlap existing studies. If the resulting paragraph is unusually long (roughly 10+ verses) or the boundary is genuinely ambiguous between translations, confirm the exact range with Jon before building rather than assuming. (Made default 2026-07-02 after a successful test expanding Colossians 3:3 to its full paragraph, Colossians 3:1–4.)

**Study object schema:**

```
{
  id: "book-ch-vv",                 // kebab, unique
  reference: "Romans 12:1–2",
  title: "Romans 12:1–2",
  subtitle: "one-line hook for the library card",
  translations: ["NASB 1995","ESV"],
  purpose: ["Formation","AuDHD","Greek"],   // kept for historical/content-type reasons; no longer rendered on cards
  themes: ["Union with Christ","Identity in Christ"],   // 2–4 tags from the controlled vocabulary below — drives the "By Theme" library view
  anchor: "the one-sentence Anchor",
  sections: [ { n:"1", id:"text", title:"The Text", sub:"optional", blocks:[ ... ] }, ... ],
  oneThing: "closing single sentence (may contain <em>)",
  sources: "translations, Greek text, cross-refs, commentators, contested points flagged"
}
```

**Themes — controlled vocabulary.** Every study gets 2–4 `themes` tags, chosen from this list only. This is the same source of truth as the `THEMES` constant in the app's JS — if a new passage genuinely needs a theme not on this list, add it to both places at once (don't let them drift apart):

Assurance & Security · Crucified with Christ · Discipleship & Following Jesus · Freedom from Sin · Identity in Christ · Life in the Spirit · Purpose & Mission · Renewal of the Mind · Resurrection Hope · Sanctification & Holiness · Suffering & Endurance · Union with Christ · Worship & Consecration

The library's "By Theme" toggle groups studies under these tags automatically (`sortedGroupedByTheme()`); no manual index to maintain beyond tagging each study correctly.

**Block types** (inside a section's `blocks` array):

- `{type:"p", html}` — paragraph; inline `<em>`/`<strong>` allowed.
- `{type:"scripture", ver, html}` — printed Scripture; use `<sup class="vn">N</sup>` for verse numbers.
- `{type:"word", term, parse, html}` — original-language word card.
- `{type:"callout", style, label, html}` — `style:"oneline"` for summaries, `style:"caution"` for contested points.
- `{type:"list", style, items[]}` — `style:"pick"` for the Formation "pick one" list, `style:"plain"` otherwise.
- `{type:"prayer", html}` — the prayer block.
- `{type:"heading", text}` — optional sub-heading.

Section `id`s used for nav/scroll-spy: `text, context, flow, words, neuro, audhd, formation, prayer` (One Thing renders after the last section automatically).

---

## 5.5 · Standardized visuals (locked)

The live app is `logos-study-app.html`. Every study inherits this look — do not vary it per study.

- **Palette — "Olive Manuscript" (earth tones).** `--bg:#e6dabf` · `--panel:#efe4cf` · `--ink:#2a2620` · `--soft:#6a5f45` · `--line:#d2c09c` · `--scripture:#332f24` · `--accent-soft:#e7e5cc`. Single accent: **olive `#6b7233`**.
- **One accent = one meaning.** Olive is used only for section numbers, the sticky Anchor border, scripture/word-card accents, tags, and the "One thing" block. Introduce no other colors.
- **Font — Newsreader serif throughout.** Base size 18px, line-height 1.7, measure ~66ch. Scripture stays serif.
- **Fonts MUST be embedded as base64 `@font-face` — never linked from a CDN.**
- **Keep embedded fonts in their OWN `<style>` block, separate from and after the design CSS.** A parse failure or size limit on the heavy font payload must never be able to drop the design stylesheet. (This caused a full-design blackout once.) Also verify no doubled `@font-face {@font-face {` token after generating faces. The in-app preview and offline use block external font requests; linking was the cause of earlier font failures. Download the woff2 (latin + latin-ext subsets) and inline them at the top of the main `<style>`.
- **Reading affordances to preserve:** pinned Anchor, focus mode, A−/A+ text size. Choices persist via `localStorage`.
- **Adding a study:** append one object to the `STUDIES` array (schema §5), then run a JS syntax check before publishing.
- **Library sorting is automatic.** The library grid renders in canonical Bible order (book, then chapter:verse), grouped under book headers — `renderLibrary()` sorts at render time via `BOOK_ORDER`/`parseRef`/`sortedGroupedStudies()`. Studies can be appended to `STUDIES` in any order; do not hand-reorder the array to control display order.

## 6 · Optional Logos companion

Per the project standard, after a study is complete Jon may want a Logos note anchored to the passage: a 2–5 paragraph high-level overview plus the full study content, formatted for pasting into a passage-linked note. Offer this at the end; generate on request.

---

## 7 · Pre-publish verification checklist

Run before finalizing any study:

1. Scripture wording matches the named translation exactly (verified, not from memory).
2. Every Greek/Hebrew word: transliteration, gloss, and parsing checked.
3. Every cross-reference actually says what the study claims.
4. Contested points flagged, not resolved; no fabricated quotes.
5. Neuroplasticity section carries the "author did not know neuroscience" honesty and a biblical anchor.
6. AuDHD points are specific to this text, not generic.
7. Anchor and One Thing agree and bookend the study.
8. `themes` field has 2–4 tags, all drawn from the controlled vocabulary in §5 (no ad hoc theme names).
9. App still parses (JS syntax check) after appending.

---

*Spec v1.1 — visuals standardized (Olive Manuscript palette, Newsreader serif, embedded fonts). Locked from Romans 12:1–2, Galatians 2:20, Romans 6:5, and Colossians 3:3. Revise as the format matures.*
