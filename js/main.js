if ("serviceWorker" in navigator) {
  // Pour GitHub Pages, le chemin doit être absolu depuis la racine du domaine.
  // Pour le développement local, un chemin relatif à la racine suffit.
  const swPath =
    window.location.hostname === "fano-official.github.io"
      ? "/pwa_kibushi_land/sw.js"
      : "/sw.js";

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
