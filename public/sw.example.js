/* eslint-disable no-restricted-globals */
/**
 * service-worker.js (boilerplate)
 * ------------------------------------------------------------
 * Recommended setup for a custom Service Worker.
 *
 * ✅ Handles: install, activate, fetch, message
 * ✅ Adds: cache versioning, stale-while-revalidate, offline fallback
 * ✅ Adds: basic error detection + logging hooks
 *
 * Notes:
 * - If you’re using Angular’s `@angular/service-worker` (ngsw), you typically
 *   *do not* use a custom SW like this (you’d configure ngsw instead).
 * - If you use this custom SW, register it with `navigator.serviceWorker.register(...)`
 *   (and do not enable Angular ngsw at the same time).
 */

/* ----------------------------- Patches / libs -----------------------------
 * Recommended: Workbox (optional)
 * - If you want a “best practice” SW quickly, Workbox is the standard:
 *   https://developer.chrome.com/docs/workbox/
 *
 * You can either:
 * 1) Bundle Workbox with your build tool, or
 * 2) Use importScripts() to load from a CDN (simpler, but depends on network).
 *
 * Example (CDN) - uncomment if you want it:
 * self.importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.6.0/workbox-sw.js');
 * if (self.workbox) { ... } else { ...fallback... }
 *
 * This template works without Workbox.
 * ------------------------------------------------------------------------ */

