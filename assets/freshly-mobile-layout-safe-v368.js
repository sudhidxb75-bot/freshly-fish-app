(function(){
  let running = false;
  let lastRun = 0;

  function isMobile(){
    return window.innerWidth <= 760;
  }

  function usableSlide(slide){
    if(!slide || slide.classList.contains('banner-image-error')) return false;
    const img = slide.querySelector('img');
    if(img){
      if(!img.complete) return true;
      return img.naturalWidth > 0;
    }
    const bg = getComputedStyle(slide).backgroundImage || '';
    return bg && bg !== 'none';
  }

  function applyLayout(){
    if(!isMobile()) return;
    const now = Date.now();
    if(running || now - lastRun < 120) return;
    running = true;
    lastRun = now;

    requestAnimationFrame(function(){
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
        const slides = Array.from(slider.querySelectorAll('.promo-slide'));
        const visibleSlides = slides.filter(usableSlide);

        if(!visibleSlides.length){
          const track = slider.querySelector('.promo-track,[data-promo-track]');
          const waitingForBackendBanners = track && !track.classList.contains('freshly-banner-track-ready');
          if(waitingForBackendBanners){
            slider.classList.remove('hidden');
            slider.style.display = 'block';
            slider.style.height = '270px';
            slider.style.maxHeight = '270px';
            slider.style.minHeight = '0';
            slider.style.margin = '0';
            slider.style.padding = '0';
            slider.style.overflow = 'hidden';
            slider.style.background = '#f7fbfc';
            slider.style.borderRadius = '0 0 20px 20px';
          }else{
            slider.classList.add('hidden');
            slider.style.display = 'none';
          }
        }else{
          slider.classList.remove('hidden');
          slider.style.display = 'block';
          slider.style.height = '270px';
          slider.style.maxHeight = '270px';
          slider.style.minHeight = '0';
          slider.style.margin = '0';
          slider.style.padding = '0';
          slider.style.overflow = 'hidden';
          slider.style.background = '#f7fbfc';
          slider.style.borderRadius = '0 0 20px 20px';
        }

        const track = slider.querySelector('.promo-track,[data-promo-track]');
        if(track){
          track.style.display = 'flex';
          track.style.height = visibleSlides.length ? '270px' : '0';
          track.style.margin = '0';
          track.style.padding = '0';
          track.style.alignItems = 'stretch';
        }

        slides.forEach(function(slide){
          const show = usableSlide(slide);
          slide.style.display = show ? 'block' : 'none';
          slide.style.flex = show ? '0 0 100%' : '0 0 0';
          slide.style.width = show ? '100%' : '0';
          slide.style.height = show ? '270px' : '0';
          slide.style.minHeight = show ? '270px' : '0';
          slide.style.maxHeight = show ? '270px' : '0';
          slide.style.margin = '0';
          slide.style.padding = '0';
          slide.style.overflow = 'hidden';
          slide.style.position = 'relative';
          slide.style.backgroundSize = 'cover';
          slide.style.backgroundPosition = 'center top';
          slide.style.backgroundRepeat = 'no-repeat';

          if(!show) return;

          slide.querySelectorAll('.banner-image-link,a').forEach(function(link){
            if(!link.querySelector('img')) return;
            link.style.position = 'absolute';
            link.style.inset = '0';
            link.style.display = 'block';
            link.style.width = '100%';
            link.style.height = '100%';
            link.style.overflow = 'hidden';
            link.style.margin = '0';
            link.style.padding = '0';
          });

          slide.querySelectorAll('img').forEach(function(img){
            img.style.position = 'absolute';
            img.style.inset = '0';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.minHeight = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center top';
            img.style.display = 'block';
            img.style.margin = '0';
            img.style.padding = '0';
            img.style.transform = 'none';

            if(img.dataset.safeBannerBound !== 'yes'){
              img.dataset.safeBannerBound = 'yes';
              img.addEventListener('load', scheduleLayout, {once:false});
              img.addEventListener('error', function(){
                const s = img.closest('.promo-slide');
                if(s) s.classList.add('banner-image-error');
                scheduleLayout();
              }, {once:false});
            }
          });

          if(slide.classList.contains('image-only')){
            slide.querySelectorAll('.banner-copy,.banner-content,.slide-content,.hero-content').forEach(function(el){
              el.style.display = 'none';
            });
          }
        });

        slider.querySelectorAll('.promo-dots').forEach(function(d){
          d.style.bottom = '8px';
          d.style.zIndex = '20';
        });
      }

      if(search){
        search.style.position = 'relative';
        search.style.top = 'auto';
        search.style.margin = '0';
        search.style.zIndex = '40';
      }

      if(home){
        home.style.marginTop = '10px';
        home.style.paddingTop = '0';
      }

      running = false;
    });
  }

  function scheduleLayout(){
    window.clearTimeout(window.__freshlyLayoutSafeTimer);
    window.__freshlyLayoutSafeTimer = window.setTimeout(applyLayout, 80);
  }

  function init(){
    applyLayout();
    [200,600,1200,2500].forEach(function(ms){ setTimeout(applyLayout, ms); });

    // Observe only added/removed nodes, not style/class attributes, to avoid mobile freezing loops.
    const observer = new MutationObserver(scheduleLayout);
    observer.observe(document.body, {childList:true, subtree:true});

    window.addEventListener('resize', scheduleLayout);
    window.addEventListener('orientationchange', function(){ setTimeout(applyLayout, 300); });
  }

  window.freshlyMobileSafeLayout = scheduleLayout;
  window.freshlyMobileBannerRootFix = scheduleLayout;

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
