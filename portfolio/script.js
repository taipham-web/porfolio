/* ===== PARTICLE CANVAS ANIMATION ===== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const NUM = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.dx = (Math.random() - 0.5) * 0.4;
      this.dy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 250 : 290;
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},70%,65%,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  // draw connections
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  // gradient blobs
  function drawBlobs() {
    const blobs = [
      { x: W * 0.15, y: H * 0.25, r: 350, c1: 'rgba(99,102,241,0.08)', c2: 'transparent' },
      { x: W * 0.85, y: H * 0.6,  r: 300, c1: 'rgba(168,85,247,0.07)', c2: 'transparent' },
      { x: W * 0.5,  y: H * 0.9,  r: 250, c1: 'rgba(6,182,212,0.05)',  c2: 'transparent' },
    ];
    blobs.forEach(b => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.c1);
      g.addColorStop(1, b.c2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawBlobs();
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== NAVBAR SCROLL ===== */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  const toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', () => {
    nav.classList.toggle('menu-open');
  });

  // close menu on link click
  nav.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('menu-open'));
  });
})();

/* ===== REVEAL ON SCROLL ===== */
(function () {
  const revealTargets = [
    '#about .glass-card',
    '#skills .skill-card',
    '#projects .project-card',
    '#contact .glass-card',
  ];

  const allReveal = document.querySelectorAll(revealTargets.join(','));
  allReveal.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          e.target.classList.add('visible');
          animateSkills(e.target);
        }, 100);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  allReveal.forEach(el => observer.observe(el));

  // stagger children
  document.querySelectorAll('#skills .skill-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.07}s`;
  });
  document.querySelectorAll('#about .glass-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.15}s`;
  });

  function animateSkills(el) {
    if (el.classList.contains('skill-card')) {
      const fill = el.querySelector('.skill-fill');
      if (fill) fill.style.width = fill.dataset.width;
    }
  }
})();

/* ===== HERO SECTION ANIMATION ===== */
(function () {
  const heroEls = document.querySelectorAll(
    '.hero-badge, .hero-name, .hero-title, .hero-desc, .hero-cta, .hero-stats'
  );
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 120);
  });

  const avatarWrap = document.querySelector('.hero-avatar-wrap');
  if (avatarWrap) {
    avatarWrap.style.opacity = '0';
    avatarWrap.style.transform = 'scale(0.85)';
    avatarWrap.style.transition = 'opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s';
    setTimeout(() => {
      avatarWrap.style.opacity = '1';
      avatarWrap.style.transform = 'scale(1)';
    }, 200);
  }
})();

/* ===== CONTACT FORM ===== */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Đang gửi...';
  btn.disabled = true;

  setTimeout(() => {
    success.style.display = 'block';
    btn.textContent = 'Đã gửi ✅';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = 'Gửi tin nhắn 🚀';
      btn.disabled = false;
      success.style.display = 'none';
    }, 4000);
  }, 1200);
}

/* ===== SMOOTH ACTIVE NAV ===== */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) {
        a.style.color = '#6366f1';
      }
    });
  });
})();

/* ===== SKILL FILL ON LOAD for skills in view ===== */
window.addEventListener('load', () => {
  // fill any already-visible skills
  document.querySelectorAll('.skill-fill').forEach(fill => {
    const rect = fill.getBoundingClientRect();
    if (rect.top < window.innerHeight) fill.style.width = fill.dataset.width;
  });
});
