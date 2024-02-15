// Define a function to set the prompt text in a textarea within a React component
function setPromptText(promptText) {
  const textarea = document.querySelector('#prompt-textarea');
  if (!textarea) {
    console.error('Textarea not found');
    return;
  }

  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
  nativeTextAreaValueSetter.call(textarea, promptText);

  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
}

// Define a function to submit the form in a React component
function submitPrompt() {
  const form = document.querySelector('#input-panel form');
  const reactPropsKey = Object.keys(form).find(key => key.startsWith('__reactProps$'));
  if (!reactPropsKey) {
    console.error('React props key not found for the form');
    return;
  }

  form[reactPropsKey].onSubmit();
}

// Export the functions
export { setPromptText, submitPrompt };