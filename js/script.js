const SITE_CONFIG = {
  linkedinUrl: "https://www.linkedin.com/in/harshoza111/",
  githubUrl: "https://github.com/harshoza111",
  email: "2003harshoza@gmail.com",
  cvUrl: "Harsh_Oza_MS_CV.pdf",
};

document.addEventListener("DOMContentLoaded", () => {
  initSiteConfig();
  initThemeToggle();
  initMobileMenu();
  initScrollSpy();
  initProjectFilters();
  initBackToTop();
  initEmailCopy();
});

function initSiteConfig() {
  document.querySelectorAll('[data-config-link="linkedin"]').forEach((link) => {
    if (SITE_CONFIG.linkedinUrl && SITE_CONFIG.linkedinUrl !== "#") {
      link.setAttribute("href", SITE_CONFIG.linkedinUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  document.querySelectorAll('[data-config-link="github"]').forEach((link) => {
    if (SITE_CONFIG.githubUrl && SITE_CONFIG.githubUrl !== "#") {
      link.setAttribute("href", SITE_CONFIG.githubUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  document.querySelectorAll('[data-config-link="cv"]').forEach((link) => {
    if (SITE_CONFIG.cvUrl) {
      link.setAttribute("href", SITE_CONFIG.cvUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
  });

  document.querySelectorAll('[data-config-link="email"]').forEach((link) => {
    link.setAttribute("href", `mailto:${SITE_CONFIG.email}`);
  });

  document.querySelectorAll('[data-config-display="email"]').forEach((el) => {
    el.textContent = SITE_CONFIG.email;
  });
}

function initThemeToggle() {
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = savedTheme || (systemPrefersLight ? "light" : "dark");

  applyTheme(initialTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });

  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (!localStorage.getItem("portfolio-theme")) {
      applyTheme(e.matches ? "light" : "dark");
    }
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  if (!themeToggleBtn) return;

  const sunIcon = themeToggleBtn.querySelector(".icon-sun");
  const moonIcon = themeToggleBtn.querySelector(".icon-moon");

  if (theme === "light") {
    if (sunIcon) sunIcon.style.display = "none";
    if (moonIcon) moonIcon.style.display = "block";
    themeToggleBtn.setAttribute("aria-label", "Switch to dark theme");
  } else {
    if (sunIcon) sunIcon.style.display = "block";
    if (moonIcon) moonIcon.style.display = "none";
    themeToggleBtn.setAttribute("aria-label", "Switch to light theme");
  }
}

function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.getAttribute("data-filter");
      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (filter === "all" || cardCategory === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  }, { passive: true });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initEmailCopy() {
  const copyBtn = document.getElementById("copy-email-btn");
  const feedbackEl = document.getElementById("copy-feedback");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(SITE_CONFIG.email);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = SITE_CONFIG.email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      if (feedbackEl) {
        feedbackEl.textContent = "✓ Email copied to clipboard!";
        setTimeout(() => {
          feedbackEl.textContent = "";
        }, 3000);
      }
    } catch (err) {
      if (feedbackEl) {
        feedbackEl.textContent = "Email: " + SITE_CONFIG.email;
      }
    }
  });
}
