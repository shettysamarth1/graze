/* ─────────────────────────────────────────────────────────────
   Gather and Graze — hero bloom + scroll choreography
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 0. Hero video: play inline, fall back gracefully ────── */

  const heroVideo = document.querySelector('[data-hero-video]');
  if (heroVideo) {
    const hero = heroVideo.closest('.hero');
    const dropVideo = function () {
      if (hero) hero.classList.add('hero--no-video'); // brand gradient takes over
    };

    heroVideo.addEventListener('error', dropVideo);
    // a source that never loaded → hide rather than show an empty/black layer
    if (heroVideo.readyState === 0 && heroVideo.networkState === 3) dropVideo();

    if (reduceMotion) {
      heroVideo.pause();
    } else {
      const attempt = heroVideo.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(dropVideo);
    }
  }

  /* ── 1. Hero: a small amount of flowers popping up ───────── */

  const FLOWERS = [
    // [x%, y%, size(px), rotation, delay(s), petal fill]
    { x: 12,  y: 22,  s: 34, r: -12, d: 0.15, c: '#FFF6D6' },
    { x: 82,  y: 15,  s: 26, r: 18,  d: 0.35, c: '#FFFFFF' },
    { x: 68,  y: 72,  s: 30, r: -6,  d: 0.55, c: '#FFEDA8' },
    { x: 24,  y: 78,  s: 22, r: 24,  d: 0.70, c: '#FFFFFF' },
    { x: 92,  y: 52,  s: 20, r: -20, d: 0.85, c: '#F6F2FF' },
    { x: 6,   y: 58,  s: 24, r: 10,  d: 1.00, c: '#FFEDA8' },
    { x: 50,  y: 8,   s: 18, r: -30, d: 1.15, c: '#F6F2FF' }
  ];

  function flowerSVG(fill) {
    return (
      '<svg viewBox="0 0 40 40" aria-hidden="true">' +
        '<g stroke="#8F86C4" stroke-width="1.1" fill="' + fill + '">' +
          '<ellipse cx="20" cy="11" rx="6" ry="9"/>' +
          '<ellipse cx="29" cy="20" rx="9" ry="6"/>' +
          '<ellipse cx="20" cy="29" rx="6" ry="9"/>' +
          '<ellipse cx="11" cy="20" rx="9" ry="6"/>' +
        '</g>' +
        '<circle cx="20" cy="20" r="4" fill="#C0675E"/>' +
      '</svg>'
    );
  }

  const bloomHost = document.querySelector('[data-flowers]');
  if (bloomHost) {
    const frag = document.createDocumentFragment();
    FLOWERS.forEach(function (f, i) {
      const el = document.createElement('span');
      el.className = 'bloom';
      el.style.left = f.x + '%';
      el.style.top = f.y + '%';
      el.style.setProperty('--size', f.s + 'px');
      el.style.setProperty('--rot', f.r + 'deg');
      el.style.setProperty('--delay', (reduceMotion ? 0 : f.d) + 's');
      el.innerHTML = flowerSVG(f.c);
      frag.appendChild(el);
      // stagger the "pop" once the hero paints
      requestAnimationFrame(function () {
        setTimeout(function () { el.classList.add('is-open'); }, reduceMotion ? 0 : 120 + i * 40);
      });
    });
    bloomHost.appendChild(frag);
  }

  /* ── 1b. Drifting flora: a few subtle flowers per section ── */

  // Kept to the section edges + padding bands so content is never covered.
  const FLORA = {
    hero:      [{ x: 6,  y: 13, s: 26, c: '#FFFFFF' }, { x: 91, y: 19, s: 22, c: '#FFEDA8' },
                { x: 10, y: 86, s: 24, c: '#F6F2FF' }, { x: 88, y: 88, s: 22, c: '#FFEDA8' }],
    moment:    [{ x: 7,  y: 14, s: 28, c: '#FFEDA8' }, { x: 90, y: 12, s: 24, c: '#F6F2FF' },
                { x: 9,  y: 88, s: 24, c: '#FFFFFF' }, { x: 89, y: 84, s: 26, c: '#F6F2FF' }],
    menu:      [{ x: 5,  y: 10, s: 28, c: '#F6F2FF' }, { x: 92, y: 14, s: 22, c: '#FFEDA8' },
                { x: 8,  y: 90, s: 24, c: '#FFFFFF' }, { x: 91, y: 86, s: 26, c: '#F6F2FF' }],
    occasions: [{ x: 6,  y: 16, s: 24, c: '#FFEDA8' }, { x: 90, y: 12, s: 26, c: '#FFFFFF' },
                { x: 11, y: 88, s: 22, c: '#F6F2FF' }, { x: 89, y: 90, s: 24, c: '#FFEDA8' }],
    contact:   [{ x: 7,  y: 14, s: 26, c: '#FFFFFF' }, { x: 91, y: 16, s: 22, c: '#F6F2FF' },
                { x: 9,  y: 88, s: 24, c: '#FFEDA8' }, { x: 90, y: 86, s: 26, c: '#F6F2FF' }],
    footer:    [{ x: 16, y: 46, s: 20, c: '#F6F2FF' }, { x: 84, y: 52, s: 22, c: '#FFEDA8' }]
  };

  document.querySelectorAll('[data-flora]').forEach(function (host) {
    const items = FLORA[host.getAttribute('data-flora')] || [];
    const frag = document.createDocumentFragment();
    items.forEach(function (f, i) {
      const el = document.createElement('span');
      el.className = 'flora__item';
      el.style.left = f.x + '%';
      el.style.top = f.y + '%';
      el.style.setProperty('--s', f.s + 'px');
      el.style.setProperty('--o', host.getAttribute('data-flora') === 'hero' ? .45 : .55);
      el.style.setProperty('--r', (-8 + i * 9) + 'deg');
      el.style.setProperty('--dr', ((i % 2 ? 1 : -1) * (5 + i)) + 'deg');
      el.style.setProperty('--dx', ((i % 2 ? 1 : -1) * (6 + i * 2)) + 'px');
      el.style.setProperty('--dy', (-(10 + i * 3)) + 'px');
      el.style.setProperty('--dur', (11 + (i % 4) * 1.8) + 's');
      el.style.setProperty('--delay', (-(i * 1.6)) + 's'); // mid-cycle start, no sync
      el.innerHTML = flowerSVG(f.c);
      frag.appendChild(el);
    });
    host.appendChild(frag);
  });

  /* ── 2. Scroll: reveal + the person-eating-desserts moment ── */

  const revealTargets = document.querySelectorAll('[data-reveal], [data-moment]');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
    document.querySelectorAll('.moment__figure').forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-in');
      // stagger siblings inside a grid for a softer cascade
      const group = el.closest('.menu__grid, .occasions__grid');
      if (group) {
        const i = Array.prototype.indexOf.call(group.children, el);
        el.style.transitionDelay = Math.min(i, 6) * 90 + 'ms';
      }
      observer.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  revealTargets.forEach(function (el) { observer.observe(el); });

  // the illustration is its own observer so it animates on the wrapper
  const moment = document.querySelector('.moment__figure');
  if (moment) {
    const mObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    mObs.observe(moment);
  }
})();
