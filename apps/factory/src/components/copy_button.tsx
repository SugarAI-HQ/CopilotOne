import React from "react";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import toast from "react-hot-toast";
import { Tooltip } from "@mui/material";
import { TextResponseVersion } from "~/validators/llm_respose";

interface CopyToClipboardButtonProps {
  textToCopy: TextResponseVersion["completion"];
  textToDisplay: string;
  cube?: boolean;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  textToCopy,
  textToDisplay,
  cube,
}) => {
  console.log(textToCopy);
  const handleCopy = () => {
    try {
      let text =
        typeof textToCopy === "object"
          ? JSON.stringify(
              textToCopy[0].message?.tool_calls ||
                textToCopy[0].message?.content,
            )
          : textToCopy.toString();
      navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch (error) {
      toast.error("Failed to copy");
      console.error("Error copying text to clipboard:", error);
    }
  };

  return (
    <Tooltip title={textToDisplay} placement="top">
      <IconButton
        onClick={handleCopy}
        sx={{
          margin: 1,
        }}
      >
        <FileCopyIcon
          sx={{
            color: "var(--sugarhub-text-color)",
            fontSize: cube ? "1rem" : "1.4rem",
          }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
