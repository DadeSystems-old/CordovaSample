// 
// Set the following to your provided Api Key and Api URL.
// 
const API_KEY = '{{DADE_API_KEY}}';
const API_URL = '{{DADE_API_URL}}';
const dadeMobile = require('@dadesystems/dademobile')(API_KEY, API_URL);

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
    captureCheckImage(dadeMobile.ImageTypes.CHECK_FRONT);
  },
  handleCheckRearClick: () => {
    captureCheckImage(dadeMobile.ImageTypes.CHECK_REAR);
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

submitPayment = () => {
  showLoading();
  clearErrors();

  dadeMobile.confirmPayment(state.payment)
  .then((payment) => {
    showSuccess(payment);
  })
  .catch((error) => {
    const { validationErrors } = error;
    validationErrors ? 
      showValidationErrors(validationErrors) : showError(error);
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
  alert(error);
}

showValidationErrors = (errors) => {
  const errorItems = errors.map((error) => {
    return `<li>${error.error_message}</li>`;
  });

  $('#errors')
    .html(`<ul class='list-unstyled'>${errorItems.join('')}</ul>`)
    .show();
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