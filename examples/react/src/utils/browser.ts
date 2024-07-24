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

// Check for old versions of Safari
const isOldSafari = (): boolean => {
  const userAgent = navigator.userAgent;
  // Safari version check. Example for Safari versions below 15.
  const safariVersionMatch = userAgent.match(/Version\/(\d+)/);
  if (safariVersionMatch) {
    const version = parseInt(safariVersionMatch[1], 10);
    return version < 15;
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

export const isUnsupportedBrowser = (): boolean => {
  const userAgent = navigator.userAgent;

  // Check for Google Chrome
  const isChrome =
    /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);

  const isSupported = isChrome && !isOutdatedChrome() && !isBrave();

  // Return true if browser is not Chrome
  return !isSupported;
};
