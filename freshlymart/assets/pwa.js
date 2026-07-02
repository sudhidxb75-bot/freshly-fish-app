(function(){
  const PUBLIC_BOTTOM_NAV = `
  <nav class="mobile-bottom-nav" aria-label="Freshly Mart app navigation">
    <a href="index.html" data-nav="home"><span>🏠</span><small>Home</small></a>
    <a href="category.html?cat=all" data-nav="categories"><span>🛒</span><small>Shop</small></a>
    <a href="track-order.html" data-nav="track"><span>📦</span><small>Track</small></a>
    <a href="cart.html" data-nav="cart"><span>🧺</span><small>Cart</small><b class="bottom-cart-count" data-cart-count>0</b></a>
    <a href="customer-login.html" data-nav="account"><span>👤</span><small>Account</small></a>
  </nav>`;

  const TOP_ACTIONS = `
  <div class="fm-top-actions" aria-label="Freshly Mart quick actions">
    <a class="fm-top-action" href="sell-with-us.html">🏪 <span>Sell with us</span></a>
    <button class="fm-top-action" type="button" data-pwa-install>📲 <span>Install App</span></button>
  </div>`;

  const INSTALL_BANNER = `
  <div class="pwa-install-card" id="pwaInstallCard" hidden>
    <div><strong>Install <span class="fm-nowrap">Freshly Mart</span></strong><p>Add to home screen for an app-like shopping experience.</p></div>
    <button class="btn small" id="pwaInstallBtn" type="button">Install App</button>
    <button class="pwa-close" id="pwaInstallClose" type="button" aria-label="Close">×</button>
  </div>`;

  let deferredPrompt = null;
  const page = location.pathname.split('/').pop() || 'index.html';
  const adminPages = ['admin-login.html','admin-dashboard.html'];

  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function addTopActionStyles(){
    if(document.getElementById('fmTopActionsStyle')) return;
    const style = document.createElement('style');
    style.id = 'fmTopActionsStyle';
    style.textContent = `
      .fm-nowrap{white-space:nowrap;}
      @media (max-width: 760px){
        .brand,.brand-name,.logo-text,.site-title,.app-title,.navbar-brand,.header-title,.fm-brand,.fm-logo,.logo,header h1{white-space:nowrap !important;}
      }
      @media (max-width: 760px){
        .fm-top-actions{
          display:flex;
          gap:8px;
          align-items:center;
          justify-content:flex-start;
          padding:8px 14px;
          background:#fff;
          border-bottom:1px solid rgba(15,23,42,.08);
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
          position:relative;
          z-index:20;
        }
        .fm-top-actions .fm-top-action{
          flex:0 0 auto;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:5px;
          min-height:34px;
          padding:7px 12px;
          border-radius:999px;
          border:1px solid rgba(22,163,74,.22);
          background:#f0fdf4;
          color:#166534;
          font-size:12px;
          font-weight:800;
          line-height:1;
          text-decoration:none;
          white-space:nowrap;
          cursor:pointer;
        }
        .fm-top-actions .fm-top-action span{display:inline-block;}
      }
      @media (min-width: 761px){
        .fm-top-actions{display:none;}
      }
    `;
    document.head.appendChild(style);
  }

  function addTopActionButtons(){
    if (adminPages.includes(page)) return;
    if (document.querySelector('.fm-top-actions')) return;

    addTopActionStyles();

    const locationTarget = document.querySelector([
      '[data-location-btn]',
      '[data-open-location]',
      '[data-set-location]',
      '.set-location-btn',
      '.location-btn',
      '.location-chip',
      '.header-location',
      '.fm-location-btn',
      '#setLocationBtn'
    ].join(','));

    if(locationTarget){
      locationTarget.insertAdjacentHTML('afterend', TOP_ACTIONS);
    }else{
      const headerTarget = document.querySelector('header,.site-header,.topbar,.navbar,.main-header,.app-header,.page-header');
      if(headerTarget) headerTarget.insertAdjacentHTML('afterend', TOP_ACTIONS);
      else document.body.insertAdjacentHTML('afterbegin', TOP_ACTIONS);
    }
  }

  function addMobileNav(){
    if (adminPages.includes(page)) return;
    if (document.querySelector('.mobile-bottom-nav')) return;
    document.body.insertAdjacentHTML('beforeend', PUBLIC_BOTTOM_NAV);
    const nav = document.querySelector('.mobile-bottom-nav');
    if(!nav) return;

    let active = 'home';
    if(page === 'cart.html' || page === 'checkout.html' || page === 'order-success.html') active = 'cart';
    else if(page === 'track-order.html') active = 'track';
    else if(page === 'fresh-items.html') active = 'categories';
    else if(page === 'category.html' || page === 'product.html' || page === 'local-stores.html') active = 'categories';
    else if(page === 'customer-login.html' || page === 'customer-dashboard.html' || page === 'seller-login.html' || page === 'seller-dashboard.html' || page === 'sell-with-us.html' || page === 'join-hub.html' || page === 'refer.html') active = 'account';

    nav.querySelectorAll('a,button').forEach(item => item.classList.toggle('active', item.dataset.nav === active));
  }

  function addInstallBanner(){
    if (adminPages.includes(page) || isStandalone()) return;
    if (document.querySelector('#pwaInstallCard')) return;
    document.body.insertAdjacentHTML('beforeend', INSTALL_BANNER);
    const card = document.getElementById('pwaInstallCard');
    const btn = document.getElementById('pwaInstallBtn');
    const close = document.getElementById('pwaInstallClose');

    close?.addEventListener('click', () => {
      card.hidden = true;
      localStorage.setItem('fm_pwa_install_dismissed', Date.now().toString());
    });

    btn?.addEventListener('click', async () => {
      if(!deferredPrompt){
        showManualInstallHelp();
        card.hidden = true;
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      card.hidden = true;
    });
  }

  function showManualInstallHelp(){
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const msg = isIOS
      ? 'To install on iPhone: tap Share, then Add to Home Screen.'
      : 'Open this site in Chrome/Edge and use Add to Home Screen or Install App from the browser menu.';
    alert(msg);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addInstallBanner();
    const last = Number(localStorage.getItem('fm_pwa_install_dismissed') || 0);
    const days = (Date.now() - last) / (1000*60*60*24);
    if(days > 7){
      const card = document.getElementById('pwaInstallCard');
      if(card) card.hidden = false;
    }
  });

  window.addEventListener('appinstalled', () => {
    const card = document.getElementById('pwaInstallCard');
    if(card) card.hidden = true;
  });

  function wireManualInstallButtons(){
    document.querySelectorAll('[data-pwa-install]').forEach(btn => {
      if(btn.dataset.pwaInstallBound === 'yes') return;
      btn.dataset.pwaInstallBound = 'yes';

      btn.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if(isStandalone()){
          alert('Freshly Mart is already installed on this device.');
          return;
        }

        if(deferredPrompt){
          deferredPrompt.prompt();
          await deferredPrompt.userChoice;
          deferredPrompt = null;
          const card = document.getElementById('pwaInstallCard');
          if(card) card.hidden = true;
          return;
        }

        showManualInstallHelp();
      });
    });
  }

  async function registerSW(){
    if('serviceWorker' in navigator){
      try { await navigator.serviceWorker.register('./service-worker.js'); }
      catch(e){ console.warn('Freshly Mart service worker registration failed:', e); }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    addMobileNav();
    addTopActionButtons();
    addInstallBanner();
    wireManualInstallButtons();
    setTimeout(() => { addTopActionButtons(); wireManualInstallButtons(); }, 500);
    registerSW();
    document.body.classList.add('pwa-ready');
  });
})();
