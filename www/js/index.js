window.addEventListener("message", receiveMessage, false);

function payNow() {
  const SERVICE_URL = 'http://192.168.1.122:3000/mobile_payments/new';
  
  const params = {
    api_key: '2b4d57bb43bf6bfe7a600ecb1e7cf1a5',
    external_user_id: '123',
    amount: 555.50,
    // parent_capture_enabled: true
  };

  $('#payment-iframe')
    .attr('src', `${SERVICE_URL}?${paramsToString(params)}`)
    .show();
  
  $('#home-screen').hide();
}

function receiveMessage(event){
  if (event.origin !== "http://192.168.1.122:3000") return;
  if (event.data.imageRequested) handleImageRequest(event.data.imageRequested);
  else if (event.data.paymentSuccess) handlePaymentSuccess();
  else if (event.data.paymentCanceled) handlePaymentCanceled();
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

function showAlert(message){
  setTimeout(function(){ 
    alert(message);
  }, 100);
}

function handleImageRequest(imageType) {
  const imageDataUrl = `data:image/png,${imageType}_base64_placeholder`;
  event.source.postMessage({
    imageType,
    imageDataUrl
  }, '*');
}

function paramsToString(params){
  return Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
}