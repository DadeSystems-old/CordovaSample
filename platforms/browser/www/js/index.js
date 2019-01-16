/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    document.addEventListener(
      'deviceready', 
      this.onDeviceReady.bind(this), 
      false
    );
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.bindPayButton();
  },

  bindPayButton: function() {
    document
      .getElementById('pay-by-check')
      .addEventListener("click", this.payButtonClicked);
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
      if (event.url.startsWith(SUCCESS_URL)) handleSuccess(event);
      else if (event.url.startsWith(CANCEL_URL)) handleCancel(event);
    });

    function handleSuccess(event) {
      ref.close();
      setTimeout(function(){
        alert('Payment Success!');
      }, 100);
    }

    function handleCancel(event) {
      ref.close();
      setTimeout(function(){
        alert('Payment Canceled!');
      }, 100);
    }
  },
};

app.initialize();