```javascript id="h1v9k2"
let cart = [];
let malayalamMode = false;

// Load fish data
async function loadFish() {
  try {
    const response = await fetch('fish-data.json');
    const fishData = await response.json();

    const container =
      document.getElementById('fishContainer');

    container.innerHTML = '';

    fishData.forEach((fish, index) => {

      const stockText =
        fish.stock
        ? 'In Stock'
        : 'Out of Stock';

      const stockColor =
        fish.stock
        ? 'green'
        : 'red';

      container.innerHTML += `
      <div class="fish-card">

        <img src="${fish.image}"
        alt="${fish.name}">

        <div class="fish-content">

          <h3>
            ${malayalamMode
              ? fish.malayalam
              : fish.name}
          </h3>

          <div class="fish-price">
            ₹${fish.price} / Kg
          </div>

          <div class="stock"
          style="color:${stockColor}">
            ${stockText}
          </div>

          <button
            class="add-cart"
            onclick="addToCart(${index})"
            ${!fish.stock ? 'disabled' : ''}>

            ${malayalamMode
              ? 'കാർട്ടിലേക്ക് ചേർക്കുക'
              : 'Add To Cart'}

          </button>

        </div>

      </div>
      `;
    });

    window.fishData = fishData;

  } catch(error){
    console.error(
      'Error loading fish data:',
      error
    );
  }
}

// Add to Cart
function addToCart(index){

  const fish =
    window.fishData[index];

  cart.push({
    name: fish.name,
    malayalam: fish.malayalam,
    price: fish.price
  });

  updateCart();

  alert(
    malayalamMode
    ? 'കാർട്ടിൽ ചേർത്തു'
    : 'Added to Cart'
  );
}

// Update Cart
function updateCart(){

  const cartItems =
    document.getElementById(
      'cartItems'
    );

  const cartCount =
    document.getElementById(
      'cartCount'
    );

  const cartTotal =
    document.getElementById(
      'cartTotal'
    );

  cartItems.innerHTML = '';

  let total = 0;

  cart.forEach((item, i) => {

    total += item.price;

    cartItems.innerHTML += `
    <div class="cart-item">

      <h4>
      ${malayalamMode
        ? item.malayalam
        : item.name}
      </h4>

      <p>
      ₹${item.price}
      </p>

      <button onclick=
      "removeCart(${i})">
      Remove
      </button>

    </div>
    `;
  });

  cartCount.innerText =
    cart.length;

  cartTotal.innerText =
    total;
}

// Remove Cart
function removeCart(index){

  cart.splice(index,1);

  updateCart();
}

// Toggle Cart
function toggleCart(){

  document
  .getElementById(
    'cartSidebar'
  )
  .classList.toggle(
    'active'
  );
}

// Malayalam Toggle
document
.getElementById(
'langToggle'
)
.addEventListener(
'click',
function(){

malayalamMode =
!malayalamMode;

this.innerText =
malayalamMode
? 'English'
: 'മലയാളം';

document
.getElementById(
'todayCatch'
)
.innerText =
malayalamMode
? 'ഇന്നത്തെ മീൻ ലഭ്യത'
: "Today's Fresh Catch";

document
.getElementById(
'cartTitle'
)
.innerText =
malayalamMode
? 'കാർട്ട്'
: 'Your Cart';

document
.getElementById(
'heroTitle'
)
.innerText =
malayalamMode
? 'പുതിയ മീൻ ഇന്ന് വീട്ടിലെത്തും'
: 'Fresh Catch Delivered Today';

document
.getElementById(
'heroSub'
)
.innerText =
malayalamMode
? 'കേരളത്തിലെ പുതിയ മീൻ നേരിട്ട് വീട്ടിലേക്ക്'
: 'Premium Kerala fish delivered fresh to your doorstep';

loadFish();

});

// Place WhatsApp Order
function placeOrder(){

const name =
document.getElementById(
'customerName'
).value;

const phone =
document.getElementById(
'customerPhone'
).value;

const address =
document.getElementById(
'customerAddress'
).value;

const slot =
document.getElementById(
'deliverySlot'
).value;

const payment =
document.querySelector(
'input[name="payment"]:checked'
).value;

if(
!name ||
!phone ||
!address ||
cart.length===0
){

alert(
malayalamMode
? 'എല്ലാ വിവരങ്ങളും പൂരിപ്പിക്കുക'
: 'Please complete details'
);

return;
}

let order =
`🐟 Freshly Order

👤 Name:
${name}

📞 Phone:
${phone}

📍 Address:
${address}

🕓 Delivery Slot:
${slot}

💳 Payment:
${payment}

🛒 Order Items:
`;

cart.forEach(item=>{
order += `
- ${item.name}
₹${item.price}
`;
});

order += `
💰 Total:
₹${document
.getElementById(
'cartTotal'
).innerText}
`;

const whatsappURL =
`https://wa.me/918921696649?text=
${encodeURIComponent(order)}`;

window.open(
whatsappURL,
'_blank'
);

}

// Initial Load
loadFish();
```
