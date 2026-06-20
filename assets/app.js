/*
  Freshly Website App v16.1 - tolerant catalogue loader
  Dynamic product categories from backend sheet.

  IMPORTANT SETUP:
  1. Publish your Google Sheet tabs as CSV.
  2. Paste those CSV links below.
  3. A new category can be added by typing a new Category value in FishData.
  4. No website structure change is required for new categories.
*/

const FRESHLY_CONFIG = {
  PRODUCT_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7gp6cTQ7rETR-HZ5eiwTjjkd0OIOESFfbunbxHSxeoL_2RzmxVdF3c1Y1bMUo-yzgEMF-olA4pUuh/pub?gid=564324358&single=true&output=csv",
  HUB_PINCODES_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7gp6cTQ7rETR-HZ5eiwTjjkd0OIOESFfbunbxHSxeoL_2RzmxVdF3c1Y1bMUo-yzgEMF-olA4pUuh/pub?gid=1070445629&single=true&output=csv",
  HUB_SLOTS_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7gp6cTQ7rETR-HZ5eiwTjjkd0OIOESFfbunbxHSxeoL_2RzmxVdF3c1Y1bMUo-yzgEMF-olA4pUuh/pub?gid=1644440201&single=true&output=csv",
  BACKEND_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbxZlaaHTLoEfMOzqLEwSuLqQOizjfIEkEgKisfMxlwxPHQ249VRZDKfV7EBRvRfIhVt/exec",
  WHATSAPP_NUMBERS: ["918921696649"],
  DEFAULT_CATEGORY: "Fresh Fish & Seafood",
  CURRENCY_SYMBOL: "₹"
};

let PRODUCTS = [];
let HUBS = [];
let HUB_SLOTS = [];
let CART = [];
let SELECTED_CATEGORY = "All";
let CURRENT_LANG = "en";

const $ = (id) => document.getElementById(id);

function isConfigured(url) {
  return url && !String(url).includes("PASTE_");
}

