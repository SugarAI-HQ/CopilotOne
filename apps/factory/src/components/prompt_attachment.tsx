import React, { useEffect, useState } from "react";
import { Typography, Stack, Box } from "@mui/material";
import ReactFileReader from "react-file-reader";
import { FiCamera } from "react-icons/fi";
import { url2ImageBase64Url, FileObject } from "~/services/providers";

const baseImage = `${process.env.NEXT_PUBLIC_APP_URL}/images/segmind/portrait.jpg`;

function PromptAttachment({
  onFileUpload,
}: {
  onFileUpload?: (file: FileObject) => void;
}) {
  const [url, setUrl] = useState<string>(baseImage);

  const handleFiles = (file: FileObject): void => {
    setUrl(file?.base64 as string);
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fileObject = (await url2ImageBase64Url(baseImage)) as FileObject;
      onFileUpload && onFileUpload(fileObject);
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        {/* <Typography
            variant="h6"
            sx={{ color: "var(--sugarhub-text-color)", mb: 2 }}
          >
            Upload attachment
          </Typography> */}
        <Stack spacing={2} alignItems={"center"}>
          <img src={url} alt="Placeholder" className="h-48 w-48 object-cover" />
          <ReactFileReader
            fileTypes={[".png", ".jpg"]}
            base64={true}
            handleFiles={handleFiles}
          >
            <FiCamera
              style={{
                width: 30,
                height: 30,
                cursor: "pointer",
                color: "var(--sugarhub-text-color)",
              }}
            />
          </ReactFileReader>
        </Stack>
      </Box>
    </Box>
  );
}

export default PromptAttachment;
