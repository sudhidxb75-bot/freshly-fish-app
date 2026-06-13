FRESHLY BACKEND SETUP AND DAILY PICKUP WORKFLOW
================================================

IMPORTANT
---------
Customer-facing website text does not mention backend systems. All operational control stays inside your Google Sheet and Apps Script.

FILES INCLUDED
--------------
1. index.html
2. assets/style.css
3. assets/app.js
4. images/freshly-logo.png
5. Freshly_Apps_Script.gs
6. README_BACKEND_STEPS.txt

STEP 1: UPLOAD WEBSITE FILES
----------------------------
Upload these files/folders to your GitHub repository:

index.html
assets/style.css
assets/app.js
images/freshly-logo.png

Keep the same folder names.

STEP 2: UPDATE WEBSITE SETTINGS
-------------------------------
Open assets/app.js and update:

const ORDER_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

Use only digits for WhatsApp number. Example: 919876543210

STEP 3: PASTE APPS SCRIPT
-------------------------
1. Open your existing Freshly Google Sheet.
2. Click Extensions.
3. Click Apps Script.
4. Delete old script code.
5. Paste the full code from Freshly_Apps_Script.gs.
6. Click Save.
7. Select setupFreshlySheets from the function dropdown.
8. Click Run.
9. Approve permissions.
10. Return to your Google Sheet and refresh the browser tab.

You should see a menu named:

Freshly Backend

If the menu does not appear:
1. Confirm the script is opened from Extensions > Apps Script inside the same Google Sheet.
2. Run setupFreshlySheets once manually.
3. Refresh the Google Sheet tab.
4. Wait 5 to 10 seconds.

STEP 4: DEPLOY APPS SCRIPT AS WEB APP
-------------------------------------
1. In Apps Script, click Deploy.
2. Click New deployment.
3. Select Web app.
4. Description: Freshly Backend
5. Execute as: Me
6. Who has access: Anyone
7. Click Deploy.
8. Copy the Web App URL.
9. Paste it in assets/app.js as ORDER_SCRIPT_URL.

If you edit Apps Script later, create a new deployment version or click Manage deployments > Edit > New version > Deploy.

STEP 5: REQUIRED GOOGLE SHEET TABS
----------------------------------
The setupFreshlySheets function creates or repairs these tabs:

FishData
DeliveryAreas
Orders
Leads
Customers
ReferralRewards
DailyDispatch
Daily Pickup Sheet
Pickup Archive
HubStatements
CustomerStatements
Settings

Do not rename these tabs unless you also update the script constants.

STEP 6: FishData TAB
--------------------
This controls fish listing, price, stock, image and preparation charges.

Columns:
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

Stock must be YES or NO.
Image should be a public image URL.

Example:
Ayala / Mackerel | അയല | 220 | YES | https://yourdomain.com/images/ayala.jpg | 20 | 30 | 40 | 60 | 30

STEP 7: DeliveryAreas TAB
-------------------------
This controls delivery availability, hub assignment and home delivery charges.

Columns:
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

Available must be YES or NO.
Pickup Available must be YES or NO.
Home Delivery Available must be YES or NO.

Example:
673571 | Kunnamangalam | Peringolam | YES | Freshly Kunnamangalam Hub | Partner Name | 91XXXXXXXXXX | YES | YES | 50 | 300

STEP 8: DAILY ORDER PROCESS
---------------------------
Customer places order on Freshly website.
Order gets saved in Orders tab.
Order also opens in WhatsApp.
Freshly team confirms and processes order.

STEP 9: DAILY PICKUP SHEET WORKFLOW
-----------------------------------
Use this for temporary print sheets for hubs.

Morning or before dispatch:
Freshly Backend > Create Today Daily Pickup Sheet

This creates today's temporary pickup/delivery list from Orders.
It includes:
Pickup Date
Hub
Order ID
Customer Name
Phone
City
Pin Code
Address
Service Type: Hub Pickup or Home Delivery
Items
Fish Subtotal
Cleaning/Cutting Charges
Marination Charges
Home Delivery Charge
Total Amount
Payment
Delivery/Pickup Slot
Hub Partner
Hub Phone
Status
Delivery Remarks

Then print:
Freshly Backend > Print Daily Pickup Sheet

After printing and dispatch:
Freshly Backend > Archive & Clear Daily Pickup Sheet

This will:
1. Copy all Daily Pickup Sheet rows to Pickup Archive.
2. Clear only the Daily Pickup Sheet rows.
3. Keep Orders permanently safe.
4. Keep customer loyalty, hub statements and referral records safe.

IMPORTANT: Do not delete rows from Orders.

STEP 10: HUB PRINT SHEETS
-------------------------
For separate hub-wise print tabs:
Freshly Backend > Create Hub Print Sheets

This creates separate tabs like:
PRINT_Freshly Kunnamangalam Hub
PRINT_Freshly Calicut Hub

Use this when you want individual sheets for each hub partner.

STEP 11: HUB SUMMARY
--------------------
Freshly Backend > Create Today Hub Summary

This updates DailyDispatch with hub-wise totals:
Order Count
Fish Subtotal
Cleaning/Cutting
Marination
Home Delivery Charges
Total Amount
Home Delivery Orders
Hub Pickup Orders

STEP 12: CUSTOMER LOYALTY
-------------------------
Customer loyalty updates automatically when an order is saved.
You can also rebuild it manually:
Freshly Backend > Update Customer Loyalty

Reward points are controlled in Settings:
Purchase Reward Value = 100 means 1 point for every ₹100 purchase.

Loyalty tiers are controlled in Settings:
Silver Tier Minimum
Gold Tier Minimum
Platinum Tier Minimum

STEP 13: REFERRAL REWARDS
-------------------------
Referral form entries are saved to Leads and ReferralRewards.
Referral Reward Points are controlled in Settings.

Reward status starts as Pending Verification.
You can manually change it after the referred customer places an order.

STEP 14: MONTHLY AND YEARLY STATEMENTS
--------------------------------------
Hub statements:
Freshly Backend > Create Monthly Hub Statement
Freshly Backend > Create Yearly Hub Statement

Customer statements:
Freshly Backend > Create Monthly Customer Statement
Freshly Backend > Create Yearly Customer Statement

These update HubStatements and CustomerStatements tabs.

STEP 15: SAFE CLEARING RULE
---------------------------
Safe to clear after archive:
Daily Pickup Sheet

Never manually delete from:
Orders
Customers
ReferralRewards
Pickup Archive
HubStatements
CustomerStatements
Settings

