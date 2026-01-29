/* ============================================
   THE ALABASTER JAR - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ============================================
  // Header Scroll Effect
  // ============================================
  const header = document.querySelector('.site-header');

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check on load

  // ============================================
  // Mobile Menu Toggle
  // ============================================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking nav links
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ============================================
  // Professional Scroll Reveal Animations
  // ============================================
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  const scrollRevealOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const scrollRevealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add small delay for elements in viewport on load
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 50);
        scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, scrollRevealOptions);

  scrollRevealElements.forEach(el => scrollRevealObserver.observe(el));

  // Apply stagger index to groups
  document.querySelectorAll('.stagger-group').forEach(group => {
    const items = group.querySelectorAll('.scroll-reveal');
    items.forEach((item, index) => {
      item.style.setProperty('--stagger-index', index);
    });
  });

  // ============================================
  // Legacy Fade In Animations (backwards compatible)
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = header.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ============================================
  // Active Navigation State
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-links a');

  navLinksAll.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage ||
      (currentPage === '' && linkPage === 'index.html') ||
      (currentPage === 'index.html' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // Counter Animation for Statistics
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        if (el.getAttribute('data-suffix')) {
          el.textContent += el.getAttribute('data-suffix');
        }
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
        if (el.getAttribute('data-suffix')) {
          el.textContent += el.getAttribute('data-suffix');
        }
      }
    }, 16);
  }

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => {
    if (el.getAttribute('data-count')) {
      counterObserver.observe(el);
    }
  });

  // ============================================
  // Form Validation (Basic)
  // ============================================
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }

        // Email validation
        if (field.type === 'email' && field.value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('Please fill in all required fields correctly.');
      }
    });
  });

  // ============================================
  // Accordion (for FAQ or expandable sections)
  // ============================================
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const content = this.nextElementSibling;
      const isActive = this.classList.contains('active');

      // Close all other accordions
      accordionTriggers.forEach(t => {
        t.classList.remove('active');
        t.nextElementSibling.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        this.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ============================================
  // Tab Navigation
  // ============================================
  const tabTriggers = document.querySelectorAll('.tab-trigger');

  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const tabGroup = this.closest('.tab-group');
      const targetId = this.getAttribute('data-tab');

      // Update triggers
      tabGroup.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update content
      tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tabGroup.querySelector(`#${targetId}`).classList.add('active');
    });
  });

  // ============================================
  // Image Lazy Loading (fallback for older browsers)
  // ============================================
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ============================================
  // Donation Amount Selection
  // ============================================
  const donationAmounts = document.querySelectorAll('.donation-amount');
  const customAmountInput = document.querySelector('.custom-amount-input');

  if (donationAmounts.length > 0) {
    donationAmounts.forEach(btn => {
      btn.addEventListener('click', function () {
        donationAmounts.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');

        if (customAmountInput) {
          if (this.classList.contains('custom')) {
            customAmountInput.style.display = 'block';
            customAmountInput.focus();
          } else {
            customAmountInput.style.display = 'none';
          }
        }
      });
    });
  }

  // ============================================
  // Scroll Progress Indicator
  // ============================================
  const scrollProgressContainer = document.querySelector('.scroll-progress-container');
  const scrollProgressIndicator = document.querySelector('.scroll-progress-indicator');

  if (scrollProgressContainer && scrollProgressIndicator) {
    // Calculate circumference: 2 * PI * r (r=45)
    const circumference = 2 * Math.PI * 45;
    scrollProgressIndicator.style.strokeDasharray = `${circumference} ${circumference}`;
    scrollProgressIndicator.style.strokeDashoffset = circumference;

    window.addEventListener('scroll', () => {
      // Show/Hide based on scroll position
      if (window.scrollY > 300) {
        scrollProgressContainer.classList.add('visible');
      } else {
        scrollProgressContainer.classList.remove('visible');
      }

      // Update Progress
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      const offset = circumference - (scrollPercent * circumference);

      scrollProgressIndicator.style.strokeDashoffset = offset;
    });

    // Scroll to Top on Click
    scrollProgressContainer.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // Progress Bar Animation (Donate Page)
  // ============================================
  const progressBars = document.querySelectorAll('.progress-bar-fill');

  if (progressBars.length > 0) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.getAttribute('data-width');
          // Add a small delay to make it noticeable
          setTimeout(() => {
            bar.style.width = width;
          }, 100);
          progressObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    progressBars.forEach(bar => progressObserver.observe(bar));
  }

  // ============================================
  // Console Message
  // ============================================
  console.log('%c🕊️ The Alabaster Jar', 'font-size: 24px; font-weight: bold; color: #C41E3A;');
  console.log('%cBeing the fragrance of Christ in a hurting world', 'font-size: 14px; color: #D4A574;');
  console.log('%cLearn more: https://thealabasterjar.org', 'font-size: 12px; color: #666;');

});

// ============================================
// Utility Functions (Global)
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
