(function(){
  function hardCloseMenus(){
    document.querySelectorAll('.menu,.nav .menu').forEach(menu=>{
      menu.classList.remove('open','show','active','freshly-mobile-menu-open');
      menu.setAttribute('aria-hidden','true');
      menu.style.display='none';
      menu.style.visibility='hidden';
      menu.style.opacity='0';
      menu.style.pointerEvents='none';
    });
    document.querySelectorAll('.freshly-more-menu,#freshlyMoreMenu').forEach(menu=>{
      menu.classList.add('hidden');
      menu.style.display='none';
      menu.style.visibility='hidden';
      menu.style.opacity='0';
      menu.style.pointerEvents='none';
    });
    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open','no-scroll','menu-open');
    document.documentElement.classList.remove('freshly-menu-open','freshly-mobile-nav-open');
    document.querySelectorAll('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn=>btn.setAttribute('aria-expanded','false'));
  }

  function resetMenuInlineOnToggle(){
    document.querySelectorAll('.mobile-toggle,[data-menu-toggle],.menu-toggle').forEach(btn=>{
      if(btn.dataset.v375Reset === 'yes') return;
      btn.dataset.v375Reset = 'yes';
      btn.addEventListener('click',()=>{
        setTimeout(()=>{
          const menu = document.querySelector('.nav .menu,.menu');
          if(menu && (menu.classList.contains('open') || menu.classList.contains('freshly-mobile-menu-open'))){
            menu.style.display='';
            menu.style.visibility='';
            menu.style.opacity='';
            menu.style.pointerEvents='';
            menu.setAttribute('aria-hidden','false');
          }
        },40);
      }, true);
    });
  }

  window.freshlyHardCloseMenus = hardCloseMenus;

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resetMenuInlineOnToggle);
  else resetMenuInlineOnToggle();

  setTimeout(resetMenuInlineOnToggle,500);
})();
