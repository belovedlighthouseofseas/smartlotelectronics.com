/* Smart Lot Electronics — shared product database + card renderer */
(function () {
  'use strict';

  // ---------- SVG icon library ----------
  const ICONS = {
    earbuds: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M65 100c0-20 8-40 25-40s25 20 25 40v25a15 15 0 0 1-15 15h-10v-50h25M65 100v25a15 15 0 0 0 15 15h10v-50H65"/></svg>',
    speaker: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="50" y="60" width="100" height="80" rx="10"/><circle cx="100" cy="100" r="22"/><circle cx="100" cy="100" r="8" fill="currentColor"/><circle cx="68" cy="80" r="3" fill="currentColor"/><circle cx="132" cy="80" r="3" fill="currentColor"/></svg>',
    headphones: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M60 100v25a10 10 0 0 0 10 10h10v-50H60M140 100v25a10 10 0 0 1-10 10h-10v-50h20"/><path d="M60 100c0-25 18-50 40-50s40 25 40 50"/></svg>',
    soundbar: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="20" y="80" width="160" height="40" rx="6"/><circle cx="50" cy="100" r="6"/><circle cx="100" cy="100" r="10"/><circle cx="150" cy="100" r="6"/></svg>',
    cube: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="60" y="60" width="80" height="80" rx="8"/><circle cx="100" cy="100" r="20"/></svg>',
    receiver: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="50" y="70" width="100" height="60" rx="8"/><path d="M75 90h50M75 110h50"/></svg>',
    watch: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="70" y="40" width="60" height="120" rx="14"/><circle cx="100" cy="100" r="22"/><path d="M100 88v12l8 6"/><path d="M100 40v-8M100 168v-8"/></svg>',
    ring: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="100" r="50"/><circle cx="100" cy="100" r="32"/></svg>',
    tracker: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="78" y="50" width="44" height="100" rx="10"/><circle cx="100" cy="100" r="14"/></svg>',
    scale: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="60" width="120" height="100" rx="8"/><rect x="80" y="80" width="40" height="20" rx="3"/></svg>',
    plug: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="60" y="40" width="80" height="120" rx="10"/><path d="M80 80v20M120 80v20"/><circle cx="100" cy="130" r="6"/></svg>',
    sensor: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="100" r="55"/><circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="8" fill="currentColor"/></svg>',
    cable: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M40 100c20 0 20-15 40-15s20 15 40 15 20-15 40-15"/><rect x="30" y="92" width="20" height="16" rx="3"/><rect x="150" y="92" width="20" height="16" rx="3"/></svg>',
    powerbank: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="60" width="120" height="80" rx="10"/><path d="M55 80h.01M65 80h.01M75 80h.01"/><rect x="100" y="75" width="50" height="50" rx="4"/><path d="M115 95l8 8 12-15"/></svg>',
    wallcharger: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="60" y="40" width="80" height="120" rx="12"/><path d="M100 70l-10 25h20l-10 25"/></svg>',
    wirelesspad: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="100" r="50"/><circle cx="100" cy="100" r="30"/><path d="M100 70v-10M100 140v-10M70 100h-10M140 100h-10"/></svg>',
    adapter: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="80" width="40" height="40" rx="4"/><rect x="120" y="80" width="40" height="40" rx="4"/><path d="M80 100h40"/></svg>',
    carcharger: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M60 70v60a10 10 0 0 0 10 10h60a10 10 0 0 0 10-10V70"/><path d="M55 70h90l-6-12H61z"/><path d="M85 95l30 30M115 95l-30 30"/></svg>',
    mount: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="100" r="36"/><circle cx="100" cy="100" r="14" fill="currentColor"/><path d="M100 64v-20M100 156v-20M64 100h-20M156 100h-20"/></svg>',
    fm: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="60" y="50" width="80" height="110" rx="8"/><circle cx="100" cy="100" r="18"/><path d="M85 130h30"/></svg>',
    dashcam: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="70" width="100" height="60" rx="10"/><path d="M140 90l30-12v44l-30-12z"/><circle cx="80" cy="100" r="14"/></svg>',
    tire: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="100" r="55"/><circle cx="100" cy="100" r="20"/><path d="M100 45v15M100 140v15M45 100h15M140 100h15"/></svg>',
    cup: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M70 70h60v70a10 10 0 0 1-10 10H80a10 10 0 0 1-10-10z"/><path d="M60 70h80M85 60h30"/></svg>',
    stand: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="70" y="40" width="60" height="90" rx="6"/><path d="M50 145h100M100 130v25M70 70h60"/></svg>',
    hub: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="70" width="120" height="60" rx="6"/><rect x="55" y="85" width="20" height="30" rx="2"/><rect x="85" y="85" width="20" height="30" rx="2"/><rect x="115" y="85" width="20" height="30" rx="2"/></svg>',
    webcam: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><circle cx="100" cy="80" r="30"/><circle cx="100" cy="80" r="14"/><path d="M80 110h40v20H80zM90 130h20l-5 25h-10z"/></svg>',
    ledstrip: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><path d="M40 60h120v15H40zM40 95h120v15H40zM40 130h120v15H40z"/><circle cx="60" cy="67" r="3" fill="currentColor"/><circle cx="60" cy="102" r="3" fill="currentColor"/><circle cx="60" cy="137" r="3" fill="currentColor"/></svg>',
    doorbell: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="65" y="40" width="70" height="120" rx="8"/><circle cx="100" cy="80" r="14"/><circle cx="100" cy="130" r="10"/></svg>',
    travel: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="40" y="60" width="120" height="100" rx="14"/><rect x="65" y="85" width="20" height="30" rx="2"/><rect x="115" y="85" width="20" height="30" rx="2"/></svg>',
    bundle2: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="30" y="60" width="60" height="80" rx="6"/><rect x="110" y="60" width="60" height="80" rx="6"/></svg>',
    bundle3: '<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="2"><rect x="15" y="60" width="45" height="80" rx="6"/><rect x="77" y="60" width="45" height="80" rx="6"/><rect x="140" y="60" width="45" height="80" rx="6"/></svg>',
  };

  // ---------- Products ----------
  const PRODUCTS = [
    // AUDIO
    { id: 'earbuds-pro', name: 'Wireless Earbuds Pro', cat: 'audio', sub: 'Audio · Earbuds', price: 19.99, compare: 34.99, rating: 4.8, reviews: 1200, icon: 'earbuds', variant: 'glow', badges: ['bonus','bundle'], tag: 'Staff Pick', tagColor: 'blue', bullets: ['Active noise canceling', '30-hour total battery with case', 'IPX5 sweat-proof', 'USB-C fast charge'] },
    { id: 'boom-speaker', name: 'Bluetooth Speaker BOOM', cat: 'audio', sub: 'Audio · Speaker', price: 29.99, compare: 49.99, rating: 4.6, reviews: 842, icon: 'speaker', badges: ['bonus'], tag: 'New Drop', tagColor: 'blue', bullets: ['360° sound', '16-hour playtime', 'IPX7 waterproof', 'Pair two for stereo'] },
    { id: 'headphones-pro', name: 'Wireless Headphones Pro', cat: 'audio', sub: 'Audio · Headphones', price: 39.99, compare: 79.99, rating: 4.9, reviews: 2700, icon: 'headphones', variant: 'glow', badges: ['bonus','bundle'], tag: '−50%', bullets: ['40mm dynamic drivers', '50-hour battery', 'Memory foam ear cups', 'Bluetooth 5.3 multipoint'] },
    { id: 'soundbar-mini', name: 'Soundbar Mini', cat: 'audio', sub: 'Audio · Soundbar', price: 49.99, compare: 79.99, rating: 4.5, reviews: 312, icon: 'soundbar', badges: ['bonus'], tag: '−38%', bullets: ['2.0 stereo', 'Optical + AUX + Bluetooth', 'Wall mount included', 'Remote included'] },
    { id: 'cube-speaker', name: 'Mini Speaker Cube', cat: 'audio', sub: 'Audio · Speaker', price: 16.99, compare: 26.99, rating: 4.4, reviews: 528, icon: 'cube', badges: ['bonus'], bullets: ['Pocket-sized', '8-hour battery', 'Bluetooth 5.0', 'Built-in mic for calls'] },
    { id: 'bt-receiver', name: 'Bluetooth Receiver', cat: 'audio', sub: 'Audio · Adapter', price: 11.99, compare: 19.99, rating: 4.6, reviews: 1820, icon: 'receiver', badges: ['bonus'], bullets: ['Make any 3.5mm port wireless', '10-hour battery', 'Hands-free calls', 'aptX low latency'] },

    // SMART DEVICES
    { id: 'watch-fitx', name: 'Smartwatch Fit X', cat: 'smart', sub: 'Smart · Watch', price: 34.99, compare: 54.99, rating: 4.9, reviews: 3100, icon: 'watch', variant: 'limited', stockLeft: 7, stockTotal: 40, badges: ['bonus','low'], tag: 'Low Stock', tagColor: 'red', bullets: ['Heart rate + SpO2', '7-day battery', 'iOS + Android', 'IP68 swim-proof'] },
    { id: 'smart-ring', name: 'Smart Ring', cat: 'smart', sub: 'Smart · Wearable', price: 89.99, compare: 129.99, rating: 4.5, reviews: 420, icon: 'ring', badges: ['bonus'], tag: 'New', tagColor: 'blue', bullets: ['Sleep tracking', 'No subscription', '5-day battery', 'Titanium body'] },
    { id: 'fit-tracker', name: 'Fitness Tracker Slim', cat: 'smart', sub: 'Smart · Tracker', price: 24.99, compare: 39.99, rating: 4.4, reviews: 890, icon: 'tracker', badges: ['bonus'], bullets: ['Step + calorie counter', '10-day battery', 'Sleep stages', 'Water resistant'] },
    { id: 'smart-scale', name: 'Smart Scale', cat: 'smart', sub: 'Smart · Health', price: 29.99, compare: 49.99, rating: 4.3, reviews: 612, icon: 'scale', badges: ['bonus'], bullets: ['13 body metrics', 'Up to 8 users', 'iOS + Android app', 'Works without phone'] },
    { id: 'smart-plug', name: 'Smart Plug 4-Pack', cat: 'smart', sub: 'Smart · Home', price: 19.99, compare: 34.99, rating: 4.7, reviews: 2400, icon: 'plug', badges: ['bonus','bundle'], tag: 'Hot', tagColor: 'red', bullets: ['Alexa + Google', 'No hub required', 'Schedule + timer', 'Energy monitoring'] },
    { id: 'bedroom-sensor', name: 'Motion + Temp Sensor', cat: 'smart', sub: 'Smart · Sensor', price: 14.99, compare: 24.99, rating: 4.5, reviews: 318, icon: 'sensor', badges: ['bonus'], bullets: ['Battery-powered', 'Pairs with smart plugs', 'Magnetic mount', '2-year battery life'] },

    // CHARGING
    { id: 'fast-cable', name: 'Fast Charging Cable 6ft', cat: 'charging', sub: 'Charging · USB-C', price: 9.99, compare: 19.99, rating: 4.7, reviews: 5200, icon: 'cable', badges: ['bonus'], tag: '−50%', bullets: ['100W PD', 'Braided nylon', '10,000 bend rated', 'USB-C to USB-C'] },
    { id: 'powerbank-20k', name: 'Mega Power Bank 20K', cat: 'charging', sub: 'Charging · 20,000mAh', price: 24.99, compare: 44.99, rating: 4.8, reviews: 1830, icon: 'powerbank', badges: ['bonus','bundle'], tag: '−44%', bullets: ['Charges phones 5×', 'PD + QC fast charge', 'Digital % display', 'USB-A + USB-C in/out'] },
    { id: 'wall-100w', name: '100W GaN Wall Charger', cat: 'charging', sub: 'Charging · 100W', price: 34.99, compare: 59.99, rating: 4.9, reviews: 740, icon: 'wallcharger', badges: ['bonus'], bullets: ['Charges laptops + phones', '4 ports', 'GaN tech — runs cool', 'Foldable plug'] },
    { id: 'wireless-pad', name: 'Wireless Charge Pad', cat: 'charging', sub: 'Charging · Wireless', price: 16.99, compare: 29.99, rating: 4.4, reviews: 920, icon: 'wirelesspad', badges: ['bonus'], bullets: ['Qi 15W', 'Works through cases', 'LED indicator', 'Non-slip surface'] },
    { id: 'usbc-adapter', name: 'USB-C to USB-A Adapter', cat: 'charging', sub: 'Charging · Adapter', price: 7.99, compare: 12.99, rating: 4.6, reviews: 1100, icon: 'adapter', badges: ['bonus'], bullets: ['Aluminum body', 'USB 3.0 speeds', 'Plug-and-play', 'Pack of 2'] },
    { id: 'powerbank-mini', name: 'Mini Power Bank 10K', cat: 'charging', sub: 'Charging · 10,000mAh', price: 14.99, compare: 24.99, rating: 4.5, reviews: 660, icon: 'powerbank', badges: ['bonus'], bullets: ['Pocket-sized', '2-3 full phone charges', 'USB-C in + out', 'LED battery display'] },

    // CAR TECH
    { id: 'car-charger', name: 'Dual USB Car Charger', cat: 'car', sub: 'Car · Charger', price: 12.99, compare: 22.99, rating: 4.5, reviews: 612, icon: 'carcharger', badges: ['bonus'], tag: 'Hot', tagColor: 'red', bullets: ['PD 30W + QC 18W', 'Works for laptops too', 'LED status', 'Aluminum housing'] },
    { id: 'mag-mount', name: 'Magnetic Vent Mount', cat: 'car', sub: 'Car · Mount', price: 9.99, compare: 15.99, rating: 4.6, reviews: 880, icon: 'mount', badges: ['bonus'], bullets: ['MagSafe compatible', 'Strong neodymium', 'No phone bumper needed', 'Vent + dash fit'] },
    { id: 'fm-trans', name: 'FM Transmitter Bluetooth', cat: 'car', sub: 'Car · Audio', price: 17.99, compare: 29.99, rating: 4.3, reviews: 412, icon: 'fm', badges: ['bonus'], bullets: ['Crystal-clear audio', 'Hands-free calls', 'USB charging port', 'Color display'] },
    { id: 'dashcam', name: '1080p Dash Cam', cat: 'car', sub: 'Car · Camera', price: 39.99, compare: 69.99, rating: 4.7, reviews: 240, icon: 'dashcam', badges: ['bonus'], tag: '−43%', bullets: ['Loop recording', 'G-sensor crash lock', 'Night vision', '170° wide angle'] },
    { id: 'tire-monitor', name: 'Tire Pressure Monitor', cat: 'car', sub: 'Car · Safety', price: 49.99, compare: 79.99, rating: 4.5, reviews: 320, icon: 'tire', badges: ['bonus'], bullets: ['4 sensors + display', 'Real-time alerts', 'Solar + USB powered', 'Easy 5-min install'] },
    { id: 'cup-holder', name: 'Vent Cup Holder', cat: 'car', sub: 'Car · Accessory', price: 14.99, compare: 22.99, rating: 4.2, reviews: 188, icon: 'cup', badges: ['bonus'], bullets: ['Fits any vent', 'Holds 32oz', 'Phone slot included', 'Non-slip silicone'] },

    // EVERYDAY TECH
    { id: 'phone-stand', name: 'Adjustable Phone Stand', cat: 'everyday', sub: 'Everyday · Stand', price: 14.99, compare: 24.99, rating: 4.4, reviews: 388, icon: 'stand', badges: ['bonus'], bullets: ['Aluminum body', 'Foldable + portable', 'Fits phones + tablets', 'Cable routing slot'] },
    { id: 'usb-hub', name: 'USB Hub 4-Port', cat: 'everyday', sub: 'Everyday · Hub', price: 18.99, compare: 29.99, rating: 4.7, reviews: 1100, icon: 'hub', badges: ['bonus'], bullets: ['USB 3.0 speeds', 'Bus powered', '5Gbps transfer', 'Slim aluminum'] },
    { id: 'webcam-hd', name: '1080p HD Webcam', cat: 'everyday', sub: 'Everyday · Webcam', price: 24.99, compare: 44.99, rating: 4.6, reviews: 720, icon: 'webcam', badges: ['bonus'], tag: '−44%', bullets: ['Auto low-light correction', 'Dual mics with noise cancel', 'Privacy cover', 'Tripod mount'] },
    { id: 'led-strip', name: 'Smart LED Strip 5m', cat: 'everyday', sub: 'Everyday · Lighting', price: 19.99, compare: 32.99, rating: 4.5, reviews: 980, icon: 'ledstrip', badges: ['bonus'], bullets: ['16M colors', 'Music sync', 'App + remote control', 'Adhesive backing'] },
    { id: 'doorbell', name: 'Smart Doorbell 2K', cat: 'everyday', sub: 'Everyday · Security', price: 49.99, compare: 89.99, rating: 4.6, reviews: 410, icon: 'doorbell', badges: ['bonus'], tag: '−44%', bullets: ['2K HD video', 'Wide 160° view', 'Two-way talk', 'No subscription required'] },
    { id: 'travel-adapter', name: 'Universal Travel Adapter', cat: 'everyday', sub: 'Everyday · Travel', price: 22.99, compare: 34.99, rating: 4.5, reviews: 530, icon: 'travel', badges: ['bonus'], bullets: ['Works in 150+ countries', '4 USB ports', 'Surge protection', 'Compact for carry-on'] },
  ];

  // ---------- Bundles ----------
  const BUNDLES = [
    { id: 'bundle-audio', name: 'Audio Starter Bundle', sub: 'Audio · 2-item bundle', items: ['earbuds-pro','phone-stand'], price: 34.99, compare: 44.98, save: 10, unlocks: 'Tier 2', icon2: ['earbuds','stand'], tag: 'Audio Starter' },
    { id: 'bundle-power', name: '20K Power Bank + Fast Cable', sub: 'Charging · 2-item bundle', items: ['powerbank-20k','fast-cable'], price: 29.99, compare: 34.98, save: 5, unlocks: 'Tier 2', icon2: ['powerbank','cable'], tag: 'Power Combo' },
    { id: 'bundle-vip', name: 'Watch + Headphones + Speaker', sub: 'Audio & Smart · 3-item bundle', items: ['watch-fitx','headphones-pro','boom-speaker'], price: 99.99, compare: 129.97, save: 30, unlocks: 'Tier 3 VIP', icon2: ['watch','headphones','speaker'], tag: 'VIP Trio', qty: 3 },
    { id: 'bundle-desk', name: 'Desk Setup: Webcam + Hub + Stand', sub: 'Everyday · 3-item bundle', items: ['webcam-hd','usb-hub','phone-stand'], price: 49.99, compare: 58.97, save: 9, unlocks: 'Tier 3 VIP', icon2: ['webcam','hub','stand'], tag: 'Desk Setup', qty: 3 },
    { id: 'bundle-car', name: 'Road Trip: Charger + Mount + FM', sub: 'Car · 3-item bundle', items: ['car-charger','mag-mount','fm-trans'], price: 34.99, compare: 40.97, save: 6, unlocks: 'Tier 3 VIP', icon2: ['carcharger','mount','fm'], tag: 'Road Trip', qty: 3 },
    { id: 'bundle-smart', name: 'Smart Home: Plug 4-Pack + Sensor', sub: 'Smart · 2-item bundle', items: ['smart-plug','bedroom-sensor'], price: 29.99, compare: 34.98, save: 5, unlocks: 'Tier 2', icon2: ['plug','sensor'], tag: 'Smart Starter' },
  ];

  // ---------- Renderers ----------
  function renderStars(p) {
    if (!p.rating) return '';
    const full = Math.floor(p.rating);
    const half = (p.rating - full) >= 0.5;
    const stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
    return `<div class="stars">${stars} <span class="count">${p.rating.toFixed(1)} (${p.reviews >= 1000 ? (p.reviews/1000).toFixed(1)+'k' : p.reviews})</span></div>`;
  }

  function renderLabels(p) {
    if (!p.badges || !p.badges.length) return '';
    const labels = {
      bonus: '<span class="lbl-chip bonus">Bonus Eligible</span>',
      bundle: '<span class="lbl-chip bundle-eligible">Bundle &amp; Save</span>',
      low: '<span class="lbl-chip low">Selling fast</span>',
    };
    return `<div class="prod-labels">${p.badges.map(b => labels[b] || '').join('')}</div>`;
  }

  function renderTag(p) {
    if (!p.tag) return '';
    const cls = p.tagColor === 'blue' ? 'blue' : p.tagColor === 'red' ? 'red' : '';
    return `<span class="prod-tag ${cls}">${p.tag}</span>`;
  }

  function renderStock(p) {
    if (p.stockLeft == null) return '';
    const pct = Math.min(100, (p.stockLeft / (p.stockTotal || 50)) * 100);
    const discount = p.compare ? Math.round((1 - p.price/p.compare) * 100) + '%' : '';
    return `<div class="stock-bar"><div style="width:${pct}%"></div></div>
      <div class="stock-text"><span>Only ${p.stockLeft} left</span><span>−${discount}</span></div>`;
  }

  function renderProductCard(p) {
    const variant = p.variant || 'standard';
    const variantClass = variant === 'standard' ? '' : `v-${variant}`;
    return `
      <article class="prod ${variantClass}">
        <div class="prod-media">
          ${renderTag(p)}
          ${ICONS[p.icon] || ICONS.cube}
        </div>
        <div class="prod-body">
          <span class="prod-cat">${p.sub}</span>
          <div class="prod-name"><a href="product.html?id=${p.id}" style="color:inherit">${p.name}</a></div>
          ${renderStars(p)}
          ${renderLabels(p)}
          ${variant === 'limited' ? renderStock(p) : ''}
          <div class="prod-foot">
            <div class="prod-price">
              <span class="now">$${p.price.toFixed(2).replace(/\.00$/, '')}</span>
              ${p.compare ? `<span class="was">$${p.compare.toFixed(2).replace(/\.00$/, '')}</span>` : ''}
            </div>
            <button class="prod-add" data-add-cart data-id="${p.id}" data-title="${p.name.replace(/"/g, '&quot;')}" data-cat="${p.sub}" data-price="${p.price}" data-icon="${p.icon}" aria-label="Add ${p.name} to cart">
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
            <button class="prod-add" data-add-cart data-id="${b.id}" data-title="${b.name.replace(/"/g, '&quot;')}" data-cat="Bundle" data-price="${b.price}" data-qty="${b.qty || 2}" data-icon="cube" aria-label="Add ${b.name} bundle to cart">
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
    PRODUCTS, BUNDLES, ICONS,
    findProduct: (id) => PRODUCTS.find(p => p.id === id) || BUNDLES.find(b => b.id === id),
    renderCategory: (cat, selector) => renderGrid(PRODUCTS.filter(p => p.cat === cat), selector),
    renderAll: (selector) => renderGrid(PRODUCTS, selector),
    renderBundles: (selector) => renderGrid(BUNDLES, selector),
    renderCard: renderProductCard,
    renderBundleCard,
    renderStars, renderLabels,
  };
})();
