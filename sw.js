const CACHE_NAME = "kibushi-land-cache-v1";
const URLS_TO_CACHE = [
  // Pages et fichiers de configuration de base
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.png",

  // Styles
  "./tailwind.css",
  "./css/custom.css",

  // Scripts JavaScript
  "./js/app.js",
  "./js/config.js",
  "./js/main.js",
  "./js/router.js",
  "./components/app-footer.js",
  "./components/app-header.js",
  "./views/category-view.js",
  "./views/dialogues-view.js",
  "./views/home-view.js",
  "./views/parametres-view.js",
  "./views/phrases-view.js",
  "./views/themes-view.js",
  "./views/vocabulaire-view.js",

  // Icônes pour la PWA
  "./images/icons/icon-72x72.png",
  "./images/icons/icon-96x96.png",
  "./images/icons/icon-128x128.png",
  "./images/icons/icon-144x144.png",
  "./images/icons/icon-152x152.png",
  "./images/icons/icon-192x192.png",
  "./images/icons/icon-384x384.png",
  "./images/icons/icon-512x512.png",

  // Images par défaut
  "./assets/images/illustration_default.jpg",
  "./assets/images/illustration_default_9_16.jpg",
];

// Étape d'installation : mise en cache des ressources de l'application
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log("Service Worker : Mise en cache des fichiers");
        await cache.addAll(URLS_TO_CACHE);
      } catch (error) {
        console.error(
          "Échec de la mise en cache lors de l'installation :",
          error
        );
        // Permet l'installation même si la mise en cache échoue partiellement
      }
    })()
  );
});

// Étape d'activation : nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(
              "Service Worker : Suppression de l'ancien cache",
              cacheName
            );
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Étape de fetch : servir les ressources depuis le cache ou le réseau
self.addEventListener("fetch", (event) => {
  // Stratégie "Cache First" pour toutes les requêtes
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Si la réponse est dans le cache, on la retourne
        if (response) {
          return response;
        }

        // Sinon, on va sur le réseau
        return fetch(event.request).then((networkResponse) => {
          // On ne met en cache que les requêtes valides
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // On clone la réponse pour la mettre en cache et la retourner au navigateur
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
      .catch((error) => {
        console.error("Service Worker : Erreur lors du fetch", error);
        // Potentiellement retourner une page de fallback hors-ligne ici
      })
  );
});
