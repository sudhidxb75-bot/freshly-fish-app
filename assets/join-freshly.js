/*
  Freshly Join Page Form Handler
  1. Deploy Freshly_Apps_Script.gs as a Google Apps Script Web App.
  2. Paste the Web App URL below.
  3. Upload this file with join-freshly.html and join-freshly.css to GitHub Pages.
*/

const FRESHLY_SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

document.getElementById("year").textContent = new Date().getFullYear();

function getFormData(form) {
  const data = { formType: form.dataset.formType };
  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    if (key === "categories") continue;
    data[key] = String(value).trim();
  }

  const categories = Array.from(form.querySelectorAll('input[name="categories"]:checked')).map(input => input.value);
  if (categories.length) data.categories = categories.join(", ");

  data.pageUrl = window.location.href;
  data.submittedAtClient = new Date().toISOString();
  return data;
}

function setStatus(form, message, type) {
  const status = form.querySelector(".form-status");
  status.textContent = message;
  status.className = `form-status ${type || ""}`;
}

async function submitFreshlyForm(form) {
  if (!FRESHLY_SCRIPT_URL || FRESHLY_SCRIPT_URL.includes("PASTE_YOUR")) {
    setStatus(form, "Please add your Apps Script Web App URL in assets/join-freshly.js.", "error");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const payload = getFormData(form);

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";
  setStatus(form, "", "");

  try {
    const response = await fetch(FRESHLY_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const resultText = await response.text();
    let result = {};
    try { result = JSON.parse(resultText); } catch (error) { result = { ok: response.ok }; }

    if (!response.ok || result.ok === false) {
      throw new Error(result.message || "Submission failed");
    }

    form.reset();
    setStatus(form, "Submitted successfully. Freshly will contact you soon.", "success");
  } catch (error) {
    console.error(error);
    setStatus(form, "Could not submit now. Please check the Apps Script URL and deployment permission.", "error");
  } finally {
    submitButton.disabled = false;
    if (form.dataset.formType === "customer") submitButton.textContent = "Submit Customer Registration";
    if (form.dataset.formType === "hubPartner") submitButton.textContent = "Submit Hub Partner Application";
    if (form.dataset.formType === "referral") submitButton.textContent = "Submit Referral";
  }
}

document.querySelectorAll(".freshly-form").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    submitFreshlyForm(form);
  });
});
