(function(){
  let deferredPrompt = null;

  function showInstallButton(){
    let btn = document.querySelector('[data-install-app]');
    if(!btn){
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary install-app-btn';
      btn.setAttribute('data-install-app','');
      btn.textContent = 'Install App';
      btn.style.position = 'fixed';
      btn.style.left = '16px';
      btn.style.bottom = '16px';
      btn.style.zIndex = '120';
      btn.style.boxShadow = '0 16px 34px rgba(15,23,42,.18)';
      document.body.appendChild(btn);
    }
    btn.classList.remove('hidden');
    btn.onclick = async () => {
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      btn.remove();
    };
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const btn = document.querySelector('[data-install-app]');
    if(btn) btn.remove();
  });

  if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js?v=3.7.4', {scope:'./', updateViaCache:'none'}).then(reg => reg.update()).catch(err => {
        console.warn('Freshly service worker registration failed', err);
      });
    });
  }
})();
