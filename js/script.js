// ─────────────────────────────────────────────
// 1. LOADER
// ─────────────────────────────────────────────
(function initLoader() {
  const overlay = document.getElementById('loader-overlay');
  const fill = document.getElementById('loader-fill');
  const percent = document.getElementById('loader-percent');
  let progress = 0;

  function hideLoader() {
    if (overlay && !overlay.classList.contains('hidden')) {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
      if (typeof initMainAnimations === 'function') initMainAnimations();
    }
  }

  try {
    const canvas = document.getElementById('loader-canvas');
    if (canvas) canvas.style.display = 'none';
  } catch (e) {
    console.warn('Loader canvas cleanup skipped:', e);
  }

  const interval = setInterval(() => {
    progress += Math.random() * 6 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = progress + '%';
      percent.textContent = Math.round(progress) + '%';
      setTimeout(hideLoader, 600);
    }
    fill.style.width = progress + '%';
    percent.textContent = Math.round(progress) + '%';
  }, 120);

  setTimeout(hideLoader, 5000);
})();

// ─────────────────────────────────────────────
// 2. LUCIDE ICONS
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => lucide.createIcons());
setTimeout(() => lucide.createIcons(), 500);

// ─────────────────────────────────────────────
// 3. MOBILE DOCK — hamburger toggle
// ─────────────────────────────────────────────
function toggleMobileDock() {
  const dock = document.getElementById('mobile-dock');
  if (dock) dock.classList.toggle('active');
}
document.addEventListener('click', (e) => {
  const dock = document.getElementById('mobile-dock');
  const btn = document.getElementById('mobile-menu-btn');
  if (!dock || !dock.classList.contains('active')) return;
  if (dock.contains(e.target) || (btn && btn.contains(e.target))) {
    const item = e.target.closest('.mobile-dock-item');
    if (item) {
      const href = item.getAttribute('data-href');
      if (href.startsWith('http')) { window.open(href, '_blank'); }
      else if (href && href.startsWith('#')) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
      dock.classList.remove('active');
    }
    return;
  }
  dock.classList.remove('active');
});

// ─────────────────────────────────────────────
// 4. THREE.JS HERO BACKGROUND
// ─────────────────────────────────────────────
(function initHeroBg() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const count = 2000;
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 60;
    pos[i + 1] = (Math.random() - 0.5) * 60;
    pos[i + 2] = (Math.random() - 0.5) * 60;
    if (Math.random() > 0.7) { col[i] = 0.96; col[i + 1] = 0.7; col[i + 2] = 0.004; }
    else { col[i] = 1; col[i + 1] = 1; col[i + 2] = 1; }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.8 });
  const mesh = new THREE.Points(geo, mat);
  scene.add(mesh);
  camera.position.z = 30;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; });
  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.y += 0.001;
    mesh.rotation.x += 0.0005;
    mesh.rotation.y += mx * 0.05;
    mesh.rotation.x += my * 0.05;
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
})();

// ─────────────────────────────────────────────
// 5. MAIN ANIMATIONS (GSAP)
// ─────────────────────────────────────────────
function initMainAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 0.8, delay: 0.15 * i + 0.2, ease: 'power3.out' });
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () => el.classList.add('active') });
  });

  document.querySelectorAll('.counter').forEach(c => {
    const target = parseInt(c.getAttribute('data-target'));
    gsap.to(c, { innerHTML: target, duration: 2.5, snap: { innerHTML: 1 }, scrollTrigger: { trigger: c, start: 'top 80%' } });
  });

  gsap.from('.card-3d', { opacity: 0, y: 50, duration: 0.8, stagger: 0.1, scrollTrigger: { trigger: '#services', start: 'top 70%' } });
}

// ─────────────────────────────────────────────
// 6. LOGO LOOP — infinite scroll
// ─────────────────────────────────────────────
function initLogoLoop(containerId) {
  const track = document.querySelector('#' + containerId + ' .logoloop__track');
  if (!track) return;
  const clients = [
    'logo%20business/amalfi.png',
    'logo%20business/bayat.png',
    'logo%20business/ChickenTime_logo_png-07.png',

    'logo%20business/LOGO_ASSA.png',
    'logo%20business/open.png',
    'logo%20business/qaada.png',
    'logo%20business/sheraton.png',
    'logo%20business/shot.png',
    'logo%20business/unilever.png',
    'logo%20business/venus.png',
    'logo%20business/viola.png',
    'logo%20business/WhatsApp%20Image.png',
    'logo%20business/Untitled%20design.png'
  ];
  function createList() {
    const ul = document.createElement('ul');
    ul.className = 'logoloop__list';
    clients.forEach(name => {
      const li = document.createElement('li');
      li.className = 'logoloop__item';
      if (name.includes('LOGO_ASSA') || name.includes('qaada') || name.includes('sheraton')) li.classList.add('needs-white');
      li.innerHTML = '<div class="logoloop__logo"><img src="public/images/' + name + '" alt="" class="logoloop__img"></div>';
      ul.appendChild(li);
    });
    return ul;
  }
  for (let i = 0; i < 4; i++) track.appendChild(createList());
  let offset = 0, velocity = 60, lastTime = 0;
  function animate(time) {
    if (!lastTime) lastTime = time;
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    const first = track.querySelector('.logoloop__list');
    if (first) {
      const w = first.offsetWidth;
      offset += velocity * dt;
      if (offset >= w + 48) offset = 0;
      track.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
    }
    requestAnimationFrame(animate);
  }
  track.addEventListener('mouseenter', () => velocity = 0);
  track.addEventListener('mouseleave', () => velocity = 60);
  track.addEventListener('click', (e) => {
    const item = e.target.closest('.logoloop__item');
    if (!item) return;
    const state = item.dataset.clickState || '0';
    if (state === '0') {
      item.dataset.clickState = '1';
      item.classList.add('clicked');
    } else if (state === '1') {
      item.dataset.clickState = '2';
      item.classList.remove('clicked');
      item.classList.add('clicked-light');
    } else {
      item.dataset.clickState = '0';
      item.classList.remove('clicked-light');
    }
  });
  requestAnimationFrame(animate);
}
initLogoLoop('brand-loop');
initLogoLoop('brand-loop-2');

