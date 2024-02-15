import React from "react";
import AceEditor from "react-ace";
import { setPromptText, submitPrompt } from '../utils/interactions';

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function onChange(newValue) {
  setPromptText(newValue);
}

function PromptInput() {
  return (
    <AceEditor
      mode="javascript"
      theme="tomorrow"
      onChange={onChange}
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
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      width="100%"
      style={{ zIndex: 0 }}
      showPrintMargin={false}
    />
  );
}

export default PromptInput;
