// ── Custom Cursor ──
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
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

document.querySelectorAll('a, button, .work-card, .service-item').forEach(el => {
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

// ── Particles ──
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(162, 155, 254, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(162, 155, 254, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Navbar scroll ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('glass', window.scrollY > 50);
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

// ── Intersection Observer ──
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('show'), delay);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

// Observe work cards
document.querySelectorAll('.work-card').forEach((card, i) => {
  card.dataset.delay = i * 100;
  obs.observe(card);
});

// Observe section titles (reveal class)
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Observe about elements
document.querySelectorAll('.about-lead').forEach(el => obs.observe(el));
document.querySelectorAll('.about-text p').forEach(el => obs.observe(el));
document.querySelectorAll('.contact-sub').forEach(el => obs.observe(el));
document.querySelectorAll('.contact-email').forEach(el => obs.observe(el));
document.querySelectorAll('.stat').forEach((stat, i) => {
  stat.dataset.delay = i * 100;
  obs.observe(stat);
});
document.querySelectorAll('.service-item').forEach((item, i) => {
  item.dataset.delay = i * 80;
  obs.observe(item);
});

// ── Counter animation ──
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, 25);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));
