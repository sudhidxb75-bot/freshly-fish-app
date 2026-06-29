(function(){
  function mobile(){
    return window.innerWidth <= 760;
  }

  function px(n){ return String(n) + 'px'; }

  function forceBannerToTop(){
    if(!mobile()) return;

    const sliders = document.querySelectorAll('.promo-slider,.freshly-promo-slider,.hero-slider,.banner-slider');
    sliders.forEach(slider => {
      slider.style.setProperty('margin-top','0','important');
      slider.style.setProperty('padding-top','0','important');
      slider.style.setProperty('min-height','0','important');
      slider.style.setProperty('height','auto','important');
      slider.style.setProperty('overflow','hidden','important');
      slider.style.setProperty('background','transparent','important');
    });

    const tracks = document.querySelectorAll('.promo-track,[data-promo-track]');
    tracks.forEach(track => {
      track.style.setProperty('margin-top','0','important');
      track.style.setProperty('padding-top','0','important');
      track.style.setProperty('min-height','0','important');
      track.style.setProperty('align-items','flex-start','important');
      track.style.setProperty('overflow','hidden','important');
    });

    const slides = document.querySelectorAll('.promo-slide,.promo-slide.image-only,.promo-slide.backend-banner,.promo-slide.backend-banner.has-image');
    slides.forEach(slide => {
      slide.style.setProperty('margin-top','0','important');
      slide.style.setProperty('padding','0','important');
      slide.style.setProperty('padding-top','0','important');
      slide.style.setProperty('min-height','240px','important');
      slide.style.setProperty('height','240px','important');
      slide.style.setProperty('max-height','240px','important');
      slide.style.setProperty('overflow','hidden','important');
      slide.style.setProperty('display','block','important');
      slide.style.setProperty('align-items','flex-start','important');
      slide.style.setProperty('justify-content','flex-start','important');

      // For background-image banners
      const bg = getComputedStyle(slide).backgroundImage;
      if(bg && bg !== 'none'){
        slide.style.setProperty('background-size','cover','important');
        slide.style.setProperty('background-position','center top','important');
        slide.style.setProperty('background-repeat','no-repeat','important');
      }

      // Hide empty/text wrappers that reserve top area for image-only banners
      slide.querySelectorAll('.banner-copy,.banner-content,.slide-content,.hero-content,.banner-text,.slide-text').forEach(el => {
        if(slide.classList.contains('image-only')){
          el.style.setProperty('display','none','important');
        }
      });

      // Image link wrapper
      slide.querySelectorAll('.banner-image-link,a').forEach(link => {
        if(link.querySelector('img')){
          link.style.setProperty('display','block','important');
          link.style.setProperty('position','absolute','important');
          link.style.setProperty('inset','0','important');
          link.style.setProperty('width','100%','important');
          link.style.setProperty('height','100%','important');
          link.style.setProperty('overflow','hidden','important');
          link.style.setProperty('margin','0','important');
          link.style.setProperty('padding','0','important');
        }
      });

      // Actual image
      slide.querySelectorAll('img').forEach(img => {
        img.style.setProperty('position','absolute','important');
        img.style.setProperty('top','0','important');
        img.style.setProperty('left','0','important');
        img.style.setProperty('right','0','important');
        img.style.setProperty('bottom','auto','important');
        img.style.setProperty('width','100%','important');
        img.style.setProperty('height','100%','important');
        img.style.setProperty('min-height','100%','important');
        img.style.setProperty('max-height','none','important');
        img.style.setProperty('object-fit','cover','important');
        img.style.setProperty('object-position','center top','important');
        img.style.setProperty('transform','none','important');
        img.style.setProperty('margin','0','important');
        img.style.setProperty('padding','0','important');
        img.style.setProperty('display','block','important');
      });
    });

    // Dots should stay at bottom of the new banner frame
    document.querySelectorAll('.promo-dots').forEach(dots => {
      dots.style.setProperty('bottom','8px','important');
      dots.style.setProperty('z-index','10','important');
    });

    // Move the next home block closer to banner
    document.querySelectorAll('.freshly-mobile-home').forEach(home => {
      home.style.setProperty('margin-top','10px','important');
      home.style.setProperty('padding-top','0','important');
    });
  }

  function init(){
    forceBannerToTop();
    [100, 300, 700, 1200, 2000, 3500].forEach(ms => setTimeout(forceBannerToTop, ms));

    const obs = new MutationObserver(() => forceBannerToTop());
    obs.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class','style']});

    window.addEventListener('resize', forceBannerToTop);
    window.addEventListener('orientationchange', () => setTimeout(forceBannerToTop, 300));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
