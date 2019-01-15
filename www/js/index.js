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
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        this.bindPayButton();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    bindPayButton: function() {
      document
        .getElementById('pay-by-check')
        .addEventListener("click", this.payButtonClicked);
    },

    payButtonClicked: function(event) {
      event.preventDefault();

      const ref = cordova.InAppBrowser.open(
        'http://localhost:3000/mobile_payments/new?success_url="http://company.com/success.html"&cancel_url="http://company.com/cancel.html"', 
        // 'https://cordova.apache.org', 
        '_blank', 
        'location=yes'
      );

      console.log(ref);

      ref.addEventListener('loadstart', function(data){
        console.log('load start');
      });

      ref.addEventListener('loadstop', function(data){
        console.log('load stop');
        console.log(data);
      });

      ref.addEventListener('loaderror', function(data){
        console.log('loade rror');
      });
    }
};

app.initialize();