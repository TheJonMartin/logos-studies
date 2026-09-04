#!/usr/bin/env python3
"""Append one or more study objects to the STUDIES array in logos-study-app.html.

Usage:
    python3 scripts/insert-study.py study1.js study2.js ...

Each input file must start with a leading comma, then the object literal, e.g.

    ,
    {
      id:"1-corinthians-10-1-5",
      reference:"1 Corinthians 10:1–5",
      ...
    }

Safety behaviour:
  * Locates the STUDIES array by scanning for `const STUDIES = [` and then the
    first following line that is exactly `];`. Do NOT trust a bare
    `grep -n '^\\];'` — it has mis-hit before.
  * Runs `node --check` on the concatenated <script> bodies BEFORE writing.
    JSON-LD blocks (type="application/ld+json") and external src= scripts are
    excluded, since they are not JavaScript.
  * If the syntax check fails, the file is left completely untouched.

The app path is resolved relative to this script (../logos-study-app.html), so
it works regardless of where the project folder is mounted.

Written 2026-08-13 while building the 1 Corinthians 8–10 studies.
"""
import os
import re
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, "..", "logos-study-app.html")

if len(sys.argv) < 2:
    sys.exit("usage: insert-study.py <study.js> [study2.js ...]")

lines = open(APP, encoding="utf-8").read().split("\n")

# Find the STUDIES array bounds.
try:
    start = next(i for i, l in enumerate(lines)
                 if re.match(r"\s*(const|let|var)\s+STUDIES\s*=", l))
except StopIteration:
    sys.exit("could not find the STUDIES array declaration")
try:
    end = next(i for i in range(start + 1, len(lines)) if lines[i].strip() == "];")
except StopIteration:
    sys.exit("could not find the closing '];' of the STUDIES array")
print("STUDIES array: line %d .. %d" % (start + 1, end + 1))

payload = []
for f in sys.argv[1:]:
    payload.extend(open(f, encoding="utf-8").read().rstrip("\n").split("\n"))

out = "\n".join(lines[:end] + payload + lines[end:])

# Syntax check the real JavaScript only.
scripts = [body for attrs, body in
           re.findall(r"<script([^>]*)>(.*?)</script>", out, re.S)
           if "json" not in attrs.lower() and "src=" not in attrs.lower()]
# Write the scratch file to the system temp dir, not the project folder — the
# mounted folder does not permit deletion, so cleaning up here would fail.
check_path = os.path.join(tempfile.gettempdir(), "logos-study-check.js")
open(check_path, "w", encoding="utf-8").write("\n;\n".join(scripts))
result = subprocess.run(["node", "--check", check_path],
                        capture_output=True, text=True)

if result.returncode != 0:
    print("SYNTAX CHECK FAILED — file NOT written")
    print(result.stdout, result.stderr)
    sys.exit(1)

open(APP, "w", encoding="utf-8").write(out)
print("OK — syntax check passed, %d line(s) inserted" % len(payload))
print("studies now: %d" % len(re.findall(r"^  reference:", out, re.M)))
