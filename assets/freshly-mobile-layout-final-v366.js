(function(){
  function isMobile(){
    return window.innerWidth <= 760;
  }

  function q(sel){ return document.querySelector(sel); }

  function firstBannerImage(slider){
    if(!slider) return '';
    const img = slider.querySelector('.promo-slide img, img');
    if(img && img.src) return img.src;
    const slide = slider.querySelector('.promo-slide');
    if(slide){
      const bg = getComputedStyle(slide).backgroundImage || '';
      const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if(m && m[1]) return m[1];
    }
    return '';
  }

  function fixLayout(){
    if(!isMobile()) return;

    const nav = q('.nav');
    const slider = q('.promo-slider,.freshly-promo-slider,.hero-slider,.banner-slider');
    const search = q('.freshly-app-search');
    const home = q('.freshly-mobile-home');

    if(nav && slider && slider.previousElementSibling !== nav){
      nav.insertAdjacentElement('afterend', slider);
    }

    if(slider && search && search.previousElementSibling !== slider){
      slider.insertAdjacentElement('afterend', search);
    }

    if(search && home && home.previousElementSibling !== search){
      search.insertAdjacentElement('afterend', home);
    } else if(slider && home && !search && home.previousElementSibling !== slider){
      slider.insertAdjacentElement('afterend', home);
    }

    if(slider){
      slider.classList.add('freshly-mobile-final-banner');
      slider.style.setProperty('display','block','important');
      slider.style.setProperty('margin','0','important');
      slider.style.setProperty('padding','0','important');
      slider.style.setProperty('min-height','0','important');
      slider.style.setProperty('height','auto','important');
      slider.style.setProperty('overflow','hidden','important');
      slider.style.setProperty('background','#f7fbfc','important');
    }

    const track = q('.promo-track,[data-promo-track]');
    if(track){
      track.style.setProperty('display','flex','important');
      track.style.setProperty('margin','0','important');
      track.style.setProperty('padding','0','important');
      track.style.setProperty('min-height','0','important');
      track.style.setProperty('align-items','stretch','important');
    }

    const slides = document.querySelectorAll('.promo-slide,.promo-slide.image-only,.promo-slide.backend-banner,.promo-slide.backend-banner.has-image');
    slides.forEach(slide => {
      slide.style.setProperty('position','relative','important');
      slide.style.setProperty('display','block','important');
      slide.style.setProperty('flex','0 0 100%','important');
      slide.style.setProperty('width','100%','important');
      slide.style.setProperty('height','270px','important');
      slide.style.setProperty('min-height','270px','important');
      slide.style.setProperty('max-height','270px','important');
      slide.style.setProperty('margin','0','important');
      slide.style.setProperty('padding','0','important');
      slide.style.setProperty('overflow','hidden','important');
      slide.style.setProperty('background-size','cover','important');
      slide.style.setProperty('background-position','center top','important');
      slide.style.setProperty('background-repeat','no-repeat','important');

      const hasImage = !!slide.querySelector('img') || (getComputedStyle(slide).backgroundImage || '') !== 'none';
      if(!hasImage){
        slide.style.setProperty('height','0','important');
        slide.style.setProperty('min-height','0','important');
        slide.style.setProperty('max-height','0','important');
        slide.style.setProperty('display','none','important');
      }
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
      img.style.setProperty('width','100%','important');
      img.style.setProperty('height','100%','important');
      img.style.setProperty('object-fit','cover','important');
      img.style.setProperty('object-position','center top','important');
      img.style.setProperty('display','block','important');
      img.style.setProperty('margin','0','important');
      img.style.setProperty('padding','0','important');
      img.style.setProperty('transform','none','important');
    });

    // Hide image-only text wrappers only; keep real text banners if they have no image.
    document.querySelectorAll('.promo-slide.image-only .banner-copy,.promo-slide.image-only .banner-content,.promo-slide.image-only .slide-content,.promo-slide.image-only .hero-content').forEach(el => {
      el.style.setProperty('display','none','important');
    });

    if(search){
      search.classList.add('freshly-search-below-banner');
      search.style.setProperty('position','relative','important');
      search.style.setProperty('top','auto','important');
      search.style.setProperty('margin','0','important');
      search.style.setProperty('z-index','40','important');
    }

    if(home){
      home.style.setProperty('margin-top','10px','important');
      home.style.setProperty('padding-top','0','important');
    }

    document.querySelectorAll('.promo-dots').forEach(dots => {
      dots.style.setProperty('bottom','8px','important');
      dots.style.setProperty('z-index','20','important');
    });
  }

  function init(){
    fixLayout();
    [100,300,600,1000,1600,2500,4000].forEach(ms => setTimeout(fixLayout, ms));

    const obs = new MutationObserver(() => fixLayout());
    obs.observe(document.body, {childList:true, subtree:true});

    window.addEventListener('resize', fixLayout);
    window.addEventListener('orientationchange', () => setTimeout(fixLayout, 400));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
