(function(){
  const cfg = window.FRESHLY_CONFIG || {};
  const currency = cfg.CURRENCY || '₹';
  const state = {
    products: [], categories: [], districts: [], hubs: [], areas: [], slots: [], districtPricing: [], banners: [], countries: [], settings: {},
    selectedCategory: 'all', selectedCountry: localStorage.getItem('freshlyCountry') || cfg.DEFAULT_COUNTRY || 'India', selectedDistrict: localStorage.getItem('freshlyDistrict') || cfg.DEFAULT_DISTRICT_ID || '', selectedPincode: localStorage.getItem('freshlyPincode') || cfg.DEFAULT_PINCODE || '', selectedHub: localStorage.getItem('freshlyHub') || '',
    cart: load('freshlyCart', []), customer: load('freshlyCustomer', null), admin: load('freshlyAdminSession', null)
  };
  const demo = {
    settings:{BRAND_NAME:'Freshly',UPI_ID:'freshly@upi'},
    countries:[{CountryID:'IN',CountryName:'India',Status:'Active'},{CountryID:'AE',CountryName:'United Arab Emirates',Status:'Active'}],
    banners:[
      {BannerID:'BAN001',Title:'Today’s Fresh Offer',Subtitle:'Fresh Fish & Seafood, meat and essentials delivered through your nearby hub.',ImageURL:'',ButtonText:'Shop Now',ButtonLink:'#shop',SortOrder:1,Status:'Active',DisplayMode:'OverlayText'},
      {BannerID:'BAN002',Title:'Become a Freshly Hub Partner',Subtitle:'Start earning from your local area with low investment and strong support.',ImageURL:'assets/images/banner-hub-partner-earnings.png',ButtonText:'Register Now',ButtonLink:'join-freshly.html',SortOrder:2,Status:'Active',DisplayMode:'ImageOnly'},
      {BannerID:'BAN003',Title:'Register as Freshly Supplier',Subtitle:'Supply to Freshly and grow with organized demand.',ImageURL:'assets/images/banner-supplier.png',ButtonText:'Register as Supplier',ButtonLink:'join-freshly.html#supplier',SortOrder:3,Status:'Active',DisplayMode:'ImageOnly'}
    ],
    districts:[{DistrictID:'FLY-DST-000001',DistrictName:'Kozhikode',State:'Kerala',Status:'Active'},{DistrictID:'FLY-DST-000002',DistrictName:'Malappuram',State:'Kerala',Status:'Coming Soon'}],
    categories:[
      {CategoryID:'CAT-FISHSEA',Name:'Fish & Seafood',SortOrder:1,Status:'Active'},
      {CategoryID:'CAT-CHICKEN',Name:'Chicken',SortOrder:2,Status:'Active'},
      {CategoryID:'CAT-MUTTON',Name:'Mutton',SortOrder:3,Status:'Active'},
      {CategoryID:'CAT-EGGS',Name:'Eggs',SortOrder:4,Status:'Active'},
      {CategoryID:'CAT-FV',Name:'Fruits & Vegetables',SortOrder:5,Status:'Active'},
      {CategoryID:'CAT-GROCERY',Name:'Groceries',SortOrder:6,Status:'Active'},
      {CategoryID:'CAT-ESSENTIALS',Name:'Daily Essentials',SortOrder:7,Status:'Active'},
      {CategoryID:'CAT-READY',Name:'Ready to Cook',SortOrder:8,Status:'Active'},
      {CategoryID:'CAT-COMBO',Name:'Combo Packs',SortOrder:9,Status:'Active'}
    ],
    products:[
      {ProductID:'FLY-PRD-000001',SKU:'FISH-MATHI-500',Name:'Fresh Sardine / Mathi',CategoryID:'CAT-FISHSEA',PackSize:'Price per kg',Description:'Fresh sardine cleaned on request and packed for same-day hub dispatch.',FreshnessNote:'Freshly sourced and quality checked before packing.',Unit:'kg',PriceBasis:'Per Kg',BaseUnit:'kg',BasePrice:220,MinimumQty:0.5,MaximumQty:5,QtyStep:0.5,AllowedQtyOptions:'0.5,1,1.5,2,2.5,3,4,5',DefaultQty:0.5,Price:220,MRP:260,StockQty:50,StockStatus:'Available',ImageURL:'',ApprovalStatus:'Approved',WebsiteStatus:'Active',CleaningAvailable:'Yes',CuttingAvailable:'Yes',MarinationAvailable:'No'},
      {ProductID:'FLY-PRD-000002',SKU:'FISH-SEER',Name:'Seer Fish Slices',CategoryID:'CAT-FISHSEA',PackSize:'Price per kg',Description:'Premium seer fish slices suitable for fry and curry.',FreshnessNote:'Limited daily stock based on fresh arrival.',Unit:'kg',PriceBasis:'Per Kg',BaseUnit:'kg',BasePrice:780,MinimumQty:0.5,MaximumQty:5,QtyStep:0.5,AllowedQtyOptions:'0.5,1,1.5,2,2.5,3,4,5',DefaultQty:0.5,Price:780,MRP:850,StockQty:12,StockStatus:'Limited',ImageURL:'',ApprovalStatus:'Approved',WebsiteStatus:'Active',CleaningAvailable:'Yes',CuttingAvailable:'Yes',MarinationAvailable:'Yes'},
      {ProductID:'FLY-PRD-000003',SKU:'CHICK-CURRY',Name:'Chicken Curry Cut',CategoryID:'CAT-CHICKEN',PackSize:'Price per kg',Description:'Fresh chicken curry cut, packed after quality check.',FreshnessNote:'Freshly processed and packed after quality check.',Unit:'kg',PriceBasis:'Per Kg',BaseUnit:'kg',BasePrice:240,MinimumQty:0.5,MaximumQty:5,QtyStep:0.5,AllowedQtyOptions:'0.5,1,1.5,2,3,5',DefaultQty:1,Price:240,MRP:270,StockQty:40,StockStatus:'Available',ImageURL:'',ApprovalStatus:'Approved',WebsiteStatus:'Active',CleaningAvailable:'No',CuttingAvailable:'Yes',MarinationAvailable:'Yes'},
      {ProductID:'FLY-PRD-000004',SKU:'VEG-COMBO',Name:'Vegetable Combo',CategoryID:'CAT-FV',PackSize:'Per combo',Description:'Assorted daily vegetable combo for home cooking.',FreshnessNote:'Availability depends on fresh daily procurement.',Unit:'combo',PriceBasis:'Per Combo',BaseUnit:'combo',BasePrice:199,MinimumQty:1,MaximumQty:5,QtyStep:1,AllowedQtyOptions:'1,2,3,4,5',DefaultQty:1,Price:199,MRP:230,StockQty:30,StockStatus:'Available',ImageURL:'',ApprovalStatus:'Approved',WebsiteStatus:'Active',CleaningAvailable:'No',CuttingAvailable:'No',MarinationAvailable:'No'}
    ],
    districtPricing:[{DistrictID:'FLY-DST-000001',ProductID:'FLY-PRD-000001',PriceBasis:'Per Kg',BaseUnit:'kg',SellingPrice:220,OfferPrice:200,MRP:260,StockQty:50,Status:'Active'},{DistrictID:'FLY-DST-000001',ProductID:'FLY-PRD-000002',PriceBasis:'Per Kg',BaseUnit:'kg',SellingPrice:780,OfferPrice:'',MRP:850,StockQty:12,Status:'Active'},{DistrictID:'FLY-DST-000001',ProductID:'FLY-PRD-000003',PriceBasis:'Per Kg',BaseUnit:'kg',SellingPrice:240,OfferPrice:'',MRP:270,StockQty:40,Status:'Active'},{DistrictID:'FLY-DST-000001',ProductID:'FLY-PRD-000004',PriceBasis:'Per Combo',BaseUnit:'combo',SellingPrice:199,OfferPrice:'',MRP:230,StockQty:30,Status:'Active'}],
    hubs:[{HubID:'FLY-LHB-000001',DistrictID:'FLY-DST-000001',HubName:'Kunnamangalam Hub',Area:'Kunnamangalam / Peringolam',Pincode:'673571',PickupAvailable:'Yes',HomeDeliveryAvailable:'Yes',DeliveryCharge:40,MinimumOrder:300,Status:'Active'},{HubID:'FLY-LHB-000002',DistrictID:'FLY-DST-000001',HubName:'Medical College Hub',Area:'Medical College Side',Pincode:'673008',PickupAvailable:'Yes',HomeDeliveryAvailable:'Yes',DeliveryCharge:50,MinimumOrder:300,Status:'Active'}],
    areas:[{DistrictID:'FLY-DST-000001',Pincode:'673571',Area:'Peringolam / Kunnamangalam',HubID:'FLY-LHB-000001',Status:'Active'},{DistrictID:'FLY-DST-000001',Pincode:'673008',Area:'Medical College Side',HubID:'FLY-LHB-000002',Status:'Active'}],
    slots:[{SlotID:'SLOT001',HubID:'FLY-LHB-000001',SlotLabel:'Evening 4:00 PM - 7:00 PM',CutOffTime:'2:30 PM',Status:'Active'},{SlotID:'SLOT002',HubID:'FLY-LHB-000002',SlotLabel:'Evening 5:00 PM - 8:00 PM',CutOffTime:'3:00 PM',Status:'Active'}]
  };

  document.addEventListener('DOMContentLoaded', init);
  function init(){ setYear(); bindNav(); bindLocationDropdown(); bindPromoSlider(); bindGenericForms(); bindPortalForms(); bindTrackOrder(); bindCheckout(); bindCheckoutLocation(); bindAdmin(); if(document.querySelector('#shop') || document.querySelector('#productGrid')) loadPublicData(); updateCustomerUI(); updateCartUI(); }
  function setYear(){ document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear()); }
  function bindNav(){
    document.querySelectorAll('.mobile-toggle').forEach(btn => btn.addEventListener('click',()=>document.querySelector('.menu')?.classList.toggle('open')));
    document.querySelectorAll('[data-open-cart]').forEach(btn=>btn.addEventListener('click',openCart));
    document.querySelectorAll('[data-close-cart]').forEach(btn=>btn.addEventListener('click',closeCart));
    document.querySelectorAll('[data-open-checkout]').forEach(btn=>btn.addEventListener('click',startCheckout));
    document.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.modal')?.classList.remove('open'))); document.querySelectorAll('[data-product-window-close]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('#productWindowModal')?.classList.remove('open')));
    document.querySelectorAll('[data-logout]').forEach(btn=>btn.addEventListener('click',()=>{localStorage.removeItem('freshlyCustomer');state.customer=null;updateCustomerUI();toast('Logged out. You can still shop and login at checkout.')}));
    document.querySelectorAll('[data-menu-cat]').forEach(a=>a.addEventListener('click',()=>{state.selectedCategory=a.dataset.menuCat; setTimeout(()=>{renderCategories(); renderProducts();},250)}));
  }

  function bindLocationDropdown(){
    const toggle = document.querySelector('[data-location-toggle]');
    const panel = document.querySelector('[data-location-panel]');
    if(!toggle || !panel) return;
    toggle.addEventListener('click', (e)=>{ e.stopPropagation(); panel.classList.toggle('open'); });
    panel.addEventListener('click', e=>e.stopPropagation());
    document.addEventListener('click', ()=>panel.classList.remove('open'));
  }
  function renderPromoSlider(){
    const track = document.querySelector('[data-promo-track]');
    const dotsBox = document.querySelector('[data-promo-dots]');
    if(!track) return;
    let banners = (state.banners && state.banners.length ? state.banners : demo.banners || [])
      .filter(b => String(b.Status || 'Active').toLowerCase() === 'active')
      .sort((a,b)=>(+a.SortOrder||999)-(+b.SortOrder||999));
    if(!banners.length) banners = demo.banners || [];
    track.style.width = `${Math.max(1,banners.length)*100}%`;
    track.innerHTML = banners.map((b,idx)=>promoSlide(b,idx)).join('');
    if(dotsBox){
      dotsBox.innerHTML = banners.map((b,idx)=>`<button data-promo-dot="${idx}" class="${idx===0?'active':''}" aria-label="Promotion ${idx+1}"></button>`).join('');
    }
    bindPromoSlider();
  }
  function promoSlide(b, idx){
    const image = String(b.ImageURL || '').trim();
    const displayMode = String(b.DisplayMode || '').toLowerCase();
    const title = esc(b.Title || 'Freshness Delivered.');
    const sub = esc(b.Subtitle || 'Choose fresh products, easy ordering and convenient pickup or delivery.');
    const btnText = esc(b.ButtonText || 'Shop Now');
    const btnLink = esc(b.ButtonLink || '#shop');
    const label = esc(b.Label || b.Tagline || 'Freshly');

    if(image && displayMode === 'imageonly'){
      return `<article class="promo-slide backend-banner image-only"><a class="banner-image-link" href="${btnLink}" aria-label="${title}"><img src="${esc(image)}" alt="${title}"></a></article>`;
    }

    const imgStyle = image ? ` style="background-image:linear-gradient(90deg,rgba(255,255,255,.95),rgba(255,255,255,.64),rgba(255,255,255,.08)),url('${esc(image)}')"` : '';
    return `<article class="promo-slide backend-banner ${image?'has-image':''}"${imgStyle}><div><span class="eyebrow">${label}</span><h2>${title}</h2><p>${sub}</p></div><a class="btn btn-primary" href="${btnLink}">${btnText}</a></article>`;
  }
  function bindPromoSlider(){
    const track = document.querySelector('[data-promo-track]');
    if(!track) return;
    const dots = [...document.querySelectorAll('[data-promo-dot]')];
    const total = Math.max(1, dots.length || track.children.length || 1);
    let i = 0;
    const go = n => { i = n % total; track.style.transform = `translateX(-${i*(100/total)}%)`; dots.forEach((d,idx)=>d.classList.toggle('active', idx===i)); };
    dots.forEach((d,idx)=>d.addEventListener('click',()=>go(idx)));
    if(window.freshlyPromoTimer) clearInterval(window.freshlyPromoTimer);
    window.freshlyPromoTimer = setInterval(()=>go((i+1)%total), 4500);
  }

  async function loadPublicData(){
    try{
      let res = cfg.BACKEND_URL ? await api('getPublicData', {}, 'GET') : null;
      if(!res || !res.ok){ if(cfg.DEMO_MODE_WHEN_BACKEND_EMPTY) res = {ok:true,data:demo}; else throw new Error(res?.message || 'Backend not configured'); }
      const p = res.data || res;
      ['categories','products','districts','hubs','areas','slots','districtPricing','banners','countries'].forEach(k => state[k] = p[k] || demo[k] || []);
      state.settings = p.settings || demo.settings || {};
      renderLocationSelectors(); renderPromoSlider(); renderCategories(); renderProducts(); renderCheckoutLocationControls(); renderProductDetailsPage();
    }catch(err){ console.error(err); if(cfg.DEMO_MODE_WHEN_BACKEND_EMPTY){ Object.assign(state, demo); renderLocationSelectors(); renderPromoSlider(); renderCategories(); renderProducts(); renderCheckoutLocationControls(); renderProductDetailsPage(); } else toast('Could not load catalogue. Check backend URL.'); }
  }

  function renderLocationSelectors(){
    const countrySel = document.querySelector('#countrySelect');
    if(countrySel){
      const countryRows = activeRows(state.countries || []);
      let countries = countryRows.length ? countryRows : [];
      if(!countries.length){
        const names = [...new Set([...(state.districts||[]).map(d=>d.Country), ...(state.hubs||[]).map(h=>h.Country)].filter(Boolean))];
        countries = names.length ? names.map((n,i)=>({CountryID:n,CountryName:n,Status:'Active'})) : [{CountryID:'India',CountryName:'India',Status:'Active'}];
      }
      countrySel.innerHTML = `<option value="">Select Country</option>` + countries.map(c=>{
        const id = c.CountryID || c.CountryName || c.Name;
        const name = c.CountryName || c.Name || c.CountryID;
        return `<option value="${esc(id)}" ${String(id)===String(state.selectedCountry)?'selected':''}>${esc(name)}</option>`;
      }).join('');
      countrySel.onchange=()=>{state.selectedCountry=countrySel.value;state.selectedDistrict='';state.selectedHub='';saveLocation();renderLocationSelectors();renderProducts();renderCheckoutLocationControls();};
    }
    const distSel = document.querySelector('#districtSelect');
    if(distSel){
      const districts = activeRows(state.districts).filter(d => !state.selectedCountry || !d.CountryID && !d.Country || String(d.CountryID || d.Country)===String(state.selectedCountry));
      distSel.innerHTML = `<option value="">Select District / City</option>` + districts.map(d=>`<option value="${esc(d.DistrictID)}" ${d.DistrictID===state.selectedDistrict?'selected':''}>${esc(d.DistrictName || d.City || d.Name)}</option>`).join('');
      distSel.onchange=()=>{state.selectedDistrict=distSel.value;saveLocation();renderProducts();renderCheckoutLocationControls();};
    }
    const pin = document.querySelector('#pincodeInput'); if(pin){ pin.value = state.selectedPincode || ''; pin.oninput=()=>{state.selectedPincode=pin.value.trim(); saveLocation();}; }
    const btn = document.querySelector('#checkPincodeBtn'); if(btn) btn.onclick = checkPincodeHubs;
    renderHubDropdown('#hubSelect');
  }
  function checkPincodeHubs(){
    const box = document.querySelector('#locationResult'); const hubs = matchingHubs();
    renderHubDropdown('#hubSelect');
    if(box){ box.classList.remove('hidden'); box.className='notice mini'; box.innerHTML = hubs.length ? `<b>${hubs.length} Freshly Hub(s) found.</b> Choose your preferred hub to continue.` : `<b>Freshly is not active for this pincode yet.</b> Use Join Freshly → Start Freshly in My Area.`; }
  }
  function matchingHubs(){ return activeRows(state.hubs).filter(h => (!state.selectedCountry || !h.CountryID && !h.Country || String(h.CountryID || h.Country)===String(state.selectedCountry)) && (!state.selectedDistrict || h.DistrictID===state.selectedDistrict) && (!state.selectedPincode || String(h.Pincode || h.Area || '').toLowerCase()===String(state.selectedPincode).toLowerCase())); }
  function renderHubDropdown(sel){
    document.querySelectorAll(sel).forEach(el=>{ const hubs = matchingHubs(); el.innerHTML = `<option value="">Choose Freshly Hub</option>` + hubs.map(h=>`<option value="${esc(h.HubID)}" ${h.HubID===state.selectedHub?'selected':''}>${esc(h.HubName)} - ${esc(h.Area || h.Pincode || '')}</option>`).join(''); el.onchange=()=>{state.selectedHub=el.value;saveLocation();renderCheckoutLocationControls();}; });
  }
  function saveLocation(){ localStorage.setItem('freshlyCountry',state.selectedCountry||''); localStorage.setItem('freshlyDistrict',state.selectedDistrict||''); localStorage.setItem('freshlyPincode',state.selectedPincode||''); localStorage.setItem('freshlyHub',state.selectedHub||''); }

  function renderCategories(){
    const box = document.querySelector('#categoryTabs'); if(!box) return;
    const cats = activeRows(state.categories).sort((a,b)=>(+a.SortOrder||0)-(+b.SortOrder||0));
    box.innerHTML = `<button class="tab ${state.selectedCategory==='all'?'active':''}" data-cat="all">All</button>` + cats.map(c=>`<button class="tab ${state.selectedCategory===c.CategoryID?'active':''}" data-cat="${esc(c.CategoryID)}">${esc(c.Name)}</button>`).join('');
    box.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{state.selectedCategory=b.dataset.cat; renderCategories(); renderProducts();});
    const search = document.querySelector('#catalogSearch'); if(search) search.oninput = renderProducts;
    const homeSearch = document.querySelector('#homeProductSearch');
    if(homeSearch){
      homeSearch.oninput = () => { const catalog = document.querySelector('#catalogSearch'); if(catalog){ catalog.value = homeSearch.value; renderProducts(); } };
      document.querySelector('#homeSearchBtn')?.addEventListener('click', () => { const catalog = document.querySelector('#catalogSearch'); if(catalog){ catalog.value = homeSearch.value; renderProducts(); } });
    }
  }
  function renderProducts(){
    const grid = document.querySelector('#productGrid'); if(!grid) return;
    const term = (document.querySelector('#catalogSearch')?.value || '').toLowerCase().trim();
    const products = activeRows(state.products).filter(p => String(p.ApprovalStatus||'Approved').toLowerCase()==='approved' && String(p.WebsiteStatus||'Active').toLowerCase()==='active')
      .filter(p => state.selectedCategory==='all' || p.CategoryID===state.selectedCategory)
      .filter(p => !term || `${p.Name} ${p.Description||''} ${p.CategoryID||''}`.toLowerCase().includes(term));
    grid.innerHTML = products.length ? products.map(productCard).join('') : `<div class="card full"><h3>No active approved products found.</h3><p class="muted">No products are available for the selected category or location.</p></div>`;
    grid.querySelectorAll('[data-open-product]').forEach(btn=>btn.onclick=()=>openProductWindow(btn.dataset.openProduct));
  }
  function effectivePrice(p){
    const dp = activeRows(state.districtPricing).find(x => String(x.ProductID)===String(p.ProductID) && (!state.selectedDistrict || String(x.DistrictID)===String(state.selectedDistrict)));
    const basePrice = Number((dp && (dp.OfferPrice || dp.SellingPrice)) || p.OfferPrice || p.BasePrice || p.Price || 0);
    const mrp = Number((dp && dp.MRP) || p.MRP || 0);
    const priceBasis = String((dp && dp.PriceBasis) || p.PriceBasis || inferPriceBasis(p)).trim() || 'Per Pack';
    const baseUnit = normalizeUnit((dp && dp.BaseUnit) || p.BaseUnit || p.Unit || unitFromBasis(priceBasis));
    return { price:basePrice, basePrice, mrp, stockQty:(dp && dp.StockQty) || p.StockQty, priceBasis, baseUnit, qtyOptions:qtyOptionsFor(p, baseUnit, priceBasis), defaultQty:Number(p.DefaultQty || 0) };
  }
  function inferPriceBasis(p){ const u=String(p.Unit||p.BaseUnit||'pack').toLowerCase(); if(u.includes('kg'))return'Per Kg'; if(u.includes('lit')||u==='l')return'Per Litre'; if(u.includes('dozen'))return'Per Dozen'; if(u.includes('piece')||u==='pc'||u==='pcs')return'Per Piece'; if(u.includes('combo'))return'Per Combo'; return'Per Pack'; }
  function unitFromBasis(b){ const s=String(b||'').toLowerCase(); if(s.includes('kg'))return'kg'; if(s.includes('lit'))return'litre'; if(s.includes('piece'))return'piece'; if(s.includes('dozen'))return'dozen'; if(s.includes('combo'))return'combo'; return'pack'; }
  function normalizeUnit(u){ const s=String(u||'pack').toLowerCase().trim(); if(['kg','kgs','kilogram','kilograms'].includes(s))return'kg'; if(['l','ltr','litre','liter','litres','liters'].includes(s))return'litre'; if(['pc','pcs','piece','pieces'].includes(s))return'piece'; if(['dozen','dz'].includes(s))return'dozen'; if(s.includes('combo'))return'combo'; if(s.includes('pack'))return'pack'; return s || 'pack'; }
  function qtyOptionsFor(p, unit, basis){
    const raw = String(p.AllowedQtyOptions || '').trim();
    if(raw){ const vals = raw.split(',').map(x=>Number(String(x).trim())).filter(x=>!isNaN(x)&&x>0); if(vals.length) return vals; }
    const min = Number(p.MinimumQty || 0), max = Number(p.MaximumQty || 0), step = Number(p.QtyStep || 0);
    if(min>0 && max>=min && step>0){ const arr=[]; for(let v=min; v<=max+0.0001; v+=step) arr.push(Number(v.toFixed(3))); return arr; }
    if(unit==='kg') return [0.5,1,1.5,2,2.5,3,4,5];
    if(unit==='litre') return [0.5,1,2,5];
    if(unit==='dozen') return [1,2,3];
    return [1,2,3,4,5];
  }
  function formatQty(q, unit){ q=Number(q||1); if(unit==='kg') return q<1 ? `${Math.round(q*1000)}g` : `${stripNum(q)}kg`; if(unit==='litre') return q<1 ? `${Math.round(q*1000)}ml` : `${stripNum(q)}L`; if(unit==='piece') return `${stripNum(q)} pc${q>1?'s':''}`; if(unit==='dozen') return `${stripNum(q)} dozen`; if(unit==='combo') return `${stripNum(q)} combo${q>1?'s':''}`; return `${stripNum(q)} pack${q>1?'s':''}`; }
  function stripNum(n){ return Number(n).toLocaleString('en-IN',{maximumFractionDigits:3}); }
  function priceLabel(meta){ return `${currency}${num(meta.basePrice)} / ${meta.baseUnit==='kg'?'kg':meta.baseUnit==='litre'?'litre':meta.baseUnit}`; }
  function optionChargesFromForm(fd){ let extra=0; const notes=[]; ['Cleaning','Cutting','Marination'].forEach(k=>{ const v=fd.get(k); if(v && v!=='None'){ notes.push(v); const m=String(v).match(/\+₹(\d+)/); if(m) extra += +m[1]; }}); const special=fd.get('SpecialNote'); if(special) notes.push(`Note: ${special}`); return {extra, notes}; }
  function productCard(p){
    const pr = effectivePrice(p); const stock = stockClass(p.StockStatus, pr.stockQty); const img = p.ImageURL ? `<img src="${esc(p.ImageURL)}" alt="${esc(p.Name)}">` : `<span class="emoji">${categoryEmoji(p.CategoryID)}</span>`;
    return `<article class="product-card"><div class="product-img" data-open-product="${esc(p.ProductID)}">${img}</div><div class="product-body"><span class="stock ${stock.cls}">${esc(stock.label)}</span><h3 data-open-product="${esc(p.ProductID)}" style="cursor:pointer">${esc(p.Name)}</h3><div class="product-min-meta">${esc(p.PackSize || pr.priceBasis || 'Select quantity')}</div><div><span class="price">${priceLabel(pr)}</span> ${pr.mrp?`<span class="mrp">${currency}${num(pr.mrp)}</span>`:''}</div><div class="card-actions"><button class="btn btn-small" type="button" data-open-product="${esc(p.ProductID)}">Details</button><button class="btn btn-primary btn-small" type="button" data-open-product="${esc(p.ProductID)}">Select</button></div></div></article>`;
  }
  function quantityOptionsHtml(meta){
    const selected = Number(meta.defaultQty || meta.qtyOptions[0] || 1);
    return meta.qtyOptions.map(q=>`<option value="${q}" ${Number(q)===selected?'selected':''}>${formatQty(q, meta.baseUnit)} - ${currency}${num(meta.basePrice*q)}</option>`).join('');
  }
  function optionSelectsHtml(p){
    const cleaningAvail=String(p.CleaningAvailable||'').toLowerCase()==='yes';
    const cuttingAvail=String(p.CuttingAvailable||'').toLowerCase()==='yes';
    const marAvail=String(p.MarinationAvailable||'').toLowerCase()==='yes';
    return `${cleaningAvail?`<div><label>Cleaning</label><select class="input" name="Cleaning"><option value="None">No Cleaning</option><option value="Cleaned (+₹20)">Cleaned (+₹20)</option></select></div>`:''}${cuttingAvail?`<div><label>Cutting</label><select class="input" name="Cutting"><option value="None">No Cutting</option><option value="Standard Cut (+₹30)">Standard Cut (+₹30)</option></select></div>`:''}${marAvail?`<div><label>Marination</label><select class="input" name="Marination"><option value="None">No Marination</option><option value="Basic Marinade (+₹40)">Basic Marinade (+₹40)</option></select></div>`:''}`;
  }
  function updateLineSummary(form, meta){
    const fd=new FormData(form); const selectedQty=Number(fd.get('SelectedQty')||meta.qtyOptions[0]||1); const baseTotal=meta.basePrice*selectedQty; const opt=optionChargesFromForm(fd); const line=baseTotal+opt.extra; const out=form.querySelector('[data-line-summary]'); if(out) out.innerHTML=`<b>Selected:</b> ${formatQty(selectedQty, meta.baseUnit)} &nbsp; <b>Rate:</b> ${priceLabel(meta)}<br><b>Product:</b> ${currency}${num(baseTotal)} ${opt.extra?` + <b>Options:</b> ${currency}${num(opt.extra)}`:''}<br><b>Item Total:</b> ${currency}${num(line)}`;
  }
  function openProductWindow(id){
    const modal = document.querySelector('#productWindowModal');
    const box = document.querySelector('#productWindowContent');
    if(!modal || !box){ window.location.href = `product-details.html?id=${encodeURIComponent(id)}`; return; }
    const p = state.products.find(x=>String(x.ProductID)===String(id));
    if(!p){ toast('Product not found.'); return; }
    const pr=effectivePrice(p); const stock=stockClass(p.StockStatus, pr.stockQty);
    const img=p.ImageURL?`<img src="${esc(p.ImageURL)}" alt="${esc(p.Name)}">`:`<span class="emoji">${categoryEmoji(p.CategoryID)}</span>`;
    document.querySelector('[data-product-window-title]').textContent = p.Name;
    box.innerHTML = `<div class="product-detail-grid"><div><div class="detail-image">${img}</div><div class="notice mini"><b>Rate:</b> ${priceLabel(pr)}<br><b>Choose:</b> ${pr.qtyOptions.map(q=>formatQty(q,pr.baseUnit)).join(', ')}</div></div><div><span class="stock ${stock.cls}">${esc(stock.label)}</span><h2>${esc(p.Name)}</h2><p>${esc(p.Description||'Freshly sourced and quality checked.')}</p><p class="muted">${esc(p.FreshnessNote||'Freshly sourced and quality checked.')}</p><div><span class="price">${priceLabel(pr)}</span> ${pr.mrp?`<span class="mrp">${currency}${num(pr.mrp)}</span>`:''}</div><form id="productWindowForm" class="detail-form"><div class="form-grid"><div><label>Choose Quantity</label><select class="input" name="SelectedQty">${quantityOptionsHtml(pr)}</select></div>${optionSelectsHtml(p)}<div class="full"><label>Special Note</label><input class="input" name="SpecialNote" placeholder="Optional preference or note"></div></div><div class="notice line-summary" data-line-summary></div><div class="card-actions"><button class="btn" type="button" data-product-window-close>Continue Shopping</button><button class="btn btn-primary" type="submit">Add to Cart</button></div></form></div></div>`;
    const form=box.querySelector('#productWindowForm'); form.querySelectorAll('select,input').forEach(el=>el.addEventListener('change',()=>updateLineSummary(form,pr))); form.querySelectorAll('input').forEach(el=>el.addEventListener('input',()=>updateLineSummary(form,pr))); updateLineSummary(form,pr);
    box.querySelectorAll('[data-product-window-close]').forEach(b=>b.onclick=()=>modal.classList.remove('open'));
    form.addEventListener('submit', e=>{ e.preventDefault(); const fd=new FormData(form); const selectedQty=Number(fd.get('SelectedQty')||1); const baseTotal=pr.basePrice*selectedQty; const opt=optionChargesFromForm(fd); const lineTotal=baseTotal+opt.extra; const selectedLabel=formatQty(selectedQty,pr.baseUnit); addToCart(p.ProductID, opt.notes.join(' | '), 1, lineTotal, selectedLabel, {SelectedQty:selectedQty,SelectedQtyLabel:selectedLabel,BaseUnit:pr.baseUnit,PriceBasis:pr.priceBasis,BasePrice:pr.basePrice,ProductTotal:baseTotal,OptionCharges:opt.extra,UnitPriceLabel:priceLabel(pr)}); modal.classList.remove('open'); openCart(); });
    modal.classList.add('open');
  }
  function categoryEmoji(cat){ const s=String(cat||'').toLowerCase(); if(s.includes('fish')) return '🐟'; if(s.includes('chicken')) return '🍗'; if(s.includes('mutton')) return '🥩'; if(s.includes('egg')) return '🥚'; if(s.includes('veg')||s.includes('fruit')) return '🥬'; if(s.includes('grocery')||s.includes('essential')) return '🛒'; return '🥗'; }
  function stockClass(status, qty){ const s=String(status||'Available').toLowerCase(); if(s.includes('sold')||s.includes('out')||Number(qty)===0) return {cls:'out',label:'Sold Out'}; if(s.includes('limited')||Number(qty)<10) return {cls:'limited',label:'Limited'}; return {cls:'ok',label:'Available'}; }
  function addToCart(id, note='', qty=1, priceOverride=null, packLabel='', meta={}){ const p=state.products.find(x=>String(x.ProductID)===String(id)); if(!p) return; const pr=effectivePrice(p); const finalPrice=priceOverride==null?pr.price:(+priceOverride||pr.price); const finalPack=packLabel||p.PackSize||p.Unit||'Pack'; const finalMeta=Object.assign({SelectedQty:meta.SelectedQty||1,SelectedQtyLabel:finalPack,BaseUnit:meta.BaseUnit||pr.baseUnit,PriceBasis:meta.PriceBasis||pr.priceBasis,BasePrice:meta.BasePrice||pr.basePrice,ProductTotal:meta.ProductTotal||finalPrice,OptionCharges:meta.OptionCharges||0,UnitPriceLabel:meta.UnitPriceLabel||priceLabel(pr)}, meta||{}); const line=state.cart.find(x=>String(x.ProductID)===String(id) && String(x.Note||'')===String(note||'') && String(x.PackSize||'')===String(finalPack)); if(line) line.Qty += (+qty||1); else state.cart.push(Object.assign({ProductID:p.ProductID,Name:p.Name,PackSize:finalPack,Unit:finalMeta.BaseUnit,Price:finalPrice,Qty:+qty||1,Note:note}, finalMeta)); save('freshlyCart',state.cart); updateCartUI(); toast(`${p.Name} added to cart`); }
  function removeFromCart(i){ state.cart.splice(i,1); save('freshlyCart',state.cart); updateCartUI(); }
  function changeQty(i,d){ state.cart[i].Qty += d; if(state.cart[i].Qty<=0) removeFromCart(i); save('freshlyCart',state.cart); updateCartUI(); }
  function cartTotal(){ return state.cart.reduce((s,x)=>s+(+x.Price||0)*(+x.Qty||0),0); }
  function updateCartUI(){
    document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=state.cart.reduce((s,x)=>s+(+x.Qty||0),0)); document.querySelectorAll('[data-cart-total]').forEach(el=>el.textContent=currency+num(cartTotal()));
    const box=document.querySelector('#cartItems'); if(box){ box.innerHTML=state.cart.length?state.cart.map((x,i)=>`<div class="cart-line"><div><strong>${esc(x.Name)}</strong><br><span class="muted">Selected: ${esc(x.SelectedQtyLabel||x.PackSize)} • Rate: ${esc(x.UnitPriceLabel||currency+num(x.BasePrice||x.Price))}</span><br><span class="muted">Product: ${currency}${num(x.ProductTotal||x.Price)}${(+x.OptionCharges||0)?` • Options: ${currency}${num(x.OptionCharges)}`:''}</span>${x.Note?`<br><span class="muted">Options/Note: ${esc(x.Note)}</span>`:''}<div style="margin-top:8px"><button class="btn btn-small" data-minus="${i}">−</button> <strong>${x.Qty}</strong> <button class="btn btn-small" data-plus="${i}">+</button></div></div><div><strong>${currency}${num((+x.Price||0)*(+x.Qty||0))}</strong><br><button class="btn btn-small btn-danger" data-remove="${i}">Remove</button></div></div>`).join(''):'<p class="muted">Your cart is empty.</p>'; box.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.minus,-1)); box.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>changeQty(+b.dataset.plus,1)); box.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeFromCart(+b.dataset.remove)); }
  }
  function openCart(){document.querySelector('#cartDrawer')?.classList.add('open');} function closeCart(){document.querySelector('#cartDrawer')?.classList.remove('open');}
  function startCheckout(){ if(!state.cart.length){toast('Please add products before checkout.');return;} closeCart(); renderCheckoutLines(); renderCheckoutLocationControls(); updateCustomerUI(); document.querySelector('#checkoutModal')?.classList.add('open'); }
  function renderCheckoutLines(){ const box=document.querySelector('#checkoutLines'); if(!box)return; box.innerHTML=state.cart.map(x=>`<div class="split-line"><span>${esc(x.Name)} (${esc(x.SelectedQtyLabel||x.PackSize)}) × ${x.Qty}</span><strong>${currency}${num(x.Price*x.Qty)}</strong></div>`).join('')+`<hr><div class="split-line"><strong>Total</strong><strong>${currency}${num(cartTotal())}</strong></div>`; }
  function renderCheckoutLocationControls(){ document.querySelectorAll('[data-district-select]').forEach(sel=>{ sel.innerHTML=`<option value="">Select District</option>`+activeRows(state.districts).map(d=>`<option value="${esc(d.DistrictID)}" ${d.DistrictID===state.selectedDistrict?'selected':''}>${esc(d.DistrictName)}</option>`).join(''); sel.onchange=()=>{state.selectedDistrict=sel.value;saveLocation();renderHubDropdown('[data-hub-select]');renderProducts();}; }); document.querySelectorAll('[data-checkout-pincode]').forEach(inp=>{inp.value=state.selectedPincode||''; inp.oninput=()=>{state.selectedPincode=inp.value.trim();saveLocation();renderHubDropdown('[data-hub-select]');};}); renderHubDropdown('[data-hub-select]'); renderSlots(); }
  function renderSlots(){ document.querySelectorAll('[data-slot-select]').forEach(sel=>{ const slots=activeRows(state.slots).filter(s=>!state.selectedHub || s.HubID===state.selectedHub); sel.innerHTML=`<option value="">Select delivery slot</option>`+slots.map(s=>`<option value="${esc(s.SlotID)}">${esc(s.SlotLabel)} (Cut-off: ${esc(s.CutOffTime||'')})</option>`).join(''); }); }
  function renderProductDetailsPage(){
    const box=document.querySelector('#productDetailPage'); if(!box) return;
    const params=new URLSearchParams(window.location.search); const id=params.get('id');
    const p=state.products.find(x=>String(x.ProductID)===String(id));
    if(!p){ box.innerHTML='<div class="danger-note">Product not found.</div>'; return; }
    const pr=effectivePrice(p); const stock=stockClass(p.StockStatus, pr.stockQty); const img=p.ImageURL?`<img src="${esc(p.ImageURL)}" alt="${esc(p.Name)}">`:`<span class="emoji">${categoryEmoji(p.CategoryID)}</span>`;
    box.innerHTML=`<div class="product-detail-grid standalone-detail"><div><div class="detail-image">${img}</div></div><div><span class="stock ${stock.cls}">${esc(stock.label)}</span><h2>${esc(p.Name)}</h2><div class="product-min-meta">${esc(p.PackSize||pr.priceBasis||'Select quantity')}</div><div><span class="price">${priceLabel(pr)}</span> ${pr.mrp?`<span class="mrp">${currency}${num(pr.mrp)}</span>`:''}</div><p>${esc(p.Description||'Freshly sourced and quality checked.')}</p><div class="notice mini"><b>Freshness Note:</b> ${esc(p.FreshnessNote||'Freshly sourced and quality checked.')}</div><form id="detailSelectForm" class="detail-form"><div class="form-grid"><div><label>Choose Quantity</label><select class="input" name="SelectedQty">${quantityOptionsHtml(pr)}</select></div>${optionSelectsHtml(p)}<div class="full"><label>Special Note</label><input class="input" name="SpecialNote" placeholder="Optional preference or note"></div></div><div class="notice line-summary" data-line-summary></div><div class="card-actions"><button class="btn" type="button" onclick="window.close()">Close Window</button><button class="btn btn-primary" type="submit">Add to Cart</button></div></form></div></div>`;
    const form=document.querySelector('#detailSelectForm'); form.querySelectorAll('select,input').forEach(el=>el.addEventListener('change',()=>updateLineSummary(form,pr))); form.querySelectorAll('input').forEach(el=>el.addEventListener('input',()=>updateLineSummary(form,pr))); updateLineSummary(form,pr);
    form.addEventListener('submit',e=>{ e.preventDefault(); const fd=new FormData(form); const selectedQty=Number(fd.get('SelectedQty')||1); const baseTotal=pr.basePrice*selectedQty; const opt=optionChargesFromForm(fd); const lineTotal=baseTotal+opt.extra; const selectedLabel=formatQty(selectedQty,pr.baseUnit); addToCart(p.ProductID, opt.notes.join(' | '), 1, lineTotal, selectedLabel, {SelectedQty:selectedQty,SelectedQtyLabel:selectedLabel,BaseUnit:pr.baseUnit,PriceBasis:pr.priceBasis,BasePrice:pr.basePrice,ProductTotal:baseTotal,OptionCharges:opt.extra,UnitPriceLabel:priceLabel(pr)}); toast('Added to cart. You can close this window and continue shopping.'); });
  }
  function bindCheckout(){ const login=document.querySelector('#checkoutLoginForm'); if(login) login.onsubmit=async e=>{e.preventDefault(); await customerAuth(new FormData(login));}; const order=document.querySelector('#checkoutOrderForm'); if(order) order.onsubmit=async e=>{e.preventDefault(); await placeOrder(new FormData(order));}; }
  function bindCheckoutLocation(){
    const btn=document.querySelector('#useCurrentLocationBtn');
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const status=document.querySelector('#locationCaptureStatus');
      const setStatus=(html, cls='notice mini')=>{ if(status){status.className=cls; status.classList.remove('hidden'); status.innerHTML=html;} };
      if(!navigator.geolocation){ setStatus('Current location is not supported on this browser. Please enter address manually.','warning mini'); return; }
      setStatus('Requesting location permission...');
      navigator.geolocation.getCurrentPosition(pos=>{
        const lat=pos.coords.latitude.toFixed(7);
        const lng=pos.coords.longitude.toFixed(7);
        const acc=Math.round(pos.coords.accuracy || 0);
        const map=`https://www.google.com/maps?q=${lat},${lng}`;
        const now=new Date().toISOString();
        const fill=(id,v)=>{ const el=document.querySelector('#'+id); if(el) el.value=v; };
        fill('AddressMode','Current Location');
        fill('Latitude',lat); fill('Longitude',lng); fill('LocationAccuracy',acc); fill('GoogleMapLink',map); fill('LocationCapturedAt',now);
        setStatus(`<b>Current location captured.</b><br><a href="${map}" target="_blank" rel="noopener">Open map location</a><br><span class="muted">Accuracy: about ${acc} metres. You may still add manual address/landmark below.</span>`);
        toast('Current location captured.');
      }, err=>{
        const msg = err && err.message ? err.message : 'Location permission denied.';
        setStatus(`${esc(msg)} Please enter address manually.`, 'warning mini');
      }, {enableHighAccuracy:true, timeout:12000, maximumAge:60000});
    });
  }
  async function customerAuth(fd){ const data=Object.fromEntries(fd.entries()); if(!data.Phone){toast('Phone is required.');return;} try{ const res=cfg.BACKEND_URL?await api('customerAuth',data,'POST'):{ok:true,customer:{CustomerFreshlyID:'FLY-CUS-DEMO',Name:data.Name||'Freshly Customer',Phone:data.Phone,Email:data.Email||'',SessionToken:'DEMO'}}; if(!res.ok) throw new Error(res.message||'Login failed'); state.customer=res.customer||res.data?.customer; save('freshlyCustomer',state.customer); updateCustomerUI(); toast(`Logged in. Freshly ID: ${state.customer.CustomerFreshlyID||state.customer.CustomerID||''}`); }catch(err){toast(err.message);} }
  async function placeOrder(fd){ if(!state.customer){toast('Please login/signup to checkout.');return;} const order=Object.fromEntries(fd.entries()); const hasManual = String(order.ManualAddress||order.HouseNo||order.BuildingName||order.Area||order.Landmark||'').trim().length>0; const hasLocation = String(order.Latitude||'').trim() && String(order.Longitude||'').trim(); if(!hasManual && !hasLocation){toast('Please use current location or add address manually.');return;} const payload={customer:state.customer,order,items:state.cart,clientTotal:cartTotal()}; try{ const res=cfg.BACKEND_URL?await api('placeOrder',payload,'POST'):{ok:true,orderId:'FLY-ORD-DEMO',message:'Demo order created.'}; if(!res.ok) throw new Error(res.message||'Order failed'); state.cart=[]; save('freshlyCart',state.cart); updateCartUI(); document.querySelector('#checkoutModal')?.classList.remove('open'); const box=document.querySelector('#orderSuccess'); if(box){box.classList.remove('hidden'); box.innerHTML=`<div class="notice"><h3>Order submitted</h3><p>Order ID: <b>${esc(res.orderId||res.data?.orderId||'')}</b>. You will receive order and payment updates from Freshly.</p></div>`;} toast('Order submitted successfully.'); }catch(err){toast(err.message);} }
  function updateCustomerUI(){ document.querySelectorAll('[data-customer-state]').forEach(el=>el.innerHTML=state.customer?`<span class="login-badge">Logged in: ${esc(state.customer.CustomerFreshlyID||state.customer.Phone||'')}</span>`:`<span class="warning">Guest browsing. Login required only at checkout.</span>`); document.querySelectorAll('[data-checkout-auth]').forEach(el=>el.classList.toggle('hidden',!!state.customer)); document.querySelectorAll('[data-checkout-order]').forEach(el=>el.classList.toggle('hidden',!state.customer)); }

  function bindGenericForms(){ document.querySelectorAll('[data-freshly-form]').forEach(form=>form.onsubmit=async e=>{e.preventDefault(); const type=form.dataset.freshlyForm; const data=Object.fromEntries(new FormData(form).entries()); try{ const res=cfg.BACKEND_URL?await api('submitLeadForm',{type,data},'POST'):{ok:true,message:'Demo submission captured.'}; if(!res.ok) throw new Error(res.message||'Submission failed'); form.reset(); toast(res.message||'Submitted successfully.'); }catch(err){toast(err.message);} }); }
  function bindPortalForms(){ const stock=document.querySelector('#stockPriceUpdateForm'); if(stock) stock.onsubmit=async e=>{e.preventDefault(); await submitPortal('submitStockPriceUpdate',stock,'Stock/price update submitted for admin approval.');}; const comp=document.querySelector('#complianceUpdateForm'); if(comp) comp.onsubmit=async e=>{e.preventDefault(); await submitPortal('submitComplianceUpdate',comp,'Compliance details submitted.');}; const cust=document.querySelector('#customerPortalLoginForm'); if(cust) cust.onsubmit=async e=>{e.preventDefault(); await customerAuth(new FormData(cust));}; }
  async function submitPortal(action,form,fallback){ const data=Object.fromEntries(new FormData(form).entries()); try{const res=cfg.BACKEND_URL?await api(action,data,'POST'):{ok:true,message:fallback}; if(!res.ok) throw new Error(res.message||'Submission failed'); form.reset(); toast(res.message||fallback);}catch(err){toast(err.message);} }
  function bindTrackOrder(){ const form=document.querySelector('#trackOrderForm'); if(!form)return; form.onsubmit=async e=>{e.preventDefault(); const data=Object.fromEntries(new FormData(form).entries()); const box=document.querySelector('#trackResult'); try{ const res=cfg.BACKEND_URL?await api('trackOrder',data,'POST'):{ok:true,order:{OrderFreshlyID:data.orderId,Status:'Demo mode',PaymentStatus:'Pending',Total:0}}; if(!res.ok) throw new Error(res.message||'Not found'); const o=res.order||res.data?.order; box.innerHTML=`<div class="card"><h3>Order ${esc(o.OrderFreshlyID||o.OrderID)}</h3><p>Status: <b>${esc(o.Status||'')}</b></p><p>Payment: <b>${esc(o.PaymentStatus||'')}</b></p><p>Total: <b>${currency}${num(o.Total||0)}</b></p></div>`;}catch(err){box.innerHTML=`<div class="danger-note">${esc(err.message)}</div>`;} }; }

  function bindAdmin(){ if(!document.querySelector('.admin-shell')) return; document.querySelectorAll('.admin-tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.admin-tab').forEach(x=>x.classList.remove('active')); b.classList.add('active'); document.querySelectorAll('.admin-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===b.dataset.adminTab));}); const lf=document.querySelector('#adminLoginForm'); if(lf) lf.onsubmit=async e=>{e.preventDefault(); await adminLogin(new FormData(lf));}; document.querySelectorAll('[data-admin-refresh]').forEach(b=>b.onclick=loadAdminDashboard); document.querySelectorAll('[data-admin-logout]').forEach(b=>b.onclick=()=>{localStorage.removeItem('freshlyAdminSession');state.admin=null;document.querySelector('#adminLoginPanel')?.classList.remove('hidden');document.querySelector('#adminDashboardPanel')?.classList.add('hidden');}); document.querySelectorAll('[data-admin-action]').forEach(b=>b.onclick=()=>runAdminAction(b.dataset.adminAction,b.dataset.confirm)); const fid=document.querySelector('#freshlyIdForm'); if(fid) fid.onsubmit=async e=>{e.preventDefault(); await runAdminAction('createFreshlyID','',Object.fromEntries(new FormData(fid).entries())); fid.reset();}; const cf=document.querySelector('#createAdminForm'); if(cf) cf.onsubmit=async e=>{e.preventDefault(); await runAdminAction('createAdminUser','',Object.fromEntries(new FormData(cf).entries())); cf.reset();}; if(state.admin) showAdminPanel(); }
  async function adminLogin(fd){ const data=Object.fromEntries(fd.entries()); try{ const res=cfg.BACKEND_URL?await api('adminLogin',data,'POST'):{ok:true,admin:{AdminFreshlyID:'FLY-ADM-DEMO',Name:'Demo Admin',Role:'Super Admin'},sessionToken:'DEMO'}; if(!res.ok) throw new Error(res.message||'Login failed'); state.admin={admin:res.admin,sessionToken:res.sessionToken}; save('freshlyAdminSession',state.admin); showAdminPanel(); toast('Admin login successful.'); }catch(err){toast(err.message);} }
  function showAdminPanel(){ document.querySelector('#adminLoginPanel')?.classList.add('hidden'); document.querySelector('#adminDashboardPanel')?.classList.remove('hidden'); document.querySelectorAll('[data-admin-name]').forEach(el=>el.textContent=state.admin?.admin?.Name||'Admin'); loadAdminDashboard(); }
  async function loadAdminDashboard(){ if(!document.querySelector('.admin-shell')) return; try{ const res=cfg.BACKEND_URL?await api('getAdminDashboardData',{sessionToken:state.admin?.sessionToken},'POST'):demoAdminData(); if(!res.ok) throw new Error(res.message||'Could not load dashboard'); renderAdminData(res.data||res); }catch(err){toast(err.message);} }
  async function runAdminAction(action,confirmText='',payload={}){ if(confirmText && !confirm(confirmText)) return; try{ const res=cfg.BACKEND_URL?await api(action,{sessionToken:state.admin?.sessionToken,...payload},'POST'):{ok:true,message:`Demo: ${action} completed`,freshlyId:'FLY-DEMO-000001'}; if(!res.ok) throw new Error(res.message||'Action failed'); toast(res.message||`${action} completed`); if(action==='createFreshlyID') document.querySelector('#freshlyIdResult').innerHTML=`<div class="notice">Created Freshly ID: <b>${esc(res.freshlyId||'')}</b></div>`; await loadAdminDashboard(); }catch(err){toast(err.message);} }
  function renderAdminData(data){ renderMetrics(data.metrics||{}); table('#recentOrders',data.recentOrders||[]); table('#ordersTable',data.recentOrders||[]); table('#productsTable',data.products||[]); table('#pendingApprovals',data.pendingApprovals||[]); table('#approvalTable',data.pendingApprovals||[]); table('#freshlyIdRegistry',data.freshlyIds||[]); table('#adminUsersTable',data.adminUsers||[]); table('#whatsappTable',data.whatsappQueue||[]); table('#settingsTable',data.settings||[]); }
  function renderMetrics(metrics){ const box=document.querySelector('#adminMetrics'); if(!box)return; const entries=Object.entries(metrics); box.innerHTML=entries.map(([k,v])=>`<div class="metric-card"><span class="muted">${esc(k)}</span><br><strong>${esc(v)}</strong></div>`).join(''); }
  function table(selector,rows){ const box=document.querySelector(selector); if(!box)return; if(!rows.length){box.innerHTML='<p class="muted">No records to show.</p>';return;} const keys=Object.keys(rows[0]).slice(0,8); box.innerHTML=`<table class="table"><thead><tr>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows.slice(0,20).map(r=>`<tr>${keys.map(k=>`<td>${esc(r[k])}</td>`).join('')}</tr>`).join('')}</tbody></table>`; }
  function demoAdminData(){ return {ok:true,data:{metrics:{'Today Orders':8,'Pending Payments':3,'Pending Approvals':2,'Active Products':27,'Active Hubs':5,'WhatsApp Pending':4,'Customers':128,'Revenue Today':'₹12,450'},recentOrders:[{OrderFreshlyID:'FLY-ORD-000001',CustomerName:'Demo Customer',HubID:'FLY-LHB-000001',Total:560,Status:'Received',PaymentStatus:'Pending'}],products:demo.products,pendingApprovals:[{UpdateID:'UPD-DEMO',SupplierID:'FLY-SUP-000001',ProductID:'FLY-PRD-000001',ApprovalStatus:'Pending'}],freshlyIds:[{FreshlyID:'FLY-CUS-000001',EntityType:'Customer',Name:'Demo Customer',Status:'Active'}],adminUsers:[{AdminFreshlyID:'FLY-ADM-000001',Name:'Super Admin',Role:'Super Admin',Status:'Active'}],whatsappQueue:[{MessageID:'WA-DEMO',RecipientType:'Customer',Status:'Pending'}],settings:[{Key:'WHATSAPP_MODE',Value:'LOG_ONLY'}]}}; }

  async function api(action,data={},method='POST'){ if(!cfg.BACKEND_URL) throw new Error('Backend URL is not configured.'); if(method==='GET'){ const r=await fetch(cfg.BACKEND_URL+'?action='+encodeURIComponent(action)); return await r.json(); } const r=await fetch(cfg.BACKEND_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,data})}); return await r.json(); }
  function activeRows(rows){ return (rows||[]).filter(r=>String(r.Status||'Active').toLowerCase()==='active' || String(r.Status||'').toLowerCase()==='yes'); }
  function save(k,v){localStorage.setItem(k,JSON.stringify(v));} function load(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f));}catch(e){return f;}}
  function num(v){return (+v||0).toLocaleString('en-IN');} function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function toast(msg){ const box=document.querySelector('#statusBox'); if(!box){alert(msg);return;} box.textContent=msg; box.classList.add('show'); clearTimeout(window.__freshToast); window.__freshToast=setTimeout(()=>box.classList.remove('show'),4200); }
  // V2.9.6 Partner dashboards
  const partnerDemo = {
    hub: {
      metrics:{todayOrders:18,pickupOrders:7,deliveryOrders:11,pendingPayments:3},
      hubDispatch:[
        ['FLY-ORD-000101','Rahul','9876543210','Fish, Chicken','₹1,240','4:00 PM - 6:00 PM','Packing'],
        ['FLY-ORD-000102','Anitha','9876501234','Vegetable Combo','₹420','5:00 PM - 7:00 PM','Ready'],
        ['FLY-ORD-000103','Shabeer','9847000000','Seer Fish 1kg','₹780','6:00 PM - 8:00 PM','Pending']
      ],
      pickupCustomers:[
        ['FLY-ORD-000104','Nisha','9895000001','5:30 PM','Paid','Ready'],
        ['FLY-ORD-000105','Sajith','9895000002','6:00 PM','Pending','Packing']
      ],
      homeDelivery:[
        ['FLY-ORD-000106','Mini','Kunnamangalam','Open Map','Rider 01','Out for delivery'],
        ['FLY-ORD-000107','Jaleel','Peringolam','Open Map','Rider 02','Ready']
      ],
      hubStatement:[
        ['Today','18','₹360','₹220','₹580','Pending settlement'],
        ['This Month','286','₹5,720','₹3,430','₹9,150','Processing']
      ]
    },
    delivery: {
      metrics:{assignedDeliveries:12,completedDeliveries:8,pendingDeliveries:4,paymentPending:2},
      assignedDeliveries:[
        ['FLY-ORD-000201','Akhil','9876500001','Near Milma Dairy, Peringolam','Open Map','5:00 PM - 7:00 PM','Assigned'],
        ['FLY-ORD-000202','Fathima','9876500002','Medical College Side','Open Map','6:00 PM - 8:00 PM','Delivered']
      ],
      deliveryPayments:[
        ['FLY-ORD-000203','Vishnu','₹950','UPI','Pending','Confirm with Freshly'],
        ['FLY-ORD-000204','Raji','₹620','UPI','Paid','No action']
      ],
      deliveryEarnings:[
        ['Today','12','8','₹320','Pending settlement'],
        ['This Month','172','151','₹6,040','Processing']
      ]
    },
    district: {
      metrics:{districtOrders:96,activeHubs:8,supplierRequirements:24,districtRevenue:'₹84,600'},
      districtOverview:[
        ['Kunnamangalam Hub','18','7','11','₹14,240','Active'],
        ['Medical College Hub','22','9','13','₹18,720','Active'],
        ['Peringolam Hub','13','5','8','₹9,850','Active']
      ],
      hubPerformance:[
        ['FLY-LHB-000001','Kunnamangalam Hub','18','3','15','0'],
        ['FLY-LHB-000002','Medical College Hub','22','4','18','1']
      ],
      supplierRequirement:[
        ['Sardine / Mathi','Fish & Seafood','42 kg','Beypore Supplier','Required'],
        ['Chicken Curry Cut','Chicken','36 kg','Approved Poultry Supplier','Required'],
        ['Vegetable Combo','Fruits & Vegetables','58 packs','Local Vegetable Supplier','Required']
      ],
      districtStatement:[
        ['Today','96','₹84,600','₹3,200','₹2,640','Pending settlement'],
        ['This Month','1,420','₹12,84,500','₹47,800','₹39,200','Processing']
      ]
    }
  };

  function initPartnerDashboard(){
    const btn = document.querySelector('[data-load-partner-dashboard]');
    if(!btn) return;
    const dateInput = document.querySelector('[data-dashboard-date]');
    if(dateInput && !dateInput.value) dateInput.value = new Date().toISOString().slice(0,10);
    btn.addEventListener('click', async () => {
      const role = btn.getAttribute('data-load-partner-dashboard');
      const partnerId = (document.querySelector('[data-partner-id]')?.value || '').trim();
      const pin = (document.querySelector('[data-partner-pin]')?.value || '').trim();
      const date = (document.querySelector('[data-dashboard-date]')?.value || '').trim();
      if(!partnerId || !pin){
        toast('Enter Freshly Partner ID and PIN.');
        return;
      }
      try{
        let res = cfg.BACKEND_URL ? await api('getPartnerDashboard', {Role:role, PartnerID:partnerId, PIN:pin, Date:date}, 'POST') : null;
        if(!res || !res.ok){
          if(cfg.DEMO_MODE_WHEN_BACKEND_EMPTY) res = {ok:true,data:partnerDemo[role] || {}};
          else throw new Error(res?.message || 'Could not load partner dashboard.');
        }
        renderPartnerDashboard(role, res.data || {});
        toast('Dashboard loaded.');
      }catch(err){
        console.error(err);
        if(cfg.DEMO_MODE_WHEN_BACKEND_EMPTY){
          renderPartnerDashboard(role, partnerDemo[role] || {});
          toast('Demo dashboard loaded.');
        }else{
          toast(err.message || 'Dashboard loading failed.');
        }
      }
    });
    if(cfg.DEMO_MODE_WHEN_BACKEND_EMPTY){
      renderPartnerDashboard(btn.getAttribute('data-load-partner-dashboard'), partnerDemo[btn.getAttribute('data-load-partner-dashboard')] || {});
    }
  }
  function renderPartnerDashboard(role, data){
    Object.entries(data.metrics || {}).forEach(([k,v])=>{
      const el = document.querySelector(`[data-partner-metric="${k}"]`);
      if(el) el.textContent = v;
    });
    Object.entries(data).forEach(([k,rows])=>{
      if(k === 'metrics' || !Array.isArray(rows)) return;
      const body = document.querySelector(`[data-dashboard-table="${k}"]`);
      if(!body) return;
      body.innerHTML = rows.length ? rows.map(row => `<tr>${row.map(cell => {
        const text = esc(cell);
        const isMap = String(cell).toLowerCase().includes('open map');
        return `<td>${isMap ? '<a href="#" class="btn btn-small">Open Map</a>' : text}</td>`;
      }).join('')}</tr>`).join('') : `<tr><td colspan="8" class="muted">No records found.</td></tr>`;
    });
  }


  document.addEventListener("DOMContentLoaded", initPartnerDashboard);
})();
