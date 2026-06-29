
(function(){
function make(t,a,h){const n=document.createElement(t);Object.entries(a||{}).forEach(([k,v])=>k==='class'?n.className=v:n.setAttribute(k,v));if(h!==undefined)n.innerHTML=h;return n}

function buildSearch(){
  if(document.querySelector('.freshly-app-search'))return;
  const nav=document.querySelector('.nav'); if(!nav)return;
  const box=make('div',{class:'freshly-app-search'});
  box.innerHTML=`<div class="freshly-app-search-inner">
    <span class="search-icon">🔍</span>
    <input id="freshlyMobileSearch" type="search" placeholder="Search fish, meat, groceries...">
    <button class="cart-mini" type="button" data-open-cart aria-label="Open cart">🛒 <span data-cart-count>0</span></button>
  </div>`;
  nav.insertAdjacentElement('afterend',box);
  const orig=document.querySelector('#catalogSearch'),mob=box.querySelector('#freshlyMobileSearch');
  if(orig&&mob){mob.addEventListener('input',()=>{orig.value=mob.value;orig.dispatchEvent(new Event('input',{bubbles:true}))})}
}

function buildHome(){
  if(document.querySelector('.freshly-mobile-home'))return;
  const promo=document.querySelector('.promo-slider'); if(!promo)return;
  const s=make('section',{class:'freshly-mobile-home'});
  s.innerHTML=`<div class="freshly-mobile-section-title"><h2>Shop by category</h2><a href="#shop">View all</a></div>
  <div class="freshly-mobile-cats">
    <a class="freshly-mobile-cat" href="#shop"><span class="icon">🐟</span><span>Fish & Seafood</span></a>
    <a class="freshly-mobile-cat" href="#shop"><span class="icon">🍗</span><span>Fresh Meat</span></a>
    <a class="freshly-mobile-cat" href="#shop"><span class="icon">🥦</span><span>Fruits & Veg</span></a>
    <a class="freshly-mobile-cat" href="#shop"><span class="icon">🛒</span><span>Essentials</span></a>
  </div>
  <div class="freshly-mobile-section-title"><h2>Freshly benefits</h2></div>
  <div class="freshly-benefit-strip">
    <span class="benefit-chip">Freshness Delivered</span>
    <span class="benefit-chip">Nearby Hub</span>
    <span class="benefit-chip">UPI Payment</span>
    <span class="benefit-chip">Track Orders</span>
  </div>
  <div class="freshly-mobile-section-title"><h2>Quick actions</h2></div>
  <div class="freshly-quick-actions">
    <a href="track-order.html">📦 Track Order</a>
    <button type="button" data-install-app>📲 Install App</button>
    <a href="join-freshly.html">🤝 Join Freshly</a>
  </div>`;
  promo.insertAdjacentElement('afterend',s);
}

function buildMoreMenu(){
  if(document.querySelector('.freshly-more-menu'))return;
  const overlay=make('div',{class:'freshly-more-menu hidden',id:'freshlyMoreMenu'});
  overlay.innerHTML=`<div class="freshly-more-card">
    <div class="freshly-more-head">
      <strong>Freshly Menu</strong>
      <button type="button" data-close-more aria-label="Close">×</button>
    </div>
    <div class="freshly-more-grid">
      <a href="index.html#home">🏠 Home</a>
      <a href="index.html#shop">🧺 Shop</a>
      <button type="button" data-open-cart>🛒 Cart</button>
      <a href="track-order.html">📦 Track Order</a>
      <a href="join-freshly.html">🤝 Join Freshly</a>
      <a href="customer-portal.html">👤 Customer Login</a>
      <a href="hub-portal.html">🏪 Hub Portal</a>
      <a href="supplier-portal.html">🚚 Supplier Portal</a>
      <button type="button" data-install-app>📲 Install App</button>
      <a href="index.html#contact">☎️ Contact</a>
    </div>
  </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.add('hidden')});
  overlay.querySelector('[data-close-more]').onclick=()=>overlay.classList.add('hidden');
  overlay.querySelectorAll('a,button[data-open-cart],button[data-install-app]').forEach(x=>{
    x.addEventListener('click',()=>{ if(!x.hasAttribute('data-install-app')) overlay.classList.add('hidden'); });
  });
}

function buildBottom(){
  if(document.querySelector('.freshly-bottom-nav'))return;
  const n=make('nav',{class:'freshly-bottom-nav','aria-label':'Freshly mobile navigation'});
  n.innerHTML=`<a class="active" href="index.html#home"><span class="nav-icon">🏠</span><span>Home</span></a>
    <a href="index.html#shop"><span class="nav-icon">🧺</span><span>Shop</span></a>
    <button type="button" data-open-cart><span class="cart-count-badge" data-cart-count>0</span><span class="nav-icon">🛒</span><span>Cart</span></button>
    <a href="track-order.html"><span class="nav-icon">📦</span><span>Orders</span></a>
    <button type="button" data-open-more><span class="nav-icon">☰</span><span>Menu</span></button>`;
  document.body.appendChild(n);
  n.querySelector('[data-open-more]').onclick=()=>document.querySelector('#freshlyMoreMenu')?.classList.remove('hidden');
}

function addStaticInstallButton(){
  if(document.querySelector('.install-app-btn'))return;
  const b=make('button',{class:'btn btn-primary install-app-btn',type:'button','data-install-app':''},'📲 Install App');
  document.body.appendChild(b);
}

function sync(){
  let c='0';
  const src=[...document.querySelectorAll('[data-cart-count]')].find(x=>!x.closest('.freshly-bottom-nav')&&!x.closest('.freshly-app-search'));
  if(src)c=src.textContent||'0';
  document.querySelectorAll('.freshly-bottom-nav [data-cart-count],.freshly-app-search [data-cart-count]').forEach(x=>x.textContent=c);
}

function init(){
  buildSearch();
  buildHome();
  buildMoreMenu();
  buildBottom();
  addStaticInstallButton();
  setInterval(sync,1000);
  sync();
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
