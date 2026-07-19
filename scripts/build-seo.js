#!/usr/bin/env node
/*
 * build-seo.js
 * ------------
 * Netlify build step for the Logos study app.
 *
 * What it does:
 *   1. Copies logos-study-app.html -> dist/index.html (unchanged, verbatim —
 *      the interactive app is never rebuilt or altered by this script).
 *   2. Reads the STUDIES array out of logos-study-app.html and generates a
 *      real, static, crawlable HTML page per study at dist/studies/<id>.html
 *      — full scripture text and commentary in plain HTML, no JS required to
 *      see it. Search engines and AI/answer-engine crawlers that don't run
 *      JavaScript can read these directly. Each page links back to the
 *      library and deep-links into the interactive app.
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

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "logos-study-app.html");
const DIST = path.join(ROOT, "dist");
const SITE_URL = "https://audhd-bible.netlify.app"; // update here if a custom domain is added — every generated page follows this automatically

function readSource() {
  return fs.readFileSync(SRC, "utf8");
}

// Pull the STUDIES array literal out of the source file and evaluate it in
// an isolated VM context (no access to the real global scope) rather than
// hand-parsing 4000 lines of JS objects.
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

// Reuse the exact embedded base64 @font-face block from the source app so
// static pages match the app's look with zero CDN dependency.
function extractFontStyleBlock(src) {
  const m = src.match(/<style id="fonts">[\s\S]*?<\/style>/);
  if (!m) throw new Error("Could not find <style id=\"fonts\"> block in logos-study-app.html.");
  return m[0];
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

// --- Port of the app's blockHTML() renderer, for static-page output ---
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

const PAGE_CSS = `
:root{
  --bg:#e6dabf; --panel:#efe4cf; --ink:#2a2620; --soft:#6a5f45; --line:#d2c09c;
  --accent:#6b7233; --accent-soft:#e7e5cc; --scripture:#332f24;
  --shadow:0 1px 3px rgba(60,50,20,.10),0 8px 24px rgba(60,50,20,.07);
  --measure:66ch; --fs:18px; --radius:14px;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:'Newsreader',Georgia,'Times New Roman',serif;
  font-size:var(--fs);line-height:1.65;-webkit-font-smoothing:antialiased}
.wrap{max-width:720px;margin:0 auto;padding:0 20px 70px}
header.top{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--bg) 88%,transparent);
  backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.top-inner{max-width:720px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.brand{font-weight:700;letter-spacing:.02em;font-size:1.05rem;text-decoration:none;color:var(--ink);display:flex;align-items:center;gap:9px}
.brand .mark{width:26px;height:26px;border-radius:7px;background:var(--accent);color:#fff;display:grid;place-items:center;font-size:.8rem;font-weight:800}
.top-spacer{flex:1}
.applink{background:var(--accent);color:#fff;text-decoration:none;padding:8px 14px;border-radius:20px;font-size:.85rem;font-weight:600}
.applink:hover{opacity:.9}
.crumbs{font-size:.82rem;color:var(--soft);padding:16px 0 0}
.crumbs a{color:var(--soft)}
h1.title{font-size:1.9rem;margin:10px 0 4px}
p.meta{color:var(--soft);margin:0 0 18px;font-family:'Courier New',monospace;font-size:.85rem;letter-spacing:.02em}
.anchor{background:var(--accent-soft);border:1px solid var(--line);border-radius:var(--radius);padding:16px 18px;margin:18px 0 30px}
.anchor .lbl{font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:6px}
section.blk{margin:30px 0}
section.blk h2{font-size:1.2rem;display:flex;gap:10px;align-items:baseline;border-bottom:1px solid var(--line);padding-bottom:8px}
section.blk h2 .num{color:var(--accent);font-weight:700}
section.blk h2 .sub{display:block;font-size:.82rem;color:var(--soft);font-weight:400;margin-top:2px}
.scripture{background:var(--panel);border-left:3px solid var(--accent);border-radius:0 var(--radius) var(--radius) 0;padding:14px 18px;margin:14px 0;color:var(--scripture)}
.scripture .ver{display:block;font-family:'Courier New',monospace;font-size:.75rem;letter-spacing:.08em;color:var(--accent);margin-bottom:6px;text-transform:uppercase}
.word{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:14px 18px;margin:14px 0}
.word .term{font-weight:700;margin-bottom:2px}
.word .parse{font-family:'Courier New',monospace;font-size:.78rem;color:var(--soft);margin-bottom:8px}
.callout{border:1px solid var(--line);border-radius:var(--radius);padding:14px 18px;margin:14px 0;background:var(--panel)}
.callout.caution{border-color:#b8863a;background:#f3e6cf}
.callout .clbl{font-weight:700;font-size:.85rem;margin-bottom:6px;color:var(--accent)}
.callout.caution .clbl{color:#8a5a1e}
ul.pick li,ul.plain li{margin:8px 0}
.prayer{font-style:italic;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:16px 18px;margin:14px 0}
.onething{background:var(--accent);color:#fff;border-radius:var(--radius);padding:18px 20px;margin:30px 0}
.onething .lbl{font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;opacity:.85;margin-bottom:6px;font-weight:700}
.sources{font-size:.82rem;color:var(--soft);border-top:1px solid var(--line);margin-top:30px;padding-top:14px}
footer.pagefoot{max-width:720px;margin:40px auto 0;padding:20px;font-size:.82rem;color:var(--soft);border-top:1px solid var(--line)}
footer.pagefoot a{color:var(--accent)}
.related{margin:40px 0 0;padding-top:20px;border-top:1px solid var(--line)}
.related .lbl{font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px}
.related ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px}
.related li a{color:var(--accent);font-weight:600;text-decoration:none}
.related li a:hover{text-decoration:underline}
.related li .rsub{display:block;color:var(--soft);font-size:.88rem;font-weight:400;margin-top:2px}
`;

function relatedStudiesHTML(related) {
  if (!related.length) return "";
  const items = related.map(r => {
    const sub = truncate(stripTags(r.subtitle || ""), 90);
    return `<li><a href="/studies/${r.id}.html">${escapeHtml(r.reference)}</a>${sub ? `<span class="rsub">${escapeHtml(sub)}</span>` : ""}</li>`;
  }).join("");
  return `<div class="related"><div class="lbl">Related studies</div><ul>${items}</ul></div>`;
}

function studyPageHTML(s, fontStyleBlock, allStudies) {
  const description = truncate(stripTags(s.subtitle || s.anchor), 155);
  const canonical = `${SITE_URL}/studies/${s.id}.html`;
  const appLink = `${SITE_URL}/#s=${s.id}`;
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
    "isPartOf": { "@type": "WebSite", "name": "Logos Studies", "url": SITE_URL },
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonical },
    "dateModified": new Date().toISOString().slice(0, 10)
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Study Library", "item": `${SITE_URL}/` },
      { "@type": "ListItem", "position": 2, "name": s.reference, "item": canonical }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(s.title)} — Logos Studies (AuDHD-Aware Bible Study)</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Logos Studies">
<meta property="og:title" content="${escapeHtml(s.title)} — Logos Studies">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escapeHtml(s.title)} — Logos Studies">
<meta name="twitter:description" content="${escapeHtml(description)}">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
<style>${PAGE_CSS}</style>
${fontStyleBlock}
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="/"><span class="mark">λ</span> Logos Studies</a>
    <div class="top-spacer"></div>
    <a class="applink" href="${appLink}">Open in the study app →</a>
  </div>
</header>
<div class="wrap">
  <p class="crumbs"><a href="/">Study Library</a> / ${escapeHtml(s.reference)}</p>
  <article>
    ${studyArticleHTML(s)}
  </article>
  ${relatedStudiesHTML(related)}
</div>
<footer class="pagefoot">
  Part of <a href="/">Logos Studies</a> — a growing collection of AuDHD-aware Bible studies.
</footer>
</body>
</html>`;
}

function buildSitemap(studies) {
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    ...studies.map(s => ({ loc: `${SITE_URL}/studies/${s.id}.html`, changefreq: "monthly", priority: "0.8" }))
  ];
  const today = new Date().toISOString().slice(0, 10);
  const body = urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function buildLlmsTxt(studies) {
  const grouped = studies
    .map(s => ({ s, p: parseRef(s.reference) }))
    .sort((a, b) => a.p.bookIdx - b.p.bookIdx || a.p.chapter - b.p.chapter || a.p.verse - b.p.verse);
  const lines = [
    "# Logos Studies",
    "",
    "> A growing collection of deep, AuDHD-aware Bible studies. Each study moves in one arc through a passage: the anchor idea, the text in NASB 1995 and ESV, context, a close reading of the Greek or Hebrew, a modest neuroplasticity bridge, an AuDHD-specific reframe, and one concrete response.",
    "",
    "All studies verify Scripture wording and original-language parsing before publishing, and flag genuine scholarly debates rather than resolving them.",
    "",
    "## Studies",
    ""
  ];
  grouped.forEach(({ s }) => {
    lines.push(`- [${s.reference} — ${stripTags(s.subtitle || "")}](${SITE_URL}/studies/${s.id}.html)`);
  });
  return lines.join("\n") + "\n";
}

function main() {
  const src = readSource();
  const studies = extractStudies(src);
  const fontStyleBlock = extractFontStyleBlock(src);

  fs.mkdirSync(DIST, { recursive: true });
  fs.mkdirSync(path.join(DIST, "studies"), { recursive: true });

  // 1. interactive app, verbatim
  fs.writeFileSync(path.join(DIST, "index.html"), src);

  // 2. one static page per study
  studies.forEach(s => {
    const html = studyPageHTML(s, fontStyleBlock, studies);
    fs.writeFileSync(path.join(DIST, "studies", `${s.id}.html`), html);
  });

  // 3. sitemap
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), buildSitemap(studies));

  // 4. robots.txt
  fs.writeFileSync(path.join(DIST, "robots.txt"), buildRobots());

  // 5. llms.txt
  fs.writeFileSync(path.join(DIST, "llms.txt"), buildLlmsTxt(studies));

  // 6. static/ passthrough — search-engine verification files (Google, Bing,
  // etc.), favicons, or anything else that needs to be served as-is from the
  // site root. Copy verbatim, byte for byte, so verification tokens survive
  // every deploy without needing to be re-added.
  const staticDir = path.join(ROOT, "static");
  if (fs.existsSync(staticDir)) {
    fs.readdirSync(staticDir).forEach(f => {
      fs.copyFileSync(path.join(staticDir, f), path.join(DIST, f));
    });
  }

  console.log(`build-seo: wrote dist/index.html, ${studies.length} study pages, sitemap.xml, robots.txt, llms.txt`);
}

main();
