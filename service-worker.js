importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox ? console.log(`Workbox berhasil dimuat`) : console.log(`Workbox gagal dimuat`);

const CACHE_NAME = "football1";
const BASE_URL = "https://api.football-data.org/v2/";
var urlsToCache = [
    { url: "/", revision: '1' },
    { url: "/anggastudio_logo.png", revision: '1' },
    { url: "/asicon-144.png", revision: '1' },
    { url: "/asicon-512.png", revision: '1' },
    { url: "/favicon.ico", revision: '1' },
    { url: "/nav.html", revision: '1' },
    { url: "/index.html", revision: '1' },
    { url: "/team-detail.html", revision: '1' },
    { url: "/assets/anggapratama.jpeg", revision: '1' },
    { url: "/assets/ball.jpg", revision: '1' },
    { url: "/assets/guessnumber-icon.webp", revision: '1' },
    { url: "/assets/potatone-icon.webp", revision: '1' },
    { url: "/assets/spaceshipracer-icon.webp", revision: '1' },
    { url: "/assets/favorite-icon.png", revision: '1' },
    { url: "/assets/unfavorite-icon.png", revision: '1' },
    { url: "/pages/home.html", revision: '1' },
    { url: "/pages/about.html", revision: '1' },
    { url: "/pages/gallery.html", revision: '1' },
    { url: "/pages/contact.html", revision: '1' },
    { url: "/pages/favorites.html", revision: '1' },
    { url: "/css/materialize.min.css", revision: '1' },
    { url: "/css/style.css", revision: '1' },
    { url: "/js/materialize.min.js", revision: '1' },
    { url: "/js/nav.js", revision: '1' },
    { url: "/js/api.js", revision: '1' },
    { url: "/js/database.js", revision: '1' },
    { url: "/manifest.json", revision: '1' }
];

workbox.precaching.precacheAndRoute(urlsToCache);

workbox.routing.registerRoute(
    new RegExp('/pages/'),
      workbox.strategies.staleWhileRevalidate({
          cacheName: 'pages'
      })
  );

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
            }),
        ],
    }),
);

workbox.routing.registerRoute(
    /^https:\/\/api\.football-data\.org\/v2\//,
    workbox.strategies.cacheFirst({
      cacheName: 'api_football',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 60 * 60 * 24 * 2,
          maxEntries: 30,
        }),
      ],
    })
  );

  // https://unpkg.com/dexie@latest/dist/dexie.js
  workbox.routing.registerRoute(
    /^https:\/\/.unpkg\.com\/dexie@latest\/dist\/dexie\.js/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

// self.addEventListener("install", function (event) {
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(function (cache) {
//                 return cache.addAll(urlsToCache);
//             }).then(cache => {
//                 console.log("cache --> ", cache);
//             }).catch(error => {
//                 console.log("error cache --> ", error);
//             })
//     );
// });

// self.addEventListener("fetch", function (event) {
//     if (event.request.url.indexOf(BASE_URL) > -1) {
//         event.respondWith(
//             caches.open(CACHE_NAME)
//                 .then(async function (cache) {
//                     return fetch(event.request)
//                         .then(function (response) {
//                             cache.put(event.request.url, response.clone());
//                             return response;
//                         }).catch(error => {
//                             console.log("fetch error ", error);
//                         });
//                 }).catch(error => {
//                     console.log("open error ", error);
//                 })
//         );
//     } else {
//         event.respondWith(
//             caches.match(event.request, { ignoreSearch: true })
//                 .then(function (response) {
//                     return response || fetch(event.request);
//                 }).catch(error => {
//                     console.log("open error ", error);
//                 })
//         )
//     }
// });

// self.addEventListener("activate", function (event) {
//     event.waitUntil(
//         caches.keys().then(function (cacheNames) {
//             return Promise.all(
//                 cacheNames.map(function (cacheName) {
//                     if (cacheName != CACHE_NAME) {
//                         console.log("ServiceWorker: cache " + cacheName + " dihapus");
//                         return caches.delete(cacheName);
//                     }
//                 })
//             );
//         })
//     );
// });

self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'asicon-144.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('anggastudio Push Notification', options)
    );
});