/**
 * ============================================================================
 * AKSHITH BANDI — PORTFOLIO CLIENT SCRIPT (Vanilla JavaScript)
 * ============================================================================
 */

// Formspree Form ID configuration
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_ID";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initScrollReveal();
  initContactForm();
  initDynamicYear();
  initCopyEmail();
  initCardTilt();
});

// ============================================================================
// 1. THEME TOGGLE (BRIGHT DEFAULT)
// ============================================================================
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  // Explicitly default to bright 'light' mode
  const savedTheme = localStorage.getItem("portfolio-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

// ============================================================================
// 2. MOBILE NAVIGATION TOGGLE
// ============================================================================
function initMobileNav() {
  const toggleBtn = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!toggleBtn || !navMenu) return;

  function closeMenu() {
    toggleBtn.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
  }

  function toggleMenu() {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    toggleBtn.setAttribute("aria-expanded", (!isExpanded).toString());
    navMenu.classList.toggle("is-open", !isExpanded);
  }

  toggleBtn.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  document.addEventListener("click", (e) => {
    if (
      navMenu.classList.contains("is-open") &&
      !navMenu.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

// ============================================================================
// 3. ACTIVE NAV LINK HIGHLIGHTING (SCROLLSPY)
// ============================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-list a.nav-link");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -65% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else if (link.getAttribute("href").startsWith("#")) {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// ============================================================================
// 4. SCROLL REVEAL ANIMATION (Respects prefers-reduced-motion)
// ============================================================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!revealElements.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.1
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

// ============================================================================
// 5. ONE-CLICK EMAIL COPY & TOAST NOTIFICATION
// ============================================================================
function initCopyEmail() {
  const copyButtons = document.querySelectorAll(".copy-email-btn");
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("toast-visible");
    setTimeout(() => {
      toast.classList.remove("toast-visible");
    }, 2500);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-email") || "akshitbandi.dev@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied to clipboard: " + email);
        const label = btn.querySelector(".copy-label");
        if (label) {
          const original = label.textContent;
          label.textContent = "Copied! ✓";
          setTimeout(() => {
            label.textContent = original;
          }, 2000);
        }
      } catch (err) {
        // Fallback for older browsers
        window.location.href = "mailto:" + email;
      }
    });
  });
}

// ============================================================================
// 6. SUBTLE CARD 3D TILT EFFECT
// ============================================================================
function initCardTilt() {
  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      card.style.transform = `perspective(1000px) rotateY(${deltaX * 3}deg) rotateX(${-deltaY * 3}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ============================================================================
// 7. CONTACT FORM HANDLING
// ============================================================================
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("form-name");
  const emailInput = document.getElementById("form-email");
  const messageInput = document.getElementById("form-message");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = submitBtn.querySelector(".btn-text") || submitBtn;
  const statusDiv = document.getElementById("form-status");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  emailInput.addEventListener("input", () => {
    emailInput.classList.remove("is-invalid");
    emailError.textContent = "";
  });

  messageInput.addEventListener("input", () => {
    messageInput.classList.remove("is-invalid");
    messageError.textContent = "";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusDiv.className = "form-status";
    statusDiv.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    emailInput.classList.remove("is-invalid");
    messageInput.classList.remove("is-invalid");

    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value.trim() !== "") {
      displayStatus("success", "Thank you for reaching out! Your message has been sent.");
      form.reset();
      return;
    }

    let hasError = false;
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (!emailVal) {
      emailError.textContent = "Please enter your email address.";
      emailInput.classList.add("is-invalid");
      hasError = true;
    } else if (!emailRegex.test(emailVal)) {
      emailError.textContent = "Please enter a valid email address (e.g. name@example.com).";
      emailInput.classList.add("is-invalid");
      hasError = true;
    }

    if (!messageVal) {
      messageError.textContent = "Please write a message.";
      messageInput.classList.add("is-invalid");
      hasError = true;
    } else if (messageVal.length < 10) {
      messageError.textContent = "Message must be at least 10 characters long.";
      messageInput.classList.add("is-invalid");
      hasError = true;
    }

    if (hasError) {
      if (emailInput.classList.contains("is-invalid")) {
        emailInput.focus();
      } else {
        messageInput.focus();
      }
      return;
    }

    if (FORM_ENDPOINT.includes("YOUR_ID")) {
      displayStatus(
        "error",
        "Form endpoint is not configured yet. Please email me directly at akshitbandi.dev@gmail.com, or paste your Formspree ID into script.js."
      );
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      email: emailVal,
      message: messageVal
    };

    submitBtn.disabled = true;
    const originalBtnText = btnText.textContent;
    btnText.textContent = "Sending...";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json().catch(() => null);

      if (response.ok) {
        displayStatus(
          "success",
          "Thank you! Your message was sent successfully. I will get back to you shortly."
        );
        form.reset();
      } else {
        let errorMsg = "Something went wrong while sending your message. Please try again or use direct email.";
        if (responseData && responseData.errors && responseData.errors.length > 0) {
          errorMsg = responseData.errors.map((err) => err.message).join(", ");
        }
        displayStatus("error", errorMsg);
      }
    } catch (err) {
      displayStatus(
        "error",
        "Network error: Unable to reach the contact service. Please email me directly at akshitbandi.dev@gmail.com."
      );
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = originalBtnText;
    }
  });

  function displayStatus(type, message) {
    statusDiv.textContent = message;
    statusDiv.className = `form-status status-${type}`;
    statusDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ============================================================================
// 8. DYNAMIC YEAR
// ============================================================================
function initDynamicYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
}
