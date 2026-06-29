# Freshly V3.6.3 - Force Mobile Banner Top

This revision fixes the issue where previous CSS-only changes did not move the banner up.

## What changed

A new runtime override file is added and loaded last:

```txt
assets/freshly-mobile-banner-fulltop-v363.js
```

This applies inline mobile styles after the backend banner is rendered.

## Fixed

- Removes the visible blank top gap inside the banner frame.
- Crops/shifts the banner image upward on mobile.
- Sets the mobile banner frame to 320px.
- Forces image display to top-crop on mobile.
- Works after dynamic backend banner loading.

## Recommended backend banner settings

```txt
MobileHeight = 320
MobileObjectFit = cover
MobileObjectPosition = center top
```

## New Apps Script option

```txt
Set Mobile Banner Strong Top Crop
```

## Important changed files

```txt
assets/freshly-mobile-banner-fulltop-v363.js
assets/styles.css
assets/freshly-mobile-app-v2.css
backend/Freshly_Apps_Script.gs
service-worker.js
```

After upload, clear browser cache or open in incognito/private mode. If installed as PWA, uninstall and reinstall the app to remove old service-worker cache.
