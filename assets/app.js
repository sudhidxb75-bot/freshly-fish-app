/* Freshly v9 App Settings */
const FISH_DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7gp6cTQ7rETR-HZ5eiwTjjkd0OIOESFfbunbxHSxeoL_2RzmxVdF3c1Y1bMUo-yzgEMF-olA4pUuh/pub?gid=564324358&single=true&output=csv";
const HUB_PINCODES_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7gp6cTQ7rETR-HZ5eiwTjjkd0OIOESFfbunbxHSxeoL_2RzmxVdF3c1Y1bMUo-yzgEMF-olA4pUuh/pub?gid=1070445629&single=true&output=csv";
const HUB_DELIVERY_SLOTS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7gp6cTQ7rETR-HZ5eiwTjjkd0OIOESFfbunbxHSxeoL_2RzmxVdF3c1Y1bMUo-yzgEMF-olA4pUuh/pub?gid=1644440201&single=true&output=csv";
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxXsQf1hVFP9IhKDt8nTviJ-oYXdNIGiVgdZelkQFSScRKY5fKUdtjSkbt8PhglNk0K/exec";
const WHATSAPP_NUMBERS = ["918921696649", "971558962348"];

let fishData = [];
let hubRows = [];
let hubSlotRows = [];
let matchedHubs = [];
let selectedHub = null;
let selectedSlot = null;
let cart = [];
let ml = false;

function parseCSV(text){
  const rows = [];
  let row = [], cell = '', quote = false;
  for(let i=0;i<text.length;i++){
    const char = text[i], next = text[i+1];
    if(char === '"' && quote && next === '"'){ cell += '"'; i++; }
    else if(char === '"'){ quote = !quote; }
    else if(char === ',' && !quote){ row.push(cell); cell = ''; }
    else if((char === '\n' || char === '\r') && !quote){
      if(cell || row.length){ row.push(cell); rows.push(row); row = []; cell = ''; }
      if(char === '\r' && next === '\n') i++;
    } else cell += char;
  }
  if(cell || row.length){ row.push(cell); rows.push(row); }
  return rows;
}

function yes(value){
  const v = String(value || '').trim().toLowerCase();
  return v === 'yes' || v === 'true' || v === 'available' || v === 'active';
}

