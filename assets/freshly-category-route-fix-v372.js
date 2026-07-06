(function(){
  function categoryFrom(el){
    return el?.dataset?.menuCat || el?.dataset?.mobileCategory || el?.dataset?.category || el?.dataset?.cat || '';
  }
  function subcategoryFrom(el){
    return el?.dataset?.menuSubcat || el?.dataset?.mobileSubcategory || el?.dataset?.subcat || '';
  }

  function bind(){
    document.querySelectorAll('[data-menu-cat],[data-mobile-category],[data-menu-subcat],[data-mobile-subcategory]').forEach(el=>{
      if(el.dataset.routeFixedV372 === 'yes') return;
      el.dataset.routeFixedV372 = 'yes';
      el.addEventListener('click', e=>{
        const cat = categoryFrom(el);
        const subcat = subcategoryFrom(el);
        if(!cat && !subcat) return;
        e.preventDefault();
        e.stopPropagation();
        if(subcat && window.freshlyOpenSubCategory){
          window.freshlyOpenSubCategory(cat || 'CAT-MEAT', subcat);
          if(window.freshlyCloseMobileOverlays) window.freshlyCloseMobileOverlays();
        } else if(window.freshlyOpenCategory){
          window.freshlyOpenCategory(cat);
          if(window.freshlyCloseMobileOverlays) window.freshlyCloseMobileOverlays();
        } else {
          localStorage.setItem('freshlySelectedCategory', cat || 'CAT-MEAT');
          if(subcat) localStorage.setItem('freshlySelectedSubCategory', subcat);
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
