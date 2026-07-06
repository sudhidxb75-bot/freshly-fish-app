(function(){
  'use strict';

  function isIndexPage(){
    const path = location.pathname.split('/').pop() || 'index.html';
    return path === 'index.html' || path === '';
  }

  function scrollToTarget(selector){
    const el = document.querySelector(selector);
    if(el){
      el.scrollIntoView({behavior:'smooth', block:'start'});
      return true;
    }
    return false;
  }

  function setActive(key){
    document.querySelectorAll('.freshly-bottom-nav a,.freshly-bottom-nav button').forEach(item=>{
      item.classList.toggle('active', item.dataset.navKey === key);
    });
  }

  function goHome(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    if(!isIndexPage()){
      location.href = 'index.html#home';
      return false;
    }
    window.scrollTo({top:0, behavior:'smooth'});
    try{ history.replaceState(null,'','index.html#home'); }catch(err){}
    setActive('home');
    return false;
  }

  function goShop(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    if(!isIndexPage()){
      try{ localStorage.setItem('freshlySelectedCategory','all'); }catch(err){}
      location.href = 'index.html#shop';
      return false;
    }
    if(window.freshlyGoShop) window.freshlyGoShop(true);
    else scrollToTarget('#shop');
    try{history.replaceState(null,'','index.html#shop');}catch(err){}
    setActive('shop');
    return false;
  }

  function openCart(e){
    if(e){ e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation(); }
    try{
      if(typeof window.openFreshlyCart === 'function'){
        window.openFreshlyCart();
      }else if(typeof window.freshlyOpenCart === 'function'){
        window.freshlyOpenCart();
      }else{
        const drawer = document.getElementById('cartDrawer');
        if(drawer){
          drawer.classList.add('open','active','show');
          drawer.setAttribute('aria-hidden','false');
          drawer.style.right='0';
          drawer.style.visibility='visible';
          drawer.style.display='block';
          drawer.style.zIndex='99999';
          document.body.classList.add('freshly-cart-open');
        }else if(!isIndexPage()){
          try{sessionStorage.setItem('freshlyOpenCartOnLoad','yes');}catch(err){}
          location.href='index.html#cart';
        }
      }
    }catch(err){
      const drawer = document.getElementById('cartDrawer');
      if(drawer) drawer.classList.add('open');
    }
    setActive('cart');
    return false;
  }

  function openMenu(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    const menu = document.querySelector('#freshlyMoreMenu');
    if(menu) menu.classList.remove('hidden');
    const mainMenu = document.querySelector('.menu');
    if(!menu && mainMenu) mainMenu.classList.add('open');
    setActive('menu');
    return false;
  }

  function assignKeys(nav){
    const items = Array.from(nav.querySelectorAll('a,button'));
    items.forEach(item=>{
      if(item.dataset.navKey) return;
      const txt = (item.textContent || item.getAttribute('aria-label') || '').toLowerCase();
      if(item.matches('[data-open-cart]') || txt.includes('cart')) item.dataset.navKey = 'cart';
      else if(item.matches('[data-open-more]') || txt.includes('menu')) item.dataset.navKey = 'menu';
      else if(txt.includes('home')) item.dataset.navKey = 'home';
      else if(txt.includes('shop')) item.dataset.navKey = 'shop';
      else if(txt.includes('order') || txt.includes('track')) item.dataset.navKey = 'orders';
    });
  }

  function init(){
    const nav = document.querySelector('.freshly-bottom-nav');
    if(!nav) return;
    assignKeys(nav);
    if(nav.dataset.fixedV3818 === 'yes') return;
    nav.dataset.fixedV3818 = 'yes';

    nav.addEventListener('click', function(e){
      const item = e.target.closest('a,button');
      if(!item || !nav.contains(item)) return;
      assignKeys(nav);
      const key = item.dataset.navKey;
      if(key === 'home') return goHome(e);
      if(key === 'shop') return goShop(e);
      if(key === 'cart') return openCart(e);
      if(key === 'menu') return openMenu(e);
      if(key === 'orders'){
        setActive('orders');
        return;
      }
    }, true);

    if(location.hash === '#shop') setActive('shop');
    else if(location.pathname.includes('track-order')) setActive('orders');
    else setActive('home');
  }

  // Extra direct safety binding for cart buttons created after app.js init.
  document.addEventListener('click', function(e){
    const cartTrigger = e.target.closest('.freshly-bottom-nav [data-open-cart], .freshly-quick-actions [data-open-cart], #freshlyMoreMenu [data-open-cart]');
    if(cartTrigger) return openCart(e);
  }, true);

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  setTimeout(init, 300);
  setTimeout(init, 900);
  setTimeout(init, 1800);
})();
