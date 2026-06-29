# Freshly V3.6.2 - Full Mobile Page Top Fix

This revision moves the full mobile page content upward, not only the banner image.

## Fixed

- Removes blank top spacing on mobile.
- Keeps mobile header compact.
- Makes the banner start immediately below the mobile header/search area.
- Reduces accidental spacer height before the banner.
- Keeps the home/welcome section closer to the banner.

## Backend utility added

```txt
Set Mobile Compact Top Layout
```

This runs:

```txt
setMobileCompactTopLayout
```

Recommended banner settings:

```txt
MobileObjectFit = contain
MobileObjectPosition = center top
MobileTopShift = 0px
```

## Important changed files

```txt
assets/styles.css
assets/freshly-mobile-app-v2.css
backend/Freshly_Apps_Script.gs
service-worker.js
```

After upload, clear browser cache or open in incognito/private mode.
