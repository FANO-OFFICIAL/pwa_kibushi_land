# Guide des Animations de Transition Mobile (Android / Material Design)

Ce document explore les différentes techniques d'animation utilisées dans les applications modernes pour passer d'un écran à un autre. Ces standards sont définis principalement par le **Material Design** de Google.

---

## 1. Slide (Le Classique Indétrônable)

**C'est quoi ?**  
Le contenu actuel glisse vers la gauche pendant que le nouveau contenu arrive depuis la droite (ou inversement pour le retour).

- **Vibe :** Naturel, Linéaire, Intuitif.
- **Utilisation :** Navigation entre des niveaux hiérarchiques (ex: Liste de contacts -> Détail d'un contact).
- **Pourquoi on l'aime ?** Il mime le mouvement physique de passer une page. L'utilisateur comprend instinctivement où il se situe dans l'application. C'est le choix le plus sûr.

## 2. Shared Axis (L'Axe Partagé - Material Design 3)

Une évolution plus sophistiquée qui joue sur les trois axes de l'espace (X, Y, Z) pour renforcer les relations spatiales.

### A. Shared Axis Z (Profondeur / Zoom)

**C'est quoi ?**  
La page sortante s'estompe et recule (scale down), tandis que la page entrante avance et s'agrandit (scale up + fade in).

- **Vibe :** Moderne, Premium, Immersif.
- **Utilisation :** Entrer dans un contenu parent -> enfant (ex: Accueil -> Paramètres).
- **Effet :** Donne l'impression de plonger _dans_ l'application plutôt que de tourner autour.

### B. Shared Axis Y (Vertical)

**C'est quoi ?**  
Le contenu bouge verticalement (de bas en haut).

- **Utilisation :** Souvent pour les étapes d'un formulaire ou des changements d'état majeurs.

### C. Shared Axis X (Horizontal)

**C'est quoi ?**  
Similaire au Slide classique, mais avec un traitement plus subtil de l'opacité et de l'accélération.

---

## 3. Circular Reveal (La Révélation Circulaire)

**C'est quoi ?**  
La nouvelle page apparaît à l'intérieur d'un cercle qui s'agrandit depuis le point exact où vous avez touché l'écran.

- **Vibe :** "Magic", Wow, Joueur.
- **Utilisation :** Actions contextuelles (ex: Fab Button "+" -> Nouvel Email).
- **Note :** Très impressionnant visuellement, mais peut être fatigant si utilisé pour _chaque_ changement de page basique.

---

## 4. Container Transform (Transformation de Conteneur)

**C'est quoi ?**  
Un élément de la liste (comme une carte ou une image) s'agrandit et se métamorphose physiquement pour devenir la nouvelle page entière.

- **Vibe :** Fluide, Organique, Connecté.
- **Utilisation :** Galerie photo -> Image en plein écran, Article de liste -> Article complet.
- **Technique :** C'est le "Saint Graal" de la fluidité, montrant une continuité parfaite.

---

## 5. Fade Through (Fondu Traversant)

**C'est quoi ?**  
La page A disparaît complètement, puis la page B apparaît. Pas de mouvement.

- **Vibe :** Calme, Distant.
- **Utilisation :** Changement de sections majeures (ex: Onglet Accueil -> Onglet Recherche) où il n'y a pas de lien direct de "navigation".

---

## Résumé pour votre PWA

Actuellement, nous utilisons le **Slide (Type 1)** car c'est le standard le plus robuste pour une application d'apprentissage de langues (Langues -> Thèmes -> Phrases). Cela structure mentalement le parcours de l'utilisateur.
