// =========================================
//  REVIVE SPA & STUDIO — script.js
//  Animations, Scroll Effects, Particles
// =========================================

/* ── PARTICLE SYSTEM ── */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 15}s;
      opacity: ${Math.random() * 0.4 + 0.05};
    `;
    container.appendChild(p);
  }
})();

/* ── NAVBAR SCROLL EFFECT ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 25) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── SMOOTH SCROLL HELPER ── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ── MOBILE MENU TOGGLE ── */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ── INTERSECTION OBSERVER — Reveal on scroll ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: unobserve after reveal for performance
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── ACTIVE NAV LINK on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ── PARALLAX on Hero ── */
const heroContent = document.getElementById('heroContent');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
  }
}, { passive: true });

/* ── SERVICE CARD HOVER — magnetic effect ── */
document.querySelectorAll('.service-card, .herb-card, .about-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-8px) rotateX(${-y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease, border-color 0.4s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.15s ease, box-shadow 0.4s ease, border-color 0.4s ease';
  });
});

/* ── BENEFIT ITEMS — staggered entrance ── */
const benefitItems = document.querySelectorAll('.benefit-item');
const benefitObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    benefitItems.forEach((item, i) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, i * 100);
    });
    benefitObserver.disconnect();
  }
}, { threshold: 0.3 });

benefitItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'all 0.5s ease';
});

if (benefitItems.length) {
  benefitObserver.observe(benefitItems[0].closest('.herbal-benefits') || benefitItems[0]);
}

/* ── STATS COUNTER ANIMATION ── */
function animateCounter(el, target, duration = 1500) {
  const isSymbol = isNaN(parseInt(target));
  if (isSymbol) { el.textContent = target; return; }

  const isPercent = target.includes('%');
  const endVal = parseInt(target);
  const start = Date.now();

  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * endVal);
    el.textContent = isPercent ? `${current}%` : `${current}+`;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, el.textContent.trim());
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.about-stats');
if (statsEl) statObserver.observe(statsEl);

/* ── GOLD GLOW CURSOR TRAIL ── */
const trail = [];
const TRAIL_LENGTH = 12;

for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: ${8 - i * 0.5}px;
    height: ${8 - i * 0.5}px;
    border-radius: 50%;
    background: rgba(196, 161, 90, ${0.6 - i * 0.04});
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(dot);
  trail.push({ el: dot, x: 0, y: 0 });
}

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

function animateTrail() {
  trail[0].x += (mouseX - trail[0].x) * 0.3;
  trail[0].y += (mouseY - trail[0].y) * 0.3;

  for (let i = 1; i < trail.length; i++) {
    trail[i].x += (trail[i - 1].x - trail[i].x) * 0.35;
    trail[i].y += (trail[i - 1].y - trail[i].y) * 0.35;
    trail[i].el.style.left = trail[i].x - 4 + 'px';
    trail[i].el.style.top  = trail[i].y - 4 + 'px';
  }
  trail[0].el.style.left = trail[0].x - 4 + 'px';
  trail[0].el.style.top  = trail[0].y - 4 + 'px';

  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ── SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  background: linear-gradient(90deg, #C4A15A, #D4B575, #C4A15A);
  z-index: 9998;
  transition: width 0.1s linear;
  width: 0%;
  box-shadow: 0 0 8px rgba(196, 161, 90, 0.6);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / scrollable) * 100;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}, { passive: true });

/* ── SMOOTH APPEAR FOR HERO ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'running';
  });

  /* ══════════════════════════════════════
     ── FAN CAROUSEL ──
     ══════════════════════════════════════ */
  const THERAPIES = [
    { emoji:'🙏', title:'Traditional Thai Dry',      duration:'60 – 90 min',      desc:'An ancient practice using rhythmic compressions and assisted stretches along energy lines of the body. Rooted in 2,500 years of Buddhist monastery healing, it restores flexibility, relieves deep muscle tension and promotes profound relaxation — entirely without oils.' },
    { emoji:'🌸', title:'Aroma Massage',             duration:'60 – 90 min',      desc:'A gentle, flowing massage using hand-blended essential oils chosen for your specific needs. The aromatic properties calm the nervous system, uplift your mood and nourish the skin deeply — leaving you feeling silky, serene and renewed.' },
    { emoji:'🌊', title:'Swedish Massage',           duration:'60 – 90 min',      desc:'The gold standard of relaxation massage. Long, gliding effleurage strokes combined with kneading and circular movements improve circulation, reduce stress hormones and ease muscle soreness — a timeless classic for complete body restoration.' },
    { emoji:'💪', title:'Deep Tissue',               duration:'60 – 90 min',      desc:'Targeted, firm pressure therapy that reaches deeper layers of muscle and connective tissue. Ideal for chronic pain, sports injuries and stubborn knots that surface massages cannot address. Feel tension dissolve layer by layer.' },
    { emoji:'🏝️', title:'Balinese Massage',          duration:'90 min',           desc:'A deeply relaxing full-body treatment combining acupressure, reflexology, and aromatherapy. Inspired by the sacred healing traditions of Bali to stimulate blood flow, ease tension, and restore a profound sense of calm.' },
    { emoji:'👑', title:'VIP + Jacuzzi',             duration:'120 min · VIP',    desc:'Our most exclusive experience. Begin with a luxurious Jacuzzi soak to open pores and relax muscles, followed by a bespoke full-body massage with premium botanical oils. This is true indulgence — utterly redefined.' },
    { emoji:'💑', title:'Couple Massage',            duration:'60 – 90 min',      desc:'Share the gift of relaxation with someone special. Side-by-side massages in a romantically appointed suite — perfect for anniversaries, date nights, or simply celebrating each other with the deepest care.' },
    { emoji:'🔥', title:'Hot Stone Massage',         duration:'75 – 90 min',      desc:'Smooth, heated volcanic basalt stones are placed along energy points and used as massage tools. The penetrating heat melts deep muscular tension, improves circulation and induces a state of profound, restorative relaxation.' },
    { emoji:'✨', title:'H&S or B&S Treatments',     duration:'30 – 45 min',      desc:'Specialised Head & Shoulders or Back & Shoulders massage focusing on your most common tension zones. Perfect for office workers, desk-bound professionals and anyone needing fast, targeted relief in their busiest moments.' },
    { emoji:'👣', title:'Foot Reflexology',          duration:'45 – 60 min',      desc:'Based on the principle that reflex points in the feet correspond to every organ and system in the body. Precise thumb-walking techniques stimulate healing energy, reduce fatigue and restore full-body balance from the ground up.' },
    { emoji:'🌿', title:'Herbal Potlis',             duration:'60 – 75 min',      desc:'A traditional Ayurvedic therapy where cloth pouches filled with therapeutic herbs, spices and roots are dipped in warm medicated oils and rhythmically pressed onto the body. Heat and healing botanicals penetrate deep into muscles and joints for transformative relief.' },
  ];

  const stage      = document.getElementById('fanStage');
  const dotsWrap   = document.getElementById('fanDots');
  const prevBtn    = document.getElementById('fanPrev');
  const nextBtn    = document.getElementById('fanNext');
  const detailPanel= document.getElementById('fanDetail');
  const detailEmoji= document.getElementById('fanDetailEmoji');
  const detailTitle= document.getElementById('fanDetailTitle');
  const detailDur  = document.getElementById('fanDetailDuration');
  const detailDesc = document.getElementById('fanDetailDesc');

  if (!stage) return; // guard if section not present

  let current = 0;
  const N = THERAPIES.length;

  // Build card elements
  const cards = THERAPIES.map((t, i) => {
    const el = document.createElement('div');
    el.className = 'fan-card';
    el.innerHTML = `
      <div class="fan-card-top">
        <span class="fan-card-emoji">${t.emoji}</span>
        <span class="fan-card-num">${String(i+1).padStart(2,'0')}</span>
      </div>
      <h3 class="fan-card-title">${t.title}</h3>
      <span class="fan-card-duration">${t.duration}</span>
      <p class="fan-card-hint">✦ Tap to explore</p>`;
    stage.appendChild(el);
    return el;
  });

  // Build dots
  const dots = THERAPIES.map((_, i) => {
    const d = document.createElement('div');
    d.className = 'fan-dot';
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
    return d;
  });

  function render() {
    cards.forEach((card, i) => {
      const slot = ((i - current) % N + N) % N;
      // Convert to signed slot: 0 center, negative=left, positive=right
      let s = slot;
      if (s > N / 2) s = s - N;
      // Clamp to -4…4 range for CSS
      const clamped = Math.max(-4, Math.min(4, s));
      card.dataset.slot = String(clamped);
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    updateDetail();
  }

  function updateDetail() {
    const t = THERAPIES[current];
    // Re-trigger emoji animation
    detailEmoji.textContent = '';
    requestAnimationFrame(() => {
      detailEmoji.textContent = t.emoji;
    });
    detailTitle.textContent = t.title;
    detailDur.textContent   = t.duration;
    detailDesc.textContent  = t.desc;
    detailPanel.classList.add('open');
  }

  function goTo(idx) {
    current = ((idx % N) + N) % N;
    render();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  // Click side cards to center them
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      const slot = parseInt(card.dataset.slot);
      if (slot === 0) return; // already center
      goTo(i);
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  stage.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
  stage.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  }, {passive:true});

  // Auto-advance every 4s
  let autoTimer = setInterval(next, 4000);
  const wrap = document.querySelector('.fan-carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrap.addEventListener('mouseleave', () => { autoTimer = setInterval(next, 4000); });
  }

  // Initial render
  render();
});


/* ── LEAFLET MAP INIT ── */
window.addEventListener('load', () => {
  if (typeof L === 'undefined') return;

  // Velvet Spa coordinates — Yelahanka New Town, Bengaluru
  const LAT = 13.1007;
  const LNG = 77.5963;

  const map = L.map('velvet-map', {
    center: [LAT, LNG],
    zoom: 15,
    zoomControl: false,
    scrollWheelZoom: false,
    attributionControl: false,
  });

  // Stamen/CartoDB Positron light tiles — clean, minimal look
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Custom HTML marker with pulsing rings
  const markerHtml = `
    <div class="velvet-marker">
      <div class="marker-pulse"></div>
      <div class="marker-pulse marker-pulse-2"></div>
      <div class="marker-dot">✦</div>
    </div>`;

  const customIcon = L.divIcon({
    html: markerHtml,
    className: '',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [0, -35],
  });

  const marker = L.marker([LAT, LNG], { icon: customIcon }).addTo(map);

  // Themed popup
  marker.bindPopup(`
    <div class="popup-title">✦ Velvet Spa &amp; Studio</div>
    <p>1st Floor, 283, MIG, 1st Phase,<br/>15th A Cross, Yelahanka New Town,<br/>Bengaluru, Karnataka – 560064</p>
    <p style="margin-top:0.4rem;"><strong>📞</strong> 6366534680 | 6366534689</p>
  `, { maxWidth: 240 }).openPopup();

  // Pan map slightly so marker sits to the right (card on left)
  map.panBy([-130, 0], { animate: false });

  // Add zoom control in bottom-right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Reveal card when map section enters viewport
  const mapCard = document.getElementById('mapCard');
  const mapSection = document.getElementById('location');

  if (mapCard && mapSection) {
    const mapObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        mapCard.classList.add('visible');
        // Animate map tiles appearing
        setTimeout(() => map.invalidateSize(), 100);
        mapObserver.unobserve(mapSection);
      }
    }, { threshold: 0.2 });
    mapObserver.observe(mapSection);
  }

  // When banner is dismissed, adjust navbar top
  const banner = document.querySelector('.grand-opening-banner');
  if (banner) {
    const closeBtn = banner.querySelector('.go-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.querySelector('.navbar').style.top = '0';
      });
    }
  }
});

