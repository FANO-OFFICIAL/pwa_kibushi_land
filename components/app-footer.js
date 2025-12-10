class AppFooter extends HTMLElement {
  constructor() {
    super();
    this.style.display = "block";
  }

  static get observedAttributes() {
    return ["data-active-page"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data-active-page") {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    try {
      const activePage = this.getAttribute("data-active-page") || "accueil";

      const isIndex = activePage === "accueil";

      // Get current lang from URL hash params
      const hashParams = new URLSearchParams(
        window.location.hash.split("?")[1]
      );
      const currentLang = hashParams.get("lang") || "sakalava";

      const pages = [
        { id: "accueil", label: "Accueil", icon: "home", href: "#/" },
        {
          id: "themes",
          label: "Thèmes",
          icon: "auto_stories",
          href: (() => {
            const lastLang = localStorage.getItem("lastLang") || currentLang;
            const lastTheme = localStorage.getItem("lastTheme");
            const base = `#/themes?lang=${lastLang}`;
            return lastTheme ? `${base}&theme=${lastTheme}` : base;
          })(),
        },
        {
          id: "favoris",
          label: "Phrases",
          icon: "text_to_speech",
          href: (() => {
            const lastLang = localStorage.getItem("lastLang") || "sakalava";
            const lastTheme = localStorage.getItem("lastTheme");
            const base = `#/phrases?lang=${lastLang}`;
            return lastTheme ? `${base}&theme=${lastTheme}` : base;
          })(),
        },
        {
          id: "parametres",
          label: "Paramètres",
          icon: "settings",
          href: "#/parametres",
        },
      ];

      const navItemsHTML = pages
        .map((page) => {
          const isActive = page.id === activePage;
          const textClass = isActive
            ? "text-primary"
            : "text-gray-500 dark:text-gray-400";
          const fontWeight = isActive ? "font-bold" : "font-medium";
          const iconStyle = isActive
            ? "style=\"font-variation-settings: 'FILL' 1\""
            : "";
          const activeClass = isActive ? "active-nav-item" : "";

          return `
        <a href="${page.href}" class="flex flex-1 flex-col items-center justify-end gap-1.5 rounded-full py-1 ${textClass} ${activeClass}">
          <span class="material-symbols-outlined" ${iconStyle}>${page.icon}</span>
          <p class="text-xs ${fontWeight} leading-normal">${page.label}</p>
        </a>
      `;
        })
        .join("");

      this.innerHTML = `
      <footer class="sticky bottom-0 z-10 border-t border-gray-200/80 bg-background-light/90 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/90">
        <div class="flex justify-around px-2 pb-2 pt-1.5 sm:pb-3">
          ${navItemsHTML}
        </div>
      </footer>
    `;
    } catch (error) {
      console.error("Error rendering footer:", error);
    }
  }
}

customElements.define("app-footer", AppFooter);
