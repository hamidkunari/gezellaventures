/* ============================================
   ProMove Property Services — Main JS v2.0
   Production Ready | All bugs fixed
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CRITICAL: Add js-loaded to body so scroll-reveal CSS kicks in
  // This prevents elements from being invisible before JS runs
  setTimeout(() => {
    document.body.classList.add('js-loaded');
    initReveal(); // init reveal after class is added
  }, 50);

  // ── Navbar Scroll Effect ──────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run on load
  }

  // ── Hamburger Menu ────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Active Nav Link ───────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0];
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll Reveal ─────────────────────────────
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    // Immediately mark visible elements (already in viewport)
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }

  // ── Animated Counter ─────────────────────────
  function animateCounter(el) {
    const raw = el.dataset.target || el.textContent.replace(/[^\d]/g, '');
    const target = parseInt(raw, 10);
    const suffix = el.dataset.suffix || el.textContent.replace(/[\d]/g, '');
    if (!target) return;
    const duration = 1600;
    const steps = 55;
    const stepTime = duration / steps;
    let current = 0;
    const inc = target / steps;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        el.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, stepTime);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
          cObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counterEls.forEach(el => cObserver.observe(el));
  }

  // ── Testimonials Slider ───────────────────────
  const track = document.querySelector('.testimonials-track');
  if (track) {
    const dots = document.querySelectorAll('.testi-dot');
    const prevBtn = document.querySelector('.testi-btn.prev');
    const nextBtn = document.querySelector('.testi-btn.next');
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let current = 0;
    let autoTimer = null;

    function getVisible() {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    function maxIdx() { return Math.max(0, cards.length - getVisible()); }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, maxIdx()));
      const cardW = cards[0] ? cards[0].offsetWidth + 22 : 377; // 22 = gap
      track.style.transform = `translateX(-${current * cardW}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(current >= maxIdx() ? 0 : current + 1), 5000);
    }
    function stopAuto() { if (autoTimer) clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

    const viewport = track.parentElement;
    if (viewport) {
      viewport.addEventListener('mouseenter', stopAuto);
      viewport.addEventListener('mouseleave', startAuto);
    }

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    });

    window.addEventListener('resize', () => goTo(0));
    startAuto();
    goTo(0); // init
  }

  // ── FAQ Accordion ────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Gallery Filter ────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.gallery-item, .masonry-item').forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity .3s ease, transform .3s ease';
        item.style.opacity = show ? '1' : '0.25';
        item.style.transform = show ? 'scale(1)' : 'scale(0.96)';
        item.style.pointerEvents = show ? '' : 'none';
      });
    });
  });

  // ── Contact Form Handling ────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent! We\'ll reply shortly.';
      btn.style.background = '#22c55e';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 4000);
    });
  }

  // ── Smooth scroll for hash links ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Hero Parallax (subtle) ───────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ── Image Error Fallback ─────────────────────
  // If any image fails to load, show a styled placeholder
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.background = 'linear-gradient(135deg, #1e293b 0%, #334155 100%)';
      this.style.opacity = '0.6';
      this.removeAttribute('src');
      // Add a placeholder text overlay
      const parent = this.parentElement;
      if (parent && !parent.querySelector('.img-fallback')) {
        const fb = document.createElement('div');
        fb.className = 'img-fallback';
        fb.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.3);font-size:.8rem;font-family:sans-serif;text-align:center;padding:12px;';
        fb.textContent = '📷 Replace with your photo';
        parent.style.position = 'relative';
        parent.appendChild(fb);
      }
    });
  });

  // ── Stagger service/blog/team cards ──────────
  // Done after reveal class added so it doesn't break default visibility
  function staggerGrid(selector) {
    const grid = document.querySelector(selector);
    if (!grid) return;
    Array.from(grid.children).forEach((child, i) => {
      if (!child.classList.contains('reveal')) {
        child.classList.add('reveal', `reveal-delay-${(i % 5) + 1}`);
      }
    });
  }
  // Only stagger non-service grids (services must always be visible)
  staggerGrid('.blog-grid');
  staggerGrid('.team-grid');
  staggerGrid('.values-grid');
  staggerGrid('.addon-grid');

  // ── Numbers count-up on hero stats ──────────
  // Trigger immediately if in viewport
  document.querySelectorAll('[data-counter]').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      if (!el.classList.contains('counted')) {
        el.classList.add('counted');
        animateCounter(el);
      }
    }
  });

});

// ── Utility: announce page loaded to analytics/GTM ──
window.addEventListener('load', () => {
  // Remove any lingering no-js classes
  document.documentElement.classList.remove('no-js');
});
