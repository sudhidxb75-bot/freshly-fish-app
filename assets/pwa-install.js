(function(){
  let deferredPrompt = null;

  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function isAndroid(){
    return /android/i.test(navigator.userAgent);
  }

  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function createModal(){
    let modal = document.querySelector('#freshlyInstallModal');
    if(modal) return modal;

    modal = document.createElement('div');
    modal.id = 'freshlyInstallModal';
    modal.className = 'freshly-install-modal hidden';
    modal.innerHTML = `
      <div class="freshly-install-card">
        <button class="freshly-install-close" type="button" aria-label="Close">×</button>
        <img src="assets/icons/icon-192.png" alt="Freshly">
        <h2>Install Freshly App</h2>
        <div class="freshly-install-steps" data-install-steps></div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.freshly-install-close').addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
      if(e.target === modal) modal.classList.add('hidden');
    });

    return modal;
  }

  function showInstructions(){
    const modal = createModal();
    const steps = modal.querySelector('[data-install-steps]');

    if(isIOS()){
      steps.innerHTML = `
        <p><strong>iPhone / iPad:</strong></p>
        <ol>
          <li>Open this website in <strong>Safari</strong>.</li>
          <li>Tap the <strong>Share</strong> button.</li>
          <li>Tap <strong>Add to Home Screen</strong>.</li>
          <li>Tap <strong>Add</strong>.</li>
        </ol>
        <p class="muted">Note: iPhone usually does not show a Chrome-style Install App button. Use Safari Share.</p>
      `;
    } else if(isAndroid()){
      steps.innerHTML = `
        <p><strong>Android Chrome:</strong></p>
        <ol>
          <li>Open the Freshly website in <strong>Chrome</strong>.</li>
          <li>Tap the browser menu <strong>⋮</strong>.</li>
          <li>Tap <strong>Add to Home screen</strong> or <strong>Install app</strong>.</li>
          <li>Tap <strong>Install</strong>.</li>
        </ol>
        <p class="muted">If the option is missing, refresh once and make sure the site is opened through HTTPS.</p>
      `;
    } else {
      steps.innerHTML = `
        <p><strong>Desktop Chrome / Edge:</strong></p>
        <ol>
          <li>Open the Freshly website using HTTPS.</li>
          <li>Look for the install icon in the address bar.</li>
          <li>Or open browser menu and select <strong>Install Freshly</strong>.</li>
        </ol>
      `;
    }

    modal.classList.remove('hidden');
  }

  function showInstallButton(){
    if(isStandalone()) return;

    let btn = document.querySelector('[data-install-app]');
    if(!btn){
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-primary install-app-btn';
      btn.setAttribute('data-install-app','');
      btn.innerHTML = '📲 Install App';
      document.body.appendChild(btn);
    }

    btn.classList.remove('hidden');

    btn.onclick = async () => {
      if(deferredPrompt){
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        btn.remove();
      } else {
        showInstructions();
      }
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
      navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then(() => {
        setTimeout(showInstallButton, 1200);
      }).catch(err => {
        console.warn('Freshly service worker registration failed', err);
        setTimeout(showInstallButton, 1200);
      });
    });
  } else {
    window.addEventListener('load', () => setTimeout(showInstallButton, 1200));
  }
})();
