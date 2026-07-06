/* Freshly V3.8.18 - Robust footer/bottom cart refix
   Based on working V3.8.17 package. This file only fixes cart opening from
   footer/bottom nav/quick action buttons and keeps backend/frontend logic unchanged. */
(function(){
  'use strict';

  function isIndexPage_(){
    var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    return file === '' || file === 'index.html';
  }

  function findCartDrawer_(){
    return document.getElementById('cartDrawer') || document.querySelector('[data-cart-drawer], .drawer.cart-drawer');
  }

  function openCartDrawer_(){
    var drawer = findCartDrawer_();
    if(!drawer){
      if(!isIndexPage_()){
        try{ sessionStorage.setItem('freshlyOpenCartOnLoad','yes'); }catch(err){}
        location.href = 'index.html#cart';
      }
      return false;
    }

    try{ if(typeof window.freshlyUpdateCartUI === 'function') window.freshlyUpdateCartUI(); }catch(err){}

    drawer.classList.add('open','active','show');
    drawer.setAttribute('aria-hidden','false');
    drawer.style.right = '0';
    drawer.style.visibility = 'visible';
    drawer.style.display = 'block';
    drawer.style.pointerEvents = 'auto';
    drawer.style.zIndex = '99999';
    try{ drawer.scrollTop = 0; }catch(err){}

    document.body.classList.add('freshly-cart-open');
    document.querySelector('#freshlyMoreMenu')?.classList.add('hidden');
    document.querySelector('.menu')?.classList.remove('open','show','active');
    document.querySelectorAll('.freshly-bottom-nav a,.freshly-bottom-nav button').forEach(function(item){
      item.classList.toggle('active', item.matches('[data-open-cart], [data-nav-key="cart"]'));
    });
    return false;
  }

  function closeCartDrawer_(){
    var drawer = findCartDrawer_();
    if(drawer){
      drawer.classList.remove('open','active','show');
      drawer.setAttribute('aria-hidden','true');
      drawer.style.right = '';
      drawer.style.visibility = '';
      drawer.style.display = '';
      drawer.style.pointerEvents = '';
    }
    document.body.classList.remove('freshly-cart-open');
    return false;
  }

  function isCartTrigger_(el){
    if(!el || !el.closest) return false;
    var trigger = el.closest('[data-open-cart], [data-nav-key="cart"], .cart-float, .freshly-cart-trigger, .open-cart, .cart-button');
    if(trigger) return trigger;

    var item = el.closest('.freshly-bottom-nav button, .freshly-bottom-nav a, .freshly-quick-actions button, .freshly-quick-actions a, #freshlyMoreMenu button, #freshlyMoreMenu a');
    if(!item) return null;
    var txt = (item.textContent || item.getAttribute('aria-label') || '').toLowerCase().trim();
    return txt.indexOf('cart') !== -1 ? item : null;
  }

  function handleCartClick_(e){
    var trigger = isCartTrigger_(e.target);
    if(!trigger) return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    openCartDrawer_();
    return false;
  }

  function bindExisting_(){
    document.querySelectorAll('[data-open-cart], [data-nav-key="cart"], .cart-float').forEach(function(el){
      if(el.dataset.freshlyCartRefixBound === 'yes') return;
      el.dataset.freshlyCartRefixBound = 'yes';
      el.setAttribute('type', el.tagName === 'BUTTON' ? 'button' : (el.getAttribute('type') || ''));
      el.addEventListener('click', handleCartClick_, true);
    });

    document.querySelectorAll('[data-close-cart]').forEach(function(el){
      if(el.dataset.freshlyCloseCartRefixBound === 'yes') return;
      el.dataset.freshlyCloseCartRefixBound = 'yes';
      el.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        closeCartDrawer_();
        return false;
      }, true);
    });
  }

  // Capture works for bottom nav and quick action buttons even when they are created after app.js initialization.
  document.addEventListener('click', handleCartClick_, true);
  document.addEventListener('touchend', function(e){
    var trigger = isCartTrigger_(e.target);
    if(trigger){
      e.preventDefault();
      e.stopPropagation();
      openCartDrawer_();
      return false;
    }
  }, {capture:true, passive:false});

  function init_(){
    bindExisting_();
    if(location.hash === '#cart') openCartDrawer_();
    try{
      if(sessionStorage.getItem('freshlyOpenCartOnLoad') === 'yes'){
        sessionStorage.removeItem('freshlyOpenCartOnLoad');
        openCartDrawer_();
      }
    }catch(err){}
  }

  window.freshlyOpenCart = window.freshlyOpenCart || openCartDrawer_;
  window.openFreshlyCart = openCartDrawer_;
  window.freshlyCartRefixOpen = openCartDrawer_;
  window.freshlyCloseCart = window.freshlyCloseCart || closeCartDrawer_;
  window.closeFreshlyCart = closeCartDrawer_;

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init_);
  else init_();

  setTimeout(init_, 300);
  setTimeout(init_, 900);
  setTimeout(init_, 1800);
  setTimeout(init_, 3000);
})();