const SW_VERSION = "v1.0.0"; // bump this to force new cache + activation
const CACHE_PREFIX = "myapp";
const STATIC_CACHE = `${CACHE_PREFIX}-static-${SW_VERSION}`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-${SW_VERSION}`;

// App shell / critical assets to precache.
// Keep this SMALL. Add only what you truly need to boot offline.
const PRECACHE_URLS = [
  "/", // if your server returns index.html here
  "/index.html",
  "/offline.html",
  "/favicon.ico",
  // "/assets/logo.svg",
  // "/styles.css",
  // "/main.js",
];

// Optional: offline fallback for navigation requests
const OFFLINE_FALLBACK_URL = "/offline.html";

// Optional: control cache limits for runtime caching
const RUNTIME_MAX_ENTRIES = 80;
const RUNTIME_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/* -------------------------------- Utilities ------------------------------ */

function log(...args) {
  // Keep logs minimal in production if desired
  console.log("[SW]", ...args);
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isSameOrigin(url) {
  return new URL(url).origin === self.location.origin;
}

async function cleanupOldCaches() {
  const keys = await caches.keys();
  const allowlist = new Set([STATIC_CACHE, RUNTIME_CACHE]);
  await Promise.all(
    keys.map((key) => {
      if (key.startsWith(CACHE_PREFIX) && !allowlist.has(key)) {
        log("Deleting old cache:", key);
        return caches.delete(key);
      }
      return null;
    })
  );
}

/**
 * Simple runtime cache trimming (best-effort).
 * Deletes oldest entries if cache grows too large, and removes too-old entries.
 */
async function trimRuntimeCache() {
  const cache = await caches.open(RUNTIME_CACHE);
  const requests = await cache.keys();

  // Age-based cleanup (best effort)
  const now = Date.now();
  await Promise.all(
    requests.map(async (req) => {
      const res = await cache.match(req);
      if (!res) return;

      const dateHeader = res.headers.get("date");
      if (!dateHeader) return;

      const age = now - new Date(dateHeader).getTime();
      if (age > RUNTIME_MAX_AGE_MS) {
        await cache.delete(req);
      }
    })
  );

  // Size-based cleanup (rough LRU by insertion order)
  const updatedRequests = await cache.keys();
  if (updatedRequests.length > RUNTIME_MAX_ENTRIES) {
    const overflow = updatedRequests.length - RUNTIME_MAX_ENTRIES;
    const toDelete = updatedRequests.slice(0, overflow);
    await Promise.all(toDelete.map((req) => cache.delete(req)));
  }
}

/* ------------------------------- Error hooks ------------------------------ */
/**
 * These won’t catch everything (SW can be terminated), but they help during dev.
 */
self.addEventListener("error", (event) => {
  // event.error may be undefined in some browsers
  log("Error event:", event.message || event, event.error || "");
});

self.addEventListener("unhandledrejection", (event) => {
  log("Unhandled rejection:", event.reason || event);
});

/* --------------------------------- Install -------------------------------- */
self.addEventListener("install", (event) => {
  log("Install");

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(PRECACHE_URLS);

        // Recommended: activate new SW ASAP (optional).
        // If you prefer to wait until all tabs are closed, remove this.
        await self.skipWaiting();
      } catch (err) {
        log("Install failed:", err);
        // If precache fails, SW still installs; your app may not work offline.
      }
    })()
  );
});

/* -------------------------------- Activate -------------------------------- */
self.addEventListener("activate", (event) => {
  log("Activate");

  event.waitUntil(
    (async () => {
      try {
        await cleanupOldCaches();

        // Recommended: take control of open clients immediately.
        await self.clients.claim();
      } catch (err) {
        log("Activate failed:", err);
      }
    })()
  );
});

/* ---------------------------------- Fetch --------------------------------- */
/**
 * Recommended strategy:
 * - Navigations (HTML): network-first, fallback to offline page
 * - Static same-origin assets: cache-first
 * - API GET requests: stale-while-revalidate (or network-first)
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET (don’t mess with POST/PUT/PATCH/DELETE by default)
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 1) Navigation requests: network-first, fallback to offline page
  if (isNavigationRequest(request)) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          // Optionally cache the latest HTML for faster future loads:
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, networkResponse.clone()).catch(() => {});
          return networkResponse;
        } catch {
          // Offline fallback: try cache first, then offline page
          const cached = await caches.match(request);
          if (cached) return cached;

          const offline = await caches.match(OFFLINE_FALLBACK_URL);
          return (
            offline ||
            new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            })
          );
        }
      })()
    );
    return;
  }

  // 2) Same-origin static assets: cache-first
  // Adjust this if you want to include fonts/images from CDNs.
  if (isSameOrigin(request.url)) {
    // Heuristic: treat common static file types as cache-first.
    const isStaticAsset =
      /\.(?:js|css|png|jpg|jpeg|webp|gif|svg|ico|woff2?)$/i.test(url.pathname);

    if (isStaticAsset) {
      event.respondWith(
        (async () => {
          const cached = await caches.match(request);
          if (cached) return cached;

          try {
            const res = await fetch(request);
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, res.clone()).catch(() => {});
            trimRuntimeCache().catch(() => {});
            return res;
          } catch (err) {
            log("Static fetch failed:", request.url, err);
            // Optionally return a placeholder image here for image requests.
            throw err;
          }
        })()
      );
      return;
    }
  }

  // 3) Default: stale-while-revalidate (good for many GETs like JSON)
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);

      const networkPromise = fetch(request)
        .then((res) => {
          // Only cache successful responses
          if (res && res.ok) {
            cache.put(request, res.clone()).catch(() => {});
            trimRuntimeCache().catch(() => {});
          }
          return res;
        })
        .catch((err) => {
          // If network fails, we’ll fall back to cache if available
          log("Network failed:", request.url, err);
          return null;
        });

      // If cached exists, serve it immediately, update in background
      if (cached) return cached;

      // Otherwise wait for network
      const networkRes = await networkPromise;
      if (networkRes) return networkRes;

      // Last resort: nothing available
      return new Response("Network error", {
        status: 502,
        headers: { "Content-Type": "text/plain" },
      });
    })()
  );
});

/* -------------------------------- Messages -------------------------------- */
/**
 * Useful commands you can send from the app:
 * - SKIP_WAITING: activate updated SW immediately
 * - CLEAR_CACHES: wipe all caches (debug / support)
 */
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === "SKIP_WAITING") {
    log("Message: SKIP_WAITING");
    self.skipWaiting();
    return;
  }

  if (data.type === "CLEAR_CACHES") {
    log("Message: CLEAR_CACHES");
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      })()
    );
    return;
  }
});

/* -------------------------- Optional: Push/Sync --------------------------- */
/**
 * Push notifications (requires server + push subscription):
 *
 * self.addEventListener('push', (event) => {
 *   const payload = event.data?.json?.() ?? { title: 'New message', body: '...' };
 *   event.waitUntil(
 *     self.registration.showNotification(payload.title, {
 *       body: payload.body,
 *       icon: '/assets/icons/icon-192.png',
 *       badge: '/assets/icons/icon-192.png',
 *       data: payload.data
 *     })
 *   );
 * });
 *
 * self.addEventListener('notificationclick', (event) => {
 *   event.notification.close();
 *   event.waitUntil(self.clients.openWindow('/'));
 * });
 *
 * Background sync (limited support on iOS):
 * self.addEventListener('sync', (event) => {
 *   if (event.tag === 'sync-outbox') {
 *     event.waitUntil(syncQueuedRequests());
 *   }
 * });
 */
