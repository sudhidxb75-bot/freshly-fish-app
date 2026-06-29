(function(){
  function isMobile(){
    return window.innerWidth <= 760;
  }

  function bannerFirstLayout(){
    if(!isMobile()) return;

    const nav = document.querySelector('.nav');
    const slider = document.querySelector('.promo-slider,.freshly-promo-slider,.hero-slider,.banner-slider');
    const search = document.querySelector('.freshly-app-search');
    const home = document.querySelector('.freshly-mobile-home');

    if(nav && slider && slider.previousElementSibling !== nav){
      nav.insertAdjacentElement('afterend', slider);
    }

    if(slider && search && search.previousElementSibling !== slider){
      slider.insertAdjacentElement('afterend', search);
    }

    if(search && home && home.previousElementSibling !== search){
      search.insertAdjacentElement('afterend', home);
    }

    if(slider){
      slider.classList.add('freshly-banner-first-fixed');
      slider.style.setProperty('margin-top','0','important');
      slider.style.setProperty('padding-top','0','important');
      slider.style.setProperty('overflow','hidden','important');
      slider.style.setProperty('background','#f7fbfc','important');
    }

    const slides = document.querySelectorAll('.promo-slide,.promo-slide.image-only,.promo-slide.backend-banner,.promo-slide.backend-banner.has-image');
    slides.forEach(slide => {
      slide.style.setProperty('position','relative','important');
      slide.style.setProperty('height','270px','important');
      slide.style.setProperty('min-height','270px','important');
      slide.style.setProperty('max-height','270px','important');
      slide.style.setProperty('padding','0','important');
      slide.style.setProperty('margin','0','important');
      slide.style.setProperty('overflow','hidden','important');
      slide.style.setProperty('background-size','cover','important');
      slide.style.setProperty('background-position','center top','important');
      slide.style.setProperty('background-repeat','no-repeat','important');
    });

    document.querySelectorAll('.promo-slide .banner-image-link,.promo-slide a').forEach(link => {
      if(!link.querySelector('img')) return;
      link.style.setProperty('position','absolute','important');
      link.style.setProperty('inset','0','important');
      link.style.setProperty('display','block','important');
      link.style.setProperty('width','100%','important');
      link.style.setProperty('height','100%','important');
      link.style.setProperty('overflow','hidden','important');
      link.style.setProperty('margin','0','important');
      link.style.setProperty('padding','0','important');
    });

    document.querySelectorAll('.promo-slide img').forEach(img => {
      img.style.setProperty('position','absolute','important');
      img.style.setProperty('inset','0','important');
      img.style.setProperty('display','block','important');
      img.style.setProperty('width','100%','important');
      img.style.setProperty('height','100%','important');
      img.style.setProperty('min-height','100%','important');
      img.style.setProperty('max-height','none','important');
      img.style.setProperty('object-fit','cover','important');
      img.style.setProperty('object-position','center top','important');
      img.style.setProperty('transform','none','important');
      img.style.setProperty('margin','0','important');
      img.style.setProperty('padding','0','important');
    });

    document.querySelectorAll('.promo-dots').forEach(dots => {
      dots.style.setProperty('bottom','8px','important');
      dots.style.setProperty('z-index','20','important');
    });

    if(search){
      search.style.setProperty('position','relative','important');
      search.style.setProperty('top','auto','important');
      search.style.setProperty('margin-top','0','important');
      search.style.setProperty('z-index','40','important');
    }

    if(home){
      home.style.setProperty('margin-top','10px','important');
      home.style.setProperty('padding-top','0','important');
    }
  }

  function init(){
    bannerFirstLayout();
    [100, 300, 700, 1200, 2200, 3500].forEach(ms => setTimeout(bannerFirstLayout, ms));

    const obs = new MutationObserver(() => bannerFirstLayout());
    obs.observe(document.body, {childList:true, subtree:true});

    window.addEventListener('resize', bannerFirstLayout);
    window.addEventListener('orientationchange', () => setTimeout(bannerFirstLayout, 400));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
