// ===========================
// REEL PLAYER
// ===========================
document.querySelectorAll('[data-reel]').forEach(overlay => {
  const player  = overlay.closest('.reel-player');
  const video   = player.querySelector('.reel-player__video');
  const btn     = overlay.querySelector('.reel-player__btn');
  const pauseIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  const playIcon  = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;

  overlay.addEventListener('click', () => {
    if (video.paused) {
      // Pause all other reels first
      document.querySelectorAll('.reel-player__video').forEach(v => {
        if (v !== video) {
          v.pause();
          v.closest('.reel-player').classList.remove('playing');
          v.closest('.reel-player').querySelector('.reel-player__btn').innerHTML = playIcon;
        }
      });
      video.play();
      player.classList.add('playing');
      btn.innerHTML = pauseIcon;
    } else {
      video.pause();
      player.classList.remove('playing');
      btn.innerHTML = playIcon;
    }
  });

  video.addEventListener('ended', () => {
    player.classList.remove('playing');
    btn.innerHTML = playIcon;
  });
});

// ===========================
// NAV — scroll + hamburger
// ===========================
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ===========================
// STAT COUNTERS
// ===========================
function runCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const steps    = 60;
  const inc      = target / steps;
  let current    = 0;
  let frame      = 0;

  const tick = () => {
    frame++;
    current = Math.min(Math.round(inc * frame), target);
    el.textContent = current;
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsBar = document.querySelector('.statsbar');
let countersDone = false;

if (statsBar) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !countersDone) {
      countersDone = true;
      document.querySelectorAll('.stat__num').forEach(runCounter);
    }
  }, { threshold: 0.4 }).observe(statsBar);
}

// ===========================
// SCROLL REVEAL
// ===========================
const revealSelectors = [
  '.joke-card',
  '.show-card',
  '.video-card',
  '.testimonial',
  '.about__text',
  '.about__visual',
  '.oneliner__intro',
  '.oneliner__showcase',
  '.booking__pitch',
  '.booking__form-wrap',
];

const revealEls = document.querySelectorAll(revealSelectors.join(','));

revealEls.forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.55s ease ${(i % 3) * 60}ms, transform 0.55s ease ${(i % 3) * 60}ms`;
});

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));

// ===========================
// BOOKING FORM — conversion
// ===========================
const form = document.getElementById('booking-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn      = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.disabled   = true;
    btn.innerHTML  = '✓ Solicitação enviada!';
    btn.style.background   = '#22c55e';
    btn.style.borderColor  = '#22c55e';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled  = false;
      btn.style.background  = '';
      btn.style.borderColor = '';
      form.reset();
    }, 4000);
  });
}

// ===========================
// SMOOTH SCROLL (fallback)
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===========================
// ACTIVE NAV LINK
// ===========================
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('.nav__links a');

const activeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--yellow)' : '';
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => activeObs.observe(s));
