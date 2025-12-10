// Détermine le chemin de base pour le Service Worker, pour qu'il fonctionne
// à la fois sur localhost et sur GitHub Pages.
const basePath =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "/"
    : "/pwa_kibushi_land/";

const swPath = `${basePath}sw.js`;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swPath)
      .then((registration) => {
        console.log(
          "Service Worker enregistré avec succès ! Portée :",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("Échec de l'enregistrement du Service Worker :", error);
      });
  });
}
