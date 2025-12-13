// Utility functions for audio handling
export function playAudioFile(audioPath, button) {
  const audio = new Audio(audioPath);
  const icon = button.querySelector(".material-symbols-outlined");

  // Sauvegarder les classes initiales
  button.dataset.originalClasses = Array.from(button.classList).join(" ");

  icon.classList.add("fill");
  button.classList.add("animate-pulse");
  button.classList.remove(
    "bg-gray-100",
    "text-gray-600",
    "dark:bg-gray-700",
    "dark:text-gray-400"
  );
  button.classList.add("bg-primary/10", "text-primary");

  audio.play().catch((error) => {
    console.error("Erreur lors de la lecture audio:", error);
    resetAudioButton(button);
  });

  audio.addEventListener("ended", () => {
    resetAudioButton(button);
  });

  return audio; // Return audio instance for potential further control if needed
}

export function resetAudioButton(button) {
  const icon = button.querySelector(".material-symbols-outlined");
  icon.classList.remove("fill");
  button.classList.remove("animate-pulse", "bg-primary/10", "text-primary");

  // Restaurer les classes initiales
  const originalClasses = button.dataset.originalClasses;
  if (originalClasses) {
    button.className = originalClasses;
  } else {
    // Fallback
    button.classList.add(
      "bg-gray-100",
      "text-gray-600",
      "dark:bg-gray-700",
      "dark:text-gray-400"
    );
  }
}
