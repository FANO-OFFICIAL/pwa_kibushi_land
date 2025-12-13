import Router from "./router.js";
import HomeView from "../views/home-view.js";
import ThemesView from "../views/themes-view.js";
import CategoryView from "../views/category-view.js";
import PhrasesView from "../views/phrases-view.js";
import VocabulaireView from "../views/vocabulaire-view.js";
import DialoguesView from "../views/dialogues-view.js";
import ParametresView from "../views/parametres-view.js";
import "../components/app-header.js";
import "../components/app-footer.js";

const routes = {
  "/": HomeView,
  "/themes": ThemesView,
  "/category": CategoryView,
  "/phrases": PhrasesView,
  "/vocabulaire": VocabulaireView,
  "/dialogues": DialoguesView,
  "/parametres": ParametresView,
};

// Initial settings applied in router on first loadRoute

// Initialize Router
window.router = new Router(routes);
