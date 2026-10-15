const themeToggle = document.querySelector("#theme-toggle");
const themeIcons = document.querySelectorAll("[data-theme-icon]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".top-menu");
const quoteForm = document.querySelector("#quote-request-form");
const root = document.documentElement;
const themePreferenceKey = "ken-electronics-theme";
const systemThemePreference = window.matchMedia("(prefers-color-scheme: dark)");
const savedTheme = localStorage.getItem(themePreferenceKey);
const hasSavedTheme = savedTheme === "dark" || savedTheme === "light";

let isDarkMode = hasSavedTheme ? savedTheme === "dark" : systemThemePreference.matches;

function setTheme(darkMode) {
  isDarkMode = darkMode;
  root.dataset.theme = darkMode ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(darkMode));
  themeToggle.setAttribute("aria-label", darkMode ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = darkMode ? "Switch to light mode" : "Switch to dark mode";
  themeIcons.forEach((icon) => {
    icon.toggleAttribute("hidden", icon.dataset.themeIcon !== (darkMode ? "moon" : "sun"));
  });
}

if (themeToggle) {
  setTheme(isDarkMode);
  themeToggle.addEventListener("click", () => {
    setTheme(!isDarkMode);
    localStorage.setItem(themePreferenceKey, isDarkMode ? "dark" : "light");
  });

  systemThemePreference.addEventListener("change", (event) => {
    if (!hasSavedTheme && !localStorage.getItem(themePreferenceKey)) {
      setTheme(event.matches);
    }
  });
}

if (menuToggle && navigation) {
  const closeMenu = () => {
    navigation.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    navigation.classList.toggle("menu-open", !isExpanded);
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  });

  navigation.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

