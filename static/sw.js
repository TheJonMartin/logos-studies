/* AuDHD Bible Study — service worker
 * ------------------------------------
 * Conservative on purpose: this site adds new studies often, so staleness
 * is a real risk. Strategy:
 *   - HTML/navigation requests: network-first, falling back to the last
 *     cached copy only when offline. Online users always get the current
 *     library; offline users get whatever they last visited.
 *   - Everything else (icons, manifest, study JSON/HTML if ever added):
 *     cache-first, since those rarely change.
 *
 * Bump CACHE_NAME any time you want to force every client to drop its old
 * cache on next visit (e.g. after a visual overhaul).
 */
const CACHE_NAME = "audhd-bible-v1";
const PRECACHE = ["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isNavigation = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((res) => res || caches.match("/")))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      });
    })
  );
});
