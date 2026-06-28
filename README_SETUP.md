# Freshly Hub-Commerce Website Package V2.2

Freshly V2.2 is built as a **community-driven, single-seller, district-wise fresh commerce platform**.

Freshly sells to customers directly. Suppliers update stock and supply price through the portal, but products go live only after admin approval. Freshly Mart is kept as a separate linked marketplace website for future expansion.

## Main changes in V2.2

- Menu category changed to **Fish & Seafood**.
- Product catalogue shows only minimum details.
- Product details open on click in a same-page popup/expanded detail style similar to the current Freshly-online flow.
- District → Pincode → Freshly Hub location flow.
- District-wise pricing and stock support.
- Online admin dashboard: `admin.html`.
- Admin Management menu in Google Sheet backend.
- Freshly ID system for customers, suppliers, hubs, district masters, delivery partners, admins, products, orders, payments, refunds, districts and support tickets.
- Backend functions to generate and clear print sheets/reports safely.
- Clearing reports never deletes Orders, Products, Customers, Payments, FreshlyIDRegistry, AuditLog or WhatsAppQueue.
- WhatsAppQueue included for customer, supplier, hub, delivery partner and admin notifications.

## Files

- `index.html` — main website and shop.
- `admin.html` — online admin dashboard.
- `customer-portal.html` — customer login/signup portal.
- `supplier-portal.html` — supplier stock/price/compliance update portal.
- `join-freshly.html` — hub, supplier, delivery partner, district master and area request forms.
- `portal.html` — hub/delivery partner portal placeholder.
- `track-order.html` — order tracking.
- `freshly-mart.html` — separate marketplace link page.
- `assets/config.js` — paste Apps Script Web App URL here.
- `assets/app.js` — frontend logic.
- `assets/styles.css` — design.
- `backend/Freshly_Apps_Script.gs` — Google Apps Script backend.
- `BUSINESS_MODEL.md` — consolidated business model.
- `BACKEND_SHEET_GUIDE.md` — backend operating guide.
- `CHANGELOG.md` — revision notes.

## Step 1: Upload website files to GitHub

Upload all files except the `backend` folder if you do not want backend code visible in the public repository. The website can run in demo mode until the backend URL is added.

Recommended public files:

- All `.html` files
- `assets/` folder
- Policy/doc files if needed

## Step 2: Create Google Sheet backend

1. Create a new Google Sheet.
2. Click **Extensions → Apps Script**.
3. Delete old code.
4. Paste the full code from `backend/Freshly_Apps_Script.gs`.
5. Save.
6. Run `setupFreshlyBackend` once.
7. Approve permissions.
8. Reload the Google Sheet.
9. You will see the menu **Freshly Backend**.

## Step 3: Deploy Apps Script Web App

1. In Apps Script, click **Deploy → New deployment**.
2. Select **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
5. Deploy.
6. Copy the Web App URL.

## Step 4: Connect website to backend

Open `assets/config.js` and paste the Web App URL:

```js
window.FRESHLY_CONFIG = {
  BACKEND_URL: 'PASTE_APPS_SCRIPT_WEB_APP_URL_HERE',
  CURRENCY: '₹',
  DEMO_MODE_WHEN_BACKEND_EMPTY: true
};
```

## Step 5: Admin dashboard login

Open:

```text
admin.html
```

Default demo login:

```text
Freshly Admin ID: FLY-ADM-000001
PIN: 1234
```

Important: Change this default PIN immediately from the Google Sheet menu:

```text
Freshly Backend → Admin Management → Reset Admin PIN
```

## Step 6: Daily backend workflow

1. Supplier updates stock/price from `supplier-portal.html`.
2. Updates enter `StockPriceUpdates` as `Pending`.
3. Admin reviews margin, quality and compliance.
4. Admin changes `ApprovalStatus` to `Approved` and sets `AdminSellingPrice` if required.
5. Admin runs:

```text
Freshly Backend → Products & Approvals → Apply Approved Stock & Price Updates
```

6. Customer orders are saved in `Orders`, `OrderItems` and `Payments`.
7. Generate daily reports:

```text
Freshly Backend → Reports & Print Sheets → Generate District Purchase Sheet
Freshly Backend → Reports & Print Sheets → Generate Hub Dispatch Sheets
Freshly Backend → Reports & Print Sheets → Generate Delivery Sheets
Freshly Backend → Reports & Print Sheets → Generate Payment Report
```

## Step 7: Clear print sheets safely

Use:

