/* ============================================================
   MAIN.JS — CREAFIT
   ============================================================ */

/* ── Marquee ─────────────────────────────────────────────── */
(function initMarquee() {
  const words = [
    'Ciencia Aplicada', 'Rendimiento Real', 'Sin Rellenos',
    'Grado Clínico', 'Certificado GMP', 'Informed Sport',
    'Transparencia Total', 'Atletas de Élite'
  ];
  const track = document.getElementById('mtrack');
  if (!track) return;
  const row = words.map(w =>
    `<span class="mitem">${w}<span class="mdot"></span></span>`
  ).join('');
  // Duplicate for seamless loop
  track.innerHTML = row + row;
})();


/* ── Cart ─────────────────────────────────────────────────── */
let cart = [];
let nextId = 1;

/** Format number as Colombian peso string */
const cop = n => '$' + n.toLocaleString('es-CO');

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: nextId++, name, price, qty: 1 });
  }
  renderCart();
  updateBadge();
  showToast(`<strong>${name}</strong> añadido`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  updateBadge();
}

function renderCart() {
  const container = document.getElementById('cpitems');
  const emptyMsg  = document.getElementById('cpempty');
  if (!container) return;

  // Remove existing items (keep the empty message element)
  container.querySelectorAll('.citem').forEach(el => el.remove());

  if (!cart.length) {
    emptyMsg.style.display = '';
    document.getElementById('cptotal').textContent = '$0';
    return;
  }

  emptyMsg.style.display = 'none';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const el = document.createElement('div');
    el.className = 'citem';
    el.innerHTML = `
      <div class="cimg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <div>
        <div class="cname">
          ${item.name}
          ${item.qty > 1
            ? `<span style="font-family:var(--B);font-size:.72rem;color:var(--muted)">×${item.qty}</span>`
            : ''}
        </div>
        <div class="cprice">${cop(item.price * item.qty)}</div>
      </div>
      <button class="crm" onclick="removeFromCart(${item.id})">✕</button>
    `;
    container.appendChild(el);
  });

  document.getElementById('cptotal').textContent = cop(total);
}

function updateBadge() {
  const badge = document.getElementById('bdg');
  if (!badge) return;
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = count;
  badge.classList.toggle('on', count > 0);
}

function openCart() {
  document.getElementById('cpanel').classList.add('on');
  document.getElementById('overlay').classList.add('on');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cpanel').classList.remove('on');
  document.getElementById('overlay').classList.remove('on');
  document.body.style.overflow = '';
}

function checkout() {
  if (!cart.length) {
    showToast('Carrito vacío.');
    return;
  }
  showToast('Redirigiendo al pago…');
  setTimeout(closeCart, 500);
}

document.getElementById('cartBtn')?.addEventListener('click', openCart);


/* ── Toast ─────────────────────────────────────────────────── */
let toastTimer;

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.innerHTML = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
}


/* ── Newsletter ─────────────────────────────────────────────── */
function subscribe() {
  const input = document.querySelector('.nli');
  if (!input || !input.value || !input.value.includes('@')) {
    showToast('Email inválido.');
    return;
  }
  showToast(`Suscrito: <strong>${input.value}</strong>`);
  input.value = '';
}


/* ── Mobile nav ─────────────────────────────────────────────── */
document.getElementById('burger')?.addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});


/* ── Scroll reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = (index * 0.07) + 's';
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade').forEach(el => revealObserver.observe(el));