function num(value){
  const n = Number(String(value || '0').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function money(value){ return Math.round(num(value)); }

function fishRowsToObjects(csv){
  const rows = parseCSV(csv.trim());
  return rows.slice(1).map(cols => ({
    name: (cols[0] || '').trim(),
    malayalam: (cols[1] || '').trim(),
    price: num(cols[2]),
    stock: yes(cols[3]),
    image: (cols[4] || '').trim(),
    cleanChargePerKg: num(cols[5]),
    curryCutChargePerKg: num(cols[6]),
    steakCutChargePerKg: num(cols[7]),
    filletChargePerKg: num(cols[8]),
    marinationChargePerKg: num(cols[9])
  })).filter(x => x.name);
}

function hubRowsToObjects(csv){
  const rows = parseCSV(csv.trim());
  return rows.slice(1).map(cols => ({
    pincode: (cols[0] || '').trim(),
    city: (cols[1] || '').trim(),
    area: (cols[2] || '').trim(),
    hubId: (cols[3] || '').trim(),
    hubName: (cols[4] || '').trim(),
    pickupAvailable: yes(cols[5]),
    homeDeliveryAvailable: yes(cols[6]),
    homeDeliveryCharge: num(cols[7]),
    cutOffTime: (cols[8] || '').trim(),
    deliverySlot1: (cols[9] || '').trim(),
    deliverySlot2: (cols[10] || '').trim(),
    deliverySlot3: (cols[11] || '').trim(),
    status: (cols[12] || '').trim(),
    hubPartner: (cols[13] || '').trim(),
    hubPhone: (cols[14] || '').trim(),
    minimumOrder: num(cols[15])
  })).filter(x => x.pincode && x.hubName && yes(x.status || 'Active'));
}


function hubSlotRowsToObjects(csv){
  const rows = parseCSV(csv.trim());
  return rows.slice(1).map(cols => ({
    hubId: (cols[0] || '').trim(),
    slotId: (cols[1] || '').trim(),
    deliverySlot: (cols[2] || '').trim(),
    cutOffTime: (cols[3] || '').trim(),
    fulfillment: (cols[4] || '').trim(),
    status: (cols[5] || '').trim(),
    notes: (cols[6] || '').trim()
  })).filter(x => x.hubId && x.deliverySlot && yes(x.status || 'Active'));
}

async function loadHubDeliverySlots(){
  if(!HUB_DELIVERY_SLOTS_URL || HUB_DELIVERY_SLOTS_URL.includes('PASTE_')){
    hubSlotRows = [];
    return [];
  }
  try{
    const response = await fetch(HUB_DELIVERY_SLOTS_URL);
    const csv = await response.text();
    hubSlotRows = hubSlotRowsToObjects(csv);
    return hubSlotRows;
  }catch(e){
    console.warn('Hub delivery slot data loading failed', e);
    hubSlotRows = [];
    return [];
  }
}

async function loadHubPincodes(){
  if(!HUB_PINCODES_URL || HUB_PINCODES_URL.includes('PASTE_')){
    hubRows = [];
    return [];
  }
  try{
    const response = await fetch(HUB_PINCODES_URL);
    const csv = await response.text();
    hubRows = hubRowsToObjects(csv);
    return hubRows;
  }catch(e){
    console.warn('Hub data loading failed', e);
    hubRows = [];
    return [];
  }
}

function getHubsForLocation(pincode, city){
  const pin = String(pincode || '').trim();
  const town = String(city || '').trim().toLowerCase();
  let matches = hubRows.filter(x => x.pincode === pin);
  if(matches.length === 0 && town){ matches = hubRows.filter(x => x.city.toLowerCase() === town); }
  return matches;
}

function updateHubPreview(){
  const pincode = document.getElementById('pincode').value.trim();
  const city = document.getElementById('city').value.trim();
  const preview = document.getElementById('hubPreview');
  const hubSelect = document.getElementById('hubSelect');
  selectedHub = null;
  selectedSlot = null;
  matchedHubs = getHubsForLocation(pincode, city);
  hubSelect.innerHTML = '';

  if(!pincode && !city){
    hubSelect.innerHTML = '<option value="">Enter pin code first</option>';
    preview.innerHTML = 'Enter city and pin code to see available Freshly Hubs.';
    updateSlotDropdown();
    updateCart();
    return;
  }

  if(matchedHubs.length === 0){
    hubSelect.innerHTML = '<option value="">No hub available</option>';
    preview.innerHTML = "Freshly is not currently available in this area. Please submit 'Request Freshly Delivery in My Area'.";
    updateSlotDropdown();
    updateCart();
    return;
  }

  matchedHubs.forEach((hub, index)=>{
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${hub.hubName} - ${hub.area} - Cutoff ${hub.cutOffTime || 'Not set'}`;
    hubSelect.appendChild(option);
  });

  selectedHub = matchedHubs[0];
  renderSelectedHub();
}

function renderSelectedHub(){
  const preview = document.getElementById('hubPreview');
  const fulfillment = document.getElementById('fulfillment');

  if(!selectedHub){
    preview.innerHTML = 'Select a serviceable Freshly Hub.';
    updateSlotDropdown();
    updateCart();
    return;
  }

  preview.innerHTML = `<b>Selected Freshly Hub:</b><br>${selectedHub.hubName}<br>Area: ${selectedHub.area}<br>Hub Partner + Delivery: ${selectedHub.hubPartner || 'Freshly Team'}<br>Pickup: ${selectedHub.pickupAvailable ? 'Available' : 'Not Available'} | Home Delivery: ${selectedHub.homeDeliveryAvailable ? 'Available' : 'Not Available'}<br>Default Cut-off Time: ${selectedHub.cutOffTime || 'Not set'}<br>Slots: Loaded from HubDeliverySlots sheet if configured<br>Home Delivery Charge: ₹${selectedHub.homeDeliveryCharge}`;

  [...fulfillment.options].forEach(opt => {
    if(opt.value === 'Hub Pickup') opt.disabled = !selectedHub.pickupAvailable;
    if(opt.value === 'Home Delivery') opt.disabled = !selectedHub.homeDeliveryAvailable;
  });

  if(fulfillment.value === 'Home Delivery' && !selectedHub.homeDeliveryAvailable) fulfillment.value = 'Hub Pickup';
  if(fulfillment.value === 'Hub Pickup' && !selectedHub.pickupAvailable) fulfillment.value = 'Home Delivery';

  updateSlotDropdown();
  updateCart();
}

function selectHubFromDropdown(){
  const index = Number(document.getElementById('hubSelect').value);
  selectedHub = matchedHubs[index] || null;
  renderSelectedHub();
}

function updateSlotDropdown(){
  const slotSelect = document.getElementById('deliverySlot');
  const fulfillment = document.getElementById('fulfillment')?.value || '';
  slotSelect.innerHTML = '';
  selectedSlot = null;

  if(!selectedHub){
    slotSelect.innerHTML = '<option value="">Select hub first</option>';
    return;
  }

  let slots = hubSlotRows.filter(x => x.hubId === selectedHub.hubId);

  if(fulfillment){
    const filtered = slots.filter(x => !x.fulfillment || x.fulfillment === 'Both' || x.fulfillment === fulfillment);
    if(filtered.length) slots = filtered;
  }

  if(slots.length === 0){
    slots = [selectedHub.deliverySlot1, selectedHub.deliverySlot2, selectedHub.deliverySlot3]
      .map((slot, index) => ({
        hubId: selectedHub.hubId,
        slotId: 'LEGACY' + (index + 1),
        deliverySlot: String(slot || '').trim(),
        cutOffTime: selectedHub.cutOffTime,
        fulfillment: 'Both',
        status: 'Active'
      }))
      .filter(x => x.deliverySlot && x.deliverySlot !== '-');
  }

  if(slots.length === 0){
    slotSelect.innerHTML = '<option value="">No slot configured</option>';
    return;
  }

  const now = new Date();

  slots.forEach((slot, index) => {
    const opt = document.createElement('option');
    opt.value = String(index);

    let disabled = false;
    const cutoffText = slot.cutOffTime || selectedHub.cutOffTime || '';
    if(cutoffText){
      const parts = cutoffText.split(':');
      const hour = Number(parts[0]);
      const minute = Number(parts[1] || 0);
      if(!isNaN(hour)){
        const cutoff = new Date();
        cutoff.setHours(hour, minute, 0, 0);
        disabled = now > cutoff;
      }
    }

    opt.disabled = disabled;
    opt.textContent = `${slot.deliverySlot}${cutoffText ? ' - Cutoff ' + cutoffText : ''}${disabled ? ' - Closed' : ''}`;
    slotSelect.appendChild(opt);
  });

  const firstOpen = Array.from(slotSelect.options).findIndex(o => !o.disabled);
  if(firstOpen >= 0){
    slotSelect.value = String(firstOpen);
    selectedSlot = slots[firstOpen];
  }else{
    selectedSlot = null;
  }

  slotSelect.onchange = function(){
    selectedSlot = slots[Number(slotSelect.value)] || null;
  };
}

function isBeforeHubCutoff(){
  const cutoffText = (selectedSlot && selectedSlot.cutOffTime) || (selectedHub && selectedHub.cutOffTime) || '';
  if(!cutoffText) return true;
  const parts = cutoffText.split(':');
  const hour = Number(parts[0]);
  const minute = Number(parts[1] || 0);
  if(isNaN(hour)) return true;

  const now = new Date();
  const cutoff = new Date();
  cutoff.setHours(hour, minute, 0, 0);
  return now <= cutoff;
}

function getSelectedSlotCutoff(){
  return (selectedSlot && selectedSlot.cutOffTime) || (selectedHub && selectedHub.cutOffTime) || '';
}

function getSelectedSlotId(){
  return (selectedSlot && selectedSlot.slotId) || '';
}

function getFulfillmentCharge(){
  const fulfillment = document.getElementById('fulfillment')?.value || 'Home Delivery';
  if(fulfillment === 'Home Delivery' && selectedHub) return selectedHub.homeDeliveryCharge || 0;
  return 0;
}

function getLocation(){
  if(!navigator.geolocation){ alert('Location is not supported on this device.'); return; }
  document.getElementById('address').value = 'Getting current location...';
  navigator.geolocation.getCurrentPosition(
    function(position){
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
      document.getElementById('address').value = `GPS Location: ${mapLink}`;
      localStorage.setItem('freshlyAddress', document.getElementById('address').value);
    },
    function(){ alert('Unable to get location. Please allow location access or type address manually.'); document.getElementById('address').value = ''; }
  );
}

async function loadFish(){
  const box = document.getElementById('fishContainer');
  box.innerHTML = 'Loading fish items...';

  if(!FISH_DATA_URL || FISH_DATA_URL.includes('PASTE_')){
    box.innerHTML = 'Fish list is not configured yet.';
    return;
  }

  try{
    const res = await fetch(FISH_DATA_URL);
    const csv = await res.text();
    fishData = fishRowsToObjects(csv);
    box.innerHTML = '';
    if(fishData.length === 0){ box.innerHTML = 'No fish items available now.'; return; }
    fishData.forEach((fish,i)=>{
      box.innerHTML += `
      <div class="card">
        <img src="${fish.image}" alt="${fish.name}" onerror="this.src='https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=800'">
        <div class="content">
          <h3>${ml ? fish.malayalam : fish.name}</h3>
          <p>${ml ? fish.name : fish.malayalam}</p>
          <div class="price">₹${fish.price}/Kg</div>
          <p class="stock" style="color:${fish.stock ? 'green':'red'}">${fish.stock ? 'In Stock':'Out of Stock'}</p>
          <label><b>Select Weight</b></label>
          <select id="weight-${i}">
            <option value="0.5">500 gms</option><option value="1">1 kg</option><option value="1.5">1.5 kg</option><option value="2">2 kg</option><option value="2.5">2.5 kg</option><option value="3">3 kg</option><option value="3.5">3.5 kg</option><option value="4">4 kg</option><option value="4.5">4.5 kg</option><option value="5">5 kg</option>
          </select>
          <label><b>Cleaning / Cutting</b></label>
          <select id="cleaning-${i}">
            <option value="Whole Fish" data-charge="0">Whole Fish - Free</option>
            <option value="Cleaned" data-charge="${fish.cleanChargePerKg}">Cleaned - ₹${fish.cleanChargePerKg}/kg</option>
            <option value="Curry Cut" data-charge="${fish.curryCutChargePerKg}">Curry Cut - ₹${fish.curryCutChargePerKg}/kg</option>
            <option value="Steak Cut" data-charge="${fish.steakCutChargePerKg}">Steak Cut - ₹${fish.steakCutChargePerKg}/kg</option>
            <option value="Fillet" data-charge="${fish.filletChargePerKg}">Fillet - ₹${fish.filletChargePerKg}/kg</option>
          </select>
          <label><b>Marination</b></label>
          <select id="marination-${i}">
            <option value="No Marination">No Marination - Free</option><option value="Kerala Fish Fry Masala">Kerala Fish Fry Masala - ₹${fish.marinationChargePerKg}/kg</option><option value="Spicy Red Masala">Spicy Red Masala - ₹${fish.marinationChargePerKg}/kg</option><option value="Pepper Masala">Pepper Masala - ₹${fish.marinationChargePerKg}/kg</option><option value="Turmeric & Chilli">Turmeric & Chilli - ₹${fish.marinationChargePerKg}/kg</option><option value="Tandoori Masala">Tandoori Masala - ₹${fish.marinationChargePerKg}/kg</option>
          </select>
          <button class="add" onclick="addToCart(${i})" ${fish.stock ? '' : 'disabled'}>${ml ? 'കാർട്ടിലേക്ക് ചേർക്കുക':'Add to Cart'}</button>
        </div>
      </div>`;
    });
  }catch(e){ box.innerHTML = 'Fish items failed to load. Please refresh after some time.'; }
}

function addToCart(i){
  const fish = fishData[i];
  const weight = Number(document.getElementById('weight-' + i).value);
  const cleaningSelect = document.getElementById('cleaning-' + i);
  const cleaning = cleaningSelect.value;
  const cleaningChargePerKg = Number(cleaningSelect.options[cleaningSelect.selectedIndex].dataset.charge || 0);
  const marination = document.getElementById('marination-' + i).value;
  const fishAmount = money(fish.price * weight);
  const cleaningCharge = money(cleaningChargePerKg * weight);
  const marinationCharge = marination !== 'No Marination' ? money(fish.marinationChargePerKg * weight) : 0;
  const amount = fishAmount + cleaningCharge + marinationCharge;
  cart.push({name: fish.name, malayalam: fish.malayalam, price: fish.price, weight, cleaning, cleaningChargePerKg, cleaningCharge, marination, marinationChargePerKg: fish.marinationChargePerKg, marinationCharge, fishAmount, amount});
  updateCart();
}

function updateCart(){
  const list = document.getElementById('cartItems');
  list.innerHTML = '';
  let subtotal = 0, cleaningTotal = 0, marinationTotal = 0;
  cart.forEach((item,i)=>{
    subtotal += item.fishAmount;
    cleaningTotal += item.cleaningCharge;
    marinationTotal += item.marinationCharge;
    list.innerHTML += `<div class="cart-item"><strong>${ml ? item.malayalam : item.name}</strong><br>Weight: ${item.weight} kg<br>Rate: ₹${item.price}/kg<br>Fish Amount: ₹${item.fishAmount}<br>Cleaning/Cutting: ${item.cleaning} - ₹${item.cleaningCharge}<br>Marination: ${item.marination} - ₹${item.marinationCharge}<br><b>Item Total: ₹${item.amount}</b><br><button class="remove" onclick="removeItem(${i})">Remove</button></div>`;
  });
  const deliveryCharge = getFulfillmentCharge();
  const total = subtotal + cleaningTotal + marinationTotal + deliveryCharge;
  document.getElementById('subtotal').innerText = subtotal;
  document.getElementById('cleaningTotal').innerText = cleaningTotal;
  document.getElementById('marinationTotal').innerText = marinationTotal;
  document.getElementById('deliveryCharge').innerText = deliveryCharge;
  document.getElementById('total').innerText = total;
  document.getElementById('count').innerText = cart.length;
}

function removeItem(i){ cart.splice(i,1); updateCart(); }

function toggleQR(){
  const qr = document.getElementById('qrSection');
  if(qr) qr.style.display = 'block';
}

async function sendFormData(formData, successMessage){
  if(!BACKEND_URL || BACKEND_URL.includes('PASTE_')){ alert('Backend URL is not configured in assets/app.js'); return; }
  try{
    await fetch(BACKEND_URL, { method:'POST', mode:'no-cors', body:formData });
    alert(successMessage || 'Submitted successfully');
  } catch(e){ alert('Submission failed. Please try again.'); }
}

function openWhatsAppToAllNumbers(message){
  WHATSAPP_NUMBERS.forEach((number, index)=>{
    setTimeout(()=>{
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    }, index * 1200);
  });
}

function slotSelectText(){
  const slotSelect = document.getElementById('deliverySlot');
  if(selectedSlot) return selectedSlot.deliverySlot;
  return slotSelect.options[slotSelect.selectedIndex]?.textContent || slotSelect.value || '';
}

async function placeOrder(){
  if(cart.length === 0){ alert('Cart is empty'); return; }

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value.trim();
  const pincode = document.getElementById('pincode').value.trim();
  const address = document.getElementById('address').value.trim();
  const fulfillment = document.getElementById('fulfillment').value;
  const payment = document.getElementById('payment').value;
  const slot = slotSelectText();

  if(!name || !phone || !city || !pincode){ alert('Please fill name, phone, city and pin code'); return; }
  if(fulfillment === 'Home Delivery' && !address){ alert('Please enter delivery address for home delivery'); return; }

  if(hubRows.length === 0){ await loadHubPincodes(); }
  if(!selectedHub){ updateHubPreview(); }
  if(!selectedHub){ alert("Sorry. Freshly is currently not available in this area. Please submit a request under 'Request Freshly Delivery in My Area'."); return; }
  if(fulfillment === 'Hub Pickup' && !selectedHub.pickupAvailable){ alert('Hub pickup is not available for this hub.'); return; }
  if(fulfillment === 'Home Delivery' && !selectedHub.homeDeliveryAvailable){ alert('Home delivery is not available for this hub. Please choose hub pickup.'); return; }
  if(!slot){ alert('Please select delivery / pickup slot'); return; }
  if(!selectedSlot && hubSlotRows.length > 0){ alert('Please select an open delivery / pickup slot.'); return; }
  const slotCutOffTime = getSelectedSlotCutoff();
  if(!isBeforeHubCutoff()){ alert(`Order cut-off time for ${selectedHub.hubName} / selected slot is ${slotCutOffTime}. Please order earlier for same-day service.`); return; }

  localStorage.setItem('freshlyAddress', address);
  const orderId = 'FR' + Date.now();
  const subtotal = cart.reduce((s,x)=>s+x.fishAmount,0);
  const cleaningTotal = cart.reduce((s,x)=>s+x.cleaningCharge,0);
  const marinationTotal = cart.reduce((s,x)=>s+x.marinationCharge,0);
  const deliveryCharge = fulfillment === 'Home Delivery' ? selectedHub.homeDeliveryCharge : 0;
  const total = subtotal + cleaningTotal + marinationTotal + deliveryCharge;

  if(selectedHub.minimumOrder && total < selectedHub.minimumOrder){ alert(`Minimum order for this hub/area is ₹${selectedHub.minimumOrder}.`); return; }

  const items = cart.map(x => `${x.name} - ${x.weight} kg - ${x.cleaning} ₹${x.cleaningCharge} - ${x.marination} ₹${x.marinationCharge} - Item Total ₹${x.amount}`).join(' | ');
  const itemsJson = JSON.stringify(cart);

  const formData = new URLSearchParams();
  formData.append('type', 'order');
  formData.append('orderId', orderId);
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('city', city);
  formData.append('pincode', pincode);
  formData.append('address', address);
  formData.append('fulfillment', fulfillment);
  formData.append('items', items);
  formData.append('itemsJson', itemsJson);
  formData.append('subtotal', subtotal);
  formData.append('cleaningTotal', cleaningTotal);
  formData.append('marinationTotal', marinationTotal);
  formData.append('deliveryCharge', deliveryCharge);
  formData.append('total', total);
  formData.append('payment', payment);
  formData.append('paymentOption', payment);
  formData.append('slot', slotSelectText());
  formData.append('slotId', getSelectedSlotId());
  formData.append('slotCutOffTime', slotCutOffTime);
  formData.append('hubId', selectedHub.hubId);
  formData.append('hubName', selectedHub.hubName);
  formData.append('hubArea', selectedHub.area);
  formData.append('hubPartner', selectedHub.hubPartner);
  formData.append('hubPhone', selectedHub.hubPhone);
  formData.append('cutOffTime', selectedHub.cutOffTime);

  fetch(BACKEND_URL, { method:'POST', mode:'no-cors', body:formData });

  const msg = `Freshly Fish Order\n\nOrder ID: ${orderId}\n\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nPin Code: ${pincode}\nService: ${fulfillment}\nAddress: ${address || 'Customer will pickup from hub'}\n\nItems:\n${items}\n\nFish Subtotal: ₹${subtotal}\nCleaning/Cutting Charges: ₹${cleaningTotal}\nMarination Charges: ₹${marinationTotal}\nHome Delivery Charge: ₹${deliveryCharge}\nTotal: ₹${total}\nPayment Option: ${payment}\nPayment Rule: Customer pays Freshly directly by UPI. No cash collection by hub/delivery partner.\nDelivery/Pickup Slot: ${slot}\nSlot Cut-off Time: ${slotCutOffTime}\n\nSelected Freshly Hub:\n${selectedHub.hubName}\nArea: ${selectedHub.area}\nHub Partner + Delivery: ${selectedHub.hubPartner || 'Freshly Team'}\n\nPlease confirm my order.`;
  openWhatsAppToAllNumbers(msg);
  cart = [];
  updateCart();
  alert('Order submitted. WhatsApp order windows will open for configured numbers.');
}

function submitPartner(){
  const formData = new URLSearchParams();
  formData.append('leadType', 'hubPartnerDelivery');
  formData.append('name', document.getElementById('partnerName').value.trim());
  formData.append('phone', document.getElementById('partnerPhone').value.trim());
  formData.append('city', document.getElementById('partnerCity').value.trim());
  formData.append('pincode', document.getElementById('partnerPincode').value.trim());
  formData.append('area', document.getElementById('partnerArea').value.trim());
  formData.append('vehicle', document.getElementById('partnerVehicle').value);
  formData.append('experience', document.getElementById('partnerExperience').value.trim());
  if(!formData.get('name') || !formData.get('phone') || !formData.get('city') || !formData.get('pincode') || !formData.get('area')){ alert('Please fill name, phone, city, pin code and area'); return; }
  sendFormData(formData, 'Freshly Hub Partner + Delivery registration submitted');
}

function submitAreaRequest(){
  const formData = new URLSearchParams();
  formData.append('leadType', 'area');
  formData.append('name', document.getElementById('areaName').value.trim());
  formData.append('phone', document.getElementById('areaPhone').value.trim());
  formData.append('city', document.getElementById('areaCity').value.trim());
  formData.append('pincode', document.getElementById('areaPincode').value.trim());
  formData.append('area', document.getElementById('areaLocation').value.trim());
  formData.append('requirement', document.getElementById('areaRequirement').value.trim());
  if(!formData.get('name') || !formData.get('phone') || !formData.get('city') || !formData.get('pincode') || !formData.get('area')){ alert('Please fill name, phone, city, pin code and area'); return; }
  sendFormData(formData, 'Freshly delivery request submitted. We will review demand in your area.');
}

function submitReferral(){
  const formData = new URLSearchParams();
  formData.append('leadType', 'referral');
  formData.append('customerName', document.getElementById('refCustomerName').value.trim());
  formData.append('customerPhone', document.getElementById('refCustomerPhone').value.trim());
  formData.append('friendName', document.getElementById('refFriendName').value.trim());
  formData.append('friendPhone', document.getElementById('refFriendPhone').value.trim());
  formData.append('friendCity', document.getElementById('refFriendCity').value.trim());
  formData.append('friendPincode', document.getElementById('refFriendPincode').value.trim());
  formData.append('friendArea', document.getElementById('refFriendArea').value.trim());
  if(!formData.get('customerName') || !formData.get('customerPhone') || !formData.get('friendName') || !formData.get('friendPhone') || !formData.get('friendCity') || !formData.get('friendPincode')){ alert('Please fill all required referral details'); return; }
  sendFormData(formData, 'Referral submitted. Freshly Reward Points will be credited as per policy after verification.');
}

function submitPaymentVerification(){
  const formData = new URLSearchParams();
  formData.append('leadType', 'payment');
  formData.append('orderId', document.getElementById('payOrderId').value.trim());
  formData.append('paidAmount', document.getElementById('payAmount').value.trim());
  formData.append('upiRefNo', document.getElementById('payRef').value.trim());
  formData.append('verifiedBy', document.getElementById('payVerifiedBy').value.trim());
  if(!formData.get('orderId') || !formData.get('paidAmount') || !formData.get('upiRefNo') || !formData.get('verifiedBy')){ alert('Please fill order ID, amount, UPI reference and verified by'); return; }
  sendFormData(formData, 'Payment verification submitted');
}

function toggleLang(){
  ml = !ml;
  document.getElementById('title').innerText = ml ? 'ഇന്നത്തെ മീൻ ലഭ്യത' : "Today's Fresh Catch";
  document.getElementById('cartTitle').innerText = ml ? 'നിങ്ങളുടെ കാർട്ട്' : 'Your Cart';
  loadFish();
  updateCart();
}

window.onload = async function(){
  const savedAddress = localStorage.getItem('freshlyAddress');
  if(savedAddress){ document.getElementById('address').value = savedAddress; }
  document.getElementById('pincode').addEventListener('input', updateHubPreview);
  document.getElementById('city').addEventListener('input', updateHubPreview);
  document.getElementById('fulfillment').addEventListener('change', function(){ updateSlotDropdown(); updateCart(); });
  if(typeof toggleQR === 'function') toggleQR();
  await loadHubPincodes();
  await loadHubDeliverySlots();
  loadFish();
};
