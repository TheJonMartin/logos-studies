---
name: audhd-bible-study
description: >
  Create a richly-formatted, AuDHD-aware Bible study for any passage, saved to Notion.
  Use this skill whenever the user wants to study a Scripture passage, create Bible study
  notes, explore a text through an ADHD or autism lens, or says things like "let's study
  [passage]", "help me with [book chapter:verse]", "make a study for", "break down this
  passage", or "I want to dig into [Scripture]". Also trigger for requests about
  neurodivergent theology, AuDHD faith, or applying biblical text to ADHD/autism experience.
  Produces a structured study page in Notion with 6 panels per verse block: Greek Exegesis,
  Commentary (JFB), AuDHD Reframe, Word Study, Additional Commentators, and Pastoral
  Reflection. After Notion push completes, asks whether to also save a note to Logos.
---

# AuDHD Bible Study Generator

You are building a deep, pastorally warm, academically grounded Bible study tailored
specifically for believers with AuDHD (ADHD + Autism). This is not a summary document —
it is an immersive study tool that honors both the text's depth and the neurodivergent
reader's actual experience. The primary output is a Notion page.

## Step 0 — Gather Inputs

Ask the user for:
1. **Passage** — book, chapter(s), verse range (e.g., "Romans 5:1-11")
2. **Named commentators** — up to 5 sources they own or want cited. If they don't specify,
   use: Keller (relevant volume), Stott (The Message of Romans or relevant IVP volume),
   Yarbrough & Naselli (ESV Expository Commentary), Barnes (Notes on the NT), and one
   thematically relevant pastoral voice (e.g., Merida, Begg, Carson).
3. **Notion destination** — which Notion page or database to save under. Always ask explicitly:
   "Where in Notion should I save this? (e.g., 'Bible Study', 'Logos Notes', a specific
   book notebook)" — do not assume or auto-search. Wait for the user's answer before
   proceeding to Step 1.

If the user pastes the passage text, use it. Otherwise, draw on your knowledge of the text.

---

## Step 1 — Divide into Verse Blocks

Split the passage into natural theological units — typically 3–8 verse spans per chapter.
A verse block should:
- Capture a complete thought or argument move
- Be wide enough to give context (usually 3–8 verses)
- Follow the text's own logical divisions (conjunctions, imperatives, new subjects)

Name each block with a short theological label (e.g., "Dead to Sin, Alive to God").

---

## Step 2 — Write 6 Panels Per Verse Block

For every verse block, write content for all six panels. Read `references/audhd-themes.md`
now for the full AuDHD experience library before writing any panel content.

### Panel 1 — Greek Exegesis (🔍)
- Identify 2–4 key Greek words in the block. For each:
  - **Term**: transliterated Greek word
  - **Parsing**: tense, voice, mood (for verbs); case (for nouns/adjectives)
  - **Gloss**: how major translations render it (ESV, NIV, NASB)
  - **Significance**: what the grammar reveals theologically (especially for AuDHD readers —
    e.g., aorist passive verbs that remove agency from the believer, present indicatives
    showing ongoing state vs. completed action)
- Note any textual features: imperatives, indicatives, participial chains, rhetorical questions

### Panel 2 — Commentary (📖) [JFB or primary source]
- Draw on Jamieson-Fausset-Brown or the user's primary commentary for this block
- Present the commentary's main interpretive moves in 2–4 short paragraphs
- Do not flatten — preserve interpretive nuance

### Panel 3 — AuDHD Reframe (🧠)
This is the heart of the document. Write 3–5 substantial paragraphs.
See `references/audhd-themes.md` for the full library of AuDHD-specific reframes.

Key principles:
- **Name the specific AuDHD experience** the text might be triggering, misread through, or
  speaking directly into (RSD, will/execution gap, shame spiraling, identity confusion,
  masking exhaustion, rejection of grace as "too easy," performance-review posture toward God)
- **Reframe the text through that lens** — not by watering it down, but by showing how the
  text's actual meaning is *better news* for AuDHD readers than the surface reading suggests
- **Use concrete metaphors** the AuDHD mind can grab (OS metaphors, momentum/friction language,
  system-state language, sensory anchors)
- **Avoid** vague encouragements ("you can do it!") or shame-reinforcing frames ("try harder")
- **Speak pastorally** — warm, honest, theologically grounded, not clinical

### Panel 4 — Word Study (📝)
Pick 1–2 words from the passage (English or Greek) for a focused study:
- Etymology and root meaning
- Old Testament background or Septuagint usage (if relevant)
- Range of meaning across NT uses
- How the specific usage here narrows or expands the meaning
- 1–2 cross-references that illuminate this word

### Panel 5 — Additional Commentators (📚)
Cite each of the user's 5 named sources in order. For each:
- **Name**: Author last name
- **Source**: Full title or short title
- **Content**: 1–3 sentences capturing their specific angle on this passage block.
  Prioritize interpretive diversity — don't just repeat the same point five times.
  Sources might disagree; show that honestly.

