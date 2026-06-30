(() => {
  const MOBILE_MAX = 760;
  const CATEGORY_LABELS = [
    ['Fish & Seafood','🐟 Fish & Seafood'],
    ['Chicken','🍗 Chicken'],
    ['Mutton','🥩 Mutton'],
    ['Eggs','🥚 Eggs'],
    ['Fruits & Vegetables','🥦 Fruits & Veg'],
    ['Food','🍱 Food'],
    ['Groceries','🍚 Groceries'],
    ['Daily Essentials','🛒 Essentials'],
    ['Ready to Cook','🍳 Ready to Cook'],
    ['Combo Packs','🏷️ Combo Packs'],
    ['Freshly Mart','🛍️ Freshly Mart']
  ];

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const make = (tag, attrs={}) => Object.assign(document.createElement(tag), attrs);
  const isMobile = () => window.innerWidth <= MOBILE_MAX;

  function closeMenu(){
    const menu = $('.nav .menu') || $('.menu');
    if(menu){
      menu.classList.remove('open','show','active','freshly-mobile-menu-open');
      menu.setAttribute('aria-hidden','true');
      menu.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
    $('#freshlyMoreMenu')?.classList.add('hidden');
    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open','no-scroll','menu-open','freshly-shop-opening');
    document.documentElement.classList.remove('freshly-menu-open','freshly-mobile-nav-open','no-scroll','menu-open','freshly-shop-opening');
    $$('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn => btn.setAttribute('aria-expanded','false'));
  }

  function openMenu(){
    const menu = $('.nav .menu') || $('.menu');
    if(!menu) return;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden','false');
    document.body.classList.add('freshly-menu-open','freshly-mobile-nav-open');
    document.documentElement.classList.add('freshly-menu-open','freshly-mobile-nav-open');
    $$('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn => btn.setAttribute('aria-expanded','true'));
  }

  function toggleMenu(e){
    if(!isMobile()) return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    const menu = $('.nav .menu') || $('.menu');
    if(menu && menu.classList.contains('open')) closeMenu();
    else openMenu();
  }

  function categoryFrom(el){
    return el?.dataset?.menuCat || el?.dataset?.mobileCategory || el?.dataset?.category || el?.dataset?.cat || '';
  }

  function goHome(fromMenu=false){
    if(fromMenu) closeMenu();
    document.body.classList.add('freshly-shop-opening');
    setTimeout(() => {
      closeMenu();
      if((location.pathname.split('/').pop() || 'index.html') !== 'index.html'){
        location.href = 'index.html#home';
        return;
      }
      window.scrollTo({top:0, behavior:'smooth'});
      try{ history.replaceState(null, '', 'index.html#home'); }catch(e){}
      setTimeout(closeMenu, 80);
    }, fromMenu ? 120 : 0);
  }

  function goShop(fromMenu=false){
    if(fromMenu) closeMenu();
    document.body.classList.add('freshly-shop-opening');
    setTimeout(() => {
      closeMenu();
      if(window.freshlyGoShop){
        window.freshlyGoShop(true);
      }else{
        const shop = $('#shop');
        if(shop){
          shop.scrollIntoView({behavior:'smooth', block:'start'});
          try{ history.replaceState(null, '', 'index.html#shop'); }catch(e){}
        }else{
          location.href = 'index.html#shop';
        }
      }
      setTimeout(closeMenu, 120);
    }, fromMenu ? 140 : 0);
  }

  function openCategory(category, fromOverlay=false){
    const cat = String(category || '').trim();
    if(!cat) return;
    if(fromOverlay) closeMenu();
    document.body.classList.add('freshly-shop-opening');
    setTimeout(() => {
      closeMenu();
      if(window.freshlyOpenCategory){
        window.freshlyOpenCategory(cat, {fromMobileMenu: fromOverlay, clearSearch:true});
      }else{
        localStorage.setItem('freshlySelectedCategory', cat);
        const shop = $('#shop');
        if(shop) shop.scrollIntoView({behavior:'smooth', block:'start'});
        else location.href = 'index.html#shop';
      }
      setTimeout(closeMenu, 120);
    }, fromOverlay ? 140 : 0);
  }

  function buildMobileSearch(){
    if($('.freshly-app-search')) return;
    const nav = $('.nav');
    if(!nav) return;

    const box = make('div', {className:'freshly-app-search'});
    box.innerHTML = `
      <div class="freshly-app-search-inner">
        <span class="search-icon">🔍</span>
        <input id="freshlyMobileSearch" type="search" placeholder="Search fish, chicken, groceries...">
        <button class="cart-mini" type="button" data-open-cart>🛒 <span data-cart-count>0</span></button>
      </div>
      <div class="freshly-top-category-rail">
        ${CATEGORY_LABELS.map(([cat,label]) => `<button type="button" data-mobile-category="${cat}">${label}</button>`).join('')}
      </div>`;

    const slider = $('.promo-slider');
    if(slider) slider.insertAdjacentElement('afterend', box);
    else nav.insertAdjacentElement('afterend', box);

    const desktopSearch = $('#catalogSearch');
    const mobileSearch = $('#freshlyMobileSearch');
    if(desktopSearch && mobileSearch){
      mobileSearch.addEventListener('input', () => {
        desktopSearch.value = mobileSearch.value;
        desktopSearch.dispatchEvent(new Event('input', {bubbles:true}));
      });
    }
  }

  function buildMobileHome(){
    if($('.freshly-mobile-home')) return;
    const anchor = $('.freshly-app-search') || $('.promo-slider') || $('.nav');
    if(!anchor) return;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const section = make('section', {className:'freshly-mobile-home'});
    section.innerHTML = `
      <div class="freshly-greeting-card">
        <div>
          <p class="eyebrow">${greeting}</p>
          <h1>Freshness delivered near you</h1>
          <p>Shop from your nearby Freshly Hub.</p>
        </div>
      </div>
      <div class="freshly-quick-cards">
        <button type="button" data-go-location><b>Hub</b><span>Local pickup</span></button>
        <button type="button" data-go-payment><b>UPI</b><span>Easy payment</span></button>
        <a href="track-order.html"><b>Track</b><span>Order status</span></a>
      </div>
      <div class="freshly-mobile-category-head">
        <h2>Shop by category</h2>
        <button type="button" data-go-shop>View all</button>
      </div>
      <div class="freshly-mobile-category-grid">
        ${CATEGORY_LABELS.slice(0,8).map(([cat,label]) => `<button type="button" data-mobile-category="${cat}">${label}</button>`).join('')}
      </div>`;

    anchor.insertAdjacentElement('afterend', section);
  }

  function buildMoreMenu(){
    if($('#freshlyMoreMenu')) return;
    const modal = make('div', {id:'freshlyMoreMenu', className:'freshly-more-menu hidden'});
    modal.innerHTML = `
      <div class="freshly-more-sheet">
        <div class="sheet-head"><b>Freshly Menu</b><button type="button" data-close-more>×</button></div>
        <div class="freshly-more-category-grid">
          ${CATEGORY_LABELS.map(([cat,label]) => `<button type="button" data-mobile-category="${cat}">${label}</button>`).join('')}
        </div>
        <div class="sheet-links">
          <a href="index.html#home" data-menu-home>Home</a>
          <a href="index.html#shop" data-menu-shop>Shop</a>
          <a href="track-order.html">Track Order</a>
          <a href="customer-portal.html">Customer Login</a>
          <a href="partner-dashboard.html">Partner Portal</a>
          <a href="admin.html">Admin</a>
          <a href="contact.html">Contact Freshly</a>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  function buildBottomNav(){
    if($('.freshly-bottom-nav')) return;
    const nav = make('nav', {className:'freshly-bottom-nav', ariaLabel:'Freshly mobile navigation'});
    nav.innerHTML = `
      <button type="button" data-bottom-nav="home"><span>🏠</span><small>Home</small></button>
      <button type="button" data-bottom-nav="shop"><span>🧺</span><small>Shop</small></button>
      <button type="button" data-bottom-nav="cart" data-open-cart><span>🛒</span><small>Cart</small></button>
      <a href="track-order.html" data-bottom-nav="orders"><span>📦</span><small>Orders</small></a>
      <button type="button" data-bottom-nav="menu"><span>☰</span><small>Menu</small></button>`;
    document.body.appendChild(nav);
  }

  function bindMobileEvents(){
    $$('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn => {
      if(btn.dataset.coreBoundV386 === 'yes') return;
      btn.dataset.coreBoundV386 = 'yes';
      btn.addEventListener('click', toggleMenu, true);
    });

    document.addEventListener('click', e => {
      if(!isMobile()) return;
      const menu = $('.nav .menu') || $('.menu');
      const btn = e.target.closest('.mobile-toggle,[data-menu-toggle],.menu-toggle');
      if(menu && !menu.contains(e.target) && !btn && menu.classList.contains('open')) closeMenu();
    }, true);

    document.addEventListener('click', e => {
      const dropdownBtn = e.target.closest('.menu .dropdown > button, .nav .menu .dropdown > button, .dropdown-btn');
      if(dropdownBtn && isMobile()){
        e.preventDefault();
        e.stopPropagation();
        const dd = dropdownBtn.closest('.dropdown');
        dd?.classList.toggle('open');
        return;
      }

      const homeLink = e.target.closest('[data-menu-home], .menu a[href$="#home"], .nav .menu a[href$="#home"]');
      if(homeLink && isMobile()){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        goHome(true);
        return;
      }

      const shopLink = e.target.closest('[data-menu-shop], .menu a[href$="#shop"], .nav .menu a[href$="#shop"]');
      if(shopLink && isMobile() && !shopLink.matches('[data-menu-cat],[data-mobile-category]')){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        goShop(true);
        return;
      }

      const catItem = e.target.closest('[data-menu-cat],[data-mobile-category]');
      if(catItem){
        const inTopRail = !!catItem.closest('.freshly-top-category-rail');
        const inOverlay = isMobile() && !inTopRail && !!catItem.closest('.menu,.nav .menu,.freshly-more-menu,#freshlyMoreMenu');
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        openCategory(categoryFrom(catItem), inOverlay);
        return;
      }

      const shopBtn = e.target.closest('[data-go-shop],[data-bottom-nav="shop"]');
      if(shopBtn){
        e.preventDefault();
        goShop(false);
        return;
      }

      const homeBtn = e.target.closest('[data-bottom-nav="home"]');
      if(homeBtn){
        e.preventDefault();
        goHome(false);
        return;
      }

      const menuBtn = e.target.closest('[data-bottom-nav="menu"]');
      if(menuBtn){
        e.preventDefault();
        closeMenu();
        $('#freshlyMoreMenu')?.classList.remove('hidden');
        return;
      }

      const locBtn = e.target.closest('[data-go-location]');
      if(locBtn){
        e.preventDefault();
        const loc = document.querySelector('.location-picker-section,[data-location-select-box],.nav-top-row');
        if(loc) loc.scrollIntoView({behavior:'smooth', block:'start'});
        return;
      }

      const payBtn = e.target.closest('[data-go-payment]');
      if(payBtn){
        e.preventDefault();
        goShop(false);
        return;
      }

      if(e.target.closest('[data-close-more]')){
        e.preventDefault();
        $('#freshlyMoreMenu')?.classList.add('hidden');
        return;
      }

      if(e.target.id === 'freshlyMoreMenu') $('#freshlyMoreMenu')?.classList.add('hidden');
    }, true);
  }

  function init(){
    buildMobileSearch();
    buildMobileHome();
    buildMoreMenu();
    buildBottomNav();
    bindMobileEvents();
    if(isMobile()) closeMenu();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
  addEventListener('resize', () => { if(isMobile()) closeMenu(); });
})();
