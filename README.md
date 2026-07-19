# Logos — AuDHD Bible Study App

Single self-contained study app, deployed to Netlify. Source of truth is
`logos-study-app.html` — never rebuilt from scratch, never renamed (see
`PROJECT-INSTRUCTIONS.md`).

## Deploy

Netlify builds from this repo automatically on every push to `main`
(live at https://audhd-bible.netlify.app/):

1. `netlify.toml` runs `node scripts/build-seo.js`
2. That script copies `logos-study-app.html` → `dist/index.html` (unchanged,
   verbatim), then generates a real static HTML page per study at
   `dist/studies/<id>.html` (crawlable by search engines and AI/answer-engine
   bots that don't run JavaScript), plus `dist/sitemap.xml`, `dist/robots.txt`,
   and `dist/llms.txt` — all derived automatically from the STUDIES array
3. Netlify publishes the `dist/` folder

Everything else in this repo (format spec, prototypes, handoff notes, the
retired Notion-based skill export) stays out of the published site — only
what `scripts/build-seo.js` writes into `dist/` is public. Never edit files
inside `dist/` directly; they're regenerated on every build.

Studies are shareable directly: each static page links to
`/#s=<id>`, which opens straight to that study in the interactive app.

## Working docs in this repo

- `PROJECT-INSTRUCTIONS.md` — the project's operating instructions
- `STUDY-FORMAT-SPEC.md` — locked format spec every study follows
- other `.md` / prototype `.html` files — historical drafts, not part of the live app

## Local workflow

Studies are added by appending an object to the `STUDIES` array in
`logos-study-app.html`, then running a JS syntax check, then committing and
pushing — Netlify takes it from there.
