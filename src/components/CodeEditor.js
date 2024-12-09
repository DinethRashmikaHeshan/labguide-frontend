import React, { useRef } from 'react';
import Editor from "@monaco-editor/react";

const CodeEditor = ({ fileName, files, onEditorMount }) => {
  const editorRef = useRef(null);
  const file = files[fileName];

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    if (onEditorMount) {
      onEditorMount(editor);
    }
  }

  return (
    <Editor
      height="400px"
      width="100%"
      theme='vs-dark'
      onMount={handleEditorDidMount}
      path={file.name}
      defaultLanguage={file.language}
      defaultValue={file.value}
    />
  );
};

export default CodeEditor;
