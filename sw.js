const CACHE_NAME = 'pl-selector-v6';

const ASSETS = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'assets/icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/favicon.png',
  'assets/premier-league-logo.svg',
  'assets/premier-league-logo-white.svg',
  'assets/logos/arsenal.svg',
  'assets/logos/aston-villa.svg',
  'assets/logos/bournemouth.svg',
  'assets/logos/brentford.svg',
  'assets/logos/brighton.svg',
  'assets/logos/chelsea.svg',
  'assets/logos/crystal-palace.svg',
  'assets/logos/everton.svg',
  'assets/logos/fulham.svg',
  'assets/logos/ipswich.svg',
  'assets/logos/leicester.svg',
  'assets/logos/liverpool.svg',
  'assets/logos/man-city.svg',
  'assets/logos/man-united.svg',
  'assets/logos/newcastle.svg',
  'assets/logos/nottingham-forest.svg',
  'assets/logos/southampton.svg',
  'assets/logos/spurs.svg',
  'assets/logos/west-ham.svg',
  'assets/logos/wolves.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
          .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function () {
        return caches.match('index.html');
      });
    })
  );
});
