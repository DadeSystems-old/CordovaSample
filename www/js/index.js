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

    const ref = cordova.InAppBrowser.open(
      `${SERVICE_URL}?success_url="${SUCCESS_URL}"&cancel_url="${CANCEL_URL}"`, 
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