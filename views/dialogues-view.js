import { LANGUAGES } from "../js/config.js";

// --- Helper Functions ---

function getMasteredDialogues(lang, theme) {
  const stored = localStorage.getItem(`masteredDialogues_${lang}_${theme}`);
  return stored ? JSON.parse(stored) : {};
}

function saveMasteredDialogue(idx, isMastered, lang, theme) {
  const mastered = getMasteredDialogues(lang, theme);
  mastered[idx] = isMastered;
  localStorage.setItem(
    `masteredDialogues_${lang}_${theme}`,
    JSON.stringify(mastered)
  );
}

window.isMasteredDialogue = function (idx) {
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const currentLang = hashParams.get("lang") || "sakalava";
  const currentTheme =
    hashParams.get("theme") || "01-salutations_presentations";
  return getMasteredDialogues(currentLang, currentTheme)[idx] || false;
};

window.setMasteredDialogue = function (idx, value) {
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const currentLang = hashParams.get("lang") || "sakalava";
  const currentTheme =
    hashParams.get("theme") || "01-salutations_presentations";
  saveMasteredDialogue(idx, value, currentLang, currentTheme);
};

function getTextForLang(line, lang) {
  if (lang === "native") return line[window.nativeKey] || "";
  if (lang === "francais") return line.francais || "";
  if (lang === "anglais") return line.anglais || "";
  return line[window.nativeKey] || "";
}

function updateAudioSection(card, dialogue, selectedLang) {
  // Ensure the card has the current lang
  card.dataset.currentLang = selectedLang;

  const section = card.querySelector(".audio-section");
  const audioPath =
    selectedLang === "native"
      ? ""
      : dialogue.audio?.[selectedLang === "anglais" ? "anglais" : "francais"] ||
        "";
  const dialogueIndex = Array.from(card.parentElement.children).indexOf(card);

  if (audioPath) {
    section.innerHTML = `
      <div class="flex flex-col gap-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-4 overflow-hidden">
          <div class="flex items-center justify-center size-12 rounded-lg bg-primary/20 text-primary">
            <span class="material-symbols-outlined text-2xl">graphic_eq</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-base font-bold leading-tight truncate text-gray-900 dark:text-white">Dialogue Audio</p>
            <p class="text-xs font-normal leading-normal truncate text-gray-500 dark:text-gray-400">Appuyez pour jouer</p>
          </div>
          <button class="flex items-center justify-center rounded-full size-10 bg-primary text-white hover:bg-primary/90 transition-colors" onclick="playDialogueAudio(this, ${dialogueIndex})" data-audio="${audioPath}" data-audio-playing="false">
            <span class="material-symbols-outlined text-2xl">play_arrow</span>
          </button>
        </div>
      </div>
    `;
  } else {
    section.innerHTML = `
      <div class="flex items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">
        <p class="text-sm">Audio non disponible</p>
      </div>
    `;
  }
}

window.initDialogueLanguageSelectors = function () {
  document
    .querySelectorAll("input[type='radio'][name*='dialogue']")
    .forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const dialogueCard = e.target.closest(".dialogue-card");
        const selectedLang = e.target.value;

        // Arrêter l'audio en cours si une instance existe
        const audioButton = dialogueCard.querySelector(".audio-section button");
        if (audioButton && audioButton.audioInstance) {
          audioButton.audioInstance.pause();
          resetAudioButton(audioButton);
        }

        const content = dialogueCard.querySelector(".dialogue-content");

        const dialogueIndex = Array.from(
          dialogueCard.parentElement.children
        ).indexOf(dialogueCard);
        const dialogue = currentData[dialogueIndex];
        if (dialogue) {
          const conversationHTML = dialogue.conversation
            .map((line) => {
              const name = line.personnage || "";
              const text = getTextForLang(line, selectedLang);
              return `<strong>${name}:</strong> ${text}<br />`;
            })
            .join("");
          content.innerHTML = conversationHTML;
          updateAudioSection(dialogueCard, dialogue, selectedLang);
        }
      });
    });
};

