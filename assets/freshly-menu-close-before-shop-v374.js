(function(){
  function isMobile(){
    return window.innerWidth <= 760;
  }

  function hardCloseMenus(){
    document.querySelectorAll('.menu,.nav .menu').forEach(menu=>{
      menu.classList.remove('open','show','active','freshly-mobile-menu-open');
      menu.setAttribute('aria-hidden','true');
      menu.style.display = 'none';
      menu.style.visibility = 'hidden';
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
      menu.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
    });

    document.querySelectorAll('.freshly-more-menu,#freshlyMoreMenu').forEach(menu=>{
      menu.classList.add('hidden');
      menu.style.display = 'none';
      menu.style.visibility = 'hidden';
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
    });

    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open','no-scroll','menu-open');
    document.documentElement.classList.remove('freshly-menu-open','freshly-mobile-nav-open');

    document.querySelectorAll('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn=>{
      btn.setAttribute('aria-expanded','false');
    });
  }

  function reopenMenuStyles(){
    // Remove inline hard-hide only when user intentionally taps hamburger again.
    document.querySelectorAll('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn=>{
      if(btn.dataset.reopenResetV374 === 'yes') return;
      btn.dataset.reopenResetV374 = 'yes';
      btn.addEventListener('click',()=>{
        setTimeout(()=>{
          const menu = document.querySelector('.nav .menu,.menu');
          if(menu && (menu.classList.contains('open') || menu.classList.contains('freshly-mobile-menu-open'))){
            menu.style.display = '';
            menu.style.visibility = '';
            menu.style.opacity = '';
            menu.style.pointerEvents = '';
          }
        },20);
      },true);
    });
  }

  function categoryFrom(el){
    return el?.dataset?.menuCat || el?.dataset?.mobileCategory || el?.dataset?.category || el?.dataset?.cat || '';
  }

  function routeToCategory(cat){
    const category = String(cat || '').trim();
    if(!category) return;

    if(window.freshlyOpenCategory){
      window.freshlyOpenCategory(category);
      hardCloseMenus();
      return;
    }

    localStorage.setItem('freshlySelectedCategory', category);
    const isIndex = (location.pathname.split('/').pop() || 'index.html') === 'index.html';
    if(isIndex && document.querySelector('#shop')){
      document.querySelector('#shop').scrollIntoView({behavior:'smooth', block:'start'});
      try{ history.replaceState(null,'','index.html#shop'); }catch(e){}
    }else{
      location.href = 'index.html#shop';
    }
  }

  function bind(){
    reopenMenuStyles();

    document.addEventListener('click', function(e){
      if(!isMobile()) return;

      const item = e.target.closest('[data-menu-cat],[data-mobile-category]');
      if(!item) return;

      const insideTopMenu = !!item.closest('.menu,.nav .menu');
      const insideMoreMenu = !!item.closest('.freshly-more-menu,#freshlyMoreMenu');
      const insideTopRail = !!item.closest('.freshly-top-category-rail');

      // Top rail is not an overlay, so let normal routing handle it.
      if(insideTopRail && !insideTopMenu && !insideMoreMenu) return;

      const cat = categoryFrom(item);
      if(!cat) return;

      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation) e.stopImmediatePropagation();

      hardCloseMenus();

      // Wait one frame so overlay disappears before Shop scroll/render happens.
      setTimeout(()=>routeToCategory(cat), 80);
    }, true);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();

  setTimeout(()=>{ hardCloseMenus(); reopenMenuStyles(); }, 500);
})();