```text
Freshly Backend → Reports & Print Sheets → Clear Print Sheets
Freshly Backend → Reports & Print Sheets → Clear Generated Reports
```

These clear only generated sheets. They do not clear original order, payment, customer, product or audit records.

## WhatsApp automation

Default mode is `LOG_ONLY`. Messages are created in `WhatsAppQueue` but not sent.

For production sending, use Meta WhatsApp Cloud API and store the following in Apps Script Project Settings → Script Properties:

- `META_ACCESS_TOKEN`
- `META_PHONE_NUMBER_ID`

Then change `WHATSAPP_MODE` in the Settings sheet to:

```text
META_CLOUD_API
```

Do not store WhatsApp tokens in GitHub files.


## V2.2 Header/Product Updates
- Supplier Portal is no longer in the main menu. It is available as a separate footer/backend link.
- Customer login is shown as an icon in the header.
- Location selection is available from the top-right dropdown above the menu.
- Promotional banners rotate automatically on the home page.
- Product Select opens same-page options window before adding to cart.


## V2.3 Public Website Cleanup
- The public homepage no longer shows backend/business-model explanations.
- The homepage starts with promotional offers and then the product catalogue.
- Backend/admin functionality remains available in the backend/admin files.


## V2.4 Public Frontend Updates
- Public caption is now “Freshness Delivered.”
- Contact link uses WhatsApp.
- Partner/admin/supplier login links are hidden from the public frontend.
- Product search has been added prominently.
- Slider banner size has been increased.


## V2.5 Quantity-Based Pricing

Products can now be priced by base unit and sold in selectable quantities.

Recommended product fields:

- `PriceBasis`: Per Kg, Per Pack, Per Litre, Per Piece, Per Dozen, Per Combo
- `BaseUnit`: kg, pack, litre, piece, dozen, combo
- `BasePrice`: customer price for one base unit
- `MinimumQty`: minimum selectable quantity
- `MaximumQty`: maximum selectable quantity
- `QtyStep`: quantity step, for example 0.5 for 500g steps
- `AllowedQtyOptions`: comma-separated options such as `0.5,1,1.5,2,2.5,3,4,5`
- `DefaultQty`: default selected quantity

For fish, seafood, meat, fruits and vegetables, use `PriceBasis = Per Kg`, `BaseUnit = kg`, and quantity options from `0.5` to `5`.
For oil, milk and liquid items, use `PriceBasis = Per Litre` and options like `0.5,1,2,5`.
For grocery packs, eggs and combos, use `Per Pack`, `Per Dozen`, `Per Piece`, or `Per Combo`.

OrderItems now stores `SelectedQty`, `BaseUnit`, `PriceBasis`, `BaseRate`, `ProductTotal`, `OptionCharges`, and `LineTotal` for clear reporting.


## V2.6 Menu Update
- Bulk Order has been added to the public menu and links to `bulk-orders.html`.


## V2.7 Checkout Location
- Checkout now supports `Use My Current Location` using the browser geolocation API.
- This works best on HTTPS websites such as your live domain.
- Customers can also enter address manually.
- Orders sheet now stores address and map location fields.


## V2.7.1 Apps Script Fix
- Fixed line 226 syntax error. Replace the old Apps Script with `backend/Freshly_Apps_Script.gs` from this package and save.

## V2.8 Reports and Print Sheets

After pasting the Apps Script, run:

1. Freshly Backend → Setup / Repair Sheets
2. Freshly Backend → Reports & Print Sheets → Generate ALL Daily Reports
3. For monthly reports: Freshly Backend → Reports & Print Sheets → Generate ALL Monthly Reports
4. For yearly reports: Freshly Backend → Reports & Print Sheets → Generate ALL Yearly Reports

Daily reports created:
- DailyOrderReport
- DailyProductRequirementReport
- DailyDistrictPurchaseSheet
- DailyHubDispatchSheet
- DeliverySheet
- PaymentReport
- DailyPaymentPendingReport
- ProductStockReport
- SupplierStatement
- HubStatement
- CustomerStatement
- SalesSummaryReport
- Print_Orders
- Print_Payments
- Print_Dispatch
- Print_DailySummary

Monthly reports created:
- PaymentReport
- DailyProductRequirementReport with PeriodType = monthly
- SupplierStatement
- HubStatement
- CustomerStatement
- MonthlySalesReport
- Print_MonthlySummary

Yearly reports created:
- PaymentReport
- DailyProductRequirementReport with PeriodType = yearly
- SupplierStatement
- HubStatement
- CustomerStatement
- YearlySalesReport
- Print_YearlySummary

