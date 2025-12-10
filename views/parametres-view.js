import { LANGUAGES } from "../js/config.js";

// Settings keys
const SETTINGS_KEYS = {
  theme: "setting_theme",
  sound: "setting_sound",
  fontSize: "setting_font_size",
  lastLang: "lastLang",
};

// Default settings
const DEFAULTS = {
  theme: "auto", // light, dark, auto
  sound: "on", // on, off
  fontSize: "medium", // small, medium, large
};

// Load setting from localStorage
function loadSetting(key, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

// Save setting to localStorage
function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // ignore
  }
}

// Apply current settings
function applySettings() {
  const theme = loadSetting(SETTINGS_KEYS.theme, DEFAULTS.theme);
  const body = document.body;

  // Remove existing theme classes
  body.classList.remove("light", "dark");

  // Apply theme
  if (theme === "light") {
    body.classList.add("light");
  } else if (theme === "dark") {
    body.classList.add("dark");
  } else {
    // auto: check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      body.classList.add("dark");
    } else {
      body.classList.add("light");
    }
  }

  const fontSize = loadSetting(SETTINGS_KEYS.fontSize, DEFAULTS.fontSize);
  // Apply font size by setting custom property
  const root = document.documentElement;
  const sizeMap = { small: "14px", medium: "16px", large: "18px" };
  root.style.setProperty(
    "--base-font-size",
    sizeMap[fontSize] || sizeMap.medium
  );
}

export default {
  title: "Paramètres",
  render: async (params) => {
    const currentTheme = loadSetting(SETTINGS_KEYS.theme, DEFAULTS.theme);
    const currentSound = loadSetting(SETTINGS_KEYS.sound, DEFAULTS.sound);
    const currentFontSize = loadSetting(
      SETTINGS_KEYS.fontSize,
      DEFAULTS.fontSize
    );
    const lastLang = localStorage.getItem(SETTINGS_KEYS.lastLang) || "sakalava";

    return `
      <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Settings List -->
        <div id="settings-list" class="flex-1 p-4 pb-20">
          <div class="max-w-md mx-auto space-y-4">

            <!-- Theme Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thème</h3>
              <div class="space-y-2">
                <label class="flex items-center justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Thème de l'application</span>
                  <select id="theme-select" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="light" ${
                      currentTheme === "light" ? "selected" : ""
                    }>Clair</option>
                    <option value="dark" ${
                      currentTheme === "dark" ? "selected" : ""
                    }>Sombre</option>
                    <option value="auto" ${
                      currentTheme === "auto" ? "selected" : ""
                    }>Automatique</option>
                  </select>
                </label>
              </div>
            </div>

            <!-- Sound Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Audio</h3>
              <div class="space-y-2">
                <label class="flex items-center justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Son activé</span>
                  <input type="checkbox" id="sound-toggle" ${
                    currentSound === "on" ? "checked" : ""
                  } class="w-6 h-6 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2">
                </label>
              </div>
            </div>

            <!-- Font Size Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Apparence</h3>
              <div class="space-y-2">
                <label class="flex items-center justify-between">
                  <span class="text-gray-700 dark:text-gray-300">Taille de la police</span>
                  <select id="font-size-select" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="small" ${
                      currentFontSize === "small" ? "selected" : ""
                    }>Petit</option>
                    <option value="medium" ${
                      currentFontSize === "medium" ? "selected" : ""
                    }>Moyen</option>
                    <option value="large" ${
                      currentFontSize === "large" ? "selected" : ""
                    }>Grand</option>
                  </select>
                </label>
              </div>
            </div>

            <!-- Data Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Données</h3>
              <div class="space-y-2">
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Dernière langue utilisée: <strong>${
                    LANGUAGES[lastLang]?.name || "Aucune"
                  }</strong>
                </div>
                <button id="reset-data-btn" class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  Réinitialiser tous les progrès
                </button>
              </div>
            </div>

            <!-- About Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">À propos</h3>
              <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Kibushi Land</strong></p>
                <p>Version 1.0.0</p>
                <p>Apprenez le Kibushi et d'autres langues africaines de manière interactive.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },
  afterRender: async (params) => {
    // Apply current settings on load
    applySettings();

    // Theme change
    document.getElementById("theme-select").addEventListener("change", (e) => {
      const value = e.target.value;
      saveSetting(SETTINGS_KEYS.theme, value);
      applySettings();
      // Auto-apply by re-rendering or just updating html
    });

    // Sound change
    document.getElementById("sound-toggle").addEventListener("change", (e) => {
      const value = e.target.checked ? "on" : "off";
      saveSetting(SETTINGS_KEYS.sound, value);
      // Can disable audio globally if off
    });

    // Font size change
    document
      .getElementById("font-size-select")
      .addEventListener("change", (e) => {
        const value = e.target.value;
        saveSetting(SETTINGS_KEYS.fontSize, value);
        applySettings();
      });

    // Reset data
    document.getElementById("reset-data-btn").addEventListener("click", () => {
      if (
        confirm(
          "Êtes-vous sûr de vouloir réinitialiser tous vos progrès ? Cette action est irréversible."
        )
      ) {
        // Clear all app data
        const keysToRemove = Object.values(SETTINGS_KEYS);
        keysToRemove.forEach((key) => localStorage.removeItem(key));

        // Clear mastered phrases, dialogues for all langs
        const allKeys = Object.keys(localStorage);
        allKeys.forEach((key) => {
          if (key.includes("mastered")) {
            localStorage.removeItem(key);
          }
        });

        alert("Tous les progrès ont été réinitialisés.");
        // Reload to apply defaults
        location.reload();
      }
    });
  },
};
