# Sample App
Apache Cordova sample app demonstrating the use of [DadeMobile.js](https://www.npmjs.com/package/@dadesystems/dademobile)

## Installation
Install Cordova command-line unless already installed:

```bash
npm install -g cordova
```

Install packages:

```bash
npm install
```

## API Credentials
Before running the app, you must edit `src/app.js` and set your provided Api Key and Api URL.

## Run the app
```
cordova run <platform name>
```

This sample app builds `src/app.js` to `www/js/index.js` using the Cordova `before_prepare` hook. This happens automatically before running the app.

## Screenshot
<img width="300px" src="https://user-images.githubusercontent.com/981517/52605391-ad2f8980-2e3c-11e9-887b-3c03580f41a5.jpg">
