// utils/browserDetection.ts

// Check for old versions of Internet Explorer
const isInternetExplorer = (): boolean => {
  const userAgent = navigator.userAgent;
  return userAgent.includes("MSIE") || userAgent.includes("Trident/");
};

// Check for outdated versions of Chrome (e.g., below version 100)
const isOutdatedChrome = (): boolean => {
  const userAgent = navigator.userAgent;
  const chromeVersionMatch = userAgent.match(/Chrome\/(\d+)/);
  if (chromeVersionMatch) {
    const version = parseInt(chromeVersionMatch[1], 10);
    return version < 100;
  }
  return false;
};

// Check for Brave browser
const isBrave = (): boolean => {
  const userAgent = navigator.userAgent;
  return typeof window.navigator !== "undefined" && "brave" in window.navigator;
};

// // Combine all checks into a single function
// export const isUnsupportedBrowser = (): boolean => {
//   return (
//     isInternetExplorer() || isOutdatedChrome() || isOldSafari() || isBrave()
//   );
// };

const isOldSafari = (): boolean => {
  const userAgent = navigator.userAgent;
  // Allow Mac Safari regardless of version
  const isMacSafari = /Safari/.test(userAgent) && /Macintosh/.test(userAgent);
  if (isMacSafari) {
    return false;
  }

  // Safari version check for other platforms. Example for Safari versions below 15.
  const safariVersionMatch = userAgent.match(/Version\/(\d+)/);
  if (safariVersionMatch) {
    const version = parseInt(safariVersionMatch[1], 10);
    return version < 15;
  }
  return false;
};

// Check for iOS mobile browsers
// const isIOSMobileBrowser = (): boolean => {
//   const userAgent = navigator.userAgent;
//   return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
// };

export const isUnsupportedBrowser = (): boolean => {
  const userAgent = navigator.userAgent;

  // Check for Google Chrome
  const isChrome =
    /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);

  const isSupportedChrome = isChrome && !isOutdatedChrome() && !isBrave();

  const isMacSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
    /Macintosh/.test(navigator.userAgent);
  const isSupportedSafari = isMacSafari;

  const isSupported = isSupportedChrome;

  // Return true if browser is not Chrome
  return !isSupported;
};
