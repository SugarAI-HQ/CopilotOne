import root from "window-or-global";

export const getQueryParams = (param: string) => {
  if (root.location) {
    return new URLSearchParams(root.location?.search).get(param);
  } else {
    null;
  }
};
