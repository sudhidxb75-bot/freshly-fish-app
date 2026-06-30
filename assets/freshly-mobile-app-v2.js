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

  function isMobile(){ return window.innerWidth <= MOBILE_MAX; }

  function closeMenu(){
    const menu = $('.nav .menu') || $('.menu');
    if(menu){
      menu.classList.remove('open','show','active');
      menu.setAttribute('aria-hidden','true');
    }
    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open','no-scroll','menu-open');
    $$('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn => btn.setAttribute('aria-expanded','false'));
    $$('.dropdown.open').forEach(d => d.classList.remove('open'));
  }

  function openMenu(){
    const menu = $('.nav .menu') || $('.menu');
    if(!menu) return;
    menu.classList.add('open');
    menu.setAttribute('aria-hidden','false');
    document.body.classList.add('freshly-menu-open','freshly-mobile-nav-open');
    $$('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn => btn.setAttribute('aria-expanded','true'));
  }

  function toggleMenu(e){
    if(!isMobile()) return;
    e.preventDefault();
    e.stopPropagation();
    const menu = $('.nav .menu') || $('.menu');
    if(menu && menu.classList.contains('open')) closeMenu();
    else openMenu();
  }

  function categoryFrom(el){
    return el?.dataset?.menuCat || el?.dataset?.mobileCategory || el?.dataset?.category || el?.dataset?.cat || '';
  }

  function openCategory(category, fromOverlay=false){
    const cat = String(category || '').trim();
    if(!cat) return;
    if(fromOverlay) closeMenu();

    const route = () => {
      if(window.freshlyOpenCategory) window.freshlyOpenCategory(cat);
      else {
        localStorage.setItem('freshlySelectedCategory', cat);
        location.href = 'index.html#shop';
      }
      if(fromOverlay) setTimeout(closeMenu, 80);
    };

    if(fromOverlay) setTimeout(route, 120);
    else route();
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
          <p>Shop fresh fish, meat, groceries and daily essentials from Freshly hubs.</p>
        </div>
        <button type="button" data-go-shop>Shop now</button>
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
          <a href="track-order.html">Track Order</a>
          <a href="customer-portal.html">Customer Login</a>
          <a href="#contact">Contact Freshly</a>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  function buildBottomNav(){
    if($('.freshly-bottom-nav')) return;
    const nav = make('nav', {className:'freshly-bottom-nav', ariaLabel:'Freshly mobile navigation'});
    nav.innerHTML = `
      <button type="button" data-bottom-nav="home"><span>🏠</span><small>Home</small></button>
      <button type="button" data-bottom-nav="shop"><span>🛒</span><small>Shop</small></button>
      <button type="button" data-bottom-nav="cart" data-open-cart><span>🧺</span><small>Cart</small></button>
      <a href="track-order.html" data-bottom-nav="orders"><span>📦</span><small>Orders</small></a>
      <button type="button" data-bottom-nav="menu"><span>☰</span><small>Menu</small></button>`;
    document.body.appendChild(nav);
  }

  function bindMobileEvents(){
    $$('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn => {
      if(btn.dataset.cleanBound === 'yes') return;
      btn.dataset.cleanBound = 'yes';
      btn.addEventListener('click', toggleMenu, true);
    });

    document.addEventListener('click', e => {
      if(!isMobile()) return;
      const menu = $('.nav .menu') || $('.menu');
      const btn = e.target.closest('.mobile-toggle,[data-menu-toggle],.menu-toggle');
      if(menu && !menu.contains(e.target) && !btn && menu.classList.contains('open')) closeMenu();
    }, true);

    document.addEventListener('click', e => {
      const catItem = e.target.closest('[data-menu-cat],[data-mobile-category]');
      if(catItem){
        const inOverlay = isMobile() && !!catItem.closest('.menu,.nav .menu,.freshly-more-menu,#freshlyMoreMenu') && !catItem.closest('.freshly-top-category-rail');
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        openCategory(categoryFrom(catItem), inOverlay);
        return;
      }

      const shopBtn = e.target.closest('[data-go-shop],[data-bottom-nav="shop"]');
      if(shopBtn){
        e.preventDefault();
        if(window.freshlyGoShop) window.freshlyGoShop(true);
        else location.href = 'index.html#shop';
        closeMenu();
        return;
      }

      const homeBtn = e.target.closest('[data-bottom-nav="home"]');
      if(homeBtn){
        e.preventDefault();
        if(location.pathname.split('/').pop() && location.pathname.split('/').pop() !== 'index.html'){
          location.href = 'index.html#home';
        }else{
          window.scrollTo({top:0, behavior:'smooth'});
          history.replaceState(null,'','index.html#home');
        }
        closeMenu();
        return;
      }

      const menuBtn = e.target.closest('[data-bottom-nav="menu"]');
      if(menuBtn){
        e.preventDefault();
        $('#freshlyMoreMenu')?.classList.remove('hidden');
        return;
      }

      if(e.target.closest('[data-close-more]')){
        e.preventDefault();
        $('#freshlyMoreMenu')?.classList.add('hidden');
        return;
      }

      if(e.target.id === 'freshlyMoreMenu'){
        $('#freshlyMoreMenu')?.classList.add('hidden');
      }
    }, true);
  }

  function init(){
    buildMobileSearch();
    buildMobileHome();
    buildMoreMenu();
    buildBottomNav();
    bindMobileEvents();
    closeMenu();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.addEventListener('resize', () => { if(isMobile()) closeMenu(); });
})();
