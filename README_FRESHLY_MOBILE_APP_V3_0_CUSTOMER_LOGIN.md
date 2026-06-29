# Freshly Mobile App V3.0 - Customer User ID + Password Login

This revision adds proper customer login using User ID and password, while keeping signup separately.

## Added

- New customer portal page:

```txt
customer-portal.html
```

- Customer Login form:
  - User ID / Phone / Email / Freshly ID
  - Password

- Customer Sign Up form:
  - Name
  - Phone / WhatsApp
  - Email
  - User ID
  - Password
  - Confirm Password
  - WhatsApp Updates

- Checkout login updated:
  - Login with User ID + Password
  - Sign Up option kept separately

- Mobile top-right customer icon:
  - Shows Login when logged out
  - Shows customer name when logged in
  - Shows My Account, Track Order and Logout when logged in

## Backend

A backend Apps Script patch is included:

```txt
backend/Freshly_Customer_Login_AppScript_Patch.gs
```

Use this patch in your Apps Script backend for real password login.

## Important

The frontend also has local demo fallback so the UI can be tested immediately. For production, add the backend patch and redeploy Apps Script.

After upload, clear browser cache or open in incognito/private mode.
