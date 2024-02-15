import React, { useState, useEffect } from "react";
import AceEditor from "react-ace";
import { setPromptText, submitPrompt } from "../utils/interactions";

// Import necessary Ace Editor files
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/ext-language_tools";

function PromptInput() {
  const [maxLines, setMaxLines] = useState(calculateMaxLines());
  const editorRef = React.useRef(null); // Create a ref for the AceEditor


  const wrapTextWithTagsHandler = () => {
    const editor = editorRef.current.editor;
    const entireContent = editor.getValue(); // Get entire content
    let nextRefNumber = 1; // Start checking from Ref 1
  
    // Loop to find the first unused reference number
    while (entireContent.includes(`Ref ${nextRefNumber}`)) {
      nextRefNumber++; // Increment if "Ref n" is found
    }
  
    // Now nextRefNumber is the first unused reference number
  
    // Wrap selected text with reference tag
    const selectedText = editor.getSelectedText();
    const range = editor.getSelectionRange();
    const wrapText = `/* Ref ${nextRefNumber} >>> */${selectedText}/* <<< Ref ${nextRefNumber} */`;
    editor.session.replace(range, wrapText);
  
    // Append the reference definition at the end
    const referenceDefinition = `[Ref ${nextRefNumber}]`;
    editor.session.insert({
      row: editor.session.getLength(),
      column: 0
    }, referenceDefinition);
  };
  

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
    <>
      <AceEditor
        mode="javascript"
        theme="tomorrow"
        onChange={(newValue) => setPromptText(newValue)}
        commands={[
          {
            name: 'submitPromptCommand',
            bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
            exec: (editor) => {
              submitPrompt();
              editor.setValue("");
            },
            readOnly: false
          }
        ]}
        ref={editorRef} // Attach the ref to the AceEditor
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
        width="100%"
        style={{ zIndex: 0 }}
        showPrintMargin={false}
        minLines={5}
        maxLines={maxLines}
        wrapEnabled={true}
      />
    </>
  );
}

export default PromptInput;
