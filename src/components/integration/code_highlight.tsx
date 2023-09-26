import React from 'react';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import SyntaxHighlighter from 'react-syntax-highlighter';

// import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeHighlightProps {
  code: string;
  language?: string;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({ code, language = 'jsx' }) => {
  return (
    <SyntaxHighlighter language={language} style={dracula}>
      {code}
    </SyntaxHighlighter>
  );
};

export default CodeHighlight;
