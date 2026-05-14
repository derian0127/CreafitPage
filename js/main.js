/* ============================================================
   MAIN.JS — CREAFIT
   ============================================================ */

/* ── Configuration ───────────────────────────────────────── */
const waMeta = document.querySelector('meta[name="creafit-whatsapp"]')?.getAttribute("content");
const CONFIG = {
  whatsappNumber: (waMeta && waMeta.trim()) || "573001557404",
  currency: "COP",
  locale: "es-CO"
};

/** Digits only — wa.me expects country + number without symbols */
function whatsappDigits() {
  return String(CONFIG.whatsappNumber).replace(/\D/g, "");
}

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
let cart = JSON.parse(localStorage.getItem('creafit_cart')) || [];
let nextId = cart.length ? Math.max(...cart.map(i => i.id)) + 1 : 1;

/** Format number as Colombian peso string */
const cop = n => '$' + n.toLocaleString(CONFIG.locale);

function saveCart() {
  localStorage.setItem('creafit_cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: nextId++, name, price, qty: 1 });
  }
  renderCart();
  updateBadge();
  saveCart();
  showToast(`<strong>${name}</strong> añadido`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  updateBadge();
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    renderCart();
    updateBadge();
    saveCart();
  }
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
      <div class="ci-info">
        <div class="cname">${item.name}</div>
        <div class="cprice">${cop(item.price * item.qty)}</div>
        <div class="cqty-ctrl">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
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
  
  // Animation logic
  if (count > parseInt(badge.textContent || 0)) {
    badge.classList.remove('bump');
    void badge.offsetWidth; // Trigger reflow
    badge.classList.add('bump');
  }

  badge.textContent = count;
  badge.classList.toggle('on', count > 0);
}

/* ── Floating Buttons Logic ───────────────────────────────── */
window.addEventListener('scroll', () => {
  const ftop = document.getElementById('ftop');
  if (!ftop) return;
  if (window.scrollY > 400) {
    ftop.classList.add('on');
  } else {
    ftop.classList.remove('on');
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openWhatsApp() {
  const url = `https://wa.me/${whatsappDigits()}?text=${encodeURIComponent("¡Hola CREAFIT! 👋 Tengo una consulta.")}`;
  window.open(url, "_blank", "noopener,noreferrer");
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
    showToast('El carrito está vacío.');
    return;
  }

  let message = "¡Hola CREAFIT! 👋 Me gustaría realizar el siguiente pedido:\n\n";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    message += `• ${item.name} x${item.qty} — ${cop(subtotal)}\n`;
  });

  message += `\n━━━━━━━━━━━━━━━\n*TOTAL: ${cop(total)}*\n━━━━━━━━━━━━━━━\n\n¿Me podrían confirmar disponibilidad y medios de pago?`;
  message += "\n\n(Ref. web · utm_source=site&utm_medium=whatsapp&utm_campaign=landing-cart)";

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappDigits()}?text=${encodedMessage}`;

  // Abrir en el mismo tick del click evita que el bloqueador de ventanas emergentes corte el open tras un setTimeout.
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  closeCart();
  showToast("Se abrió WhatsApp con tu pedido.");
}

// Initial render
renderCart();
updateBadge();

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
