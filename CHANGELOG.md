
## V2.9.17
- Fixed missing/collapsed homepage banner area by adding a safe fallback banner.
- Improved banner rendering when backend Banners sheet is empty, inactive, or has blank rows.
- Fixed slider to initialize on the first banner and rotate only when multiple banners are available.
- Confirmed backend banner control through the Banners sheet and expanded the banner guide.
- Updated cache-busting query strings to 2.9.17.


## V2.9.16
- Fixed homepage banner slider alignment so only one banner shows at a time.
- Corrected slider transform logic for full-width banners.
- Ensured image-only banners fill the full banner width and height.
- Added backend banner control guide for the Banners sheet.
- Updated cache-busting query strings to 2.9.16.


## V2.9.15
- Made homepage banner images fill the full banner width and height.
- Changed banner image display to cover mode to remove empty white space.
- Fixed promo slider track and slide sizing for full-width banners.
- Updated cache-busting query strings to 2.9.15.


## V2.9.14
- Increased homepage banner height for better visibility.
- Increased backend-managed banner height and image-only banner height.
- Adjusted banner text size and dot position for the taller banner.
- Updated cache-busting query strings to 2.9.14.


## V2.9.13
- Reduced the height of the location selector button.
- Reduced spacing inside the location dropdown panel.
- Reduced height of country, district/city, pincode/area, and hub selector fields.
- Updated cache-busting query strings to 2.9.13.


## V2.9.12
- Moved the top menu row slightly upward.
- Adjusted dropdown panel position to match the raised menu.
- Updated cache-busting query strings to 2.9.12.


## V2.9.11
- Slightly enlarged the Freshly logo area in the header.
- Reduced top strip and main menu height for a more compact header.
- Adjusted menu item, login icon, and location selector sizing to fit the shorter header.
- Updated cache-busting query strings to 2.9.11.


## V2.9.10
- Removed "Freshly catalogue" badge from the homepage shop banner area.
- Reduced homepage banner height for a cleaner layout.
- Improved location/area selector dropdown width and control sizing.
- Added cache-busting query strings for updated CSS and JS assets.

# Changelog

## V2.9.7
- Fixed broken logo display by replacing image-only logo with text-based Freshly logo fallback.
- Updated all pages to use the stable text logo.
- Rebuilt `portal.html` to clearly show Hub Partner, Delivery Partner and District Master dashboard links.
- Added `partner-dashboard.html` as a compatibility landing page for old partner-dashboard links.
- Removed dependency on logo image loading for header visibility.

## V2.9.6
- Added separate partner dashboard pages:
  - `hub-partner-dashboard.html`
  - `delivery-partner-dashboard.html`
  - `district-master-dashboard.html`
- Updated `portal.html` to link to the new dashboards.
- Added dashboard login fields using Freshly Partner ID + PIN.
- Added demo dashboard data when backend URL is not configured.
- Added backend action `getPartnerDashboard`.
- Added backend dashboard builders for Hub Partner, Delivery Partner and District Master views.
- Added sample operational tables for dispatch, pickup, delivery, payment support, hub statements, delivery earnings, district overview, hub performance and supplier requirements.

## V2.9.5
- Added clear options in two places under Freshly Backend menu:
  - Reports & Print Sheets
  - Clear / Reset Generated Sheets
- Added `Clear Print Sheets Only`.
- Added `Clear Reports Only`.
- Added `Clear Reports + Print Sheets`.
- Added confirmation alerts before clearing generated report/print sheets.
- Clearing is restricted to generated sheets only and does not delete Orders, OrderItems, Payments, Customers, Suppliers, Products, Freshly IDs, Admin Users, Audit Logs or WhatsApp Queue.

## V2.9.4
- Made homepage sliding banners full width.
- Removed banner side margins and rounded container edges.
- Image-only banners now use full-width cover style for a cleaner hero-slider look.
- Adjusted desktop and mobile banner heights for full-width display.

## V2.9.3
- Removed “Freshness Delivered.” text placed above the logo.
- Supplier banner now points to `join-freshly.html#supplier`.
- Adjusted banner sizing to fit within the slider space.
- Image-only banners now use `object-fit: contain` to avoid cropping.
- Added clearer partner portal structure for Hub Partner, Delivery Partner and District Master.
- Kept partner portals as separate/backend operational links, not public main-menu items.

# Changelog

## V2.9.2
- Increased sample slider setup to 9 banner rows.
- Reduced banner width using a centered promo slider container.
- Reduced banner height for both overlay and image-only banners.
- Increased header logo size for better brand visibility.
- Improved mobile slider sizing and header logo responsiveness.

