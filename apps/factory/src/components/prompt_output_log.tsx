import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InfoIcon from "@mui/icons-material/Info";
import CopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import CodeHighlight from "./integration/code_highlight";
import { GenerateOutput } from "~/validators/service";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import CopyToClipboardButton from "./copy_button";
import { LogSchema } from "~/validators/prompt_log";

interface PromotOutputLogProps {
  pl: LogSchema;
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
      const completePath = `${
        window.location.href.split("?")[0]
      }/logs/${pl?.id}`;
      setPromptLogUrl(completePath);
    }
  }, [pl]);

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
          <CopyToClipboardButton
            textToCopy={promptLogUrl}
            textToDisplay={"COPY URL"}
          />
        </Box>
        <Typography p={2}>
          <CodeHighlight code={code} language="json" />
        </Typography>
      </Dialog>
    );
  };

  return (
    <div>
      <Tooltip title="Output Log" sx={{ ml: 1 }}>
        <InfoIcon onClick={handleOpen} />
      </Tooltip>
      {showLogs()}
    </div>
  );
};

export default PromotOutputLog;
