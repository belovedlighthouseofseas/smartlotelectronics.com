/* Smart Lot Electronics — shared layout injector */
(function () {
  'use strict';

  const NAV_LINKS = [
    { id: 'home',     href: 'index.html',    label: 'Home' },
    { id: 'shop',     href: 'shop.html',     label: 'Shop' },
    { id: 'bundles',  href: 'bundles.html',  label: 'Bundles' },
    { id: 'rewards',  href: 'rewards.html',  label: 'Rewards' },
    { id: 'about',    href: 'about.html',    label: 'About' },
  ];

  const POWER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v10"/><path d="M6.7 7.5a8 8 0 1 0 10.6 0"/></svg>';

  function navHtml(active) {
    const links = NAV_LINKS.map(l =>
      `<a href="${l.href}"${l.id === active ? ' class="is-active"' : ''}>${l.label}</a>`
    ).join('');
    return `
      <header class="nav" role="banner">
        <div class="nav-inner">
          <a class="brand" href="index.html" aria-label="Smart Lot Electronics home">
            <img src="assets/img/logo.png" alt="Smart Lot Electronics" class="brand-logo">
          </a>
          <nav class="nav-links" aria-label="Primary">${links}</nav>
          <div class="nav-tools">
            <button class="icon-btn" data-open-cart aria-label="Open cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.5 12h11l2-9H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>
              <span class="count" data-cart-count style="display:none">0</span>
            </button>
            <button class="icon-btn nav-burger" data-burger aria-label="Open menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
            </button>
          </div>
        </div>
      </header>
      <div class="mobile-panel" data-mobile-panel>
        <button class="icon-btn close" data-mobile-close aria-label="Close menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        ${NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
      </div>
    `;
  }

  function countdownHtml() {
    return `
      <div class="countdown" role="alert">
        <span class="bolt">⚡</span> <strong>Flash Drop</strong> · 20% off all Audio &amp; Charging · ends in <span class="time" data-countdown>—:—:—</span>
      </div>
    `;
  }

  function footerHtml() {
    return `
      <footer class="foot">
        <div class="wrap">
          <div class="foot-grid">
            <div class="foot-brand">
              <a class="brand" href="index.html">
                <img src="assets/img/logo.png" alt="Smart Lot Electronics" class="brand-logo foot-logo">
              </a>
              <p>Affordable everyday electronics, curated weekly, with a bonus reward built into every order.</p>
            </div>
            <div>
              <h4>Shop</h4>
              <ul>
                <li><a href="audio.html">Audio</a></li>
                <li><a href="smart-devices.html">Smart Devices</a></li>
                <li><a href="charging.html">Charging</a></li>
                <li><a href="car-tech.html">Car Tech</a></li>
                <li><a href="everyday-tech.html">Everyday Tech</a></li>
                <li><a href="new-arrivals.html">New Arrivals</a></li>
                <li><a href="bundles.html">Bundle Deals</a></li>
              </ul>
            </div>
            <div>
              <h4>Help</h4>
              <ul>
                <li><a href="rewards.html">Rewards Program</a></li>
                <li><a href="track.html">Track Order</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="shipping.html">Shipping</a></li>
                <li><a href="returns.html">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4>Brand</h4>
              <ul>
                <li><a href="about.html">About Smart Lot</a></li>
                <li><a href="rewards.html">Bonus System</a></li>
                <li><a href="privacy.html">Privacy</a></li>
                <li><a href="terms.html">Terms</a></li>
              </ul>
            </div>
          </div>
          <div class="foot-bottom">
            <span>© 2026 Smart Lot Electronics</span>
            <span class="tag">★ Smart Finds. Cool Tech. Real Value.</span>
            <span>@SMARTLOTELECTRONICS</span>
          </div>
        </div>
      </footer>
    `;
  }

  function drawerHtml() {
    return `
      <div class="scrim" data-scrim data-close-cart></div>
      <aside class="drawer" data-drawer aria-label="Shopping cart">
        <div class="drawer-head">
          <h3>Your cart</h3>
          <button class="icon-btn" data-close-cart aria-label="Close cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <div class="reward-prog" data-reward-prog></div>
        <div class="drawer-body" data-drawer-body></div>
        <div class="drawer-foot">
          <div class="total"><span>Subtotal</span><strong data-drawer-total>$0</strong></div>
          <small>Bonus item auto-added at checkout. Free shipping over $35.</small>
          <a href="#" class="btn btn-primary" data-checkout>Checkout on Shopify →</a>
          <button class="btn btn-dark" data-close-cart>Keep shopping</button>
        </div>
      </aside>
    `;
  }

  function inject() {
    const body = document.body;
    const active = body.getAttribute('data-page') || '';
    const hasCountdown = body.getAttribute('data-countdown') !== 'false';

    // Top: countdown + nav + mobile panel
    body.insertAdjacentHTML('afterbegin', (hasCountdown ? countdownHtml() : '') + navHtml(active));

    // Bottom: footer + drawer
    body.insertAdjacentHTML('beforeend', footerHtml() + drawerHtml());

    body.setAttribute('data-layout', 'ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