// ─────────────────────────────────────────────
// 7. CHROMA GRID — spotlight
// ─────────────────────────────────────────────
(function initChromaGrid() {
  const grid = document.getElementById('chroma-grid');
  if (!grid || typeof gsap === 'undefined') return;
  const fadeEl = grid.querySelector('.chroma-fade');
  let pos = { x: grid.offsetWidth / 2, y: grid.offsetHeight / 2 };
  const setX = gsap.quickSetter(grid, '--x', 'px');
  const setY = gsap.quickSetter(grid, '--y', 'px');
  setX(pos.x);
  setY(pos.y);
  function moveTo(x, y) {
    gsap.to(pos, { x, y, duration: 0.45, ease: 'power3.out', onUpdate: () => { setX(pos.x); setY(pos.y); }, overwrite: true });
  }
  grid.addEventListener('pointermove', e => {
    const r = grid.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (fadeEl) gsap.to(fadeEl, { opacity: 0, duration: 0.25, overwrite: true });
  });
  grid.addEventListener('pointerleave', () => { if (fadeEl) gsap.to(fadeEl, { opacity: 1, duration: 0.6, overwrite: true }); });
  grid.querySelectorAll('.chroma-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });
})();

// ─────────────────────────────────────────────
// 8. 3D TILT ON SERVICE CARDS
// ─────────────────────────────────────────────
(function init3DPhysics() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    let bounds = card.getBoundingClientRect();
    const updateBounds = () => { bounds = card.getBoundingClientRect(); };
    window.addEventListener('resize', updateBounds);
    window.addEventListener('scroll', updateBounds);
    card.addEventListener('mousemove', (e) => {
      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;
      const rotateX = (y - 0.5) * 18;
      const rotateY = (x - 0.5) * -18;
      const gravityY = (1 - y) * 4;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(' + (-gravityY) + 'px) translateZ(20px)';
      card.style.transition = 'transform 0.08s linear';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) translateZ(0)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'perspective(800px) rotateX(0) translateY(0)';
        e.target.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'perspective(800px) rotateX(15deg) translateY(' + (60 + i * 15) + 'px)';
    card.style.transition = 'none';
    observer.observe(card);
  });
})();

// ─────────────────────────────────────────────
// 9. DOCK — macOS magnification + nav
// ─────────────────────────────────────────────
(function initDock() {
  const panel = document.getElementById('dock-panel');
  if (!panel) return;
  const items = panel.querySelectorAll('.dock-item');
  const BASE = 48, MAGNIFY = 68, DISTANCE = 160;
  const sizes = new Map();
  items.forEach(item => sizes.set(item, { w: BASE, h: BASE }));
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateDock() {
    let anyMoving = false;
    items.forEach(item => {
      const target = sizes.get(item);
      const curW = parseFloat(item.style.width) || BASE;
      const curH = parseFloat(item.style.height) || BASE;
      const newW = lerp(curW, target.w, 0.3);
      const newH = lerp(curH, target.h, 0.3);
      if (Math.abs(newW - target.w) > 0.5 || Math.abs(newH - target.h) > 0.5) anyMoving = true;
      item.style.width = newW + 'px';
      item.style.height = newH + 'px';
    });
    if (anyMoving) requestAnimationFrame(animateDock);
  }
  panel.addEventListener('mousemove', (e) => {
    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dx = e.clientX - centerX;
      const dist = Math.abs(dx);
      let targetW = BASE, targetH = BASE;
      if (dist < DISTANCE) {
        const factor = 1 - dist / DISTANCE;
        const extra = (MAGNIFY - BASE) * factor;
        targetW = BASE + extra;
        targetH = BASE + extra;
        const icon = item.querySelector('.dock-icon');
        if (icon) icon.style.transform = 'scale(' + (1 + 0.3 * factor) + ')';
      } else {
        const icon = item.querySelector('.dock-icon');
        if (icon) icon.style.transform = 'scale(1)';
      }
      sizes.set(item, { w: targetW, h: targetH });
    });
    animateDock();
  });
  panel.addEventListener('mouseleave', () => {
    items.forEach(item => {
      sizes.set(item, { w: BASE, h: BASE });
      const icon = item.querySelector('.dock-icon');
      if (icon) icon.style.transform = 'scale(1)';
    });
    animateDock();
  });
  items.forEach(item => {
    item.addEventListener('click', () => {
      const href = item.getAttribute('data-href');
      if (href.startsWith('http')) { window.open(href, '_blank'); }
      else if (href && href.startsWith('#')) {
        const page = href.slice(1);
        if (window.navigateTo) window.navigateTo(page);
      }
    });
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); } });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    const label = item.getAttribute('data-label');
    const span = document.createElement('span');
    span.className = 'dock-label';
    span.textContent = label;
    item.appendChild(span);
  });
})();