function normalizeKey(key) {
  return String(key || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function pick(row, names, fallback = "") {
  const map = {};

  // Important: Google Sheet can have old + new headers together, for example
  // "name" in column A and "Name" again later. Both normalize to the same key.
  // Do not let a later blank duplicate column overwrite an earlier filled value.
  Object.keys(row || {}).forEach(k => {
    const nk = normalizeKey(k);
    const value = row[k];
    const oldValue = map[nk];
    const hasNewValue = value !== undefined && value !== null && String(value).trim() !== "";
    const hasOldValue = oldValue !== undefined && oldValue !== null && String(oldValue).trim() !== "";
    if (map[nk] === undefined || (!hasOldValue && hasNewValue)) {
      map[nk] = value;
    }
  });

  for (const name of names) {
    const value = map[normalizeKey(name)];
    if (value !== undefined && value !== null && String(value).trim() !== "") return String(value).trim();
  }
  return fallback;
}

function hasColumn(row, names) {
  const keys = Object.keys(row || {}).map(normalizeKey);
  return names.some(name => keys.includes(normalizeKey(name)));
}

function inferProductName(row, index) {
  const skip = new Set([
    "productid", "id", "code", "sku", "category", "productcategory", "subcategory",
    "priceperkg", "price", "rate", "unitprice", "unit", "saleunit", "uom",
    "stock", "availability", "available", "status", "active", "visibility",
    "image", "imageurl", "photo", "cleanchargeperkg", "cleaningcharge", "cleancharge",
    "currycutchargeperkg", "cutcharge", "cuttingcharge", "steakcutchargeperkg",
    "filletchargeperkg", "marinationchargeperkg", "marinationcharge", "sortorder", "sort", "notes", "description"
  ]);

  for (const [key, value] of Object.entries(row || {})) {
    const normalized = normalizeKey(key);
    const text = String(value || "").trim();
    if (!text || skip.has(normalized)) continue;
    // Avoid using a pure number as the product name.
    if (/^[0-9.,₹\s-]+$/.test(text)) continue;
    return text;
  }

  const id = pick(row, ["ProductID", "Product ID", "ID", "Code", "SKU"], "");
  return id || `Product ${index + 1}`;
}

function money(value) {
  const n = Number(value || 0);
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

function escapeHtml(value) {
  return String(value || "").replace(/[&<>'"]/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[ch]));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell);
      if (row.some(v => String(v).trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    if (row.some(v => String(v).trim() !== "")) rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows.shift().map(h => String(h || "").trim());
  return rows.map(values => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });
}

async function fetchCsv(url) {
  const finalUrl = url + (url.includes("?") ? "&" : "?") + "cache=" + Date.now();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(finalUrl, {
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error("CSV fetch failed. HTTP Status: " + response.status);
    }

    const text = await response.text();
    const trimmed = String(text || "").trim();

    // If Google Sheets is not properly published, the browser may receive an HTML page
    // instead of CSV. Showing this clearly makes troubleshooting easier.
    if (!trimmed) {
      throw new Error("CSV file is empty. Check whether the sheet tab has data and is published as CSV.");
    }

    if (/^<!doctype html/i.test(trimmed) || /^<html/i.test(trimmed) || trimmed.includes("<title>")) {
      throw new Error("The CSV link returned an HTML page, not CSV. Publish the Google Sheet tab to web as CSV and use the published CSV link.");
    }

    return parseCsv(text);
  } finally {
    clearTimeout(timer);
  }
}

function normalizeProduct(row, index) {
  let name = pick(row, [
    "Name", "ProductName", "Product Name", "Item", "ItemName", "Item Name",
    "Fish", "FishName", "Fish Name", "FishData", "Fish Data",
    "Product", "Product Title", "Title", "Description"
  ]);

  if (!name) name = inferProductName(row, index);

  const category = pick(row, ["Category", "ProductCategory", "Product Category"], FRESHLY_CONFIG.DEFAULT_CATEGORY);
  const unit = pick(row, ["Unit", "SaleUnit", "Sale Unit", "UOM", "Measure"], "kg");
  const status = pick(row, ["Status", "Active", "Visibility"], "Active");
  const stock = pick(row, ["Stock", "Availability", "Available"], "Available");

  return {
    id: pick(row, ["ProductID", "Product ID", "ID", "Code", "SKU"], name || `PRODUCT_${index + 1}`),
    category,
    subCategory: pick(row, ["SubCategory", "Sub Category"], ""),
    name,
    malayalam: pick(row, ["Malayalam", "MalayalamName", "Malayalam Name", "MlName"], ""),
    price: money(pick(row, ["PricePerKg", "Price Per Kg", "Price", "Rate", "UnitPrice", "Unit Price"], 0)),
    unit,
    stock,
    image: pick(row, ["Image", "ImageURL", "Image URL", "Photo", "ImageUrl"], ""),
    cleanCharge: money(pick(row, ["CleanChargePerKg", "Clean Charge Per Kg", "CleaningCharge", "Cleaning Charge", "CleanCharge"], 0)),
    curryCutCharge: money(pick(row, ["CurryCutChargePerKg", "Curry Cut Charge Per Kg", "CutCharge", "Cut Charge", "CuttingCharge", "Cutting Charge"], 0)),
    steakCutCharge: money(pick(row, ["SteakCutChargePerKg", "Steak Cut Charge Per Kg"], 0)),
    filletCharge: money(pick(row, ["FilletChargePerKg", "Fillet Charge Per Kg"], 0)),
    marinationCharge: money(pick(row, ["MarinationChargePerKg", "Marination Charge Per Kg", "MarinationCharge", "Marination Charge"], 0)),
    status,
    stockColumnExists: hasColumn(row, ["Stock", "Availability", "Available"]),
    statusColumnExists: hasColumn(row, ["Status", "Active", "Visibility"]),
    sortOrder: money(pick(row, ["SortOrder", "Sort Order", "Sort"], index + 1)),
    notes: pick(row, ["Notes", "Description"], "")
  };
}

function isProductVisible(product) {
  const status = String(product.status || "").trim().toLowerCase();
  const stock = String(product.stock || "").trim().toLowerCase();
  if (!product.name) return false;

  // Only hide products when the sheet clearly says inactive/out of stock.
  // This avoids hiding valid old FishData rows because of unusual Stock/Status values.
  const hiddenStatuses = ["inactive", "disabled", "hidden", "hide", "not active"];
  const outStocks = ["out", "out of stock", "not available", "unavailable", "na", "n/a"];

  if (product.statusColumnExists && hiddenStatuses.includes(status)) return false;
  if (product.stockColumnExists && outStocks.includes(stock)) return false;

  return true;
}

async function loadFish() {
  const container = $("fishContainer");
  if (!container) return;
  container.innerHTML = "Loading products...";

  if (!isConfigured(FRESHLY_CONFIG.PRODUCT_CSV_URL)) {
    container.innerHTML = `<div class="product-empty">Please paste your FishData CSV URL inside <b>assets/app.js</b>.</div>`;
    return;
  }

  try {
    const rows = await fetchCsv(FRESHLY_CONFIG.PRODUCT_CSV_URL);

    if (!rows.length) {
      throw new Error("CSV loaded, but no product rows were found below the header row.");
    }

    const normalized = rows.map(normalizeProduct);
    PRODUCTS = normalized
      .filter(isProductVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

    if (!PRODUCTS.length) {
      console.warn("Freshly product rows loaded, but none passed visibility filter. First normalized rows:", normalized.slice(0, 5));
      // Final rescue: show rows with an inferred product name instead of making the catalogue blank.
      PRODUCTS = normalized
        .filter(p => p.name)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

      if (!PRODUCTS.length) {
        const csvHeaders = Object.keys(rows[0] || {}).join(", ");
        container.innerHTML = `
          <div class="product-empty">
            Product CSV loaded, but product names could not be detected.<br>
            <b>Detected CSV headers:</b> ${escapeHtml(csvHeaders || "No headers found")}<br>
            Please keep a product name column such as <b>Name</b>, <b>Product Name</b>, <b>Item Name</b>, or <b>Fish Name</b>.
          </div>`;
        renderCategoryFilters();
        return;
      }
    }

    console.log("Freshly products loaded:", PRODUCTS.length, PRODUCTS.slice(0, 3));
    renderCategoryFilters();
    renderProducts();
  } catch (error) {
    console.error("Freshly product loading error:", error);
    container.innerHTML = `
      <div class="product-empty">
        Products could not be loaded.<br>
        <b>Reason:</b> ${escapeHtml(error.message || error)}<br>
        Please check the FishData published CSV link and sheet headers.
      </div>`;
  }
}

function getCategories() {
  const seen = new Set();
  PRODUCTS.forEach(p => {
    const cat = p.category || FRESHLY_CONFIG.DEFAULT_CATEGORY;
    if (cat) seen.add(cat);
  });
  return Array.from(seen);
}

function renderCategoryFilters() {
  const wrap = $("categoryFilters");
  if (!wrap) return;

  const categories = getCategories();
  if (SELECTED_CATEGORY !== "All" && !categories.includes(SELECTED_CATEGORY)) SELECTED_CATEGORY = "All";

  wrap.innerHTML = "";
  const allBtn = createCategoryButton("All");
  wrap.appendChild(allBtn);
  categories.forEach(category => wrap.appendChild(createCategoryButton(category)));
}

function createCategoryButton(category) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "category-chip" + (category === SELECTED_CATEGORY ? " active" : "");
  button.dataset.category = category;
  button.textContent = category;
  button.addEventListener("click", () => {
    SELECTED_CATEGORY = category;
    renderCategoryFilters();
    renderProducts();
  });
  return button;
}

function renderProducts() {
  const container = $("fishContainer");
  if (!container) return;

  const filtered = SELECTED_CATEGORY === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === SELECTED_CATEGORY);
  if (!filtered.length) {
    container.innerHTML = `<div class="product-empty">No active products in this category now.</div>`;
    return;
  }

  container.innerHTML = filtered.map(product => productCard(product)).join("");
}

function productCard(product) {
  const image = product.image || "images/freshly-logo.png";
  const displayName = CURRENT_LANG === "ml" && product.malayalam ? product.malayalam : product.name;
  const processingOptions = hasProcessingCharges(product) ? `
    <label class="product-unit-note"><input type="checkbox" id="clean_${escapeHtml(product.id)}"> Cleaning / Cutting</label>
    <label class="product-unit-note"><input type="checkbox" id="marinate_${escapeHtml(product.id)}"> Marination</label>
  ` : `<p class="product-unit-note">No cleaning or marination charges for this category.</p>`;

  return `
    <div class="card product-card">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" onerror="this.src='images/freshly-logo.png'">
      <span class="product-category-label">${escapeHtml(product.category)}</span>
      <h3>${escapeHtml(displayName)}</h3>
      ${product.subCategory ? `<p class="product-unit-note">${escapeHtml(product.subCategory)}</p>` : ""}
      <p><b>${FRESHLY_CONFIG.CURRENCY_SYMBOL}${product.price}</b> / ${escapeHtml(product.unit || "kg")}</p>
      <p class="product-unit-note">Stock: ${escapeHtml(product.stock || "Available")}</p>
      <label class="product-unit-note">Quantity
        <select id="qty_${escapeHtml(product.id)}">
          <option value="0.5">0.5</option>
          <option value="1" selected>1</option>
          <option value="1.5">1.5</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="5">5</option>
        </select> ${escapeHtml(product.unit || "kg")}
      </label>
      ${processingOptions}
      <button class="primary" onclick="addToCart('${escapeHtml(product.id)}')">Add to Cart</button>
    </div>`;
}

function hasProcessingCharges(product) {
  return product.cleanCharge || product.curryCutCharge || product.steakCutCharge || product.filletCharge || product.marinationCharge;
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => String(p.id) === String(productId));
  if (!product) return;

  const qtyEl = $(`qty_${productId}`);
  const cleanEl = $(`clean_${productId}`);
  const marinateEl = $(`marinate_${productId}`);
  const qty = money(qtyEl ? qtyEl.value : 1) || 1;
  const cleaningSelected = !!(cleanEl && cleanEl.checked);
  const marinationSelected = !!(marinateEl && marinateEl.checked);

  const cartId = `${product.id}_${Date.now()}`;
  CART.push({ cartId, product, qty, cleaningSelected, marinationSelected });
  updateCart();
}

function removeCartItem(cartId) {
  CART = CART.filter(item => item.cartId !== cartId);
  updateCart();
}

function getCartTotals() {
  let subtotal = 0;
  let cleaningTotal = 0;
  let marinationTotal = 0;

  CART.forEach(item => {
    subtotal += item.product.price * item.qty;
    if (item.cleaningSelected) cleaningTotal += (item.product.curryCutCharge || item.product.cleanCharge || 0) * item.qty;
    if (item.marinationSelected) marinationTotal += (item.product.marinationCharge || 0) * item.qty;
  });

  const deliveryCharge = getSelectedDeliveryCharge();
  return {
    subtotal: money(subtotal),
    cleaningTotal: money(cleaningTotal),
    marinationTotal: money(marinationTotal),
    deliveryCharge: money(deliveryCharge),
    total: money(subtotal + cleaningTotal + marinationTotal + deliveryCharge)
  };
}

function updateCart() {
  const cartItems = $("cartItems");
  if (!cartItems) return;

  if (!CART.length) {
    cartItems.innerHTML = `<p class="small-note">Your cart is empty.</p>`;
  } else {
    cartItems.innerHTML = CART.map(item => {
      const line = money(item.product.price * item.qty);
      return `<div class="cart-line">
        <div>
          <b>${escapeHtml(item.product.name)}</b><br>
          <span>${escapeHtml(item.product.category)} • ${item.qty} ${escapeHtml(item.product.unit || "kg")} • ${FRESHLY_CONFIG.CURRENCY_SYMBOL}${line}</span>
          ${item.cleaningSelected ? `<br><span>Cleaning / cutting selected</span>` : ""}
          ${item.marinationSelected ? `<br><span>Marination selected</span>` : ""}
        </div>
        <button type="button" onclick="removeCartItem('${item.cartId}')">Remove</button>
      </div>`;
    }).join("");
  }

  const totals = getCartTotals();
  if ($("subtotal")) $("subtotal").textContent = totals.subtotal;
  if ($("cleaningTotal")) $("cleaningTotal").textContent = totals.cleaningTotal;
  if ($("marinationTotal")) $("marinationTotal").textContent = totals.marinationTotal;
  if ($("deliveryCharge")) $("deliveryCharge").textContent = totals.deliveryCharge;
  if ($("total")) $("total").textContent = totals.total;
  if ($("count")) $("count").textContent = CART.length;
}

async function loadHubData() {
  try {
    if (isConfigured(FRESHLY_CONFIG.HUB_PINCODES_CSV_URL)) HUBS = await fetchCsv(FRESHLY_CONFIG.HUB_PINCODES_CSV_URL);
    if (isConfigured(FRESHLY_CONFIG.HUB_SLOTS_CSV_URL)) HUB_SLOTS = await fetchCsv(FRESHLY_CONFIG.HUB_SLOTS_CSV_URL);
  } catch (error) {
    console.warn("Hub data could not be loaded", error);
  }
}

function normalizeHub(row) {
  return {
    pinCode: pick(row, ["PinCode", "Pincode", "PIN"]),
    city: pick(row, ["City"]),
    area: pick(row, ["Area"]),
    hubId: pick(row, ["HubID", "HubId"]),
    hubName: pick(row, ["HubName"]),
    pickupAvailable: pick(row, ["PickupAvailable"], "Yes"),
    homeDeliveryAvailable: pick(row, ["HomeDeliveryAvailable"], "Yes"),
    deliveryCharge: money(pick(row, ["DeliveryCharge"], 0)),
    status: pick(row, ["Status"], "Active"),
    hubPartner: pick(row, ["HubPartner"], ""),
    hubPhone: pick(row, ["HubPhone"], ""),
    minimumOrder: money(pick(row, ["MinimumOrder"], 0))
  };
}

function updateHubOptions() {
  const pin = String($("pincode")?.value || "").trim();
  const select = $("hubSelect");
  const preview = $("hubPreview");
  if (!select) return;

  const matches = HUBS.map(normalizeHub).filter(h => {
    const active = String(h.status || "").toLowerCase() !== "inactive";
    return active && (!pin || String(h.pinCode) === pin);
  });

  if (!pin) {
    select.innerHTML = `<option value="">Enter pin code first</option>`;
    if (preview) preview.textContent = "Enter city and pin code to see available Freshly Hubs.";
  } else if (!matches.length) {
    select.innerHTML = `<option value="">No active hub found for this pin code</option>`;
    if (preview) preview.textContent = "Freshly service is not active for this pin code yet. You can request service through Join Freshly.";
  } else {
    select.innerHTML = `<option value="">Select Freshly Hub</option>` + matches.map(h => {
      const label = `${h.hubName || h.hubId} - ${h.area || h.city || h.pinCode}`;
      return `<option value="${escapeHtml(h.hubId)}" data-hub='${escapeHtml(JSON.stringify(h))}'>${escapeHtml(label)}</option>`;
    }).join("");
    if (preview) preview.textContent = `${matches.length} Freshly hub option(s) found for ${pin}.`;
  }

  updateDeliverySlots();
  updateCart();
}

function getSelectedHub() {
  const select = $("hubSelect");
  const option = select?.selectedOptions?.[0];
  if (!option || !option.dataset.hub) return null;
  try { return JSON.parse(option.dataset.hub); } catch (e) { return null; }
}

function getSelectedDeliveryCharge() {
  const method = $("fulfillment")?.value || "";
  const hub = getSelectedHub();
  return method === "Home Delivery" && hub ? money(hub.deliveryCharge) : 0;
}

function normalizeSlot(row) {
  return {
    hubId: pick(row, ["HubID", "HubId"]),
    slotId: pick(row, ["SlotID", "SlotId"]),
    deliverySlot: pick(row, ["DeliverySlot", "Slot"]),
    cutoff: pick(row, ["CutOffTime", "CutoffTime"]),
    fulfillment: pick(row, ["Fulfillment"], ""),
    status: pick(row, ["Status"], "Active")
  };
}

function updateDeliverySlots() {
  const slotSelect = $("deliverySlot");
  if (!slotSelect) return;
  const hub = getSelectedHub();
  const method = $("fulfillment")?.value || "";

  if (!hub) {
    slotSelect.innerHTML = `<option value="">Select hub first</option>`;
    return;
  }

  const slots = HUB_SLOTS.map(normalizeSlot).filter(s => {
    const active = String(s.status || "").toLowerCase() !== "inactive";
    const sameHub = !s.hubId || String(s.hubId) === String(hub.hubId);
    const sameMethod = !s.fulfillment || String(s.fulfillment).toLowerCase() === String(method).toLowerCase();
    return active && sameHub && sameMethod;
  });

  if (!slots.length) {
    slotSelect.innerHTML = `<option value="">Default slot / Freshly will confirm</option>`;
    return;
  }

  slotSelect.innerHTML = `<option value="">Select delivery / pickup slot</option>` + slots.map(s => {
    const data = escapeHtml(JSON.stringify(s));
    return `<option value="${escapeHtml(s.deliverySlot)}" data-slot='${data}'>${escapeHtml(s.deliverySlot)}</option>`;
  }).join("");
}

function getSelectedSlot() {
  const option = $("deliverySlot")?.selectedOptions?.[0];
  if (!option || !option.dataset.slot) return null;
  try { return JSON.parse(option.dataset.slot); } catch (e) { return null; }
}

function toggleQR() {
  const payment = $("payment")?.value || "";
  const qr = $("qrSection");
  if (!qr) return;
  qr.style.display = payment === "UPI Payment Now" ? "block" : "none";
}

function getLocation() {
  if (!navigator.geolocation) {
    alert("Location is not supported on this device.");
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const link = `https://maps.google.com/?q=${lat},${lng}`;
    const address = $("address");
    if (address) address.value = `${address.value ? address.value + "\n" : ""}GPS Location: ${link}`;
  }, () => alert("Could not access location. Please enter address manually."));
}

function toggleLang() {
  CURRENT_LANG = CURRENT_LANG === "en" ? "ml" : "en";
  renderProducts();
}

function buildOrderPayload(orderId) {
  const hub = getSelectedHub() || {};
  const slot = getSelectedSlot() || {};
  const totals = getCartTotals();
  const items = CART.map(item => `${item.product.name} (${item.product.category}) - ${item.qty} ${item.product.unit || "kg"}`).join("; ");
  const itemsJson = CART.map(item => ({
    productId: item.product.id,
    category: item.product.category,
    name: item.product.name,
    qty: item.qty,
    unit: item.product.unit,
    rate: item.product.price,
    cleaningSelected: item.cleaningSelected,
    marinationSelected: item.marinationSelected
  }));

  return {
    type: "order",
    orderId,
    name: $("name")?.value || "",
    phone: $("phone")?.value || "",
    city: $("city")?.value || "",
    pincode: $("pincode")?.value || "",
    address: $("address")?.value || "",
    fulfillment: $("fulfillment")?.value || "",
    hubId: hub.hubId || "",
    hubName: hub.hubName || "",
    hubArea: hub.area || "",
    hubPartner: hub.hubPartner || "",
    hubPhone: hub.hubPhone || "",
    slotId: slot.slotId || "",
    slot: $("deliverySlot")?.value || slot.deliverySlot || "",
    slotCutOffTime: slot.cutoff || "",
    items,
    itemsJson: JSON.stringify(itemsJson),
    subtotal: totals.subtotal,
    cleaningTotal: totals.cleaningTotal,
    marinationTotal: totals.marinationTotal,
    deliveryCharge: totals.deliveryCharge,
    total: totals.total,
    paymentOption: $("payment")?.value || ""
  };
}

async function submitOrderToBackend(payload) {
  if (!isConfigured(FRESHLY_CONFIG.BACKEND_WEB_APP_URL)) return;
  try {
    await fetch(FRESHLY_CONFIG.BACKEND_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.warn("Backend submission failed. WhatsApp order will still open.", error);
  }
}

function buildWhatsAppMessage(payload) {
  const totals = getCartTotals();
  return [
    "Freshly New Order",
    "------------------------------",
    `Order ID: ${payload.orderId}`,
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `City: ${payload.city}`,
    `Pin Code: ${payload.pincode}`,
    `Hub: ${payload.hubName || "Freshly to confirm"}`,
    `Method: ${payload.fulfillment}`,
    `Slot: ${payload.slot || "Freshly to confirm"}`,
    "",
    "Items:",
    ...CART.map(item => `- ${item.product.name} (${item.product.category}) ${item.qty} ${item.product.unit || "kg"} x ${FRESHLY_CONFIG.CURRENCY_SYMBOL}${item.product.price}`),
    "",
    `Product Subtotal: ${FRESHLY_CONFIG.CURRENCY_SYMBOL}${totals.subtotal}`,
    `Cleaning / Cutting: ${FRESHLY_CONFIG.CURRENCY_SYMBOL}${totals.cleaningTotal}`,
    `Marination: ${FRESHLY_CONFIG.CURRENCY_SYMBOL}${totals.marinationTotal}`,
    `Delivery Charge: ${FRESHLY_CONFIG.CURRENCY_SYMBOL}${totals.deliveryCharge}`,
    `Total: ${FRESHLY_CONFIG.CURRENCY_SYMBOL}${totals.total}`,
    `Payment: ${payload.paymentOption}`,
    "",
    `Address: ${payload.address}`,
    "------------------------------",
    "END OF FRESHLY ORDER"
  ].join("\n");
}

async function placeOrder() {
  if (!CART.length) {
    alert("Please add at least one product to cart.");
    return;
  }
  if (!$("name")?.value || !$("phone")?.value || !$("pincode")?.value) {
    alert("Please enter name, phone number and pin code.");
    return;
  }

  const orderId = "FR" + Date.now();
  const payload = buildOrderPayload(orderId);
  await submitOrderToBackend(payload);

  const number = FRESHLY_CONFIG.WHATSAPP_NUMBERS[0] || "918921696649";
  const message = encodeURIComponent(buildWhatsAppMessage(payload));
  window.open(`https://wa.me/${number}?text=${message}`, "_blank");
}

async function postSimpleLead(data) {
  if (!isConfigured(FRESHLY_CONFIG.BACKEND_WEB_APP_URL)) {
    alert("Please add Apps Script Web App URL in assets/app.js.");
    return;
  }
  await fetch(FRESHLY_CONFIG.BACKEND_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data)
  });
  alert("Submitted successfully.");
}

function submitPartner() {
  postSimpleLead({
    type: "partner",
    name: $("partnerName")?.value || "",
    phone: $("partnerPhone")?.value || "",
    city: $("partnerCity")?.value || "",
    pincode: $("partnerPincode")?.value || "",
    area: $("partnerArea")?.value || "",
    vehicle: $("partnerVehicle")?.value || "",
    experience: $("partnerExperience")?.value || ""
  });
}

function submitAreaRequest() {
  postSimpleLead({
    type: "area",
    name: $("areaName")?.value || "",
    phone: $("areaPhone")?.value || "",
    city: $("areaCity")?.value || "",
    pincode: $("areaPincode")?.value || "",
    area: $("areaLocation")?.value || "",
    requirement: $("areaRequirement")?.value || ""
  });
}

function submitReferral() {
  postSimpleLead({
    type: "referral",
    customerName: $("refCustomerName")?.value || "",
    customerPhone: $("refCustomerPhone")?.value || "",
    friendName: $("refFriendName")?.value || "",
    friendPhone: $("refFriendPhone")?.value || "",
    friendCity: $("refFriendCity")?.value || "",
    friendPincode: $("refFriendPincode")?.value || "",
    friendArea: $("refFriendArea")?.value || ""
  });
}

function submitPaymentVerification() {
  postSimpleLead({
    type: "payment",
    orderId: $("payOrderId")?.value || "",
    paidAmount: $("payAmount")?.value || "",
    upiRefNo: $("payRef")?.value || "",
    verifiedBy: $("payVerifiedBy")?.value || ""
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  if (!$("fishContainer")) {
    console.error("Freshly error: Missing product container with id='fishContainer' in index.html");
    return;
  }

  toggleQR();
  await loadHubData();
  await loadFish();
  updateCart();
  $("pincode")?.addEventListener("input", updateHubOptions);
  $("hubSelect")?.addEventListener("change", () => { updateDeliverySlots(); updateCart(); });
  $("fulfillment")?.addEventListener("change", () => { updateDeliverySlots(); updateCart(); });
});