import './styles.css';

(function() {
    'use strict';

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
            </div>
        `;


        const targetForm = document.querySelector('div[role="presentation"] > div:nth-child(2) > form');
        targetForm.insertAdjacentHTML('afterend', settingsHtml);
    
        // Attach event listeners to buttons
        document.querySelector('#toggleMonospace').addEventListener('click', () => document.documentElement.classList.toggle('monospaced-message-form'));

        const removeAllInputClasses = () => {
            // Get all classes from the <html> element
            const classes = document.documentElement.classList;
        
            // Create an array from the classes iterable, then filter and remove classes that start with 'input-'
            Array.from(classes).forEach(className => {
                if (className.startsWith('input-')) {
                    document.documentElement.classList.remove(className);
                }
            });
        };
        
        document.querySelector('#inputLeft').addEventListener('click', () => {
            removeAllInputClasses();
            document.documentElement.classList.toggle('input-left');
        });
        
        document.querySelector('#inputRight').addEventListener('click', () => {
            removeAllInputClasses();
            document.documentElement.classList.toggle('input-right');
        });
        
        document.querySelector('#inputBottom').addEventListener('click', () => {
            removeAllInputClasses();
            document.documentElement.classList.toggle('input-bottom');
        });
    };

    const run = () => {
        injectSettings();
    }

    setInterval(run, 3000);
    run();
})();