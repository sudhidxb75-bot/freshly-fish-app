
(function(){
let deferredPrompt=null;

function ios(){return /iphone|ipad|ipod/i.test(navigator.userAgent)}
function android(){return /android/i.test(navigator.userAgent)}
function standalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}

function modal(){
  let m=document.querySelector('#freshlyInstallModal');
  if(m)return m;
  m=document.createElement('div');
  m.id='freshlyInstallModal';
  m.className='freshly-install-modal hidden';
  m.innerHTML=`<div class="freshly-install-card">
    <button class="freshly-install-close" type="button" aria-label="Close">×</button>
    <img src="assets/icons/icon-192.png" alt="Freshly">
    <h2>Install Freshly App</h2>
    <div data-install-steps></div>
  </div>`;
  document.body.appendChild(m);
  m.querySelector('.freshly-install-close').onclick=()=>m.classList.add('hidden');
  m.onclick=e=>{if(e.target===m)m.classList.add('hidden')};
  return m;
}

function instructions(){
  const m=modal(),s=m.querySelector('[data-install-steps]');
  if(ios()){
    s.innerHTML=`<p><strong>iPhone / iPad:</strong></p>
      <ol><li>Open Freshly in <strong>Safari</strong>.</li><li>Tap the <strong>Share</strong> button.</li><li>Tap <strong>Add to Home Screen</strong>.</li><li>Tap <strong>Add</strong>.</li></ol>
      <p class="muted">iPhone uses Safari Share > Add to Home Screen.</p>`;
  }else if(android()){
    s.innerHTML=`<p><strong>Android Chrome:</strong></p>
      <ol><li>Open Freshly in <strong>Chrome</strong>.</li><li>Tap browser menu <strong>⋮</strong>.</li><li>Select <strong>Add to Home screen</strong> or <strong>Install app</strong>.</li><li>Tap <strong>Install</strong>.</li></ol>
      <p class="muted">The website must be live through HTTPS. The button still shows these steps even if Chrome does not show the popup.</p>`;
  }else{
    s.innerHTML=`<p><strong>Desktop Chrome / Edge:</strong></p>
      <ol><li>Open Freshly using HTTPS.</li><li>Click the install icon in the address bar.</li><li>Or browser menu > <strong>Install Freshly</strong>.</li></ol>`;
  }
  m.classList.remove('hidden');
}

async function runInstall(){
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
  }else{
    instructions();
  }
}

function bindInstallButtons(){
  document.querySelectorAll('[data-install-app]').forEach(btn=>{
    if(btn.dataset.installBound==='yes')return;
    btn.dataset.installBound='yes';
    btn.addEventListener('click',runInstall);
  });
}

function showButtons(){
  if(standalone()){
    document.querySelectorAll('[data-install-app]').forEach(b=>b.style.display='none');
    return;
  }
  document.querySelectorAll('[data-install-app]').forEach(b=>b.style.display='');
  bindInstallButtons();
}

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredPrompt=e;
  showButtons();
});

window.addEventListener('appinstalled',()=>{
  deferredPrompt=null;
  document.querySelectorAll('[data-install-app]').forEach(b=>b.style.display='none');
});

function init(){
  showButtons();
  bindInstallButtons();
  const obs=new MutationObserver(()=>{showButtons();bindInstallButtons();});
  obs.observe(document.body,{childList:true,subtree:true});
}

if('serviceWorker'in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(()=>null).finally(()=>{
      setTimeout(init,500);
    });
  });
}else{
  window.addEventListener('load',()=>setTimeout(init,500));
}
})();
