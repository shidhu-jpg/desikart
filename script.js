/* ===================================================
   DESIKART – script.js
   =================================================== */

/* --- Navbar scroll effect --- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* --- Mobile hamburger --- */
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

/* --- Product tabs --- */
const tabs     = document.querySelectorAll('.tab');
const grids    = document.querySelectorAll('.product-grid');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    grids.forEach(g => g.classList.add('hidden'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.tab);
    if (target) target.classList.remove('hidden');
  });
});

/* --- Qty buttons --- */
document.querySelectorAll('.product-card').forEach(card => {
  const minusBtn  = card.querySelector('.qty-btn.minus');
  const plusBtn   = card.querySelector('.qty-btn.plus');
  const qtyValue  = card.querySelector('.qty-value');

  minusBtn.addEventListener('click', () => {
    let v = parseInt(qtyValue.textContent, 10);
    if (v > 1) { qtyValue.textContent = v - 1; }
  });

  plusBtn.addEventListener('click', () => {
    let v = parseInt(qtyValue.textContent, 10);
    qtyValue.textContent = v + 1;
  });
});

/* --- WhatsApp order builder --- */
function orderOnWhatsApp(btn) {
  const card    = btn.closest('.product-card');
  const product = card.dataset.product;
  const price   = card.dataset.price;
  const unit    = card.dataset.unit;
  const qty     = card.querySelector('.qty-value').textContent;
  const name    = card.querySelector('h3').textContent;
  const total   = parseInt(price, 10) * parseInt(qty, 10);

  const msg = `Hello DesiKart! 🥛\n\nI'd like to order:\n\n📦 *${name}*\nQuantity: ${qty} ${unit}\nPrice: ₹${price}/${unit}\nTotal: ₹${total}\n\nPlease confirm and let me know the delivery time. Thank you!`;
  const url = `https://wa.me/918271477101?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}
window.orderOnWhatsApp = orderOnWhatsApp;

/* --- Contact form → WhatsApp --- */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !phone || !message) { showToast('Please fill in all fields.'); return; }

  const msg = `Hello DesiKart! 👋\n\n*Name:* ${name}\n*Phone:* ${phone}\n\n*Message:*\n${message}`;
  const url = `https://wa.me/918271477101?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  showToast('Opening WhatsApp…');
  e.target.reset();
});

/* --- Testimonial slider --- */
(function initSlider() {
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('testimonialDots');
  const cards  = track.querySelectorAll('.testimonial-card');
  let current  = 0;
  let autoId;

  const cardWidth = () => cards[0].getBoundingClientRect().width + 24; // gap = 24

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * cardWidth()}px)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsEl.appendChild(dot);
  });

  function startAuto() { autoId = setInterval(() => goTo(current + 1), 4000); }
  function resetAuto() { clearInterval(autoId); startAuto(); }
  startAuto();

  // Touch / drag support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  window.addEventListener('resize', () => goTo(current));
})();

/* --- Scroll-reveal animations --- */
const revealEls = document.querySelectorAll(
  '.product-card, .feature-card, .step, .testimonial-card, .contact-item, .contact-form-wrapper'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity .55s ease ${i * 0.06}s, transform .55s cubic-bezier(.4,0,.2,1) ${i * 0.06}s`;
  observer.observe(el);
});

/* --- Toast utility --- */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* --- Smooth active nav highlight on scroll --- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--green)' : '';
  });
}, { passive: true });
