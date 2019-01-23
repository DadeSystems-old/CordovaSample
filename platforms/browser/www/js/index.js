const app = {
  
  initialize: function() {
    document
      .getElementById('pay-by-check')
      .addEventListener('click', this.payButtonClicked);
  },

  payButtonClicked: function(event) {
    event.preventDefault();

    const SERVICE_URL = 'http://192.168.1.122:3000/mobile_payments/new';
    const SUCCESS_URL = 'https://www.company.com/success.html';
    const CANCEL_URL = 'https://www.company.com/cancel.html';
    
    const params = {
      api_key: '2b4d57bb43bf6bfe7a600ecb1e7cf1a5',
      external_user_id: '123',
      amount: 50,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL
    };

    const paramString = Object.keys(params).map(function(key) {
      return key + '=' + params[key];
    }).join('&');

    const ref = cordova.InAppBrowser.open(
      `${SERVICE_URL}?${paramString}`, 
      '_blank', 
      'location=no'
    );

    ref.addEventListener('loadstart', function(event){
      if (!event.url.startsWith(SERVICE_URL)) ref.close();
      if (event.url.startsWith(SUCCESS_URL)) handleSuccess(event);
      else if (event.url.startsWith(CANCEL_URL)) handleCancel(event);
    });

    function handleSuccess(event) {
      setTimeout(function(){
        alert('Payment Success!');
      }, 100);
    }

    function handleCancel(event) {
      setTimeout(function(){
        alert('Payment Canceled!');
      }, 100);
    }
  },
};

app.initialize();