# logos-studies (audhd-bible.netlify.app)
Single self-contained static study app. Netlify auto-deploys on every push to `main`: NEVER push to main.

## Files
- logos-study-app.html: the app (head/CSS, huge `const STUDIES = [ ... ];` data array, app JS at the end). Never renamed or rebuilt from scratch.
- scripts/build-seo.js: builds dist/ (index.html, hashed assets/studies.*.js, per-study pages, sitemap, robots, llms.txt, _redirects)
- scripts/insert-study.py, digest-interlinear.py: authoring helpers
- static/: copied into dist (icons, manifest, sw.js, Google verification)
- Docs: README.md, PROJECT-INSTRUCTIONS.md, STUDY-FORMAT-SPEC.md, SEO-AEO-SETUP.md

## Commands
- Build: `node scripts/build-seo.js` (Node 22)
- Proof for cleanups: sha256 manifest of every dist/ file before vs after

## Don't touch
- scripts/pending (1 Corinthians 13 studies waiting to be inserted)
- anchored-in-the-rock-gap-list.md, men-of-grit-study-gap-analysis.md (kept on purpose)
- Study content/wording
