# Génération des fichiers audio pour l'application PWA Apprendre le Kibushi

## Structure des dossiers

Les fichiers audio sont stockés dans le dossier `assets/audio/`, qui est une structure courante dans les applications Android et les PWA.

```
pwa_apprendre_le_kibushi/
├── assets/
│   └── audio/
│       ├── phrase_01_fr_bonjour_.mp3
│       └── phrase_01_en_hello.mp3
├── data/
│   └── sakalava/
│       └── 01-salutations_presentations.json
└── generate_audio.py
```

## Fichiers générés

Pour la première phrase "Mbala tsara?" :

1. **phrase*01_fr_bonjour*.mp3** - Version française : "Bonjour ?"
2. **phrase_01_en_hello.mp3** - Version anglaise : "Hello?"

## Convention de nommage

Les fichiers audio suivent cette convention :

```
phrase_{numéro}_{langue}_{texte_sanitisé}.mp3
```

Où :

- `{numéro}` : Numéro de la phrase (01, 02, 03, etc.)
- `{langue}` : Code de langue (fr, en, mg)
- `{texte_sanitisé}` : Texte nettoyé (sans caractères spéciaux, espaces remplacés par \_)

## Utilisation du script

Pour générer les fichiers audio :

```bash
python generate_audio.py
```

Le script :

1. Charge le fichier JSON `data/sakalava/01-salutations_presentations.json`
2. Extrait la première phrase
3. Génère les fichiers audio en français et anglais avec gTTS
4. Sauvegarde les fichiers dans `assets/audio/`

## Technologies utilisées

- **gTTS** (Google Text-to-Speech) : Bibliothèque Python pour la synthèse vocale
- **Langues supportées** :
  - Français (fr)
  - Anglais (en)

## Prochaines étapes

Pour intégrer ces fichiers audio dans l'application web :

1. Ajouter des balises `<audio>` dans le HTML
2. Ou utiliser l'API Web Audio pour plus de contrôle
3. Remplacer ou compléter la fonction `speakText()` actuelle qui utilise Web Speech API

Exemple d'intégration :

```javascript
function playAudio(phraseNumber, language) {
  const audio = new Audio(
    `assets/audio/phrase_${phraseNumber}_${language}_*.mp3`
  );
  audio.play();
}
```
