# Freshly V3.4 - Mobile Top Menu Fix

This revision fixes the mobile top menu/hamburger behavior.

## Fixed

- Mobile hamburger opens and closes reliably.
- Menu appears above the page with a dark backdrop.
- Page does not scroll behind the menu.
- Categories submenu opens by tap.
- Categories submenu closes by tapping again.
- Fish & Seafood, Chicken, Mutton and Eggs are visible at the top of the submenu.
- Freshly Mart remains as the last category.
- Tapping a category opens the shop section and filters/searches that category.
- Tapping outside closes the menu.

## Important changed file

```txt
assets/freshly-mobile-menu-fix-v34.js
```

This file is loaded last to override older menu conflicts.

After upload, clear browser cache or open in incognito/private mode. Service worker cache may otherwise show the older menu.