// ─────────────────────────────────────────────
// 10. CURSOR ORB
// ─────────────────────────────────────────────
(function initCursorOrb() {
  const orb = document.createElement('div');
  orb.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(245,179,1,0.08) 0%,transparent 70%);transform:translate(-50%,-50%);transition:left 0.2s ease,top 0.2s ease;';
  document.body.appendChild(orb);
  document.addEventListener('mousemove', (e) => { orb.style.left = e.clientX + 'px'; orb.style.top = e.clientY + 'px'; });
})();

// ─────────────────────────────────────────────
// 11. PORTFOLIO FILTER
// ─────────────────────────────────────────────
(function initPortfolioFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.chroma-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          if (typeof gsap !== 'undefined') gsap.fromTo(item, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 });
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

// ─────────────────────────────────────────────
// 12. BLOG FILTER & SEARCH
// ─────────────────────────────────────────────
(function initBlog() {
  const catBtns = document.querySelectorAll('.blog-cat-btn');
  const cards = document.querySelectorAll('.blog-card');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      cards.forEach(c => { c.style.display = (cat === 'all' || c.getAttribute('data-cat') === cat) ? '' : 'none'; });
    });
  });
  window.filterBlog = function() {
    const q = document.getElementById('blog-search').value.toLowerCase();
    cards.forEach(c => { c.style.display = c.querySelector('h3').textContent.toLowerCase().includes(q) ? '' : 'none'; });
  };
})();

// ─────────────────────────────────────────────
// 13. CALCULATEUR DE DEVIS
// ─────────────────────────────────────────────
(function initCalculator() {
  const items = document.querySelectorAll('.calc-item');
  const totalEl = document.getElementById('total-estimate');
  let total = 0;
  items.forEach(item => {
    item.addEventListener('click', () => {
      const check = item.querySelector('.w-5.h-5');
      const mark = check ? check.querySelector('span') : null;
      const price = parseInt(item.getAttribute('data-price'));
      const selected = item.classList.contains('bg-brand-gold/10');
      if (selected) {
        item.classList.remove('bg-brand-gold/10', 'border-brand-gold/30');
        item.classList.add('bg-white/5', 'border-white/5');
        if (check) { check.classList.remove('bg-brand-gold', 'border-brand-gold'); check.classList.add('border-white/30'); }
        if (mark) mark.classList.add('opacity-0');
        total -= price;
      } else {
        item.classList.add('bg-brand-gold/10', 'border-brand-gold/30');
        item.classList.remove('bg-white/5', 'border-white/5');
        if (check) { check.classList.add('bg-brand-gold', 'border-brand-gold'); check.classList.remove('border-white/30'); }
        if (mark) mark.classList.remove('opacity-0');
        total += price;
      }
      if (totalEl) totalEl.textContent = total.toLocaleString() + ' DA';
    });
  });
})();

// ─────────────────────────────────────────────
// 14. FAQ ACCORDION
// ─────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-answer');
  const icon = btn.querySelector('[data-lucide="chevron-down"]');
  const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
  document.querySelectorAll('.faq-item .faq-answer').forEach(a => a.style.maxHeight = '0px');
  document.querySelectorAll('.faq-item [data-lucide="chevron-down"]').forEach(i => i.style.transform = 'rotate(0deg)');
  if (!isOpen) { answer.style.maxHeight = answer.scrollHeight + 'px'; icon.style.transform = 'rotate(180deg)'; }
}

// ─────────────────────────────────────────────
// 15. LIGHTBOX
// ─────────────────────────────────────────────
function openLightbox(element, type) {
  const caption = element.querySelector('h3').textContent;
  const category = element.querySelector('span').textContent;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const vid = document.getElementById('lightbox-video');
  const ph = document.getElementById('lightbox-placeholder');
  if (img) img.style.display = 'none';
  if (vid) vid.style.display = 'none';
  if (ph) ph.style.display = 'none';
  if (type === 'video' && vid) {
    vid.style.display = 'block';
    vid.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
    vid.play();
  } else if (ph) {
    ph.style.display = 'flex';
    ph.innerHTML = '<span style="font-size:80px">' + (element.querySelector('.text-5xl')?.textContent || '\ud83d\udcf8') + '</span>';
  }
  document.getElementById('lightbox-caption').innerHTML = '<span class="text-brand-gold text-sm uppercase tracking-wider">' + category + '</span><br><span class="text-xl font-bold">' + caption + '</span>';
  if (lb) lb.classList.add('active');
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const vid = document.getElementById('lightbox-video');
  if (vid) { vid.pause(); vid.src = ''; }
  if (lb) lb.classList.remove('active');
}

