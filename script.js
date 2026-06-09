```javascript
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRaa73eTvuPFc-VUT5-bbXe0oSWC6UjzRryJCbrrB3fjy2l8JLI85gqljhnriQCcdvJXto-I4HbO8c4/pub?output=csv";

const ORDER_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwb_PwjMwllv0PGow7kbe8YX07cfVd76E2eLdMwrX5aBpprWpbPCsEK1hDjPahmF1Ya9A/exec";

const WHATSAPP_NUMBER = "918921696649";
const UPI_ID = "sudime-1@okaxis";

let fishData = [];
let cart = [];
let malayalam = false;

async function loadFish() {
  const container = document.getElementById("fishContainer");
  container.innerHTML = "Loading today's catch...";

  try {
    const response = await fetch(CSV_URL);
    const csv = await response.text();
    const rows = csv.trim().split("\n").slice(1);

    fishData = rows.map(row => {
      const cols = row.split(",");
      return {
        name: cols[0]?.trim(),
        malayalam: cols[1]?.trim(),
        price: Number(cols[2]?.trim()),
        stock: cols[3]?.trim().toLowerCase() === "true",
        image: cols[4]?.trim()
      };
    });

    container.innerHTML = "";

    fishData.forEach((fish, index) => {
      container.innerHTML += `
        <div class="card">
          <img src="${fish.image}" alt="${fish.name}">
          <div class="content">
            <h3>${malayalam ? fish.malayalam : fish.name}</h3>
            <p>${malayalam ? fish.name : fish.malayalam}</p>
            <div class="price">₹${fish.price}/Kg</div>
            <div class="stock" style="color:${fish.stock ? "green" : "red"}">
              ${fish.stock ? "In Stock" : "Out of Stock"}
            </div>
            <button onclick="addToCart(${index})" ${!fish.stock ? "disabled" : ""}>
              ${malayalam ? "കാർട്ടിലേക്ക് ചേർക്കുക" : "Add to Cart"}
            </button>
          </div>
        </div>
      `;
    });

  } catch (error) {
    container.innerHTML = "Unable to load fish items. Please check Google Sheet.";
    console.error(error);
  }
}

function addToCart(index) {
  cart.push(fishData[index]);
  updateCart();
  alert("Added to cart");
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.innerText = cart.length;
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

async function placeOrder() {
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const name = prompt("Enter your name:");
  if (!name) return;

  const phone = prompt("Enter your phone number:");
  if (!phone) return;

  const address = prompt("Enter delivery address:");
  if (!address) return;

  const payment = confirm("Click OK for UPI payment. Click Cancel for Cash on Delivery.")
    ? `UPI - ${UPI_ID}`
    : "Cash on Delivery";

  const slot = "4 PM - 7 PM";

  const items = cart
    .map(item => `${item.name} - ₹${item.price}/Kg`)
    .join(" | ");

  const total = getCartTotal();

  const orderData = {
    name,
    phone,
    address,
    items,
    total,
    payment,
    slot
  };

  try {
    await fetch(ORDER_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });
  } catch (error) {
    console.error("Order sheet save failed", error);
  }

  const whatsappMessage =
`🐟 Freshly Fish Order

👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}

🛒 Items:
${items}

💰 Total: ₹${total}
💳 Payment: ${payment}
🚚 Delivery Slot: ${slot}

Please confirm my order.`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`,
    "_blank"
  );

  cart = [];
  updateCart();
}

function toggleLanguage() {
  malayalam = !malayalam;
  loadFish();
}

loadFish();
```
