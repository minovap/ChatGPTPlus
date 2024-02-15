import './styles.css';
import './styles/input-position.css';
import './styles/input-style.css';
import './styles/converation.css';
import SettingsForm from './SettingsForm/SettingsForm';
import React from 'react';
import { createRoot } from 'react-dom/client';
import PromptInput from './PromptInput/PromptInput';
import 'ace-builds/src-noconflict/theme-monokai.js'

(function () {
  'use strict';
  const exists = (selector) => !!document.querySelector(selector);

  const addInjections = () => {
    if (!exists('#id')) {
      const root = document.querySelector('#__next > div');
      root.id = 'root';
    }

    if (!exists('#sidebar-container') && exists('#root')) {
      const root = document.querySelector('#root');
      const sidebarContainer = root.children[0];
      sidebarContainer.id = 'sidebar-container';
    }

    if (!exists('#main-container') && exists('#root')) {
      const root = document.querySelector('#root');
      const mainContainer = root.children[1].querySelector('[role="presentation"]');
      mainContainer.id = 'main-content';
    }

    if (!exists('#sidebar-content') && exists('#sidebar-container')) {
      const sidebarContainer = document.querySelector('#sidebar-container');
      const sidebarNav = sidebarContainer.querySelector('nav');
      sidebarNav.id = 'sidebar-content';
    }

    if (!exists('#input-panel') && exists('#main-content')) {
      const mainContent = document.querySelector('#main-content');
      const inputPanel = mainContent.children[1];
      inputPanel.id = 'input-panel';
    }
    
    if (!exists('#conversation-panel') && exists('#main-content')) {
        const mainContent = document.querySelector('#main-content');
        const conversationPanel = mainContent.children[0];
        conversationPanel.id = 'conversation-panel';
    }

    if (!exists('#sidebar-handle') && exists('#root')) {
        const sidebarHandle = document.querySelector('#root main > div');
        sidebarHandle.id = 'sidebar-handle';
    }

    if (!exists('#settings-form-root') && exists('#input-panel')) {
        const inputForm = document.querySelector('#input-panel form');
        const div = document.createElement('div');
        div.id = 'settings-form-root';
        inputForm.insertAdjacentElement('afterend', div);
        const root = createRoot(document.getElementById(div.id)); // Create a root.
        root.render(<SettingsForm />); 
    }

    if (!exists('#file-attach-button') && exists('#prompt-textarea')) {
      // Find the #prompt-textarea element
      const promptTextarea = document.querySelector('#prompt-textarea');

      function findSiblingWithAriaLabel(startElement, ariaLabel) {
        let parent = startElement.parentNode;

        for (let i = 0; i < parent.childNodes.length; i++) {
          let node = parent.childNodes[i];

          if (node.nodeType === Node.ELEMENT_NODE) {
            let target = node.querySelector(`[aria-label="${ariaLabel}"]`);

            if (target) {
              return node;
            }
          }
        }

        return null;
      }

      const siblingWithAriaLabel = findSiblingWithAriaLabel(promptTextarea, "Attach files");

      if (siblingWithAriaLabel) {
        siblingWithAriaLabel.id = 'file-attach-button';
      } else {
        console.log('No sibling contains an element with the specified aria-label.');
      }
    }


    if (!exists('#settings-button') && exists('#prompt-textarea')) {
      const buttonHTML = `
        <div id="settings-button" onclick="toggleSettingsVisibility()" style="left: 2.5rem; right: auto" class="cursor-pointer absolute bottom-1.5 p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:bottom-3 md:right-3">
          <span data-state="closed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: black;">
              <path d="M11.6439 3C10.9352 3 10.2794 3.37508 9.92002 3.98596L9.49644 4.70605C8.96184 5.61487 7.98938 6.17632 6.93501 6.18489L6.09967 6.19168C5.39096 6.19744 4.73823 6.57783 4.38386 7.19161L4.02776 7.80841C3.67339 8.42219 3.67032 9.17767 4.01969 9.7943L4.43151 10.5212C4.95127 11.4386 4.95127 12.5615 4.43151 13.4788L4.01969 14.2057C3.67032 14.8224 3.67339 15.5778 4.02776 16.1916L4.38386 16.8084C4.73823 17.4222 5.39096 17.8026 6.09966 17.8083L6.93502 17.8151C7.98939 17.8237 8.96185 18.3851 9.49645 19.294L9.92002 20.014C10.2794 20.6249 10.9352 21 11.6439 21H12.3561C13.0648 21 13.7206 20.6249 14.08 20.014L14.5035 19.294C15.0381 18.3851 16.0106 17.8237 17.065 17.8151L17.9004 17.8083C18.6091 17.8026 19.2618 17.4222 19.6162 16.8084L19.9723 16.1916C20.3267 15.5778 20.3298 14.8224 19.9804 14.2057L19.5686 13.4788C19.0488 12.5615 19.0488 11.4386 19.5686 10.5212L19.9804 9.7943C20.3298 9.17767 20.3267 8.42219 19.9723 7.80841L19.6162 7.19161C19.2618 6.57783 18.6091 6.19744 17.9004 6.19168L17.065 6.18489C16.0106 6.17632 15.0382 5.61487 14.5036 4.70605L14.08 3.98596C13.7206 3.37508 13.0648 3 12.3561 3H11.6439Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path>
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="2"></circle>
              </svg>
            </span>
          </div>
        `;
      
      const targetForm = document.querySelector('#prompt-textarea');
      targetForm.insertAdjacentHTML('afterend', buttonHTML);
  
      const settingsButton = document.querySelector('#settings-button');
      settingsButton.onclick = function() {
        document.dispatchEvent(new CustomEvent('toggleSettings', {}));
      };

      const div = document.createElement('div');
      div.id = 'prompt-input-root';
      targetForm.insertAdjacentElement('afterend', div);
      const root = createRoot(document.getElementById(div.id)); // Create a root.
      root.render(<PromptInput />); 
    }


    if (!exists('#settings-button2') && exists('#prompt-textarea')) {
      const buttonHTML = `
        <div id="settings-button2" onclick="toggleSettingsVisibility()" style="left: 4.7rem; right: auto" class="cursor-pointer absolute bottom-1.5 p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:bottom-3 md:right-3">
          <span data-state="closed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: black;">
              <path d="M7.90451 6.92144C8.41341 6.45495 8.44779 5.66424 7.9813 5.15534C7.51481 4.64645 6.7241 4.61207 6.2152 5.07856L7.90451 6.92144ZM1.46194 11.1314L2.3066 12.0529L2.3066 12.0529L1.46194 11.1314ZM1.46194 11.8686L2.3066 10.9471L2.3066 10.9471L1.46194 11.8686ZM6.2152 17.9214C6.7241 18.3879 7.51481 18.3536 7.9813 17.8447C8.44779 17.3358 8.41341 16.545 7.90451 16.0786L6.2152 17.9214ZM6.2152 5.07856L0.617287 10.21L2.3066 12.0529L7.90451 6.92144L6.2152 5.07856ZM0.617287 12.79L6.2152 17.9214L7.90451 16.0786L2.3066 10.9471L0.617287 12.79ZM0.617287 10.21C-0.139356 10.9036 -0.139356 12.0964 0.617287 12.79L2.3066 10.9471C2.63087 11.2444 2.63087 11.7556 2.3066 12.0529L0.617287 10.21Z" fill="#000000"/>
              <path d="M16.0557 16.0786C15.5468 16.545 15.5125 17.3358 15.9789 17.8447C16.4454 18.3536 17.2361 18.3879 17.745 17.9214L16.0557 16.0786ZM22.4983 11.8686L21.6537 10.9471L21.6537 10.9471L22.4983 11.8686ZM22.4983 11.1314L21.6537 12.0529L21.6537 12.0529L22.4983 11.1314ZM17.745 5.07856C17.2361 4.61207 16.4454 4.64645 15.979 5.15534C15.5125 5.66424 15.5468 6.45495 16.0557 6.92144L17.745 5.07856ZM17.745 17.9214L23.343 12.79L21.6537 10.9471L16.0557 16.0786L17.745 17.9214ZM23.343 10.21L17.745 5.07856L16.0557 6.92144L21.6537 12.0529L23.343 10.21ZM23.343 12.79C24.0996 12.0964 24.0996 10.9036 23.343 10.21L21.6537 12.0529C21.3294 11.7556 21.3294 11.2444 21.6537 10.9471L23.343 12.79Z" fill="#000000"/>
              <path d="M15.2127 3.80317C15.3801 3.13343 14.9729 2.45476 14.3032 2.28732C13.6334 2.11989 12.9548 2.52709 12.7873 3.19683L15.2127 3.80317ZM8.78732 19.1968C8.61989 19.8666 9.02709 20.5452 9.69683 20.7127C10.3666 20.8801 11.0452 20.4729 11.2127 19.8032L8.78732 19.1968ZM12.7873 3.19683L8.78732 19.1968L11.2127 19.8032L15.2127 3.80317L12.7873 3.19683Z" fill="#000000"/>
            </svg>
          </span>
        </div>
        `;
      
      const targetForm = document.querySelector('#prompt-textarea');
      targetForm.insertAdjacentHTML('afterend', buttonHTML);
  
      const settingsButton = document.querySelector('#settings-button2');
      settingsButton.onclick = function() {
        document.dispatchEvent(new CustomEvent('wrapTextWithTags', {}));
      };
    }
  };
  setInterval(addInjections, 1000);
  addInjections();

  // Function to generate a random ID for an editor
  function generateRandomEditorId() {
    const randomNumber = Math.floor(Math.random() * 1000000000); // Generate a random number up to 9 digits
    return `editor${randomNumber}`;
  }

  setInterval(() => {
    // Query all elements with the specified data attribute and without the 'injected' class
    const elements = document.querySelectorAll('[data-message-author-role="user"]:not(.injected)');
  
    elements.forEach(element => {
      // Generate a random ID for the editor
      const editorId = generateRandomEditorId();
  
      // Find the last div within the element
      const divs = element.querySelectorAll('div');

      const lastDiv = divs[divs.length - 1]; // Select the last div
      if (lastDiv) {
        lastDiv.id = editorId;
        const content = lastDiv.textContent;
  
        // Adjust the style of the lastDiv to ensure it can host the Ace editor properly
        lastDiv.style.width = '100%';
        lastDiv.style.paddingTop = '10px'; // Example padding, adjust as needed
        lastDiv.style.paddingBottom = '10px'; // Example padding, adjust as needed
        lastDiv.className += ' border border-token-border-heavy rounded-md';
  
        // Estimate the height based on the content
        const lineHeight = 16; // Height in pixels per line of text
        const lines = 1 + content.split('\n').length || 1; // Adjusted to consider content properly
        const calculatedHeight = `${lines * lineHeight}px`;
        lastDiv.style.height = calculatedHeight;
  
        // Initialize Ace editor on this div
        const editor = ace.edit(editorId, {
          useWorker: false,
        });
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/javascript");
        editor.setValue(content);
        editor.setReadOnly(true);
        editor.clearSelection(); // Ensure text is not selected
        editor.setHighlightActiveLine(false); // Adjust based on your needs
        editor.setPrintMarginColumn(false); // Hide the print margin
        editor.renderer.$cursorLayer.element.style.display = "none"; // Hide the cursor
  
        // After setting the value, adjust the editor's size to fit the content
        editor.container.style.height = calculatedHeight;
        editor.container.style.width = '100%'; // Ensure the editor fills the container width
        editor.resize(true); // Adjust the editor to the size of its container
  
        // Mark the element as processed
        element.classList.add('injected');
      }
    });
  }, 100);
   

})();