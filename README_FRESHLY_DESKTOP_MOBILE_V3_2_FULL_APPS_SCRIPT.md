# Freshly Desktop + Mobile Package V3.2 - Full App Script Included

This package corrects the previous issue where only the customer login patch was included.

## Corrected

The package now includes the full integrated Apps Script:

```txt
backend/Freshly_Apps_Script.gs
```

## Included backend features

- Existing Freshly backend features
- Product/category/hub/public data APIs
- Order placement
- Track order
- Admin dashboard
- Partner dashboards
- Daily, monthly and yearly reports
- Hub dispatch reports
- Payment reports
- Customer/supplier/hub statements
- Banner backend controls
- Customer signup
- Customer login using User ID / Phone / Email / Freshly ID + Password
- Password hashing
- Final V3 categories
- Freshly Mart category

## Important

Paste the full file below into Apps Script:

```txt
backend/Freshly_Apps_Script.gs
```

Do not paste only the patch file.

## After update

Run these functions once:

```txt
setupFreshlyBackend
updateFreshlyV3Categories
```

Then redeploy the Apps Script Web App and update `assets/config.js` if the deployment URL changes.
