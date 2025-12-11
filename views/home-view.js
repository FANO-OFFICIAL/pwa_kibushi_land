import { LANGUAGES } from "../js/config.js";

export default {
  title: "Accueil",
  render: async () => {
    // Generate language links dynamically
    const languagesHtml = Object.entries(LANGUAGES)
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .map(
        ([key, lang]) => `
      <a
        href="#/themes?lang=${key}"
        class="flex w-full cursor-pointer items-center justify-start overflow-hidden rounded-xl h-auto p-5 bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors duration-200 gap-4"
      >
        <span class="text-2xl emoji">${lang.flag}</span>
        <span
          class="flex-grow text-left text-base font-medium text-[#111318] dark:text-white"
          >${lang.name}</span
        >
        <span
          class="material-symbols-outlined text-gray-400 dark:text-gray-500"
          >arrow_forward_ios</span
        >
      </a>
    `
      )
      .join("");

    return `
      <!-- Content -->
      <div
        class="relative flex min-h-full w-full flex-col items-center justify-start p-4"
      >
        <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <svg
            class="opacity-5 dark:opacity-[0.03]"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 1000 1000"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient
                cx="50%"
                cy="50%"
                fx="50%"
                fy="50%"
                id="grad1"
                r="50%"
              >
                <stop
                  offset="0%"
                  style="stop-color: rgb(43, 108, 238); stop-opacity: 0.3"
                ></stop>
                <stop
                  offset="100%"
                  style="stop-color: rgb(43, 108, 238); stop-opacity: 0"
                ></stop>
              </radialGradient>
            </defs>
            <rect
              fill="url(#grad1)"
              height="200%"
              width="200%"
              x="-50%"
              y="-50%"
            ></rect>
          </svg>
        </div>
        <div
          class="relative z-10 flex flex-col items-center justify-center w-full max-w-md flex-1"
        >
          <div class="text-center w-full pb-8">
            <h2
              class="text-[#111318] dark:text-white tracking-tight text-3xl font-bold leading-tight"
            >
              Bienvenue !
            </h2>
            <p
              class="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pt-2"
            >
              Choisissez votre langue pour commencer.
            </p>
          </div>
          <div class="w-full flex flex-col gap-4 pt-8">
            ${languagesHtml}
          </div>
        </div>
      </div>
      
      </div>
    `;
  },
  afterRender: async () => {
    // Any DOM manipulation after render
  },
};
