# Logos — AuDHD Bible Study App

Single self-contained study app, deployed to Netlify. Source of truth is
`logos-study-app.html` — never rebuilt from scratch, never renamed (see
`PROJECT-INSTRUCTIONS.md`).

## Deploy

Netlify builds from this repo automatically on every push to `main`:

1. `netlify.toml` copies `logos-study-app.html` → `dist/index.html`
2. Netlify publishes the `dist/` folder

Everything else in this repo (format spec, prototypes, handoff notes, the
retired Notion-based skill export) stays out of the published site — only
`dist/index.html` is public.

## Working docs in this repo

- `PROJECT-INSTRUCTIONS.md` — the project's operating instructions
- `STUDY-FORMAT-SPEC.md` — locked format spec every study follows
- other `.md` / prototype `.html` files — historical drafts, not part of the live app

## Local workflow

Studies are added by appending an object to the `STUDIES` array in
`logos-study-app.html`, then running a JS syntax check, then committing and
pushing — Netlify takes it from there.
