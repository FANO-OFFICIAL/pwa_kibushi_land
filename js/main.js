// Détermine le chemin pour le script Service Worker de manière dynamique
const swPath =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "sw.js"
    : `${window.location.pathname.replace(/\/$/, "")}sw.js`;

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
