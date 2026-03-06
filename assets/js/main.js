/* Campaign site JS (no build tools, GitHub Pages friendly) */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const navBtn = $('[data-navbtn]');
  const nav = $('[data-nav]');
  function closeNav() {
    if (!navBtn || !nav) return;
    nav.dataset.open = "false";
    navBtn.setAttribute('aria-expanded', 'false');
  }
  function toggleNav() {
    if (!navBtn || !nav) return;
    const open = nav.dataset.open === "true";
    nav.dataset.open = open ? "false" : "true";
    navBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
  }
  if (navBtn && nav) {
    nav.dataset.open = "false";
    navBtn.addEventListener('click', toggleNav);
    document.addEventListener('click', (e) => {
      if (!nav.dataset.open || nav.dataset.open !== "true") return;
      const within = nav.contains(e.target) || navBtn.contains(e.target);
      if (!within) closeNav();
    });
    $$('#nav a').forEach(a => a.addEventListener('click', closeNav));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeNav();
    });
  }

  // Testimonials carousel
  const carousel = $('[data-carousel]');
  const testimonials = (window.__TESTIMONIALS__ || []).filter(t => t && t.quote && t.author);
  if (carousel && testimonials.length) {
    const quoteEl = $('[data-quote]', carousel);
    const authorEl = $('[data-author]', carousel);
    const dotsWrap = $('[data-dots]', carousel);
    const prevBtn = $('[data-prev]', carousel);
    const nextBtn = $('[data-next]', carousel);

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let index = 0;
    let timer = null;

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      const dotCount = Math.min(testimonials.length, 12); // keep tidy
      for (let i = 0; i < dotCount; i++) {
        const b = document.createElement('button');
        b.type = "button";
        b.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        b.dataset.dot = String(i);
        b.addEventListener('click', () => {
          goTo(i);
          restart();
        });
        dotsWrap.appendChild(b);
      }
    }

    function setCurrentDot() {
      if (!dotsWrap) return;
      const dots = $$('button', dotsWrap);
      const dotIndex = index % Math.min(testimonials.length, 12);
      dots.forEach((d, i) => d.setAttribute('aria-current', i === dotIndex ? 'true' : 'false'));
    }

    function paint() {
      const t = testimonials[index];
      if (quoteEl) quoteEl.textContent = `“${t.quote}”`;
      if (authorEl) authorEl.textContent = t.author;
      setCurrentDot();
    }

    function goTo(i) {
      index = (i + testimonials.length) % testimonials.length;
      paint();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restart() {
      if (reduceMotion) return;
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(next, 7000);
    }

    renderDots();
    paint();
    restart();

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restart(); });

    // keyboard support
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { next(); restart(); }
      if (e.key === 'ArrowLeft') { prev(); restart(); }
    });
  }

  // Volunteer form
  const form = $('[data-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const msg = String(data.get('message') || '').trim();

      const subject = encodeURIComponent('Volunteer Interest — Jon DeVille Campaign');
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n`
      );

      const to = 'campaign@example.com';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    });
  }

  // Scroll-triggered reveal animations
  const reduceMotionGlobal = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotionGlobal) {
    const revealEls = $$('.reveal, .reveal-children');
    if (revealEls.length && 'IntersectionObserver' in window) {
      // 12% visible + 40px offset triggers animation just as the element enters the viewport
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show everything immediately
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  } else {
    // Reduced motion: skip animations, show content immediately
    $$('.reveal, .reveal-children').forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
