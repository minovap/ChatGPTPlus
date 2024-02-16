import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { setPromptText, submitPrompt } from "../utils/interactions";

// Import necessary Ace Editor files
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";

function PromptInput() {
  const [maxLines, setMaxLines] = useState(calculateMaxLines());

  const [codeContent, setCodeContent] = useState('');
  const [focusedEditor, setFocusedEditor] = useState('');
  const [instructionsContent, setInstructionsContent] = useState('');
  const [hintContent, setHintContent] = useState('');

  const thisComponentRef = React.useRef(null);
  const instructionsEditorRef = React.useRef(null);
  const hintEditorRef = React.useRef(null);
  
  const codeEditorRef = React.useRef(null);

  const halfMaxLines = Math.round(maxLines / 2);

  const wrapTextWithTagsHandler = () => {
    const codeEditor = codeEditorRef.current.editor;
    const instructionsEditor = instructionsEditorRef.current.editor;
    const entireContent = codeEditor.getValue();
    let nextRefNumber = 1;
  
    while (entireContent.includes(`Ref ${nextRefNumber}`)) {
      nextRefNumber++;
    }
  
    let selectedText = codeEditor.getSelectedText();
    let range = codeEditor.getSelectionRange();
    
    // If no text is selected, adjust to select the whole line(s)
    if (selectedText.length === 0) {
      const startRow = range.start.row;
      const endRow = range.end.row;
      const lineStart = codeEditor.session.getDocument().getLine(startRow);
      const lineEnd = codeEditor.session.getDocument().getLine(endRow);
      
      range.start.column = 0; // Start of the start line
      range.end.column = lineEnd.length; // End of the end line
      selectedText = codeEditor.session.getTextRange(range); // Update selectedText to the whole line(s)
    }
  
    const wrapText = `/* Ref ${nextRefNumber} >>> */${selectedText}/* <<< Ref ${nextRefNumber} */`;
    codeEditor.session.replace(range, wrapText);
  
    const referenceDefinition = `\n[Ref ${nextRefNumber}]`;
    instructionsEditor.session.insert({
      row: instructionsEditor.session.getLength(),
      column: 0
    }, referenceDefinition);
  };

  const clearEditors = () => {
    setCodeContent('');
    setInstructionsContent('');
    try {
      codeEditorRef.setValue('');
      instructionsEditorRef.setValue('');
    } catch (e) {

    }
  }

  const handleCombinedSubmit = () => {
    submitPrompt();
    clearEditors();
  };

  useEffect(() => {
    // Assuming instructionsEditorRef is attached to an input, textarea, or other form element
    console.log(thisComponentRef);
    const formElement = thisComponentRef.current.closest('form');
    
    const handleSubmit = (event) => {
      // Prevent the default form submit action
      event.preventDefault();
      
      // Handle the form submission here
      console.log('Form submitted!');
      clearEditors();
    };
  
    // Add submit event listener if the form element is found
    if (formElement) {
      formElement.addEventListener('submit', handleSubmit);
    }
  
    // Remove the event listener on cleanup
    return () => {
      if (formElement) {
        formElement.removeEventListener('submit', handleSubmit);
      }
    };
  }, []); 

  useEffect(() => {
    let combinedContent = '';
    if (codeContent !== '') {
      combinedContent += `<<<MY_CODE>>>\n\n${codeContent}\n\n<<</MY_CODE>>>\n`;
    }

    combinedContent += instructionsContent;
    
    if (hintContent !== '') {
      combinedContent += `\n\n<<<HINT>>>\n${hintContent}\n<<</HINT>>>`;
    }

    setPromptText(combinedContent);
  }, [codeContent, instructionsContent, hintContent]);

  useEffect(() => {
    const handleResize = () => {
      setMaxLines(calculateMaxLines());
    };

    window.addEventListener('resize', handleResize);
    // Register custom event listener
    document.addEventListener('wrapTextWithTags', wrapTextWithTagsHandler);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('wrapTextWithTags', wrapTextWithTagsHandler);
    };
  }, []);

  // Function to calculate max lines based on the viewport height
  function calculateMaxLines() {
    const lineHeight = 16; // Adjust as needed
    const viewportHeight = window.innerHeight;
    const editorHeightPercentage = 0.8; // Adjust based on your UI
    const maxEditorHeight = viewportHeight * editorHeightPercentage;
    return Math.floor(maxEditorHeight / lineHeight);
  }

  return (
    <div ref={thisComponentRef}>
      <div className="header p-2 bg-gray-50 text-gray-800">Code</div>
      <AceEditor
        className={focusedEditor === 'code_editor' ? 'focused' : ''}
        onFocus={() => setFocusedEditor('code_editor')}
        onBlur={() => setFocusedEditor('')}
        mode="javascript"
        theme="chrome"
        value={codeContent}
        onChange={(newValue) => { setCodeContent(newValue); }}
        ref={codeEditorRef}
        name="code_editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        minLines={5}
        maxLines={halfMaxLines}
        wrapEnabled={true}
        showPrintMargin={false}
        setOptions={{ useWorker: false }}
        commands={[
          {
            name: 'submitPromptCommand',
            bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
            exec: () => {
              handleCombinedSubmit();
            },
            readOnly: false
          }
        ]}
      />
      <div className="header p-2 bg-gray-50 text-gray-800 mt-4">Instructions</div>
      <AceEditor
        className={focusedEditor === 'instructions_editor' ? 'focused' : ''}
        onFocus={() => setFocusedEditor('instructions_editor')}
        onBlur={() => setFocusedEditor('')}
        mode="javascript"
        theme="chrome"
        value={instructionsContent}
        onChange={(newValue) => { setInstructionsContent(newValue); }}
        ref={instructionsEditorRef}
        name="instructions_editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        minLines={5}
        maxLines={halfMaxLines}
        wrapEnabled={true}
        showPrintMargin={false}
        setOptions={{ useWorker: false }}
        commands={[
          {
            name: 'submitPromptCommand',
            bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
            exec: () => {
              handleCombinedSubmit();
            },
            readOnly: false
          }
        ]}
      />
      <div className="header p-2 bg-gray-50 text-gray-800 mt-4">Hint</div>
      <AceEditor
        className={focusedEditor === 'hint_editor' ? 'focused' : ''}
        onFocus={() => setFocusedEditor('hint_editor')}
        onBlur={() => setFocusedEditor('')}
        mode="javascript"
        theme="chrome"
        value={hintContent}
        onChange={(newValue) => { setHintContent(newValue); }}
        ref={hintEditorRef}
        name="hint_editor"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        minLines={2}
        maxLines={halfMaxLines}
        wrapEnabled={true}
        showPrintMargin={false}
        setOptions={{ useWorker: false }}
        commands={[
          {
            name: 'submitPromptCommand',
            bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
            exec: () => {
              handleCombinedSubmit();
            },
            readOnly: false
          }
        ]}
      />
    </div>
  );
}

export default PromptInput;