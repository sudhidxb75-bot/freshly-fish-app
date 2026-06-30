(function(){
  function isMobile(){ return window.innerWidth <= 760; }
  function closeMenus(){
    document.querySelectorAll('.menu,.nav .menu').forEach(menu=>{
      menu.classList.remove('open','show','active','freshly-mobile-menu-open');
      menu.setAttribute('aria-hidden','true');
      menu.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
    });
    document.querySelectorAll('.freshly-more-menu,#freshlyMoreMenu').forEach(menu=>menu.classList.add('hidden'));
    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open','no-scroll','menu-open');
    document.documentElement.classList.remove('freshly-menu-open','freshly-mobile-nav-open');
    document.querySelectorAll('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn=>btn.setAttribute('aria-expanded','false'));
  }
  function categoryFrom(el){ return el?.dataset?.menuCat || el?.dataset?.mobileCategory || el?.dataset?.category || el?.dataset?.cat || ''; }
  function route(category, fromOverlay){
    const cat=String(category||'').trim(); if(!cat) return;
    if(fromOverlay) closeMenus();
    setTimeout(()=>{
      if(window.freshlyOpenCategory) window.freshlyOpenCategory(cat);
      else { localStorage.setItem('freshlySelectedCategory', cat); location.href='index.html#shop'; }
      if(fromOverlay) setTimeout(closeMenus,80);
    }, fromOverlay ? 120 : 0);
  }
  function bind(){
    document.querySelectorAll('[data-menu-cat],[data-mobile-category]').forEach(el=>{
      if(el.dataset.routeFixedV376==='yes') return;
      el.dataset.routeFixedV376='yes';
      el.addEventListener('click',e=>{
        const cat=categoryFrom(el); if(!cat) return;
        const inTopRail=!!el.closest('.freshly-top-category-rail');
        const inOverlay=isMobile() && !inTopRail && !!el.closest('.menu,.nav .menu,.freshly-more-menu,#freshlyMoreMenu');
        e.preventDefault(); e.stopPropagation(); if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        route(cat,inOverlay);
      },true);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
  setTimeout(bind,400); setTimeout(bind,1200); setTimeout(bind,2500);
  const observer=new MutationObserver(()=>{clearTimeout(window.__freshlyCatRouteTimer); window.__freshlyCatRouteTimer=setTimeout(bind,80);});
  if(document.body) observer.observe(document.body,{childList:true,subtree:true});
})();
