const CACHE = 'wc-2026-v1';

const STATIC_ASSETS = [
  '/',
  '/teams/',
  '/fixtures/',
  '/results/',
  '/standings/',
  '/top-scorers/',
  '/css/main.css',
  '/js/main.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { pathname } = new URL(event.request.url);

  // Network-first for live API data — always try to get fresh scores/fixtures
  if (pathname.startsWith('/api/') || pathname.startsWith('/.netlify/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else (shell, CSS, JS, images)
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
