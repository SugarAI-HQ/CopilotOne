import root from "window-or-global";
// import UserAgent from "user-agents";

import UAParser from "ua-parser-js";

export const getBrowserAndOSDetails = () => {
  const parser = new UAParser();
  const result = parser.getResult();

  return {
    ua: navigator.userAgent,
    browser: result.browser,
    engine: result.engine,
    os: result.os,
    device: result.device,
    cpu: result.cpu,
  };
};

// const getBrowserAndOSDetailsx = () => {
//   const parser = new UAParser();
//   const result = parser.getResult();

//   return {
//     browserName: result.browser.name,
//     browserVersion: result.browser.version,
//     osName: result.os.name,
//     osVersion: result.os.version,
//     device: result.device.type || "Desktop", // Fallback to 'Desktop' if no device type is detected
//   };
// };

export function isChrome(): boolean {
  return (
    /Chrome/.test(root.navigator.userAgent) &&
    /Google Inc/.test(root.navigator.vendor)
  );
}
export function isAndroid(): boolean {
  return /android/i.test(root.navigator.userAgent);
}

export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(root.navigator.userAgent);
}

export function isDesktop(): boolean {
  return /windows|macintosh|linux/i.test(root.navigator.userAgent);
}
