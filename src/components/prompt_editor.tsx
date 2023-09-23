import React, { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PromptVersionEditor = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [codeFiles, setCodeFiles] = useState([
    {
      name: 'File 1',
      code: `function helloWorld() {
  console.log('Hello, World!');
}`
    },
  ]);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const addFile = () => {
    setCodeFiles([...codeFiles, { name: `File ${codeFiles.length + 1}`, code: '' }]);
    setActiveTab(codeFiles.length);
  };

  const removeFile = (index) => {
    const updatedFiles = [...codeFiles];
    updatedFiles.splice(index, 1);
    setCodeFiles(updatedFiles);

    if (activeTab === index) {
      setActiveTab(0);
    }
  };

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={handleChangeTab}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="Code Editor Tabs"
      >
        {codeFiles.map((file, index) => (
          <Tab
            key={index}
            label={file.name}
            onDelete={() => removeFile(index)}
            aria-label={`File ${index + 1}`}
          />
        ))}
      </Tabs>
      {codeFiles.map((file, index) => (
        <div key={index} hidden={index !== activeTab}>
          <Box p={2}>
            <Typography variant="h6">{file.name}</Typography>
            Hola
            {/* <SyntaxHighlighter language="javascript" style={docco}>
              {file.code}
            </SyntaxHighlighter> */}
          </Box>
        </div>
      ))}
      <Box p={2}>
        <button onClick={addFile}>Add File</button>
      </Box>
    </div>
  );
};

export default PromptVersionEditor;
