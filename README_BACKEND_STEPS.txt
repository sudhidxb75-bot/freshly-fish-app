FRESHLY BACKEND SETUP GUIDE
===========================

This package keeps the customer website simple. The operational backend is handled through Google Sheets + Google Apps Script.

FILES INCLUDED
--------------
1. index.html
2. assets/style.css
3. assets/app.js
4. images/freshly-logo.png
5. Freshly_Apps_Script.gs
6. README_BACKEND_STEPS.txt

IMPORTANT WEBSITE SETTINGS
--------------------------
Open assets/app.js and update these 4 lines:

const FISH_DATA_URL = "PASTE_FISH_DATA_PUBLISHED_CSV_URL_HERE";
const DELIVERY_DATA_URL = "PASTE_DELIVERY_AREA_PUBLISHED_CSV_URL_HERE";
const BACKEND_URL = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

Use your Freshly main WhatsApp number without +, spaces, or brackets.
Example: 918921696649


STEP 1: CREATE / UPDATE GOOGLE SHEET
------------------------------------
Create or open your Freshly backend Google Sheet.

Recommended sheet tabs will be created automatically by the Apps Script:

1. FishData
2. DeliveryAreas
3. Orders
4. Leads
5. Customers
6. ReferralRewards
7. DailyDispatch
8. HubStatements
9. CustomerStatements
10. Settings


STEP 2: PASTE APPS SCRIPT
-------------------------
1. Open your Google Sheet.
2. Click Extensions.
3. Click Apps Script.
4. Delete old script code.
5. Paste the full code from Freshly_Apps_Script.gs.
6. Click Save.
7. Run setupFreshlySheets once.
8. Approve permissions.

After setup, reload the Google Sheet. You will see a menu:

Freshly Backend


STEP 3: UPDATE FISHDATA SHEET
-----------------------------
FishData columns:

Name
Malayalam
Price
Stock
Image
Clean Charge/Kg
Curry Cut Charge/Kg
Steak Cut Charge/Kg
Fillet Charge/Kg
Marination Charge/Kg

Example:

Ayala / Mackerel | അയല | 220 | YES | image-url | 20 | 30 | 40 | 60 | 30

Notes:
- Stock must be YES to show as available.
- Price is per kg.
- Cleaning and cutting charges are controlled here.
- Marination charge is also controlled here.
- If a charge should be free, enter 0.


STEP 4: PUBLISH FISHDATA AS CSV
-------------------------------
1. Open the Google Sheet.
2. File > Share > Publish to web.
3. Choose sheet: FishData.
4. Format: Comma-separated values (.csv).
5. Publish.
6. Copy the published CSV link.
7. Paste it in assets/app.js:

const FISH_DATA_URL = "YOUR_FISHDATA_CSV_LINK";


STEP 5: UPDATE DELIVERYAREAS SHEET
----------------------------------
DeliveryAreas columns:

Pin Code
City
Area
Available
Hub Name
Hub Partner
Hub Phone
Pickup Available
Home Delivery Available
Home Delivery Charge
Minimum Order

Example:

673571 | Kunnamangalam | Kunnamangalam | YES | Freshly Kunnamangalam Hub | Partner Name | 91XXXXXXXXXX | YES | YES | 50 | 300

Important:
- Available = YES means Freshly accepts orders in that area.
- Pickup Available = YES allows hub pickup.
- Home Delivery Available = YES allows home delivery.
- Home Delivery Charge is controlled here.
- Minimum Order is controlled here.
- The Hub Partner is also the delivery partner.


STEP 6: PUBLISH DELIVERYAREAS AS CSV
------------------------------------
1. File > Share > Publish to web.
2. Choose sheet: DeliveryAreas.
3. Format: Comma-separated values (.csv).
4. Publish.
5. Copy the CSV link.
6. Paste it in assets/app.js:

const DELIVERY_DATA_URL = "YOUR_DELIVERYAREAS_CSV_LINK";


STEP 7: DEPLOY APPS SCRIPT AS WEB APP
-------------------------------------
1. Apps Script > Deploy.
2. New deployment.
3. Select type: Web app.
4. Execute as: Me.
5. Who has access: Anyone.
6. Deploy.
7. Copy the Web App URL.
8. Paste it in assets/app.js:

