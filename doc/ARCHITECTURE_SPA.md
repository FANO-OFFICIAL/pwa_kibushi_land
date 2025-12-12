# Architecture SPA Légère (Single Page Application)

Ce document décrit la nouvelle architecture du projet "Apprendre le Kibushi". Le projet passe de multiples fichiers HTML statiques à une **Single Page Application (SPA)** légère et performante, optimisée pour le déploiement statique (ex: GitHub Pages).

## 1. Concept

Dans une SPA, le serveur ne délivre qu'un seul fichier HTML (`index.html`).
La navigation ne recharge pas la page. Au lieu de cela, le JavaScript écoute les changements d'URL (ou de hash `#`) et remplace dynamiquement le contenu de la balise `<main>`.

### Avantages :

- **Performance** : Chargement initial unique des scripts et styles. Transitions instantanées.
- **Maintenabilité** : Le code du Layout (Header, Footer, Head) n'existe qu'à un seul endroit.
- **Modularité** : Chaque "page" devient une "vue" (View) JavaScript isolée.

## 2. Structure des Dossiers

Voici la nouvelle organisation :

```
/
├── index.html            # Le "Coquille" (Shell) unique de l'application
├── manifest.json         # Configuration PWA
├── tailwind.config.js    # Config Tailwind
├── sw.js                 # Service Worker (PWA offline)
├── css/
│   ├── custom.css
│   └── input.css         # Source Tailwind
├── js/
│   ├── app.js            # Point d'entrée principal (initialise le routeur)
│   ├── router.js         # Gère la navigation et l'historique
│   ├── config.js         # Données statiques globales (Langues, Thèmes)
│   └── db.js             # Simulation de base de données (si nécessaire)
├── views/                # NOUVEAU : Contient le code de chaque écran
│   ├── home-view.js      # Vue Accueil (choix langue)
│   ├── themes-view.js    # Vue Liste des thèmes
│   └── phrases-view.js   # Vue Liste des phrases
└── components/           # Web Components réutilisables
    ├── app-header.js
    ├── app-footer.js
    └── ...
```

## 3. Flux de Données

1.  **L'utilisateur ouvre le site** -> `index.html` se charge.
2.  `app.js` se lance, initialise le `Router`.
3.  Le `Router` lit l'URL (ex: `/#themes`) et détermine quelle **Vue** charger.
4.  La **Vue** (ex: `themes-view.js`) récupère les données depuis `config.js` et génère le HTML.
5.  Le `Router` injecte ce HTML dans le `<main>` de `index.html`.

## 4. Dépendances Techniques

Ce projet n'utilise **aucun framework lourd** (pas de React/Vue/Angular).

- **Core** : Vanilla JavaScript (ES6 Modules).
- **Styling** : Tailwind CSS.
- **Icons** : Google Material Symbols.
- **Fonts** : Google Fonts (Lexend).

## 5. Guide de Développement

Pour ajouter une nouvelle page :

1.  Créer un fichier `views/nom-page-view.js`.
2.  Y exporter une fonction ou une classe avec une méthode `render()`.
3.  Enregistrer la route dans `js/router.js`.
