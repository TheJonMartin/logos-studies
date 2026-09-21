# Porter — insert 1 Corinthians 13 studies

Three study payloads are in this folder. They were syntax-checked against a copy of logos-study-app.html (`node --check` via insert-study.py). This chat could not push the 3.8MB app file through the GitHub file API.

On the Mac clone `/Users/jonmartin/Documents/Logos`:

```bash
git pull origin main
python3 scripts/insert-study.py \
  scripts/pending/study-1cor13-1-3.js \
  scripts/pending/study-1cor13-4-7.js \
  scripts/pending/study-1cor13-8-13.js
git add logos-study-app.html
git commit -m "Add 1 Corinthians 13:1–3, 13:4–7, 13:8–13 studies"
git push origin main
```

Expected STUDIES reference count: 228 → 231.
Expected new ids:
- 1-corinthians-13-1-3
- 1-corinthians-13-4-7
- 1-corinthians-13-8-13

Then deploy as usual. Add literal 301s:

```
/studies/1-corinthians-13-1-3/   /studies/1-corinthians-13-1-3/index.html   301
/studies/1-corinthians-13-4-7/   /studies/1-corinthians-13-4-7/index.html   301
/studies/1-corinthians-13-8-13/  /studies/1-corinthians-13-8-13/index.html  301
```
