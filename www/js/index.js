const DADE_API_KEY = '2b4d57bb43bf6bfe7a600ecb1e7cf1a5';
const dadeMobile = DadeMobile(DADE_API_KEY);
const state = {};

function stagePayment() {
  showLoading();

  dadeMobile.stagePayment({ 
    external_user_id: '1234',
    check_amount: 5.00
  })
  .then((payment) => {
    state.payment = payment;
    showPaymentScreen();
  })
  .catch((error) => {
    showError(error);
  })
  .finally(function() {
    hideLoading();
  });
}

function setPaymentAmount(amount) {
  showLoading();

  dadeMobile.setAmount(state.payment, amount)
  .then((payment) => {
    state.payment = payment;
  })
  .catch((error) => {
    showError(error);
  })
  .finally(function() {
    hideLoading();
  });
}

function uploadCheckImage(imageType, encodedImage) {
  showLoading();

  dadeMobile.uploadImage(state.payment, imageType, encodedImage)
  .then((payment) => {
    state.payment = payment;
    setCaptureIcon(imageType);
  })
  .catch((error) => {
    showError(error);
  })
  .finally(function() {
    hideLoading();
  });
}

function submitPayment(event) {
  event.preventDefault();
  showLoading();
  clearErrors();

  dadeMobile.confirmPayment(state.payment)
  .then((confirmation) => {
    showSuccess(confirmation);
  })
  .catch((error) => {
    const { validationErrors } = error;
    if (validationErrors) showValidationErrors(validationErrors);
    else showError(error);
  })
  .finally(function() {
    hideLoading();
  });
}

function cancelPayment() {
  showLoading();
  clearErrors();

  dadeMobile.cancelPayment(state.payment)
  .then(() => {
    showHomeScreen();
  })
  .catch((error) => {
    showError(error);
  })
  .finally(function() {
    hideLoading();
  });
}

function handleAmountChange(event) {
  const amount = event.target.value;
  setPaymentAmount(amount);
}

function captureCheckImage(imageType) {
  clearErrors();
  captureImage()
  .then((encodedImage) => {
    uploadCheckImage(imageType, encodedImage);
  })
  .catch((error) => {
    showError(error);
  });
}

function captureImage() {
  return new Promise(function(resolve, reject) {
    navigator.camera.getPicture(resolve, reject, { 
      quality: 25,
      destinationType: Camera.DestinationType.DATA_URL
    });
  });
}

// 
// UI
// 

function showLoading() {
  $('#loading').show();
}

function hideLoading() {
  $('#loading').hide();
}

function showHomeScreen() {
  $('#payment-screen').hide();
  $('#home-screen').show();
}

function showPaymentScreen() {
  resetCaptureIcons();
  $('#home-screen').hide();
  $('#results').hide();
  $('#payment-screen').show();
}

function clearErrors() {
  $('#errors').html('').hide();
}

function showSuccess(data) {
  $('#home-screen').show();
  $('#payment-screen').hide();
  $('#results').show();
  $('#results .title').text('Success!');
  $('#results .data').text(JSON.stringify(data, null, 2));
}

function showError(error) {
  alert(error);
}

function showValidationErrors(errors) {
  const errorItems = errors.map((error) => {
    return `<li>${error.error_message}</li>`;
  });

  $('#errors')
    .html(`<ul class='list-unstyled'>${errorItems.join('')}</ul>`)
    .show();
}

function setCaptureIcon(imageType) {
  $(`#${imageType}-icon`)
    .addClass('fa-check')
    .removeClass('fa-camera');
}

function resetCaptureIcons() {
  ['checkfront', 'checkrear'].forEach((imageType) => {
    $(`#${imageType}-icon`)
      .addClass('fa-camera')
      .removeClass('fa-check');
  });
}