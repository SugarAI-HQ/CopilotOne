import root from "window-or-global";
// import UserAgent from "user-agents";

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
