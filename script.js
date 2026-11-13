/**
 * ============================================================================
 * PORTFOLIO CLIENT SCRIPT (Vanilla JavaScript - No dependencies)
 * ============================================================================
 * 
 * TABLE OF CONTENTS:
 * 1. Configuration & Endpoint
 * 2. Mobile Navigation Toggle
 * 3. Active Nav Link Highlighting (ScrollSpy)
 * 4. Scroll Reveal Animation (prefers-reduced-motion compliant)
 * 5. Contact Form Handling (Validation, Honeypot, JSON fetch)
 * 6. Dynamic Year in Footer
 * ============================================================================
 */

// ============================================================================
// 1. CONFIGURATION & ENDPOINT
// ============================================================================
// TODO: Replace 'YOUR_ID' below with your actual Formspree form ID.
// Example: const FORM_ENDPOINT = "https://formspree.io/f/mqkvnzyz";
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_ID";


document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initScrollReveal();
  initContactForm();
  initDynamicYear();
});


// ============================================================================
// 1b. THEME TOGGLE (BRIGHT DEFAULT)
// ============================================================================
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  // Explicitly default to bright / light mode
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

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close menu with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Close menu if user clicks outside
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
    rootMargin: "-20% 0px -65% 0px", // triggers when section is active in upper-middle viewport
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

  // Check user motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    // Immediately display elements without transition
    revealElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.1
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}


// ============================================================================
// 5. CONTACT FORM HANDLING (Validation, Honeypot, JSON Fetch)
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

  // Standard email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Live input cleanup when user types
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

    // Reset status & error messages
    statusDiv.className = "form-status";
    statusDiv.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    emailInput.classList.remove("is-invalid");
    messageInput.classList.remove("is-invalid");

    // Check honeypot field (anti-spam)
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value.trim() !== "") {
      // Spam bot detected: pretend success without sending
      displayStatus("success", "Thank you for reaching out! Your message has been sent.");
      form.reset();
      return;
    }

    // Client-side Validation
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
      // Focus first erroneous field
      if (emailInput.classList.contains("is-invalid")) {
        emailInput.focus();
      } else {
        messageInput.focus();
      }
      return;
    }

    // Check if user still has the placeholder endpoint
    if (FORM_ENDPOINT.includes("YOUR_ID")) {
      displayStatus(
        "error",
        "Form endpoint is not configured yet. Please email me directly at akshitbandi.carrer@gmail.com, or paste your Formspree ID into script.js."
      );
      return;
    }

    // Prepare JSON payload
    // Formspree recognizes 'email' as the sender/reply-to address.
    const payload = {
      name: nameInput.value.trim(),
      email: emailVal,
      message: messageVal
    };

    // Set UI to loading state
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
        let errorMsg = "Something went wrong while sending your message. Please try again or use the direct email link above.";
        if (responseData && responseData.errors && responseData.errors.length > 0) {
          errorMsg = responseData.errors.map((err) => err.message).join(", ");
        }
        displayStatus("error", errorMsg);
      }
    } catch (err) {
      displayStatus(
        "error",
        "Network error: Unable to reach the contact service. Please check your connection or email me directly using the link above."
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
// 6. DYNAMIC CURRENT YEAR IN FOOTER
// ============================================================================
function initDynamicYear() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }
}
