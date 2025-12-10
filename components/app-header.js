class AppHeader extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return [
      "data-title",
      "data-lang-flag",
      "data-view-id",
      "data-show-back-button",
      "data-back-link",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("data-title") || "Kibushi Land";
    const showBackButton = this.hasAttribute("data-show-back-button");
    const backLink = this.getAttribute("data-back-link") || "#";
    const langFlag = this.getAttribute("data-lang-flag") || "";
    const viewId = this.getAttribute("data-view-id") || "";

    this.innerHTML = `
      <header class="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200/80 bg-background-light/80 p-4 pb-3 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80" ${
        viewId ? `data-current-view="${viewId}"` : ""
      }>
        <div class="size-10 shrink-0">
          ${
            showBackButton
              ? `
            <a href="${backLink}" class="flex size-10 shrink-0 items-center justify-center text-gray-800 dark:text-gray-200">
              <span class="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
            </a>
          `
              : ""
          }
        </div>
        <h1 class="app-header-title flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-gray-900 dark:text-gray-100">
          ${title}
        </h1>
        <div class="size-10 shrink-0 flex items-center justify-center text-lg">
          ${langFlag}
        </div>
      </header>
    `;
  }
}

customElements.define("app-header", AppHeader);
