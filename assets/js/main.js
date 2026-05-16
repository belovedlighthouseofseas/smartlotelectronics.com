/* Smart Lot Electronics — shared interactions */
(() => {
  'use strict';

  /* ---------- Sticky nav state ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('[data-burger]');
  const panel = document.querySelector('[data-mobile-panel]');
  const closeMobile = document.querySelector('[data-mobile-close]');
  const toggleMobile = (open) => {
    if (!panel) return;
    panel.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger && burger.addEventListener('click', () => toggleMobile(true));
  closeMobile && closeMobile.addEventListener('click', () => toggleMobile(false));
  panel && panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMobile(false)));

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- Cart (localStorage) ---------- */
  const CART_KEY = 'sle_cart_v1';
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  };
  const writeCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));
  const cartCount = () => readCart().reduce((s, i) => s + i.qty, 0);
  const cartTotal = () => readCart().reduce((s, i) => s + i.price * i.qty, 0);
  const fmt = (n) => '$' + n.toFixed(2).replace(/\.00$/, '');

  const updateCountBadge = () => {
    const c = cartCount();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = c;
      el.style.display = c > 0 ? '' : 'none';
    });
  };

  const renderDrawer = () => {
    const body = document.querySelector('[data-drawer-body]');
    const totalEl = document.querySelector('[data-drawer-total]');
    if (!body) return;
    const items = readCart();
    if (items.length === 0) {
      body.innerHTML = `<div class="drawer-empty">
        <p>Your cart is empty.</p>
        <a class="btn btn-ghost" href="shop.html">Browse the catalog</a>
      </div>`;
    } else {
      body.innerHTML = items.map(it => `
        <div class="cart-item" data-id="${it.id}">
          <div class="cart-thumb">${productIcon(it.icon)}</div>
          <div>
            <strong>${it.title}</strong>
            <small>${it.cat}</small>
            <div class="qty">
              <button data-qty="-1" aria-label="Decrease">−</button>
              <span>${it.qty}</span>
              <button data-qty="1" aria-label="Increase">+</button>
              <button data-remove style="margin-left:0.6rem;color:var(--mute);">remove</button>
            </div>
          </div>
          <div class="line-total">${fmt(it.price * it.qty)}</div>
        </div>
      `).join('');
    }
    if (totalEl) totalEl.textContent = fmt(cartTotal());
  };

  const openDrawer = (open) => {
    const drawer = document.querySelector('[data-drawer]');
    const scrim = document.querySelector('[data-scrim]');
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    scrim && scrim.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) renderDrawer();
  };

  document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openDrawer(true); }));
  document.querySelectorAll('[data-close-cart]').forEach(b => b.addEventListener('click', () => openDrawer(false)));

  // Drawer interactions (delegated)
  const drawerBody = document.querySelector('[data-drawer-body]');
  drawerBody && drawerBody.addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item'); if (!item) return;
    const id = item.dataset.id;
    const cart = readCart();
    const idx = cart.findIndex(i => i.id === id);
    if (idx < 0) return;
    if (e.target.dataset.qty) {
      cart[idx].qty = Math.max(1, cart[idx].qty + parseInt(e.target.dataset.qty, 10));
    } else if (e.target.dataset.remove !== undefined) {
      cart.splice(idx, 1);
    } else return;
    writeCart(cart);
    updateCountBadge();
    renderDrawer();
  });

  // Add to cart buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add-cart]');
    if (!btn) return;
    e.preventDefault();
    const item = {
      id: btn.dataset.id,
      title: btn.dataset.title,
      cat: btn.dataset.cat || '',
      price: parseFloat(btn.dataset.price),
      icon: btn.dataset.icon || 'box',
      qty: parseInt(btn.dataset.qty || '1', 10),
    };
    const cart = readCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) existing.qty += item.qty;
    else cart.push(item);
    writeCart(cart);
    updateCountBadge();
    // Visual feedback
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
    // Auto-open drawer on detail page only
    if (btn.dataset.openDrawer === 'true') openDrawer(true);
  });

  /* ---------- PDP quantity stepper ---------- */
  document.querySelectorAll('[data-stepper]').forEach(stepper => {
    const val = stepper.querySelector('[data-stepper-val]');
    const addBtn = document.querySelector('[data-add-cart][data-stepper-link="' + stepper.dataset.stepper + '"]');
    stepper.addEventListener('click', (e) => {
      const dir = e.target.dataset.step;
      if (!dir) return;
      let n = parseInt(val.textContent, 10) + parseInt(dir, 10);
      n = Math.max(1, Math.min(99, n));
      val.textContent = n;
      if (addBtn) addBtn.dataset.qty = String(n);
    });
  });

  /* ---------- Product catalog filtering ---------- */
  const chips = document.querySelectorAll('[data-filter]');
  if (chips.length) {
    chips.forEach(chip => chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach(c => c.classList.toggle('is-active', c === chip));
      document.querySelectorAll('[data-cat]').forEach(card => {
        const show = (f === 'all') || card.dataset.cat === f;
        card.style.display = show ? '' : 'none';
      });
      const visible = document.querySelectorAll('[data-cat]:not([style*="none"])').length;
      const countEl = document.querySelector('[data-results-count]');
      if (countEl) countEl.textContent = visible + ' product' + (visible === 1 ? '' : 's');
    }));
  }

  /* ---------- Newsletter form ---------- */
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      form.querySelector('input').value = '';
      setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 2500);
    });
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.querySelector('[data-contact]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.querySelector('[data-contact-status]');
      if (status) {
        status.textContent = 'Thanks — we received your message and will respond within one business day.';
        status.style.display = 'block';
      }
      contactForm.reset();
    });
  }

  /* ---------- PDP gallery thumb swap ---------- */
  document.querySelectorAll('[data-thumb]').forEach(t => {
    t.addEventListener('click', () => {
      const hero = document.querySelector('[data-pdp-hero]');
      const svg = t.querySelector('svg');
      if (hero && svg) hero.innerHTML = svg.outerHTML;
    });
  });

  /* ---------- Helpers ---------- */
  function productIcon(kind) {
    // Minimal SVG placeholders used inside cart thumbs
    const icons = {
      box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>',
      speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="15" r="3"/><circle cx="12" cy="7" r="1"/></svg>',
      buds: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><ellipse cx="7" cy="13" rx="3" ry="4"/><ellipse cx="17" cy="13" rx="3" ry="4"/><path d="M7 9c0-3 2-5 5-5s5 2 5 5"/></svg>',
      headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 14c0-5 4-9 8-9s8 4 8 9"/><rect x="3" y="14" width="4" height="6" rx="2"/><rect x="17" y="14" width="4" height="6" rx="2"/></svg>',
      watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6V3h6v3M9 18v3h6v-3"/></svg>',
      bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M13 2L4 14h7l-2 8 10-12h-7l1-8z"/></svg>',
      battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="16" height="10" rx="2"/><path d="M20 10v4h2v-4z" fill="currentColor"/><path d="M6 10h4v4H6z" fill="currentColor"/></svg>',
      stand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="8" y="3" width="8" height="14" rx="2"/><path d="M4 21l8-3 8 3M12 17v4"/></svg>',
      cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3z"/></svg>',
      lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>',
    };
    return icons[kind] || icons.box;
  }

  updateCountBadge();
})();