window.initMasteredButtonsDialogue = function () {
  document.querySelectorAll(".mastered-btn").forEach((btn) => {
    const idx = btn.dataset.idx;
    const icon = btn.querySelector(".material-symbols-outlined");
    const text = btn.querySelector("span:last-child");
    const update = (state) => {
      btn.className = `mastered-btn flex items-center justify-center gap-2 rounded-lg ${
        state
          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-green-200 dark:hover:bg-green-900/30"
      } h-10 text-sm font-medium transition-colors`;
      icon.classList.toggle("fill", state);
      text.textContent = state ? "Maîtrisé" : "Marquer comme maîtrisé";
    };
    update(window.isMasteredDialogue(idx));
    btn.addEventListener("click", () => {
      const next = !window.isMasteredDialogue(idx);
      window.setMasteredDialogue(idx, next);
      update(next);
    });
  });
};

function playAudioFile(audioPath, button) {
  // If no audio instance, create one
  if (!button.audioInstance) {
    const audio = new Audio(audioPath);
    button.audioInstance = audio;

    audio.addEventListener("ended", () => resetAudioButton(button));
    audio.addEventListener("error", () => {
      console.error("Erreur lors de la lecture audio:", error);
      resetAudioButton(button);
    });
  }

  const icon = button.querySelector(".material-symbols-outlined");
  const audio = button.audioInstance;

  if (audio.paused) {
    // Play
    audio
      .play()
      .then(() => {
        button.dataset.audioPlaying = "true";
        icon.classList.add("fill");
        button.classList.add("animate-pulse");
        icon.textContent = "pause"; // Icon pause
      })
      .catch((error) => {
        console.error("Erreur lors de la lecture audio:", error);
        resetAudioButton(button);
      });
  } else {
    // Pause
    audio.pause();
    button.dataset.audioPlaying = "false";
    icon.classList.remove("fill");
    button.classList.remove("animate-pulse");
    icon.textContent = "play_arrow"; // Icon play
  }
}

function resetAudioButton(button) {
  const icon = button.querySelector(".material-symbols-outlined");
  icon.classList.remove("fill");
  button.classList.remove("animate-pulse");
  // Reset to play icon
  icon.textContent = "play_arrow";
  if (button.audioInstance) {
    // In case, stop audio
    button.audioInstance.pause();
  }
  button.dataset.audioPlaying = "false";
}

window.playDialogueAudio = function (button, idx) {
  const dialogue = currentData[idx];
  if (!dialogue) return;

  const card = button.closest(".dialogue-card");
  const currentLang = card.dataset.currentLang;

  let audioUrl = "";
  if (currentLang === "native") {
    // For native, play francais if available, else anglais
    audioUrl = card.dataset.audioFrancais || card.dataset.audioAnglais;
  } else if (currentLang === "francais") {
    audioUrl = card.dataset.audioFrancais || card.dataset.audioAnglais; // fallback to en if no fr
  } else if (currentLang === "anglais") {
    audioUrl = card.dataset.audioAnglais || card.dataset.audioFrancais; // fallback to fr if no en
  }

  if (audioUrl) {
    playAudioFile(audioUrl, button);
  }
};

let currentData = null;

// --- View Component ---

