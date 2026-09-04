# Logos Studies — Format Specification (v1)
### The blueprint for every study. When Jon says "study [passage]," this is the standard.

---

## 0 · Purpose & audience

Each study serves **AuDHD-aware discipleship and personal formation** for a conservative, evangelical reader who is training for pastoral ministry. The tone is warm, pastoral, and honest — never gimmicky, never dumbed-down. Depth and correctness come first; accessibility is achieved through *structure*, not by thinning the content.

**Default translations:** NASB 1995 (primary) and ESV. Print both. If another translation is requested, add it; never silently substitute. Exception: **topical studies** (§5.6) print NASB 1995 only — a documented, deliberate exception for that study type, not a general change.

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

**4 · The Neuroplasticity Bridge** — connect the passage to how minds/identities actually change (attention, repetition, self-narrative), under the §1.5 guardrails. Tie to a specific biblical text on renewal/formation. One-line summary.

**5 · AuDHD Reframe** — 3–5 specific, honest points where the passage meets a neurodivergent mind. Draw from these recurring lenses as the text warrants: willpower/executive-function relief, identity-vs-performance, masking vs. inward transformation, embodiment/concreteness, iterative discernment, repetition-as-mechanism, the personal/singular against feeling like "the exception," sensory/pacing. Never force all of them; pick what the text actually supports.

**6 · Words That Carry Weight** — ~4–6 load-bearing original-language words, each as a word-card with: term + transliteration, grammatical parsing (tense/voice/mood/case as relevant), and 2–4 sentences of meaning tied to at least one cross-reference. Include amber caution callouts for any genuinely contested word. Close with a one-line summary.

**7 · Formation** — concrete application framed as **"pick one, not all."** 3 options, each a small, doable, embodied action. Reducing choice load is the point.

**8 · Response / Prayer** — a short first-person prayer in the voice of the passage, honest about AuDHD struggle where fitting.

**9 · One Thing to Carry Today** — a single sentence takeaway, rendered as the closing highlighted block. Bookends the Anchor.

**Ordering is verified against the app, and the app wins.** As of 2026-08-14 all 166 single-passage studies in `STUDIES` run `text → context → flow → neuro → audhd → words → formation → prayer`; zero run Words before the Bridge. (Corrected 2026-08-14 — the spec had Words at 4 and the Bridge at 5, which never matched a built study.) The 11 topical studies use the §5.6 variant order and have no Neuroplasticity section at all. If this doc and the app ever disagree again, follow the app and flag the discrepancy to Jon rather than reordering 177 studies to match a document.

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
- **OT narrative:** §3 becomes scene/plot movement; §2 emphasizes placement in the larger story; watch for narrator's point of view. Hebrew words in *Words That Carry Weight*.
- **Psalm / poetry:** §3 traces poetic structure (parallelism, strophes, turns); note imagery and emotional movement; Hebrew word studies; be careful not to flatten metaphor into proposition.
- **Gospel:** §2 notes placement in the Gospel's flow and synoptic parallels where relevant; §3 traces the pericope's movement.
- **Wisdom / Prophecy:** §2 handles historical setting and genre conventions; flag figurative vs. literal honestly.

In every genre, §1 guardrails apply without exception.

---

## 5 · Output format (how it reaches the app)

