FRESHLY V9 FULL BACKEND SETUP

WHAT IS NEW IN V9
- Multiple hubs under the same pin code
- Customer can choose from available hubs
- Hub-specific cutoff times
- Hub-specific delivery / pickup slots
- Hub-specific delivery charge and minimum order
- UPI-only payment model with payment verification
- Multiple WhatsApp order recipients
- Customer master with preferred hub and lifetime value
- Hub-wise daily dispatch sheet generation
- Hub-wise monthly statement generation

FILES IN THIS PACKAGE
- index.html
- assets/style.css
- assets/app.js
- Freshly_Apps_Script.gs
- templates/*.csv
- images/freshly-logo.png

STEP 1: GOOGLE SHEET TABS
Create these tabs or run setupFreshlySheets once from Apps Script:

FishData
HubMaster
HubPincodes
Orders
Customers
PartnerLeads
AreaRequests
Referrals
PaymentVerifications
SalesReport
HubStatements
CustomerStatements
DailyDispatch
Settings

STEP 2: FISHDATA HEADERS
name, malayalam, price, stock, image, cleanChargePerKg, curryCutChargePerKg, steakCutChargePerKg, filletChargePerKg, marinationChargePerKg

stock should be true or false.
image can be a GitHub/Cloudflare image URL or relative path such as images/Neymeen.jpg.

STEP 3: HUBMASTER HEADERS
HubID, HubName, City, Manager, Phone, Status, DefaultCutOff

Example:
HUB001, Kunnamangalam Hub, Kozhikode, Rafi, 9999999999, Active, 15:00

STEP 4: HUBPINCODES HEADERS
PinCode, City, Area, HubID, HubName, PickupAvailable, HomeDeliveryAvailable, DeliveryCharge, CutOffTime, DeliverySlot1, DeliverySlot2, DeliverySlot3, Status, HubPartner, HubPhone, MinimumOrder

Important: You can add multiple rows with the same PinCode.
Example:
673008, Kozhikode, Kunnamangalam Side, HUB001, Kunnamangalam Hub, Yes, Yes, 40, 15:00, 4 PM - 7 PM, 7 PM - 9 PM, , Active, Rafi, 9999999999, 300
673008, Kozhikode, Medical College Side, HUB002, Medical College Hub, Yes, Yes, 50, 14:30, 5 PM - 8 PM, , , Active, Sameer, 9999999999, 300

STEP 5: PUBLISH CSV LINKS
Publish FishData as CSV:
Google Sheet > File > Share > Publish to web > FishData > CSV > Publish.
Copy the URL.

Publish HubPincodes as CSV:
Google Sheet > File > Share > Publish to web > HubPincodes > CSV > Publish.
Copy the URL.

STEP 6: UPDATE ASSETS/APP.JS
Open assets/app.js and update:

const FISH_DATA_URL = "YOUR_FISHDATA_CSV_URL";
const HUB_PINCODES_URL = "YOUR_HUBPINCODES_CSV_URL";
const BACKEND_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL";

To add/remove WhatsApp recipients, edit:
const WHATSAPP_NUMBERS = ["918921696649", "971558962348"];

STEP 7: APPS SCRIPT
Open your Google Sheet > Extensions > Apps Script.
Delete old code.
Paste Freshly_Apps_Script.gs.
Save.
Run setupFreshlySheets once.
Authorize permissions.
Deploy > New Deployment > Web App.
Execute as: Me.
Who has access: Anyone.
Copy the Web App URL and paste it in assets/app.js BACKEND_URL.

STEP 8: GITHUB UPLOAD
Upload these to your repository root:
index.html
assets/style.css
assets/app.js
images/freshly-logo.png
images/payment-qr.png

STEP 9: CUSTOMER ORDER FLOW
Customer enters city and pin code.
Website loads all hubs available for that pin code.
Customer selects hub.
Website shows only that hub's cutoff time and delivery slots.
Customer selects fish, weight, cleaning/cutting, marination, delivery/pickup and payment option.
Website checks hub cutoff.
Order is saved to Orders and WhatsApp opens for all configured numbers.

STEP 10: PAYMENT FLOW
Customer may choose:
- UPI Payment Now
- Pay on Delivery / Pickup - UPI Only

Cash is not promoted.
Hub/delivery partner does not handle cash.
Customer pays Freshly directly by UPI.
Hub partner verifies payment using Hub Payment Verification form.
Orders sheet updates PaymentStatus = Paid.

STEP 11: HUB DISPATCH
In Google Sheet menu Freshly Backend, click Generate Daily Hub Dispatch Sheets.
It creates hub-wise sheets named PRINT_HUB001_YYYY-MM-DD.

STEP 12: COMMON ERRORS
- Do not paste ```html or ``` into index.html.
- Do not split any URL into two lines.
- Do not use normal Google Sheet edit links for CSV. Use published CSV links.
- GitHub home file must be named index.html.
- If Apps Script doPost gives e.parameter error, do not run doPost manually. Test doGet or use website submission.


V10 UPDATE - MULTIPLE DELIVERY SLOTS PER HUB
--------------------------------------------
A new master sheet is added: HubDeliverySlots.
This allows the same hub to have unlimited delivery/pickup slots with separate cutoff times.

HubDeliverySlots headers:
HubID | SlotID | DeliverySlot | CutOffTime | Fulfillment | Status | Notes

Example:
HUB001 | SLOT1 | 10 AM - 1 PM | 08:00 | Both | Active | Morning slot
HUB001 | SLOT2 | 1 PM - 4 PM | 11:00 | Both | Active | Afternoon slot
HUB001 | SLOT3 | 4 PM - 7 PM | 15:00 | Both | Active | Evening slot

Publish HubDeliverySlots as CSV and paste the link in assets/app.js:
const HUB_DELIVERY_SLOTS_URL = "PASTE_HUBDELIVERYSLOTS_CSV_URL_HERE";

HubPincodes is now only for mapping pin codes to hubs, delivery charge, and serviceability.
Delivery slots are managed separately in HubDeliverySlots.

If a slot cutoff time is over, that slot will show as Closed and cannot be selected.
