# Freshly V3.5 - Mobile Banner ObjectFit Option

This revision adds a separate mobile object-fit option for banners.

## Added

New backend banner field:

```txt
MobileObjectFit
```

Recommended value for mobile fitting:

```txt
contain
```

## Supported values

```txt
contain
cover
fill
scale-down
none
```

## What this fixes

If a banner image is getting cropped on mobile, set:

```txt
MobileObjectFit = contain
```

This will fit the full banner image inside the mobile screen.

## Backend utility added

In Apps Script menu:

```txt
Set Mobile Banner Fit: Contain
```

This runs:

```txt
setMobileBannerObjectFitContain
```

and sets all image banners to:

```txt
MobileObjectFit = contain
```

## Banners sheet columns

Recommended banner columns:

```txt
DesktopHeight
MobileHeight
ObjectFit
MobileObjectFit
ObjectPosition
```

## Upload

Upload/replace all files in this package.

Important changed files:

```txt
assets/app.js
assets/styles.css
assets/freshly-mobile-app-v2.css
backend/Freshly_Apps_Script.gs
service-worker.js
```

After upload, clear browser cache or open in incognito/private mode.
