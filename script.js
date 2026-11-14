/**
 * ============================================================================
 * AKSHITH BANDI — PORTFOLIO CLIENT SCRIPT (Vanilla JavaScript)
 * ============================================================================
 */

// FormSubmit endpoint delivering directly to your Gmail inbox
const FORM_ENDPOINT = "https://formsubmit.co/ajax/akshitbandi.dev@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initScrollReveal();
  initContactForm();
  initDynamicYear();
  initCardTilt();
  initStarModal();
});

// ============================================================================
// 1. THEME TOGGLE (BRIGHT DEFAULT)
// ============================================================================
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

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
    link.addEventListener("click", closeMenu);
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
// 5. SUBTLE CARD 3D TILT EFFECT
// ============================================================================
function initCardTilt() {
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

      card.style.transform = `perspective(1000px) rotateY(${deltaX * 3}deg) rotateX(${-deltaY * 3}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ============================================================================
// 6. GITHUB STAR PROMPT MODAL (Wise & Professional Pop-up)
// ============================================================================
function initStarModal() {
  const modal = document.getElementById("star-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const dismissBtn = document.getElementById("modal-dismiss-btn");
  const starBtn = document.getElementById("modal-star-btn");

  if (!modal) return;

  const storageKey = "akshith_portfolio_github_star_prompt";
  const userAction = localStorage.getItem(storageKey);

  // If user already responded (starred or dismissed), don't disturb them
  if (userAction === "starred" || userAction === "dismissed") {
    return;
  }

  function openModal() {
    modal.classList.add("is-active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(actionType) {
    modal.classList.remove("is-active");
    modal.setAttribute("aria-hidden", "true");
    if (actionType) {
      localStorage.setItem(storageKey, actionType);
    }
  }

  // Gracefully show popup 3.5 seconds after arrival so visitor first enjoys the page
  setTimeout(() => {
    openModal();
  }, 3500);

  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal("dismissed"));
  }

  if (dismissBtn) {
    dismissBtn.addEventListener("click", () => closeModal("dismissed"));
  }

  if (starBtn) {
    starBtn.addEventListener("click", () => {
      closeModal("starred");
    });
  }

  // Close when clicking backdrop outside the card
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal("dismissed");
    }
  });

  // Close with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeModal("dismissed");
    }
  });
}

// ============================================================================
// 7. CONTACT FORM HANDLING (Direct Gmail Delivery via FormSubmit)
// ============================================================================
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameInput = document.getElementById("form-name");
  const emailInput = document.getElementById("form-email");
  const messageInput = document.getElementById("form-message");
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");
  const submitBtn = document.getElementById("submit-btn");
  const btnText = submitBtn.querySelector(".btn-text") || submitBtn;
  const statusDiv = document.getElementById("form-status");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  nameInput.addEventListener("input", () => {
    nameInput.classList.remove("is-invalid");
    if (nameError) nameError.textContent = "";
  });

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
    if (nameError) nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    nameInput.classList.remove("is-invalid");
    emailInput.classList.remove("is-invalid");
    messageInput.classList.remove("is-invalid");

    // Spam honeypot
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value.trim() !== "") {
      displayStatus("success", "Thank you for reaching out! Your message has been sent.");
      form.reset();
      return;
    }

    // Validation (Name, Email, Message all mandatory)
    let hasError = false;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (!nameVal) {
      if (nameError) nameError.textContent = "Please enter your name.";
      nameInput.classList.add("is-invalid");
      hasError = true;
    } else if (nameVal.length < 2) {
      if (nameError) nameError.textContent = "Name must be at least 2 characters.";
      nameInput.classList.add("is-invalid");
      hasError = true;
    }

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
      if (nameInput.classList.contains("is-invalid")) {
        nameInput.focus();
      } else if (emailInput.classList.contains("is-invalid")) {
        emailInput.focus();
      } else {
        messageInput.focus();
      }
      return;
    }

    // Payload for FormSubmit (sets sender name and visitor's email as Reply-To)
    const payload = {
      name: nameVal,
      email: emailVal,
      message: messageVal,
      _subject: `New Portfolio Message from ${nameVal}`,
      _replyto: emailVal,
      _template: "table",
      _captcha: "false"
    };

    submitBtn.disabled = true;
    const originalBtnText = btnText.textContent;
    btnText.textContent = "Sending...";

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json().catch(() => null);

      if (response.ok || (responseData && responseData.success === "true")) {
        displayStatus(
          "success",
          `Thank you, ${nameVal}! Your message has been sent directly to my Gmail. I will reply to ${emailVal} soon.`
        );
        form.reset();
      } else {
        let errorMsg = "Something went wrong sending your message. Please try again in a moment.";
        if (responseData && responseData.message) {
          errorMsg = responseData.message;
        }
        displayStatus("error", errorMsg);
      }
    } catch (err) {
      displayStatus(
        "error",
        "Network error: Unable to send message. Please check your internet connection and try again."
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
