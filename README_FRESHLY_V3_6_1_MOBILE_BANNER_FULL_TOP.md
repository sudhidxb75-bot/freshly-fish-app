# Freshly V3.6.1 - Mobile Banner Full Top Position

This revision uses the uploaded working V3.6 package and fixes the mobile banner top gap.

## Fixed

- Banner starts from the top edge of the mobile banner area.
- Blank gap above banner is removed.
- Image is anchored to the top using:

```txt
MobileObjectPosition = center top
```

## Backend option added

```txt
MobileTopShift
```

Default:

```txt
0px
```

## Recommended Banners sheet settings

```txt
MobileObjectFit = contain
MobileObjectPosition = center top
MobileTopShift = 0px
```

## New Apps Script menu option

```txt
Set Mobile Banner Full Top
```

This runs:

```txt
setMobileBannerFullTop
```

## Changed files

```txt
assets/app.js
assets/styles.css
assets/freshly-mobile-app-v2.css
backend/Freshly_Apps_Script.gs
service-worker.js
```

After upload, clear browser cache or open in incognito/private mode.
