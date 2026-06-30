(function(){
  function isMobile(){ return window.innerWidth <= 760; }

  function closeTopMenu(){
    if(window.freshlyHardCloseMenus){ window.freshlyHardCloseMenus(); return; }
    const menu=document.querySelector('.nav .menu,.menu');
    if(menu){
      menu.classList.remove('open','freshly-mobile-menu-open');
      menu.setAttribute('aria-hidden','true');
    }
    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open');
  }

  function openTopMenu(){
    const menu=document.querySelector('.nav .menu,.menu');
    if(!menu) return;
    menu.style.display='';
    menu.style.visibility='';
    menu.style.opacity='';
    menu.style.pointerEvents='';
    menu.classList.add('open','freshly-mobile-menu-open');
    menu.setAttribute('aria-hidden','false');
    document.body.classList.add('freshly-menu-open','freshly-mobile-nav-open');
  }

  function bindMenuVisibility(){
    if(!isMobile()) return;
    const btn=document.querySelector('.mobile-toggle,[data-menu-toggle],.menu-toggle');
    const menu=document.querySelector('.nav .menu,.menu');
    if(!menu) return;

    if(!menu.classList.contains('open') && !menu.classList.contains('freshly-mobile-menu-open')){
      closeTopMenu();
    }

    if(btn && btn.dataset.menuVisibilityV375 !== 'yes'){
      btn.dataset.menuVisibilityV375='yes';
      btn.addEventListener('click', function(e){
        if(!isMobile()) return;
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation) e.stopImmediatePropagation();
        const open=menu.classList.contains('open') || menu.classList.contains('freshly-mobile-menu-open');
        if(open) closeTopMenu();
        else openTopMenu();
      }, true);
    }

    document.addEventListener('click', function(e){
      if(!isMobile()) return;
      const m=document.querySelector('.nav .menu,.menu');
      const b=document.querySelector('.mobile-toggle,[data-menu-toggle],.menu-toggle');
      if(!m) return;
      if(m.contains(e.target) || (b && b.contains(e.target))) return;
      closeTopMenu();
    }, true);
  }

  function setupCarousel(){
    const slider=document.querySelector('.promo-slider');
    const track=document.querySelector('[data-promo-track]');
    if(!slider || !track) return;

    const slides=[...track.querySelectorAll('.promo-slide')].filter(slide=>{
      if(slide.classList.contains('banner-image-error')) return false;
      const img=slide.querySelector('img');
      const bg=getComputedStyle(slide).backgroundImage || '';
      return (img && img.getAttribute('src')) || (bg && bg !== 'none') || slide.textContent.trim();
    });

    const dots=[...document.querySelectorAll('[data-promo-dot]')];

    if(!slides.length){
      slider.classList.add('hidden');
      return;
    }

    slider.classList.remove('hidden');
    slider.style.overflow='hidden';
    track.style.transform='none';
    track.style.width='100%';

    let index=0;

    function show(n){
      index=((n % slides.length) + slides.length) % slides.length;
      slides.forEach((slide,idx)=>{
        const active=idx===index;
        slide.classList.toggle('active',active);
        slide.style.display=active?'block':'none';
        slide.style.opacity=active?'1':'0';
        slide.style.pointerEvents=active?'auto':'none';
        slide.style.width='100%';
        slide.style.flex='0 0 100%';
        const css=getComputedStyle(slide);
        const h=isMobile() ? (css.getPropertyValue('--banner-mobile-height').trim() || '270px') : (css.getPropertyValue('--banner-desktop-height').trim() || '340px');
        slide.style.height=h;
        slide.style.minHeight=h;
        slide.style.maxHeight=h;
        slide.querySelectorAll('img').forEach(img=>{
          img.style.display='block';
          img.style.width='100%';
          img.style.height='100%';
          img.style.objectFit=isMobile()?'cover':(css.getPropertyValue('--banner-object-fit').trim() || 'cover');
          img.style.objectPosition=isMobile()?'center top':(css.getPropertyValue('--banner-object-position').trim() || 'center center');
        });
      });
      dots.forEach((dot,idx)=>{
        dot.classList.toggle('active',idx===index);
        dot.style.display=idx<slides.length?'':'none';
      });
    }

    dots.forEach((dot,idx)=>{
      if(dot.dataset.bannerV375==='yes') return;
      dot.dataset.bannerV375='yes';
      dot.addEventListener('click',()=>show(idx));
    });

    if(window.freshlyPromoTimer) clearInterval(window.freshlyPromoTimer);
    show(0);
    if(slides.length>1) window.freshlyPromoTimer=setInterval(()=>show(index+1),4200);
    window.freshlyBannerCarouselFix=()=>show(index);
  }

  function init(){
    bindMenuVisibility();
    setupCarousel();
    [300,900,1800,3200].forEach(ms=>setTimeout(()=>{bindMenuVisibility();setupCarousel();},ms));
    const obs=new MutationObserver(()=>{clearTimeout(window.__freshlyV375Timer);window.__freshlyV375Timer=setTimeout(()=>{bindMenuVisibility();setupCarousel();},120);});
    if(document.body) obs.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
