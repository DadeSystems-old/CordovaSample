// 
// Set the following to your provided Api Key and Api URL.
// 
const API_KEY = '{{DADE_API_KEY}}';
const API_URL = '{{DADE_API_URL}}';
const { DadeMobile } = require('@dadesystems/dademobile');
const accounting = require('accounting-js');
const dadeMobile = new DadeMobile(API_KEY, API_URL);

const state = {};

const app = {
  handlePaymentClick: () => {
    stagePayment();
  },
  handleAmountChange: (event) => {
    const amount = event.target.value;
    setAmount(amount);
  },
  handleCheckFrontClick: () => {
    captureCheckImage('checkfront');
  },
  handleCheckRearClick: () => {
    captureCheckImage('checkrear');
  },
  handleSubmitClick: (event) => {
    event.preventDefault();
    submitPayment();
  },
  handleCancelClick: () => {
    cancelPayment();
  }
};

stagePayment = () => {
  showLoading();

  dadeMobile.stagePayment({ 
    external_user_id: '123',
    external_reference: '321',
    amount: 5.00
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

setAmount = (amount) => {
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

uploadCheckImage = (imageType, encodedImage) => {
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

submitPayment = (params) => {
  showLoading();
  clearErrors();

  dadeMobile.confirmPayment(state.payment, params)
  .then((payment) => {
    showSuccess(payment);
  })
  .catch((error) => {
    const { errors } = error;
    errors ? showValidationErrors(errors) : showError(error);
  })
  .finally(function() {
    hideLoading();
  });
}

cancelPayment = () => {
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

captureCheckImage = (imageType) => {
  clearErrors();
  captureImage()
  .then((encodedImage) => {
    uploadCheckImage(imageType, encodedImage);
  })
  .catch((error) => {
    showError(error);
  });
}

captureImage = () => {
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

showLoading = () => {
  $('#loading').show();
}

hideLoading = () => {
  $('#loading').hide();
}

showHomeScreen = () => {
  $('#payment-screen').hide();
  $('#home-screen').show();
}

showPaymentScreen = () => {
  resetCaptureIcons();
  $('#home-screen').hide();
  $('#results').hide();
  $('#payment-screen').show();
}

clearErrors = () => {
  $('#errors').html('').hide();
}

showSuccess = (data) => {
  $('#home-screen').show();
  $('#payment-screen').hide();
  $('#results').show();
  $('#results .title').text('Success!');
  $('#results .data').text(JSON.stringify(data, null, 2));
}

showError = (error) => {
  alert(JSON.stringify(error));
}

showValidationErrors = (errors) => {
  if (errors.length == 1 && errors[0].error_code == '2006') {
    handleAmountMismatchError(errors[0]);
    return;
  }
  
  const errorItems = errors.map((error) => {
    return `<li>${error.error_message}</li>`;
  });

  $('#errors')
    .html(`<ul class='list-unstyled'>${errorItems.join('')}</ul>`)
    .show();
}

handleAmountMismatchError = (error) => {
  const readAmount = accounting.formatMoney(error.error_data.read_amount);

  navigator.notification.confirm(
    'The amount read from the check does not match the provided amount.\n\n' +
    'Amount read: ' + readAmount + '\n\n' +
    'Please confirm that the provided amount is correct in order to ignore mismatch and continue.',
     confirmAmount,
    'Check Amount Mismatch',
    ['Confirm', 'Cancel']
  );
}

confirmAmount = (buttonIndex) => {
  if (buttonIndex == 1) {
    submitPayment({
      ignore_check_amount_mismatch: true
    });
  }
}

setCaptureIcon = (imageType) => {
  $(`#${imageType}-icon`)
    .addClass('fa-check')
    .removeClass('fa-camera');
}

resetCaptureIcons = () => {
  ['checkfront', 'checkrear'].forEach((imageType) => {
    $(`#${imageType}-icon`)
      .addClass('fa-camera')
      .removeClass('fa-check');
  });
}

module.exports = app;