# ChatGPTPlus 

Enhance your ChatGPT interface with ChatGPTPlus . This project is dedicated to improving the graphical user interface of ChatGPT using plain CSS and JavaScript, ensuring that the modifications do not interfere with the normal functionality of ChatGPT.

## Features
- **UI Enhancements**: Improve readability and usability without altering the core functionality of ChatGPT.
- **Custom CSS**: Custom styles to enhance the visual appeal of ChatGPT.
- **Easy Integration**: Easily integrate with ChatGPT via Tampermonkey.

## Usage

### Installation
1. Install [Tampermonkey](http://tampermonkey.net/) on your browser.
2. Create a new Tampermonkey script with the following code snippet:

```javascript
// ==UserScript==
// @name         ChatGPTPlus 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance the ChatGPT interface
// @author       https://github.com/minovap/ChatGPTPlus
// @match        *://chat.openai.com/*
// @resource     REMOTE_JS https://minovap.github.io/ChatGPTPlus/bundle.js
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';

    // Fetch the script text using GM_getResourceText
    const myJs = GM_getResourceText("REMOTE_JS");

    // Create a new script element
    const scriptElement = document.createElement('script');
    scriptElement.textContent = myJs; // Set the script content to myJs

    // Append the script element to the document head (or body)
    document.head.appendChild(scriptElement); // You can also append to document.body if needed

})();
```

### Development Setup

To set up this project for development, follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the project directory and run the following command to install the dependencies:
   ```bash
   npm install
   ```

3. To start the development server, run:
   ```bash
   npm run start
   ```
   This will serve your project at http://localhost:8080, and you should set the @resource URL in your Tampermonkey script to this address for local development.


### Tampermonkey Settings for Development

When working in development mode, adjust your Tampermonkey script to load the local version of your enhancements:

1. Change the @resource URL in your Tampermonkey script to point to your local server:
```
@resource REMOTE_JS http://localhost:8080/bundle.js
```
2. In the Tampermonkey settings under Externals, set the Update Interval to “Always” to ensure Tampermonkey fetches the most recent version of your local script automatically.
