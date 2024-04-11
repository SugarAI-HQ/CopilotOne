import React from "react";
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import SyntaxHighlighter from 'react-syntax-highlighter';

// import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyToClipboardButton from "../copy_button";
import { Box } from "@mui/material";

interface CodeHighlightProps {
  code: string;
  language?: string;
  isCopy?: boolean;
}

const CodeHighlight: React.FC<CodeHighlightProps> = ({
  code,
  language = "jsx",
  isCopy = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <SyntaxHighlighter
          useInlineStyles={true}
          language={language}
          style={dracula}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
      {isCopy && (
        <Box sx={{ marginTop: "8px" }}>
          <CopyToClipboardButton
            textToCopy={code}
            textToDisplay={"Copy to Clipboard"}
          />
        </Box>
      )}
    </Box>
  );
};

export default CodeHighlight;
