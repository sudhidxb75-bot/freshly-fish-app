# Freshly V2.0 Backend Sheet Guide

Run `setupFreshlyBackend` from Apps Script to create/repair all sheets.

## Freshly Backend menu

```text
Freshly Backend
  Setup / Repair Sheets
  Refresh Dashboard
  Products & Approvals
    Apply Approved Stock & Price Updates
    Evaluate Supplier Compliance
    Check Compliance Expiry
  Reports & Print Sheets
    Generate District Purchase Sheet
    Generate Hub Dispatch Sheets
    Generate Delivery Sheets
    Generate Payment Report
    Clear Print Sheets
    Clear Generated Reports
  Admin Management
    Create Admin User
    Create Freshly ID
    Generate Missing Freshly IDs
    Reset Admin PIN
    Activate / Deactivate Admin
    View Admin Users
  WhatsApp
    Process Pending WhatsApp Queue
    Set WhatsApp Mode: LOG_ONLY
```

## Identity sheets

### FreshlyIDRegistry
Master registry for all IDs.

Formats:

| Entity | Format |
|---|---|
| Customer | FLY-CUS-000001 |
| Supplier | FLY-SUP-000001 |
| Hub Partner | FLY-HUB-000001 |
| District Master | FLY-DMH-000001 |
| Delivery Partner | FLY-DLP-000001 |
| Admin User | FLY-ADM-000001 |
| Product | FLY-PRD-000001 |
| Order | FLY-ORD-000001 |
| Payment | FLY-PAY-000001 |
| Refund | FLY-REF-000001 |
| District | FLY-DST-000001 |
| Local Hub | FLY-LHB-000001 |
| Support Ticket | FLY-TKT-000001 |

## Location and pricing sheets

- `Districts` — active districts shown in website dropdown.
- `DistrictMasterHubs` — central district hub.
- `LocalHubs` — hubs listed under district/pincode.
- `DeliveryAreas` — pincode and area mapping.
- `DeliverySlots` — hub-wise delivery slots.
- `DistrictPricing` — district-wise supply price, selling price, offer price and stock.

## Product sheets

- `Categories` — includes **Fish & Seafood**.
- `Products` — master catalogue.
- `ProductOptions` — cleaning, cutting, marination or size options.
- `ProductImages` — optional gallery.
- `StockPriceUpdates` — supplier submitted updates pending admin approval.

Public product visibility requires:

```text
ApprovalStatus = Approved
WebsiteStatus = Active
ProductOwner = Freshly
Supplier ApprovedToSupply = Yes
```

## Order sheets

- `Orders`
- `OrderItems`
- `Payments`
- `Refunds`
- `DeliveryAssignments`

## Report and print sheets

Generated/clearable sheets:

- `DailyDistrictPurchaseSheet`
- `DailyHubDispatchSheet`
- `DeliverySheet`
- `PaymentReport`
- `SupplierStatement_Print`
- `HubStatement_Print`
- `DistrictStatement_Print`
- `CustomerStatement_Print`
- `Print_Orders`
- `Print_Payments`
- `Print_Dispatch`

Never clear these main records:

- `Orders`
- `OrderItems`
- `Payments`
- `Customers`
- `Suppliers`
- `Products`
- `DistrictPricing`
- `FreshlyIDRegistry`
- `AdminUsers`
- `AuditLog`
- `AdminActivityLog`
- `WhatsAppQueue`

## Online Admin Dashboard

Open `admin.html` after connecting Apps Script backend.

Default demo admin:

```text
FLY-ADM-000001 / 1234
```

Change default PIN before live launch.


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


## V2.7 Orders Address Columns
Add / keep these order location columns: `AddressMode`, `HouseNo`, `BuildingName`, `Area`, `Landmark`, `ManualAddress`, `Latitude`, `Longitude`, `LocationAccuracy`, `GoogleMapLink`, `LocationCapturedAt`.

## V2.8 Report Sheets

The backend creates these report sheets during Setup / Repair:

Daily operations:
- DailyOrderReport
- DailyProductRequirementReport
- DailyDistrictPurchaseSheet
- DailyHubDispatchSheet
- DeliverySheet
- PaymentReport
- DailyPaymentPendingReport
- ProductStockReport

Statements:
- SupplierStatement
- HubStatement
- CustomerStatement
- SupplierStatement_Print
- HubStatement_Print
- CustomerStatement_Print
- DistrictStatement_Print

Summaries:
- SalesSummaryReport
- MonthlySalesReport
- YearlySalesReport

Print sheets:
- Print_Orders
- Print_Payments
- Print_Dispatch
- Print_DailySummary
- Print_MonthlySummary
- Print_YearlySummary

Report control:
- ReportArchive records generated and cleared report actions.
- PrintSheetControl identifies generated sheets that can be cleared.
- Main data sheets are never cleared by report clearing functions.


## Banners Sheet

Use the `Banners` sheet to control homepage sliding banners from backend.

Columns:
- BannerID
- Label
- Title
- Subtitle
- ImageURL
- ButtonText
- ButtonLink
- SortOrder
- Status
- CreatedAt
- UpdatedAt

Example:
`BAN002 | Hub Partner | Become a Freshly Hub Partner | Start earning from your local area | assets/images/banner-hub-partner-earnings.png | Register Now | join-freshly.html | 2 | Active`


## Banners DisplayMode

Add/keep this column in `Banners` sheet:

`DisplayMode`

Allowed values:
- `ImageOnly` — show banner image only. Best for designed banners with text already inside the image.
- `OverlayText` — show backend title/subtitle/button over the banner.

Example:
`BAN003 | Supplier | Register as Freshly Supplier | Supply to Freshly and grow with organized demand. | assets/images/banner-supplier.png | Register as Supplier | sell-with-us.html | 3 | Active | ImageOnly`


## Banner Notes (V2.9.2)
- You can create 9 active homepage banners by adding rows `BAN001` to `BAN009`.
- Use `SortOrder` 1 to 9 to arrange them.
- `DisplayMode = ImageOnly` is best for designed banner images.
- `DisplayMode = OverlayText` is best for text generated by the website.


## Partner Portals

Freshly can maintain three partner portal roles:
- Hub Partner Portal
- Delivery Partner Portal
- District Master Portal

These should use role-based access in future versions. Keep them as operational/backend links and avoid showing them in the public main menu.


## Clear Reports / Print Sheets

Menu path:

`Freshly Backend → Clear / Reset Generated Sheets`

Safe clear options:
- Clear Print Sheets Only
- Clear Reports Only
- Clear Reports + Print Sheets

Protected sheets are never cleared:
Orders, OrderItems, Payments, Customers, Suppliers, Products, DistrictPricing, FreshlyIDRegistry, AdminUsers, AuditLog, AdminActivityLog, WhatsAppQueue.


## V2.9.6 Partner Dashboard Backend

Backend action:
`getPartnerDashboard`

Expected request:
- Role: `hub`, `delivery`, or `district`
- PartnerID: Freshly Partner ID
- PIN: partner PIN
- Date: dashboard date

Dashboard pages:
- Hub Partner Dashboard: daily hub dispatch, pickup customers, home delivery handover, hub statement.
- Delivery Partner Dashboard: assigned delivery list, payment confirmation support, delivery earnings.
- District Master Dashboard: district order overview, hub performance, supplier requirement, district statement.

Keep dashboard URLs private and share only with approved Freshly partners.
