# Freshly V3.6 - Mobile Banner Up Fix

This revision moves the mobile banner image upward to reduce the blank gap at the top.

## Added

New backend banner field:

```txt
MobileObjectPosition
```

Recommended value:

```txt
center top
```

## Best mobile setting

```txt
MobileObjectFit = contain
MobileObjectPosition = center top
```

This keeps the full image visible on mobile and pushes the image upward so the blank gap appears at the bottom instead of the top.

## New Apps Script menu item

```txt
Set Mobile Banner Up Fit
```

This runs:

```txt
setMobileBannerTopFit
```

and sets all image banners to:

```txt
MobileObjectFit = contain
MobileObjectPosition = center top
```

## Important changed files

```txt
assets/app.js
assets/styles.css
assets/freshly-mobile-app-v2.css
backend/Freshly_Apps_Script.gs
service-worker.js
```

After upload, clear browser cache or open in incognito/private mode.
