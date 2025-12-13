import { LANGUAGES } from "../js/config.js";
import { playAudioFile } from "../js/utils/audio.js";
import { getMasteredVocab, saveMasteredVocab } from "../js/utils/storage.js";

window.isMasteredVocab = function (idx) {
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const currentLang = hashParams.get("lang") || "sakalava";
  const currentTheme =
    hashParams.get("theme") || "01-salutations_presentations";
  return getMasteredVocab(currentLang, currentTheme)[idx] || false;
};

window.setMasteredVocab = function (idx, value) {
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const currentLang = hashParams.get("lang") || "sakalava";
  const currentTheme =
    hashParams.get("theme") || "01-salutations_presentations";
  saveMasteredVocab(idx, value, currentLang, currentTheme);
};

window.toggleMasteredVocab = function (button) {
  const idx = button.dataset.idx;
  const vocabCard = button.closest("[data-current-lang]");
  const vocabText = vocabCard.querySelector(".vocab-text");
  const phraseTextContent = vocabText.dataset.native;

  // We need current lang to save correctly.
  // Like toggleMastered in phrases
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const currentLang = hashParams.get("lang") || "sakalava";
  const currentTheme =
    hashParams.get("theme") || "01-salutations_presentations";

  const currentMastered = window.isMasteredVocab(idx);

  if (currentMastered) {
    button.setAttribute("data-mastered", "false");
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("text-green-500");
    button.classList.add("text-gray-400", "dark:text-gray-500");
    button.querySelector(".material-symbols-outlined").classList.remove("fill");
    saveMasteredVocab(idx, false, currentLang, currentTheme);
  } else {
    button.setAttribute("data-mastered", "true");
    button.setAttribute("aria-pressed", "true");
    button.classList.remove("text-gray-400", "dark:text-gray-500");
    button.classList.add("text-green-500");
    button.querySelector(".material-symbols-outlined").classList.add("fill");
    saveMasteredVocab(idx, true, currentLang, currentTheme);
  }
};

window.switchVocabLanguage = function (button, lang) {
  const vocabCard = button.closest("[data-current-lang]");
  const vocabText = vocabCard.querySelector(".vocab-text");
  const allButtons = vocabCard.querySelectorAll("[data-lang]");

  allButtons.forEach((btn) => {
    btn.classList.remove("ring-2", "ring-primary");
    btn.classList.add("opacity-50");
  });

  button.classList.remove("opacity-50");
  button.classList.add("ring-2", "ring-primary");

  vocabCard.dataset.currentLang = lang;

  if (lang === "native") {
    vocabText.textContent = vocabText.dataset.native;
  } else if (lang === "francais") {
    vocabText.textContent = vocabText.dataset.francais;
  } else if (lang === "anglais") {
    vocabText.textContent = vocabText.dataset.anglais;
  }
};

window.playVocabAudio = function (button) {
  const vocabCard = button.closest("[data-current-lang]");
  const vocabText = vocabCard.querySelector(".vocab-text");
  const currentLang = vocabCard.dataset.currentLang;

  let audioUrl = "";
  if (currentLang === "francais") {
    audioUrl = vocabText.dataset.audioFrancais;
  } else if (currentLang === "anglais") {
    audioUrl = vocabText.dataset.audioAnglais;
  }

  if (audioUrl) {
    playAudioFile(audioUrl, button);
  } else {
    console.log(`Aucun audio disponible pour la langue : ${currentLang}`);
  }
};

// --- View Component ---

export default {
  title: "Vocabulaire", // Titre statique, le titre du thème sera géré par le router
  render: async (params) => {
    const currentLang = params.lang || "sakalava";
    const currentTheme = params.theme || "01-salutations_presentations";

    // Try to load real title from JSON
    let themeTitle = "Vocabulaire";
    let langInfo = LANGUAGES[currentLang];
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
        <!-- Vocab List -->
        <div id="vocab-list" class="flex-1 p-4 pb-20 flex flex-col gap-4">
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    `;
  },
  afterRender: async (params) => {
    const currentLang = params.lang || "sakalava";
    const currentTheme = params.theme || "01-salutations_presentations";
    const container = document.getElementById("vocab-list");

    try {
      const DATA_URL = `data/${currentLang}/${currentTheme}.json`;
      const response = await fetch(DATA_URL);
      const data = await response.json();
      const items = data.vocabulaire || [];

      container.innerHTML = items
        .map((item, idx) => {
          const illustration =
            item.illustration ||
            "../assets/images/illustration_default_9_16.jpg";

          const nativeText =
            item[currentLang] || item["kibushi"] || item.sakalava || "";
          const fr = item.francais || "";
          const en = item.anglais || "";
          const audioFr = item.audio?.francais || "";
          const audioEn = item.audio?.anglais || "";
          const mastered = window.isMasteredVocab(idx);
          const checkClass = mastered
            ? "text-green-500"
            : "text-gray-400 dark:text-gray-500";
          const fillClass = mastered ? "fill" : "";
          const masteredValue = mastered ? "true" : "false";

          const langInfo = LANGUAGES[currentLang];

          return `
            <div class="flex w-full items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm" data-current-lang="${currentLang}">
              <img alt="Illustration" class="h-24 w-[54px] rounded-lg object-cover" src="${illustration}" />
              <div class="flex flex-1 flex-col justify-center gap-2">
                <p class="vocab-text text-gray-900 dark:text-white text-lg font-semibold leading-normal"
                   data-native="${nativeText}"
                   data-francais="${fr}"
                   data-anglais="${en}"
                   data-audio-francais="${audioFr}"
                   data-audio-anglais="${audioEn}">${nativeText}</p>
                <div class="flex items-center gap-2">
                  <button onclick="switchVocabLanguage(this, 'native')" class="flex h-6 w-6 items-center justify-center rounded-full text-base ring-2 ring-primary" data-lang="native">
                    <span class="${langInfo.flag}"></span>
                  </button>
                  <button onclick="switchVocabLanguage(this, 'francais')" class="flex h-6 w-6 items-center justify-center rounded-full text-base opacity-50" data-lang="francais">
                    <span class="fi fi-fr"></span>
                  </button>
                  <button onclick="switchVocabLanguage(this, 'anglais')" class="flex h-6 w-6 items-center justify-center rounded-full text-base opacity-50" data-lang="anglais">
                    <span class="fi fi-gb"></span>
                  </button>
                </div>
              </div>
              <div class="flex flex-col items-center justify-between gap-2">
                <button class="mastered-btn flex size-9 cursor-pointer items-center justify-center rounded-full ${checkClass}" data-idx="${idx}" aria-pressed="${masteredValue}">
                  <span class="material-symbols-outlined ${fillClass}">check_circle</span>
                </button>
                <button onclick="playVocabAudio(this)" class="flex size-9 cursor-pointer items-center justify-center rounded-full text-gray-400 dark:text-gray-300 hover:bg-primary/10">
                  <span class="material-symbols-outlined">volume_up</span>
                </button>
              </div>
            </div>
          `;
        })
        .join("");
    } catch (error) {
      console.error("Erreur loading vocabulaire:", error);
      container.innerHTML =
        '<p class="text-center text-red-500">Erreur lors du chargement des données.</p>';
    }
  },
};
