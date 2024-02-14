import React, { useState, useEffect } from 'react';
import { setSettingsInLocalStorage, getSettingsFromLocalStorage } from './settings';
import Checkbox from './Form/Checkbox';
import Dropdown from './Form/Dropdown';

const defaultSettings = {
  submitOnEnter: false,
  inputPosition: 'left',
  monospaceInput: true,
  monospaceConversation: true,
};

const overrideOnKeyDown = () => {
  const elem = document.querySelector('#prompt-textarea');
  if (!elem) {
    console.warn('Element #prompt-textarea not found.');
    return;
  }

  const key = Object.keys(elem).find(key => key.startsWith('__reactProps$'));
  if (!key || !elem[key] || typeof elem[key].onKeyDown !== 'function') {
    console.warn('React props or onKeyDown handler not found on element.');
    return;
  }

  if (elem[key].onKeyDown.name === 'injectedFunction') {
    return; // Avoid re-injecting if it's already been injected
  }

  const originalOnKeyDown = elem[key].onKeyDown;
  
  elem[key].onKeyDown = function injectedFunction(event) {
    if (event.nativeEvent.key === 'Enter') {
      if (!event.nativeEvent.shiftKey && !event.nativeEvent.ctrlKey) {
        return; // User pressed enter. Ovveride submit by exiting before passing the event to the input
      }
    }
    originalOnKeyDown(event);
  };
};

function SettingsForm() {
  const [settings, setSettings] = useState(() => {
    const storedSettings = getSettingsFromLocalStorage();
    // Merge stored settings with default settings to include any new keys
    return { ...defaultSettings, ...storedSettings };
  });

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Define the event listener function
    const toggleVisibility = () => {
      setVisible((prevVisible) => !prevVisible);
    };

    // Attach the event listener to the document
    document.addEventListener('toggleSettings', toggleVisibility);

    // Return a cleanup function that removes the event listener
    return () => {
      document.removeEventListener('toggleSettings', toggleVisibility);
    };
  }, []); 

  // Effect for persisting state changes to localStorage
  useEffect(() => {
    setSettingsInLocalStorage(settings);
  }, [settings]);

  // Handler to update settings
  const handleChange = (settingKey, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [settingKey]: value,
    }));
  };

  useEffect(() => {
    const classes = document.documentElement.classList;

    Array.from(classes).forEach(className => {
      if (className.startsWith('input-')) {
        document.documentElement.classList.remove(className);
      }
    });
  
    document.documentElement.classList.add(`input-${settings.inputPosition}`);
  }, [settings.inputPosition]); 


  useEffect(() => {
    if (settings.monospaceInput) {
      document.documentElement.classList.add('monospaced-message-form');
    } else {
      document.documentElement.classList.remove('monospaced-message-form');
    }
  }, [settings.monospaceInput]); 

  useEffect(() => {
    if (settings.monospaceConversation) {
      document.documentElement.classList.add('monospaced-conversation');
    } else {
      document.documentElement.classList.remove('monospaced-conversation');
    }
  }, [settings.monospaceConversation]); 

  useEffect(() => {
    let intervalId;

    if (!settings.submitOnEnter) {
      // Set the interval to override the onKeyDown event
      intervalId = setInterval(overrideOnKeyDown, 50);
    }

    return () => {
      // Cleanup the interval on component unmount or when settings.monospaceConversation changes
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [settings.submitOnEnter]);

  // Render form
  return (
    <div className={`stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl p-5 ${visible ? '' : 'hidden'}`}>
      <div className="border-b border-gray-900/10 pb-12">
        <div>
          {/* Monospace Toggle Section */}
          <fieldset>
            <Checkbox
              id="monospaceInput"
              label="Monospace Font"
              checked={settings.monospaceInput}
              onChange={(checked) => handleChange('monospaceInput', checked)}
              description="Make input use monospace font."
            />
            <Checkbox
              id="monospaceConversation"
              label="Monospace Conversation"
              checked={settings.monospaceConversation}
              onChange={(checked) => handleChange('monospaceConversation', checked)}
              description="Make conversation use monospace font."
            />
            <Checkbox
              id="submitOnEnter"
              label="Submit on Enter"
              checked={settings.submitOnEnter}
              onChange={(checked) => handleChange('submitOnEnter', checked)}
              description="Sets the behaviour of the input when pressing enter."
            />
            <Dropdown
              id="inputPosition"
              label="Input Position"
              value={settings.inputPosition}
              onChange={(value) => handleChange('inputPosition', value)}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
                { value: 'bottom', label: 'Bottom' }
              ]}
            />
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default SettingsForm;