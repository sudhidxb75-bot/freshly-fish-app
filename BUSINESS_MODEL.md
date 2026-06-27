# Freshly Business Model V2.0

## Positioning

**Freshly is a community-driven, single-seller, district-wise fresh commerce platform.**

Tagline:

> Freshness Delivered. Communities Empowered.

Freshly delivers fresh food and daily essentials while creating income opportunities for local suppliers, hub partners, delivery partners and district entrepreneurs.

## Core model

```text
Approved Suppliers
        ↓
Freshly Central / District Master Hub
        ↓
Local Freshly Hubs
        ↓
Pickup / Home Delivery
        ↓
Customer
```

Freshly is the customer-facing seller. Suppliers are supply partners, not direct marketplace sellers on Freshly.

## Freshly vs Freshly Mart

| Area | Freshly | Freshly Mart |
|---|---|---|
| Model | Single seller | Marketplace |
| Seller shown to customer | Freshly | Individual seller/store |
| Products | Fish & seafood, meat, fruits, vegetables, groceries, daily essentials | Home products, fashion, stationery, electronics accessories, wellness, local store products |
| Payment | Collected by Freshly | Collected by Freshly Mart and settled to sellers |
| Launch priority | First | Later |

## District-wise expansion

Freshly expands district by district:

```text
Freshly Head Office
        ↓
District Master Hub
        ↓
Local Freshly Hubs
        ↓
Delivery Partners
        ↓
Customers
```

## Customer location flow

```text
District → Pincode → Freshly Hub → Pickup/Home Delivery → Delivery Slot → Checkout
```

Customers can browse and add to cart without login. Login/signup is required only during checkout.

## Community benefits

- Customers get fresh products through nearby Freshly Hubs.
- Suppliers get organized demand and backend-controlled purchase planning.
- Hub partners earn through pickup and delivery support.
- Delivery partners earn through local delivery assignments.
- District masters build district-level Freshly networks.
- Local economy benefits because every Freshly order supports a local fulfilment network.

## Pricing model

```text
District product price
+ cleaning/cutting/marination charges
+ delivery charge
- offers/loyalty/referral discount
= final payable amount
```

Supplier supply price and customer selling price must remain separate.

## Payment model

All customer payments go to Freshly only:

- UPI online
- UPI QR before delivery
- UPI QR at hub
- UPI QR during delivery
- Pay at hub using Freshly UPI only

No cash handling by hubs or delivery partners.

## Compliance model

GST/FSSAI compliance is backend-controlled. Admin can record requirement, status, documents and internal relaxation. Relaxation is an internal operational control, not a legal exemption.


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
