# Freshly Mobile App / PWA Package V1.0

This package converts Freshly into an installable mobile app using PWA technology.

## What this mobile app does

- Customers can install Freshly on Android/iPhone home screen
- Uses the same Freshly website design
- Uses the same Google Apps Script backend
- Supports Shop, Cart, Checkout, Track Order and Join Freshly pages
- Adds offline fallback page
- Adds app icons and manifest
- Adds service worker for faster loading

## Files to upload to GitHub

Upload/replace these files in your Freshly repository:

```txt
index.html
track-order.html
assets/app.js
assets/config.js
assets/styles.css
assets/mobile-app.css
assets/pwa-install.js
manifest.webmanifest
service-worker.js
offline.html
assets/icons/
assets/freshly-logo-header.png
```

Keep the same folder structure.

## How users install the app

### Android Chrome
1. Open the Freshly website
2. Tap the menu `⋮`
3. Tap **Add to Home screen** or **Install app**

### iPhone Safari
1. Open the Freshly website in Safari
2. Tap Share
3. Tap **Add to Home Screen**

## Important GitHub Pages note

The PWA works best when your site is live with HTTPS, for example:

```txt
https://yourdomain.com
```

GitHub Pages and Cloudflare HTTPS are suitable.

## Backend

No new backend sheet is required. The app uses your existing Freshly backend URL from:

```txt
assets/config.js
```

## App Store / Play Store

This PWA is installable directly from browser. If you later want Play Store APK/AAB, this same PWA can be wrapped using Trusted Web Activity.
