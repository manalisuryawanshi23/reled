// RELED - Service Worker v1.0
const CACHE_NAME = 'reled-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if individual assets can't be cached
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: Network-first for API, Cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin requests
  if (event.request.method !== 'GET') return;

  // Network-first for API calls
  if (url.pathname.startsWith('/api/') || url.port === '5000') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'You are offline' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // Cache-first for static assets (images, JS, CSS)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|webp|woff2?)$/) ||
    url.hostname !== self.location.hostname
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return response;
        }).catch(() => cached || new Response('', { status: 408 }));
      })
    );
    return;
  }

  // Network-first for HTML pages (SPA navigation)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match('/index.html').then((cached) => cached || fetch('/index.html'))
      )
  );
});
