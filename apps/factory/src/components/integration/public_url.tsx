import React from "react";
import Tooltip from "@mui/material/Tooltip";
// import LinkIcon from "@mui/icons-material/Link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface PublicUrlProps {
  title: string;
  url: string;
}

const PublicUrl: React.FC<PublicUrlProps> = ({ title, url }) => {
  return (
    <>
      <Tooltip title={title} placement="top-start" sx={{ color: "#FFFFFF" }}>
        <OpenInNewIcon
          onClick={() => {
            window.open(url, "_blank");
          }}
        />
      </Tooltip>
    </>
  );
};

export default PublicUrl;
