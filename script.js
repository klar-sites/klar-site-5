(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;

  function initThemeToggle() {
    const toggles = document.querySelectorAll('[aria-label="Toggle theme"]');

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        root.classList.toggle("dark");

        try {
          window.localStorage.setItem("pulsehq-theme", root.classList.contains("dark") ? "dark" : "light");
        } catch (error) {
          /* localStorage may be unavailable in private contexts; theme still toggles. */
        }
      });
    });

    try {
      const savedTheme = window.localStorage.getItem("pulsehq-theme");
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        root.classList.add("dark");
      }
    } catch (error) {
      /* Ignore storage or matchMedia failures. */
    }
  }

  function initMobileNavigation() {
    const toggle = document.querySelector(".mobile-nav-toggle");
    const nav = document.querySelector("#primary-navigation");

    if (!toggle || !nav) {
      return;
    }

    function closeNavigation() {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      body.classList.remove("nav-locked");
    }

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      nav.classList.toggle("is-open", !isExpanded);
      body.classList.toggle("nav-locked", !isExpanded);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNavigation();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        closeNavigation();
      }
    });
  }

  function initFaqAccordion() {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach((question) => {
      const answerId = question.getAttribute("aria-controls");
      const answer = answerId ? document.getElementById(answerId) : question.nextElementSibling;

      if (!answer) {
        return;
      }

      question.addEventListener("click", () => {
        const isOpen = question.getAttribute("aria-expanded") === "true";

        question.setAttribute("aria-expanded", String(!isOpen));
        answer.classList.toggle("is-open", !isOpen);
      });
    });
  }

  function initRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            activeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -48px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function initSmoothAnchorFocus() {
    const internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    internalLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);

        if (!target) {
          return;
        }

        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }

        window.setTimeout(() => {
          target.focus({ preventScroll: true });
        }, 420);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initMobileNavigation();
    initFaqAccordion();
    initRevealAnimations();
    initSmoothAnchorFocus();
  });
})();
