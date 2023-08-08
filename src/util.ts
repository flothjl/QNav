import { Web5 } from "@tbd54566975/web5";
import { QGoLinkResponse, Web5Connection } from "./types";
import { qGoProtocol } from "./protocols";

export async function configureProtocol(web5: Web5, protocolDefinition: any) {
  const { protocols, status } = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: protocolDefinition.protocol,
      },
    },
  });

  if (status.code !== 200) {
    alert("Failed to query protocols. check console");
    console.error("Failed to query protocols", status);

    return;
  }

  // protocol already exists
  if (protocols.length > 0) {
    console.log("protocol already exists");
    return;
  }

  // create protocol
  const { status: configureStatus } = await web5.dwn.protocols.configure({
    message: {
      definition: protocolDefinition,
    },
  });

  console.log("configure protocol status", configureStatus);
}

export async function linksRecordsQuery(web5: Web5) {
  const recordsRes = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: qGoProtocol.protocol,
        schema: "qGoLinkSchema",
        dataFormat: "application/json",
      },
      // TODO: import proper enum to avoid having to ts-ignore
      // @ts-ignore
      dateSort: "createdDescending",
    },
  });
  return recordsRes;
}

export async function followRecordsQuery(web5: Web5) {
  // Get records of followed dids and their links
  const recordsRes = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: qGoProtocol.protocol,
        schema: "qGoFollowSchema",
        dataFormat: "application/json",
      },
      // TODO: import proper enum to avoid having to ts-ignore
      // @ts-ignore
      dateSort: "createdDescending",
    },
  });
  return recordsRes;
}

export async function deleteRecord(web5: Web5, recordId: string) {
  const record = await web5.dwn.records.delete({
    message: {
      recordId,
    },
  });
  console.log(record);
  if (record?.status.code !== 202) {
    return false;
  }
  return true;
}

export async function filterLinkQueryRes(links: QGoLinkResponse[]) {
  // Filter out deleted links and return a filtered list of data. Right now not used.
  let recs: QGoLinkResponse[] = [];

  for (const link of links) {
    recs.push(link);
  }
  return recs
}

export async function connectWeb5() {
  const web5: Web5Connection = await Web5.connect({});
  web5.web5 && await configureProtocol(web5.web5, qGoProtocol);
  return web5;
}

export function getActiveTabUrl(callback: (url: string) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const activeTabUrl = tabs[0].url;
      console.log("URL of the active tab:", activeTabUrl);
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
