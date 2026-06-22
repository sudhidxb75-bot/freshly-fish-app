const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyWm9H1A5IV_cFYOF2OdUkMXgbHqg1yfAdTgf0dIuEmkJ4nsOKH-NGU5mWZpwTM_9yFSA/exec";

function getValues(form){
  const data = new URLSearchParams();
  const formData = new FormData(form);

  for(const [key,value] of formData.entries()){
    if(data.has(key)){
      data.set(key, data.get(key) + ', ' + value);
    }else{
      data.append(key, value);
    }
  }

  data.append('pageUrl', window.location.href);
  data.append('submittedAt', new Date().toISOString());
  return data;
}

async function submitFreshlyForm(event){
  event.preventDefault();

  const form = event.target;
  const status = form.querySelector('.form-status');
  const formType = form.dataset.formType || 'lead';

  const data = getValues(form);
  data.append('type', formType);
  data.append('leadType', formType);

  if(status) status.textContent = 'Submitting...';

  try{
    await fetch(BACKEND_URL, {
      method:'POST',
      mode:'no-cors',
      body:data
    });

    if(status) status.textContent = 'Submitted successfully. Freshly team will contact you soon.';
    form.reset();
  }catch(e){
    if(status) status.textContent = 'Submission failed. Please try again or contact us on WhatsApp.';
  }
}

document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.freshly-form').forEach(form => {
    form.addEventListener('submit', submitFreshlyForm);
  });

  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
});
