(function(){
function make(t,a,h){const n=document.createElement(t);Object.entries(a||{}).forEach(([k,v])=>k==='class'?n.className=v:n.setAttribute(k,v));if(h!==undefined)n.innerHTML=h;return n}
function greet(){let h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening'}
function getFreshlyCustomer(){try{return JSON.parse(localStorage.getItem('freshlyCustomer')||'null')||null}catch(e){return null}}
function getFreshlyCustomerName(){const c=getFreshlyCustomer();if(!c)return '';return c.Name||c.CustomerName||c.FullName||c.name||c.Phone||c.Mobile||'Customer'}
function buildSearch(){
  if(document.querySelector('.freshly-app-search'))return;
  const nav=document.querySelector('.nav');if(!nav)return;
  const box=make('div',{class:'freshly-app-search'});
  box.innerHTML='<div class="freshly-app-search-inner"><span class="search-icon">🔍</span><input id="freshlyMobileSearch" type="search" placeholder="Search fish, chicken, groceries..."><button class="cart-mini" type="button" data-open-cart>🛒 <span data-cart-count>0</span></button></div><div class="freshly-top-category-rail"><button data-mobile-category="Fish & Seafood">🐟 Fish & Seafood</button><button data-mobile-category="Chicken">🍗 Chicken</button><button data-mobile-category="Mutton">🥩 Mutton</button><button data-mobile-category="Eggs">🥚 Eggs</button><button data-mobile-category="Fruits & Vegetables">🥦 Fruits & Veg</button><button data-mobile-category="Food">🍱 Food</button><button data-mobile-category="Groceries">🍚 Groceries</button><button data-mobile-category="Daily Essentials">🛒 Essentials</button><button data-mobile-category="Ready to Cook">🍳 Ready to Cook</button><button data-mobile-category="Combo Packs">🏷️ Combo Packs</button><button data-mobile-category="Freshly Mart">🛍️ Freshly Mart</button></div>';
  const slider=document.querySelector('.promo-slider,.freshly-promo-slider,.hero-slider,.banner-slider');
  if(slider) slider.insertAdjacentElement('afterend',box);
  else nav.insertAdjacentElement('afterend',box);
  const o=document.querySelector('#catalogSearch'),m=box.querySelector('#freshlyMobileSearch');
  if(o&&m)m.addEventListener('input',()=>{o.value=m.value;o.dispatchEvent(new Event('input',{bubbles:true}))})
}

function buildTopAuth(){
  if(window.innerWidth>760)return;
  if(document.querySelector('.freshly-top-auth'))return;
  const navInner=document.querySelector('.nav-inner');if(!navInner)return;
  const menuBtn=document.querySelector('.mobile-toggle');
  const auth=make('button',{class:'freshly-top-auth',type:'button','aria-label':'Customer login'},'👤 <span class="freshly-top-auth-name">Login</span>');
  if(menuBtn&&menuBtn.parentNode===navInner)navInner.insertBefore(auth,menuBtn);else navInner.appendChild(auth);
  const pop=make('div',{class:'freshly-auth-popover hidden'});navInner.appendChild(pop);
  function render(){
    const name=getFreshlyCustomerName();
    if(name){
      const first=String(name).trim().split(/\s+/)[0]||'Customer';
      auth.innerHTML='👤 <span class="freshly-top-auth-name">'+first+'</span>';
      pop.innerHTML='<div class="freshly-auth-title">Hi, '+first+'</div><a href="customer-portal.html">My Account</a><a href="track-order.html">Track Order</a><button type="button" data-mobile-logout>Logout</button>';
    }else{
      auth.innerHTML='👤 <span class="freshly-top-auth-name">Login</span>';
      pop.innerHTML='<div class="freshly-auth-title">Customer Account</div><a href="customer-portal.html">Login with User ID</a><a href="customer-portal.html#signup">Sign Up</a><a href="track-order.html">Track Order</a>';
    }
    const logout=pop.querySelector('[data-mobile-logout]');
    if(logout)logout.onclick=()=>{localStorage.removeItem('freshlyCustomer');render();pop.classList.add('hidden')};
  }
  auth.addEventListener('click',e=>{e.stopPropagation();render();pop.classList.toggle('hidden')});
  pop.addEventListener('click',e=>e.stopPropagation());
  document.addEventListener('click',()=>pop.classList.add('hidden'));
  setInterval(render,1800);render();
}
function buildHome(){
  if(document.querySelector('.freshly-mobile-home'))return;
  const p=document.querySelector('.promo-slider');if(!p)return;
  const s=make('section',{class:'freshly-mobile-home'});
  s.innerHTML='<div class="freshly-welcome-card"><div><span>'+greet()+'</span><h2>Freshness delivered near you</h2><p>Shop from your nearby Freshly Hub.</p></div><button type="button" data-install-app>📲 Install</button></div><div class="freshly-mini-stats"><div><strong>Hub</strong><span>Local pickup</span></div><div><strong>UPI</strong><span>Easy payment</span></div><div><strong>Track</strong><span>Order status</span></div></div><div class="freshly-mobile-section-title"><h2>Shop by category</h2><a href="#shop">View all</a></div><div class="freshly-mobile-cats freshly-mobile-cats-v28"><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Fish & Seafood"><span class="icon">🐟</span><span>Fish & Seafood</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Chicken"><span class="icon">🍗</span><span>Chicken</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Mutton"><span class="icon">🥩</span><span>Mutton</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Eggs"><span class="icon">🥚</span><span>Eggs</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Fruits & Vegetables"><span class="icon">🥦</span><span>Fruits & Veg</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Food"><span class="icon">🍱</span><span>Food</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Groceries"><span class="icon">🍚</span><span>Groceries</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Daily Essentials"><span class="icon">🛒</span><span>Essentials</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Ready to Cook"><span class="icon">🍳</span><span>Ready to Cook</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Combo Packs"><span class="icon">🏷️</span><span>Combo Packs</span></a><a class="freshly-mobile-cat" href="#shop" data-mobile-category="Freshly Mart"><span class="icon">🛍️</span><span>Freshly Mart</span></a></div><div class="freshly-mobile-section-title"><h2>Quick actions</h2></div><div class="freshly-quick-actions freshly-quick-actions-v23"><a href="#shop"><b>🧺</b><span>Shop</span></a><button type="button" data-open-cart><b>🛒</b><span>Cart</span></button><a href="track-order.html"><b>📦</b><span>Track</span></a><a href="customer-portal.html"><b>👤</b><span>Login / Sign Up</span></a><button type="button" data-install-app><b>📲</b><span>Install</span></button></div><div class="freshly-mobile-section-title"><h2>Other items</h2></div><div class="freshly-mart-card" data-mobile-category="Freshly Mart"><div><b>🛍️</b><strong>Freshly Mart</strong><span>Home, fashion, stationery, electronics, wellness and local store products.</span></div><button type="button">Explore</button></div>';
  (document.querySelector('.freshly-app-search')||p).insertAdjacentElement('afterend',s);
}
function buildMoreMenu(){
  if(document.querySelector('.freshly-more-menu'))return;
  const o=make('div',{class:'freshly-more-menu hidden',id:'freshlyMoreMenu'});
  o.innerHTML='<div class="freshly-more-card"><div class="freshly-more-head"><div><strong>Freshly Menu</strong><span>Quick access</span></div><button type="button" data-close-more>×</button></div><div class="freshly-more-feature"><span>📲</span><div><strong>Install Freshly App</strong><small>Add to your phone home screen</small></div><button type="button" data-install-app>Install</button></div><div class="freshly-menu-section-label">Freshly Categories</div><div class="freshly-more-category-grid"><button data-mobile-category="Fish & Seafood">🐟 Fish & Seafood</button><button data-mobile-category="Chicken">🍗 Chicken</button><button data-mobile-category="Mutton">🥩 Mutton</button><button data-mobile-category="Eggs">🥚 Eggs</button><button data-mobile-category="Fruits & Vegetables">🥦 Fruits & Vegetables</button><button data-mobile-category="Food">🍱 Food</button><button data-mobile-category="Groceries">🍚 Groceries</button><button data-mobile-category="Daily Essentials">🛒 Daily Essentials</button><button data-mobile-category="Ready to Cook">🍳 Ready to Cook</button><button data-mobile-category="Combo Packs">🏷️ Combo Packs</button><button data-mobile-category="Freshly Mart">🛍️ Freshly Mart</button></div><div class="freshly-menu-section-label">Quick Links</div><div class="freshly-more-grid"><a href="index.html#home">🏠 Home</a><a href="index.html#shop">🧺 Shop</a><button type="button" data-open-cart>🛒 Cart</button><a href="track-order.html">📦 Track Order</a><a href="join-freshly.html">🤝 Join Freshly</a><a href="customer-portal.html">👤 Customer Login / Sign Up</a><button type="button" data-install-app>📲 Install App</button><a href="index.html#contact">☎️ Contact</a></div></div>';
  document.body.appendChild(o);
  o.onclick=e=>{if(e.target===o)o.classList.add('hidden')};
  o.querySelector('[data-close-more]').onclick=()=>o.classList.add('hidden');
}
function buildBottom(){
  if(document.querySelector('.freshly-bottom-nav'))return;
  const n=make('nav',{class:'freshly-bottom-nav'});
  n.innerHTML='<a class="active" href="index.html#home"><span class="nav-icon">🏠</span><span>Home</span></a><a href="index.html#shop"><span class="nav-icon">🧺</span><span>Shop</span></a><button type="button" data-open-cart><span class="cart-count-badge" data-cart-count>0</span><span class="nav-icon">🛒</span><span>Cart</span></button><a href="track-order.html"><span class="nav-icon">📦</span><span>Orders</span></a><button type="button" data-open-more><span class="nav-icon">☰</span><span>Menu</span></button>';
  document.body.appendChild(n);
  n.querySelector('[data-open-more]').onclick=()=>document.querySelector('#freshlyMoreMenu')?.classList.remove('hidden');
}
function openCategory(category){
  const term=String(category||'').trim();if(!term)return;
  if(window.freshlyOpenCategory){window.freshlyOpenCategory(term);return;}
  if(term==='Freshly Mart'){localStorage.setItem('freshlyMartRequested','yes')}
  const shop=document.querySelector('#shop');if(shop)shop.scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>{
    const tabs=[...document.querySelectorAll('.tab,[data-category],[data-filter],button')];
    const target=tabs.find(t=>{const text=(t.textContent||'').trim().toLowerCase();const data=(t.dataset.category||t.dataset.filter||'').trim().toLowerCase();const c=term.toLowerCase();return text===c||data===c||text.includes(c)||c.includes(text)});
    if(target&&!target.closest('.freshly-top-category-rail')&&!target.closest('.freshly-more-category-grid')){target.click();return}
    const search=document.querySelector('#catalogSearch');if(search){search.value=term;search.dispatchEvent(new Event('input',{bubbles:true}))}
  },260);
  document.querySelector('#freshlyMoreMenu')?.classList.add('hidden');
}
function installBtn(){if(document.querySelector('.install-app-btn'))return;document.body.appendChild(make('button',{class:'btn btn-primary install-app-btn',type:'button','data-install-app':''},'📲 Install App'))}
function topBtn(){if(document.querySelector('.freshly-scroll-top'))return;const b=make('button',{class:'freshly-scroll-top hidden',type:'button'},'↑');document.body.appendChild(b);b.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});window.addEventListener('scroll',()=>b.classList.toggle('hidden',scrollY<500))}
function sync(){let c='0';let s=[...document.querySelectorAll('[data-cart-count]')].find(x=>!x.closest('.freshly-bottom-nav')&&!x.closest('.freshly-app-search'));if(s)c=s.textContent||'0';document.querySelectorAll('.freshly-bottom-nav [data-cart-count],.freshly-app-search [data-cart-count]').forEach(x=>x.textContent=c)}
function init(){
  buildSearch();buildTopAuth();buildHome();buildMoreMenu();buildBottom();installBtn();topBtn();
  document.addEventListener('click',e=>{const cat=e.target.closest('[data-mobile-category]');if(cat){e.preventDefault();openCategory(cat.dataset.mobileCategory)}});
  setInterval(sync,1000);sync();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();


/* Freshly Mobile App V2.9 - click-to-open top submenu */
(function(){
  function openCategoryFromTop(category){
    const term = String(category || '').trim();
    if(!term) return;
    if(window.freshlyOpenCategory){ window.freshlyOpenCategory(term); return; }
    const shop = document.querySelector('#shop');
    if(shop) shop.scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(() => {
      const tabs = [...document.querySelectorAll('.tab,[data-category],[data-filter],button')];
      const target = tabs.find(t => {
        if(t.closest('.freshly-top-category-rail') || t.closest('.freshly-more-category-grid') || t.closest('.menu')) return false;
        const text = (t.textContent || '').trim().toLowerCase();
        const data = (t.dataset.category || t.dataset.filter || '').trim().toLowerCase();
        const c = term.toLowerCase();
        return text === c || data === c || text.includes(c) || c.includes(text);
      });
      if(target) target.click();
      else {
        const search = document.querySelector('#catalogSearch');
        if(search){ search.value = term; search.dispatchEvent(new Event('input', {bubbles:true})); }
      }
    }, 260);
  }

  function closeMobileMenu(){
    const menu = document.querySelector('.menu');
    if(menu){
      menu.classList.remove('open','show','active');
      menu.style.display = '';
      menu.style.visibility = '';
    }
    document.querySelectorAll('.menu .dropdown.open').forEach(d => d.classList.remove('open'));
    document.body.classList.remove('freshly-menu-open');
  }

  function initTopSubmenus(){
    document.querySelectorAll('.menu .dropdown').forEach(drop => {
      const btn = drop.querySelector('.dropdown-btn');
      const panel = drop.querySelector('.dropdown-panel,.dropdown-content,.dropdown-menu');
      if(!btn || !panel) return;

      btn.setAttribute('type','button');
      btn.setAttribute('aria-expanded', drop.classList.contains('open') ? 'true' : 'false');

      if(btn.dataset.submenuBound === 'yes') return;
      btn.dataset.submenuBound = 'yes';

      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        const willOpen = !drop.classList.contains('open');
        document.querySelectorAll('.menu .dropdown.open').forEach(d => {
          if(d !== drop){
            d.classList.remove('open');
            d.querySelector('.dropdown-btn')?.setAttribute('aria-expanded','false');
          }
        });

        drop.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        document.body.classList.add('freshly-menu-open');
      });
    });

    document.querySelectorAll('.menu [data-menu-cat], .menu [data-mobile-category]').forEach(link => {
      if(link.dataset.menuCatBound === 'yes') return;
      link.dataset.menuCatBound = 'yes';
      link.addEventListener('click', e => {
        const cat = link.dataset.menuCat || link.dataset.mobileCategory;
        if(cat){
          e.preventDefault();
          openCategoryFromTop(cat);
          setTimeout(closeMobileMenu, 150);
        }
      });
    });
  }

  function autoOpenCategoriesWhenMenuOpens(){
    const menu = document.querySelector('.menu');
    if(!menu) return;
    const observer = new MutationObserver(() => {
      const isOpen = menu.classList.contains('open') || menu.classList.contains('show') || menu.classList.contains('active') || getComputedStyle(menu).display !== 'none';
      if(isOpen && window.innerWidth <= 760){
        const catDrop = [...menu.querySelectorAll('.dropdown')].find(d => /Categories/i.test(d.textContent || ''));
        if(catDrop && !catDrop.classList.contains('open')){
          catDrop.classList.add('open');
          catDrop.querySelector('.dropdown-btn')?.setAttribute('aria-expanded','true');
        }
      }
    });
    observer.observe(menu, {attributes:true, attributeFilter:['class','style']});
  }

  function init(){
    initTopSubmenus();
    autoOpenCategoriesWhenMenuOpens();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();


(function(){
  function syncCheckoutAuthMode(form){
    if(!form) return;
    const mode = form.querySelector('input[name="AuthMode"]:checked')?.value || 'Login';
    const signup = mode === 'Signup';
    form.querySelectorAll('[data-auth-login-field]').forEach(el=>el.classList.toggle('hidden', signup));
    form.querySelectorAll('[data-auth-signup-field]').forEach(el=>el.classList.toggle('hidden', !signup));
    const name = form.querySelector('input[name="Name"]');
    const phone = form.querySelector('input[name="Phone"]');
    const user = form.querySelector('input[name="UserID"]');
    const pass = form.querySelector('input[name="Password"]');
    const signupPass = form.querySelector('input[name="SignupPassword"]');
    if(signup){
      if(name) name.required = true;
      if(phone) phone.required = true;
      if(user) user.required = false;
      if(pass) pass.required = false;
      if(signupPass) signupPass.required = true;
    }else{
      if(name) name.required = false;
      if(phone) phone.required = false;
      if(user) user.required = true;
      if(pass) pass.required = true;
      if(signupPass) signupPass.required = false;
    }
  }
  function initCheckoutAuthTabs(){
    const form = document.querySelector('#checkoutLoginForm');
    if(!form) return;
    form.addEventListener('change', e=>{
      if(e.target.name === 'AuthMode') syncCheckoutAuthMode(form);
      if(e.target.name === 'SignupPassword'){
        const pass = form.querySelector('input[name="Password"]');
        if(pass && form.querySelector('input[name="AuthMode"]:checked')?.value === 'Signup') pass.value = e.target.value;
      }
    });
    form.addEventListener('submit', ()=>{
      const signupPass = form.querySelector('input[name="SignupPassword"]');
      const pass = form.querySelector('input[name="Password"]');
      if(signupPass && pass && form.querySelector('input[name="AuthMode"]:checked')?.value === 'Signup') pass.value = signupPass.value;
    }, true);
    syncCheckoutAuthMode(form);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCheckoutAuthTabs);
  else initCheckoutAuthTabs();
})();


/* Freshly Desktop + Mobile V3.1 - desktop customer login and category submenu */
(function(){
  function getCustomer(){
    try{return JSON.parse(localStorage.getItem('freshlyCustomer')||'null')||null}catch(e){return null}
  }

  function customerName(){
    const c=getCustomer();
    if(!c)return '';
    return c.Name||c.CustomerName||c.FullName||c.name||c.Phone||c.Mobile||'Customer';
  }

  function buildDesktopAuth(){
    const navInner=document.querySelector('.nav-inner');
    if(!navInner || document.querySelector('.freshly-desktop-auth')) return;

    const auth=document.createElement('button');
    auth.className='freshly-desktop-auth';
    auth.type='button';
    auth.setAttribute('aria-label','Customer login');
    navInner.appendChild(auth);

    const pop=document.createElement('div');
    pop.className='freshly-desktop-auth-popover hidden';
    navInner.appendChild(pop);

    function render(){
      const name=customerName();
      if(name){
        const first=String(name).trim().split(/\s+/)[0]||'Customer';
        auth.innerHTML='<span>'+first+'</span>';
        pop.innerHTML='<div class="freshly-auth-title">Hi, '+first+'</div><a href="customer-portal.html">My Account</a><a href="track-order.html">Track Order</a><button type="button" data-desktop-logout>Logout</button>';
      }else{
        auth.innerHTML='<span>Login</span>';
        pop.innerHTML='<div class="freshly-auth-title">Customer Account</div><a href="customer-portal.html">Login with User ID</a><a href="customer-portal.html#signup">Sign Up</a><a href="track-order.html">Track Order</a>';
      }
      const logout=pop.querySelector('[data-desktop-logout]');
      if(logout){
        logout.onclick=function(){
          localStorage.removeItem('freshlyCustomer');
          render();
          pop.classList.add('hidden');
        };
      }
    }

    auth.addEventListener('click',function(e){
      e.stopPropagation();
      render();
      pop.classList.toggle('hidden');
    });

    pop.addEventListener('click',function(e){e.stopPropagation()});
    document.addEventListener('click',function(){pop.classList.add('hidden')});
    setInterval(render,2000);
    render();
  }

  function openCategory(category){
    const term=String(category||'').trim();
    if(!term)return;
    const shop=document.querySelector('#shop');
    if(shop) shop.scrollIntoView({behavior:'smooth',block:'start'});

    setTimeout(function(){
      const tabs=[...document.querySelectorAll('.tab,[data-category],[data-filter],button')];
      const target=tabs.find(function(t){
        if(t.closest('.freshly-top-category-rail')||t.closest('.freshly-more-category-grid')||t.closest('.menu')) return false;
        const text=(t.textContent||'').trim().toLowerCase();
        const data=(t.dataset.category||t.dataset.filter||'').trim().toLowerCase();
        const c=term.toLowerCase();
        return text===c||data===c||text.includes(c)||c.includes(text);
      });
      if(target){target.click();return;}
      const search=document.querySelector('#catalogSearch');
      if(search){
        search.value=term;
        search.dispatchEvent(new Event('input',{bubbles:true}));
      }
    },260);
  }

  function initCategorySubmenus(){
    document.querySelectorAll('.freshly-desktop-categories, .menu .dropdown').forEach(function(drop){
      const btn=drop.querySelector('.dropdown-btn');
      const panel=drop.querySelector('.dropdown-panel');
      if(!btn||!panel||btn.dataset.desktopSubmenuBound==='yes') return;

      btn.dataset.desktopSubmenuBound='yes';
      btn.setAttribute('aria-expanded','false');

      btn.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();

        const open=!drop.classList.contains('open');
        document.querySelectorAll('.dropdown.open').forEach(function(d){
          if(d!==drop){
            d.classList.remove('open');
            d.querySelector('.dropdown-btn')?.setAttribute('aria-expanded','false');
          }
        });

        drop.classList.toggle('open',open);
        btn.setAttribute('aria-expanded',open?'true':'false');
      });
    });

    document.querySelectorAll('[data-menu-cat]').forEach(function(link){
      if(link.dataset.desktopMenuCatBound==='yes') return;
      link.dataset.desktopMenuCatBound='yes';
      link.addEventListener('click',function(e){
        e.preventDefault();
        openCategory(link.dataset.menuCat||link.dataset.mobileCategory);
        document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
      });
    });

    document.addEventListener('click',function(){
      document.querySelectorAll('.dropdown.open').forEach(d=>d.classList.remove('open'));
    });
  }

  function init(){
    buildDesktopAuth();
    initCategorySubmenus();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
