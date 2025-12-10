const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/js/app.js",
  "/js/router.js",
  "/js/config.js",
  "/views/home-view.js",
  "/views/themes-view.js",
  "/views/phrases-view.js",
  "/views/vocabulaire-view.js",
  "/views/dialogues-view.js",
  "/views/category-view.js",
  "/components/app-header.js",
  "/components/app-footer.js",
  "/tailwind.css",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activation du Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes réseau
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isFontRequest =
    event.request.url.includes("fonts.googleapis.com") ||
    event.request.url.includes("fonts.gstatic.com");

  if (isSameOrigin && !isFontRequest) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Si la ressource est dans le cache, on la retourne
        if (response) {
          return response;
        }
        // Sinon, on effectue la requête réseau et on met en cache
        return fetch(event.request).then((response) => {
          // Mettre en cache seulement les ressources réussies
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
    );
  } else {
    // Pour les ressources externes (comme les polices), aller directement au réseau
    event.respondWith(fetch(event.request));
  }
});
