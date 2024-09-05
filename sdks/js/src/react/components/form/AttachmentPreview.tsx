import React from "react";
import { FaTrash } from "react-icons/fa";

interface AttachmentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({
  files,
  onRemove,
}) => {
  // Determine the size based on the number of files
  const previewSizeClass =
    files.length === 1
      ? "w-auto h-auto" // Larger size for single document
      : files.length > 4
        ? "w-20 h-20"
        : files.length > 2
          ? "w-28 h-28"
          : "w-36 h-36";

  return (
    <div
      className={`mt-4 ${files.length === 1 ? "flex justify-center" : "grid grid-cols-3 gap-4"}`}
    >
      {files.map((file, index) => (
        <div
          key={index}
          className={`relative border rounded-md overflow-hidden ${previewSizeClass}`}
        >
          {/* Display thumbnail for image files */}
          {file.type.includes("image") ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="object-cover w-full h-full"
              style={{ aspectRatio: "auto" }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-700 text-sm">
              {file.name}
            </div>
          )}

          {/* Remove button */}
          <button
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 p-1 text-red-600 hover:text-red-800 focus:outline-none"
            title="Remove File"
          >
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentPreview;
