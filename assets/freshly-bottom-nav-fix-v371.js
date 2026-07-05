(function(){
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
    e.preventDefault();
    if(!isIndexPage()){
      location.href = 'index.html#home';
      return;
    }
    window.scrollTo({top:0, behavior:'smooth'});
    history.replaceState(null,'','index.html#home');
    setActive('home');
  }

  function goShop(e){
    e.preventDefault();
    if(!isIndexPage()){
      localStorage.setItem('freshlySelectedCategory','all');
      location.href = 'index.html#shop';
      return;
    }
    if(window.freshlyGoShop) window.freshlyGoShop(true);
    else scrollToTarget('#shop');
    try{history.replaceState(null,'','index.html#shop');}catch(err){}
    setActive('shop');
  }

  function openCart(e){
    e.preventDefault();
    const cartBtn = document.querySelector('.cart-float,[data-open-cart]:not(.freshly-bottom-nav [data-open-cart])');
    if(cartBtn) cartBtn.click();
    else document.querySelector('#cartDrawer')?.classList.add('open');
    setActive('cart');
  }

  function openMenu(e){
    e.preventDefault();
    const menu = document.querySelector('#freshlyMoreMenu');
    if(menu) menu.classList.remove('hidden');
    const mainMenu = document.querySelector('.menu');
    if(!menu && mainMenu) mainMenu.classList.add('open');
    setActive('menu');
  }

  function init(){
    const nav = document.querySelector('.freshly-bottom-nav');
    if(!nav || nav.dataset.fixedV371 === 'yes') return;
    nav.dataset.fixedV371 = 'yes';

    const items = [...nav.querySelectorAll('a,button')];
    items.forEach(item=>{
      const txt = (item.textContent || '').toLowerCase();
      if(txt.includes('home')) item.dataset.navKey = 'home';
      else if(txt.includes('shop')) item.dataset.navKey = 'shop';
      else if(txt.includes('cart')) item.dataset.navKey = 'cart';
      else if(txt.includes('order')) item.dataset.navKey = 'orders';
      else if(txt.includes('menu')) item.dataset.navKey = 'menu';
    });

    nav.addEventListener('click', e=>{
      const item = e.target.closest('a,button');
      if(!item || !nav.contains(item)) return;
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

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  setTimeout(init, 500);
  setTimeout(init, 1500);
})();
