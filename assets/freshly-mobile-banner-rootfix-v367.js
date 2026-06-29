(function(){
  function mobile(){
    return window.innerWidth <= 760;
  }

  function slideHasImage(slide){
    if(!slide) return false;
    if(slide.classList.contains('banner-image-error')) return false;
    const img = slide.querySelector('img');
    if(img){
      if(!img.complete) return true;
      return img.naturalWidth > 0;
    }
    const bg = getComputedStyle(slide).backgroundImage || '';
    return bg && bg !== 'none';
  }

  function rootFix(){
    if(!mobile()) return;

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

    if(!slider) return;

    const slides = Array.from(slider.querySelectorAll('.promo-slide'));
    const visibleSlides = slides.filter(slideHasImage);

    if(!visibleSlides.length){
      slider.style.setProperty('display','none','important');
      slider.classList.add('hidden');
      if(search){
        search.style.setProperty('position','relative','important');
        search.style.setProperty('top','auto','important');
      }
      return;
    }

    slider.classList.remove('hidden');
    slider.style.setProperty('display','block','important');
    slider.style.setProperty('height','270px','important');
    slider.style.setProperty('max-height','270px','important');
    slider.style.setProperty('min-height','0','important');
    slider.style.setProperty('margin','0','important');
    slider.style.setProperty('padding','0','important');
    slider.style.setProperty('overflow','hidden','important');
    slider.style.setProperty('background','#f7fbfc','important');
    slider.style.setProperty('border-radius','0 0 20px 20px','important');

    const track = slider.querySelector('.promo-track,[data-promo-track]');
    if(track){
      track.style.setProperty('display','flex','important');
      track.style.setProperty('height','270px','important');
      track.style.setProperty('margin','0','important');
      track.style.setProperty('padding','0','important');
      track.style.setProperty('align-items','stretch','important');
    }

    slides.forEach(slide => {
      const usable = slideHasImage(slide);
      slide.style.setProperty('position','relative','important');
      slide.style.setProperty('display', usable ? 'block' : 'none','important');
      slide.style.setProperty('flex', usable ? '0 0 100%' : '0 0 0','important');
      slide.style.setProperty('width', usable ? '100%' : '0','important');
      slide.style.setProperty('height', usable ? '270px' : '0','important');
      slide.style.setProperty('min-height', usable ? '270px' : '0','important');
      slide.style.setProperty('max-height', usable ? '270px' : '0','important');
      slide.style.setProperty('margin','0','important');
      slide.style.setProperty('padding','0','important');
      slide.style.setProperty('overflow','hidden','important');
      slide.style.setProperty('background-size','cover','important');
      slide.style.setProperty('background-position','center top','important');
      slide.style.setProperty('background-repeat','no-repeat','important');

      if(!usable) return;

      slide.querySelectorAll('.banner-image-link,a').forEach(link => {
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

      slide.querySelectorAll('img').forEach(img => {
        img.style.setProperty('position','absolute','important');
        img.style.setProperty('inset','0','important');
        img.style.setProperty('width','100%','important');
        img.style.setProperty('height','100%','important');
        img.style.setProperty('min-height','100%','important');
        img.style.setProperty('object-fit','cover','important');
        img.style.setProperty('object-position','center top','important');
        img.style.setProperty('display','block','important');
        img.style.setProperty('margin','0','important');
        img.style.setProperty('padding','0','important');
        img.style.setProperty('transform','none','important');
      });

      slide.querySelectorAll('.banner-copy,.banner-content,.slide-content,.hero-content').forEach(el=>{
        if(slide.classList.contains('image-only')) el.style.setProperty('display','none','important');
      });
    });

    if(search){
      search.style.setProperty('position','relative','important');
      search.style.setProperty('top','auto','important');
      search.style.setProperty('margin','0','important');
      search.style.setProperty('z-index','40','important');
    }
    if(home){
      home.style.setProperty('margin-top','10px','important');
      home.style.setProperty('padding-top','0','important');
    }

    const dots = Array.from(slider.querySelectorAll('[data-promo-dot]'));
    dots.forEach((dot, index) => {
      const slide = slides[index];
      dot.style.display = slideHasImage(slide) ? '' : 'none';
    });
    slider.querySelectorAll('.promo-dots').forEach(d => {
      d.style.setProperty('bottom','8px','important');
      d.style.setProperty('z-index','20','important');
    });
  }

  window.freshlyMobileBannerRootFix = rootFix;

  function init(){
    rootFix();
    [100,300,700,1200,2000,3500,5000].forEach(ms => setTimeout(rootFix, ms));
    const obs = new MutationObserver(() => rootFix());
    obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','src']});
    window.addEventListener('resize',rootFix);
    window.addEventListener('orientationchange',()=>setTimeout(rootFix,400));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