const BACKEND_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";

After every script change, create a new deployment or update the existing deployment.


STEP 8: REFERRAL REWARD POINTS
------------------------------
Referral program backend is controlled by the Settings sheet.

Settings columns:

Setting
Value
Notes

Important settings:

Referral Reward Points | 50 | Points credited after referral verification
Purchase Reward Value | 100 | Customer earns 1 point for every ₹100 purchase value
Silver Tier Minimum | 5000 | Total purchase value required
Gold Tier Minimum | 15000 | Total purchase value required
Platinum Tier Minimum | 30000 | Total purchase value required

How referral works:
1. Customer submits referral from the website.
2. Entry is saved in Leads.
3. Referral reward entry is saved in ReferralRewards.
4. Status is Pending Verification.
5. You can manually mark reward as Approved after the referred customer orders.


STEP 9: CUSTOMER LOYALTY PROGRAM
--------------------------------
Customer loyalty is based on total purchase value.

Every order automatically updates the Customers sheet with:

Customer Name
Phone
City
Pin Code
Total Orders
Total Purchase Value
Reward Points
Loyalty Tier
First Order Date
Last Order Date
Status

Default loyalty tiers:

Freshly Member: Below ₹5,000
Silver: ₹5,000+
Gold: ₹15,000+
Platinum: ₹30,000+

Change the thresholds in the Settings sheet if needed.

To rebuild the customer loyalty sheet from all orders:

Freshly Backend > Update Customer Loyalty


STEP 10: HUB-WISE PRINTABLE DELIVERY SHEETS
-------------------------------------------
To create hub-wise delivery and pickup sheets for today:

Freshly Backend > Create Hub Print Sheets

This creates separate sheets like:

PRINT_Freshly Kunnamangalam Hub
PRINT_Freshly Calicut Hub

Each print sheet includes:

Order ID
Customer Name
Phone
City
Pin Code
Address
Service Type
Items
Delivery Charge
Total
Payment
Slot
Hub Partner
Hub Phone
Remarks

Use these sheets for packing, dispatch and hub partner delivery.


STEP 11: DAILY HUB SUMMARY
--------------------------
To create today's hub summary:

Freshly Backend > Create Today Hub Summary

This updates DailyDispatch with:

Hub
Order Count
Fish Subtotal
Cleaning/Cutting Charges
Marination Charges
Home Delivery Charges
Total Amount
Home Delivery Orders
Hub Pickup Orders


STEP 12: MONTHLY AND YEARLY STATEMENTS
--------------------------------------
For Freshly Hub statements:

Freshly Backend > Create Monthly Hub Statement
Freshly Backend > Create Yearly Hub Statement

This updates HubStatements.

For customer statements:

Freshly Backend > Create Monthly Customer Statement
Freshly Backend > Create Yearly Customer Statement

This updates CustomerStatements.

HubStatements includes hub-wise order count and total value.
CustomerStatements includes customer purchase value, reward points and loyalty tier.


STEP 13: WEBSITE UPLOAD
-----------------------
Upload these files to GitHub Pages, Netlify, Vercel or Cloudflare Pages:

index.html
assets/style.css
assets/app.js
images/freshly-logo.png

Keep the same folder structure.


CUSTOMER-FACING NOTES
---------------------
The website does not show backend system details to customers.
Customers only see:

Fresh fish ordering
Hub pickup option
Home delivery option
Cleaning/cutting charges
Marination charges
Referral reward program
Freshly delivery request in their area
Hub partner registration


TROUBLESHOOTING
---------------
If fish items do not load:
- Check FISH_DATA_URL.
- Make sure FishData is published as CSV.
- Make sure Stock column says YES.

If delivery area is rejected:
- Check DELIVERY_DATA_URL.
- Make sure DeliveryAreas is published as CSV.
- Make sure Available is YES.
- Make sure City and Pin Code match customer entry.

If orders do not save:
- Check BACKEND_URL.
- Make sure Apps Script is deployed as Web App.
- Access must be Anyone.
- Run setupFreshlySheets once.

If old website files still show:
- Clear browser cache.
- Refresh GitHub/hosting deployment.
