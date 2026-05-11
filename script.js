// ── Custom Cursor (desktop only) ──
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactive = 'a, button, .work-card, .service-item';
  document.querySelectorAll(interactive).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = 'rgba(162, 155, 254, 0.5)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'rgba(255, 255, 255, 0.4)';
    });
  });
}

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile nav ──
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    if (menu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

// ── Scroll reveal ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0');
      setTimeout(() => entry.target.classList.add('animate-in'), delay);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

// Hero elements animate immediately
document.querySelector('.hero-tag')?.classList.add('animate-in');
document.querySelector('.hero-title')?.classList.add('animate-in');
document.querySelector('.hero-sub')?.classList.add('animate-in');
document.querySelector('.hero-cta')?.classList.add('animate-in');

// Animate blobs in
document.querySelectorAll('.blob').forEach((blob, i) => {
  blob.style.opacity = '0';
  blob.style.transition = 'opacity 1.5s ease ' + (i * 0.3) + 's';
  setTimeout(() => blob.style.opacity = '0.3', 100);
});

// Scroll-observed elements
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = i * 150;
  observer.observe(el);
});

document.querySelectorAll('.work-card').forEach((card, i) => {
  card.dataset.delay = i * 120;
  observer.observe(card);
});

document.querySelectorAll('.about-lead').forEach(el => observer.observe(el));
document.querySelectorAll('.about-text p').forEach(el => observer.observe(el));

document.querySelectorAll('.stat').forEach((stat, i) => {
  stat.dataset.delay = i * 100;
  observer.observe(stat);
});

document.querySelectorAll('.service-item').forEach((item, i) => {
  item.dataset.delay = i * 80;
  observer.observe(item);
});

document.querySelectorAll('.contact-sub, .contact-email').forEach(el => observer.observe(el));

// ── Counter animation ──
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));
