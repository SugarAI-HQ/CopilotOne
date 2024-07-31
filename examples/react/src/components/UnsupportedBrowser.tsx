import { useEffect, useState, ReactNode } from "react";
import { isUnsupportedBrowser } from "@/utils/browser";

interface UnsupportedBrowserProps {
  forceShow: boolean;
  children?: ReactNode;
}

export const UnsupportedBrowser: React.FC<UnsupportedBrowserProps> = ({
  forceShow,
  children,
}) => {
  const [isUnsupported, setIsUnsupported] = useState(false);

  useEffect(() => {
    if (isUnsupportedBrowser()) {
      setIsUnsupported(true);
    }
  }, []);

  if (!isUnsupported) {
    return <>{children}</>;
  }

  return (
    <div>
      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffdddd",
          color: "#d8000c",
          top: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        <h1>Unsupported Browser</h1>
        <p>
          It seems like you're using an outdated or unsupported browser.
          <span
            style={{
              display: "block",
              marginTop: "10px",
              fontWeight: "bold",
              color: "#d8000c",
              fontSize: "1.2em",
            }}
          >
            For the best experience, please use the latest version of
            <span
              style={{
                color: "#4285f4", // Chrome's blue color
                fontWeight: "bold",
              }}
            >
              {" "}
              Google Chrome
            </span>
          </span>
        </p>
      </div>
      {children}
    </div>
  );
};

export default UnsupportedBrowser;
