import './styles.css';
import './styles/input-position.css';
import './styles/input-style.css';
import './styles/converation.css';
import SettingsForm from './SettingsForm/SettingsForm';
import React from 'react';
import { createRoot } from 'react-dom/client';


(function () {
  'use strict';
  
  const injectSettingsForm = () => {
    if (document.querySelector('#settings-form-root')) {
      return;
    }

    const targetForm = document.querySelector('div[role="presentation"] > div:nth-child(2) > form');

    const div = document.createElement('div');
    div.id = 'settings-form-root';
    targetForm.insertAdjacentElement('afterend', div);
    const root = createRoot(document.getElementById(div.id)); // Create a root.
    root.render(<SettingsForm />); 
  };

  injectSettingsForm();

  // Submit form 
  //document.querySelector('[data-testid="send-button"]').click();

  // Update form and submit
  /*const elem = document.querySelector('#prompt-textarea');

  if (elem) {
      elem.value = 'What is your name?';
      document.querySelector('[data-testid="send-button"]').click();
  }*/
})();