Clear functions are safe. They clear generated report/print sheets only and do not delete main data from Orders, OrderItems, Payments, Products, Customers, Suppliers, FreshlyIDRegistry, AuditLog or AdminActivityLog.


## V2.8.1 Style Update
- `assets/styles.css` updated to move the product search box above category tabs.


## V2.9 Backend-Managed Banners

Run `Freshly Backend → Setup / Repair Sheets` after updating Apps Script. A new sheet named `Banners` will be created.

Banners sheet columns:
`BannerID | Label | Title | Subtitle | ImageURL | ButtonText | ButtonLink | SortOrder | Status | CreatedAt | UpdatedAt`

To show a banner:
- `Status = Active`

To hide a banner:
- `Status = Hidden`

To change order:
- update `SortOrder`

To change image:
- paste a public image URL or a website asset path such as `assets/images/banner-hub-partner.png`.


## V2.9.1 Banner DisplayMode

The `Banners` sheet now has a `DisplayMode` column.

Use:
- `ImageOnly` for fully designed image banners that already contain text.
- `OverlayText` for plain/background banners where the website should add title, subtitle and button.

For generated Freshly banners, use `ImageOnly`.


## V2.9.2 Banner and Header Refinements
- The homepage slider can display up to 9 active banners (and more if needed).
- For best results, set SortOrder from 1 to 9 for the first 9 banners.
- Slider width is now centered and reduced for a cleaner homepage look.
- Banner height is reduced to show more content above the fold.
- Header logo size is increased for stronger branding.


## V2.9.3 Updates

- Removed the small “Freshness Delivered.” text above the logo.
- Supplier banner links to `join-freshly.html#supplier`.
- Banner images are now fitted inside the slider area using contain mode.
- Partner portal structure is available through `portal.html` for Hub Partner, Delivery Partner and District Master operations.

Recommended portal access:
- Hub Partner: `portal.html#hub-partner`
- Delivery Partner: `portal.html#delivery-partner`
- District Master: `portal.html#district-master`

Keep these portal links as backend/shared operational links, not public main menu links.


## V2.9.4 Full-Width Banners

Homepage banners are now full width.

Image-only banners use:
- `object-fit: cover`
- desktop height: 300px
- mobile height: 190px

This gives a cleaner homepage slider appearance. Some edge cropping may happen depending on the banner image ratio.


## V2.9.5 Clear Reports and Print Sheets

After pasting the revised Apps Script and reloading the Google Sheet, open:

`Freshly Backend → Clear / Reset Generated Sheets`

Available options:
- Clear Print Sheets Only
- Clear Reports Only
- Clear Reports + Print Sheets

The same options are also available under:

`Freshly Backend → Reports & Print Sheets`

These clear only generated report/print sheet rows below the header. They do not delete operational data.


## V2.9.6 Partner Dashboards

New dashboard pages:
- `hub-partner-dashboard.html`
- `delivery-partner-dashboard.html`
- `district-master-dashboard.html`

Partner portal landing page:
- `portal.html`

Each dashboard has:
- Freshly Partner ID login field
- PIN field
- Date selector
- Dashboard metrics
- Relevant operational tables
- Demo data if backend URL is empty

For live use:
1. Paste `Freshly_Apps_Script.gs` into Google Apps Script.
2. Run `setupFreshlyBackend`.
3. Deploy as Web App.
4. Paste Web App URL into `assets/config.js`.
5. Issue Freshly IDs and PINs for partners.

Recommended access:
- Hub Partner: `hub-partner-dashboard.html`
- Delivery Partner: `delivery-partner-dashboard.html`
- District Master: `district-master-dashboard.html`


## V2.9.7 Logo and Dashboard Link Fix

The header logo now uses a text-based Freshly logo fallback, so it will not show a broken image icon if the SVG path fails.

Partner dashboard landing pages:
- `portal.html`
- `partner-dashboard.html`

Direct dashboards:
- `hub-partner-dashboard.html`
- `delivery-partner-dashboard.html`
- `district-master-dashboard.html`


## V2.9.8 Backend Loading Check

This version fixes compatibility between `index.html` and `assets/app.js` for the new Country selector.

Important:
- Upload the full `assets` folder to GitHub, not only `index.html`.
- Confirm `assets/config.js` contains your deployed Apps Script Web App URL in `BACKEND_URL`.
- Confirm `assets/app.js` and `assets/styles.css` are uploaded.
- Confirm `assets/freshly-logo-header.png` is uploaded.

If `BACKEND_URL` is empty, the site uses demo data only.
