(function(){
  function categoryFrom(el){
    return el?.dataset?.menuCat || el?.dataset?.mobileCategory || el?.dataset?.category || el?.dataset?.cat || '';
  }

  function bind(){
    document.querySelectorAll('[data-menu-cat],[data-mobile-category]').forEach(el=>{
      if(el.dataset.routeFixedV372 === 'yes') return;
      el.dataset.routeFixedV372 = 'yes';
      el.addEventListener('click', e=>{
        const cat = categoryFrom(el);
        if(!cat) return;
        e.preventDefault();
        e.stopPropagation();
        if(window.freshlyOpenCategory){
          window.freshlyOpenCategory(cat);
          if(window.freshlyCloseMobileOverlays) window.freshlyCloseMobileOverlays();
        } else {
          localStorage.setItem('freshlySelectedCategory', cat);
          location.href = 'index.html#shop';
        }
      }, true);
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  setTimeout(bind, 400);
  setTimeout(bind, 1200);
  setTimeout(bind, 2500);

  const observer = new MutationObserver(()=>{ clearTimeout(window.__freshlyCatRouteTimer); window.__freshlyCatRouteTimer=setTimeout(bind,80); });
  if(document.body) observer.observe(document.body,{childList:true,subtree:true});
})();