export default {
  title: "Dialogues", // Titre statique, le titre du thème sera géré par le router
  render: async (params) => {
    const currentLang = params.lang || "sakalava";
    const currentTheme = params.theme || "01-salutations_presentations";
    let langInfo = LANGUAGES[currentLang];

    // Try to load real title from JSON
    let themeTitle = "Dialogues";
    try {
      const response = await fetch(`data/${currentLang}/${currentTheme}.json`);
      if (response.ok) {
        const data = await response.json();
        if (data.titre) {
          themeTitle = data.titre;
        }
      }
    } catch (e) {
      console.warn("Could not load theme title");
    }

    return `
      <div class="flex flex-col min-h-screen">
        <!-- Dialogues List -->
        <div id="dialogue-list" class="flex-1 p-4 pb-20 flex flex-col gap-4">
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    `;
  },
  afterRender: async (params) => {
    const currentLang = params.lang || "sakalava";
    window.nativeKey = currentLang;
    const currentTheme = params.theme || "01-salutations_presentations";
    const list = document.getElementById("dialogue-list");

    try {
      const DATA_URL = `data/${currentLang}/${currentTheme}.json`;
      const res = await fetch(DATA_URL);
      if (!res.ok)
        throw new Error("Impossible de charger les données dialogues");
      const data = await res.json();
      currentData = data.dialogues || [];

      const langInfo = LANGUAGES[currentLang];

      list.innerHTML = currentData
        .map((item, idx) => {
          const title = item.titre || `Dialogue ${idx + 1}`;
          const audioPath =
            item.audio?.[currentLang === "anglais" ? "anglais" : "francais"] ||
            "";
          const mastered = window.isMasteredDialogue(idx);
          const conversationHTML = item.conversation
            .map((line) => {
              const name = line.personnage || "";
              const text = getTextForLang(line, "native");
              return `<strong>${name}:</strong> ${text}<br />`;
            })
            .join("");

          return `
            <div class="flex flex-col items-stretch justify-start rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dialogue-card" data-audio-francais="${
              item.audio?.francais || ""
            }" data-audio-anglais="${item.audio?.anglais || ""}">
              <div class="flex w-full flex-col items-stretch justify-center gap-4 p-4">
                <div class="flex items-start justify-between gap-4">
                  <p class="text-xl font-bold leading-tight text-gray-900 dark:text-white">${title}</p>
                </div>
                <div class="flex flex-col gap-2">
                  <p class="dialogue-content text-gray-600 dark:text-gray-300 text-sm font-normal leading-relaxed">${conversationHTML}</p>
                </div>
              </div>

              <div class="px-4 pb-4 flex flex-col gap-4">
                <div class="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                  <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-primary dark:has-[:checked]:bg-primary has-[:checked]:shadow-sm has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal transition-all duration-200">
                    <span class="truncate">${langInfo.name}</span>
                    <input checked class="invisible w-0" name="dialogue${idx}-lang" type="radio" value="native" />
                  </label>
                  <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-primary dark:has-[:checked]:bg-primary has-[:checked]:shadow-sm has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal transition-all duration-200">
                    <span class="truncate">Français</span>
                    <input class="invisible w-0" name="dialogue${idx}-lang" type="radio" value="francais" />
                  </label>
                  <label class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 has-[:checked]:bg-primary dark:has-[:checked]:bg-primary has-[:checked]:shadow-sm has-[:checked]:text-white text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal transition-all duration-200">
                    <span class="truncate">Anglais</span>
                    <input class="invisible w-0" name="dialogue${idx}-lang" type="radio" value="anglais" />
                  </label>
                </div>

                <div class="audio-section"></div>

                <button class="mastered-btn flex items-center justify-center gap-2 rounded-lg ${
                  mastered
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                } h-10 text-sm font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-900/30" data-idx="${idx}">
                  <span class="material-symbols-outlined ${
                    mastered ? "fill" : ""
                  } text-lg">check_circle</span>
                  <span>${
                    mastered ? "Maîtrisé" : "Marquer comme maîtrisé"
                  }</span>
                </button>
              </div>
            </div>
          `;
        })
        .join("");

      // Initialize audio sections with default native
      document.querySelectorAll(".dialogue-card").forEach((card, idx) => {
        updateAudioSection(card, currentData[idx], "native");
      });

      window.initDialogueLanguageSelectors();
      window.initMasteredButtonsDialogue();
    } catch (e) {
      console.error(e);
      list.innerHTML =
        '<p class="text-sm text-red-500">Erreur de chargement des données.</p>';
    }
  },
};
