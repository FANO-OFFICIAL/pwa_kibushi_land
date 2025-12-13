import { LANGUAGES, THEMES } from "./config.js";

// Function to apply persistent settings based on localStorage
const applyPersistentSettings = () => {
  // Theme
  const theme = localStorage.getItem("setting_theme") || "auto";
  document.body.classList.remove(
    "light",
    "dark",
    "bg-background-light",
    "bg-background-dark"
  );

  let effectiveTheme;
  if (theme === "light") {
    effectiveTheme = "light";
  } else if (theme === "dark") {
    effectiveTheme = "dark";
  } else {
    // auto
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      effectiveTheme = "dark";
    } else {
      effectiveTheme = "light";
    }
  }

  if (effectiveTheme === "light") {
    document.body.classList.add("light", "bg-background-light");
  } else {
    document.body.classList.add("dark", "bg-background-dark");
  }

  // Font size
  const fontSize = localStorage.getItem("setting_font_size") || "medium";
  const root = document.documentElement;
  const sizeMap = { small: "14px", medium: "16px", large: "18px" };
  root.style.setProperty(
    "--base-font-size",
    sizeMap[fontSize] || sizeMap.medium
  );
};

export default class Router {
  constructor(routes) {
    this.routes = routes;
    this.rootElem = document.getElementById("app");
    window.addEventListener("hashchange", () => this.loadRoute());
    this.loadRoute(); // Load initial route
  }

  getFragment() {
    let fragment = window.location.hash.slice(1);
    // Remove query params for matching
    return fragment.split("?")[0] || "/";
  }

  getParams() {
    const urlSearchParams = new URLSearchParams(
      window.location.hash.split("?")[1]
    );
    return Object.fromEntries(urlSearchParams.entries());
  }

  updateHeader(fragment, params) {
    const appHeader = document.querySelector("app-header");
    if (appHeader) {
      // Reset header attributes to default
      appHeader.setAttribute("data-title", "");
      appHeader.removeAttribute("data-show-back-button");
      appHeader.removeAttribute("data-back-link");
      appHeader.removeAttribute("data-lang-flag");

      // Add back button for all pages except home
      if (fragment !== "/") {
        appHeader.setAttribute("data-show-back-button", "true");
        appHeader.setAttribute("data-back-link", "javascript:history.back()");
      }

      let currentLang = params.lang || "sakalava";
      const route =
        this.routes[fragment] || this.routes["404"] || this.routes["/"];
      if (route.title) {
        appHeader.setAttribute("data-title", route.title);
      }

      switch (fragment) {
        case "/themes":
          if (LANGUAGES[currentLang]) {
            appHeader.setAttribute("data-title", LANGUAGES[currentLang].name);
            appHeader.setAttribute("data-show-back-button", "true");
            appHeader.setAttribute("data-back-link", "#/");
          }
          break;
        case "/category":
        case "/phrases":
        case "/vocabulaire":
        case "/dialogues":
          if (LANGUAGES[currentLang]) {
            appHeader.setAttribute(
              "data-lang-flag",
              LANGUAGES[currentLang].flag
            );
          }
          const currentTheme = params.theme;
          if (currentTheme) {
            // Set title based on route
            if (fragment === "/category") {
              appHeader.setAttribute("data-title", "Catégories");
            } else if (fragment === "/phrases") {
              appHeader.setAttribute("data-title", "Phrases");
            } else if (fragment === "/vocabulaire") {
              appHeader.setAttribute("data-title", "Vocabulaire");
            } else if (fragment === "/dialogues") {
              appHeader.setAttribute("data-title", "Dialogues");
            }
            appHeader.setAttribute("data-show-back-button", "true");
            appHeader.setAttribute(
              "data-back-link",
              `#/themes?lang=${currentLang}`
            );
            if (fragment === "/category") {
              appHeader.setAttribute(
                "data-back-link",
                `#/themes?lang=${currentLang}`
              );
            } else {
              appHeader.setAttribute(
                "data-back-link",
                `#/category?lang=${currentLang}&theme=${currentTheme}`
              );
            }
          }
          break;
      }
    }
  }

  updateFooter(fragment, params) {
    const footer = document.querySelector("app-footer");
    const body = document.body;

    if (footer) {
      let activePage = "accueil";
      if (
        fragment.startsWith("/phrases") ||
        fragment.startsWith("/vocabulaire") ||
        fragment.startsWith("/dialogues")
      ) {
        activePage = "favoris";
      } else if (
        fragment.startsWith("/themes") ||
        fragment.startsWith("/category")
      ) {
        activePage = "themes";
      } else if (fragment === "/") {
        activePage = "accueil";
      } else if (fragment.startsWith("/favoris")) {
        activePage = "favoris";
      } else if (fragment.startsWith("/parametres")) {
        activePage = "parametres";
      }

      footer.setAttribute("data-active-page", activePage);
      body.classList.remove("hidden"); // Assuming footer is always shown now
    }
  }

  async loadRoute() {
    const fragment = this.getFragment();
    const params = this.getParams();

    // Apply persistent settings (theme, font size)
    applyPersistentSettings();

    // Save last accessed lang and theme
    if (params.lang) {
      localStorage.setItem("lastLang", params.lang);
    }
    if (params.theme) {
      localStorage.setItem("lastTheme", params.theme);
    }

    const route =
      this.routes[fragment] || this.routes["404"] || this.routes["/"];

    // Update header and footer
    this.updateHeader(fragment, params);
    this.updateFooter(fragment, params);

    if (route) {
      const updateDOM = async () => {
        // Clear current content
        this.rootElem.innerHTML = "";

        // Render view
        const content = await route.render(params);

        if (typeof content === "string") {
          this.rootElem.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          this.rootElem.appendChild(content);
        }

        // Execute afterRender if it exists
        if (route.afterRender) {
          await route.afterRender(params);
        }

        // Send page_view to Google Analytics
        if (window.gtag) {
          window.gtag("event", "page_view", {
            page_path: fragment,
            page_title: route.title || "Kibushi Land", // Use route title if available
          });
        }

        // Scroll to top
        window.scrollTo(0, 0);
      };

      if (document.startViewTransition) {
        const transition = document.startViewTransition(async () => {
          await updateDOM();
        });
        // Prevent "Skipped ViewTransition" errors from spamming the console
        transition.finished.catch(() => {});
      } else {
        // Fallback for browsers that don't support View Transitions
        await updateDOM();
      }
    }
  }

  navigate(path) {
    window.location.hash = path;
  }
}
