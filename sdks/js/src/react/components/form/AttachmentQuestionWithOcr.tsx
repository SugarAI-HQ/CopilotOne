import { useRef, useState, useEffect } from "react";
import { FaCamera, FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Tesseract from "tesseract.js";

export const AttachmentQuestionWithOcr = ({
  onFileSelect,
  onPhotoCapture,
  onOcrResult,
  themeColor = "text-blue-600",
  allowMultipleFiles = false,
  fileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png", // Default file types
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [ocrResult, setOcrResult] = useState(null);

  useEffect(() => {
    // Check if camera is available
    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );
        setHasCamera(videoDevices.length > 0);
      } catch (error) {
        console.error("Error checking camera availability:", error);
        setHasCamera(false);
      }
    };

    checkCameraAvailability();
  }, []);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFilesChange = async (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = allowMultipleFiles
      ? [...selectedFiles, ...files]
      : files;
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);

    // Call OCR on the first file
    await processOCR(updatedFiles[0]);
  };

  const handlePhotoCaptureClick = () => {
    if (hasCamera) {
      setIsCameraOpen(true);
    } else {
      alert("No camera detected on this device.");
    }
  };

  const handleTakePhoto = async (dataUri) => {
    // Convert dataUri to a File object
    const byteString = atob(dataUri.split(",")[1]);
    const mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const file = new File([ab], "photo.jpg", { type: mimeString });
    const updatedFiles = allowMultipleFiles ? [...selectedFiles, file] : [file];
    setSelectedFiles(updatedFiles);
    onPhotoCapture(updatedFiles);
    setIsCameraOpen(false);

    // Call OCR on the captured photo
    await processOCR(file);
  };

  const processOCR = async (file) => {
    try {
      setOcrResult("Processing...");

      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Progress logging
      });

      debugger;

      const text = result.data.text;
      setOcrResult(text);

      onOcrResult && onOcrResult(text);

      console.log("OCR Result:", text);
    } catch (error) {
      console.error("Error during OCR processing:", error);
      setOcrResult("Error during OCR processing.");
    }
  };

  const handleFileRemove = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove,
    );
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  return (
    <div className="flex flex-col items-center mt-4 space-y-4">
      <div className="flex space-x-4">
        {/* Upload File Button */}
        <button
          onClick={handleFileUploadClick}
          className={`p-2 ${themeColor} rounded-full hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          title="Upload File"
        >
          <FaCloudUploadAlt size={24} />
        </button>

        {/* Capture Photo Button */}
        <button
          onClick={handlePhotoCaptureClick}
          className={`p-2 ${themeColor} rounded-full hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-green-500`}
          title="Take a Photo"
        >
          <FaCamera size={24} />
        </button>
      </div>

      {/* Display Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 w-full max-w-md">
          <ul className="mt-2 list-disc pl-5 text-gray-600 dark:text-gray-400">
            {selectedFiles.map((file, index) => (
              <ol key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <button
                  onClick={() => handleFileRemove(index)}
                  className="ml-2 p-1 text-red-600 hover:text-red-800 focus:outline-none"
                  title="Remove File"
                >
                  <FaTrash />
                </button>
              </ol>
            ))}
          </ul>
        </div>
      )}

      {/* OCR Result */}
      {ocrResult && (
        <div className="mt-4 w-full max-w-md">
          <h4 className="text-gray-700 dark:text-gray-300">OCR Result:</h4>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{ocrResult}</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple={allowMultipleFiles}
        accept={fileTypes} // Use fileTypes prop
        onChange={handleFilesChange}
      />

      {/* Camera Component */}
      {isCameraOpen && hasCamera && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <Camera
            onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
            isFullscreen={true}
            idealFacingMode="environment"
          />
          <button
            onClick={() => setIsCameraOpen(false)}
            className="absolute top-4 right-4 text-white text-xl"
          >
            Close
          </button>
        </div>
      )}

      {/* Camera Not Available Message */}
      {!hasCamera && isCameraOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg text-center">
            <p>No camera detected on this device.</p>
            <button
              onClick={() => setIsCameraOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentQuestionWithOcr;
