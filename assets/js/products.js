/* Smart Lot Electronics — product database (mirrors Shopify) + card renderer */
(function () {
  'use strict';

  // ---------- Shopify config ----------
  const SHOP = {
    domain: 'smartlotelectronics.myshopify.com',
    productUrl: (handle) => `https://smartlotelectronics.myshopify.com/products/${handle}`,
    // Build a Shopify checkout URL from a list of {variantId, qty}.
    // Format: https://shop.myshopify.com/cart/VARIANT_ID:QTY,VARIANT_ID:QTY
    cartUrl: (items) => {
      if (!items.length) return `https://smartlotelectronics.myshopify.com/`;
      const segs = items.map(i => `${i.variantId}:${i.qty}`).join(',');
      return `https://smartlotelectronics.myshopify.com/cart/${segs}`;
    },
  };

  // ---------- Fallback SVG icons (when product has no image) ----------
  const ICONS = {
    earbuds:    '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M65 100c0-20 8-40 25-40s25 20 25 40v25a15 15 0 0 1-15 15h-10v-50h25M65 100v25a15 15 0 0 0 15 15h10v-50H65"/></svg>',
    speaker:    '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="50" y="60" width="100" height="80" rx="10"/><circle cx="100" cy="100" r="22"/><circle cx="100" cy="100" r="8" fill="currentColor"/></svg>',
    tracker:    '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="60" y="60" width="80" height="50" rx="6"/><circle cx="100" cy="85" r="8"/></svg>',
    ledstrip:   '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M40 60h120v15H40zM40 95h120v15H40zM40 130h120v15H40z"/><circle cx="60" cy="67" r="3" fill="currentColor"/><circle cx="60" cy="102" r="3" fill="currentColor"/></svg>',
    plug:       '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="60" y="40" width="80" height="120" rx="10"/><path d="M80 80v20M120 80v20"/></svg>',
    watch:      '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="70" y="40" width="60" height="120" rx="14"/><circle cx="100" cy="100" r="22"/></svg>',
    powerbank:  '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="60" width="120" height="80" rx="10"/><rect x="100" y="75" width="50" height="50" rx="4"/></svg>',
    station:    '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="60" cy="100" r="22"/><circle cx="100" cy="100" r="22"/><circle cx="140" cy="100" r="22"/></svg>',
    cable:      '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M40 100c20 0 20-15 40-15s20 15 40 15 20-15 40-15"/><rect x="30" y="92" width="20" height="16" rx="3"/><rect x="150" y="92" width="20" height="16" rx="3"/></svg>',
    carmount:   '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="100" r="36"/><circle cx="100" cy="100" r="14" fill="currentColor"/></svg>',
    wallet:     '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="60" width="120" height="80" rx="10"/><path d="M40 90h120"/></svg>',
    multitool:  '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 50l100 100M50 150l100-100"/></svg>',
    grip:       '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="70" y="40" width="60" height="120" rx="8"/><circle cx="100" cy="140" r="14"/></svg>',
    card:       '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="30" y="60" width="140" height="80" rx="6"/><path d="M30 85h140"/></svg>',
    cablemag:   '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="60" width="30" height="80" rx="3"/><rect x="85" y="60" width="30" height="80" rx="3"/><rect x="130" y="60" width="30" height="80" rx="3"/></svg>',
    flashlight: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="70" y="50" width="60" height="100" rx="6"/><path d="M85 50V30h30v20"/></svg>',
    stand:      '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M40 60h120l-20 60H60z"/><rect x="80" y="120" width="40" height="20"/></svg>',
    lens:       '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="100" r="45"/><circle cx="100" cy="100" r="25"/><circle cx="100" cy="100" r="10" fill="currentColor"/></svg>',
    cube:       '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="60" y="60" width="80" height="80" rx="8"/></svg>',
  };

  // ---------- Products (synced with smartlotelectronics.myshopify.com) ----------
  const PRODUCTS = [
    // AUDIO ============================================
    {
      id: 'pro-wireless-earbuds', handle: 'pro-wireless-earbuds-with-charging-case',
      name: 'Pro Wireless Earbuds', cat: 'audio', sub: 'Audio · Earbuds',
      price: 39.99, rating: 4.8, reviews: 1240, variant: 'glow',
      badges: ['bonus', 'bundle'], tag: 'Staff Pick', tagColor: 'blue',
      icon: 'earbuds', variantId: '49053864689907',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1606220945770-b5b6c2c55bf1.jpg?v=1778789651',
      tagline: 'Studio sound. Pocket size. All-day battery.',
      bullets: ['Tuned for music, podcasts, and crystal-clear calls', 'Compact charging case fits the smallest pocket', 'Bluetooth 5.3 multipoint', 'IPX5 sweat-proof'],
    },
    {
      id: 'waterproof-bluetooth-speaker', handle: 'waterproof-bluetooth-mini-speaker',
      name: 'Waterproof Bluetooth Mini Speaker', cat: 'audio', sub: 'Audio · Speaker',
      price: 34.99, rating: 4.7, reviews: 880,
      badges: ['bonus'], tag: 'New Drop', tagColor: 'blue',
      icon: 'speaker', variantId: '49053868294387',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1608043152269-423dbba4e7e1.jpg?v=1778789749',
      tagline: 'Pocket-size. Truck-size sound.',
      bullets: ['5W driver punches above its weight', '14-hour battery on a single charge', 'Clips onto any bag or belt', 'IPX7 — survives the beach'],
    },

    // SMART DEVICES ====================================
    {
      id: 'smartfind-tracker', handle: 'smartfind-bluetooth-tracker-card',
      name: 'SmartFind Bluetooth Tracker Card', cat: 'smart', sub: 'Smart · Tracker',
      price: 29.99, rating: 4.6, reviews: 720,
      badges: ['bonus'], tag: 'New', tagColor: 'blue',
      icon: 'tracker', variantId: '49053862658291',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1611532736597-de2d4265fba3.jpg?v=1778789601',
      tagline: 'Never lose your wallet again.',
      bullets: ['Credit-card thin — slips into any wallet', 'Works with Apple Find My out of the box', '1-year replaceable battery', 'Bluetooth 5.0'],
    },
    {
      id: 'smart-led-strip', handle: 'smart-rgb-led-strip-lights-16ft',
      name: 'Smart RGB LED Strip Lights (16ft)', cat: 'smart', sub: 'Smart · Lighting',
      price: 32.99, rating: 4.5, reviews: 1080,
      badges: ['bonus'],
      icon: 'ledstrip', variantId: '49053866459379',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/hf_20260518_182759_757dfc06-8b00-4161-905e-58db4a438289.png?v=1779129068',
      tagline: 'Upgrade any room in 10 minutes.',
      bullets: ['App-controlled, music-synced', '16 million colors + scene modes', 'No control hub needed', '32ft option available'],
    },
    {
      id: 'smart-wifi-plug', handle: 'smart-wifi-plug-4-pack',
      name: 'Smart WiFi Plug (4-Pack)', cat: 'smart', sub: 'Smart · Home',
      price: 24.99, rating: 4.7, reviews: 2410,
      badges: ['bonus', 'bundle'], tag: 'Hot', tagColor: 'red',
      icon: 'plug', variantId: '49053867606259',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1558002038-1055907df827.jpg?v=1778789739',
      tagline: 'Make any outlet smart — four at once.',
      bullets: ['Voice control with Alexa + Google', 'Schedule + timer + energy monitoring', 'No hub required', 'Compact — won\'t block adjacent plugs'],
    },
    {
      id: 'leather-watch-band', handle: 'premium-leather-apple-watch-band',
      name: 'Premium Leather Apple Watch Band', cat: 'smart', sub: 'Smart · Watch Band',
      price: 27.99, rating: 4.6, reviews: 460,
      badges: ['bonus'],
      icon: 'watch', variantId: '49053865804019',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1579586337278-3befd40fd17a.jpg?v=1778789668',
      tagline: 'Dress up the watch you wear every day.',
      bullets: ['Full-grain leather that softens with wear', 'Fits 38–49mm cases', 'Stainless steel buckle', 'Saddle Brown + Onyx Black'],
    },

    // CHARGING ========================================
    {
      id: 'magsnap-powerbank', handle: 'magsnap-10-000mah-magnetic-power-bank',
      name: 'MagSnap 10,000mAh Power Bank', cat: 'charging', sub: 'Charging · Power Bank',
      price: 54.99, rating: 4.8, reviews: 1530, variant: 'glow',
      badges: ['bonus', 'bundle'], tag: 'Editor\'s Pick', tagColor: 'blue',
      icon: 'powerbank', variantId: '49053862723827',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1609091839311-d5365f9ff1c5.jpg?v=1778789606',
      tagline: 'Snap on. Power up. Walk out.',
      bullets: ['Wireless MagSafe-compatible attachment', 'Charges iPhone 12+ without cables', 'USB-C PD for laptops too', '10,000mAh — 2.5 full phone charges'],
    },
    {
      id: '3in1-charging-station', handle: '3-in-1-foldable-wireless-charging-station',
      name: '3-in-1 Foldable Wireless Charging Station', cat: 'charging', sub: 'Charging · Station',
      price: 49.99, rating: 4.6, reviews: 640,
      badges: ['bonus'],
      icon: 'station', variantId: '49053862854899',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/hf_20260518_182724_635a57d2-7bb1-4247-ae51-225d37d57224.png?v=1779129025',
      tagline: 'One pad. Three devices. Zero cables.',
      bullets: ['iPhone + AirPods + Apple Watch at once', 'Folds flat for travel', 'Qi-certified', 'MagSafe-compatible iPhone alignment'],
    },
    {
      id: 'usbc-cable-6ft', handle: 'braided-usb-c-fast-charging-cable',
      name: 'Braided USB-C Fast Charging Cable', cat: 'charging', sub: 'Charging · USB-C',
      price: 12.99, rating: 4.7, reviews: 5240,
      badges: ['bonus'], tag: 'Best Seller', tagColor: 'blue',
      icon: 'cable', variantId: '49053864263923',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1583394838336-acd977736f90.jpg?v=1778789642',
      tagline: 'The cable that outlives your phone.',
      bullets: ['Nylon-braided shell, 10,000 bend rated', '100W power delivery (laptop-capable)', 'Reinforced connectors', '3/6/10 ft + black/graphite options'],
    },

    // CAR TECH ========================================
    {
      id: 'wireless-car-mount', handle: 'wireless-magnetic-car-phone-mount-charger',
      name: 'Wireless Magnetic Car Mount + Charger', cat: 'car', sub: 'Car · Mount',
      price: 36.99, rating: 4.6, reviews: 612,
      badges: ['bonus'], tag: 'Hot', tagColor: 'red',
      icon: 'carmount', variantId: '49053868458227',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1606293459339-aa5d34a7b0e1.jpg?v=1778789756',
      tagline: 'Drop in. Drive off. Fully charged.',
      bullets: ['Strong neodymium hold', 'Wireless fast-charging through any MagSafe case', 'Vent + dashboard kit included', 'No phone bumper needed'],
    },

    // EVERYDAY TECH ===================================
    {
      id: 'rfid-wallet', handle: 'slim-magnetic-rfid-wallet',
      name: 'Slim Magnetic RFID Wallet', cat: 'everyday', sub: 'Everyday · Wallet',
      price: 34.99, rating: 4.7, reviews: 980,
      badges: ['bonus'],
      icon: 'wallet', variantId: '49053862396147',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1627123424574-724758594e93.jpg?v=1778789590',
      tagline: 'Carry less. Show up better.',
      bullets: ['Magnetic split design — instant card access', '8-card capacity', 'RFID-blocking', 'Black / Brown / Navy'],
    },
    {
      id: 'edc-multitool-keychain', handle: 'titanium-edc-keychain-multi-tool',
      name: 'Titanium EDC Keychain Multi-Tool', cat: 'everyday', sub: 'Everyday · EDC',
      price: 19.99, rating: 4.6, reviews: 420,
      badges: ['bonus'],
      icon: 'multitool', variantId: '49053862527219',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/hf_20260518_182706_8a66d31d-7f06-4947-8454-216eedd7e6f8.png?v=1779128994',
      tagline: 'Eight tools. One keychain.',
      bullets: ['Pocket-sized titanium build', 'Doesn\'t rattle on your keys', 'Bottle opener, screwdriver, pry bar, more', 'TSA-friendly — no blade'],
    },
    {
      id: 'maggrip-stand', handle: 'maggrip-phone-stand-ring-holder',
      name: 'MagGrip Phone Stand &amp; Ring Holder', cat: 'everyday', sub: 'Everyday · Grip',
      price: 24.99, rating: 4.5, reviews: 715,
      badges: ['bonus', 'bundle'],
      icon: 'grip', variantId: '49053863575795',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1601784551446-20c9e07cdbdb.jpg?v=1778789630',
      tagline: 'One accessory. Three jobs.',
      bullets: ['Magnetic grip, kickstand, and ring holder', 'Ultra-thin — fits in any pocket', 'Snaps to any MagSafe phone', 'Black / Silver / Rose Gold'],
    },
    {
      id: 'multitool-wallet-card', handle: 'edc-multi-tool-wallet-card',
      name: 'EDC Multi-Tool Wallet Card', cat: 'everyday', sub: 'Everyday · EDC',
      price: 22.99, rating: 4.5, reviews: 388,
      badges: ['bonus'],
      icon: 'card', variantId: '49053865378035',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/hf_20260518_182742_17cb4b41-d05a-435f-8d1d-2fac4cedaff6.png?v=1779129046',
      tagline: '16 tools. Credit card size.',
      bullets: ['Stainless steel construction', 'Bottle opener, ruler, hex keys, more', 'Fits next to your debit card', 'TSA-friendly'],
    },
    {
      id: 'magnetic-cable-strips', handle: 'magnetic-cable-management-strips-6-pack',
      name: 'Magnetic Cable Management Strips (6-Pack)', cat: 'everyday', sub: 'Everyday · Desk',
      price: 12.99, rating: 4.6, reviews: 1102,
      badges: ['bonus'],
      icon: 'cablemag', variantId: '49053866328307',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1601445638532-3c6f6c3aa1d6.jpg?v=1778789687',
      tagline: 'The end of cable spaghetti.',
      bullets: ['Stick-on strong adhesive', 'Magnetic — easy to add/remove cables', '6 strips per pack', 'Works on desk, nightstand, wall'],
    },
    {
      id: 'mini-flashlight', handle: 'mini-tactical-pocket-flashlight-usb-c-rechargeable',
      name: 'Mini Tactical Pocket Flashlight', cat: 'everyday', sub: 'Everyday · EDC',
      price: 18.99, rating: 4.7, reviews: 1485,
      badges: ['bonus'], tag: '−40%',
      icon: 'flashlight', variantId: '49053866721523',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1568438350562-2cae6d394ad0.jpg?v=1778789704',
      tagline: '1,000 lumens. Fits on your keychain.',
      bullets: ['Lights up a parking lot', 'USB-C recharge in 90 minutes', 'Keychain-mountable', 'Aircraft-grade aluminum'],
    },
    {
      id: 'aluminum-laptop-stand', handle: 'aluminum-foldable-laptop-stand',
      name: 'Aluminum Foldable Laptop Stand', cat: 'everyday', sub: 'Everyday · Desk',
      price: 39.99, rating: 4.7, reviews: 920,
      badges: ['bonus', 'bundle'], variant: 'glow',
      icon: 'stand', variantId: '49053866852595',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1593642632559-0c6d3fc62b89.jpg?v=1778789713',
      tagline: 'Save your neck. Save your back. Carry it anywhere.',
      bullets: ['Lifts screen to eye level', 'Folds completely flat', 'Aluminum — runs cool, looks clean', 'Silver / Space Grey'],
    },
    {
      id: 'phone-lens-kit', handle: 'pro-phone-lens-kit-wide-macro-fisheye',
      name: 'Pro Phone Lens Kit (Wide + Macro + Fisheye)', cat: 'everyday', sub: 'Everyday · Photo',
      price: 26.99, rating: 4.4, reviews: 312,
      badges: ['bonus'],
      icon: 'lens', variantId: '49053867016435',
      image: 'https://cdn.shopify.com/s/files/1/0830/5334/7059/files/photo-1556656793-08538906a9f8.jpg?v=1778789722',
      tagline: 'DSLR shots from the phone in your pocket.',
      bullets: ['Wide-angle for landscapes', 'Macro for products + textures', 'Fisheye for content', 'Universal clip — fits any phone'],
    },
  ];

  // ---------- Bundles (real Shopify variants combined for cart) ----------
  const BUNDLES = [
    {
      id: 'bundle-tech-starter', name: 'Tech Starter Bundle',
      sub: 'Audio + Charging · 2-item bundle',
      cat: 'bundle', items: ['pro-wireless-earbuds', 'usbc-cable-6ft'],
      lineItems: [{ variantId: '49053864689907', qty: 1 }, { variantId: '49053864263923', qty: 1 }],
      price: 44.99, compare: 52.98, save: 8, unlocks: 'Tier 2', qty: 2,
      icon2: ['earbuds', 'cable'], tag: 'Tech Starter',
    },
    {
      id: 'bundle-magsafe-combo', name: 'MagSafe Power Combo',
      sub: 'Charging + Car + Grip · 3-item bundle',
      cat: 'bundle', items: ['magsnap-powerbank', 'wireless-car-mount', 'maggrip-stand'],
      lineItems: [{ variantId: '49053862723827', qty: 1 }, { variantId: '49053868458227', qty: 1 }, { variantId: '49053863575795', qty: 1 }],
      price: 99.99, compare: 116.97, save: 17, unlocks: 'Tier 3 VIP', qty: 3,
      icon2: ['powerbank', 'carmount', 'grip'], tag: 'MagSafe Trio',
    },
    {
      id: 'bundle-audio-pack', name: 'Audio Pack',
      sub: 'Audio · 2-item bundle',
      cat: 'bundle', items: ['pro-wireless-earbuds', 'waterproof-bluetooth-speaker'],
      lineItems: [{ variantId: '49053864689907', qty: 1 }, { variantId: '49053868294387', qty: 1 }],
      price: 64.99, compare: 74.98, save: 10, unlocks: 'Tier 2', qty: 2,
      icon2: ['earbuds', 'speaker'], tag: 'Audio Pack',
    },
    {
      id: 'bundle-edc-essentials', name: 'EDC Essentials',
      sub: 'Everyday · 3-item bundle',
      cat: 'bundle', items: ['rfid-wallet', 'edc-multitool-keychain', 'mini-flashlight'],
      lineItems: [{ variantId: '49053862396147', qty: 1 }, { variantId: '49053862527219', qty: 1 }, { variantId: '49053866721523', qty: 1 }],
      price: 59.99, compare: 73.97, save: 14, unlocks: 'Tier 3 VIP', qty: 3,
      icon2: ['wallet', 'multitool', 'flashlight'], tag: 'EDC Trio',
    },
    {
      id: 'bundle-smart-home', name: 'Smart Home Starter',
      sub: 'Smart · 3-item bundle',
      cat: 'bundle', items: ['smart-wifi-plug', 'smart-led-strip', 'smartfind-tracker'],
      lineItems: [{ variantId: '49053867606259', qty: 1 }, { variantId: '49053866459379', qty: 1 }, { variantId: '49053862658291', qty: 1 }],
      price: 74.99, compare: 87.97, save: 13, unlocks: 'Tier 3 VIP', qty: 3,
      icon2: ['plug', 'ledstrip', 'tracker'], tag: 'Smart Trio',
    },
  ];

  // ---------- Renderers ----------
  function renderStars(p) {
    if (!p.rating) return '';
    const full = Math.floor(p.rating);
    const half = (p.rating - full) >= 0.5;
    const stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
    const reviewLabel = p.reviews >= 1000 ? (p.reviews / 1000).toFixed(1) + 'k' : p.reviews;
    return `<div class="stars">${stars} <span class="count">${p.rating.toFixed(1)} (${reviewLabel})</span></div>`;
  }

  function renderLabels(p) {
    if (!p.badges || !p.badges.length) return '';
    const labels = {
      bonus:  '<span class="lbl-chip bonus">Bonus Eligible</span>',
      bundle: '<span class="lbl-chip bundle-eligible">Bundle &amp; Save</span>',
      low:    '<span class="lbl-chip low">Selling fast</span>',
    };
    return `<div class="prod-labels">${p.badges.map(b => labels[b] || '').join('')}</div>`;
  }

  function renderTag(p) {
    if (!p.tag) return '';
    const cls = p.tagColor === 'blue' ? 'blue' : p.tagColor === 'red' ? 'red' : '';
    return `<span class="prod-tag ${cls}">${p.tag}</span>`;
  }

  function renderMedia(p) {
    if (p.image) {
      return `<img src="${p.image}" alt="${(p.name || '').replace(/"/g, '&quot;')}" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">`;
    }
    return ICONS[p.icon] || ICONS.cube;
  }

  function renderProductCard(p) {
    const variant = p.variant || 'standard';
    const variantClass = variant === 'standard' ? '' : `v-${variant}`;
    return `
      <article class="prod ${variantClass}">
        <div class="prod-media">
          ${renderTag(p)}
          ${renderMedia(p)}
        </div>
        <div class="prod-body">
          <span class="prod-cat">${p.sub}</span>
          <div class="prod-name"><a href="product.html?id=${p.id}" style="color:inherit">${p.name}</a></div>
          ${renderStars(p)}
          ${renderLabels(p)}
          <div class="prod-foot">
            <div class="prod-price">
              <span class="now">$${p.price.toFixed(2).replace(/\.00$/, '')}</span>
              ${p.compare ? `<span class="was">$${p.compare.toFixed(2).replace(/\.00$/, '')}</span>` : ''}
            </div>
            <button class="prod-add" data-add-cart data-id="${p.id}" data-title="${p.name.replace(/"/g, '&quot;')}" data-cat="${p.sub}" data-price="${p.price}" data-icon="${p.icon}" data-variant-id="${p.variantId || ''}" data-image="${p.image || ''}" aria-label="Add ${p.name} to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderBundleCard(b) {
    const iconsHtml = b.icon2.map(k => ICONS[k] || ICONS.cube).reduce((acc, svg, i) =>
      acc + (i > 0 ? '<span class="bundle-plus">+</span>' : '') + svg, '');
    // Serialize line items into a JSON-encoded data attribute for the cart redirect
    const lineItemsAttr = encodeURIComponent(JSON.stringify(b.lineItems || []));
    return `
      <article class="prod v-bundle">
        <div class="prod-media">
          <span class="prod-tag">${b.tag}</span>
          <div class="bundle-stack">${iconsHtml}</div>
        </div>
        <div class="prod-body">
          <span class="prod-cat">${b.sub}</span>
          <div class="prod-name"><a href="product.html?id=${b.id}" style="color:inherit">${b.name}</a></div>
          <span class="bundle-save">Save $${b.save} · Unlocks ${b.unlocks}</span>
          <div class="prod-labels" style="margin-top:0.4rem">
            <span class="lbl-chip bundle-eligible">Counts as ${b.qty || 2} items</span>
            <span class="lbl-chip bonus">Premium bonus</span>
          </div>
          <div class="prod-foot">
            <div class="prod-price">
              <span class="now">$${b.price.toFixed(2).replace(/\.00$/, '')}</span>
              <span class="was">$${b.compare.toFixed(2).replace(/\.00$/, '')}</span>
            </div>
            <button class="prod-add" data-add-cart data-id="${b.id}" data-title="${b.name.replace(/"/g, '&quot;')}" data-cat="Bundle" data-price="${b.price}" data-qty="1" data-bundle-size="${b.qty || 2}" data-icon="cube" data-bundle-items="${lineItemsAttr}" aria-label="Add ${b.name} bundle to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderGrid(items, selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerHTML = items.map(p => p.items ? renderBundleCard(p) : renderProductCard(p)).join('');
  }

  // ---------- Public API ----------
  window.SLE = {
    SHOP, PRODUCTS, BUNDLES, ICONS,
    findProduct: (id) => PRODUCTS.find(p => p.id === id) || BUNDLES.find(b => b.id === id),
    renderCategory: (cat, selector) => renderGrid(PRODUCTS.filter(p => p.cat === cat), selector),
    renderAll: (selector) => renderGrid(PRODUCTS, selector),
    renderBundles: (selector) => renderGrid(BUNDLES, selector),
    renderCard: renderProductCard,
    renderBundleCard,
    renderStars, renderLabels,
  };
})();
