# Freshly Desktop + Mobile Package V3.1

This package revises the desktop website to match the latest mobile app updates.

## Desktop updates included

- Final Freshly category list added to desktop top menu.
- Categories dropdown opens on click.
- Customer Login / Sign Up added to desktop menu.
- Top-right customer icon added for desktop.
- Logged-in customer name shows near the customer icon.
- Customer menu shows:
  - My Account
  - Track Order
  - Logout
- Customer portal retained:
  - customer-portal.html
- Customer login supports:
  - User ID / Phone / Email / Freshly ID
  - Password
- Signup kept separately.

## Final categories

- Fish & Seafood
- Chicken
- Mutton
- Eggs
- Fruits & Vegetables
- Food
- Groceries
- Daily Essentials
- Ready to Cook
- Combo Packs
- Freshly Mart

## Backend

The backend patch is included:

```txt
backend/Freshly_Customer_Login_AppScript_Patch.gs
```

Use it in Apps Script for real customer password login.

## Upload

Upload/replace the full package to your GitHub repository.

Important changed files:

```txt
index.html
track-order.html
customer-portal.html
assets/app.js
assets/freshly-mobile-app-v2.css
assets/freshly-mobile-app-v2.js
service-worker.js
backend/Freshly_Customer_Login_AppScript_Patch.gs
```

After upload, clear browser cache or open in incognito/private mode.
