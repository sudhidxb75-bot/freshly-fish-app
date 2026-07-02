(function(){
  const cfg = window.FRESHLY_CONFIG || {};
  const backendOverrideKey = cfg.BACKEND_URL_STORAGE_KEY || 'freshlyBackendUrl';
  const backendOverride = (localStorage.getItem(backendOverrideKey) || '').trim();
  if(backendOverride) cfg.BACKEND_URL = backendOverride;
  else cfg.BACKEND_URL = String(cfg.BACKEND_URL || '').trim();
  window.setFreshlyBackendUrl = function(url){
    const clean = String(url || '').trim();
    if(clean) localStorage.setItem(backendOverrideKey, clean);
    else localStorage.removeItem(backendOverrideKey);
    location.reload();
  };
  const currency = cfg.CURRENCY || '₹';
  function phoneDigits_(v){ return String(v || '').replace(/\D/g,''); }
  function phoneMatch_(a,b){ const x=phoneDigits_(a), y=phoneDigits_(b); return x && y && (x===y || x.slice(-10)===y.slice(-10)); }
  const state = {
    products: [], categories: [], districts: [], hubs: [], areas: [], slots: [], districtPricing: [], banners: [], countries: [], settings: {},
    selectedCategory: localStorage.getItem('freshlySelectedCategory') || 'all', selectedCountry: localStorage.getItem('freshlyCountry') || cfg.DEFAULT_COUNTRY || 'India', selectedDistrict: localStorage.getItem('freshlyDistrict') || cfg.DEFAULT_DISTRICT_ID || '', selectedPincode: localStorage.getItem('freshlyPincode') || cfg.DEFAULT_PINCODE || '', selectedHub: localStorage.getItem('freshlyHub') || '',
    cart: load('freshlyCart', []), customer: load('freshlyCustomer', null), admin: load('freshlyAdminSession', null)
  };
  const demo = {
    settings:{BRAND_NAME:'Freshly',UPI_ID:'freshly@upi'},
    countries:[{CountryID:'IN',CountryName:'India',Status:'Active'},{CountryID:'AE',CountryName:'United Arab Emirates',Status:'Active'}],
    banners:[
      {BannerID:'BAN001',BannerTitle:'Today’s Fresh Offer',Title:'Today’s Fresh Offer',Subtitle:'Fresh Fish & Seafood, meat and essentials delivered through your nearby hub.',DesktopImageURL:'assets/images/banner-hub-partner.png',MobileImageURL:'assets/images/banner-hub-partner.png',ImageURL:'assets/images/banner-hub-partner.png',BannerLink:'#shop',ButtonText:'Shop Now',ButtonLink:'#shop',DisplayPage:'Home',SortOrder:1,Status:'Active',OpenInNewTab:'No',DisplayMode:'ImageOnly'},
      {BannerID:'BAN002',BannerTitle:'Become a Freshly Hub Partner',Title:'Become a Freshly Hub Partner',Subtitle:'Start earning from your local area with low investment and strong support.',DesktopImageURL:'assets/images/banner-hub-partner-earnings.png',MobileImageURL:'assets/images/banner-hub-partner-earnings.png',ImageURL:'assets/images/banner-hub-partner-earnings.png',BannerLink:'join-freshly.html',ButtonText:'Register Now',ButtonLink:'join-freshly.html',DisplayPage:'Home',SortOrder:2,Status:'Active',OpenInNewTab:'No',DisplayMode:'ImageOnly'},
      {BannerID:'BAN003',BannerTitle:'Register as Freshly Supplier',Title:'Register as Freshly Supplier',Subtitle:'Supply to Freshly and grow with organized demand.',DesktopImageURL:'assets/images/banner-supplier.png',MobileImageURL:'assets/images/banner-supplier.png',ImageURL:'assets/images/banner-supplier.png',BannerLink:'join-freshly.html#supplier',ButtonText:'Register as Supplier',ButtonLink:'join-freshly.html#supplier',DisplayPage:'Home',SortOrder:3,Status:'Active',OpenInNewTab:'No',DisplayMode:'ImageOnly'}
    ],
    districts:[{DistrictID:'FLY-DST-000001',DistrictName:'Kozhikode',State:'Kerala',Status:'Active'},{DistrictID:'FLY-DST-000002',DistrictName:'Malappuram',State:'Kerala',Status:'Coming Soon'}],
    categories:[
      {CategoryID:'CAT-FISHSEA',Name:'Fish & Seafood',SortOrder:1,Status:'Active'},
      {CategoryID:'CAT-CHICKEN',Name:'Chicken',SortOrder:2,Status:'Active'},
      {CategoryID:'CAT-MUTTON',Name:'Mutton',SortOrder:3,Status:'Active'},
      {CategoryID:'CAT-EGGS',Name:'Eggs',SortOrder:4,Status:'Active'},
      {CategoryID:'CAT-FV',Name:'Fruits & Vegetables',SortOrder:5,Status:'Active'},
      {CategoryID:'CAT-FOOD',Name:'Food',SortOrder:6,Status:'Active'},
      {CategoryID:'CAT-GROCERY',Name:'Groceries',SortOrder:7,Status:'Active'},
      {CategoryID:'CAT-ESSENTIALS',Name:'Daily Essentials',SortOrder:8,Status:'Active'},
      {CategoryID:'CAT-READY',Name:'Ready to Cook',SortOrder:9,Status:'Active'},
      {CategoryID:'CAT-COMBO',Name:'Combo Packs',SortOrder:10,Status:'Active'},
      {CategoryID:'CAT-FRESHLYMART',Name:'Freshly Mart',SortOrder:11,Status:'Active'}
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
  function init(){ setYear(); applyConfiguredContacts(); bindNav(); bindLocationDropdown(); bindPromoSlider(); bindGenericForms(); bindPortalForms(); bindCustomerAuthTabs(); bindTrackOrder(); bindCustomerOrders(); bindCheckout(); bindCheckoutLocation(); bindAdmin(); if(document.querySelector('#shop') || document.querySelector('#productGrid')) loadPublicData(); updateCustomerUI(); updateCartUI(); if(document.querySelector('#customerOrdersBox')) loadCustomerOrders(); }
  function setYear(){ document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear()); }
  function cleanPhoneNumber(value){ return String(value || '').replace(/\D/g, ''); }
  function formatIndianPhone(value){
    const n = cleanPhoneNumber(value);
    if(!n) return '';
    if(n.length === 12 && n.startsWith('91')) return '+91 ' + n.slice(2,7) + ' ' + n.slice(7);
    if(n.length === 10) return '+91 ' + n.slice(0,5) + ' ' + n.slice(5);
    return '+' + n;
  }
  function getConfiguredWhatsAppNumber(){
    return cleanPhoneNumber(cfg.WHATSAPP_NUMBER || cfg.SUPPORT_WHATSAPP || state.settings?.SUPPORT_WHATSAPP || state.settings?.ADMIN_WHATSAPP || '');
  }
  function applyConfiguredContacts(){
    const whatsappNumber = getConfiguredWhatsAppNumber();
    const whatsappDisplay = cfg.WHATSAPP_DISPLAY_NUMBER || formatIndianPhone(whatsappNumber) || 'WhatsApp';
    if(whatsappNumber){
      document.querySelectorAll('a[href*="wa.me/"], a[data-freshly-whatsapp]').forEach(a => {
        a.href = 'https://wa.me/' + whatsappNumber;
        a.target = '_blank';
        a.rel = 'noopener';
        if(!a.dataset.keepText) a.textContent = /whatsapp/i.test(a.textContent || '') ? 'WhatsApp' : whatsappDisplay;
      });
    }
    const supportPhoneRaw = cfg.SUPPORT_PHONE || cfg.WHATSAPP_DISPLAY_NUMBER || state.settings?.SUPPORT_PHONE || whatsappNumber;
    const supportPhone = cleanPhoneNumber(supportPhoneRaw);
    if(supportPhone){
      const supportDisplay = cfg.SUPPORT_PHONE || cfg.WHATSAPP_DISPLAY_NUMBER || formatIndianPhone(supportPhone);
      document.querySelectorAll('a[href^="tel:"], a[data-freshly-phone]').forEach(a => {
        a.href = 'tel:+' + supportPhone;
        if(!a.dataset.keepText) a.textContent = supportDisplay;
      });
    }
  }

  function bindNav(){
    document.querySelectorAll('.mobile-toggle').forEach(btn => btn.addEventListener('click',()=>document.querySelector('.menu')?.classList.toggle('open')));
    document.querySelectorAll('[data-open-cart]').forEach(btn=>btn.addEventListener('click',openCart));
    document.querySelectorAll('[data-close-cart]').forEach(btn=>btn.addEventListener('click',closeCart));
    document.querySelectorAll('[data-open-checkout]').forEach(btn=>btn.addEventListener('click',startCheckout));
    document.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.modal')?.classList.remove('open'))); document.querySelectorAll('[data-product-window-close]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('#productWindowModal')?.classList.remove('open')));
    document.querySelectorAll('[data-logout]').forEach(btn=>btn.addEventListener('click',()=>{localStorage.removeItem('freshlyCustomer');state.customer=null;updateCustomerUI();toast('Logged out. You can still shop and login at checkout.')}));
    document.querySelectorAll('[data-menu-cat],[data-mobile-category]').forEach(a=>{
      if(a.dataset.categoryRouterBound === 'yes') return;
      a.dataset.categoryRouterBound = 'yes';
      a.addEventListener('click',e=>{
        const cat = a.dataset.menuCat || a.dataset.mobileCategory || a.dataset.cat || a.textContent;
        if(cat){
          e.preventDefault();
          openShopCategory_(cat,{clearSearch:true});
        }
      }, true);
    });
  }

  function bindLocationDropdown(){
    const toggle = document.querySelector('[data-location-toggle]');
    const panel = document.querySelector('[data-location-panel]');
    if(!toggle || !panel) return;
    toggle.addEventListener('click', (e)=>{ e.stopPropagation(); panel.classList.toggle('open'); });
    panel.addEventListener('click', e=>e.stopPropagation());
    document.addEventListener('click', ()=>panel.classList.remove('open'));
  }


  function bannerValue_(b, keys){
    b = b || {};
    for(const key of keys){
      if(b[key] !== undefined && b[key] !== null && String(b[key]).trim() !== '') return String(b[key]).trim();
    }
    const wanted = keys.map(k => String(k).toLowerCase().replace(/[^a-z0-9]/g,''));
    for(const k of Object.keys(b)){
      const nk = String(k).toLowerCase().replace(/[^a-z0-9]/g,'');
      if(wanted.includes(nk) && String(b[k] || '').trim()) return String(b[k]).trim();
    }
    return '';
  }

  function bannerImageUrl_(b){
    // Desktop/default banner image. FreshlyMart-style DesktopImageURL is preferred.
    return bannerValue_(b, [
      'DesktopImageURL','DesktopImageUrl','Desktop Image URL','Desktop Banner Image','DesktopBannerImageURL','Desktop Banner Image URL',
      'ImageURL','ImageUrl','Image URL','Image Url','BannerImageURL','Banner Image URL','BannerImage','Banner Image',
      'Image','PhotoURL','Photo URL','PictureURL','Picture URL','Photo','Picture'
    ]);
  }

  function bannerMobileImageUrl_(b){
    // Mobile image is used only on mobile; if blank, it falls back to the desktop/default image.
    return bannerValue_(b, [
      'MobileImageURL','MobileImageUrl','Mobile Image URL','MobileImage','Mobile Banner Image','MobileBannerImageURL','Mobile Banner Image URL',
      'MobileImage','Mobile Image','AppImageURL','App Image URL','PWAImageURL','PWA Image URL'
    ]) || bannerImageUrl_(b);
  }

  function bannerTitle_(b){
    return bannerValue_(b, ['BannerTitle','Banner Title','Title','Heading','Headline','Label']) || 'Freshness Delivered';
  }

  function bannerDate_(value){
    const raw = String(value || '').trim();
    if(!raw) return null;
    const iso = raw.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if(iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);
    const dmy = raw.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if(dmy) return new Date(+dmy[3], +dmy[2] - 1, +dmy[1]);
    const d = new Date(raw);
    return Number.isFinite(d.getTime()) ? d : null;
  }

  function currentBannerPage_(){
    const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if(!file || file === 'index.html') return 'home';
    return file.replace(/\.html?$/,'');
  }

  function bannerMatchesPage_(b){
    const raw = bannerValue_(b, ['DisplayPage','Display Page','Page','ShowOn','Show On','Placement','Screen']) || 'Home';
    const page = currentBannerPage_();
    const pages = String(raw).split(/[,|;]/).map(p => p.trim().toLowerCase()).filter(Boolean);
    return !pages.length || pages.includes('all') || pages.includes('*') || pages.includes(page) || (page === 'home' && pages.includes('index'));
  }

  function bannerIsActive_(b){
    const s = String(b?.Status ?? b?.Active ?? b?.Show ?? 'Active').trim().toLowerCase();
    const statusOk = !s || ['active','yes','true','1','show','published','visible'].includes(s);
    if(!statusOk || !bannerMatchesPage_(b)) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    const start = bannerDate_(bannerValue_(b, ['StartDate','Start Date','ValidFrom','Valid From','FromDate','From Date']));
    const end = bannerDate_(bannerValue_(b, ['EndDate','End Date','ValidTo','Valid To','ToDate','To Date']));
    if(start){ start.setHours(0,0,0,0); if(today < start) return false; }
    if(end){ end.setHours(0,0,0,0); if(today > end) return false; }
    return true;
  }

  function fallbackBannerImage_(idx){
    const imgs = [
      'assets/images/banner-hub-partner-earnings.png',
      'assets/images/banner-hub-partner.png',
      'assets/images/banner-supplier.png'
    ];
    return imgs[Math.abs(Number(idx)||0) % imgs.length];
  }

  function normalizeBannerImageUrl_(value){
    let url = String(value || '').trim();
    if(!url) return '';
    // Make common Google Drive share links usable as direct image sources.
    const driveFile = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    const driveOpen = url.match(/drive\.google\.com\/(?:open|uc)\?[^#]*[?&]?id=([^&]+)/i) || url.match(/[?&]id=([^&]+)/i);
    const driveId = driveFile ? driveFile[1] : (driveOpen ? driveOpen[1] : '');
    if(driveId && /drive\.google\.com/i.test(url)){
      return 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(decodeURIComponent(driveId));
    }
    if(/^http:\/\//i.test(url)) url = 'https://' + url.slice(7);
    return url;
  }

  function normalizeBanner_(b, source, idx){
    const desktopImage = normalizeBannerImageUrl_(bannerImageUrl_(b));
    const mobileImage = normalizeBannerImageUrl_(bannerMobileImageUrl_(b)) || desktopImage;
    const image = desktopImage || mobileImage;
    return Object.assign({}, b, {
      ImageURL: desktopImage || mobileImage,
      MobileImageURL: mobileImage || desktopImage,
      Title: bannerTitle_(b),
      Subtitle: bannerValue_(b, ['Subtitle','SubTitle','BannerSubtitle','Banner Subtitle','Description','Caption']),
      ButtonText: bannerValue_(b, ['ButtonText','Button Text','CTA','CTA Text']) || b.ButtonText || '',
      ButtonLink: bannerValue_(b, ['BannerLink','Banner Link','ButtonLink','Button Link','CTA Link','Link','URL']) || b.ButtonLink || b.BannerLink || '#shop',
      BannerLink: bannerValue_(b, ['BannerLink','Banner Link','ButtonLink','Button Link','CTA Link','Link','URL']) || b.BannerLink || b.ButtonLink || '#shop',
      OpenInNewTab: bannerValue_(b, ['OpenInNewTab','Open In New Tab','NewTab','New Tab']) || b.OpenInNewTab || 'No',
      DisplayPage: bannerValue_(b, ['DisplayPage','Display Page','Page','ShowOn','Placement']) || b.DisplayPage || 'Home',
      SortOrder: b.SortOrder || b.Order || b.Sequence || (idx + 1),
      Status: b.Status || 'Active',
      DisplayMode: b.DisplayMode || (image ? 'ImageOnly' : 'OverlayText'),
      HideTextOverlay: b.HideTextOverlay || (image ? 'Yes' : ''),
      _BannerSource: source || '',
      _FallbackImage: fallbackBannerImage_(idx)
    });
  }

  function normalizeBanners_(rows, source){
    return (rows || []).map((b, idx) => normalizeBanner_(b, source, idx)).filter(b => bannerIsActive_(b));
  }

  function isMobileBannerView_(){ return window.matchMedia && window.matchMedia('(max-width:760px)').matches; }
  function renderPromoSlider(){
    const slider = document.querySelector('.promo-slider');
    const track = document.querySelector('[data-promo-track]');
    const dotsBox = document.querySelector('[data-promo-dots]');
    if(!track) return;

    const backendRows = Array.isArray(state.banners) ? state.banners : [];
    const demoRows = Array.isArray(demo.banners) ? demo.banners : [];

    let banners = normalizeBanners_(backendRows.length ? backendRows : demoRows, backendRows.length ? 'backend' : 'local')
      .filter(b => String(b.ImageURL || b.MobileImageURL || b.Title || '').trim())
      .sort((a,b)=>(+a.SortOrder||999)-(+b.SortOrder||999));

    if(!banners.length){
      banners = normalizeBanners_(demoRows, 'local-fallback')
        .filter(b => String(b.ImageURL || b.MobileImageURL || b.Title || '').trim())
        .sort((a,b)=>(+a.SortOrder||999)-(+b.SortOrder||999));
    }

    if(isMobileBannerView_()){
      const imageBanners = banners.filter(b => String(b.MobileImageURL || b.ImageURL || '').trim());
      banners = imageBanners.length ? imageBanners : normalizeBanners_(demoRows, 'mobile-local-fallback');
    }

    if(!banners.length){
      if(slider) slider.classList.add('hidden');
      return;
    }

    if(slider){
      slider.classList.remove('hidden');
      slider.style.overflow = 'hidden';
      slider.style.width = '100%';
      slider.dataset.bannerCount = String(banners.length);
    }

    const total = Math.max(1, banners.length);
    track.classList.add('freshly-banner-track-ready');
    track.style.display = 'flex';
    track.style.flexWrap = 'nowrap';
    track.style.width = '100%';
    track.style.maxWidth = '100%';
    track.style.overflow = 'visible';
    track.style.transition = 'transform .45s ease';
    track.style.willChange = 'transform';
    track.style.transform = 'translate3d(0,0,0)';
    track.dataset.bannerCount = String(total);
    track.innerHTML = banners.map((b,idx)=>promoSlide(b,idx)).join('');
    [...track.children].forEach(slide=>{
      slide.style.flex = '0 0 100%';
      slide.style.minWidth = '100%';
      slide.style.width = '100%';
      slide.style.maxWidth = '100%';
    });
    if(dotsBox){
      dotsBox.innerHTML = total > 1
        ? banners.map((b,idx)=>`<button type="button" data-promo-dot="${idx}" class="${idx===0?'active':''}" aria-label="Promotion ${idx+1}"></button>`).join('')
        : '';
    }
    bindPromoSlider();
    setTimeout(()=>{ if(window.freshlyMobileSafeLayout) window.freshlyMobileSafeLayout(); }, 120);
  }
  function promoSlide(b, idx){
    const image = normalizeBannerImageUrl_(isMobileBannerView_() ? (b.MobileImageURL || bannerImageUrl_(b)) : bannerImageUrl_(b));
    const displayModeRaw = String(b.DisplayMode || '').trim().toLowerCase();
    const showOverlayRaw = String(b.ShowTextOverlay || b.ShowOverlay || '').trim().toLowerCase();
    const hideOverlayRaw = String(b.HideTextOverlay || '').trim().toLowerCase();
    const wantsTextOverlay = ['yes','true','1','show','active'].includes(showOverlayRaw);
    const hideTextOverlay = ['yes','true','1','hide','active'].includes(hideOverlayRaw);
    const displayMode = image && !wantsTextOverlay ? 'imageonly' : (displayModeRaw || (image ? 'imageonly' : 'overlaytext'));
    const title = esc(bannerTitle_(b));
    const sub = esc(b.Subtitle || b.Description || b.Caption || 'Choose fresh products, easy ordering and convenient pickup or delivery.');
    const btnText = esc(b.ButtonText || 'Shop Now');
    const btnLink = esc(b.BannerLink || b.ButtonLink || '#shop');
    const openNew = ['yes','true','1','new','blank'].includes(String(b.OpenInNewTab || '').trim().toLowerCase());
    const linkAttrs = openNew ? ' target="_blank" rel="noopener"' : '';
    const label = esc(b.Label || b.Tagline || 'Freshly');

    const toPx = (value, fallback, min, max) => {
      const n = parseInt(String(value || '').replace(/[^0-9]/g,''), 10);
      if(!Number.isFinite(n)) return fallback;
      return Math.max(min, Math.min(max, n));
    };
    const cleanFit = (value) => {
      const v = String(value || 'cover').trim().toLowerCase();
      return ['cover','contain','fill'].includes(v) ? v : 'cover';
    };
    const desktopHeight = toPx(b.DesktopHeight || b.BannerHeight || b.Height, 340, 140, 800);
    const mobileHeight = toPx(b.MobileHeight || b.MobileBannerHeight || '', 230, 120, 520);
    const objectFit = cleanFit(b.ObjectFit);
  const mobileObjectFit = cleanFit(b.MobileObjectFit || b.MobileFit || b.MobileImageFit || 'contain');
  const mobileObjectPosition = String(b.MobileObjectPosition || b.MobilePosition || 'center top').trim() || 'center top';
  const mobileTopShift = String(b.MobileTopShift || b.MobileBannerTopShift || '0px').trim() || '0px';
    const objectPosition = esc(b.ObjectPosition || 'center center');
    const cssVars = `--banner-desktop-height:${desktopHeight}px;--banner-mobile-height:${mobileHeight}px;--banner-object-fit:${objectFit};--banner-mobile-object-fit:${mobileObjectFit};--banner-object-position:${objectPosition};--banner-mobile-object-position:${mobileObjectPosition};--banner-mobile-top-shift:${mobileTopShift};`;

    if(image && (displayMode === 'imageonly' || hideTextOverlay || !wantsTextOverlay)){
      const imageButton = btnText ? `<a class="btn btn-primary banner-floating-btn" href="${btnLink}"${linkAttrs}>${btnText}</a>` : '';
      return `<article class="promo-slide backend-banner image-only" style="${cssVars}" data-banner-source="${esc(b._BannerSource || '')}">
        <a class="banner-image-link" href="${btnLink}" aria-label="${title}"${linkAttrs}>
          <img data-banner-img src="${esc(image)}" data-fallback-src="${esc(b._FallbackImage || fallbackBannerImage_(idx))}" alt="${title}"
            onload="this.closest('.promo-slide')?.classList.remove('banner-image-error');"
            onerror="if(!this.dataset.fallbackUsed){this.dataset.fallbackUsed='1';this.src=this.dataset.fallbackSrc;}else{this.closest('.promo-slide')?.classList.add('banner-image-error');window.freshlyMobileSafeLayout&&window.freshlyMobileSafeLayout();}">
        </a>${imageButton}</article>`;
    }

    const bg = image ? `background-image:linear-gradient(90deg,rgba(255,255,255,.95),rgba(255,255,255,.64),rgba(255,255,255,.08)),url('${esc(image)}');` : '';
    return `<article class="promo-slide backend-banner ${image?'has-image':''}" style="${cssVars}${bg}"><div class="banner-copy"><span class="eyebrow">${label}</span><h2>${title}</h2><p>${sub}</p></div><a class="btn btn-primary banner-main-btn" href="${btnLink}"${linkAttrs}>${btnText}</a></article>`;
  }
  function bindPromoSlider(){
    const track = document.querySelector('[data-promo-track]');
    if(!track) return;
    const dots = [...document.querySelectorAll('[data-promo-dot]')];
    const slides = [...track.children].filter(el => el.classList.contains('promo-slide'));
    const total = Math.max(1, slides.length || dots.length || 1);
    let i = 0;
    const go = n => {
      i = ((n % total) + total) % total;
      track.style.transform = `translate3d(-${i*100}%,0,0)`;
      dots.forEach((d,idx)=>d.classList.toggle('active', idx===i));
    };
    dots.forEach((d,idx)=>{
      if(d.dataset.promoDotBound === 'yes') return;
      d.dataset.promoDotBound = 'yes';
      d.addEventListener('click',()=>go(idx));
    });
    if(window.freshlyPromoTimer) clearInterval(window.freshlyPromoTimer);
    go(0);
    if(total > 1) window.freshlyPromoTimer = setInterval(()=>go((i+1)%total), 4500);
    window.freshlyPromoGo = go;
  }


  async function loadPublicData(){
    try{
      let res = cfg.BACKEND_URL ? await api('getPublicData', {}, 'GET') : null;
      if(!res || !res.ok){ if(cfg.DEMO_MODE_WHEN_BACKEND_EMPTY) res = {ok:true,data:demo}; else throw new Error(res?.message || 'Backend not configured'); }
      const p = res.data || res;
      ['categories','products','districts','hubs','areas','slots','districtPricing','banners','countries'].forEach(k => state[k] = p[k] || demo[k] || []);
      state.settings = p.settings || demo.settings || {};
      applyConfiguredContacts(); renderLocationSelectors(); renderPromoSlider(); renderCategories(); renderProducts(); renderCheckoutLocationControls(); renderProductDetailsPage();
    }catch(err){ console.error(err); if(cfg.DEMO_MODE_WHEN_BACKEND_EMPTY){ Object.assign(state, demo); applyConfiguredContacts(); renderLocationSelectors(); renderPromoSlider(); renderCategories(); renderProducts(); renderCheckoutLocationControls(); renderProductDetailsPage(); } else toast('Could not load catalogue. Check backend URL.'); }
  }

  function cleanKey_(v){ return String(v || '').trim().toLowerCase().replace(/[^a-z0-9]+/g,''); }
  function valueFrom_(row, keys){
    row = row || {};
    for(const key of keys){
      if(row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') return String(row[key]).trim();
    }
    const wanted = keys.map(k => cleanKey_(k));
    for(const k of Object.keys(row)){
      if(wanted.includes(cleanKey_(k)) && String(row[k] || '').trim()) return String(row[k]).trim();
    }
    return '';
  }
  function countryValues_(row){
    return [
      valueFrom_(row, ['CountryID','Country ID','CountryCode','Country Code','Country','CountryName','Country Name']),
      row?.CountryID, row?.CountryCode, row?.Country, row?.CountryName
    ].filter(v => String(v || '').trim()).map(v => String(v).trim());
  }
  function selectedCountryValues_(selected){
    const raw = String(selected || '').trim();
    if(!raw) return [];
    const rows = Array.isArray(state.countries) ? state.countries : [];
    const vals = [raw];
    rows.forEach(c => {
      const cvals = countryValues_(c);
      if(cvals.some(v => cleanKey_(v) === cleanKey_(raw))){ vals.push(...cvals); }
    });
    return [...new Set(vals.filter(Boolean))];
  }
  function countryMatches_(row, selected){
    const selectedVals = selectedCountryValues_(selected);
    if(!selectedVals.length) return true;
    const rowVals = countryValues_(row);
    if(!rowVals.length) return true;
    return rowVals.some(v => selectedVals.some(s => cleanKey_(v) === cleanKey_(s)));
  }
  function countryId_(row){ return valueFrom_(row, ['CountryID','Country ID','CountryCode','Country Code','CountryName','Country Name','Country','Name']) || 'India'; }
  function countryName_(row){ return valueFrom_(row, ['CountryName','Country Name','Name','Country','CountryCode','Country Code','CountryID','Country ID']) || 'India'; }
  function districtId_(row){ return valueFrom_(row, ['DistrictID','District ID','DistrictCode','District Code','CityID','City ID','EmirateID','Emirate ID','DistrictName','District Name','City','Name']); }
  function districtName_(row){ return valueFrom_(row, ['DistrictName','District Name','City','CityName','City Name','Emirate','EmirateName','Name','DistrictID','District ID']); }
  function districtMatches_(row, selected){
    const selectedValue = String(selected || '').trim();
    if(!selectedValue) return true;
    const vals = [districtId_(row), districtName_(row), row?.DistrictID, row?.DistrictName, row?.City, row?.Name].filter(Boolean);
    if(!vals.length) return true;
    return vals.some(v => cleanKey_(v) === cleanKey_(selectedValue));
  }
  function areaLabel_(row){
    const area = valueFrom_(row, ['Area','AreaName','Area Name','Location','Locality','PincodeArea','Pincode Area']);
    const pin = valueFrom_(row, ['Pincode','PinCode','PIN','Pin','PostalCode','Postal Code','Zip','ZipCode']);
    const hub = valueFrom_(row, ['HubName','Hub Name','FreshlyHub','Freshly Hub']);
    return [area, pin, hub].filter(Boolean).join(' - ') || 'Select Area';
  }
  function areaPincode_(row){ return valueFrom_(row, ['Pincode','PinCode','PIN','Pin','PostalCode','Postal Code','Zip','ZipCode','Area','AreaName','Area Name','Location']); }
  function areaHubId_(row){ return valueFrom_(row, ['HubID','Hub ID','FreshlyHubID','Freshly Hub ID']); }
  function locationAreaOptions_(){
    const rows = [];
    activeRows(state.areas || []).forEach(a => {
      if(countryMatches_(a, state.selectedCountry) && districtMatches_(a, state.selectedDistrict)){
        rows.push({label:areaLabel_(a), pincode:areaPincode_(a), hubId:areaHubId_(a), source:'area'});
      }
    });
    activeRows(state.hubs || []).forEach(h => {
      if(countryMatches_(h, state.selectedCountry) && districtMatches_(h, state.selectedDistrict)){
        rows.push({label:areaLabel_(h), pincode:areaPincode_(h), hubId:areaHubId_(h) || h.HubID, source:'hub'});
      }
    });
    const seen = new Set();
    return rows.filter(r => {
      const key = cleanKey_((r.pincode || '') + '|' + (r.hubId || '') + '|' + (r.label || ''));
      if(!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderLocationSelectors(){
    const countrySel = document.querySelector('#countrySelect');
    if(countrySel){
      const countryRows = activeRows(state.countries || []);
      let countries = countryRows.length ? countryRows : [];
      if(!countries.length){
        const names = [...new Set([...(state.districts||[]).flatMap(d=>countryValues_(d)), ...(state.hubs||[]).flatMap(h=>countryValues_(h))].filter(Boolean))];
        countries = names.length ? names.map(n=>({CountryID:n,CountryName:n,Status:'Active'})) : [{CountryID:'India',CountryName:'India',Status:'Active'}];
      }
      countrySel.innerHTML = `<option value="">Select Country</option>` + countries.map(c=>{
        const id = countryId_(c);
        const name = countryName_(c);
        const selected = countryMatches_(c, state.selectedCountry) ? 'selected' : '';
        return `<option value="${esc(id)}" ${selected}>${esc(name)}</option>`;
      }).join('');
      countrySel.onchange=()=>{
        state.selectedCountry=countrySel.value;
        state.selectedDistrict='';
        state.selectedPincode='';
        state.selectedHub='';
        saveLocation();
        renderLocationSelectors();
        renderProducts();
        renderCheckoutLocationControls();
      };
    }

    const distSel = document.querySelector('#districtSelect');
    if(distSel){
      const districts = activeRows(state.districts).filter(d => countryMatches_(d, state.selectedCountry));
      distSel.innerHTML = `<option value="">Select District / City</option>` + districts.map(d=>{
        const id = districtId_(d);
        const name = districtName_(d);
        return `<option value="${esc(id)}" ${cleanKey_(id)===cleanKey_(state.selectedDistrict)?'selected':''}>${esc(name)}</option>`;
      }).join('');
      distSel.onchange=()=>{
        state.selectedDistrict=distSel.value;
        state.selectedPincode='';
        state.selectedHub='';
        saveLocation();
        renderLocationSelectors();
        renderProducts();
        renderCheckoutLocationControls();
      };
    }

    const pin = document.querySelector('#pincodeInput');
    if(pin){
      pin.value = state.selectedPincode || '';
      pin.oninput=()=>{
        state.selectedPincode=pin.value.trim();
        state.selectedHub='';
        saveLocation();
        renderHubDropdown('#hubSelect');
      };
    }

    const areaSel = document.querySelector('#areaSelect');
    if(areaSel){
      const opts = locationAreaOptions_();
      areaSel.innerHTML = `<option value="">Select Area / Pincode</option>` + opts.map((o,idx)=>{
        const selected = (cleanKey_(o.pincode) && cleanKey_(o.pincode)===cleanKey_(state.selectedPincode)) || (o.hubId && o.hubId===state.selectedHub);
        return `<option value="${idx}" data-pincode="${esc(o.pincode || '')}" data-hub-id="${esc(o.hubId || '')}" ${selected?'selected':''}>${esc(o.label)}</option>`;
      }).join('');
      areaSel.onchange=()=>{
        const opt = areaSel.selectedOptions && areaSel.selectedOptions[0];
        if(opt){
          state.selectedPincode = opt.dataset.pincode || '';
          state.selectedHub = opt.dataset.hubId || '';
          const pinBox = document.querySelector('#pincodeInput');
          if(pinBox) pinBox.value = state.selectedPincode;
        }
        saveLocation();
        renderHubDropdown('#hubSelect');
        updateLocationToggleLabel_();
      };
    }

    const btn = document.querySelector('#checkPincodeBtn'); if(btn) btn.onclick = checkPincodeHubs;
    const confirmBtn = document.querySelector('#confirmLocationBtn'); if(confirmBtn) confirmBtn.onclick = confirmFreshlyLocation;
    updateLocationToggleLabel_();
    renderHubDropdown('#hubSelect');
  }
  function checkPincodeHubs(){
    const box = document.querySelector('#locationResult');
    const hubs = matchingHubs();
    renderHubDropdown('#hubSelect');
    if(hubs.length === 1 && !state.selectedHub){
      state.selectedHub = hubs[0].HubID || hubs[0].HubId || hubs[0].HubName || '';
      renderHubDropdown('#hubSelect');
    }
    if(box){
      box.classList.remove('hidden');
      box.className='notice mini';
      box.innerHTML = hubs.length
        ? `<b>${hubs.length} Freshly Hub(s) found.</b> Select a hub and tap <b>Confirm Location</b>.`
        : `<b>Freshly is not active for this pincode/area yet.</b> Use Join Freshly → Start Freshly in My Area.`;
    }
  }
  function matchingHubs(){
    const pin = String(state.selectedPincode || '').trim().toLowerCase();
    return activeRows(state.hubs).filter(h => {
      const countryOk = countryMatches_(h, state.selectedCountry);
      const districtOk = districtMatches_(h, state.selectedDistrict);
      const hubPin = String(valueFrom_(h, ['Pincode','PinCode','PIN','Pin','PostalCode','Postal Code','Zip','ZipCode']) || '').trim().toLowerCase();
      const area = String(valueFrom_(h, ['Area','AreaName','Area Name','Location','Locality']) || '').trim().toLowerCase();
      const linkedAreaOk = activeRows(state.areas || []).some(a => {
        const areaHub = areaHubId_(a);
        if(areaHub && areaHub !== (h.HubID || h.HubId)) return false;
        if(!countryMatches_(a, state.selectedCountry) || !districtMatches_(a, state.selectedDistrict)) return false;
        const aPin = String(areaPincode_(a) || '').trim().toLowerCase();
        const aArea = String(valueFrom_(a, ['Area','AreaName','Area Name','Location','Locality']) || '').trim().toLowerCase();
        return !pin || aPin === pin || aArea === pin || aArea.includes(pin) || pin.includes(aArea);
      });
      const pinOk = !pin || hubPin === pin || area === pin || (area && area.includes(pin)) || (pin && pin.includes(area)) || linkedAreaOk;
      return countryOk && districtOk && pinOk;
    });
  }
  function renderHubDropdown(sel){
    document.querySelectorAll(sel).forEach(el=>{
      const hubs = matchingHubs();
      if(state.selectedHub && !hubs.some(h => (h.HubID || h.HubId) === state.selectedHub)) state.selectedHub = '';
      el.innerHTML = `<option value="">Choose Freshly Hub</option>` + hubs.map(h=>{
        const id = h.HubID || h.HubId || h.HubName;
        return `<option value="${esc(id)}" ${id===state.selectedHub?'selected':''}>${esc(h.HubName || h.Name || id)} - ${esc(h.Area || h.Pincode || '')}</option>`;
      }).join('');
      el.onchange=()=>{
        state.selectedHub=el.value;
        saveLocation();
        updateLocationToggleLabel_();
        renderSlots();
      };
    });
  }
  function selectedHubRow_(){ return activeRows(state.hubs).find(h => (h.HubID || h.HubId || h.HubName) === state.selectedHub) || null; }
  function updateLocationToggleLabel_(){
    const toggle = document.querySelector('[data-location-toggle]');
    if(!toggle) return;
    const hub = selectedHubRow_();
    if(hub){
      toggle.textContent = '📍 ' + (hub.HubName || 'Freshly Hub') + (hub.Area ? ' - ' + hub.Area : '') + ' ▾';
      toggle.classList.add('location-confirmed');
    }else{
      toggle.textContent = '📍 Set your Freshly location ▾';
      toggle.classList.remove('location-confirmed');
    }
  }
  function confirmFreshlyLocation(){
    const box = document.querySelector('#locationResult');
    const hubs = matchingHubs();
    if(!state.selectedCountry){
      if(box){ box.classList.remove('hidden'); box.className='notice mini warning'; box.innerHTML='<b>Please select country.</b>'; }
      return;
    }
    if(!state.selectedDistrict){
      if(box){ box.classList.remove('hidden'); box.className='notice mini warning'; box.innerHTML='<b>Please select district / city.</b>'; }
      return;
    }
    if(!state.selectedHub && hubs.length === 1) state.selectedHub = hubs[0].HubID || hubs[0].HubId || hubs[0].HubName || '';
    if(!state.selectedHub){
      if(box){ box.classList.remove('hidden'); box.className='notice mini warning'; box.innerHTML='<b>Please choose a Freshly Hub and confirm.</b>'; }
      return;
    }
    saveLocation();
    updateLocationToggleLabel_();
    renderCheckoutLocationControls();
    renderProducts();
    const hub = selectedHubRow_();
    if(box){
      box.classList.remove('hidden');
      box.className='notice mini success';
      box.innerHTML = `<b>Location confirmed.</b> ${esc(hub?.HubName || 'Freshly Hub')}${hub?.Area ? ' - ' + esc(hub.Area) : ''}`;
    }
    document.querySelector('[data-location-panel]')?.classList.remove('open');
  }
  function saveLocation(){ localStorage.setItem('freshlyCountry',state.selectedCountry||''); localStorage.setItem('freshlyDistrict',state.selectedDistrict||''); localStorage.setItem('freshlyPincode',state.selectedPincode||''); localStorage.setItem('freshlyHub',state.selectedHub||''); }



  function categoryKey_(v){
    return String(v || '')
      .toLowerCase()
      .replace(/&/g,'and')
      .replace(/\+/g,'and')
      .replace(/[^a-z0-9]+/g,'')
      .trim();
  }

  function fixedCategoryAlias_(input){
    const k = categoryKey_(input);
    const map = {
      all:'all',
      fish:'CAT-FISHSEA',
      fishseafood:'CAT-FISHSEA',
      fishandseafood:'CAT-FISHSEA',
      seafood:'CAT-FISHSEA',
      chicken:'CAT-CHICKEN',
      mutton:'CAT-MUTTON',
      meat:'CAT-MUTTON',
      eggs:'CAT-EGGS',
      egg:'CAT-EGGS',
      fruitsvegetables:'CAT-FV',
      fruitsandvegetables:'CAT-FV',
      fruitsveg:'CAT-FV',
      fruitsandveg:'CAT-FV',
      fruits:'CAT-FV',
      vegetables:'CAT-FV',
      food:'CAT-FOOD',
      groceries:'CAT-GROCERY',
      grocery:'CAT-GROCERY',
      dailyessentials:'CAT-ESSENTIALS',
      essentials:'CAT-ESSENTIALS',
      readytocook:'CAT-READY',
      readycook:'CAT-READY',
      combopacks:'CAT-COMBO',
      combo:'CAT-COMBO',
      freshlymart:'CAT-FRESHLYMART',
      mart:'CAT-FRESHLYMART'
    };
    return map[k] || '';
  }

  function categoriesForRouting_(){
    const fromSheet = activeRows(state.categories || []);
    return fromSheet.length ? fromSheet : (demo.categories || []);
  }

  function resolveCategoryId_(input){
    const raw = String(input || '').trim();
    if(!raw || categoryKey_(raw) === 'all') return 'all';

    const cats = categoriesForRouting_();
    const key = categoryKey_(raw);

    const direct = cats.find(c =>
      categoryKey_(c.CategoryID) === key ||
      categoryKey_(c.Name) === key ||
      categoryKey_(c.CategoryName) === key ||
      categoryKey_(c.Slug) === key
    );
    if(direct) return direct.CategoryID || direct.Name || raw;

    const alias = fixedCategoryAlias_(raw);
    if(alias){
      const aliasCat = cats.find(c => categoryKey_(c.CategoryID) === categoryKey_(alias));
      if(aliasCat) return aliasCat.CategoryID || alias;
      return alias;
    }

    const partial = cats.find(c => {
      const name = categoryKey_(c.Name || c.CategoryName);
      const id = categoryKey_(c.CategoryID);
      return (name && (name.includes(key) || key.includes(name))) || (id && (id.includes(key) || key.includes(id)));
    });
    return partial ? (partial.CategoryID || partial.Name || raw) : raw;
  }

  function categoryRouteLabels_(input){
    const resolved = resolveCategoryId_(input);
    const cats = categoriesForRouting_();
    const selectedCat = cats.find(c => categoryKey_(c.CategoryID) === categoryKey_(resolved) || categoryKey_(c.Name) === categoryKey_(resolved));
    const fixedId = fixedCategoryAlias_(input);
    const fixedCat = fixedId ? cats.find(c => categoryKey_(c.CategoryID) === categoryKey_(fixedId)) : null;

    const vals = [
      input,
      resolved,
      fixedId,
      selectedCat?.CategoryID,
      selectedCat?.Name,
      selectedCat?.CategoryName,
      fixedCat?.CategoryID,
      fixedCat?.Name,
      fixedCat?.CategoryName
    ].filter(Boolean);

    return [...new Set(vals.map(categoryKey_).filter(Boolean))];
  }

  function productMatchesCategory_(p, selected){
    if(!selected || selected === 'all') return true;
    const labels = categoryRouteLabels_(selected);
    const vals = [
      p.CategoryID,
      p.Category,
      p.CategoryName,
      p.CategoryLabel,
      p.MainCategory,
      p.ProductCategory,
      p.Department,
      p.SubCategory
    ].map(categoryKey_).filter(Boolean);

    return vals.some(v => labels.includes(v)) ||
      vals.some(v => labels.some(l => v.includes(l) || l.includes(v)));
  }

  function refreshShopAfterCategory_(){
    renderCategories();
    renderProducts();
    const mobileSearch = document.querySelector('#freshlyMobileSearch');
    const catalog = document.querySelector('#catalogSearch');
    if(mobileSearch && catalog) mobileSearch.value = catalog.value || '';
  }

  function closeMobileOverlays_(){
    const m = document.querySelector('.nav .menu, .menu');
    if(m){
      m.classList.remove('open','show','active','freshly-mobile-menu-open');
      m.setAttribute('aria-hidden','true');
      m.style.display = '';
      m.style.visibility = '';
      m.style.transform = '';
      m.querySelectorAll('.dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.querySelector('.dropdown-btn')?.setAttribute('aria-expanded','false');
      });
    }
    document.querySelector('#freshlyMoreMenu')?.classList.add('hidden');
    document.querySelector('.mobile-toggle')?.setAttribute('aria-expanded','false');
    document.body.classList.remove('freshly-menu-open','freshly-mobile-nav-open');
    document.documentElement.classList.remove('freshly-menu-open','freshly-mobile-nav-open');
  }

  function scrollToShopSafely_(){
    const shop = document.querySelector('#shop');
    if(!shop) return false;
    const offset = window.innerWidth <= 760 ? 78 : 92;
    const top = Math.max(0, shop.getBoundingClientRect().top + window.pageYOffset - offset);
    window.scrollTo({top, behavior:'smooth'});
    try{ history.replaceState(null, '', 'index.html#shop'); }catch(e){}
    return true;
  }


  function openShopCategory_(category, opts){
    const raw = String(category || 'all').trim() || 'all';
    const resolved = resolveCategoryId_(raw);
    closeMobileOverlays_();
    setTimeout(closeMobileOverlays_, 60);

    state.selectedCategory = resolved || 'all';
    localStorage.setItem('freshlySelectedCategory', state.selectedCategory);

    const clearSearch = !opts || opts.clearSearch !== false;
    if(clearSearch){
      const catalog = document.querySelector('#catalogSearch');
      const mobileSearch = document.querySelector('#freshlyMobileSearch');
      const homeSearch = document.querySelector('#homeProductSearch');
      if(catalog) catalog.value = '';
      if(mobileSearch) mobileSearch.value = '';
      if(homeSearch) homeSearch.value = '';
    }

    refreshShopAfterCategory_();

    if(raw === 'Freshly Mart') localStorage.setItem('freshlyMartRequested','yes');

    const shop = document.querySelector('#shop');
    if(shop){
      setTimeout(()=>{
        closeMobileOverlays_();
        scrollToShopSafely_();
      }, window.innerWidth <= 760 ? 140 : 20);
    }else if(location.pathname.split('/').pop() !== 'index.html'){
      location.href = 'index.html#shop';
    }

    document.querySelectorAll('.freshly-bottom-nav a,.freshly-bottom-nav button').forEach(item=>{
      const txt = (item.textContent || '').toLowerCase();
      item.classList.toggle('active', txt.includes('shop'));
    });
  }


  window.freshlyCloseMobileOverlays = closeMobileOverlays_;
  window.freshlyOpenCategory = function(category){ openShopCategory_(category, {clearSearch:true}); };
  window.freshlyGoShop = function(resetCategory){
    closeMobileOverlays_();
    if(resetCategory !== false){
      state.selectedCategory = 'all';
      localStorage.setItem('freshlySelectedCategory','all');
      const catalog = document.querySelector('#catalogSearch');
      const mobileSearch = document.querySelector('#freshlyMobileSearch');
      if(catalog) catalog.value = '';
      if(mobileSearch) mobileSearch.value = '';
      refreshShopAfterCategory_();
    }
    if(document.querySelector('#shop')){
      setTimeout(scrollToShopSafely_, window.innerWidth <= 760 ? 120 : 10);
    }else{
      location.href = 'index.html#shop';
    }
  };


  function renderCategories(){
    const box = document.querySelector('#categoryTabs'); if(!box) return;
    const cats = activeRows(state.categories).sort((a,b)=>(+a.SortOrder||0)-(+b.SortOrder||0));
    box.innerHTML = `<button class="tab ${state.selectedCategory==='all'?'active':''}" data-cat="all">All</button>` + cats.map(c=>`<button class="tab ${state.selectedCategory===c.CategoryID?'active':''}" data-cat="${esc(c.CategoryID)}">${esc(c.Name)}</button>`).join('');
    box.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{state.selectedCategory=resolveCategoryId_(b.dataset.cat); localStorage.setItem('freshlySelectedCategory',state.selectedCategory); renderCategories(); renderProducts();});
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
      .filter(p => productMatchesCategory_(p, state.selectedCategory))
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
  function renderCheckoutLocationControls(){
    document.querySelectorAll('[data-district-select]').forEach(sel=>{
      const districts = activeRows(state.districts).filter(d => countryMatches_(d, state.selectedCountry));
      sel.innerHTML=`<option value="">Select District</option>`+districts.map(d=>{
        const id = districtId_(d);
        return `<option value="${esc(id)}" ${cleanKey_(id)===cleanKey_(state.selectedDistrict)?'selected':''}>${esc(districtName_(d))}</option>`;
      }).join('');
      sel.onchange=()=>{
        state.selectedDistrict=sel.value;
        state.selectedHub='';
        saveLocation();
        renderHubDropdown('[data-hub-select]');
        renderSlots();
        renderProducts();
      };
    });
    document.querySelectorAll('[data-checkout-pincode]').forEach(inp=>{
      inp.value=state.selectedPincode||'';
      inp.oninput=()=>{
        state.selectedPincode=inp.value.trim();
        state.selectedHub='';
        saveLocation();
        renderHubDropdown('[data-hub-select]');
        renderSlots();
      };
    });
    renderHubDropdown('[data-hub-select]');
    renderSlots();
  }
  function parseCutoffTimeLocal_(value){
    let raw = String(value || '').trim();
    if(!raw) return null;

    // Google Sheets time-only cells may come through JSON as 1899-12-30T..Z.
    // Convert that safely to the user's local time before comparing cut-off.
    if(/^\d{4}-\d{2}-\d{2}T/.test(raw) || /^\d{4}-\d{2}-\d{2} /.test(raw)){
      const d = new Date(raw);
      if(!isNaN(d.getTime())) return {h:d.getHours(), min:d.getMinutes()};
    }

    let s = raw.toUpperCase();
    s = s.replace(/\./g, ':').replace(/\s+/g, ' ');
    const meridiem = s.includes('PM') ? 'PM' : (s.includes('AM') ? 'AM' : '');
    s = s.replace(/AM|PM/g, '').trim();
    const m = s.match(/^(\d{1,2})(?::(\d{1,2}))?/);
    if(!m) return null;
    let h = Number(m[1]);
    const min = Number(m[2] || 0);
    if(meridiem === 'PM' && h < 12) h += 12;
    if(meridiem === 'AM' && h === 12) h = 0;
    if(h < 0 || h > 23 || min < 0 || min > 59) return null;
    return {h, min};
  }
  function formatCutoffDisplay_(value){
    const t = parseCutoffTimeLocal_(value);
    if(!t) return String(value || '').trim();
    const h12 = t.h % 12 || 12;
    const mm = String(t.min).padStart(2, '0');
    const ap = t.h >= 12 ? 'PM' : 'AM';
    return `${h12}:${mm} ${ap}`;
  }
  function firstSlotValue_(row, keys){
    row = row || {};
    for(const k of keys){
      if(row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') return row[k];
    }
    return '';
  }
  function slotCutoffMs_(slot){
    const cutoffText = firstSlotValue_(slot, ['CutOffTime','DefaultCutOffTime','CutoffTime','OrderCutOffTime','OrderCutoffTime','CutOff','Cutoff','OrderCutoff']);
    const t = parseCutoffTimeLocal_(cutoffText);
    if(!t) return null;
    const d = new Date();
    d.setHours(t.h, t.min, 0, 0);
    return d.getTime();
  }
  function slotClosedByCutoff_(slot){
    const ms = slotCutoffMs_(slot);
    return !!ms && Date.now() > ms;
  }
  function selectedSlotRow_(slotId){
    const id = String(slotId || '').trim();
    if(!id) return null;
    return activeRows(state.slots).find(s => String(s.SlotID || '').trim() === id || String(s.SlotLabel || '').trim() === id) || null;
  }
  function renderSlots(){
    document.querySelectorAll('[data-slot-select]').forEach(sel=>{
      const slots=activeRows(state.slots).filter(s=>!state.selectedHub || String(s.HubID||'')===String(state.selectedHub));
      sel.innerHTML=`<option value="">Select delivery slot</option>`+slots.map(s=>{
        const closed = slotClosedByCutoff_(s);
        const cutoff = firstSlotValue_(s, ['CutOffTime','DefaultCutOffTime','CutoffTime','OrderCutOffTime','OrderCutoffTime','CutOff','Cutoff','OrderCutoff']);
        const label = `${esc(s.SlotLabel)} (Cut-off: ${esc(formatCutoffDisplay_(cutoff)||'')}${closed?' - Closed':''})`;
        return `<option value="${esc(s.SlotID)}" ${closed?'disabled':''}>${label}</option>`;
      }).join('');
    });
  }
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
  
  function bindCustomerAuthTabs(){
    const syncForm = form => {
      if(!form) return;
      const checked = form.querySelector('input[name="AuthMode"]:checked');
      const mode = checked ? checked.value : (form.querySelector('input[name="AuthMode"]')?.value || 'Login');
      const signup = String(mode).toLowerCase() === 'signup';

      form.querySelectorAll('[data-auth-login-field]').forEach(el=>el.classList.toggle('hidden', signup));
      form.querySelectorAll('[data-auth-signup-field]').forEach(el=>el.classList.toggle('hidden', !signup));

      const loginUser = form.querySelector('[data-auth-login-field] input[name="UserID"]');
      const loginPass = form.querySelector('[data-auth-login-field] input[name="Password"]');
      const signupName = form.querySelector('[data-auth-signup-field] input[name="Name"]');
      const signupPhone = form.querySelector('[data-auth-signup-field] input[name="Phone"]');
      const signupPass = form.querySelector('[data-auth-signup-field] input[name="SignupPassword"]');
      const confirmPass = form.querySelector('[data-auth-signup-field] input[name="ConfirmPassword"]');

      [loginUser, loginPass, signupName, signupPhone, signupPass, confirmPass].forEach(input=>{ if(input) input.required = false; });
      if(signup){
        if(signupName) signupName.required = true;
        if(signupPhone) signupPhone.required = true;
        if(signupPass) signupPass.required = true;
        if(confirmPass) confirmPass.required = true;
      }else{
        if(loginUser) loginUser.required = true;
        if(loginPass) loginPass.required = true;
      }
    };

    document.querySelectorAll('#checkoutLoginForm').forEach(form=>{
      form.querySelectorAll('input[name="AuthMode"]').forEach(r=>{
        r.addEventListener('change',()=>syncForm(form));
      });
      form.addEventListener('submit',()=>{
        const mode = form.querySelector('input[name="AuthMode"]:checked')?.value || 'Login';
        if(String(mode).toLowerCase()==='signup'){
          const sp = form.querySelector('input[name="SignupPassword"]');
          let hp = form.querySelector('input[name="Password"][type="hidden"]');
          if(!hp){
            hp = document.createElement('input');
            hp.type = 'hidden';
            hp.name = 'Password';
            form.appendChild(hp);
          }
          if(sp) hp.value = sp.value;
        }
      }, true);
      syncForm(form);
    });

    document.querySelectorAll('[data-show-auth-tab]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const tab = btn.dataset.showAuthTab;
        document.querySelectorAll('[data-auth-tab]').forEach(el=>el.classList.toggle('hidden', el.dataset.authTab !== tab));
        document.querySelectorAll('[data-show-auth-tab]').forEach(b=>b.classList.toggle('active', b.dataset.showAuthTab === tab));
      });
    });

    if(location.hash === '#signup'){
      document.querySelector('[data-show-auth-tab="signup"]')?.click();
    }
  }

  function normalizeOrderItemForSubmit_(x){
    return {
      ProductID: x.ProductID,
      Name: x.Name,
      PackSize: x.PackSize || x.SelectedQtyLabel || '',
      Qty: Number(x.Qty || 1),
      SelectedQty: Number(x.SelectedQty || 1),
      SelectedQtyLabel: x.SelectedQtyLabel || x.PackSize || '',
      BaseUnit: x.BaseUnit || x.Unit || '',
      PriceBasis: x.PriceBasis || '',
      BasePrice: Number(x.BasePrice || 0),
      ProductTotal: Number(x.ProductTotal || x.Price || 0),
      OptionCharges: Number(x.OptionCharges || 0),
      Price: Number(x.Price || 0),
      Note: x.Note || ''
    };
  }

  function orderSuccessHtml_(res, order){
    const orderId = esc(res.orderId || res.OrderNumber || res.OrderID || res.OrderFreshlyID || '');
    const hub = selectedHubRow_();
    const hubName = esc(res.order?.HubName || hub?.HubName || order.HubID || 'Freshly Hub');
    const total = currency + num(res.total || res.Total || res.order?.Total || cartTotal());
    const whatsappStatus = esc(res.WhatsAppStatus || res.order?.WhatsAppStatus || 'Queued');
    const trackLink = orderId ? `track-order.html?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(state.customer?.Phone || '')}` : 'track-order.html';
    return `<div class="success-card card">
      <h2>Order received successfully.</h2>
      <p>${orderId ? `Order Number: <b>${orderId}</b>` : 'Freshly has received your order.'}</p>
      <p><b>Hub:</b> ${hubName}<br><b>Total:</b> ${total}<br><b>Payment:</b> ${esc(order.PaymentMode || '')}<br><b>WhatsApp Update:</b> ${whatsappStatus}</p>
      <p class="muted">Freshly will share payment and delivery updates. Please pay only through Freshly UPI / Freshly QR.</p>
      <div class="button-row"><a class="btn btn-primary" href="${trackLink}">Track Order</a><a class="btn" href="customer-portal.html">My Orders</a></div>
    </div>`;
  }

  async function placeOrder(fd){
    const form = document.querySelector('#checkoutOrderForm');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    try{
      if(!state.customer){
        updateCustomerUI();
        throw new Error('Please login or sign up before placing the order.');
      }
      if(!state.cart.length) throw new Error('Your cart is empty. Please add products before checkout.');

      const order = Object.fromEntries(fd.entries());
      order.DistrictID = order.DistrictID || state.selectedDistrict || '';
      order.Pincode = order.Pincode || state.selectedPincode || '';
      order.HubID = order.HubID || state.selectedHub || '';
      order.CustomerFreshlyID = state.customer.CustomerFreshlyID || state.customer.CustomerID || '';
      order.CustomerID = state.customer.CustomerID || state.customer.CustomerFreshlyID || '';
      order.CustomerName = state.customer.Name || state.customer.CustomerName || '';
      order.Phone = state.customer.Phone || state.customer.Mobile || '';
      order.Email = state.customer.Email || '';

      if(!order.DistrictID) throw new Error('Please select district / city.');
      if(!order.Pincode) throw new Error('Please enter pincode.');
      if(!order.HubID) throw new Error('Please choose nearest Freshly Hub.');
      if(!order.DeliverySlot) throw new Error('Please select delivery slot.');
      const selectedSlot = selectedSlotRow_(order.DeliverySlot);
      if(!selectedSlot) throw new Error('Selected delivery slot is not available. Please refresh and choose again.');
      if(slotClosedByCutoff_(selectedSlot)) throw new Error('Order cut-off time has passed for the selected slot. Please choose another available slot or contact Freshly support.');
      if(String(order.FulfilmentType || '').toLowerCase().includes('home')){
        const hasAddress = [order.ManualAddress, order.HouseNo, order.BuildingName, order.Area, order.Landmark, order.GoogleMapLink].some(v => String(v || '').trim());
        if(!hasAddress) throw new Error('Please enter delivery address or use current location.');
      }

      const payload = {
        customer: {
          CustomerFreshlyID: state.customer.CustomerFreshlyID || state.customer.CustomerID || '',
          CustomerID: state.customer.CustomerID || state.customer.CustomerFreshlyID || '',
          UserID: state.customer.UserID || state.customer.CustomerFreshlyID || state.customer.Phone || '',
          Name: state.customer.Name || state.customer.CustomerName || 'Freshly Customer',
          Phone: state.customer.Phone || state.customer.Mobile || '',
          Email: state.customer.Email || '',
          SessionToken: state.customer.SessionToken || ''
        },
        order,
        items: state.cart.map(normalizeOrderItemForSubmit_)
      };

      if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Placing Order...'; }
      const res = cfg.BACKEND_URL
        ? await api('placeOrder', payload, 'POST')
        : {ok:true, orderId:'FLY-ORD-DEMO-' + Date.now(), OrderNumber:'FLY-ORD-DEMO-' + Date.now(), Total:cartTotal(), WhatsAppStatus:'Demo', message:'Demo order received.'};
      if(!res || !res.ok) throw new Error(res?.message || 'Order submission failed.');
      saveLocalOrder_(res, order, payload.items);

      const success = document.querySelector('#orderSuccess');
      if(success){
        success.classList.remove('hidden');
        success.innerHTML = orderSuccessHtml_(res, order);
        success.scrollIntoView({behavior:'smooth', block:'start'});
      }
      document.querySelector('#checkoutModal')?.classList.remove('open');
      state.cart = [];
      save('freshlyCart', state.cart);
      updateCartUI();
      renderCheckoutLines();
      if(form) form.reset();
      toast(res.message || 'Order placed successfully.');
    }catch(err){
      toast(err.message || 'Order submission failed.');
      const success = document.querySelector('#orderSuccess');
      if(success){
        success.classList.remove('hidden');
        success.innerHTML = `<div class="warning card"><b>Order could not be placed.</b><br>${esc(err.message || 'Please try again.')}</div>`;
      }
    }finally{
      if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalText || 'Place Order'; }
    }
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
  function normalizeCustomerAccount_(c){
    c = c || {};
    return {
      CustomerFreshlyID: c.CustomerFreshlyID || c.CustomerID || c.UserID || ('FLY-CUS-' + Date.now()),
      CustomerID: c.CustomerID || c.CustomerFreshlyID || c.UserID || ('FLY-CUS-' + Date.now()),
      UserID: c.UserID || c.CustomerFreshlyID || c.Phone || c.Email || '',
      Name: c.Name || c.CustomerName || c.FullName || c.name || 'Freshly Customer',
      Phone: c.Phone || c.Mobile || '',
      Email: c.Email || '',
      SessionToken: c.SessionToken || ('LOCAL-' + Date.now())
    };
  }

  function customerAccounts_(){ return load('freshlyCustomerAccounts', []); }
  function saveCustomerAccounts_(rows){ save('freshlyCustomerAccounts', rows || []); }

  function findCustomerAccount_(userId){
    const u = String(userId || '').trim().toLowerCase();
    const p = phoneDigits_(userId);
    return customerAccounts_().find(a => {
      const values = [a.UserID,a.CustomerFreshlyID,a.CustomerID,a.Phone,a.Email].map(v=>String(v||'').trim().toLowerCase());
      return values.includes(u) || (p && phoneMatch_(a.Phone, p));
    });
  }

  function localCustomerSignup_(data){
    const phone = String(data.Phone || data.Mobile || '').trim();
    const email = String(data.Email || '').trim();
    const name = String(data.Name || data.CustomerName || '').trim();
    const password = String(data.Password || data.SignupPassword || '').trim();
    const confirm = String(data.ConfirmPassword || '').trim();

    if(!name) return {ok:false,message:'Name is required.'};
    if(!phone) return {ok:false,message:'Phone / WhatsApp number is required.'};
    if(!password) return {ok:false,message:'Password is required.'};
    if(confirm && password !== confirm) return {ok:false,message:'Passwords do not match.'};

    const rows = customerAccounts_();
    const existing = rows.find(a => phoneMatch_(a.Phone, phone) || (email && String(a.Email||'').toLowerCase() === email.toLowerCase()) || (data.UserID && String(a.UserID||'').toLowerCase() === String(data.UserID).toLowerCase()));
    const customerId = existing?.CustomerFreshlyID || existing?.CustomerID || ('FLY-CUS-' + Date.now());
    const userId = String(data.UserID || existing?.UserID || phone || email || customerId).trim();

    const account = {
      CustomerFreshlyID: customerId,
      CustomerID: customerId,
      UserID: userId,
      Password: password,
      Name: name || existing?.Name || 'Freshly Customer',
      Phone: phone,
      Email: email || existing?.Email || '',
      WhatsAppOptIn: data.WhatsAppOptIn || existing?.WhatsAppOptIn || 'Yes',
      CreatedAt: existing?.CreatedAt || new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      Status: 'Active'
    };

    if(existing){
      rows[rows.indexOf(existing)] = account;
    }else{
      rows.push(account);
    }

    saveCustomerAccounts_(rows);
    return {ok:true,message:'Customer account created.',customer:normalizeCustomerAccount_(account)};
  }

  function localCustomerPasswordLogin_(data){
    const userId = String(data.UserID || data.LoginID || data.Phone || data.Email || data.CustomerFreshlyID || '').trim();
    const password = String(data.Password || '').trim();

    if(!userId) return {ok:false,message:'User ID / Phone / Email / Freshly ID is required.'};
    if(!password) return {ok:false,message:'Password is required.'};

    const account = findCustomerAccount_(userId);
    if(!account) return {ok:false,message:'Customer account not found. Please sign up first.'};
    if(String(account.Password || '') !== password) return {ok:false,message:'Invalid password.'};

    account.LastLoginAt = new Date().toISOString();
    const rows = customerAccounts_();
    const idx = rows.findIndex(a => a.CustomerFreshlyID === account.CustomerFreshlyID || a.UserID === account.UserID);
    if(idx >= 0){ rows[idx] = account; saveCustomerAccounts_(rows); }

    return {ok:true,message:'Login successful.',customer:normalizeCustomerAccount_(account)};
  }

  async function customerAuth(fd){
    const data=Object.fromEntries(fd.entries());
    const mode=String(data.AuthMode || data.Mode || (data.UserID && data.Password && !data.Phone ? 'Login' : 'Signup')).toLowerCase();

    // Checkout signup has SignupPassword field. Copy it into Password before sending.
    if(mode === 'signup' && !data.Password && data.SignupPassword) data.Password = data.SignupPassword;

    if(mode === 'login'){
      if(!data.UserID && !data.Phone && !data.Email && !data.CustomerFreshlyID){toast('User ID / Phone / Email / Freshly ID is required.');return;}
      if(!data.Password){toast('Password is required.');return;}
    }else{
      if(!data.Name){toast('Name is required.');return;}
      if(!data.Phone){toast('Phone / WhatsApp number is required.');return;}
      if(!data.Password){toast('Password is required.');return;}
      if(data.ConfirmPassword && data.Password !== data.ConfirmPassword){toast('Passwords do not match.');return;}
    }

    try{
      let res = null;
      if(cfg.BACKEND_URL){
        const action = mode === 'login' ? 'customerPasswordLogin' : 'customerSignup';
        res = await api(action, data, 'POST');
      }else{
        res = mode === 'login' ? localCustomerPasswordLogin_(data) : localCustomerSignup_(data);
      }

      if(!res || !res.ok){
        if(!cfg.BACKEND_URL || cfg.ENABLE_LOCAL_CUSTOMER_AUTH_FALLBACK !== false){
          res = mode === 'login' ? localCustomerPasswordLogin_(data) : localCustomerSignup_(data);
        }
      }

      if(!res.ok) throw new Error(res.message || 'Customer authentication failed.');

      state.customer = normalizeCustomerAccount_(res.customer || res.data?.customer || {});
      save('freshlyCustomer', state.customer);
      updateCustomerUI();

      const status = document.querySelector('[data-customer-portal-status]');
      if(status){
        status.className = 'notice mini';
        status.innerHTML = `<b>${mode === 'login' ? 'Login successful.' : 'Signup successful.'}</b><br>Freshly ID: ${esc(state.customer.CustomerFreshlyID || state.customer.CustomerID || '')}`;
      }

      toast(mode === 'login' ? 'Login successful.' : 'Signup successful.');
      if(document.querySelector('#customerOrdersBox')) loadCustomerOrders();
    }catch(err){
      toast(err.message);
      const status = document.querySelector('[data-customer-portal-status]');
      if(status){
        status.className = 'warning mini';
        status.textContent = err.message;
      }
    }
  }

  function updateCustomerUI(){
    const name = state.customer ? (state.customer.Name || state.customer.CustomerName || 'Customer') : '';
    const id = state.customer ? (state.customer.CustomerFreshlyID || state.customer.CustomerID || state.customer.UserID || state.customer.Phone || '') : '';
    document.querySelectorAll('[data-customer-state]').forEach(el=>el.innerHTML=state.customer?`<span class="login-badge">Logged in: ${esc(name)}${id ? ' ('+esc(id)+')' : ''}</span>`:`<span class="warning">Guest browsing. Login required only at checkout.</span>`);
    document.querySelectorAll('[data-checkout-auth]').forEach(el=>el.classList.toggle('hidden',!!state.customer));
    document.querySelectorAll('[data-checkout-order]').forEach(el=>el.classList.toggle('hidden',!state.customer));
    document.querySelectorAll('[data-customer-only]').forEach(el=>el.classList.toggle('hidden',!state.customer));
    document.querySelectorAll('[data-guest-only]').forEach(el=>el.classList.toggle('hidden',!!state.customer));
  }

  function bindGenericForms(){ document.querySelectorAll('[data-freshly-form]').forEach(form=>form.onsubmit=async e=>{e.preventDefault(); const type=form.dataset.freshlyForm; const data=Object.fromEntries(new FormData(form).entries()); try{ const res=cfg.BACKEND_URL?await api('submitLeadForm',{type,data},'POST'):{ok:true,message:'Demo submission captured.'}; if(!res.ok) throw new Error(res.message||'Submission failed'); form.reset(); toast(res.message||'Submitted successfully.'); }catch(err){toast(err.message);} }); }
  function bindPortalForms(){
    const stock=document.querySelector('#stockPriceUpdateForm');
    if(stock) stock.onsubmit=async e=>{e.preventDefault(); await submitPortal('submitStockPriceUpdate',stock,'Stock/price update submitted for admin approval.');};
    const comp=document.querySelector('#complianceUpdateForm');
    if(comp) comp.onsubmit=async e=>{e.preventDefault(); await submitPortal('submitComplianceUpdate',comp,'Compliance details submitted.');};

    // Customer portal uses separate Login and Sign Up forms. Bind both without changing the design.
    document.querySelectorAll('#customerPortalLoginForm,#customerPasswordLoginForm,#customerPortalSignupForm,[data-auth-tab][data-customer-auth-form]').forEach(form=>{
      if(!form || form.id === 'checkoutLoginForm' || form.dataset.freshlyAuthBound === 'yes') return;
      form.dataset.freshlyAuthBound = 'yes';
      form.onsubmit=async e=>{e.preventDefault(); await customerAuth(new FormData(form));};
    });
  }
  async function submitPortal(action,form,fallback){ const data=Object.fromEntries(new FormData(form).entries()); try{const res=cfg.BACKEND_URL?await api(action,data,'POST'):{ok:true,message:fallback}; if(!res.ok) throw new Error(res.message||'Submission failed'); form.reset(); toast(res.message||fallback);}catch(err){toast(err.message);} }

  function orderItemsText_(items){
    return (items || []).map(i => `${esc(i.ProductName || i.Name || 'Item')} x ${esc(i.SelectedQty || i.Qty || '')} ${esc(i.Unit || i.BaseUnit || '')}`.trim()).join('<br>');
  }
  function orderDateMs_(value){
    if(!value) return 0;
    const s = String(value).replace(' ', 'T');
    const ms = Date.parse(s);
    return Number.isFinite(ms) ? ms : 0;
  }
  function canCancelOrder_(o){
    const status = String(o.Status || o.OrderStatus || o.TrackingStatus || '').toLowerCase();
    const payment = String(o.PaymentStatus || '').toLowerCase();
    if(status.includes('cancel') || status.includes('packed') || status.includes('dispatch') || status.includes('ready') || status.includes('delivered')) return false;
    if(payment.includes('paid') || payment.includes('received') || payment.includes('verified')) return false;
    if(String(o.CanCancel).toLowerCase() === 'true') return true;
    if(String(o.CancellationAllowed || '').toLowerCase() === 'yes') return true;
    if(String(o.CancellationAllowed || '').toLowerCase() === 'no') return false;
    const cutoffMs = orderDateMs_(o.CancellationCutoffTime);
    if(cutoffMs) return Date.now() <= cutoffMs;
    const orderMs = orderDateMs_(o.Timestamp || o.OrderDateTime);
    return orderMs ? Date.now() <= (orderMs + 10 * 60 * 1000) : false;
  }
  function cancellationNote_(o){
    const cutoff = o.CancellationCutoffTime ? `Cancellation cut-off: ${esc(String(o.CancellationCutoffTime).slice(0,16))}` : '';
    return esc(o.CancellationMessage || o.CancellationRemarks || cutoff || 'Cancellation depends on order status and cut-off time.');
  }
  async function cancelOrderFromButton_(btn){
    const orderId = btn.dataset.orderId || '';
    const phone = btn.dataset.phone || state.customer?.Phone || '';
    if(!orderId) return;
    const reason = prompt('Please enter cancellation reason:\nOrdered by mistake / Wrong item selected / Duplicate order / Delivery time not suitable / Other');
    if(reason === null) return;
    if(!confirm('Cancel order ' + orderId + '? This action cannot be reversed from the customer side.')) return;
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Cancelling...';
    try{
      const payload = {
        OrderID: orderId,
        OrderNumber: orderId,
        Phone: phone,
        CancellationReason: reason || 'Customer requested cancellation',
        SessionToken: state.customer?.SessionToken || '',
        CustomerFreshlyID: state.customer?.CustomerFreshlyID || state.customer?.CustomerID || '',
        CustomerID: state.customer?.CustomerID || state.customer?.CustomerFreshlyID || '',
        UserID: state.customer?.UserID || ''
      };
      let res;
      if(cfg.BACKEND_URL){
        res = await api('cancelOrder', payload, 'POST');
      }else{
        res = cancelLocalOrder_(payload);
      }
      if(!res || !res.ok) throw new Error(res?.message || 'Cancellation failed.');
      toast(res.message || 'Order cancelled successfully.');
      if(document.querySelector('#customerOrdersBox')) await loadCustomerOrders();
      const form = document.querySelector('#trackOrderForm');
      if(form && form.elements.orderId && String(form.elements.orderId.value) === String(orderId)){
        form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', {cancelable:true}));
      }
    }catch(err){
      toast(err.message || 'Cancellation failed.');
    }finally{
      btn.disabled = false;
      btn.textContent = oldText || 'Cancel';
    }
  }
  function bindCancelOrderButtons_(){
    document.querySelectorAll('[data-cancel-order]').forEach(btn=>{
      if(btn.dataset.cancelBound === 'yes') return;
      btn.dataset.cancelBound = 'yes';
      btn.addEventListener('click', ()=>cancelOrderFromButton_(btn));
    });
  }
  function cancelLocalOrder_(payload){
    const rows = load('freshlyLocalOrders', []);
    const idx = rows.findIndex(o => String(o.OrderNumber || o.OrderFreshlyID || o.OrderID) === String(payload.OrderID || payload.OrderNumber));
    if(idx < 0) return {ok:false,message:'Order not found.'};
    if(!canCancelOrder_(rows[idx])) return {ok:false,message:rows[idx].CancellationMessage || 'Cancellation cut-off time has passed.'};
    rows[idx] = Object.assign({}, rows[idx], {
      Status:'Cancelled', PaymentStatus:String(rows[idx].PaymentStatus || '').toLowerCase()==='pending'?'Cancelled':rows[idx].PaymentStatus,
      CancellationAllowed:'No', CanCancel:false, CancellationRequestedAt:new Date().toISOString(), CancellationReason:payload.CancellationReason || '',
      CancelledBy:'Customer', CancellationStatus:'Approved', CancellationRemarks:'Cancelled by customer before cut-off.', RefundStatus:'Not Applicable'
    });
    save('freshlyLocalOrders', rows);
    return {ok:true,message:'Order cancelled successfully.',order:rows[idx]};
  }
  function saveLocalOrder_(res, order, items){
    const orderId = res.orderId || res.OrderNumber || res.OrderID || res.OrderFreshlyID || ('FLY-ORD-LOCAL-' + Date.now());
    const rows = load('freshlyLocalOrders', []);
    rows.unshift({
      OrderID: orderId, OrderFreshlyID: orderId, OrderNumber: orderId, Timestamp: new Date().toISOString(),
      CustomerFreshlyID: state.customer?.CustomerFreshlyID || state.customer?.CustomerID || '',
      CustomerName: state.customer?.Name || '', Phone: state.customer?.Phone || '', HubID: order.HubID || '',
      DeliverySlot: order.DeliverySlot || '', FulfilmentType: order.FulfilmentType || '', PaymentMode: order.PaymentMode || '',
      PaymentStatus: 'Pending', Status: res.order?.Status || 'Received', Total: res.Total || res.total || cartTotal(),
      CancellationAllowed: res.order?.CancellationAllowed || 'Yes', CanCancel: res.order?.CanCancel !== undefined ? res.order.CanCancel : true,
      CancellationCutoffTime: res.order?.CancellationCutoffTime || new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      CancellationStatus: res.order?.CancellationStatus || 'Available', CancellationRemarks: res.order?.CancellationRemarks || 'Cancellation available before cut-off time.',
      RefundStatus: res.order?.RefundStatus || 'Not Applicable', WhatsAppStatus: res.WhatsAppStatus || 'Demo', Items: items || []
    });
    save('freshlyLocalOrders', rows.slice(0,50));
  }
  function localCustomerOrders_(){
    const phone = phoneDigits_(state.customer?.Phone || '');
    const cid = String(state.customer?.CustomerFreshlyID || state.customer?.CustomerID || '');
    return load('freshlyLocalOrders', []).filter(o => (cid && String(o.CustomerFreshlyID || '') === cid) || (phone && phoneMatch_(o.Phone, phone)));
  }
  function renderCustomerOrders_(orders){
    const box = document.querySelector('#customerOrdersBox');
    if(!box) return;
    if(!state.customer){ box.innerHTML = '<div class="warning mini">Please login to view your order history.</div>'; return; }
    if(!orders || !orders.length){ box.innerHTML = '<p class="muted">No orders found for this customer account.</p>'; return; }
    box.innerHTML = `<table class="table"><thead><tr><th>Order Number</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Cancellation</th><th></th></tr></thead><tbody>${orders.map(o=>{
      const no = o.OrderNumber || o.OrderFreshlyID || o.OrderID || '';
      const phone = state.customer?.Phone || o.Phone || '';
      const items = o.Items || o.items || [];
      const itemHtml = items.length ? orderItemsText_(items) : esc(o.ItemSummary || o.ItemsText || '');
      const canCancel = canCancelOrder_(o);
      const cancelCell = canCancel ? `<button class="btn btn-small" type="button" data-cancel-order data-order-id="${esc(no)}" data-phone="${esc(phone)}">Cancel</button>` : `<span class="muted">${cancellationNote_(o)}</span>`;
      return `<tr><td><b>${esc(no)}</b></td><td>${esc(String(o.Timestamp || o.OrderDateTime || '').slice(0,16))}</td><td>${itemHtml || '-'}</td><td>${currency}${num(o.Total||0)}</td><td>${esc(o.Status || o.OrderStatus || o.TrackingStatus || '')}</td><td>${esc(o.PaymentStatus || '')}</td><td>${cancelCell}</td><td><a class="btn btn-small" href="track-order.html?orderId=${encodeURIComponent(no)}&phone=${encodeURIComponent(phone)}">Track</a></td></tr>`;
    }).join('')}</tbody></table>`;
    bindCancelOrderButtons_();
  }
  async function loadCustomerOrders(){
    const box = document.querySelector('#customerOrdersBox');
    if(!box) return;
    if(!state.customer){ renderCustomerOrders_([]); return; }
    box.innerHTML = '<p class="muted">Loading order history...</p>';
    try{
      let res = cfg.BACKEND_URL ? await api('getCustomerOrders', {
        SessionToken: state.customer.SessionToken || '',
        CustomerFreshlyID: state.customer.CustomerFreshlyID || state.customer.CustomerID || '',
        CustomerID: state.customer.CustomerID || state.customer.CustomerFreshlyID || '',
        UserID: state.customer.UserID || '', Phone: state.customer.Phone || ''
      }, 'POST') : {ok:true, orders:localCustomerOrders_()};
      if(!res || !res.ok) throw new Error(res?.message || 'Could not load order history.');
      renderCustomerOrders_(res.orders || res.data?.orders || []);
    }catch(err){ box.innerHTML = `<div class="warning mini">${esc(err.message || 'Could not load order history.')}</div>`; }
  }
  function bindCustomerOrders(){
    document.querySelectorAll('[data-load-customer-orders]').forEach(btn=>{ btn.addEventListener('click', loadCustomerOrders); });
  }
  function renderTrackOrder_(o){
    const no = o.OrderNumber || o.OrderFreshlyID || o.OrderID || '';
    const items = o.Items || o.items || [];
    const phone = state.customer?.Phone || o.Phone || '';
    const canCancel = canCancelOrder_(o);
    const cancelBlock = canCancel
      ? `<div class="button-row"><button class="btn" type="button" data-cancel-order data-order-id="${esc(no)}" data-phone="${esc(phone)}">Cancel Order</button></div><p class="muted">${cancellationNote_(o)}</p>`
      : `<p class="muted">${cancellationNote_(o)}</p>`;
    const html = `<div class="card"><h3>Order ${esc(no)}</h3><p>Status: <b>${esc(o.Status||o.OrderStatus||o.TrackingStatus||'')}</b></p><p>Payment: <b>${esc(o.PaymentStatus||'')}</b></p><p>Total: <b>${currency}${num(o.Total||0)}</b></p><p><b>Slot:</b> ${esc(o.DeliverySlot||'')}<br><b>Hub:</b> ${esc(o.HubName||o.HubID||'')}</p>${items.length ? `<hr><p><b>Items</b><br>${orderItemsText_(items)}</p>` : ''}<hr>${cancelBlock}</div>`;
    setTimeout(bindCancelOrderButtons_, 0);
    return html;
  }
  function bindTrackOrder(){
    const form=document.querySelector('#trackOrderForm');
    if(!form)return;
    const params = new URLSearchParams(location.search);
    const qOrder = params.get('orderId') || params.get('order') || params.get('OrderID') || '';
    const qPhone = params.get('phone') || params.get('Phone') || '';
    if(qOrder && form.elements.orderId) form.elements.orderId.value = qOrder;
    if(qPhone && form.elements.phone) form.elements.phone.value = qPhone;
    form.onsubmit=async e=>{e.preventDefault(); const data=Object.fromEntries(new FormData(form).entries()); const box=document.querySelector('#trackResult'); try{ const res=cfg.BACKEND_URL?await api('trackOrder',data,'POST'):{ok:true,order:(localCustomerOrders_().find(o => String(o.OrderNumber || o.OrderFreshlyID || o.OrderID) === String(data.orderId)) || {OrderFreshlyID:data.orderId,Status:'Demo mode',PaymentStatus:'Pending',Total:0,Items:[]})}; if(!res.ok) throw new Error(res.message||'Not found'); const o=res.order||res.data?.order; box.innerHTML=renderTrackOrder_(o);}catch(err){box.innerHTML=`<div class="danger-note">${esc(err.message)}</div>`;} };
    if(qOrder && qPhone) form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', {cancelable:true}));
  }

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
