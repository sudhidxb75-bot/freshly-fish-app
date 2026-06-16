/* Freshly v11 App Settings - 12 Hour Time Format + Pincode Hub Fix */
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

function byId(id){ return document.getElementById(id); }

function parseCSV(text){
  const rows = [];
  let row = [], cell = '', quote = false;
  text = String(text || '').replace(/^\uFEFF/, '');

  for(let i = 0; i < text.length; i++){
    const char = text[i], next = text[i + 1];
    if(char === '"' && quote && next === '"'){
      cell += '"';
      i++;
    }else if(char === '"'){
      quote = !quote;
    }else if(char === ',' && !quote){
      row.push(cell);
      cell = '';
    }else if((char === '\n' || char === '\r') && !quote){
      if(cell || row.length){
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      }
      if(char === '\r' && next === '\n') i++;
    }else{
      cell += char;
    }
  }

  if(cell || row.length){
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function clean(value){
  return String(value ?? '').replace(/^\uFEFF/, '').trim();
}

function normalizeHeader(value){
  return clean(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function rowToObject(headers, cols){
  const obj = {};
  headers.forEach((header, index) => {
    obj[normalizeHeader(header)] = clean(cols[index]);
  });
  return obj;
}

function pick(obj, names){
  for(const name of names){
    const key = normalizeHeader(name);
    if(Object.prototype.hasOwnProperty.call(obj, key) && clean(obj[key]) !== ''){
      return clean(obj[key]);
    }
  }
  return '';
}

function yes(value){
  const v = clean(value).toLowerCase();
  return v === 'yes' || v === 'true' || v === 'available' || v === 'active' || v === '1' || v === 'y';
}

function num(value){
  const raw = clean(value).replace(/,/g, '');
  if(!raw) return 0;
  const n = Number(raw.replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? 0 : n;
}

function money(value){
  return Math.round(num(value));
}

function normalizePincode(value){
  let v = clean(value);
  if(!v) return '';

  // Handles values like 673008.0 if Google Sheets formats the column as number.
  if(/^\d+\.0+$/.test(v)) v = v.split('.')[0];

  // Keep only digits for comparison.
  v = v.replace(/[^0-9]/g, '');

  // Indian pincodes are 6 digits. If Google Sheets accidentally adds extra decimal digits,
  // keep the first 6 digits because the displayed pincode should be 6 digits.
  if(v.length > 6) v = v.slice(0, 6);
  return v;
}

function normalizePhone(value){
  const raw = clean(value);
  if(!raw) return '';

  // If a phone number was stored in Google Sheets as scientific notation, keep it readable.
  if(/e\+/i.test(raw)){
    const n = Number(raw);
    if(!isNaN(n)) return String(Math.trunc(n));
  }
  return raw;
}

function parseTimeParts(timeValue){
  if(timeValue === null || timeValue === undefined || timeValue === '') return null;

  if(typeof timeValue === 'number'){
    const totalMinutes = Math.round(timeValue * 24 * 60);
    return {
      hour: Math.floor(totalMinutes / 60) % 24,
      minute: totalMinutes % 60
    };
  }

  let text = clean(timeValue);
  if(!text) return null;

  // Google Sheets sometimes exports time as a decimal string like 0.625 for 15:00.
  if(/^0?\.\d+$/.test(text)){
    const decimal = Number(text);
    if(!isNaN(decimal)){
      const totalMinutes = Math.round(decimal * 24 * 60);
      return {
        hour: Math.floor(totalMinutes / 60) % 24,
        minute: totalMinutes % 60
      };
    }
  }

  // Handles 15:00, 15:00:00, 3:00 PM, 03:00 pm, and date-time strings ending with time.
  let match = text.match(/(\d{1,2})\s*:\s*(\d{2})(?:\s*:\s*\d{2})?\s*(AM|PM)?/i);

  // Handles plain hour values like 15 or 3 PM.
  if(!match){
    match = text.match(/^(\d{1,2})\s*(AM|PM)?$/i);
  }

  if(!match) return null;

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const ampm = clean(match[3]).toUpperCase();

  if(isNaN(hour) || isNaN(minute)) return null;

  if(ampm === 'PM' && hour < 12) hour += 12;
  if(ampm === 'AM' && hour === 12) hour = 0;

  if(hour >= 24) hour = hour % 24;

  return { hour, minute };
}

function formatTime12Hour(timeValue){
  const parts = parseTimeParts(timeValue);
  if(!parts) return clean(timeValue);

  const ampm = parts.hour >= 12 ? 'PM' : 'AM';
  const hour12 = parts.hour % 12 || 12;
  return `${hour12}:${String(parts.minute).padStart(2, '0')} ${ampm}`;
}

function cutoffDateForToday(timeValue){
  const parts = parseTimeParts(timeValue);
  if(!parts) return null;

  const cutoff = new Date();
  cutoff.setHours(parts.hour, parts.minute, 0, 0);
  return cutoff;
}

function fishRowsToObjects(csv){
  const rows = parseCSV(csv);
  if(rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map(cols => {
    const r = rowToObject(headers, cols);
    return {
      name: pick(r, ['name', 'FishName', 'Fish Name']),
      malayalam: pick(r, ['malayalam', 'MalayalamName', 'Malayalam Name']),
      price: num(pick(r, ['price', 'Rate', 'PricePerKg', 'Price Per Kg'])),
      stock: yes(pick(r, ['stock', 'InStock', 'Status', 'Available'])),
      image: pick(r, ['image', 'ImageURL', 'Image URL', 'Photo']),
      cleanChargePerKg: num(pick(r, ['cleanChargePerKg', 'CleanChargePerKg', 'Clean Charge Per Kg', 'CleaningCharge'])),
      curryCutChargePerKg: num(pick(r, ['curryCutChargePerKg', 'CurryCutChargePerKg', 'Curry Cut Charge Per Kg'])),
      steakCutChargePerKg: num(pick(r, ['steakCutChargePerKg', 'SteakCutChargePerKg', 'Steak Cut Charge Per Kg'])),
      filletChargePerKg: num(pick(r, ['filletChargePerKg', 'FilletChargePerKg', 'Fillet Charge Per Kg'])),
      marinationChargePerKg: num(pick(r, ['marinationChargePerKg', 'MarinationChargePerKg', 'Marination Charge Per Kg']))
    };
  }).filter(x => x.name);
}

function hubRowsToObjects(csv){
  const rows = parseCSV(csv);
  if(rows.length < 2) return [];

  const headers = rows[0];

  return rows.slice(1).map(cols => {
    const r = rowToObject(headers, cols);
    const status = pick(r, ['Status', 'Active']);

    return {
      pincode: normalizePincode(pick(r, ['PinCode', 'Pincode', 'Pin Code', 'PIN', 'PIN Code'])),
      city: pick(r, ['City', 'Town', 'CityTown', 'City / Town']),
      area: pick(r, ['Area', 'Location', 'Locality']),
      hubId: pick(r, ['HubID', 'HubId', 'Hub ID']),
      hubName: pick(r, ['HubName', 'Hub Name']),
      pickupAvailable: yes(pick(r, ['PickupAvailable', 'Pickup Available', 'Pickup'])),
      homeDeliveryAvailable: yes(pick(r, ['HomeDeliveryAvailable', 'Home Delivery Available', 'DeliveryAvailable', 'Delivery Available', 'HomeDelivery'])),
      homeDeliveryCharge: num(pick(r, ['DeliveryCharge', 'HomeDeliveryCharge', 'Home Delivery Charge', 'Delivery Charge'])),
      cutOffTime: pick(r, ['DefaultCutOffTime', 'Default Cut Off Time', 'CutOffTime', 'Cut Off Time', 'Default Cut-Off Time']),
      status: status || 'Active',
      hubPartner: pick(r, ['HubPartner', 'Hub Partner', 'PartnerName', 'Partner Name']),
      hubPhone: normalizePhone(pick(r, ['HubPhone', 'Hub Phone', 'PartnerPhone', 'Partner Phone', 'Phone'])),
      minimumOrder: num(pick(r, ['MinimumOrder', 'Minimum Order', 'MinOrder', 'Min Order'])),

      // Optional fallback columns only. Main delivery slots should come from HubDeliverySlots sheet.
      deliverySlot1: pick(r, ['DeliverySlot1', 'Delivery Slot 1', 'Slot1']),
      deliverySlot2: pick(r, ['DeliverySlot2', 'Delivery Slot 2', 'Slot2']),
      deliverySlot3: pick(r, ['DeliverySlot3', 'Delivery Slot 3', 'Slot3'])
    };
  }).filter(x => {
    const active = !x.status || yes(x.status);
    return x.pincode && x.hubName && active;
  });
}

function hubSlotRowsToObjects(csv){
  const rows = parseCSV(csv);
  if(rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map(cols => {
    const r = rowToObject(headers, cols);
    return {
      hubId: pick(r, ['HubID', 'HubId', 'Hub ID']),
      slotId: pick(r, ['SlotID', 'SlotId', 'Slot ID']),
      deliverySlot: pick(r, ['DeliverySlot', 'Delivery Slot', 'Slot']),
      cutOffTime: pick(r, ['CutOffTime', 'Cut Off Time', 'DefaultCutOffTime', 'Default Cut Off Time']),
      fulfillment: pick(r, ['Fulfillment', 'Service', 'Type']),
      status: pick(r, ['Status', 'Active']),
      notes: pick(r, ['Notes', 'Remarks'])
    };
  }).filter(x => x.hubId && x.deliverySlot && yes(x.status || 'Active'));
}

async function loadHubDeliverySlots(){
  if(!HUB_DELIVERY_SLOTS_URL || HUB_DELIVERY_SLOTS_URL.includes('PASTE_')){
    hubSlotRows = [];
    return [];
  }

  try{
    const response = await fetch(HUB_DELIVERY_SLOTS_URL, { cache: 'no-store' });
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
    const response = await fetch(HUB_PINCODES_URL, { cache: 'no-store' });
    const csv = await response.text();
    hubRows = hubRowsToObjects(csv);
    console.log('Freshly hub pincode rows loaded:', hubRows.length, hubRows);
    return hubRows;
  }catch(e){
    console.warn('Hub pincode data loading failed', e);
    hubRows = [];
    return [];
  }
}

function getHubsForLocation(pincode, city){
  const pin = normalizePincode(pincode);
  const town = clean(city).toLowerCase();

  // Pincode is the main serviceability check. If user entered a pincode,
  // do not incorrectly approve by city fallback.
  if(pin){
    return hubRows.filter(x => normalizePincode(x.pincode) === pin);
  }

  if(town){
    return hubRows.filter(x => clean(x.city).toLowerCase() === town);
  }

  return [];
}

async function updateHubPreview(){
  const pincodeInput = byId('pincode');
  const cityInput = byId('city');
  const preview = byId('hubPreview');
  const hubSelect = byId('hubSelect');

  if(!pincodeInput || !cityInput || !preview || !hubSelect) return;

  if(hubRows.length === 0){
    preview.innerHTML = 'Loading serviceable pincodes...';
    await loadHubPincodes();
  }

  const pincode = normalizePincode(pincodeInput.value);
  const city = clean(cityInput.value);

  selectedHub = null;
  selectedSlot = null;
  matchedHubs = getHubsForLocation(pincode, city);
  hubSelect.innerHTML = '';

  if(!pincode && !city){
    hubSelect.innerHTML = '<option value="">Enter pin code first</option>';
    preview.innerHTML = 'Enter pin code to see available Freshly Hubs.';
    updateSlotDropdown();
    updateCart();
    return;
  }

  if(matchedHubs.length === 0){
    hubSelect.innerHTML = '<option value="">No hub available</option>';
    preview.innerHTML = "Freshly is not currently available in this pin code. Please submit 'Request Freshly Delivery in My Area'.";
    updateSlotDropdown();
    updateCart();
    return;
  }

  matchedHubs.forEach((hub, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${hub.hubName} - ${hub.area || hub.city} - Cutoff ${formatTime12Hour(hub.cutOffTime) || 'Not set'}`;
    hubSelect.appendChild(option);
  });

  selectedHub = matchedHubs[0];
  hubSelect.value = '0';
  renderSelectedHub();
}

function renderSelectedHub(){
  const preview = byId('hubPreview');
  const fulfillment = byId('fulfillment');

  if(!preview) return;

  if(!selectedHub){
    preview.innerHTML = 'Select a serviceable Freshly Hub.';
    updateSlotDropdown();
    updateCart();
    return;
  }

  preview.innerHTML = `<b>Selected Freshly Hub:</b><br>
    ${selectedHub.hubName}<br>
    Area: ${selectedHub.area || '-'}<br>
    Hub Partner + Delivery: ${selectedHub.hubPartner || 'Freshly Team'}<br>
    Pickup: ${selectedHub.pickupAvailable ? 'Available' : 'Not Available'} | Home Delivery: ${selectedHub.homeDeliveryAvailable ? 'Available' : 'Not Available'}<br>
    Default Cut-off Time: ${formatTime12Hour(selectedHub.cutOffTime) || 'Not set'}<br>
    Home Delivery Charge: ₹${selectedHub.homeDeliveryCharge}`;

  if(fulfillment){
    [...fulfillment.options].forEach(opt => {
      if(opt.value === 'Hub Pickup') opt.disabled = !selectedHub.pickupAvailable;
      if(opt.value === 'Home Delivery') opt.disabled = !selectedHub.homeDeliveryAvailable;
    });

    if(fulfillment.value === 'Home Delivery' && !selectedHub.homeDeliveryAvailable) fulfillment.value = 'Hub Pickup';
    if(fulfillment.value === 'Hub Pickup' && !selectedHub.pickupAvailable) fulfillment.value = 'Home Delivery';
  }

  updateSlotDropdown();
  updateCart();
}

function selectHubFromDropdown(){
  const hubSelect = byId('hubSelect');
  if(!hubSelect) return;

  const index = Number(hubSelect.value);
  selectedHub = matchedHubs[index] || null;
  renderSelectedHub();
}

function updateSlotDropdown(){
  const slotSelect = byId('deliverySlot');
  const fulfillment = byId('fulfillment')?.value || '';

  selectedSlot = null;
  if(!slotSelect) return;

  slotSelect.innerHTML = '';

  if(!selectedHub){
    slotSelect.innerHTML = '<option value="">Select hub first</option>';
    return;
  }

  let slots = hubSlotRows.filter(x => clean(x.hubId) === clean(selectedHub.hubId));

  if(fulfillment){
    const filtered = slots.filter(x => {
      const type = clean(x.fulfillment).toLowerCase();
      return !type || type === 'both' || type === clean(fulfillment).toLowerCase();
    });
    if(filtered.length) slots = filtered;
  }

  // Fallback for older Hub Pincode sheet columns.
  if(slots.length === 0){
    slots = [selectedHub.deliverySlot1, selectedHub.deliverySlot2, selectedHub.deliverySlot3]
      .map((slot, index) => ({
        hubId: selectedHub.hubId,
        slotId: 'LEGACY' + (index + 1),
        deliverySlot: clean(slot),
        cutOffTime: selectedHub.cutOffTime,
        fulfillment: 'Both',
        status: 'Active'
      }))
      .filter(x => x.deliverySlot && x.deliverySlot !== '-');
  }

  // Safe default so pincode lookup does not fail only because slots are not configured yet.
  if(slots.length === 0){
    slots = [{
      hubId: selectedHub.hubId,
      slotId: 'DEFAULT',
      deliverySlot: fulfillment === 'Hub Pickup' ? 'Hub pickup - today' : 'Home delivery - today',
      cutOffTime: selectedHub.cutOffTime,
      fulfillment: fulfillment || 'Both',
      status: 'Active'
    }];
  }

  const now = new Date();

  slots.forEach((slot, index) => {
    const opt = document.createElement('option');
    opt.value = String(index);

    let disabled = false;
    const cutoffText = slot.cutOffTime || selectedHub.cutOffTime || '';
    const cutoff = cutoffDateForToday(cutoffText);
    if(cutoff){
      disabled = now > cutoff;
    }

    opt.disabled = disabled;
    opt.textContent = `${slot.deliverySlot}${cutoffText ? ' - Cutoff ' + formatTime12Hour(cutoffText) : ''}${disabled ? ' - Closed' : ''}`;
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
  const cutoff = cutoffDateForToday(cutoffText);
  if(!cutoff) return true;

  const now = new Date();
  return now <= cutoff;
}

function getSelectedSlotCutoff(){
  return (selectedSlot && selectedSlot.cutOffTime) || (selectedHub && selectedHub.cutOffTime) || '';
}

function getSelectedSlotId(){
  return (selectedSlot && selectedSlot.slotId) || '';
}

function getFulfillmentCharge(){
  const fulfillment = byId('fulfillment')?.value || 'Home Delivery';
  if(fulfillment === 'Home Delivery' && selectedHub) return selectedHub.homeDeliveryCharge || 0;
  return 0;
}

function getLocation(){
  const address = byId('address');
  if(!address) return;

  if(!navigator.geolocation){
    alert('Location is not supported on this device.');
    return;
  }

  address.value = 'Getting current location...';
  navigator.geolocation.getCurrentPosition(
    function(position){
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
      address.value = `GPS Location: ${mapLink}`;
      localStorage.setItem('freshlyAddress', address.value);
    },
    function(){
      alert('Unable to get location. Please allow location access or type address manually.');
      address.value = '';
    }
  );
}

async function loadFish(){
  const box = byId('fishContainer');
  if(!box) return;

  box.innerHTML = 'Loading fish items...';

  if(!FISH_DATA_URL || FISH_DATA_URL.includes('PASTE_')){
    box.innerHTML = 'Fish list is not configured yet.';
    return;
  }

  try{
    const res = await fetch(FISH_DATA_URL, { cache: 'no-store' });
    const csv = await res.text();
    fishData = fishRowsToObjects(csv);
    box.innerHTML = '';

    if(fishData.length === 0){
      box.innerHTML = 'No fish items available now.';
      return;
    }

    fishData.forEach((fish, i) => {
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
            <option value="0.5">500 gms</option>
            <option value="1">1 kg</option>
            <option value="1.5">1.5 kg</option>
            <option value="2">2 kg</option>
            <option value="2.5">2.5 kg</option>
            <option value="3">3 kg</option>
            <option value="3.5">3.5 kg</option>
            <option value="4">4 kg</option>
            <option value="4.5">4.5 kg</option>
            <option value="5">5 kg</option>
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
            <option value="No Marination">No Marination - Free</option>
            <option value="Kerala Fish Fry Masala">Kerala Fish Fry Masala - ₹${fish.marinationChargePerKg}/kg</option>
            <option value="Spicy Red Masala">Spicy Red Masala - ₹${fish.marinationChargePerKg}/kg</option>
            <option value="Pepper Masala">Pepper Masala - ₹${fish.marinationChargePerKg}/kg</option>
            <option value="Turmeric & Chilli">Turmeric & Chilli - ₹${fish.marinationChargePerKg}/kg</option>
            <option value="Tandoori Masala">Tandoori Masala - ₹${fish.marinationChargePerKg}/kg</option>
          </select>

          <button class="add" onclick="addToCart(${i})" ${fish.stock ? '' : 'disabled'}>${ml ? 'കാർട്ടിലേക്ക് ചേർക്കുക':'Add to Cart'}</button>
        </div>
      </div>`;
    });
  }catch(e){
    console.warn('Fish data loading failed', e);
    box.innerHTML = 'Fish items failed to load. Please refresh after some time.';
  }
}

function addToCart(i){
  const fish = fishData[i];
  if(!fish) return;

  const weight = Number(byId('weight-' + i)?.value || 1);
  const cleaningSelect = byId('cleaning-' + i);
  const cleaning = cleaningSelect?.value || 'Whole Fish';
  const cleaningChargePerKg = Number(cleaningSelect?.options[cleaningSelect.selectedIndex]?.dataset.charge || 0);
  const marination = byId('marination-' + i)?.value || 'No Marination';

  const fishAmount = money(fish.price * weight);
  const cleaningCharge = money(cleaningChargePerKg * weight);
  const marinationCharge = marination !== 'No Marination' ? money(fish.marinationChargePerKg * weight) : 0;
  const amount = fishAmount + cleaningCharge + marinationCharge;

  cart.push({
    name: fish.name,
    malayalam: fish.malayalam,
    price: fish.price,
    weight,
    cleaning,
    cleaningChargePerKg,
    cleaningCharge,
    marination,
    marinationChargePerKg: fish.marinationChargePerKg,
    marinationCharge,
    fishAmount,
    amount
  });

  updateCart();
}

function updateCart(){
  const list = byId('cartItems');
  if(!list) return;

  list.innerHTML = '';
  let subtotal = 0, cleaningTotal = 0, marinationTotal = 0;

  cart.forEach((item, i) => {
    subtotal += item.fishAmount;
    cleaningTotal += item.cleaningCharge;
    marinationTotal += item.marinationCharge;

    list.innerHTML += `<div class="cart-item">
      <strong>${ml ? item.malayalam : item.name}</strong><br>
      Weight: ${item.weight} kg<br>
      Rate: ₹${item.price}/kg<br>
      Fish Amount: ₹${item.fishAmount}<br>
      Cleaning/Cutting: ${item.cleaning} - ₹${item.cleaningCharge}<br>
      Marination: ${item.marination} - ₹${item.marinationCharge}<br>
      <b>Item Total: ₹${item.amount}</b><br>
      <button class="remove" onclick="removeItem(${i})">Remove</button>
    </div>`;
  });

  const deliveryCharge = getFulfillmentCharge();
  const total = subtotal + cleaningTotal + marinationTotal + deliveryCharge;

  if(byId('subtotal')) byId('subtotal').innerText = subtotal;
  if(byId('cleaningTotal')) byId('cleaningTotal').innerText = cleaningTotal;
  if(byId('marinationTotal')) byId('marinationTotal').innerText = marinationTotal;
  if(byId('deliveryCharge')) byId('deliveryCharge').innerText = deliveryCharge;
  if(byId('total')) byId('total').innerText = total;
  if(byId('count')) byId('count').innerText = cart.length;
}

function removeItem(i){
  cart.splice(i, 1);
  updateCart();
}

function toggleQR(){
  const qr = byId('qrSection');
  if(qr) qr.style.display = 'block';
}

async function sendFormData(formData, successMessage){
  if(!BACKEND_URL || BACKEND_URL.includes('PASTE_')){
    alert('Backend URL is not configured in assets/app.js');
    return;
  }

  try{
    await fetch(BACKEND_URL, { method: 'POST', mode: 'no-cors', body: formData });
    alert(successMessage || 'Submitted successfully');
  }catch(e){
    alert('Submission failed. Please try again.');
  }
}

function openWhatsAppToAllNumbers(message){
  WHATSAPP_NUMBERS.forEach((number, index) => {
    setTimeout(() => {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    }, index * 1200);
  });
}

function slotSelectText(){
  const slotSelect = byId('deliverySlot');
  if(selectedSlot) return selectedSlot.deliverySlot;
  if(!slotSelect) return '';
  return slotSelect.options[slotSelect.selectedIndex]?.textContent || slotSelect.value || '';
}

async function placeOrder(){
  if(cart.length === 0){
    alert('Cart is empty');
    return;
  }

  const name = clean(byId('name')?.value);
  const phone = clean(byId('phone')?.value);
  const city = clean(byId('city')?.value);
  const pincode = normalizePincode(byId('pincode')?.value);
  const address = clean(byId('address')?.value);
  const fulfillment = byId('fulfillment')?.value || 'Home Delivery';
  const payment = byId('payment')?.value || '';

  if(!name || !phone || !city || !pincode){
    alert('Please fill name, phone, city and pin code');
    return;
  }

  if(fulfillment === 'Home Delivery' && !address){
    alert('Please enter delivery address for home delivery');
    return;
  }

  if(hubRows.length === 0) await loadHubPincodes();
  await updateHubPreview();

  if(!selectedHub){
    alert("Sorry. Freshly is currently not available in this pin code. Please submit a request under 'Request Freshly Delivery in My Area'.");
    return;
  }

  if(fulfillment === 'Hub Pickup' && !selectedHub.pickupAvailable){
    alert('Hub pickup is not available for this hub.');
    return;
  }

  if(fulfillment === 'Home Delivery' && !selectedHub.homeDeliveryAvailable){
    alert('Home delivery is not available for this hub. Please choose hub pickup.');
    return;
  }

  updateSlotDropdown();
  const slot = slotSelectText();

  if(!slot){
    alert('Please select delivery / pickup slot');
    return;
  }

  if(!selectedSlot && hubSlotRows.length > 0){
    alert('Please select an open delivery / pickup slot.');
    return;
  }

  const slotCutOffTimeRaw = getSelectedSlotCutoff();
  const slotCutOffTime = formatTime12Hour(slotCutOffTimeRaw);

  if(!isBeforeHubCutoff()){
    alert(`Order cut-off time for ${selectedHub.hubName} / selected slot is ${slotCutOffTime}. Please order earlier for same-day service.`);
    return;
  }

  localStorage.setItem('freshlyAddress', address);

  const orderId = 'FR' + Date.now();
  const subtotal = cart.reduce((s, x) => s + x.fishAmount, 0);
  const cleaningTotal = cart.reduce((s, x) => s + x.cleaningCharge, 0);
  const marinationTotal = cart.reduce((s, x) => s + x.marinationCharge, 0);
  const deliveryCharge = fulfillment === 'Home Delivery' ? selectedHub.homeDeliveryCharge : 0;
  const total = subtotal + cleaningTotal + marinationTotal + deliveryCharge;

  if(selectedHub.minimumOrder && total < selectedHub.minimumOrder){
    alert(`Minimum order for this hub/area is ₹${selectedHub.minimumOrder}.`);
    return;
  }

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
  formData.append('slot', slot);
  formData.append('slotId', getSelectedSlotId());
  formData.append('slotCutOffTime', slotCutOffTime);
  formData.append('slotCutOffTimeRaw', slotCutOffTimeRaw);
  formData.append('hubId', selectedHub.hubId);
  formData.append('hubName', selectedHub.hubName);
  formData.append('hubArea', selectedHub.area);
  formData.append('hubPartner', selectedHub.hubPartner);
  formData.append('hubPhone', selectedHub.hubPhone);
  formData.append('cutOffTime', formatTime12Hour(selectedHub.cutOffTime));
  formData.append('cutOffTimeRaw', selectedHub.cutOffTime);

  fetch(BACKEND_URL, { method: 'POST', mode: 'no-cors', body: formData });

  const msg = `Freshly Fish Order\n\nOrder ID: ${orderId}\n\nName: ${name}\nPhone: ${phone}\nCity: ${city}\nPin Code: ${pincode}\nService: ${fulfillment}\nAddress: ${address || 'Customer will pickup from hub'}\n\nItems:\n${items}\n\nFish Subtotal: ₹${subtotal}\nCleaning/Cutting Charges: ₹${cleaningTotal}\nMarination Charges: ₹${marinationTotal}\nHome Delivery Charge: ₹${deliveryCharge}\nTotal: ₹${total}\nPayment Option: ${payment}\nPayment Rule: Customer pays Freshly directly by UPI. No cash collection by hub/delivery partner.\nDelivery/Pickup Slot: ${slot}\nSlot Cut-off Time: ${slotCutOffTime}\n\nSelected Freshly Hub:\n${selectedHub.hubName}\nArea: ${selectedHub.area}\nHub Partner + Delivery: ${selectedHub.hubPartner || 'Freshly Team'}\n\nPlease confirm my order.`;

  openWhatsAppToAllNumbers(msg);
  cart = [];
  updateCart();
  alert('Order submitted. WhatsApp order windows will open for configured numbers.');
}

function submitPartner(){
  const formData = new URLSearchParams();
  formData.append('type', 'hubPartnerDelivery');
  formData.append('leadType', 'hubPartnerDelivery');
  formData.append('name', clean(byId('partnerName')?.value));
  formData.append('phone', clean(byId('partnerPhone')?.value));
  formData.append('city', clean(byId('partnerCity')?.value));
  formData.append('pincode', normalizePincode(byId('partnerPincode')?.value));
  formData.append('area', clean(byId('partnerArea')?.value));
  formData.append('vehicle', clean(byId('partnerVehicle')?.value));
  formData.append('experience', clean(byId('partnerExperience')?.value));

  if(!formData.get('name') || !formData.get('phone') || !formData.get('city') || !formData.get('pincode') || !formData.get('area')){
    alert('Please fill name, phone, city, pin code and area');
    return;
  }

  sendFormData(formData, 'Freshly Hub Partner + Delivery registration submitted');
}

function submitAreaRequest(){
  const formData = new URLSearchParams();
  formData.append('type', 'area');
  formData.append('leadType', 'area');
  formData.append('name', clean(byId('areaName')?.value));
  formData.append('phone', clean(byId('areaPhone')?.value));
  formData.append('city', clean(byId('areaCity')?.value));
  formData.append('pincode', normalizePincode(byId('areaPincode')?.value));
  formData.append('area', clean(byId('areaLocation')?.value));
  formData.append('requirement', clean(byId('areaRequirement')?.value));

  if(!formData.get('name') || !formData.get('phone') || !formData.get('city') || !formData.get('pincode') || !formData.get('area')){
    alert('Please fill name, phone, city, pin code and area');
    return;
  }

  sendFormData(formData, 'Freshly delivery request submitted. We will review demand in your area.');
}

function submitReferral(){
  const formData = new URLSearchParams();
  formData.append('type', 'referral');
  formData.append('leadType', 'referral');
  formData.append('customerName', clean(byId('refCustomerName')?.value));
  formData.append('customerPhone', clean(byId('refCustomerPhone')?.value));
  formData.append('friendName', clean(byId('refFriendName')?.value));
  formData.append('friendPhone', clean(byId('refFriendPhone')?.value));
  formData.append('friendCity', clean(byId('refFriendCity')?.value));
  formData.append('friendPincode', normalizePincode(byId('refFriendPincode')?.value));
  formData.append('friendArea', clean(byId('refFriendArea')?.value));

  if(!formData.get('customerName') || !formData.get('customerPhone') || !formData.get('friendName') || !formData.get('friendPhone') || !formData.get('friendCity') || !formData.get('friendPincode')){
    alert('Please fill all required referral details');
    return;
  }

  sendFormData(formData, 'Referral submitted. Freshly Reward Points will be credited as per policy after verification.');
}

function submitPaymentVerification(){
  const formData = new URLSearchParams();
  formData.append('type', 'payment');
  formData.append('leadType', 'payment');
  formData.append('orderId', clean(byId('payOrderId')?.value));
  formData.append('paidAmount', clean(byId('payAmount')?.value));
  formData.append('upiRefNo', clean(byId('payRef')?.value));
  formData.append('verifiedBy', clean(byId('payVerifiedBy')?.value));

  if(!formData.get('orderId') || !formData.get('paidAmount') || !formData.get('upiRefNo') || !formData.get('verifiedBy')){
    alert('Please fill order ID, amount, UPI reference and verified by');
    return;
  }

  sendFormData(formData, 'Payment verification submitted');
}

function toggleLang(){
  ml = !ml;
  if(byId('title')) byId('title').innerText = ml ? 'ഇന്നത്തെ മീൻ ലഭ്യത' : "Today's Fresh Catch";
  if(byId('cartTitle')) byId('cartTitle').innerText = ml ? 'നിങ്ങളുടെ കാർട്ട്' : 'Your Cart';
  loadFish();
  updateCart();
}

window.onload = async function(){
  const savedAddress = localStorage.getItem('freshlyAddress');
  if(savedAddress && byId('address')) byId('address').value = savedAddress;

  if(byId('pincode')) byId('pincode').addEventListener('input', updateHubPreview);
  if(byId('city')) byId('city').addEventListener('input', updateHubPreview);
  if(byId('hubSelect')) byId('hubSelect').addEventListener('change', selectHubFromDropdown);
  if(byId('deliverySlot')) byId('deliverySlot').addEventListener('change', function(){
    updateCart();
  });
  if(byId('fulfillment')) byId('fulfillment').addEventListener('change', function(){
    updateSlotDropdown();
    updateCart();
  });

  if(typeof toggleQR === 'function') toggleQR();
  await loadHubPincodes();
  await loadHubDeliverySlots();
  loadFish();
};
