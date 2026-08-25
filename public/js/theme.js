const storageKey = "study-theme";
const root = document.documentElement;

function systemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function currentTheme() {
  const saved = localStorage.getItem(storageKey);
  return saved === "dark" || saved === "light" ? saved : systemTheme();
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const next = theme === "dark" ? "light" : "dark";
    button.dataset.themeNext = next;
    button.setAttribute("aria-label", `Switch to ${next} mode`);
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.querySelector("[data-theme-label]")?.replaceChildren(next === "dark" ? "Dark" : "Light");
  });
}

export function initThemeToggle() {
  applyTheme(currentTheme());
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.themeNext === "dark" ? "dark" : "light";
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });
  });
}

initThemeToggle();
