```javascript id="fix3"
let cart = [];
let fishData = [];
let malayalamMode = false;

async function loadFish() {

  try {

    const response =
      await fetch('./fish-data.json');

    fishData =
      await response.json();

    const container =
      document.getElementById(
        'fishContainer'
      );

    container.innerHTML = '';

    fishData.forEach((fish,index)=>{

      container.innerHTML += `
      <div class="fish-card">

        <img src="${fish.image}" alt="${fish.name}">

        <div class="fish-content">

          <h3>
          ${
            malayalamMode
            ? fish.malayalam
            : fish.name
          }
          </h3>

          <div class="fish-price">
            ₹${fish.price}/Kg
          </div>

          <div class="stock"
          style="color:
          ${fish.stock
          ? 'green'
          : 'red'}">

          ${
            fish.stock
            ? 'In Stock'
            : 'Out Of Stock'
          }

          </div>

          <button
          class="add-cart"
          onclick=
          "addToCart(${index})"
          ${!fish.stock
          ? 'disabled'
          : ''}>

          Add To Cart

          </button>

        </div>
      </div>
      `;
    });

  } catch(error){

    console.error(error);

    document
    .getElementById(
      'fishContainer'
    )
    .innerHTML =
    `
    <h3>
    Error loading fish items.
    Check fish-data.json
    </h3>
    `;
  }
}

function addToCart(index){

cart.push(fishData[index]);

updateCart();

alert('Added To Cart');

}

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

cartItems.innerHTML='';

let total = 0;

cart.forEach((item,i)=>{

total += item.price;

cartItems.innerHTML += `
<div class="cart-item">

<h4>${item.name}</h4>

<p>₹${item.price}</p>

<button
onclick=
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

function removeCart(i){

cart.splice(i,1);

updateCart();

}

function toggleCart(){

document
.getElementById(
'cartSidebar'
)
.classList.toggle(
'active'
);

}

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

if(
!name ||
!phone ||
!address ||
cart.length===0
){

alert(
'Fill details'
);

return;
}

let order =
`Freshly Order

Name: ${name}
Phone: ${phone}
Address: ${address}

Order:
`;

cart.forEach(item=>{

order += `
${item.name}
₹${item.price}
`;

});

window.open(
`https://wa.me/918921696649?text=
${encodeURIComponent(order)}`,
'_blank'
);

}

loadFish();
```
