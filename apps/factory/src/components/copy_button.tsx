import React from "react";
import IconButton from "@mui/material/IconButton";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import toast from "react-hot-toast";
import { Tooltip } from "@mui/material";

interface CopyToClipboardButtonProps {
  textToCopy: string;
  textToDisplay: string;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  textToCopy,
  textToDisplay,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied");
  };

  return (
    <Tooltip title={textToDisplay}>
      <IconButton
        onClick={handleCopy}
        sx={{
          margin: 1,
        }}
      >
        <FileCopyIcon
          fontSize="small"
          sx={{ color: "var(--sugarhub-text-color)" }}
        />
      </IconButton>
    </Tooltip>
  );
};

export default CopyToClipboardButton;
