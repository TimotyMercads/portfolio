const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    flashSection(a.getAttribute('href'));
  }));

  requestAnimationFrame(() => document.body.classList.add('loaded'));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  // Animated stat counters (hero)
  const animateCount = (el, target, duration) => {
    if (reduceMotion) { el.textContent = target; return; }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(p * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  setTimeout(() => {
    document.querySelectorAll('.stat-num').forEach(el => animateCount(el, +el.dataset.target, 1100));
  }, 500);

  // Spotlight glow that follows the cursor on cards
  document.querySelectorAll('.card, .contact-card').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Magnetic hero buttons
  if (!reduceMotion) {
    document.querySelectorAll('.hero-cta .btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // Stagger reveal delays per section
  const stagger = (sel, step) => document.querySelectorAll(sel).forEach((el,i) => el.style.transitionDelay = (i*step)+'ms');
  stagger('#about .chip', 45);
  stagger('#experience .t-item', 110);
  stagger('#achievements .ach-list li', 70);
  stagger('#projects .card', 90);
  stagger('#contact .contact-card', 80);

  // Reveal each section once when it scrolls into view
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  ['about','experience','achievements','projects','contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) revealObs.observe(el);
  });

  // Ripple on click for buttons, cards, and github links
  document.querySelectorAll('.btn, .contact-card, .card .gh').forEach(el => {
    el.addEventListener('click', function(e){
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - r.left - size/2) + 'px';
      span.style.top = (e.clientY - r.top - size/2) + 'px';
      this.appendChild(span);
      setTimeout(() => span.remove(), 600);
    });
  });

  const photoFrame = document.getElementById('photoFrame');
  const photoWrap = document.getElementById('photoWrap');
  if (!reduceMotion && photoFrame) {
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const r = photoWrap.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width, dy = (e.clientY - cy) / r.height;
      photoFrame.style.transform = `rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg)`;
    });
    document.querySelector('.hero').addEventListener('mouseleave', () => {
      photoFrame.style.transform = 'rotateY(0) rotateX(0)';
    });
  }

  // Flash-highlight a section when its nav link is clicked
  const flashSection = (id) => {
    const target = document.querySelector(id);
    if (!target) return;
    target.classList.add('flash');
    setTimeout(() => target.classList.remove('flash'), 900);
  };

  const links = nav.querySelectorAll('a');
  const sections = [...links].map(a => document.querySelector(a.getAttribute('href')));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = [...links][sections.indexOf(entry.target)];
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => s && obs.observe(s));