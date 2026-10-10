// OpenSpace Landing Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Top-Left Logo Click -> Move Smoothly to Top
  const brandLogos = document.querySelectorAll('.brand');
  brandLogos.forEach(logo => {
    logo.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      if (window.location.hash) {
        history.pushState(null, null, window.location.pathname);
      }
    });
  });

  // 2. Mobile Navigation Toggle
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  
  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    navigation?.classList.toggle('open', !isOpen);
  });

  navigation?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Open menu');
    });
  });

  // 3. How OpenSpace Operates Tabs
  const journeyTabs = [...document.querySelectorAll('[role="tab"]')];
  function selectJourney(tab) {
    journeyTabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const targetId = item.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.hidden = !active;
      }
    });
  }

  journeyTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectJourney(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' 
        ? 0 
        : event.key === 'End' 
          ? journeyTabs.length - 1 
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + journeyTabs.length) % journeyTabs.length;
      selectJourney(journeyTabs[nextIndex]);
      journeyTabs[nextIndex].focus();
    });
  });

  // 4. Interactive 3D Perspective Tilt on Phone Devices
  const phoneShowcases = document.querySelectorAll('.phone-showcase');
  phoneShowcases.forEach(showcase => {
    showcase.addEventListener('mousemove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = -(y / (rect.height / 2)) * 7;
      const rotateY = (x / (rect.width / 2)) * 7;
      
      const chassis = showcase.querySelector('.phone-chassis');
      if (chassis) {
        chassis.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      }
    });

    showcase.addEventListener('mouseleave', () => {
      const chassis = showcase.querySelector('.phone-chassis');
      if (chassis) {
        chassis.style.transform = '';
      }
    });
  });

  // 5. Pre-Launch Waitlist Form
  const waitlistForm = document.getElementById('waitlist-form');
  const roleOptions = document.querySelectorAll('.role-option');
  const feedbackEl = document.getElementById('form-feedback');
  const nameInput = document.getElementById('waitlist-name');
  const emailInput = document.getElementById('waitlist-email');
  const locationInput = document.getElementById('waitlist-location');
  const submitBtn = document.getElementById('waitlist-btn');

  // Role toggle
  roleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      roleOptions.forEach(r => r.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Let the browser POST to Formspree so its hosted CAPTCHA can be completed.
  waitlistForm?.addEventListener('submit', (e) => {
    if (feedbackEl) feedbackEl.textContent = '';
    
    // Validate Name
    const nameVal = nameInput?.value.trim();
    if (!nameVal || nameVal.length < 2) {
      e.preventDefault();
      nameInput?.classList.add('input-error');
      if (feedbackEl) feedbackEl.textContent = 'Please enter your full name.';
      nameInput?.focus();
      return;
    } else {
      nameInput?.classList.remove('input-error');
    }

    // Validate Email
    const emailVal = emailInput?.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      e.preventDefault();
      emailInput?.classList.add('input-error');
      if (feedbackEl) feedbackEl.textContent = 'Please enter a valid email address.';
      emailInput?.focus();
      return;
    } else {
      emailInput?.classList.remove('input-error');
    }

    const locVal = locationInput?.value.trim();
    if (!locVal || locVal.length < 2) {
      e.preventDefault();
      locationInput?.classList.add('input-error');
      if (feedbackEl) feedbackEl.textContent = 'Please enter your location.';
      locationInput?.focus();
      return;
    } else {
      locationInput?.classList.remove('input-error');
    }

    if (submitBtn) {
      submitBtn.innerHTML = '<span>Opening secure verification...</span> ⏳';
    }
  });

  window.addEventListener('pageshow', () => {
    if (submitBtn) {
      submitBtn.innerHTML = '<span>Claim Early Access</span> <span aria-hidden="true">🚀</span>';
    }
  });

  // 6. Dynamic Year in Footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 7. Top Scroll Reading Progress & Header Glass Elevation
  const progressBar = document.getElementById('scroll-progress');
  const siteHeader = document.querySelector('.site-header');

  function updateScrollProgress() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      progressBar.style.width = `${pct}%`;
    }
    if (siteHeader) {
      siteHeader.classList.toggle('is-scrolled', scrollY > 20);
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // 8. Scroll-Down Reveal Animations
  const revealElements = [...document.querySelectorAll('.scroll-reveal')];

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px' // Triggers when 40px inside viewport so user visibly sees animation
    });

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      // If element is already in initial viewport on page load (Hero section), reveal with subtle stagger
      if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
        setTimeout(() => {
          el.classList.add('is-revealed');
        }, 80);
      } else {
        // Elements below the fold wait until user scrolls down!
        observer.observe(el);
      }
    });

    // Secondary scroll trigger for guaranteed responsiveness on all scroll types
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const vh = window.innerHeight;
          revealElements.forEach(el => {
            if (!el.classList.contains('is-revealed')) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= vh - 40 && rect.bottom >= 0) {
                el.classList.add('is-revealed');
                observer.unobserve(el);
              }
            }
          });
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
});
