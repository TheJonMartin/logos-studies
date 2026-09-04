# Logos project — current instructions

### Paste the block below into the Logos project's **Instructions** field (Claude app → the Logos project → project settings / instructions), replacing whatever is there now.

**Last revised 2026-08-14.** This revision adds scope defaults, the tooling and source-caution sections, the publishing workflow, and a spec-precedence rule — all drawn from friction that recurred across the July–August sessions. It also corrects the **Visuals** paragraph, which still described the retired Olive Manuscript/Newsreader design, and the **Format** line, which listed Words before the Neuroplasticity Bridge (no built study has ever used that order).

---

## Instructions (copy everything below this line)

This project creates AuDHD-aware Bible studies. When I say "study [passage]" (or "add / build a study"), follow the workflow below. Do NOT use Notion, and do NOT use the `audhd-bible-study` skill or its Notion/Logos-note flow — that approach is retired for this project.

**Destination — the webapp.** All studies live in the single self-contained file `logos-study-app.html` in this folder. To add a study, append one object to the `STUDIES` array, then run a JavaScript syntax check. Never rebuild the app from scratch and never rename it.

**Format — follow `STUDY-FORMAT-SPEC.md` in this folder.** Every study uses the locked arc: Anchor → The Text → Where This Sits → The Movement of Thought → The Neuroplasticity Bridge → AuDHD Reframe → Words That Carry Weight → Formation ("pick one") → Response/Prayer → One Thing to Carry Today.

**Translations.** NASB 1995 (primary) and ESV — print both. Never silently substitute another translation. The one exception is topical studies (spec §5.6), which print NASB 1995 only.

**Correctness is the top priority.** Verify Scripture wording and every Greek/Hebrew form, parsing, and cross-reference before writing it. Do not make inferences or assumptions. Flag genuine scholarly debates (with the amber "caution" callout) rather than resolving them. Never fabricate quotations. Keep the neuroplasticity bridge modest — always note the biblical author did not know modern neuroscience, tie it to a biblical text and the Spirit's work, never self-help. Always include AuDHD reframing where the text supports it.

**Scope defaults — assume these unless I say otherwise.**

- Split by ESV section heading; break anything longer than roughly 15 verses into its own study.
- Expand a single verse to its full paragraph, verified from the printed text rather than guessed.
- Build **one chapter per session**, then stop and report. Do not start the next chapter without asking. (A chapter is the reliable unit before context and usage limits bite.)
- Confirm the range before building when a paragraph may run past a chapter break — check whether the closing unit continues into the next chapter rather than assuming the chapter number is the boundary.
- **Before building:** scan the `STUDIES` array for verse-adjacency or topical overlap. If something overlaps, ask me whether to merge or add standalone — never decide unilaterally. (Does not apply to topical studies, where overlap is the point.)
- **After building:** diff the full study-reference list before and after. Report the exact count change and confirm nothing else moved. This applies whether the work was done directly or delegated to a subagent — a subagent once added five studies I never asked for.

**Tooling — use what exists, don't rebuild it.** `scripts/` in this folder holds:

- `insert-study.py` — appends a study object to `STUDIES` (resolves the app by relative path, so it works from any session).
- `digest-interlinear.py` — parses saved Bible Hub interlinear pages.
- `build-seo.js` — builds `dist/`.

Read their docstrings before using them; they carry the hard-won failure modes.

**Source cautions.**

- Bible Hub **chapter** interlinears truncate around verse 12. Always verify chapter coverage before trusting one; fall back to per-verse interlinears for the remainder.
- Two documented Bible Hub gloss errors to watch for: `charismati` parsed as plural, and `synētheia` glossed "with conscience." When a parsing looks off, check it against a second source rather than reproducing it.
- When grepping the app for the end of the `STUDIES` array, `grep '^\];'` produces mis-hits. Locate the array boundaries by structure, not by that pattern.

**Publishing — only when I explicitly ask.**

- There is **no git remote** on this repo. Commits stay local; "push so Netlify rebuilds" does nothing. Deploys are manual `dist/` uploads through the Netlify API.
- Wipe `dist/` before every rebuild — stale files otherwise survive into the deploy.
- Canonical study URLs are `/studies/<id>/`. `_redirects` needs literal 301 entries, never wildcards.
- **Never verify the live site with `web_fetch`** — it serves stale cached copies and has already produced one completely wrong status report. Use a cache-busted fetch through the browser instead.

**Spec precedence.** When `STUDY-FORMAT-SPEC.md` and the app disagree, **the app wins.** Follow the app, finish the work, and flag the discrepancy so I can reconcile the document — do not reorder or rewrite existing studies to match a spec.

**Logos desktop note.** Optional, and only when I explicitly ask. The Logos app is not connected here, so any Logos note is a manual paste-in export — do not assume it is set up and do not default to creating one.

**Multiple passages in one request.** When I drop in a list of several passages at once, work through them sequentially — fully research, write, and append one passage's study (including its syntax check) before starting the next. Do not interleave research across passages. Run straight through the list without stopping for review after each one, then give a single end-of-run summary with the full before/after diff of the `STUDIES` reference list. If the list spans more than one chapter, apply the one-chapter-per-session rule and stop at the chapter boundary.

**Study request queue.** The library page has a "+ Request a study" box (bottom of the grid) where anyone can type a passage reference; it's saved to a `studyQueue` array in the browser's local storage only — nothing is sent anywhere, and nothing gets written to `STUDIES` automatically. When I say "check the queue" or similar, open `logos-study-app.html`, find the queued list, process each entry with the standard workflow above, and remove each one from the queue once its study is appended.

**Visuals — locked (see `STUDY-FORMAT-SPEC.md` §5.5).** "Field & Ledger" palette: cream background `#faf6ef`, charcoal text `#2e2a26`, plum primary accent `#4a3352`, sage secondary `#7c9473` (decorative only — never as text color), mustard `#e8a93b` reserved for genuine highlights, at most one mustard element per study page. Georgia for headings, Calibri for body, Courier New for labels and parsing notation only. **No font embedding** — all three are system fonts, so link nothing and embed nothing. (This replaced the earlier Olive Manuscript / Newsreader base64 setup on 2026-08-01. If a non-system webfont is ever reintroduced, it goes in its own `<style>` block after the design CSS — merging it caused a full-design blackout once.)

---

*Note: the `audhd-bible-study` skill (which auto-pushes to Notion) may still trigger on phrases like "study [passage]." If it keeps activating, disable or edit it in the Claude app under Settings → Capabilities. These project instructions tell Claude to ignore it, but turning it off removes the conflict entirely.*
