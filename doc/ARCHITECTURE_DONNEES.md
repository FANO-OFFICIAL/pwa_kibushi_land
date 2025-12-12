# Architecture "Hybride Statique" pour la Gestion des Données JSON

Ce document explique l'approche technique utilisée pour gérer le contenu dynamique (thèmes, leçons) dans une application 100% statique (compatible GitHub Pages, sans base de données ni PHP).

## Le Défi Technique

Dans une application web classique ("dynamique"), le serveur (PHP, Node.js, Python) peut scanner un dossier et dire au navigateur : _"Voici la liste de tous les fichiers disponibles"._

Sur un hébergement statique (comme GitHub Pages), **cette action est impossible**. Le navigateur (JavaScript côté client) ne peut pas deviner ou lister le contenu d'un dossier sur le serveur pour des raisons de sécurité et d'architecture. Il ne peut que demander des fichiers dont il connaît déjà le nom précis.

## La Solution Mise en Place

Nous avons adopté une stratégie hybride qui combine la stabilité du statique avec la flexibilité du contenu dynamique.

### 1. La "Table des Matières" (`js/config.js`)

Ce fichier agit comme un index. C'est le seul endroit où nous devons déclarer l'existence d'un nouveau fichier.

```javascript
// js/config.js
export const THEMES = [
  {
    id: "01-salutations_presentations", // L'identifiant unique du fichier
    icon: "handshake", // L'icône de l'interface
    url: "/phrases",
    // Notez qu'il n'y a PAS de titre ici, il sera chargé dynamiquement
  },
];
```

### 2. Le Contenu "Source de Vérité" (Fichiers JSON)

Chaque thématique est un fichier JSON indépendant dans le dossier de la langue (ex: `data/sakalava/01-salutations_presentations.json`). C'est lui qui contient les vraies données.

```json
{
  "titre": "Saluer les autres et Se présenter",  // <-- C'est ce titre qui sera affiché !
  "phrases": [...]
}
```

### 3. Le Chargement Intelligent (`themes-view.js`)

Au moment d'afficher la liste des thèmes, l'application effectue l'opération suivante :

1.  Elle lit la liste des IDs dans `config.js`.
2.  Pour chaque ID, elle va chercher le fichier JSON correspondant à la langue choisie.
3.  Elle ouvre le JSON, extrait le champ `"titre"`, et l'utilise pour l'affichage.

## Avantages de cette méthode

- **Zéro Maintenance de Code :** Si vous voulez corriger une faute d'orthographe dans un titre, vous modifiez uniquement le fichier JSON. L'application se met à jour toute seule.
- **Compatibilité Totale :** Fonctionne partout (GitHub Pages, Netlify, WAMP local, fichier HTML ouvert directement).
- **Performance :** Les navigateurs modernes peuvent lancer ces requêtes en parallèle très rapidement.
- **Internationalisation Facile :** Le même ID (ex: `01-salutations`) chargera automatiquement le fichier allemand ou sakalava selon la langue active, affichant ainsi le titre traduit correct contenu dans chaque fichier.

## Comment ajouter un nouveau thème ?

1.  Créez votre fichier JSON (ex: `data/sakalava/02-voyage.json`) avec un champ `"titre"`.
2.  Ajoutez simplement son ID dans `js/config.js` :
    ```javascript
    { id: "02-voyage", icon: "flight", url: "/phrases" }
    ```
3.  C'est tout ! Le titre et le contenu seront chargés automatiquement.
