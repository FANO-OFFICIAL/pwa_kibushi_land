import { LANGUAGES, THEMES } from "../js/config.js";

export default {
  title: "Catégorie", // Titre statique temporaire, sera géré dynamiquement par le routeur
  render: async (params) => {
    const currentLang = params.lang || "sakalava";
    const currentThemeId = params.theme;

    // Find theme from config fallback or try to get title from fetch
    const themeConfig = THEMES.find((t) => t.id === currentThemeId);
    let themeTitle = themeConfig ? themeConfig.title : "Thème";

    // Try to load real title from JSON
    try {
      const response = await fetch(
        `data/${currentLang}/${currentThemeId}.json`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.titre) {
          themeTitle = data.titre;
        }
      }
    } catch (e) {
      console.warn("Could not load theme title");
    }

    const backLink = `#/themes?lang=${currentLang}`;
    let langInfo = LANGUAGES[currentLang];

    return `
      <div class="flex flex-col min-h-full">
        <main class="flex-1 overflow-y-auto p-4">
          <div class="flex flex-col gap-4">
            <!-- Phrases -->
            <a href="#/phrases?lang=${currentLang}&theme=${currentThemeId}"
               class="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] dark:bg-background-dark/50 hover:border-primary dark:hover:border-primary border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-4">
                <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span class="material-symbols-outlined">list_alt</span>
                </div>
                <div class="flex flex-1 flex-col justify-center">
                  <p class="text-base font-semibold text-[#111318] dark:text-white">Phrases</p>
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Apprenez des phrases essentielles</p>
                </div>
                <span class="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
              </div>
            </a>

            <!-- Dialogues -->
            <a href="#/dialogues?lang=${currentLang}&theme=${currentThemeId}"
               class="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] dark:bg-background-dark/50 hover:border-primary dark:hover:border-primary border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-4">
                <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span class="material-symbols-outlined">forum</span>
                </div>
                <div class="flex flex-1 flex-col justify-center">
                  <p class="text-base font-semibold text-[#111318] dark:text-white">Dialogues</p>
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Pratiquez avec des conversations réelles</p>
                </div>
                <span class="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
              </div>
            </a>

            <!-- Vocabulaire -->
            <a href="#/vocabulaire?lang=${currentLang}&theme=${currentThemeId}"
               class="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98] dark:bg-background-dark/50 hover:border-primary dark:hover:border-primary border border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-4">
                <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span class="material-symbols-outlined">style</span>
                </div>
                <div class="flex flex-1 flex-col justify-center">
                  <p class="text-base font-semibold text-[#111318] dark:text-white">Vocabulaire</p>
                  <p class="text-sm font-normal text-gray-500 dark:text-gray-400">Apprenez les mots clés</p>
                </div>
                <span class="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
              </div>
            </a>
          </div>
        </main>
      </div>
    `;
  },
};