## V2.9.1
- Added `DisplayMode` column to the Banners sheet.
- `DisplayMode = ImageOnly` now displays the banner image without overlay title/subtitle/button.
- `DisplayMode = OverlayText` keeps the previous image/text overlay style.
- Default generated hub partner and supplier banners are set as ImageOnly.

# Changelog

## V2.9
- Added backend-managed Banners sheet.
- Website slider now reads active banners from backend.
- Added demo banner rows for offer, hub partner and supplier registration.
- Added generated banner image assets under assets/images when available.
- Banner visibility, order, image, button text and button link can now be controlled from Google Sheet.

# Changelog

## V2.8.1
- Revised `assets/styles.css`.
- Moved product search box above category buttons in the shop section.
- Kept categories aligned below the search box.
- Mobile view keeps search full-width above categories.

# Changelog

## V2.8
- Added working report generation functions in Apps Script.
- Added one-click report actions for daily, monthly and yearly reports.
- Added report sheets: DailyOrderReport, DailyProductRequirementReport, DailyPaymentPendingReport, ProductStockReport, SupplierStatement, HubStatement, CustomerStatement, SalesSummaryReport, MonthlySalesReport and YearlySalesReport.
- Added printable summary sheets: Print_DailySummary, Print_MonthlySummary and Print_YearlySummary.
- Updated Reports & Print Sheets menu in Google Sheets.
- Updated online Admin Dashboard report buttons.
- Clear functions now clear only generated reports/print sheets and protect main data sheets.

# Changelog

## V2.7.1
- Fixed Apps Script syntax error caused by a literal `\n` text inserted before the order object.
- No feature changes from V2.7.

# Changelog

## V2.7
- Added checkout option to use customer’s current location.
- Added manual address fields: house/flat no., building, area, landmark and full address.
- Added map/location fields to Orders sheet: AddressMode, Latitude, Longitude, LocationAccuracy, GoogleMapLink and LocationCapturedAt.
- Checkout now requires either captured location or manual address.
- Existing V2.6 Bulk Order menu and V2.5 price-basis/quantity features remain unchanged.

# Changelog

## V2.6
- Added Bulk Order to the public main menu.
- Bulk Order links to bulk-orders.html.
- Existing V2.5 quantity/price-basis logic remains unchanged.

# Changelog

## V2.5
- Added quantity-based pricing: per kg, per pack, per litre, per piece, per dozen and per combo.
- Product cards now display rates like ₹220 / kg or ₹180 / litre.
- Product select window now shows customer options such as 500g, 1kg, 1.5kg, 2kg, 3kg and 5kg.
- Cart now shows selected quantity, rate, product total, option charges and item total.
- Backend Products sheet now supports PriceBasis, BaseUnit, BasePrice, MinimumQty, MaximumQty, QtyStep, AllowedQtyOptions and DefaultQty.
- Backend OrderItems now stores selected quantity and unit pricing details for reporting.

# Changelog

## V2.4
- Changed public caption to “Freshness Delivered.”
- Removed repeated “Freshness delivered with trust and convenience.”
- Changed support text to “Contact Us” with WhatsApp link.
- Removed partner/admin/supplier login links from the public frontend.
- Kept admin and supplier pages as direct backend/operational files.
- Added a prominent product search section.
- Increased the promotional slider banner size.

# Changelog

## V2.3
- Removed the large homepage hero section shown in the screenshot.
- Removed the community cards section from the homepage.
- Removed public mentions of backend, business model, single-seller model and admin approval from customer-facing pages.
- Kept backend/admin functionality in the backend files and admin dashboard.
- Cleaned customer-facing wording to focus on shopping, offers, location, products and delivery.

# Changelog

## V2.2
- Removed Supplier Portal from top menu; retained as separate footer/backend link.
- Removed repeated Freshly word from header brand area.
- Added promotional sliding banners for offers and announcements.
- Replaced Customer Login menu text with a customer icon.
- Moved Freshly location selector to the top-right header dropdown.
- Select now opens a same-page product option window/modal before adding to cart.

# Changelog

## V2.0

- Repositioned Freshly as a community-driven commerce platform.
- Kept Freshly as single-seller model and Freshly Mart as separate linked marketplace.
- Changed category to **Fish & Seafood**.
- Added district → pincode → hub selection.
- Added district-wise pricing support.
- Revised catalogue to show minimum product details.
- Added product detail click popup matching current Freshly-online style direction.
- Added online admin dashboard.
- Added admin management menu.
- Added Freshly ID registry and ID generation for all major entities.
- Added clear print sheets and clear generated reports functions.
- Added safeguards so clearing reports never deletes core records.
- Added admin login and role-ready backend tables.
- Added WhatsAppQueue with LOG_ONLY default and Meta Cloud API option.
- Added business model and backend guide documents.
