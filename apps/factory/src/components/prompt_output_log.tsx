import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChatIcon from "@mui/icons-material/Chat";
import Tooltip from "@mui/material/Tooltip";
import CodeHighlight from "./integration/code_highlight";
import { GenerateOutput } from "~/validators/service";
import { Button } from "@mui/material";
import toast from "react-hot-toast";

interface PromotOutputLogProps {
  pl: GenerateOutput;
}

const PromotOutputLog: React.FC<PromotOutputLogProps> = ({ pl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const [promptLogUrl, setPromptLogUrl] = useState("");

  let code: any = {
    id: `${pl?.id}`,
    version: `${pl?.version}`,
    environment: `${pl?.environment}`,
    labelledState: `${pl?.labelledState}`,
    llmModelType: `${pl?.llmModelType}`,
    llmProvider: `${pl?.llmProvider}`,
    llmModel: `${pl?.llmModel}`,
    promptInput: `${pl?.prompt}`,
    promptOutput: `${pl?.completion}`,
    latency: `${pl?.latency}`,
    createdAt: `${pl?.createdAt ? pl?.createdAt.toISOString() : "NA"}`,
  };
  code = JSON.stringify(code, null, 2);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const completePath = `${window.location.href}/logs/${pl?.id}`;
      setPromptLogUrl(completePath);
    }
  }, []);
  function copyPromptLogUrlToClipboard() {
    navigator.clipboard.writeText(promptLogUrl);
    toast.success("Copied");
  }

  const showLogs = () => {
    return (
      <Dialog open={isOpen} onClose={handleClose} maxWidth={"md"}>
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            component="h2"
            style={{ flex: 1, margin: 0 }}
          >
            Output Log
          </Typography>
          <Button
            id="copy-to-clipboard"
            style={{ cursor: "pointer" }}
            onClick={copyPromptLogUrlToClipboard}
          >
            Copy URL
          </Button>
        </Box>
        <Typography p={2}>
          <CodeHighlight code={code} language="json" />
        </Typography>
      </Dialog>
    );
  };

  return (
    <>
      <Tooltip title="Output Log">
        <ChatIcon onClick={handleOpen} />
      </Tooltip>
      {showLogs()}
    </>
  );
};

export default PromotOutputLog;