// ─────────────────────────────────────────────
// 16. DEVIS MODAL
// ─────────────────────────────────────────────
function openDevis(serviceKey = null) {
  const m = document.getElementById('devis-modal');
  const budgetBlock = document.getElementById('devis-budget-block');
  const tshirtBlock = document.getElementById('devis-tshirt-block');
  const isTshirt = serviceKey === 'tenue';

  if (budgetBlock) budgetBlock.classList.toggle('hidden', isTshirt);
  if (tshirtBlock) tshirtBlock.classList.toggle('hidden', !isTshirt);

  if (m) {
    m.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  window.currentServiceForDevis = serviceKey || null;

  const serviceMap = { tenue: 'branding', box: 'autre', enseigne: 'autre', stand: 'autre', goodies: 'autre', espaces: 'digital', video: 'digital', print: 'print', habillage: 'autre', flexibles: 'print' };
  const serviceSelect = document.getElementById('devis-service');
  if (serviceSelect && serviceKey && serviceMap[serviceKey]) serviceSelect.value = serviceMap[serviceKey];
}
function closeDevis() {
  const m = document.getElementById('devis-modal');
  if (m) { m.classList.add('hidden'); document.body.style.overflow = ''; }
}
function handleDevisWhatsApp(e) {
  e.preventDefault();
  const name = document.getElementById('devis-name').value.trim();
  const phone = document.getElementById('devis-phone').value.trim();
  const email = document.getElementById('devis-email').value.trim();
  const service = document.getElementById('devis-service').value;
  const message = document.getElementById('devis-message').value.trim();
  const logoInput = document.getElementById('devis-logo');
  const serviceName = window.currentServiceForDevis || service || 'Non sp\u00e9cifi\u00e9';
  let budget = '';
  const budgetSlider = document.getElementById('devis-budget');
  const tshirtSlider = document.getElementById('devis-tshirt-qty');
  if (budgetSlider && !budgetSlider.closest('.hidden')) budget = budgetSlider.value;
  let tshirtQty = '';
  if (tshirtSlider && !tshirtSlider.closest('.hidden')) tshirtQty = tshirtSlider.value;
  let logoInfo = 'Aucun logo fourni';
  if (logoInput && logoInput.files.length > 0) logoInfo = logoInput.files[0].name + ' (' + (logoInput.files[0].size / 1024).toFixed(1) + ' Ko)';
  const body = 'Nouvelle demande de devis - Brandily%0A%0A' +
    'Service: ' + serviceName + '%0A' +
    'Nom: ' + name + '%0A' +
    'T\u00e9l\u00e9phone: ' + phone + '%0A' +
    'Email: ' + email + '%0A' +
    (budget ? 'Budget: ' + parseInt(budget).toLocaleString() + ' DA%0A' : '') +
    (tshirtQty ? 'Quantit\u00e9 T-shirts: ' + tshirtQty + '%0A' : '') +
    'Logo: ' + logoInfo + '%0A' +
    'Message: ' + (message || 'Aucun');
  closeDevis();
  window.location.href = 'https://wa.me/213550412120?text=' + body;
  showNotification('Redirection vers WhatsApp avec vos informations.');
}

// ─────────────────────────────────────────────
// 17. CONTACT FORM
// ─────────────────────────────────────────────
function handleContactSubmit(channel) {
  const name = document.getElementById('contact-name').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const service = document.getElementById('contact-service').value;
  const message = document.getElementById('contact-message').value.trim();
  if (!name || !phone || !email || !message) {
    showNotification('Veuillez remplir tous les champs obligatoires.');
    return;
  }
  const body = `Nom: ${name}%0ATéléphone: ${phone}%0AEmail: ${email}%0AService: ${service}%0AMessage: ${message}`;
  if (channel === 'whatsapp') {
    window.open(`https://wa.me/213550412120?text=${body}`, '_blank');
  } else {
    document.location.href = `mailto:brandily@e-concept.com?subject=Nouvelle demande - ${service}&body=${body}`;
  }
  showNotification('Message envoyé avec succès ! Nous vous contacterons rapidement.');
  document.getElementById('contact-form').reset();
}

// ─────────────────────────────────────────────
// 18. NOTIFICATION TOAST
// ─────────────────────────────────────────────
function showNotification(text) {
  const n = document.getElementById('notification');
  const t = document.getElementById('notification-text');
  if (t) t.textContent = text;
  if (n) {
    n.classList.remove('translate-x-full');
    setTimeout(() => n.classList.add('translate-x-full'), 3000);
  }
}

function sendQuickContact(channel) {
  const email = document.getElementById('quick-contact-email').value.trim();
  const msg = document.getElementById('quick-contact-msg').value.trim();
  if (!email) {
    showNotification('Veuillez entrer votre email.');
    return;
  }
  const body = `Nom: ${email}\nMessage: ${msg || '(aucun message)'}`;
  if (channel === 'whatsapp') {
    window.open(`https://wa.me/213550412120?text=${encodeURIComponent(body)}`, '_blank');
  } else {
    document.location.href = `mailto:brandily@e-concept.com?subject=Nouveau contact depuis le site&body=${encodeURIComponent(body)}`;
  }
  showNotification('Message envoy\u00e9 avec succ\u00e8s !');
}

// ─────────────────────────────────────────────
// 20. SERVICE DETAIL MODAL — 3D tilt card
// ─────────────────────────────────────────────
const serviceIcons = {
  tenue: 'fas fa-tshirt',
  box: 'fas fa-box-open',
  enseigne: 'fas fa-lightbulb',
  stand: 'fas fa-store',
  goodies: 'fas fa-gift',
  espaces: 'fas fa-bullhorn',
  video: 'fas fa-video',
  print: 'fas fa-print',
  habillage: 'fas fa-truck',
  flexibles: 'fas fa-layer-group'
};

const serviceData = {
  tenue: { name: 'Tenue Personnalis\u00e9e', desc: 'Nous concevons et r\u00e9alisons des v\u00eatements professionnels aux couleurs de votre marque, alliant confort, durabilit\u00e9 et identit\u00e9 visuelle forte.', benefits: ['Tissus premium et personnalisables', 'Broderie et s\u00e9rigraphie haute qualit\u00e9', 'D\u00e9lais rapides (3-10 jours)', 'Commande en gros ou petite s\u00e9rie'] },
  box: { name: 'Box Cadeaux', desc: 'Offrez une exp\u00e9rience unique avec nos box cadeaux personnalis\u00e9es, parfaites pour vos \u00e9v\u00e9nements d\'entreprise, lancements produits ou relations clients.', benefits: ['Design sur mesure', 'Contenu personnalisable', 'Packaging premium', 'Livraison offerte d\u00e8s 20 box', 'Id\u00e9al pour vos \u00e9v\u00e9nements'] },
  enseigne: { name: 'Enseigne Lumineuse', desc: 'Attirez le regard avec nos enseignes lumineuses LED sur mesure, visibles de jour comme de nuit pour maximiser votre visibilit\u00e9.', benefits: ['LED basse consommation', '\u00c9tanch\u00e9it\u00e9 IP65', 'Installation incluse', 'Garantie 2 ans', 'Design 3D possible'] },
  stand: { name: 'Stand d\'Exposition', desc: 'Marquez les esprits lors de vos salons avec des stands modulaires ou sur mesure qui refl\u00e8tent l\'excellence de votre marque.', benefits: ['Structure modulaire ou sur mesure', 'Graphisme haute r\u00e9solution', 'Montage rapide', 'Stockage possible', 'Accompagnement d\u00e9di\u00e9'] },
  goodies: { name: 'Supports personnalis\u00e9s', desc: 'Des goodies aux objets publicitaires, nous cr\u00e9ons des supports qui portent votre marque partout o\u00f9 vont vos clients.', benefits: ['Large gamme de produits', 'Marquage HD', 'Quantit\u00e9 flexible', 'Livraison rapide', 'Rapport qualit\u00e9-prix optimal'] },
  espaces: { name: 'Espaces publicitaires', desc: 'Maximisez votre visibilit\u00e9 avec nos espaces publicitaires strat\u00e9giquement plac\u00e9s pour toucher votre audience cible.', benefits: ['Emplacements premium', '\u00c9tude d\'audience', 'Format adapt\u00e9', 'Suivi performance', 'Contrat flexible'] },
  video: { name: 'Vid\u00e9os & Motion Design', desc: 'Captez l\'attention avec des vid\u00e9os dynamiques et du motion design percutant pour vos r\u00e9seaux sociaux et votre site web.', benefits: ['Storytelling cr\u00e9atif', 'Animation 2D/3D', 'Format adapt\u00e9 \u00e0 chaque r\u00e9seau', 'Voix-off possible', 'D\u00e9lais express'] },
  print: { name: 'Print Premium', desc: 'Une impression haut de gamme pour tous vos supports : cartes de visite, flyers, catalogues, affiches et bien plus.', benefits: ['Impressions HD/Brochage', 'Papiers premium', 'Fa\u00e7onnage soign\u00e9', 'Tirages petit \u00e0 grand format', 'Finitions pelliculage/dorure'] },
  habillage: { name: 'Habillage Publicitaire', desc: 'Transformez vos v\u00e9hicules et vitrines en supports publicitaires mobiles avec un habillage sur mesure et impactant.', benefits: ['Film premium r\u00e9sistant UV', 'Pose sans bulle garantie', 'D\u00e9montage sans trace', 'Design exclusif', 'Devis gratuit'] },
  flexibles: { name: 'Supports flexibles', desc: 'Des b\u00e2ches aux roll-ups, en passant par les drapeaux et kak\u00e9monos, nous imprimons sur tous supports flexibles.', benefits: ['Mat\u00e9riaux r\u00e9sistants', 'Grands formats possibles', 'Impression quadri/num\u00e9rique', 'Montage simple', 'Transport facile'] }
};

function showServiceDetail(key) {
  window.currentServiceForDevis = key || null;
  const data = serviceData[key];
  if (!data) return;
  const modal = document.getElementById('service-modal');
  const card = document.getElementById('service-modal-card');
  const titleEl = document.getElementById('service-modal-title');
  const descEl = document.getElementById('service-modal-desc');
  const benefitsEl = document.getElementById('service-modal-benefits');
  const iconEl = document.getElementById('service-modal-icon');
  if (!modal || !card) return;
  if (iconEl) {
    const iconName = serviceIcons[key] || 'fas fa-star';
    iconEl.innerHTML = '<i class="' + iconName + ' w-10 h-10 text-brand-gold"></i>';
  }
  titleEl.textContent = data.name;
  descEl.textContent = data.desc;
  benefitsEl.innerHTML = data.benefits.map(b =>
    '<div class="flex items-start gap-3"><svg class="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span class="text-white/80 text-sm">' + b + '</span></div>'
  ).join('');
  modal.classList.remove('pointer-events-none');
  if (typeof gsap !== 'undefined') gsap.to(modal, { opacity: 1, duration: 0.5, ease: 'power3.out' });
  else modal.style.opacity = '1';
  document.body.style.overflow = 'hidden';
}

window.closeServiceModal = function() {
  const modal = document.getElementById('service-modal');
  const card = document.getElementById('service-modal-card');
  if (!modal) return;
  if (typeof gsap !== 'undefined') {
    gsap.to(modal, { opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: () => modal.classList.add('pointer-events-none') });
  } else {
    modal.style.opacity = '0';
    modal.classList.add('pointer-events-none');
  }
  if (card) card.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
  document.body.style.overflow = '';
};

(function initServiceModalTilt() {
  const modal = document.getElementById('service-modal');
  const card = document.getElementById('service-modal-card');
  if (!modal || !card) return;
  modal.addEventListener('mousemove', (e) => {
    if (modal.classList.contains('pointer-events-none')) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.transform = 'perspective(1200px) rotateX(' + ((y - 0.5) * -12) + 'deg) rotateY(' + ((x - 0.5) * 12) + 'deg)';
    card.style.boxShadow = ((x - 0.5) * 30) + 'px ' + ((y - 0.5) * 30) + 'px 80px rgba(245,179,1,0.15), 0 0 0 1px rgba(245,179,1,0.08)';
  });
  modal.addEventListener('mouseleave', () => {
    if (modal.classList.contains('pointer-events-none')) return;
    card.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
    card.style.boxShadow = '0 40px 100px rgba(245,179,1,0.1), 0 0 0 1px rgba(245,179,1,0.05)';
  });
})();

// ─────────────────────────────────────────────
// 21. NAVBAR SCROLL EFFECT
// ─────────────────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { navbar.style.background = 'rgba(10, 10, 10, 0.95)'; navbar.classList.add('shadow-lg'); }
    else { navbar.style.background = 'rgba(10, 10, 10, 0.8)'; navbar.classList.remove('shadow-lg'); }
  });
})();

