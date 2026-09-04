#!/usr/bin/env python3
"""Digest a saved Bible Hub interlinear page into compact, verifiable lines:

    verse | translit  greek | Strongs | morph-code | full morphology

Filters out articles, conjunctions, prepositions, pronouns and particles, which
are never word-card material and would otherwise bury the load-bearing forms.

Usage:
    python3 scripts/digest-interlinear.py ic10.txt            # whole file
    python3 scripts/digest-interlinear.py ic10.txt 14 22      # verses 14-22

Getting the input file
----------------------
Fetch `https://biblehub.com/interlinear/<book>/<chapter>.htm`. It exceeds the
web_fetch token cap and is auto-saved to a file; copy that file somewhere and
point this script at it. Per-verse pages
(`https://biblehub.com/interlinear/<book>/<ch>-<v>.htm`) work with this script
too and cost roughly 4k tokens each.

IMPORTANT — chapter pages truncate mid-chapter. 1 Corinthians 8 came through
complete; 1 Corinthians 9 cut off partway through v.14. Always confirm coverage
before trusting a chapter digest:

    grep -o '^- [0-9]* \\[' ic10.txt | tail -3

If the last verse shown is short of the chapter end, fetch the remaining verses
individually. Target only the verses that will become word cards — 2-3 per
study is enough for six cards; remaining vocabulary can be handled in prose with
a `sources` parsing note.

Bible Hub's glosses are not infallible. It labelled `charismati` (1 Cor 1:7)
dative *plural* when the form is singular, and glossed `synētheia` (1 Cor 8:7,
"custom") as "with conscience" — carrying the KJV's English across to the
critical text's Greek word. Sanity-check the morphology against the actual form
and note any discrepancy in the study's `sources` line.

Written 2026-08-13 while building the 1 Corinthians 8–10 studies.
"""
import re
import sys

if len(sys.argv) < 2:
    sys.exit("usage: digest-interlinear.py <saved-interlinear.txt> [first] [last]")

path = sys.argv[1]
lo = int(sys.argv[2]) if len(sys.argv) > 2 else 0
hi = int(sys.argv[3]) if len(sys.argv) > 3 else 999

# Morphology prefixes that are never worth a word card.
SKIP = ("Art-", "Conj", "Prep", "PPro", "RelPro", "DPro",
        "IPro", "RecPro", "RefPro", "Prtcl")

verse = 0
rows = []

for raw in open(path, encoding="utf-8"):
    line = raw.strip()
    if not line.startswith("- "):
        continue
    body = line[2:]

    # A leading bare number marks the start of a verse, e.g. "- 14 [3779](...)"
    m = re.match(r"^(\d+)\s+\[", body)
    if m:
        verse = int(m.group(1))
    if not (lo <= verse <= hi):
        continue

    # Strong's number: the first /greek/NNNN.htm link.
    strongs = re.search(r"\[(\d+)\]\(https://biblehub\.com/greek/\d+\.htm", body)
    # Transliteration: a /greek/word_NNNN.htm link (underscore distinguishes it
    # from the bare Strong's-number link above).
    translit = re.search(
        r"\[([^\]]+)\]\(https://biblehub\.com/greek/[a-zA-Z_0-9]*_\d+\.htm\s*"
        r"\"([^:\"]+):\s*([^\"]*)\"\)", body)
    # Morphology: a /grammar/xxx.htm link carrying the full description.
    morph = re.search(
        r"\[([A-Za-z0-9\-/]+)\]\(https://biblehub\.com/grammar/[^\)\"]+"
        r"\"([^\"]+)\"\)", body)

    if not (strongs and translit and morph):
        continue
    code = morph.group(1)
    if code.startswith(SKIP):
        continue

    # The Greek word is the unicode run following the transliteration link.
    greek_match = re.search(r"\)\s*([Ͱ-Ͽἀ-῿̀-ͯ'’ʼ]+)", body)
    greek = greek_match.group(1) if greek_match else ""

    rows.append("%3d | %-18s %-14s | G%-5s | %-12s | %s" % (
        verse, translit.group(1), greek, strongs.group(1), code, morph.group(2)))

print("\n".join(rows))
print("\n-- %d forms --" % len(rows))
