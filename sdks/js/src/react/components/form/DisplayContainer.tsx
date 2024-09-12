import { DisplayLocation, DisplayMode } from "@sugar-ai/core";
import { type FC, ReactNode } from "react";

// Modular layout component
export const DisplayContainer: FC<{
  children: ReactNode;
  displayMode: DisplayMode;
  displayLocation?: DisplayLocation;
}> = ({ children, displayMode, displayLocation }) => {
  const commonClasses = "fixed shadow-lg z-50 p-4"; // Common classes for all modes

  let layoutClasses = "";

  // Define classes for different display modes
  switch (displayMode) {
    case "fullscreen":
      layoutClasses = "inset-0 h-full w-full flex items-center justify-center";
      break;
    case "chat-window":
      layoutClasses = displayLocation
        ? `${commonClasses} ${displayLocation === "top-left" && "top-4 left-4"} ${
            displayLocation === "top-right" && "top-4 right-4"
          } ${displayLocation === "bottom-left" && "bottom-4 left-4"} ${
            displayLocation === "bottom-right" && "bottom-4 right-4"
          } w-80 h-96`
        : `${commonClasses} inset-0 h-96 w-80 mx-auto my-auto`; // Center if no displayLocation is specified
      break;
    case "modal":
      layoutClasses =
        "inset-0 flex items-center justify-center bg-black bg-opacity-50";
      break;
    default:
      layoutClasses = "hidden";
  }

  return <div className={`${layoutClasses}`}>{children}</div>;
};

export default DisplayContainer;
