window.addEventListener("message", receiveMessage, false);

const SERVICE_URL = 'http://192.168.1.122:3000/mobile_payments/new';

function payNow() {  
  const params = {
    api_key: '2b4d57bb43bf6bfe7a600ecb1e7cf1a5',
    external_user_id: '123',
    amount: 555.55,
    parent_capture_enabled: true
  };

  $('#payment-iframe')
    .attr('src', `${SERVICE_URL}?${paramsToString(params)}`)
    .show();
  
  $('#home-screen').hide();
}

// 
// Dade Events
// 
function receiveMessage(event){
  if (!SERVICE_URL.startsWith(event.origin)) return;
  if (event.data.imageRequested) handleImageRequest(event);
  else if (event.data.paymentSuccess) handlePaymentSuccess();
  else if (event.data.paymentCanceled) handlePaymentCanceled();
}

function handleImageRequest(event) {
  const imageType = event.data.imageRequested; 

  function onSuccess(imageData) {
    const imageDataUrl = "data:image/jpeg;base64," + imageData;
    event.source.postMessage({
      imageType,
      imageDataUrl
    }, '*');
  }
  
  function onFail(message) {
    alert('Failed because: ' + message);
  }

  navigator.camera.getPicture(onSuccess, onFail, { 
    quality: 25,
    destinationType: Camera.DestinationType.DATA_URL
  });
}

function handlePaymentSuccess(){
  $('#home-screen').show();
  $('#payment-iframe').hide();
  showAlert('Payment was successful!');
}

function handlePaymentCanceled() {
  $('#home-screen').show();
  $('#payment-iframe').hide();
  showAlert('Payment was canceled!');
}

// 
// Util functions
// 
function paramsToString(params){
  return Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
}

function showAlert(message){
  setTimeout(function(){ 
    alert(message);
  }, 100);
}