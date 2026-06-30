(function(){
  const CATEGORY_LINKS = `<a href="index.html#shop" data-menu-cat="Fish & Seafood" data-mobile-category="Fish & Seafood">🐟 Fish & Seafood</a><a href="index.html#shop" data-menu-cat="Chicken" data-mobile-category="Chicken">🍗 Chicken</a><a href="index.html#shop" data-menu-cat="Mutton" data-mobile-category="Mutton">🥩 Mutton</a><a href="index.html#shop" data-menu-cat="Eggs" data-mobile-category="Eggs">🥚 Eggs</a><a href="index.html#shop" data-menu-cat="Fruits & Vegetables" data-mobile-category="Fruits & Vegetables">🥦 Fruits & Vegetables</a><a href="index.html#shop" data-menu-cat="Food" data-mobile-category="Food">🍱 Food</a><a href="index.html#shop" data-menu-cat="Groceries" data-mobile-category="Groceries">🍚 Groceries</a><a href="index.html#shop" data-menu-cat="Daily Essentials" data-mobile-category="Daily Essentials">🛒 Daily Essentials</a><a href="index.html#shop" data-menu-cat="Ready to Cook" data-mobile-category="Ready to Cook">🍳 Ready to Cook</a><a href="index.html#shop" data-menu-cat="Combo Packs" data-mobile-category="Combo Packs">🏷️ Combo Packs</a><a href="index.html#shop" data-menu-cat="Freshly Mart" data-mobile-category="Freshly Mart">🛍️ Freshly Mart</a>`;

  function isMobile(){
    return window.innerWidth <= 760;
  }

  function menu(){
    return document.querySelector('.nav .menu, .menu');
  }

  function toggleBtn(){
    return document.querySelector('.mobile-toggle, [data-menu-toggle], .menu-toggle');
  }

  function ensureCategories(){
    const m = menu();
    if(!m) return;

    let drop = [...m.querySelectorAll('.dropdown')].find(d => /Categories/i.test(d.textContent || ''));
    if(!drop){
      drop = document.createElement('div');
      drop.className = 'dropdown freshly-mobile-categories-dropdown';
      drop.innerHTML = '<button class="dropdown-btn" type="button" data-submenu-toggle>Categories ▾</button><div class="dropdown-panel" data-submenu-panel>' + CATEGORY_LINKS + '</div>';
      const shop = [...m.querySelectorAll('a')].find(a => /Shop/i.test(a.textContent || ''));
      if(shop) shop.insertAdjacentElement('afterend', drop);
      else m.insertBefore(drop, m.firstChild);
    } else {
      drop.classList.add('freshly-mobile-categories-dropdown');
      let btn = drop.querySelector('.dropdown-btn');
      let panel = drop.querySelector('.dropdown-panel, .dropdown-content, .dropdown-menu');
      if(!btn){
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'dropdown-btn';
        btn.textContent = 'Categories ▾';
        drop.prepend(btn);
      }
      btn.setAttribute('data-submenu-toggle','');
      if(!panel){
        panel = document.createElement('div');
        panel.className = 'dropdown-panel';
        drop.appendChild(panel);
      }
      panel.className = 'dropdown-panel';
      panel.setAttribute('data-submenu-panel','');
      panel.innerHTML = CATEGORY_LINKS;
    }
  }

  function openMenu(){
    const m = menu();
    const b = toggleBtn();
    if(!m) return;
    ensureCategories();
    m.classList.add('open','freshly-mobile-menu-open');
    m.removeAttribute('hidden');
    m.setAttribute('aria-hidden','false');
    document.body.classList.add('freshly-menu-open','freshly-mobile-nav-open');
    if(b) b.setAttribute('aria-expanded','true');

    const catDrop = m.querySelector('.freshly-mobile-categories-dropdown');
    if(catDrop){
      catDrop.classList.add('open');
      catDrop.querySelector('.dropdown-btn')?.setAttribute('aria-expanded','true');
    }
  }

  function closeMenu(){
    const m = menu();
    const b = toggleBtn();
    if(!m) return;
    m.classList.remove('open','show','active','freshly-mobile-menu-open');
    m.setAttribute('aria-hidden','true');
    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open');
    if(b) b.setAttribute('aria-expanded','false');
    m.querySelectorAll('.dropdown.open').forEach(d => {
      d.classList.remove('open');
      d.querySelector('.dropdown-btn')?.setAttribute('aria-expanded','false');
    });
  }

  function toggleMenu(e){
    if(!isMobile()) return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();

    const m = menu();
    if(!m) return;
    if(m.classList.contains('open') || m.classList.contains('freshly-mobile-menu-open')) closeMenu();
    else openMenu();
  }

  function openCategory(category){
    const term = String(category || '').trim();
    if(!term) return;
    closeMenu();
    if(window.freshlyCloseMobileOverlays) window.freshlyCloseMobileOverlays();
    if(window.freshlyOpenCategory){ window.freshlyOpenCategory(term); setTimeout(closeMenu, 60); return; }
    const shop = document.querySelector('#shop');
    if(shop) shop.scrollIntoView({behavior:'smooth', block:'start'});
    const search = document.querySelector('#catalogSearch');
    setTimeout(() => {
      const tabs = [...document.querySelectorAll('.tab,[data-category],[data-filter],button')];
      const c = term.toLowerCase();
      const target = tabs.find(t => {
        if(t.closest('.freshly-top-category-rail') || t.closest('.freshly-more-category-grid') || t.closest('.menu')) return false;
        const text = (t.textContent || '').trim().toLowerCase();
        const data = (t.dataset.category || t.dataset.filter || '').trim().toLowerCase();
        return text === c || data === c || text.includes(c) || c.includes(text);
      });
      if(target) target.click();
      else if(search){ search.value = term; search.dispatchEvent(new Event('input', {bubbles:true})); }
      closeMenu();
    }, 280);
  }

  function bind(){
    ensureCategories();

    const b = toggleBtn();
    const m = menu();

    if(b && b.dataset.mobileMenuV34 !== 'yes'){
      b.dataset.mobileMenuV34 = 'yes';
      b.setAttribute('aria-expanded','false');
      b.addEventListener('click', toggleMenu, true);
      b.addEventListener('touchend', toggleMenu, true);
    }

    if(m && m.dataset.mobileMenuV34 !== 'yes'){
      m.dataset.mobileMenuV34 = 'yes';

      m.addEventListener('click', e => {
        if(!isMobile()) return;

        const subBtn = e.target.closest('[data-submenu-toggle], .dropdown-btn');
        if(subBtn && subBtn.closest('.dropdown')){
          e.preventDefault();
          e.stopPropagation();
          const drop = subBtn.closest('.dropdown');
          const willOpen = !drop.classList.contains('open');
          m.querySelectorAll('.dropdown.open').forEach(d => {
            if(d !== drop){
              d.classList.remove('open');
              d.querySelector('.dropdown-btn')?.setAttribute('aria-expanded','false');
            }
          });
          drop.classList.toggle('open', willOpen);
          subBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
          return;
        }

        const cat = e.target.closest('[data-menu-cat], [data-mobile-category]');
        if(cat){
          e.preventDefault();
          e.stopPropagation();
          openCategory(cat.dataset.menuCat || cat.dataset.mobileCategory);
          return;
        }

        const link = e.target.closest('a');
        if(link) setTimeout(closeMenu, 120);
      }, true);
    }

    if(!document.body.dataset.mobileMenuOutsideV34){
      document.body.dataset.mobileMenuOutsideV34 = 'yes';
      document.addEventListener('click', e => {
        if(!isMobile()) return;
        const mNow = menu();
        const bNow = toggleBtn();
        if(document.body.classList.contains('freshly-mobile-nav-open') && mNow && !mNow.contains(e.target) && !(bNow && bNow.contains(e.target))){
          closeMenu();
        }
      }, true);

      document.addEventListener('keydown', e => {
        if(e.key === 'Escape') closeMenu();
      });

      window.addEventListener('resize', () => {
        if(!isMobile()) closeMenu();
      });
    }
  }

  function init(){
    bind();
    setTimeout(bind, 400);
    setTimeout(bind, 1200);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
