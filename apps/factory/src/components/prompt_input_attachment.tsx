import React, { useEffect, useState } from "react";
import { Typography, Stack, Box } from "@mui/material";
import ReactFileReader from "react-file-reader";
import { FiCamera } from "react-icons/fi";
import { url2ImageBase64Url, FileObject } from "~/utils/common";
import { ModelDefaultValueSchemaType } from "~/validators/prompt_version";

function PromptInputAttachment({
  onFileUpload,
  modelDefaultValues,
}: {
  onFileUpload?: (file: FileObject) => void;
  modelDefaultValues: ModelDefaultValueSchemaType;
}) {
  const [url, setUrl] = useState<string>(modelDefaultValues.url);

  const handleFiles = (file: FileObject): void => {
    setUrl(file?.base64 as string);
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fileObject = (await url2ImageBase64Url(
        modelDefaultValues.url,
      )) as FileObject;
      onFileUpload && onFileUpload(fileObject);
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Stack spacing={2} alignItems={"center"}>
          <ReactFileReader
            fileTypes={modelDefaultValues.supportFormatType}
            base64={modelDefaultValues.base64}
            handleFiles={handleFiles}
          >
            <img
              src={url}
              alt="Placeholder"
              className="h-48 w-48 cursor-pointer object-cover"
            />
          </ReactFileReader>
        </Stack>
      </Box>
    </Box>
  );
}

export default PromptInputAttachment;
