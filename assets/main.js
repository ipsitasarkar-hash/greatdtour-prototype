// Great D'Tour Prototype — main.js

// ---- Nav scroll behaviour ----
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ---- Active nav link ----
(function() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === page || (page === '' && href === 'index.html'))) {
      link.classList.add('is-active');
    }
  });
})();

// ---- Mobile hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav__links');
if (hamburger && navLinks) {
  // Inject "Become a Host" CTA into mobile menu if not already present
  if (!navLinks.querySelector('.nav__cta--mobile')) {
    const mobileCta = document.createElement('a');
    mobileCta.href = 'host.html';
    mobileCta.className = 'nav__cta nav__cta--mobile';
    mobileCta.textContent = 'Become a Host';
    navLinks.appendChild(mobileCta);
  }
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav__links--open');
  });
}

// ---- User avatar dropdown ----
function toggleUserMenu() {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) dropdown.classList.toggle('is-open');
}
document.addEventListener('click', (e) => {
  const btn = document.getElementById('navAvatarBtn');
  const dropdown = document.getElementById('userDropdown');
  if (dropdown && btn && !btn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('is-open');
  }
});

// ---- Experience carousel ----
const carousel = document.getElementById('expCarousel');
const prevBtn = document.getElementById('expPrev');
const nextBtn = document.getElementById('expNext');

if (carousel && prevBtn && nextBtn) {
  let index = 0;
  const cardWidth = 340 + 20; // width + gap
  const visibleCount = () => Math.floor(carousel.parentElement.offsetWidth / cardWidth);
  const maxIndex = () => carousel.children.length - visibleCount();

  const updateCarousel = () => {
    const max = maxIndex();
    index = Math.max(0, Math.min(index, max));
    carousel.style.transform = `translateX(-${index * cardWidth}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= max;
  };

  prevBtn.addEventListener('click', () => { index--; updateCarousel(); });
  nextBtn.addEventListener('click', () => { index++; updateCarousel(); });
  updateCarousel();
}

// ---- Testimonial switcher ----
const testimonialData = [
  {
    text: '"The Himalayan trek was transformative. I arrived a stressed professional and left with perspective I couldn\'t have bought. The guide was extraordinary — part mountaineer, part philosopher."',
    name: 'Priya Sharma',
    trip: 'Himachal Pradesh Trek'
  },
  {
    text: '"Sleeping under desert stars, learning folk songs from a 70-year-old musician — this wasn\'t a tour, it was a homecoming."',
    name: 'Rahul Mehta',
    trip: 'Rajasthan Safari'
  },
  {
    text: '"Kerala was everything I needed. Quiet mornings on the houseboat, real Ayurveda — not the spa kind — and a rhythm that the rest of my life had forgotten."',
    name: 'Ananya Desai',
    trip: 'Kerala Retreat'
  }
];

const reviewBtns = document.querySelectorAll('.review-item');
const testimonialText = document.getElementById('testimonialText');
const testimonialName = document.getElementById('testimonialName');
const dots = document.querySelectorAll('.dot');

function setTestimonial(idx) {
  if (!testimonialText || !testimonialName) return;
  // Fade out
  testimonialText.style.opacity = '0';
  setTimeout(() => {
    testimonialText.textContent = testimonialData[idx].text;
    testimonialName.textContent = testimonialData[idx].name;
    testimonialText.style.opacity = '1';
  }, 200);

  // Update review items
  reviewBtns.forEach((btn, i) => {
    btn.classList.toggle('review-item--active', i === idx);
    btn.querySelector('.review-item__avatar')
      .classList.toggle('review-item__avatar--active', i === idx);
  });

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('dot--active', i === idx);
  });
}

reviewBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => setTestimonial(i));
});

// ---- Filter buttons (experiences page) ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    // For prototype: just visual toggle
  });
});

// ---- Animate stats on scroll ----
const stats = document.querySelectorAll('.stat__num');
if (stats.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStat(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => observer.observe(s));
}

function animateStat(el) {
  const raw = el.textContent.replace(/[^0-9.]/g, '');
  const target = parseFloat(raw);
  if (isNaN(target)) return;
  const suffix = el.textContent.replace(/[0-9.]/g, '');
  const duration = 1400;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target * ease;
    el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---- Smooth fade-in on scroll ----
const fadeEls = document.querySelectorAll(
  '.exp-card, .fn-card, .why__item, .stat, .fn-card__body, .ways__main, .ways__item'
);
if ('IntersectionObserver' in window && fadeEls.length) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fadeEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    fadeObserver.observe(el);
  });
}
