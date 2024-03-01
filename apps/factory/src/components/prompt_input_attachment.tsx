import React, { useEffect, useState, useRef } from "react";
import { Typography, Stack, Box, Tooltip } from "@mui/material";
import ReactFileReader from "react-file-reader";
import { url2ImageBase64Url, FileObject } from "~/utils/common";
import { ModelDefaultValueSchemaType } from "~/validators/prompt_version";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import toast from "react-hot-toast";

function PromptInputAttachment({
  onFileUpload,
  modelDefaultValues,
  cube,
}: {
  onFileUpload?: (file: FileObject) => void;
  modelDefaultValues: ModelDefaultValueSchemaType;
  cube?: boolean;
}) {
  const [url, setUrl] = useState<string>(modelDefaultValues.url);

  const handleFiles = (file: FileObject): void => {
    console.log(file);
    const maxSizeInBase64 = 5 * 1024 * 1024; // 1MB as an example, adjust as needed
    console.log(maxSizeInBase64);
    const base64SizeInBytes = file.base64
      ? (file.base64.length * 3) / 4 - 2
      : 0;
    console.log(base64SizeInBytes);
    if (base64SizeInBytes > maxSizeInBase64) {
      toast.error(
        "File size exceeds the 5MB limit. Please upload a smaller image.",
      );
    }
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
    <div>
      <Typography
        variant="h6"
        sx={{
          color: "var(--sugarhub-text-color)",
          mb: 1,
          fontSize: "1rem",
        }}
      >
        Input Image
      </Typography>

      <div className={`group relative overflow-hidden ${cube ?? "w-3/12	"}`}>
        <ReactFileReader
          fileTypes={modelDefaultValues.supportFormatType}
          base64={modelDefaultValues.base64}
          handleFiles={handleFiles}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="hidden flex-col items-center text-white group-hover:flex">
              <CloudUploadIcon className="text-2xl text-white" />
              <Typography className="text-sm text-white">
                Click to upload a new image
              </Typography>
            </div>
          </div>
          <img
            src={url}
            alt="Placeholder"
            className="h-full w-full cursor-pointer object-cover group-hover:opacity-30"
          />
        </ReactFileReader>
      </div>
    </div>
  );
}

export default PromptInputAttachment;
