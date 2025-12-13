if ("serviceWorker" in navigator) {
  const swPath =
    window.location.hostname === "fano-official.github.io"
      ? "/pwa_kibushi_land/sw.js"
      : "/sw.js";

  // --- Logique de mise à jour du Service Worker ---
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${swPath}?v=${new Date().getTime()}`)
      .then((reg) => {
        console.log("Service Worker enregistré. Portée:", reg.scope);

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              // Vérifie s'il y a un SW actif
              if (navigator.serviceWorker.controller) {
                // Stocke le flag et émet un événement pour notification persistante
                localStorage.setItem("updatePending", "true");
                console.log(
                  "Nouveau contenu disponible, émission de l'événement 'updateAvailable'."
                );
                const event = new CustomEvent("updateAvailable", {
                  detail: { newWorker },
                });
                window.dispatchEvent(event);
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log("Échec de l'enregistrement du Service Worker :", error);
      });
  });

  // Le nouveau SW a pris le contrôle, on recharge la page
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("Nouveau Service Worker activé, rechargement de la page.");
    localStorage.removeItem("updatePending");
    window.location.reload();
  });
}
