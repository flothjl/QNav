import { Web5 } from "@tbd54566975/web5";
import { QGoLinkResponse, QGoFollowsResponse, QGoFollow, QGoLink, Web5Connection } from "./types";
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


/**
 * Queries all links for connected user.
 *
 * @param {Web5Connection} web5Connection - The Web5 instance to use for querying links and records.
 * @param {any} from - The DID to query links from (optional).
 * @returns {Promise<{status: any, recs: QGoLinkResponse[]}>} - An object containing the status and an array of link records (QGoLinkResponse[]).
 */
export async function linksRecordsQuery(web5Connection: Web5Connection, from?: string): Promise<{ status: any, recs: QGoLinkResponse[] }> {
  const recordsRes = await web5Connection.web5.dwn.records.query({
    from,
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
  let recs: QGoLinkResponse[] = [];
  for (const record of recordsRes?.records || []) {
    const data: QGoLink = await record.data.json();
    const id = record.id;
    recs.push({ record, data, id });
  }
  return { status: recordsRes.status, recs };
}

/**
 * Queries all links for connected user and all followed dids.
 *
 * @param {Web5Connection} web5Connection - The Web5 instance to use for querying links and records.
 * @returns {Promise<{status: any, recs: QGoLinkResponse[]}>} - An object containing the status and an array of link records (QGoLinkResponse[]).
 */
export async function queryAllLinks(web5Connection: Web5Connection): Promise<{ status: any, recs: QGoLinkResponse[] }> {

  const followsRes = await followRecordsQuery(web5Connection);
  const recordsRes = await linksRecordsQuery(web5Connection);

  let recs: QGoLinkResponse[] = recordsRes.recs;

  for (const follow of followsRes?.recs || []) {
    const recordsRes = await linksRecordsQuery(web5Connection, follow.data.did);
    if (recordsRes?.status.code !== 200) {
      console.log(`unable to get links for followed DID: ${follow.data.did}`);
      continue;
    }
    recs = [...recs, ...recordsRes.recs];
  }
  recs = await filterLinkQueryRes(recs, web5Connection);

  return { status: recordsRes.status, recs };
}

/**
 * Queries all followed dids for connected user.
 *
 * @param {Web5Connection} web5Connection - The Web5 instance to use for querying links and records.
 * @returns {Promise<{status: any, recs: QGoFollowsResponse[]}>}
 */
export async function followRecordsQuery(web5Connection: Web5Connection): Promise<{ status: any, recs: QGoFollowsResponse[] }> {
  // Get records of followed dids and their links
  const recordsRes = await web5Connection.web5.dwn.records.query({
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
  let recs: QGoFollowsResponse[] = [];
  for (const record of recordsRes?.records || []) {
    const data: QGoFollow = await record.data.json();
    const id = record.id;
    recs.push({ record, data, id });
  }
  return {
    status: recordsRes.status,
    recs
  };
}

export async function deleteRecord(web5Connection: Web5Connection, recordId: string) {
  const record = await web5Connection.web5.dwn.records.delete({
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

export async function filterLinkQueryRes(links: QGoLinkResponse[], web5Connection: Web5Connection) {
  // Filter out deleted links and return a filtered list of data. Right now not used.
  const idMap: Map<string, QGoLinkResponse> = new Map();
  for (const link of links) {
    if (!idMap.has(link.data.name)) {
      idMap.set(link.data.name, link)
    } else if (link.record.author === web5Connection.did) {
      const existingRec = idMap.get(link.data.name);
      if (existingRec && new Date(link.record.dateCreated) > new Date(existingRec.record.dateCreated)) {
        idMap.set(link.data.name, link)
      }
    }
  }
  let recs = Array.from(idMap.values());
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
