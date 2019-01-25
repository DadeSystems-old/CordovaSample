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
  $('#results').hide();
  $('#results .data').text('');
}

// 
// Dade Events
// 

// Listen to messages sent from the iFrame
window.addEventListener("message", receiveMessage, false);

function receiveMessage(event){
  if (!SERVICE_URL.startsWith(event.origin)) return;

  const { eventType, eventData } = event.data;

  switch(eventType) {
    case 'IMAGE_REQUEST':
      handleImageRequest(event, eventData);
      break;
    case 'PAYMENT_SUCCESS':
      handlePaymentSuccess(eventData)
      break;
    case 'PAYMENT_CANCELED':
      handlePaymentCanceled();
      break;
  }
}

function handleImageRequest(event, eventData) {
  const imageType = eventData.imageType; 

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

function handlePaymentSuccess(eventData){
  $('#home-screen').show();
  $('#payment-iframe').hide();
  $('#results').show();
  $('#results .title').text('Success!');
  $('#results .data').text(JSON.stringify(eventData, null, 2));
}

function handlePaymentCanceled() {
  $('#home-screen').show();
  $('#payment-iframe').hide();
  $('#results').show();
  $('#results .title').text('Canceled!');
}

// 
// Util functions
// 
function paramsToString(params){
  return Object.keys(params).map(function(key) {
    return key + '=' + params[key];
  }).join('&');
}