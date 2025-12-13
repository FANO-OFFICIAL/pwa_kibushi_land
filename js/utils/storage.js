// Utility functions for localStorage handling
export function getMasteredPhrases(lang, theme = "salutations") {
  const key = `masteredPhrases_${lang}_${theme}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

export function saveMasteredPhrase(
  phraseText,
  isMastered,
  lang,
  theme = "salutations"
) {
  const mastered = getMasteredPhrases(lang, theme);
  if (isMastered) {
    mastered[phraseText] = true;
  } else {
    delete mastered[phraseText];
  }
  const key = `masteredPhrases_${lang}_${theme}`;
  localStorage.setItem(key, JSON.stringify(mastered));
}

export function getMasteredVocab(lang, theme) {
  const key = `masteredVocab_${lang}_${theme}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

export function saveMasteredVocab(idx, isMastered, lang, theme) {
  const mastered = getMasteredVocab(lang, theme);
  mastered[idx] = isMastered;
  const key = `masteredVocab_${lang}_${theme}`;
  localStorage.setItem(key, JSON.stringify(mastered));
}

// Dialogues too
export function getMasteredDialogues(lang, theme) {
  const key = `masteredDialogues_${lang}_${theme}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : {};
}

export function saveMasteredDialogue(idx, isMastered, lang, theme) {
  const mastered = getMasteredDialogues(lang, theme);
  mastered[idx] = isMastered;
  const key = `masteredDialogues_${lang}_${theme}`;
  localStorage.setItem(key, JSON.stringify(mastered));
}
