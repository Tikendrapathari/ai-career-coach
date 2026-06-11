import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, language }) => {
  const getLanguage = () => {
    const languages = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp'
    };
    return languages[language] || 'javascript';
  };

  return (
    <Editor
      height="400px"
      defaultLanguage="javascript"
      language={getLanguage()}
      value={code}
      onChange={(value) => onChange(value)}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on'
      }}
    />
  );
};

export default CodeEditor;