# SEO / AEO Setup — Logos Studies

Live site: https://audhd-bible.netlify.app/

## What changed (2026-07-19)

The app was a single-page JS app with no crawlable content: title-only
`<head>`, no meta description, no Open Graph/Twitter tags, no structured
data, no `robots.txt` or `sitemap.xml`, and no per-study URLs — a raw fetch
of the homepage returned only the library shell, none of the actual study
text. Search engines that render JavaScript (Google) could eventually see
content, but nothing else could, and no individual study had its own
shareable, indexable address.

Fixed, without touching how the interactive app works:

- **`scripts/build-seo.js`** — new Netlify build step. Reads the `STUDIES`
  array out of `logos-study-app.html` and generates, on every deploy:
  - `dist/index.html` — the app itself, copied verbatim, unchanged
  - `dist/studies/<id>.html` — one real static HTML page per study, with the
    full scripture text and commentary in plain HTML (no JS needed to read
    it), its own `<title>`, meta description, canonical URL, Open Graph /
    Twitter tags, and `Article` + `BreadcrumbList` JSON-LD
  - `dist/sitemap.xml` — homepage + every study page
  - `dist/robots.txt` — allow all, points at the sitemap
  - `dist/llms.txt` — plain-text index of every study, for AI answer engines
    that support the emerging llms.txt convention
- **`logos-study-app.html`** — added a real `<title>`, meta description,
  canonical link, OG/Twitter tags, and a `WebSite` JSON-LD block to the
  homepage `<head>`. Also added a tiny deep-linking feature: opening a study
  now sets the URL to `/#s=<id>` and updates the page title/description live;
  loading the app with that hash open straight to the study. Static pages
  link to this so "open in the app" lands exactly where expected.
- **`netlify.toml`** — build command now runs `node scripts/build-seo.js`
  instead of a plain file copy.

None of this touches the `STUDIES` array, the visual design, or the
locked study format — adding a study is still exactly what
`PROJECT-INSTRUCTIONS.md` describes (append to `STUDIES`, syntax-check,
commit, push). Everything else regenerates automatically on the next
deploy.

**Nothing to maintain by hand going forward** — the sitemap, robots.txt,
llms.txt, and every study's static page regenerate from `STUDIES` on every
build. If a custom domain ever replaces the Netlify subdomain, update the
one `SITE_URL` constant at the top of `scripts/build-seo.js` and everything
else follows.

## Manual steps (need your Google/Bing accounts — can't be done from here)

1. **Google Search Console** — https://search.google.com/search-console
   - Add property: `https://audhd-bible.netlify.app/` (URL-prefix property)
   - Verify via the HTML tag method, or the DNS method if you add a custom
     domain later
   - Submit sitemap: `sitemap.xml`
   - After a few days, check Coverage/Indexing to confirm study pages are
     being picked up
2. **Bing Webmaster Tools** — https://www.bing.com/webmasters
   - Bing's index also feeds Copilot and some other AI answer engines, so
     it's worth the five minutes
   - Same idea: add site, verify, submit `sitemap.xml`
3. **Google Analytics 4** — https://analytics.google.com
   - Create a GA4 property, get the Measurement ID
   - Add the GA4 snippet to `logos-study-app.html`'s `<head>` (tell me when
     you have the ID and I'll wire it in — every study page will need it too)
4. Optional: a custom domain reads better in search results and social
   shares than a `.netlify.app` subdomain, and makes Search Console
   verification via DNS possible. Not required to move forward.

## AEO (answer-engine) notes

"AEO" mostly means: can an AI system that answers questions (ChatGPT,
Perplexity, Google AI Overviews, Copilot) find, parse, and confidently cite
this content? Three things drive that, all now in place:

- **Real, crawlable text** per study (the static pages) — most of these
  systems either crawl directly or lean on Bing/Google's index, neither of
  which could read this site's actual content before today
- **Structured data** (`Article`/`BreadcrumbList` JSON-LD) — gives crawlers
  unambiguous signals about what each page is and how it relates to the rest
  of the site
- **`llms.txt`** — an emerging, not-yet-universal convention some AI
  crawlers check for a clean index of a site's content; costs nothing to
  have, no downside

What still helps over time: inbound links (other sites linking to specific
studies), and simply having more indexed pages as the study library grows —
both are things the weekly cadence tracks.
