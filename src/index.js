import './styles.css';
import { get, set } from './cache';

const defaultSettings = {
  submitOnEnter: false,
  inputPosition: 'left',
  monospaceInput: true,
}

function initializeSettings() {
  Object.keys(defaultSettings).forEach(key => {
    const settingValue = get(key, defaultSettings[key]);
    set(key, settingValue);
  });
}


(function () {
  'use strict';
  
  initializeSettings();

  const injectSettings = () => {
    if (document.querySelector('#quick-settings')) {
      return;
    }

    const settingsHtml = `
            <div id="quick-settings" class="p-6">
                <h2 class="text-lg font-semibold mb-2">Quick Settings</h2>
                <button id="toggleMonospace" class="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150">Toggle Monospace</button>
                <button id="inputLeft" class="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-150 ml-2">Input Left</button>
                <button id="inputRight" class="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-150 ml-2">Input Right</button>
                <button id="inputBottom" class="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-150 ml-2">Input Bottom</button>
                <button id="submitOnEnter" class="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-700 transition duration-150 ml-2">Submit On Enter Disabled</button>
            </div>
        `;


    const targetForm = document.querySelector('div[role="presentation"] > div:nth-child(2) > form');
    targetForm.insertAdjacentHTML('afterend', settingsHtml);

    // Attach event listeners to buttons
    if (get('monospaceInput')) {
      document.documentElement.classList.add('monospaced-message-form');
    }
    document.querySelector('#toggleMonospace').addEventListener('click', () => {
      set('monospaceInput', !get('monospaceInput'));
      if (get('monospaceInput')) {
        document.documentElement.classList.add('monospaced-message-form');
      } else {
        document.documentElement.classList.remove('monospaced-message-form');
      }
    });

    const setInputPosition = (position) => {
      // Get all classes from the <html> element
      const classes = document.documentElement.classList;

      // Create an array from the classes iterable, then filter and remove classes that start with 'input-'
      Array.from(classes).forEach(className => {
        if (className.startsWith('input-')) {
          document.documentElement.classList.remove(className);
        }
      });

      document.documentElement.classList.toggle(`input-${position}`);
      set('inputPosition', position);
    };

    setInputPosition(get('inputPosition'));

    document.querySelector('#inputLeft').addEventListener('click', () => {
      setInputPosition('left');
    });

    document.querySelector('#inputRight').addEventListener('click', () => {
      setInputPosition('right');
    });

    document.querySelector('#inputBottom').addEventListener('click', () => {
      setInputPosition('bottom');
    });

    document.querySelector('#submitOnEnter').addEventListener('click', () => {
      set('submitOnEnter', !get('submitOnEnter'));

      if (get('submitOnEnter')) {
        document.querySelector('#submitOnEnter').textContent = "Submit On Enter Enabled"; 
      } else {
        document.querySelector('#submitOnEnter').textContent = "Submit On Enter Disabled"; 
      }
    });
  };

  const run = () => {
    injectSettings();
  }

  setInterval(run, 3000);
  run();

  setInterval(() => {
    const elem = document.querySelector('#prompt-textarea');
    const key = Object.keys(elem).find(key => key.startsWith('__reactProps$'));

    if (get('submitOnEnter')) {
      return;
    }

    if (elem[key].onKeyDown.name === 'injectedFunction') {
      return;
    }

    const reactOnKeyDown = elem[key].onKeyDown;
    
    elem[key].onKeyDown = function injectedFunction(event) {
      if (event.nativeEvent.key === 'Enter') {
        if (event.nativeEvent.shiftKey) {
          console.log('Shift + Enter');
        } else if (event.nativeEvent.ctrlKey) {
          console.log('Ctrl + Enter');
        } else {
          console.log('Enter');
          return; // ignore this key press
        }
      }
      reactOnKeyDown(event);
    };
  }, 50);

  // Submit form 
  //document.querySelector('[data-testid="send-button"]').click();

  // Update form and submit
  /*const elem = document.querySelector('#prompt-textarea');

  if (elem) {
      elem.value = 'What is your name?';
      document.querySelector('[data-testid="send-button"]').click();
  }*/
})();