### Panel 6 — Pastoral Reflection (💭)
Write 2–3 bullet-point reflection questions. Each question should be:
- **Short** — one sentence maximum
- **Concrete** — tied to something specific in the text
- **AuDHD-specific** — naming the felt experience, not a generic devotional question
- **Non-shaming** — open, curious, not performance-demanding

Good examples:
- "Where does your brain most resist 'reckoning' yourself dead — is it RSD, the shame spiral, or something else?"
- "When Paul says 'you are not under law but under grace,' does that feel like relief or like a trap? What does that reaction tell you?"
- "What would it mean for your *body* — not just your mind — to 'present itself as an instrument of righteousness'?"

Avoid:
- "How can you apply this this week?" (too generic)
- "What does this verse mean to you?" (too vague)

---

## Step 3 — Push to Notion

Use the Notion MCP tools (`mcp__6c695062-c837-4f88-9ab7-955bdf3bf935__*`) to create the
study page.

### 3a — Find the destination
1. Use `notion-search` to locate the user's Bible study parent page or database.
   Search terms to try: "Bible Study", "Logos", "Scripture", "AuDHD Study".
2. If no clear parent exists, ask the user where to save it before proceeding.

### 3b — Create the page
Use `notion-create-pages` to create a new page under the destination with:
- **Title**: "[Book Chapter:Verse Range] — AuDHD Study" (e.g., "Romans 5:1-11 — AuDHD Study")
- **Content structure — panel-first layout** (organized by panel type, not verse block):
  - Heading 1: passage reference + date
  - Callout block: full passage text (NASB 1995 or ESV, verbatim — every verse, no ellipsis)
  - Divider
  - **Section: 🔍 Greek Exegesis** (Heading 2)
    - For each verse block: Heading 3 with verse range + theological label, then the Greek
      exegesis content for that block. Verse refs appear inline as muted labels.
  - Divider
  - **Section: 📖 Commentary** (Heading 2)
    - For each verse block: Heading 3 with verse range + label, then commentary content.
  - Divider
  - **Section: 🧠 AuDHD Reframe** (Heading 2)
    - For each verse block: Heading 3 with verse range + label, then AuDHD reframe content.
      This is the longest and most important section — do not compress it.
  - Divider
  - **Section: 📝 Word Study** (Heading 2)
    - For each verse block: Heading 3 with verse range + label, then word study content.
  - Divider
  - **Section: 📚 Additional Commentators** (Heading 2)
    - For each verse block: Heading 3 with verse range + label, then all 5 commentators.
  - Divider
  - **Section: 💭 Pastoral Reflection** (Heading 2)
    - For each verse block: Heading 3 with verse range + label, then reflection questions
      as a bulleted list.

### 3c — Confirm
After the page is created, share the Notion page link with the user.

---

## Step 4 — Offer Logos Export (Always Ask)

After the Notion push completes, **always ask**:

> "Would you also like me to create a note in Logos attached to this passage? I'll include
> a 2–5 paragraph overview and the full study content."

Wait for the user's response before proceeding.

**If YES** — create a Logos note following the project instructions:
- Attach it to the passage reference (e.g., Romans 5:1-11)
- High-level overview: 2–5 paragraphs summarizing the theological arc, key Greek insights,
  and the primary AuDHD reframe for the passage
- Full compilation: complete study content from all verse blocks, all 6 panels, in readable
  prose form (not toggle structure — written out fully for Logos's note format)
- Include neuroplasticity concepts and AuDHD reframing where relevant
- Use the Logos desktop app via computer-use tools to create the note

**If NO** — wrap up and close.

---

## Quality Checks Before Delivering

- [ ] Every verse block has all 6 panels
- [ ] **Passage text is COMPLETE** — every verse in the range, every word, verbatim in
  NASB 1995 or ESV. Never use an ellipsis or cut text short.
- [ ] AuDHD panels name specific neurodivergent experiences — not generic encouragement
- [ ] Commentators panel has all 5 named sources with distinct angles
- [ ] Pastoral questions are concrete, text-grounded, and AuDHD-specific
- [ ] Notion page was created successfully and link is shared
- [ ] Logos export question was asked after Notion push

---

## Iterating on an Existing Study

If the user wants to add a new chapter to an existing study:
1. Use `notion-search` to find the existing study page
2. Use `notion-fetch` to read the current content and identify each panel section
3. Append new verse-block subsections (Heading 3 + content) under each panel section
4. Re-share the updated page link
5. Ask again about Logos export if new content was added

If the user wants to enrich existing content (e.g., "expand the AuDHD Reframe for vv. 8-11"):
1. Read `references/audhd-themes.md` for relevant themes
2. Use `notion-update-page` to update the specific Heading 3 block and its content
   within the relevant panel section
3. Re-share the page link
