// OpenSpace Main Application Scripts

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
      // Clear hash from URL cleanly if any
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

  // 4. Colombo Spot Explorer Filters
  const filterButtons = document.querySelectorAll('.spot-filter-bar .filter-btn');
  const spotCards = document.querySelectorAll('.spots-grid .spot-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      spotCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const tags = card.dataset.tags || '';
          if (tags.includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });

  // 5. Pre-Launch Waitlist Form
  const waitlistForm = document.getElementById('waitlist-form');
  const roleOptions = document.querySelectorAll('.role-option');
  const feedbackEl = document.getElementById('form-feedback');
  const contactInput = document.getElementById('user-contact');

  roleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      roleOptions.forEach(r => r.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  waitlistForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = contactInput?.value.trim();
    if (!value || value.length < 5) {
      if (feedbackEl) {
        feedbackEl.className = 'form-feedback error';
        feedbackEl.textContent = 'Please enter a valid email address or mobile number.';
      }
      contactInput?.focus();
      return;
    }

    const selectedRole = document.querySelector('input[name="role"]:checked')?.value || 'driver';
    const selectedArea = document.getElementById('user-area')?.value || 'Colombo';

    // Store in localStorage for persistence
    try {
      localStorage.setItem('openspace_waitlist', JSON.stringify({
        contact: value,
        role: selectedRole,
        area: selectedArea,
        date: new Date().toISOString()
      }));
    } catch (_) {}

    if (feedbackEl) {
      feedbackEl.className = 'form-feedback success';
      feedbackEl.textContent = `✓ Thank you! You have been added to the priority ${selectedRole === 'driver' ? 'Driver' : 'Space Host'} invite list for ${selectedArea}.`;
    }

    const submitBtn = document.getElementById('waitlist-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Joined Priority List</span> ✓';
    }
  });

  // 6. Dynamic Year in Footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 7. Safe Scroll Reveal Animations (Never leaves content stuck hidden)
  const motionIsAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motionIsAllowed && 'IntersectionObserver' in window) {
    const revealGroups = [
      '.hero-copy > *',
      '.hero-screen',
      '.trust-item',
      '.section-heading',
      '.problem-card',
      '.journey-tabs',
      '.steps-grid .step',
      '.section-copy > *',
      '.benefit-card',
      '.commitment-box',
      '.product-visual .screen-stage',
      '.commission-card',
      '.spot-card',
      '.use-card',
      '.waitlist-box',
      '.faq-list details',
      '.closing-inner > *',
      '.footer-grid > *'
    ];

    const revealElements = [...document.querySelectorAll(revealGroups.join(', '))];
    revealElements.forEach((element, index) => {
      element.dataset.reveal = '';
      element.style.setProperty('--reveal-delay', `${(index % 4) * 60}ms`);
    });

    document.body.classList.add('motion-ready');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.05,
      rootMargin: '120px 0px 120px 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));

    // Absolute safety fallback: after 2 seconds, reveal all elements so nothing ever stays hidden
    setTimeout(() => {
      revealElements.forEach(el => el.classList.add('is-visible'));
    }, 2000);
  }
});
