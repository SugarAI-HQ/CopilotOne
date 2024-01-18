import { IconButton, Tooltip } from "@mui/material";
import React, { useState } from "react";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
type DownloadButtonImgProps = {
  base64image: string;
};

const DownloadButtonImg: React.FC<DownloadButtonImgProps> = ({
  base64image,
}) => {
  const [isDownloading, setDownloading] = useState(false);

  const downloadImage = api.prompt.downloadImage.useMutation();

  const handleDownload = () => {
    setDownloading(true);
    downloadImage.mutate(
      {
        base64image: base64image,
      },
      {
        onSuccess(item) {
          const dataUrl = `data:image/png;base64,${item.blob}`;

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "downloaded_image.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setDownloading(false);
        },
        onError() {
          setDownloading(false);
          toast.error("Error while downloading image");
        },
      },
    );
  };

  return (
    <>
      {isDownloading ? (
        <>
          <BouncingDotsLoader />
        </>
      ) : (
        <>
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
        </>
      )}
    </>
  );
};

const BouncingDotsLoader = () => {
  return (
    <div className="bouncing-loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default DownloadButtonImg;
