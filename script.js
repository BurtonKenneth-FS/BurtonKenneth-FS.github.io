const themeToggle = document.querySelector("#theme-toggle");
const themeIcons = document.querySelectorAll("[data-theme-icon]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".top-menu");
const quoteForm = document.querySelector("#quote-request-form");
const quoteFormNote = document.querySelector("#quote-form-note");
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

function setFormNote(type, message) {
  if (!quoteFormNote) {
    return;
  }

  quoteFormNote.classList.remove("success", "error", "pending");
  quoteFormNote.classList.add(type);
  quoteFormNote.textContent = message;
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
  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    const submitButton = quoteForm.querySelector("button[type='submit']");
    const formData = new FormData(quoteForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      request: String(formData.get("request") || "").trim(),
      _subject: `Quote request from ${String(formData.get("name") || "Customer")}`,
      _captcha: "false",
      _template: "table"
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    setFormNote("pending", "Sending your request...");

    try {
      const response = await fetch("https://formsubmit.co/ajax/kenseas.help@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error("The form service returned an unreadable response. Please try again or contact us directly.");
      }

      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error(result.message || "The form service did not accept your request.");
      }

      quoteForm.reset();
      setFormNote("success", "Your request was accepted. We’ll be in touch soon. If this is your first submission, check kenseas.help@gmail.com (including spam) for FormSubmit’s activation email.");
    } catch (error) {
      const detail = error instanceof Error ? error.message : "An unexpected error occurred.";
      setFormNote("error", `${detail} Please email kenseas.help@gmail.com or call (305)-215-8797.`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Request a Quote";
      }
    }
  });
}
