// Offline support. Same-origin files are network-first (so edits show up), falling back to the cache offline.
// Cross-origin files (React, fonts) are cache-first. Bump CACHE_VERSION if you ever need to force a clean start.
const CACHE_VERSION = "ring-program-v2";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./main.js",
  "./storage-shim.js",
  "./vendor/htm.umd.js",
  "./program/data.js",
  "./program/reference.js",
  "./program/resolve.js",
  "./program/state.js",
  "./program/store.js",
  "./program/useProgram.js",
  "./ui/html.js",
  "./ui/App.js",
  "./ui/ring.css",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(CORE_ASSETS.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const sameOrigin = new URL(req.url).origin === self.location.origin;

  if (sameOrigin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy).catch(() => {}));
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy).catch(() => {}));
          return res;
        })
    )
  );
});
