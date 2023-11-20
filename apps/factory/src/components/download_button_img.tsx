import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

type DownloadButtonImgProps = {
  base64image: string;
};

const DownloadButtonImg: React.FC<DownloadButtonImgProps> = ({
  base64image,
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = base64image;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <IconButton
      onClick={handleDownload}
      sx={{
        margin: 1,
        borderRadius: 2,
      }}
    >
      <Tooltip title="Download Image">
        <DownloadForOfflineIcon />
      </Tooltip>
    </IconButton>
  );
};

export default DownloadButtonImg;
