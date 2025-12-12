if ("serviceWorker" in navigator) {
  const swPath =
    window.location.hostname === "fano-official.github.io"
      ? "/pwa_kibushi_land/sw.js"
      : "/sw.js";

  // --- Logique de mise à jour du Service Worker ---

  let newWorker;

  // 1. Crée le bandeau de notification mais le garde caché
  function createUpdateSnackbar() {
    const snackbar = document.createElement("div");
    snackbar.id = "update-snackbar";
    snackbar.className =
      "fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-gray-800 text-white p-4 rounded-lg shadow-lg flex justify-between items-center transform transition-transform duration-500 translate-y-24";
    snackbar.innerHTML = `
      <p class="text-sm">Une nouvelle version est disponible.</p>
      <button id="update-button" class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-md text-sm">Mettre à jour</button>
    `;
    document.body.appendChild(snackbar);

    document
      .getElementById("update-button")
      .addEventListener("click", () => {
        // 5. Envoie le message au SW pour qu'il s'active
        newWorker.postMessage({ action: "SKIP_WAITING" });
      });
    
    return snackbar;
  }

  const snackbar = createUpdateSnackbar();

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        console.log("Service Worker enregistré. Portée:", reg.scope);

        // 2. Vérifie s'il y a un nouveau SW en attente
        reg.addEventListener("updatefound", () => {
          newWorker = reg.installing;
          
          // 3. Le nouveau SW est prêt et en attente
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              // Vérifie s'il y a un SW actif
              if (navigator.serviceWorker.controller) {
                // Affiche le bandeau de mise à jour
                console.log("Nouveau contenu disponible, affichage du bandeau.");
                snackbar.classList.remove("translate-y-24");
              }
            }
          });
        });
      })
      .catch((error) => {
        console.log("Échec de l'enregistrement du Service Worker :", error);
      });
  });

  // 6. Le nouveau SW a pris le contrôle, on recharge la page
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("Nouveau Service Worker activé, rechargement de la page.");
    window.location.reload();
  });
}
