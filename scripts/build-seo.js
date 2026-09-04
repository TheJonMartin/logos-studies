#!/usr/bin/env node
/*
 * build-seo.js
 * ------------
 * Netlify build step for the Logos study app.
 *
 * URL structure (2026-08-02 rewrite): every study has exactly one real,
 * canonical address — /studies/<id>/ — used both by search/AI-answer-engine
 * crawlers AND by the interactive app itself (path-based routing via
 * pushState, see the router in logos-study-app.html). Analytics keys off
 * this same path regardless of whether a visit starts on the crawlable
 * static content or from clicking around inside the app.
 *
 * What it does:
 *   1. Copies logos-study-app.html -> dist/index.html (unchanged, verbatim —
 *      the interactive app is never rebuilt or altered by this script).
 *   2. Reads the STUDIES array out of logos-study-app.html and generates a
 *      real, static, crawlable HTML page per study at
 *      dist/studies/<id>/index.html. Each page is a hybrid: full scripture
 *      text and commentary in plain HTML (no JS required to read it) sits
 *      in #staticFallback, immediately followed by the complete interactive
 *      app (same CSS/JS/STUDIES as dist/index.html). A JS-capable visitor's
 *      browser boots straight into the full interactive reader for that
 *      study and hides the static block; a crawler that doesn't run
 *      JavaScript still sees the full content immediately, no JS needed.
 *   3. Generates dist/sitemap.xml (homepage + every study page).
 *   4. Generates dist/robots.txt (allow all, points at the sitemap).
 *   5. Generates dist/llms.txt (a plain-text index of every study, for AI
 *      answer engines that support the emerging llms.txt convention).
 *
 * Never edit dist/ directly — everything in it is regenerated on every
 * build. To add a study, edit the STUDIES array in logos-study-app.html as
 * usual; this script picks it up automatically next build.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "logos-study-app.html");
const DIST = path.join(ROOT, "dist");
const SITE_URL = "https://audhd-bible.netlify.app"; // update here if a custom domain is added — every generated page follows this automatically

function readSource() {
  return fs.readFileSync(SRC, "utf8");
}

// Pull the STUDIES array literal out of the source file and evaluate it in
// an isolated VM context (no access to the real global scope) rather than
// hand-parsing thousands of lines of JS objects.
function extractStudies(src) {
  const startMarker = "const STUDIES = [";
  const start = src.indexOf(startMarker);
  if (start === -1) {
    throw new Error("Could not locate STUDIES array in logos-study-app.html — start marker not found.");
  }
  const arrayStart = start + "const STUDIES = ".length;
  // Find the top-level closing "];" — a line that closes the array itself, not
  // one of the many nested arrays inside each study (those close as "]}" or "],").
  const closeMatch = src.slice(arrayStart).match(/\n\];/);
  if (!closeMatch) {
    throw new Error("Could not locate closing \"];\" for STUDIES array.");
  }
  const end = arrayStart + closeMatch.index + closeMatch[0].length; // include the "];"
  let literal = src.slice(arrayStart, end).trim();
  // literal currently ends with "];" — strip trailing semicolon so it evals as an expression
  literal = literal.replace(/;\s*$/, "");
  const sandbox = {};
  vm.createContext(sandbox);
  const studies = vm.runInContext("(" + literal + ")", sandbox, { timeout: 5000 });
  if (!Array.isArray(studies) || studies.length === 0) {
    throw new Error("STUDIES array evaluated to something unexpected.");
  }
  return studies;
}

// Extracts the app's own <style>...</style> block (the whole design system —
// colors, fonts, layout, dark mode) so every generated study page can reuse
// the exact same stylesheet instead of maintaining a second copy by hand.
function extractStyleBlock(src) {
  const start = src.indexOf("<style>");
  const end = src.indexOf("</style>", start);
  if (start === -1 || end === -1) {
    throw new Error("Could not locate <style> block in logos-study-app.html");
  }
  return src.slice(start, end + "</style>".length);
}

// Extracts everything between <body> and </body> — header, the home/library/
// reader containers, and the full render/route engine script. This is
// appended verbatim after each study's static fallback content, so the page
// boots straight into the full interactive app for that study.
function extractAppBodyInner(src) {
  const start = src.indexOf("<body>");
  const end = src.lastIndexOf("</body>");
  if (start === -1 || end === -1) {
    throw new Error("Could not locate <body> in logos-study-app.html");
  }
  return src.slice(start + "<body>".length, end);
}


// ---------------------------------------------------------------------------
// Shared-asset extraction (2026-09-02).
//
// The STUDIES array is 98.7% of logos-study-app.html (3.62 MB of 3.66 MB —
// the engine, markup and CSS together are only ~49 KB). Before this change
// every generated study page inlined the whole app verbatim, so each page
// was ~3.8 MB and dist/ was ~850 MB at 227 studies: bad for Core Web Vitals,
// and slow enough to upload that per-study deploys weren't practical.
//
// Now the array is emitted ONCE as a content-hashed, immutably-cacheable
// asset at /assets/studies.<hash>.js, and every page loads it with a plain
// <script src> placed immediately before the app's own script (plain, not
// async/defer, so it always executes first). Pages drop to ~50-90 KB and
// dist/ to roughly 22 MB. The hash changes only when a study changes, so
// returning visitors re-download nothing.
//
// logos-study-app.html itself is NEVER modified — it stays a single
// self-contained file that works offline by double-clicking. This only
// affects the deploy output.
// ---------------------------------------------------------------------------

// Locate the STUDIES array literal. Returns {declStart, arrayStart, end} as
// offsets into `html`: declStart is at "const", arrayStart just after
// "const STUDIES = ", end is just past the closing "];".
function locateStudies(html, where) {
  const marker = "const STUDIES = [";
  const declStart = html.indexOf(marker);
  if (declStart === -1) {
    throw new Error("locateStudies: could not find \"const STUDIES = [\" in " + where);
  }
  const arrayStart = declStart + "const STUDIES = ".length;
  const cm = html.slice(arrayStart).match(/\n\];/);
  if (!cm) {
    throw new Error("locateStudies: could not find top-level \"];\" closing STUDIES in " + where);
  }
  return { declStart, arrayStart, end: arrayStart + cm.index + cm[0].length };
}

// The shared asset: the STUDIES literal, verbatim, assigned to a global.
function buildStudiesAsset(src) {
  const loc = locateStudies(src, "logos-study-app.html");
  const literal = src.slice(loc.arrayStart, loc.end).trim().replace(/;\s*$/, "");
  return "window.__STUDIES__=" + literal + ";\n";
}

// Replace the inline STUDIES literal with a reference to the shared asset,
// and add the <script src> that defines it just before the app's own script.
//
// The guard matters: if the asset ever fails to load, the throw stops the
// app's boot code before it hides #staticFallback, so a visitor (or crawler)
// still sees the real static study content instead of an empty library.
function leanify(html, assetPath, where) {
  const loc = locateStudies(html, where);
  const scriptOpen = html.lastIndexOf("<script", loc.declStart);
  if (scriptOpen === -1) {
    throw new Error("leanify: no opening <script> before STUDIES in " + where);
  }
  return (
    html.slice(0, scriptOpen) +
    '<script src="' + assetPath + '"></script>\n' +
    html.slice(scriptOpen, loc.declStart) +
    'const STUDIES = window.__STUDIES__;\n' +
    'if (!Array.isArray(STUDIES) || !STUDIES.length) throw new Error("studies asset failed to load");' +
    html.slice(loc.end)
  );
}

const BOOK_ORDER = ["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];

function parseRef(ref) {
  const m = (ref || "").match(/^(.*?)\s+(\d+):(\d+)/);
  if (!m) return { book: ref || "", bookIdx: 999, chapter: 0, verse: 0 };
  const book = m[1].trim();
  let bookIdx = BOOK_ORDER.indexOf(book);
  if (bookIdx === -1) bookIdx = 999;
  return { book, bookIdx, chapter: parseInt(m[2], 10), verse: parseInt(m[3], 10) };
}

// Find up to `limit` studies that share at least one theme with `s`, ranked by
// number of shared themes (most first), then by canonical Bible order. Ties
// broken deterministically by that same order. Returns [] if `s` has no themes
// or no other study shares one — the related-studies section is simply
// omitted on that page rather than showing unrelated content.
function relatedStudies(s, allStudies, limit) {
  limit = limit || 3;
  const myThemes = new Set(s.themes || []);
  if (myThemes.size === 0) return [];
  const scored = allStudies
    .filter(o => o.id !== s.id)
    .map(o => ({
      o,
      shared: (o.themes || []).filter(t => myThemes.has(t)).length,
      p: parseRef(o.reference)
    }))
    .filter(x => x.shared > 0)
    .sort((a, b) =>
      b.shared - a.shared ||
      a.p.bookIdx - b.p.bookIdx ||
      a.p.chapter - b.p.chapter ||
      a.p.verse - b.p.verse
    );
  return scored.slice(0, limit).map(x => x.o);
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Strip HTML tags for use in <meta description>, JSON-LD text fields, and llms.txt.
function stripTags(html) {
  return String(html || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

// --- Port of the app's blockHTML() renderer, for static-fallback output ---
function blockHTML(b) {
  switch (b.type) {
    case "p": return `<p>${b.html}</p>`;
    case "scripture": return `<div class="scripture"><span class="ver">${escapeHtml(b.ver)}</span>${b.html}</div>`;
    case "word": return `<div class="word"><div class="term">${b.term}</div><div class="parse">${b.parse}</div><div>${b.html}</div></div>`;
    case "callout": return `<div class="callout ${b.style || ""}">${b.label ? `<div class="clbl">${b.label}</div>` : ""}<div>${b.html}</div></div>`;
    case "list": return `<ul class="${b.style === "pick" ? "pick" : "plain"}">${b.items.map(i => `<li>${i}</li>`).join("")}</ul>`;
    case "heading": return `<h3>${b.text}</h3>`;
    case "prayer": return `<div class="prayer">${b.html}</div>`;
    default: return "";
  }
}

function studyArticleHTML(s) {
  let html = `<h1 class="title">${escapeHtml(s.title)}</h1>
    <p class="meta">${s.translations.join(" · ")}</p>
    <div class="anchor" id="anchor"><div class="lbl">⚓ The Anchor — read first, return often</div><p>${s.anchor}</p></div>`;
  s.sections.forEach(sec => {
    html += `<section class="blk" id="sec-${sec.id}"><h2><span class="num">${sec.n}</span><span>${escapeHtml(sec.title)}${sec.sub ? `<span class="sub">${escapeHtml(sec.sub)}</span>` : ""}</span></h2>`;
    sec.blocks.forEach(b => html += blockHTML(b));
    html += `</section>`;
  });
  html += `<div class="onething" id="onething"><div class="lbl">One thing to carry today</div>${s.oneThing}</div>`;
  html += `<div class="sources">${s.sources}</div>`;
  return html;
}

function relatedStudiesHTML(related) {
  if (!related.length) return "";
  const items = related.map(r => {
    const sub = truncate(stripTags(r.subtitle || ""), 90);
    return `<li><a href="/studies/${r.id}/">${escapeHtml(r.reference)}</a>${sub ? `<span class="rsub">${escapeHtml(sub)}</span>` : ""}</li>`;
  }).join("");
  return `<div class="related"><div class="lbl">Related studies</div><ul>${items}</ul></div>`;
}

// A small, self-contained stylesheet for just the #staticFallback content —
// the full app <style> block (passed in separately) already styles .scripture,
// .word, .callout, .anchor, .onething, .sources, section.blk, etc. identically;
// this only adds the handful of classes unique to the static crumbs/layout
// that aren't part of the app shell itself.
const FALLBACK_CSS = `
#staticFallback .wrap{max-width:720px}
#staticFallback .crumbs{font-size:.82rem;color:var(--soft);padding:20px 0 0}
#staticFallback .crumbs a{color:var(--soft)}
#staticFallback article{max-width:none}
#staticFallback .related{margin:40px 0 0;padding-top:20px;padding-bottom:40px;border-top:1px solid var(--line)}
#staticFallback .related .lbl{font-family:var(--font-label);font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px}
#staticFallback .related ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
#staticFallback .related li a{color:var(--accent);font-weight:600;text-decoration:none}
#staticFallback .related li a:hover{text-decoration:underline}
#staticFallback .related li .rsub{display:block;color:var(--soft);font-size:.88rem;font-weight:400;margin-top:2px}
`;

function studyPageHTML(s, styleBlock, appBodyInner, allStudies) {
  const description = truncate(stripTags(s.subtitle || s.anchor), 155);
  const canonical = `${SITE_URL}/studies/${s.id}/`;
  const keywords = (s.themes || []).join(", ");
  const related = relatedStudies(s, allStudies || []);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": s.title,
    "description": description,
    "inLanguage": "en",
    "keywords": keywords,
    "about": { "@type": "Thing", "name": s.reference },
    "isPartOf": { "@type": "WebSite", "name": "AuDHD Bible Study", "url": SITE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
    "dateModified": new Date().toISOString().slice(0, 10)
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Study Library", "item": `${SITE_URL}/library/` },
      { "@type": "ListItem", "position": 2, "name": s.reference, "item": canonical }
    ]
  };

  const staticFallback = `<div id="staticFallback"><div class="wrap">
  <p class="crumbs"><a href="/library/">Study Library</a> / ${escapeHtml(s.reference)}</p>
  <article>
    ${studyArticleHTML(s)}
  </article>
  ${relatedStudiesHTML(related)}
</div></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YZHP5M7901"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YZHP5M7901');
</script>
<title>${escapeHtml(s.title)} — AuDHD Bible Study</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:site_name" content="AuDHD Bible Study">
<meta property="og:title" content="${escapeHtml(s.title)} — AuDHD Bible Study">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escapeHtml(s.title)} — AuDHD Bible Study">
<meta name="twitter:description" content="${escapeHtml(description)}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png">
<link rel="apple-touch-icon" href="/icon-192.png">
<meta name="theme-color" content="#4a3352">
${styleBlock}
<style>${FALLBACK_CSS}</style>
</head>
<body>
${staticFallback}
${appBodyInner}
</body>
</html>`;
}

function buildSitemap(studies) {
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${SITE_URL}/library/`, changefreq: "weekly", priority: "0.9" },
    ...studies.map(s => ({ loc: `${SITE_URL}/studies/${s.id}/`, changefreq: "monthly", priority: "0.8" }))
  ];
  const today = new Date().toISOString().slice(0, 10);
  const body = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// One exact, literal 301 per study from its old flat URL (pre-2026-08-02:
// /studies/<id>.html) to its new canonical directory URL (/studies/<id>/).
// Deliberately not a wildcard/splat rule in netlify.toml — a placeholder or
// splat glued to a literal ".html" suffix in the same path segment did not
// reliably match or substitute in testing. A plain literal line per study
// has no such ambiguity and is guaranteed to match exactly what it says.
// Studies that once had their own canonical URL but have since been merged
// into, or replaced by, another study. Their pages are no longer generated,
// so without an explicit redirect the old URL 404s the moment dist/ is wiped
// and rebuilt. Key = the retired study id, value = the id that replaced it.
//   hebrews12-4-11 -> heb12-1-11: merged 2026-09-01 so that the cloud of
//   witnesses, the race and the discipline argument run as one arc.
// Never delete entries from this map — a retired URL stays retired forever,
// and old links, bookmarks and search-engine records keep pointing at it.
const RETIRED_STUDIES = {
  "hebrews12-4-11": "heb12-1-11",
};

function buildLegacyRedirects(studies) {
  const lines = studies.map(s => `/studies/${s.id}.html  /studies/${s.id}/  301`);
  // Retired ids need two lines each: the pre-2026-08-02 flat URL, which the
  // map above no longer covers because the study is gone from `studies`, and
  // the directory URL that was canonical right up until it was retired.
  Object.entries(RETIRED_STUDIES).forEach(([oldId, newId]) => {
    lines.push(`/studies/${oldId}.html  /studies/${newId}/  301`);
    lines.push(`/studies/${oldId}/  /studies/${newId}/  301`);
  });
  return lines.join("\n") + "\n";
}

function buildLlmsTxt(studies) {
  const grouped = studies
    .map(s => ({ s, p: parseRef(s.reference) }))
    .sort((a, b) => a.p.bookIdx - b.p.bookIdx || a.p.chapter - b.p.chapter || a.p.verse - b.p.verse);
  const lines = [
    "# AuDHD Bible Study",
    "",
    "> A growing collection of deep, AuDHD-aware Bible studies. Each study moves in one arc through a passage: the anchor idea, the text in NASB 1995 and ESV, context, a close reading of the Greek or Hebrew, a modest neuroplasticity bridge, an AuDHD-specific reframe, and one concrete response.",
    "",
    "All studies verify Scripture wording and original-language parsing before publishing, and flag genuine scholarly debates rather than resolving them.",
    "",
    "## Studies",
    ""
  ];
  grouped.forEach(({ s }) => {
    lines.push(`- [${s.reference} — ${stripTags(s.subtitle || "")}](${SITE_URL}/studies/${s.id}/)`);
  });
  return lines.join("\n") + "\n";
}

function main() {
  const src = readSource();
  const studies = extractStudies(src);
  const styleBlock = extractStyleBlock(src);
  const appBodyInner = extractAppBodyInner(src);

  // Shared, content-hashed STUDIES asset — see locateStudies/leanify above.
  const studiesJS = buildStudiesAsset(src);
  const studiesHash = crypto.createHash("sha256").update(studiesJS).digest("hex").slice(0, 10);
  const studiesAssetPath = "/assets/studies." + studiesHash + ".js";
  const leanSrc = leanify(src, studiesAssetPath, "dist/index.html");
  const leanAppBodyInner = leanify(appBodyInner, studiesAssetPath, "study page body");

  // Netlify's build servers keep a cache between builds (that's normally a
  // feature, not a bug — it's what makes npm installs fast). But this
  // script writes rather than replaces, so anything left in dist/ from an
  // older build (e.g. the flat studies/<id>.html pages this script used to
  // generate, before the 2026-08-02 URL rewrite) would silently persist
  // alongside the new output and get served by Netlify's "pretty URLs"
  // resolution ahead of the new directory-style pages. Wipe dist/ first so
  // every build starts from a clean slate and only ever contains exactly
  // what this run produces.
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  fs.mkdirSync(path.join(DIST, "studies"), { recursive: true });
  fs.mkdirSync(path.join(DIST, "assets"), { recursive: true });

  // 0. the shared STUDIES asset, written once and referenced by every page
  fs.writeFileSync(path.join(DIST, "assets", "studies." + studiesHash + ".js"), studiesJS);

  // 1. interactive app — identical to logos-study-app.html except that the
  //    STUDIES literal is swapped for a <script src> to the shared asset.
  fs.writeFileSync(path.join(DIST, "index.html"), leanSrc);

  // 2. one static+hybrid page per study, at its real canonical URL
  studies.forEach(s => {
    const html = studyPageHTML(s, styleBlock, leanAppBodyInner, studies);
    const dir = path.join(DIST, "studies", s.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), html);
  });

  // 3. sitemap
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), buildSitemap(studies));

  // 4. robots.txt
  fs.writeFileSync(path.join(DIST, "robots.txt"), buildRobots());

  // 5. llms.txt
  fs.writeFileSync(path.join(DIST, "llms.txt"), buildLlmsTxt(studies));

  // 6. legacy-URL redirects — one exact literal line per study, see
  // buildLegacyRedirects() for why this isn't a netlify.toml wildcard rule.
  fs.writeFileSync(path.join(DIST, "_redirects"), buildLegacyRedirects(studies));

  // 7. static/ passthrough — search-engine verification files (Google, Bing,
  // etc.), manifest/icons/service worker, or anything else that needs to be
  // served as-is from the site root. Copy verbatim, byte for byte.
  const staticDir = path.join(ROOT, "static");
  if (fs.existsSync(staticDir)) {
    fs.readdirSync(staticDir).forEach(f => {
      fs.copyFileSync(path.join(staticDir, f), path.join(DIST, f));
    });
  }

  console.log(`build-seo: wrote dist/index.html, ${studies.length} study pages at /studies/<id>/, assets/studies.${studiesHash}.js (${(Buffer.byteLength(studiesJS)/1048576).toFixed(2)} MB shared), sitemap.xml, robots.txt, llms.txt`);
}

main();
