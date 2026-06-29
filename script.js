/* ===================================================
   DESIKART – script.js
   =================================================== */

/* =====================
   CART STATE
   ===================== */
let cart = []; // [{ id, name, emoji, price, unit, qty }]

/* =====================
   CART CORE
   ===================== */
function addToCart(btn) {
  const card    = btn.closest('.product-card');
  const id      = card.dataset.product;
  const name    = card.querySelector('h3').textContent.trim();
  const emoji   = card.querySelector('.product-emoji').textContent.trim();
  const price   = parseInt(card.dataset.price, 10);
  const unit    = card.dataset.unit;
  const qty     = parseInt(card.querySelector('.qty-value').textContent, 10);

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, emoji, price, unit, qty });
  }

  updateCartBadge();
  renderCart();
  openCart();
  showToast(`✓ ${name} added to cart!`);

  // Button feedback animation
  const origHTML = btn.innerHTML;
  btn.classList.add('added');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg> Added!`;
  setTimeout(() => {
    btn.classList.remove('added');
    btn.innerHTML = origHTML;
  }, 1600);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartBadge();
  renderCart();
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  const next = item.qty + delta;
  if (next < 1) {
    removeFromCart(id);
    return;
  }
  item.qty = next;
  updateCartBadge();
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  updateCartBadge();
  renderCart();
  showToast('Cart cleared.');
}

function updateCartBadge() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge    = document.getElementById('cartBadge');
  if (totalQty > 0) {
    badge.textContent = totalQty > 99 ? '99+' : totalQty;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderCart() {
  const body      = document.getElementById('cartBody');
  const footer    = document.getElementById('cartFooter');
  const countEl   = document.getElementById('cartItemCount');
  const totalEl   = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty__icon">🛒</div>
        <h4>Your cart is empty</h4>
        <p>Add some fresh dairy or eggs to get started!</p>
        <button class="btn btn--primary" onclick="closeCart(); setTimeout(()=>document.getElementById('products').scrollIntoView({behavior:'smooth'}),300)">
          Browse Products
        </button>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  const grandTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item__emoji">${item.emoji}</div>
      <div class="cart-item__info">
        <h4>${item.name}</h4>
        <span class="cart-item__price">₹${item.price} / ${item.unit}</span>
      </div>
      <div class="cart-item__controls">
        <div class="cart-item__qty">
          <button class="qty-btn minus" onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn plus" onclick="updateCartQty('${item.id}', 1)" aria-label="Increase">+</button>
        </div>
        <div class="cart-item__subtotal">₹${item.price * item.qty}</div>
        <button class="cart-item__remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  `).join('');

  totalEl.textContent = `₹${grandTotal}`;
  footer.style.display = 'block';
}

/* =====================
   CHECKOUT → WHATSAPP
   ===================== */
function checkoutOnWhatsApp() {
  if (cart.length === 0) { showToast('Your cart is empty!'); return; }

  const itemLines = cart
    .map(i => `  • *${i.name}* — ${i.qty} ${i.unit}${i.qty > 1 && i.unit !== 'piece' ? 's' : ''} × ₹${i.price} = ₹${i.price * i.qty}`)
    .join('\n');

  const grandTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount  = cart.reduce((sum, i) => sum + i.qty, 0);

  const msg =
`🛒 *New Order from DesiKart Website*

Hi DesiKart! I'd like to place the following order:

${itemLines}

──────────────────
🧾 *Total Items:* ${itemCount}
💰 *Grand Total: ₹${grandTotal}*
──────────────────

Please confirm my order and let me know the delivery time. Thank you! 🙏`;

  window.open(`https://wa.me/918271477101?text=${encodeURIComponent(msg)}`, '_blank');
}

/* =====================
   CART DRAWER TOGGLE
   ===================== */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ESC key closes cart
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});

/* =====================
   NAVBAR SCROLL EFFECT
   ===================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* =====================
   MOBILE HAMBURGER
   ===================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* =====================
   PRODUCT TABS
   ===================== */
const tabs  = document.querySelectorAll('.tab');
const grids = document.querySelectorAll('.product-grid');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    grids.forEach(g => g.classList.add('hidden'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.tab);
    if (target) target.classList.remove('hidden');
  });
});

/* =====================
   PRODUCT CARD QTY
   ===================== */
document.querySelectorAll('.product-card').forEach(card => {
  const minus = card.querySelector('.qty-btn.minus');
  const plus  = card.querySelector('.qty-btn.plus');
  const val   = card.querySelector('.qty-value');

  minus.addEventListener('click', () => {
    const v = parseInt(val.textContent, 10);
    if (v > 1) val.textContent = v - 1;
  });
  plus.addEventListener('click', () => {
    val.textContent = parseInt(val.textContent, 10) + 1;
  });
});

/* =====================
   CONTACT FORM → WHATSAPP
   ===================== */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !phone || !message) { showToast('Please fill in all fields.'); return; }

  const msg = `Hello DesiKart! 👋\n\n*Name:* ${name}\n*Phone:* ${phone}\n\n*Message:*\n${message}`;
  window.open(`https://wa.me/918271477101?text=${encodeURIComponent(msg)}`, '_blank');
  showToast('Opening WhatsApp…');
  e.target.reset();
});

/* =====================
   TESTIMONIAL SLIDER
   ===================== */
(function initSlider() {
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('testimonialDots');
  const cards  = track.querySelectorAll('.testimonial-card');
  let current  = 0;
  let autoId;

  const gap = 24;
  const cardW = () => cards[0].getBoundingClientRect().width + gap;

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * cardW()}px)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsEl.appendChild(dot);
  });

  function startAuto() { autoId = setInterval(() => goTo(current + 1), 4200); }
  function resetAuto() { clearInterval(autoId); startAuto(); }
  startAuto();

  // Touch/swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  window.addEventListener('resize', () => goTo(current));
})();

/* =====================
   SCROLL REVEAL
   ===================== */
const revealEls = document.querySelectorAll(
  '.product-card, .feature-card, .step, .testimonial-card, .contact-item, .contact-form-wrapper'
);
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity .55s ease ${i * 0.06}s, transform .55s cubic-bezier(.4,0,.2,1) ${i * 0.06}s`;
  revealObserver.observe(el);
});

/* =====================
   ACTIVE NAV HIGHLIGHT
   ===================== */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--green)' : '';
  });
}, { passive: true });

/* =====================
   TOAST UTILITY
   ===================== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* =====================
   INIT
   ===================== */
updateCartBadge();
renderCart();
