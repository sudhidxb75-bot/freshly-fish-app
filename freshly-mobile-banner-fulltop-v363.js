(function(){
  function isMobile(){
    return window.innerWidth <= 760;
  }

  function forceBannerTop(){
    if(!isMobile()) return;

    const sliders = document.querySelectorAll('.promo-slider,.freshly-promo-slider,.hero-slider,.banner-slider');
    sliders.forEach(slider => {
      slider.style.marginTop = '0';
      slider.style.paddingTop = '0';
      slider.style.overflow = 'hidden';
    });

    const tracks = document.querySelectorAll('.promo-track,[data-promo-track]');
    tracks.forEach(track => {
      track.style.marginTop = '0';
      track.style.paddingTop = '0';
      track.style.alignItems = 'flex-start';
    });

    const slides = document.querySelectorAll('.promo-slide,.promo-slide.image-only,.promo-slide.backend-banner,.promo-slide.backend-banner.has-image');
    slides.forEach(slide => {
      slide.style.marginTop = '0';
      slide.style.paddingTop = '0';
      slide.style.overflow = 'hidden';
      slide.style.alignItems = 'flex-start';
      slide.style.justifyContent = 'flex-start';
      slide.style.backgroundPosition = 'center -115px';
      slide.style.backgroundSize = 'cover';
      slide.style.backgroundRepeat = 'no-repeat';

      const hasImageOnly = slide.classList.contains('image-only') || slide.querySelector('img');
      if(hasImageOnly){
        slide.style.height = '320px';
        slide.style.minHeight = '320px';
        slide.style.maxHeight = '320px';
      }
    });

    const imageLinks = document.querySelectorAll('.promo-slide.image-only .banner-image-link,.promo-slide .banner-image-link');
    imageLinks.forEach(link => {
      link.style.display = 'block';
      link.style.width = '100%';
      link.style.height = '100%';
      link.style.overflow = 'hidden';
      link.style.margin = '0';
      link.style.padding = '0';
    });

    const imgs = document.querySelectorAll('.promo-slide.image-only img,.promo-slide.backend-banner img,.promo-slide.has-image img,.promo-slide img');
    imgs.forEach(img => {
      img.style.display = 'block';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.minHeight = '440px';
      img.style.maxHeight = 'none';
      img.style.margin = '0';
      img.style.padding = '0';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center top';
      img.style.transform = 'translateY(-115px)';
      img.style.transformOrigin = 'center top';
    });
  }

  function init(){
    forceBannerTop();
    setTimeout(forceBannerTop, 300);
    setTimeout(forceBannerTop, 900);
    setTimeout(forceBannerTop, 1800);
    setTimeout(forceBannerTop, 3000);

    const observer = new MutationObserver(() => forceBannerTop());
    observer.observe(document.body, {childList:true, subtree:true, attributes:true, attributeFilter:['class','style']});

    window.addEventListener('resize', forceBannerTop);
    window.addEventListener('orientationchange', () => setTimeout(forceBannerTop, 400));
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
