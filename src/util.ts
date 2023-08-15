export function getActiveTabUrl(callback: (url: string) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const activeTabUrl = tabs[0].url;
      // You can now use the URL as needed
      callback(activeTabUrl || "")
    }
  });
}

export const isValidUrl = (url: string): boolean => {
  // Regular expression to match a valid URL pattern
  const urlPattern = /^(https?:\/\/|chrome:\/\/|file:\/\/|ftp:\/\/|mailto:|tel:|data:)([a-z0-9\-]+\.)+[a-z]{2,}(\/.*)*$/i;

  return urlPattern.test(url);
};

export const isValidDid = (did: string): boolean => {
  // regex from https://github.com/TBD54566975/web5-js/blob/72facd44f0d70c3a9dc5f89719cadc51220fb8ce/packages/dids/src/utils.ts#L11
  const didRegex = /^did:([a-z0-9]+):((?:(?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))*:)*((?:[a-zA-Z0-9._-]|(?:%[0-9a-fA-F]{2}))+))((;[a-zA-Z0-9_.:%-]+=[a-zA-Z0-9_.:%-]*)*)(\/[^#?]*)?([?][^#]*)?(#.*)?$/;
  return didRegex.test(did);
}