// ─────────────────────────────────────────────
// 22. ESCAPE HANDLER
// ─────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeDevis();
    if (window.closeServiceModal) closeServiceModal();
  }
});

// ─────────────────────────────────────────────
// 23. SPA NAVIGATION ROUTING
// ─────────────────────────────────────────────
(function initRouting() {
  const sectionMap = {
    accueil: document.getElementById('accueil'),
    services: document.getElementById('services'),
    realisations: document.getElementById('realisations'),
    apropos: document.getElementById('apropos'),
    blog: document.getElementById('blog'),
    contact: document.getElementById('contact')
  };

  window.navigateTo = function(page) {
    if (page === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const sec = sectionMap[page];
      if (sec) {
        const navbar = document.getElementById('navbar');
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = sec.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    const mm = document.getElementById('mobile-menu');
    if (mm) mm.classList.remove('active');
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (menuBtn) {
      const icon = menuBtn.querySelector('i');
      if (icon) icon.setAttribute('data-lucide', 'menu');
    }
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.remove('text-brand-gold');
      if (l.getAttribute('href') === '#' + page) l.classList.add('text-brand-gold');
    });
    setTimeout(() => lucide.createIcons(), 100);
  };

  function onHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && sectionMap[hash]) navigateTo(hash);
  }
  window.addEventListener('hashchange', onHash);
  if (window.location.hash) onHash();
})();

