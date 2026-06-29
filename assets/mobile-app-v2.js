(function(){
  function el(tag, attrs, html){
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k,v]) => {
      if(k === 'class') node.className = v;
      else if(k === 'html') node.innerHTML = v;
      else node.setAttribute(k,v);
    });
    if(html !== undefined) node.innerHTML = html;
    return node;
  }

  function buildSearch(){
    if(document.querySelector('.freshly-app-search')) return;
    const nav = document.querySelector('.nav');
    if(!nav) return;

    const box = el('div', {class:'freshly-app-search'});
    box.innerHTML = `<div class="freshly-app-search-inner">
      <span class="search-icon">🔍</span>
      <input id="mobileCatalogSearch" type="search" placeholder="Search fish, meat, groceries...">
      <button class="cart-mini" type="button" data-open-cart aria-label="Cart">🛒 <span data-cart-count>0</span></button>
    </div>`;
    nav.insertAdjacentElement('afterend', box);

    const mobileSearch = box.querySelector('#mobileCatalogSearch');
    const originalSearch = document.querySelector('#catalogSearch');
    if(mobileSearch && originalSearch){
      mobileSearch.addEventListener('input', () => {
        originalSearch.value = mobileSearch.value;
        originalSearch.dispatchEvent(new Event('input', {bubbles:true}));
      });
    }
  }

  function buildMobileHome(){
    if(document.querySelector('.freshly-mobile-home')) return;
    const promo = document.querySelector('.promo-slider');
    if(!promo) return;

    const home = el('section', {class:'freshly-mobile-home'});
    home.innerHTML = `
      <div class="mobile-section-title">
        <h2>Shop by category</h2>
        <a href="#shop">View all</a>
      </div>
      <div class="mobile-category-grid">
        <a class="mobile-cat-card" href="#shop"><span class="icon">🐟</span><span>Fish & Seafood</span></a>
        <a class="mobile-cat-card" href="#shop"><span class="icon">🍗</span><span>Fresh Meat</span></a>
        <a class="mobile-cat-card" href="#shop"><span class="icon">🥦</span><span>Fruits & Veg</span></a>
        <a class="mobile-cat-card" href="#shop"><span class="icon">🛒</span><span>Daily Essentials</span></a>
      </div>
      <div class="freshly-benefit-strip">
        <span class="benefit-chip">Freshness Delivered</span>
        <span class="benefit-chip">Nearby Freshly Hub</span>
        <span class="benefit-chip">UPI Payment</span>
        <span class="benefit-chip">Track Orders</span>
      </div>
    `;
    promo.insertAdjacentElement('afterend', home);
  }

  function buildBottomNav(){
    if(document.querySelector('.freshly-bottom-nav')) return;
    const nav = el('nav', {class:'freshly-bottom-nav', 'aria-label':'Freshly mobile bottom navigation'});
    nav.innerHTML = `
      <a class="active" href="index.html#home"><span class="nav-icon">🏠</span><span>Home</span></a>
      <a href="index.html#shop"><span class="nav-icon">🧺</span><span>Shop</span></a>
      <button type="button" data-open-cart><span class="cart-count-badge" data-cart-count>0</span><span class="nav-icon">🛒</span><span>Cart</span></button>
      <a href="track-order.html"><span class="nav-icon">📦</span><span>Orders</span></a>
      <a href="customer-portal.html"><span class="nav-icon">👤</span><span>Account</span></a>
    `;
    document.body.appendChild(nav);
  }

  function syncCartCounts(){
    const source = document.querySelector('[data-cart-count]');
    const count = source ? source.textContent : '0';
    document.querySelectorAll('.freshly-bottom-nav [data-cart-count], .freshly-app-search [data-cart-count]').forEach(el => {
      el.textContent = count;
    });
  }

  function observeCart(){
    const observer = new MutationObserver(syncCartCounts);
    document.querySelectorAll('[data-cart-count]').forEach(node => {
      observer.observe(node, {childList:true, characterData:true, subtree:true});
    });
    setInterval(syncCartCounts, 1000);
  }

  function init(){
    buildSearch();
    buildMobileHome();
    buildBottomNav();
    observeCart();
    syncCartCounts();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
