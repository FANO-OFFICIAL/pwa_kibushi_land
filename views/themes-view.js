import { LANGUAGES, THEMES } from '../js/config.js';

export default {
  title: "Thèmes",
  render: async (params) => {
    const currentLang = params.lang || 'sakalava';
    const langInfo = LANGUAGES[currentLang];
    const langName = langInfo ? langInfo.name : 'Langue inconnue';

    // Load real titles from JSON files
    const themesData = await Promise.all(THEMES.map(async (theme) => {
        try {
            // Fetch the specific JSON for this theme and language
            const response = await fetch(`data/${currentLang}/${theme.id}.json`);
            if (response.ok) {
                const data = await response.json();
                if (data.titre) {
                    // Use the title found in the JSON
                    return { ...theme, title: data.titre };
                }
            }
        } catch (e) {
            console.warn(`Info: Could not load dynamic data for ${theme.id}`);
        }
        // Fallback to the title in config if fetch fails
        return theme;
    }));

    const themesHtml = themesData.map((theme) => {
        // Construct URL with hash
        const themeUrl = theme.url === "#" ? "#" : `#${theme.url}?lang=${currentLang}&theme=${theme.id}`;
        
        return `
          <a href="${themeUrl}" data-theme="${theme.id}" 
             class="flex items-center gap-4 bg-white dark:bg-background-dark/50 p-4 rounded-xl justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors shadow-sm border border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-4">
              <div class="text-primary flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 shrink-0 size-12">
                <span class="material-symbols-outlined">${theme.icon}</span>
              </div>
              <div class="flex flex-col justify-center">
                <p class="theme-title text-[#111318] dark:text-white text-base font-medium leading-normal">${theme.title}</p>
              </div>
            </div>
            <div class="shrink-0">
              <span class="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
            </div>
          </a>
        `;
    }).join("");

    return `
      <div class="flex flex-col min-h-full">
        <!-- Content -->
        <div class="flex-1">
            <div class="px-4 pt-6 pb-1">
              <h2 class="text-[#111318] dark:text-white tracking-light text-[32px] font-bold leading-tight">
                Thèmes
              </h2>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pb-3 pt-1 px-4">
              Choisissez un thème pour commencer.
            </p>

            <!-- Themes List -->
            <div id="themes-container" class="flex flex-col gap-3 px-4 py-3 pb-20">
              ${themesHtml}
            </div>
        </div>
      </div>
    `;
  },
  afterRender: async () => {}
};
