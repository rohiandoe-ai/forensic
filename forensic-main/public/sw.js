const CACHE_NAME = 'forensic-recon-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/dashboard',
  '/login'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // Fallback to offline page or cached root if network fails
          return caches.match('/');
        });
      }
    )
  );
});
