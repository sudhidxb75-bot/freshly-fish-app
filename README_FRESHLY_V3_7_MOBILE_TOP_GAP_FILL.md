# Freshly V3.7 - Mobile Banner Top Gap Fill

This revision moves the mobile banner further upward so it fills the empty gap at the top more effectively.

## Added

New backend banner field:

```txt
MobileOffsetY
```

Recommended value:

```txt
-80px
```

## Best mobile settings

```txt
MobileObjectFit = contain
MobileObjectPosition = center top
MobileOffsetY = -80px
```

## New Apps Script menu item

```txt
Set Mobile Banner Fill Top Gap
```

This runs:

```txt
setMobileBannerFillTopGap
```

and sets all image banners to:

```txt
MobileObjectFit = contain
MobileObjectPosition = center top
MobileOffsetY = -80px
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
