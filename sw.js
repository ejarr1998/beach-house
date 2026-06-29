const CACHE_NAME = 'hhi-beach-house-v1';
const ASSETS = [
  '/beach-house/beach-house.html',
  '/beach-house/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for Firebase, cache fallback for app shell
  if (e.request.url.includes('firebaseio.com') || e.request.url.includes('googleapis.com')) {
    return; // let Firebase handle its own requests
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