Studies live in `logos-study-app.html` as objects appended to the `STUDIES` array. Adding a study = appending one object; Jon never edits code. (Filename corrected 2026-08-14 — this section previously said `bible-study-app.html`, which has not been the app's name for some time.)

**Before adding a study, check existing work first.** Scan the `STUDIES` array for verse-adjacency (same book, nearby chapter/verse) or topical overlap with the new passage. If there's meaningful overlap, ask Jon whether the new passage should be merged into the existing study or added as its own standalone entry — don't decide unilaterally either way. (Adopted after Romans 6:5 and 6:6 were built as separate studies without this check.) **This check does not apply to topical studies (§5.6)** — a topical study is expected to revisit passages, or parts of passages, that already have their own single-passage study elsewhere in the library. That overlap is the point, not a problem to flag or avoid.

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

Section `id`s used for nav/scroll-spy, **in the order they must appear**: `text, context, flow, neuro, audhd, words, formation, prayer` (One Thing renders after the last section automatically). Number them `n:"1"` … `n:"8"` in that same order. Topical studies use the §5.6 order instead: `why, text, audhd, context, words, formation, prayer` — no `neuro` section.

---

## 5.5 · Standardized visuals (locked)

The live app is `logos-study-app.html`. Every study inherits this look — do not vary it per study.

- **Palette — "Field & Ledger."** `--bg:#faf6ef` (cream) · `--panel:#f0ece5` · `--ink:#2e2a26` (charcoal) · `--soft:#6f6b66` · `--line:#d5d1cb` · `--scripture:#2e2a26`. Primary accent: **plum `#4a3352`** (`--accent`/`--accent-soft:#e5dfdc`). Secondary: **sage `#7c9473`** (`--sage`/`--sage-soft:#e6e6db`). Rare highlight: **mustard `#e8a93b`** (`--mustard`/`--mustard-soft:#f7ebd6`/`--mustard-ink:#8d611e`). All pairings verified ≥4.5:1 WCAG AA for text use.
- **One primary, one secondary, one rare highlight.** Plum carries nearly everything — section numbers, the sticky Anchor border, links, buttons, "In one line" callouts. Sage is used sparingly and only decoratively (the word-study card's left border) — never as text color, since sage-on-cream fails AA contrast. Mustard is reserved for genuine highlights: the caution callout and the "One thing to carry" block (exactly one mustard element per study page). Introduce no other colors.
- **Fonts — three max, one role each.** Georgia for headings (titles, section headers, card references, word terms). Calibri for body copy (paragraphs, scripture text, prose). Courier New for labels/tags only — section numbers, verse-version tags, uppercase micro-labels, parsing notation — never body copy. Base size 18px, line-height 1.65–1.7, measure ~66ch.
- **No font embedding needed.** Georgia, Calibri, and Courier New are standard system fonts on every major OS — link nothing, embed nothing. (This replaces the old Newsreader base64 `@font-face` setup entirely; if a future palette ever reintroduces a non-system webfont, embed it in its own `<style>` block separate from and after the design CSS, per the lesson that caused a full-design blackout once.)
- **Reading affordances to preserve:** pinned Anchor, focus mode, A−/A+ text size. Choices persist via `localStorage`.
- **Adding a study:** append one object to the `STUDIES` array (schema §5), then run a JS syntax check before publishing.
- **Library sorting is automatic.** The library grid renders in canonical Bible order (book, then chapter:verse), grouped under book headers — `renderLibrary()` sorts at render time via `BOOK_ORDER`/`parseRef`/`sortedGroupedStudies()`. Studies can be appended to `STUDIES` in any order; do not hand-reorder the array to control display order. Topical studies (`type:"topical"`, §5.6) are excluded from this view and from "By Theme," and instead render under their own "Topical" tab via `sortedTopicalStudies()`.

## 5.6 · Topical studies (variant format)

A **topical study** gathers several passages under one theme instead of one arc through a single passage (e.g. "Identity & Self-Trust" across Psalm 139, 1 Samuel 16:7, Exodus 4:10–13, John 21). It stays inside the same `STUDIES` array and the same append-one-object workflow — no new code, no separate skill file. It is a variant of the schema in §5, not a different app.

**Translation — NASB 1995 only.** Topical studies print NASB 1995 text only, not the NASB 1995 + ESV pair required for single-passage studies in §0. This is a deliberate, documented exception for this study type only — never extend it to single-passage studies without saying so explicitly. Set `translations:["NASB 1995"]` on the study object.

**Section order — all passages first, then one topic-level treatment of each angle.** Unlike an earlier draft of this format, sections are not repeated per passage. The study runs in this fixed order:

1. **Why These Passages** — 1–2 short paragraphs on how the passages speak to each other and what shared question they answer together.
2. **The Text** — every passage's Scripture, back to back, NASB 1995 only. Use a `{type:"heading"}` block naming each reference right before its `{type:"scripture"}` block, so all four (or however many) texts sit together in one section, in the order they'll be discussed.
3. **AuDHD Reframe** — one topic-level treatment, not four passage-level ones. Each point should genuinely synthesize across passages (e.g. "Presence supplied at the point of weakness, not competence demanded first" naming both Exodus 4:12 and John 21 in the same point) rather than four separate single-passage blurbs concatenated. This is the featured section of a topical study: give it real depth (4–6 points), scoped to the theme as a whole.
4. **Where This Sits** — one section, opened by a short paragraph naming that these passages span different genres/eras and were never written as a set, followed by a brief `{type:"heading"}` + one-paragraph placement for each passage (compact — this is not the fuller per-passage treatment a single-passage study gets).
5. **Words That Carry Weight** — one section, organized the same way: a short intro sentence, then a `{type:"heading"}` per passage with 1–2 word cards under it (tightened from the usual 4–6 per passage down to the single most load-bearing term or two). Same rigor as §1 non-negotiables applies to every card: verified parsing, transliteration, honest cautions on contested points.
6. **Formation** ("pick one") — synthesized across all passages.
7. **Response / Prayer** — synthesized across all passages.
8. `oneThing` — rendered automatically by the app after the last section, same as any study.

The `anchor` field is a single **topical Anchor** — one sentence naming the theme across all passages, not any single one.

**Schema notes.** Same object shape as §5's schema, plus one required addition: **`type:"topical"`** on the study object. This is what routes the study to its own nav section instead of "By Book" / "By Theme" (see below) — never omit it on a topical study. `reference` is the topic name itself (e.g. `"Identity & Self-Trust"`), since it has no single book:chapter:verse to sort by. `sources` should list every passage's translation/Greek/Hebrew verification and cross-references, same as a single-passage study.

**No overlap check.** The §5 "check existing work first" rule does not apply here. A topical study is expected to revisit passages — or parts of passages — already covered by their own single-passage study elsewhere in the library. Don't scan for or flag that overlap; it's the nature of a topical study, not an error.

**Supporting-passages check, before finalizing the passage list.** Once Jon names a topic and a starting set of passages, search for other passages that speak to the same theme before drafting — cross-references, topical indices, parallel accounts, the kind of connections a topical Bible or treasury of scripture knowledge would surface. Bring back a short list of candidates (passage + one-line reason it fits) and let Jon decide what, if anything, to add — don't silently expand or shrink the passage set. This is a completeness check on the *topic*, distinct from the retired overlap check above, which was about avoiding duplicate *coverage*.

**Navigation.** Topical studies get their own **"Topical"** tab in the library view toggle, alongside "By Book" and "By Theme" — this is where they live, not folded into the other two. `type:"topical"` studies are excluded from `sortedGroupedStudies()` (By Book) and `sortedGroupedByTheme()` (By Theme) and instead render via `sortedTopicalStudies()` under the "Topical" tab. Tag `themes` accurately anyway — useful for search/cross-reference even though the By Theme view won't surface them.

**Non-negotiables from §1 still apply in full** — correctness, no fabricated quotes, contested points flagged not resolved — to every passage individually, not just the set as a whole.

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
9a. Section order and numbering match §2 exactly (`text, context, flow, neuro, audhd, words, formation, prayer`), with no stray keys and no empty `blocks` arrays.
9b. Study count diffed before/after: the reference list grew by exactly the number of studies requested, and nothing else in `STUDIES` moved or changed.
10. For topical studies: `type:"topical"` is set; all passages' texts sit together in one "The Text" section, in order; AuDHD Reframe, Where This Sits, and Words That Carry Weight each appear exactly once and genuinely synthesize across passages rather than repeating a per-passage block four times; `translations` is `["NASB 1995"]` only; Formation/Prayer are synthesized once across the set; a supporting-passages check was run and any additions were confirmed with Jon, not assumed; no overlap check was run against single-passage studies (not required for this type).

---

*Spec v1.3 (2026-08-14) — §2 arc reordered to match the app (Neuroplasticity → AuDHD → Words; the spec had Words first, which no built study ever followed), app filename corrected in §5, verification checklist extended with ordering and diff checks. Previously v1.2 — visuals re-standardized to Field & Ledger (plum/sage/mustard palette, Georgia/Calibri/Courier New, no font embedding). Locked from Romans 12:1–2, Galatians 2:20, Romans 6:5, and Colossians 3:3. Topical study variant (§5.6) added 2026-07-20. Field & Ledger re-brand 2026-08-01, replacing the original Olive Manuscript/Newsreader spec. Revise as the format matures.*