// Intercept all hash link clicks for smooth SPA nav
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href === '#') return;
  const page = href.slice(1);
  if (window.navigateTo && page) {
    e.preventDefault();
    history.pushState(null, '', href);
    window.navigateTo(page);
  }
});

document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'R') {
    const section = document.getElementById('realisations');
    if (section) {
      section.classList.toggle('hidden');
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ─── TRANSLATION SYSTEM ──────────────────────────
const translations = {
  fr: {
    nav_accueil: 'Accueil',
    nav_services: 'Services',
    nav_realisations: 'Réalisations',
    nav_apropos: 'À Propos',
    nav_contact: 'Contact',
    nav_devis: 'Demander un devis',
    hero_badge: 'Agence de Publicité & Communication Visuelle',
    hero_title1: 'Transformons vos',
    hero_title_highlight: 'idées',
    hero_title2: 'en expériences visuelles',
    hero_title3: 'mémorables',
    hero_desc: 'Nous créons des solutions publicitaires innovantes qui donnent vie à votre marque et captivent votre audience.',
    hero_btn_services: 'Nos Services',
    hero_btn_devis: 'Demander un Devis',
    stats_title: 'Ils nous font confiance',
    stats_1: 'Plus de 2000 Projets Réalisés',
    stats_2: '1000 Clients Satisfaits',
    stats_3: 'Années d\'Expérience',
    stats_4: 'Support Client',
    services_badge: 'Nos Services',
    services_title1: 'Des solutions',
    services_title_highlight: 'complètes',
    services_title2: 'pour votre marque',
    services_desc: 'De la conception à la réalisation, nous vous accompagnons à chaque étape.',
    services_hover: 'Survolez les cartes pour voir la magie 3D',
    marques_title: 'Ils nous font confiance',
    marques_sub: 'Rejoignez les entreprises qui nous font confiance',
    portfolio_badge: 'Portfolio',
    portfolio_title1: 'Nos',
    portfolio_title_highlight: 'Réalisations',
    portfolio_desc: 'Découvrez nos projets les plus récents et laissez-vous inspirer',
    filter_all: 'Tous',
    filter_signaletique: 'Signalétique',
    filter_vehicules: 'Véhicules',
    filter_edition: 'Edition',
    filter_evenementiel: 'Événementiel',
    filter_digital: 'Digital',
    filter_objets: 'Objets',
    pourquoi_title: 'Pourquoi',
    pourquoi_highlight: 'Brandily ?',
    apropos_badge: 'À Propos',
    apropos_title1: 'Une agence',
    apropos_highlight: 'passionnée',
    apropos_title2: 'au service de votre marque',
    contact_badge: 'Contact',
    contact_title1: 'Parlons de votre',
    contact_highlight: 'projet',
    contact_form_name: 'Nom complet',
    contact_form_phone: 'Téléphone',
    contact_form_email: 'Email',
    contact_form_service: 'Service',
    contact_form_message: 'Votre message',
    contact_form_submit_wa: 'Envoyer via WhatsApp',
    contact_form_submit_email: 'Envoyer par Email',
    footer_tagline: 'Transformons vos idées en réalités visuelles mémorables.',
    footer_contact: 'Contact',
    footer_email: 'Email',
    footer_phone: 'Téléphone',
    footer_follow: 'Suivez-nous',
    savoir_plus: 'En savoir plus',
    devis_title: 'Demander un',
    devis_highlight: 'devis',
    devis_desc: 'Remplissez ce formulaire pour recevoir une estimation personnalisée.',
    devis_name: 'Nom complet *',
    devis_phone: 'Téléphone *',
    devis_email: 'Email *',
    devis_project: 'Type de projet *',
    devis_budget: 'Budget estimé',
    devis_tshirt: 'Quantité T-shirts',
    devis_logo: 'Votre logo',
    devis_logo_opt: 'Optionnel - Téléchargez votre logo si vous en avez un',
    devis_message: 'Décrivez votre projet en détail...',
    devis_submit: 'Envoyer via WhatsApp',
    service_tenue: 'Tenue Personnalisée',
    service_box: 'Box Cadeaux',
    service_enseigne: 'Enseigne Lumineuse',
    service_stand: 'Stand d\'Exposition',
    service_goodies: 'Supports personnalisés',
    service_espaces: 'Espaces publicitaires',
    service_video: 'Vidéos & Motion Design',
    service_print: 'Print Premium',
    service_habillage: 'Habillage Publicitaire',
    service_flexibles: 'Supports flexibles',
    modal_devis: 'Demander un devis',
    modal_contact: 'Nous contacter'
  },
  en: {
    nav_accueil: 'Home',
    nav_services: 'Services',
    nav_realisations: 'Portfolio',
    nav_apropos: 'About',
    nav_contact: 'Contact',
    nav_devis: 'Get a Quote',
    hero_badge: 'Advertising & Visual Communication Agency',
    hero_title1: 'Transform your',
    hero_title_highlight: 'ideas',
    hero_title2: 'into memorable visual',
    hero_title3: 'experiences',
    hero_desc: 'We create innovative advertising solutions that bring your brand to life and captivate your audience.',
    hero_btn_services: 'Our Services',
    hero_btn_devis: 'Request a Quote',
    stats_title: 'They trust us',
    stats_1: 'Over 2000 Projects Completed',
    stats_2: '1000 Satisfied Clients',
    stats_3: 'Years of Experience',
    stats_4: 'Client Support',
    services_badge: 'Our Services',
    services_title1: 'Complete',
    services_title_highlight: 'solutions',
    services_title2: 'for your brand',
    services_desc: 'From design to realization, we support you at every step.',
    services_hover: 'Hover over cards to see 3D magic',
    marques_title: 'They trust us',
    marques_sub: 'Join the companies that trust us',
    portfolio_badge: 'Portfolio',
    portfolio_title1: 'Our',
    portfolio_title_highlight: 'Work',
    portfolio_desc: 'Discover our latest projects and get inspired',
    filter_all: 'All',
    filter_signaletique: 'Signage',
    filter_vehicules: 'Vehicles',
    filter_edition: 'Print',
    filter_evenementiel: 'Events',
    filter_digital: 'Digital',
    filter_objets: 'Objects',
    pourquoi_title: 'Why',
    pourquoi_highlight: 'Brandily?',
    apropos_badge: 'About Us',
    apropos_title1: 'A',
    apropos_highlight: 'passionate',
    apropos_title2: 'agency serving your brand',
    contact_badge: 'Contact',
    contact_title1: 'Let\'s talk about your',
    contact_highlight: 'project',
    contact_form_name: 'Full Name',
    contact_form_phone: 'Phone',
    contact_form_email: 'Email',
    contact_form_service: 'Service',
    contact_form_message: 'Your message',
    contact_form_submit_wa: 'Send via WhatsApp',
    contact_form_submit_email: 'Send by Email',
    footer_tagline: 'Transform your ideas into memorable visual realities.',
    footer_contact: 'Contact',
    footer_email: 'Email',
    footer_phone: 'Phone',
    footer_follow: 'Follow us',
    savoir_plus: 'Learn more',
    devis_title: 'Request a',
    devis_highlight: 'quote',
    devis_desc: 'Fill out this form to receive a personalized estimate.',
    devis_name: 'Full Name *',
    devis_phone: 'Phone *',
    devis_email: 'Email *',
    devis_project: 'Project Type *',
    devis_budget: 'Estimated Budget',
    devis_tshirt: 'T-shirt Quantity',
    devis_logo: 'Your Logo',
    devis_logo_opt: 'Optional - Upload your logo if you have one',
    devis_message: 'Describe your project in detail...',
    devis_submit: 'Send via WhatsApp',
    service_tenue: 'Custom Clothing',
    service_box: 'Gift Boxes',
    service_enseigne: 'Light Signage',
    service_stand: 'Exhibition Stand',
    service_goodies: 'Custom Supplies',
    service_espaces: 'Advertising Spaces',
    service_video: 'Video & Motion Design',
    service_print: 'Premium Print',
    service_habillage: 'Advertising Wrapping',
    service_flexibles: 'Flexible Supports',
    modal_devis: 'Request a Quote',
    modal_contact: 'Contact Us'
  },
  ar: {
    nav_accueil: 'الرئيسية',
    nav_services: 'الخدمات',
    nav_realisations: 'إنجازاتنا',
    nav_apropos: 'عن الشركة',
    nav_contact: 'اتصل بنا',
    nav_devis: 'طلب عرض سعر',
    hero_badge: 'وكالة إعلان وتواصل بصري',
    hero_title1: 'حوّل',
    hero_title_highlight: 'أفكارك',
    hero_title2: 'إلى تجارب بصرية',
    hero_title3: 'لا تُنسى',
    hero_desc: 'نبتكر حلولاً إعلانية مبتكرة تمنح علامتك التجارية الحياة وتأسر جمهورك.',
    hero_btn_services: 'خدماتنا',
    hero_btn_devis: 'طلب عرض سعر',
    stats_title: 'يثقون بنا',
    stats_1: 'أكثر من 2000 مشروع منجز',
    stats_2: '1000 عميل راضٍ',
    stats_3: 'سنوات من الخبرة',
    stats_4: 'دعم العملاء',
    services_badge: 'خدماتنا',
    services_title1: 'حلول',
    services_title_highlight: 'شاملة',
    services_title2: 'لعلامتك التجارية',
    services_desc: 'من التصميم إلى الإنجاز، نرافقكم في كل خطوة.',
    services_hover: 'مرر فوق البطاقات لرؤية السحر ثلاثي الأبعاد',
    marques_title: 'يثقون بنا',
    marques_sub: 'انضم إلى الشركات التي تثق بنا',
    portfolio_badge: 'معرض الأعمال',
    portfolio_title1: 'أعمالنا',
    portfolio_title_highlight: 'الحديثة',
    portfolio_desc: 'اكتشف أحدث مشاريعنا واستلهم',
    filter_all: 'الكل',
    filter_signaletique: 'لافتات',
    filter_vehicules: 'مركبات',
    filter_edition: 'مطبوعات',
    filter_evenementiel: 'مناسبات',
    filter_digital: 'رقمي',
    filter_objets: 'هدايا',
    pourquoi_title: 'لماذا',
    pourquoi_highlight: 'برانديلي؟',
    apropos_badge: 'عن الشركة',
    apropos_title1: 'وكالة',
    apropos_highlight: 'شغوفة',
    apropos_title2: 'في خدمة علامتك التجارية',
    contact_badge: 'اتصل بنا',
    contact_title1: 'تحدث عن',
    contact_highlight: 'مشروعك',
    contact_form_name: 'الاسم الكامل',
    contact_form_phone: 'الهاتف',
    contact_form_email: 'البريد الإلكتروني',
    contact_form_service: 'الخدمة',
    contact_form_message: 'رسالتك',
    contact_form_submit_wa: 'أرسل عبر واتساب',
    contact_form_submit_email: 'أرسل عبر البريد',
    footer_tagline: 'حوّل أفكارك إلى حقائق بصرية لا تُنسى.',
    footer_contact: 'اتصل بنا',
    footer_email: 'البريد الإلكتروني',
    footer_phone: 'الهاتف',
    footer_follow: 'تابعنا',
    savoir_plus: 'المزيد',
    devis_title: 'طلب',
    devis_highlight: 'عرض سعر',
    devis_desc: 'املأ هذا النموذج للحصول على تقدير شخصي.',
    devis_name: 'الاسم الكامل *',
    devis_phone: 'الهاتف *',
    devis_email: 'البريد الإلكتروني *',
    devis_project: 'نوع المشروع *',
    devis_budget: 'الميزانية المقدرة',
    devis_tshirt: 'كمية التيشيرتات',
    devis_logo: 'شعارك',
    devis_logo_opt: 'اختياري - حمل شعارك إذا كان لديك',
    devis_message: 'صف مشروعك بالتفصيل...',
    devis_submit: 'أرسل عبر واتساب',
    service_tenue: 'ملابس مخصصة',
    service_box: 'صناديق هدايا',
    service_enseigne: 'لافتات مضيئة',
    service_stand: 'جناح معارض',
    service_goodies: 'هدايا دعائية',
    service_espaces: 'مساحات إعلانية',
    service_video: 'فيديو وموشن ديزاين',
    service_print: 'طباعة فاخرة',
    service_habillage: 'تغليف إعلاني',
    service_flexibles: 'وسائط مرنة',
    modal_devis: 'طلب عرض سعر',
    modal_contact: 'اتصل بنا'
  }
};

let currentLang = localStorage.getItem('brandily_lang') || 'fr';

function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('brandily_lang', lang);
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const t = translations[lang];
    if (t && t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else if (el.tagName === 'SELECT') {
        const selected = el.value;
        const options = el.querySelectorAll('option');
        options.forEach((opt, idx) => {
          if (idx > 0) {
            const optKey = opt.getAttribute('data-i18n');
            if (optKey && t[optKey]) opt.textContent = t[optKey];
          }
        });
        el.value = selected;
      } else {
        el.textContent = t[key];
      }
    }
  });
}

switchLanguage(currentLang);
