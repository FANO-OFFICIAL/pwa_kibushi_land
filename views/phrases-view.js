import { LANGUAGES } from "../js/config.js";
import { playAudioFile } from "../js/utils/audio.js";
import { getMasteredPhrases, saveMasteredPhrase } from "../js/utils/storage.js";

// Make these global so onclick attributes work
window.toggleMastered = function (button) {
  const isMastered = button.dataset.mastered === "true";
  const phraseBlock = button.closest(".flex.overflow-hidden");
  const phraseText = phraseBlock.querySelector(".phrase-text");
  const phraseTextContent = phraseText.dataset.native;

  // We need current lang to save correctly.
  // In the original code, it grabbed it from URL. In SPA hash router, window.location.search might be empty or different.
  // We can store it on the button or look up the hash.
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
  const currentLang = hashParams.get("lang") || "sakalava";

  const currentTheme =
    hashParams.get("theme") || "01-salutations_presentations";

  if (isMastered) {
    button.dataset.mastered = "false";
    button.classList.remove("text-green-500");
    button.classList.add("text-gray-400", "dark:text-gray-500");
    button.querySelector(".material-symbols-outlined").classList.remove("fill");
    saveMasteredPhrase(phraseTextContent, false, currentLang, currentTheme);
  } else {
    button.dataset.mastered = "true";
    button.classList.remove("text-gray-400", "dark:text-gray-500");
    button.classList.add("text-green-500");
    button.querySelector(".material-symbols-outlined").classList.add("fill");
    saveMasteredPhrase(phraseTextContent, true, currentLang, currentTheme);
  }
};

window.switchLanguage = function (button, lang) {
  const phraseBlock = button.closest(".flex.overflow-hidden");
  const phraseText = phraseBlock.querySelector(".phrase-text");
  const phraseContainer = phraseBlock.querySelector("[data-current-lang]");
  const allButtons = phraseBlock.querySelectorAll("[data-lang]");

  allButtons.forEach((btn) => {
    btn.classList.remove("ring-2", "ring-primary");
    btn.classList.add("opacity-50");
  });

  button.classList.remove("opacity-50");
  button.classList.add("ring-2", "ring-primary");

  if (phraseContainer) {
    phraseContainer.dataset.currentLang = lang;
  }

  if (lang === "native") {
    phraseText.textContent = phraseText.dataset.native;
  } else if (lang === "francais") {
    phraseText.textContent = phraseText.dataset.francais;
  } else if (lang === "anglais") {
    phraseText.textContent = phraseText.dataset.anglais;
  }
};

window.playAudioForCurrentLanguage = function (button) {
  const phraseContainer = button.closest("[data-current-lang]");
  const phraseText = phraseContainer.querySelector(".phrase-text");
  const currentLang = phraseContainer.dataset.currentLang;

  let audioUrl = "";
  if (currentLang === "francais") audioUrl = phraseText.dataset.audioFrancais;
  else if (currentLang === "anglais")
    audioUrl = phraseText.dataset.audioAnglais;
  else if (currentLang === window.nativeKey)
    audioUrl = phraseText.dataset.audioNative;

  if (audioUrl) {
    playAudioFile(audioUrl, button);
  } else {
    console.log(`Aucun audio configuré pour la langue : ${currentLang}`);
  }
};

function createPhraseBlock(phrase, index, masteredPhrases, currentLang) {
  const nativeText = phrase[currentLang] || phrase.sakalava || "";
  const francaisText = phrase.francais;
  const anglaisText = phrase.anglais;
  const isMastered = masteredPhrases && masteredPhrases[nativeText];
  const checkClass = isMastered
    ? "text-green-500"
    : "text-gray-400 dark:text-gray-500";
  const fillClass = isMastered ? "fill" : "";
  const masteredValue = isMastered ? "true" : "false";

  const defaultImage = "assets/images/illustration_default_9_16.jpg";
  const illustration = phrase.illustration || defaultImage;

  const langInfo = LANGUAGES[currentLang];

  return `
    <div class="flex overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <img alt="Illustration" class="aspect-[9/16] w-28 object-cover" src="${illustration}" />
        <div class="flex flex-1 flex-col p-4" data-current-lang="${currentLang}" data-phrase-index="${
    index + 1
  }">
          <div class="flex-1">
            <div class="flex items-start justify-between gap-2">
              <p class="flex-1 text-lg font-medium text-gray-900 dark:text-gray-100 phrase-text"
                 data-native="${nativeText}"
                 data-francais="${francaisText}"
                 data-anglais="${anglaisText}"
                 data-audio-francais="${phrase.audio?.francais || ""}"
                 data-audio-anglais="${phrase.audio?.anglais || ""}"
                 data-audio-native="${phrase.audio?.[currentLang] || ""}"
              >${nativeText}</p>
              <button onclick="playAudioForCurrentLanguage(this)" class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 audio-button">
                <span class="material-symbols-outlined text-2xl">volume_up</span>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2">
              <button onclick="switchLanguage(this, 'native')" class="flex h-6 w-6 items-center justify-center rounded-full text-base ring-2 ring-primary" data-lang="native">
                <span class="${langInfo.flag}"></span>
              </button>
              <button onclick="switchLanguage(this, 'francais')" class="flex h-6 w-6 items-center justify-center rounded-full text-base opacity-50" data-lang="francais">
                <span class="fi fi-fr"></span>
              </button>
              <button onclick="switchLanguage(this, 'anglais')" class="flex h-6 w-6 items-center justify-center rounded-full text-base opacity-50" data-lang="anglais">
                <span class="fi fi-gb"></span>
              </button>
            </div>
            <div class="flex items-center gap-1">
              <button onclick="toggleMastered(this)" class="flex h-8 w-8 items-center justify-center rounded-full ${checkClass}" data-mastered="${masteredValue}">
                <span class="material-symbols-outlined ${fillClass} text-2xl">check_circle</span>
              </button>
            </div>
          </div>
        </div>
    </div>
  `;
}

// --- View Component ---

export default {
  title: "", // Titre dynamique géré par le router
  render: async (params) => {
    const currentLang = params.lang || "sakalava";
    const currentTheme = params.theme;

    // Try to load real title from JSON
    let themeTitle = "Phrases";
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
      <div class="flex flex-col">
        <!-- Phrases List -->
        <div id="phrases-container" class="flex-1 p-4 pb-20 flex flex-col gap-4">
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
    window.nativeKey = currentLang;
    const container = document.getElementById("phrases-container");

    try {
      // Load data
      const response = await fetch(`data/${currentLang}/${currentTheme}.json`);
      const data = await response.json();

      container.innerHTML = "";
      const masteredPhrases = getMasteredPhrases(currentLang, currentTheme);

      const html = data.phrases
        .map((phrase, index) =>
          createPhraseBlock(phrase, index, masteredPhrases, currentLang)
        )
        .join("");
      container.innerHTML = html;
    } catch (error) {
      console.error("Erreur loading phrases:", error);
      container.innerHTML =
        '<p class="text-center text-red-500">Erreur lors du chargement des phrases.</p>';
    }
  },
};
