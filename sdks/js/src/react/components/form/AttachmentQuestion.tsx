import { useRef, useState, useEffect } from "react";
import { FaCamera, FaCloudUploadAlt } from "react-icons/fa";
import Camera from "react-html5-camera-photo";
// import "react-html5-camera-photo/build/css/index.css";
import "~/react/styles/attachment.css";
import AttachmentPreview from "./AttachmentPreview";

export const AttachmentQuestion = ({
  onFileSelect,
  onPhotoCapture,
  themeColor = "text-blue-600",
  allowMultipleFiles = false,
  // fileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp", // Default file types
  fileTypes = ".jpg,.jpeg,.png,.webp,.gif", // Default file types
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
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

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = allowMultipleFiles
      ? [...selectedFiles, ...files]
      : files;
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const handlePhotoCaptureClick = () => {
    if (hasCamera) {
      setIsCameraOpen(true);
    } else {
      alert("No camera detected on this device.");
    }
  };

  const handleTakePhoto = (dataUri) => {
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
  };

  const handleFileRemove = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove,
    );
    setSelectedFiles(updatedFiles);
    onFileSelect(updatedFiles);
  };

  const handleCameraError = (error) => {
    console.error("Camera error. Please check your camera settings.", error);
  };

  function handleCameraStart(stream) {
    console.log("handleCameraStart");
  }

  function handleCameraStop() {
    console.log("handleCameraStop");
  }

  return (
    <div className="flex flex-col items-center mt-4 space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={handleFileUploadClick}
          className="p-2 rounded-full hover:opacity-75 focus:outline-none focus:ring-2"
          style={{ color: themeColor, borderColor: themeColor }}
          title="Upload File"
        >
          <FaCloudUploadAlt size={24} />
        </button>
        {/* 
        <button
          onClick={handlePhotoCaptureClick}
          className={`p-2 rounded-full hover:opacity-75 focus:outline-none focus:ring-2`}
          style={{ color: themeColor, borderColor: themeColor }}
          title="Take a Photo"
        >
          <FaCamera size={24} />
        </button> */}
      </div>

      {/* Document Preview */}
      {selectedFiles.length > 0 && (
        <AttachmentPreview files={selectedFiles} onRemove={handleFileRemove} />
      )}

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple={allowMultipleFiles}
        accept={fileTypes}
        onChange={handleFilesChange}
      />

      {isCameraOpen && hasCamera && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            // onTakePhotoAnimationDone={(dataUri) => {
            //   handleTakePhoto(dataUri);
            // }}
            onCameraError={(error) => {
              handleCameraError(error);
            }}
            // idealFacingMode={FACING_MODES.ENVIRONMENT}
            idealResolution={{ width: 640, height: 480 }}
            // imageType={IMAGE_TYPES.JPG}
            imageCompression={0.97}
            isMaxResolution={true}
            isImageMirror={false}
            isSilentMode={false}
            isDisplayStartCameraError={true}
            isFullscreen={false}
            sizeFactor={1}
            onCameraStart={(stream) => {
              handleCameraStart(stream);
            }}
            onCameraStop={() => {
              handleCameraStop();
            }}
          />
          {/* <Camera
            onTakePhotoAnimationDone={handleTakePhoto}
            isFullscreen={true}
          /> */}
          {/* <Camera
            onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
            // isFullscreen={true}
            // idealFacingMode={FACING_MODES.environment}
          /> */}
          <button
            onClick={() => setIsCameraOpen(false)}
            className="absolute top-4 right-4 text-white text-xl"
          >
            Close
          </button>
        </div>
      )}

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

export default AttachmentQuestion;
