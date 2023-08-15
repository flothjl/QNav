import { Web5 } from "@tbd54566975/web5";
import { QGoLinkResponse, QGoFollowsResponse, QGoFollow, QGoLink, Web5Connection } from "./types";
import { qGoProtocol } from "./protocols";
import { RecordsWriteResponse } from "@tbd54566975/web5/dist/types/dwn-api";

export class QGoApi {
  did: string;
  web5: Web5;

  private constructor(web5: Web5Connection) {
    this.did = web5.did;
    this.web5 = web5.web5;
  }

  private static async configureProtocol(web5: Web5, protocolDefinition: any) {
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

  static async create() {
    const web5: Web5Connection = await Web5.connect({});
    web5.web5 && await QGoApi.configureProtocol(web5.web5, qGoProtocol);
    return new QGoApi(web5);
  }

  /**
   * Adds a Link.
   *
   * @param {QGoLink} data - The data of the Link to add.
   * @returns {Promise<RecordsWriteResponse>} - An object containing the status of the request.
   */
    async addLink(data: QGoLink): Promise<RecordsWriteResponse> {
      const recordRes = await this.web5.dwn.records.create({
        data,
        message: {
          dataFormat: "application/json",
          protocol: qGoProtocol.protocol,
          protocolPath: "qGoLink",
          schema: "qGoLinkSchema",
        },
      });
      return recordRes;
    }

  /**
   * Adds a DID to the user's follow list.
   *
   * @param {QGoFollow} data - The data of the DID to follow.
   * @returns {Promise<RecordsWriteResponse>} - An object containing the status of the request.
   */
    async followDid(data: QGoFollow): Promise<RecordsWriteResponse> {
      const recordRes = await this.web5.dwn.records.create({
        data,
        message: {
          dataFormat: "application/json",
          protocol: qGoProtocol.protocol,
          protocolPath: "qGoFollow",
          schema: "qGoFollowSchema",
        },
      });
      return recordRes;
    }

  /**
   * Queries all links for connected user.
   *
   * @param {any} from - The DID to query links from (optional).
   * @returns {Promise<{status: any, recs: QGoLinkResponse[]}>} - An object containing the status and an array of link records (QGoLinkResponse[]).
   */
  async linksRecordsQuery(from?: string): Promise<{ status: any, recs: QGoLinkResponse[] }> {
    const recordsRes = await this.web5.dwn.records.query({
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
   * @returns {Promise<{status: any, recs: QGoLinkResponse[]}>} - An object containing the status and an array of link records (QGoLinkResponse[]).
   */
  async queryAllLinks(): Promise<{ status: any, recs: QGoLinkResponse[] }> {

    const followsRes = await this.followRecordsQuery();
    const recordsRes = await this.linksRecordsQuery();

    let recs: QGoLinkResponse[] = recordsRes.recs;

    for (const follow of followsRes?.recs || []) {
      const recordsRes = await this.linksRecordsQuery(follow.data.did);
      if (recordsRes?.status.code !== 200) {
        console.log(`unable to get links for followed DID: ${follow.data.did}`);
        continue;
      }
      recs = [...recs, ...recordsRes.recs];
    }
    recs = await this.filterLinkQueryRes(recs);

    return { status: recordsRes.status, recs };
  }

  /**
   * Queries all followed dids for connected user.
   *
   * @returns {Promise<{status: any, recs: QGoFollowsResponse[]}>}
   */
  async followRecordsQuery(): Promise<{ status: any, recs: QGoFollowsResponse[] }> {
    // Get records of followed dids and their links
    const recordsRes = await this.web5.dwn.records.query({
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

  async deleteRecord(recordId: string) {
    const record = await this.web5.dwn.records.delete({
      message: {
        recordId,
      },
    });
    if (record?.status.code !== 202) {
      return false;
    }
    return true;
  }

  async filterLinkQueryRes(links: QGoLinkResponse[]) {
    // Filter out deleted links and return a filtered list of data. Right now not used.
    const idMap: Map<string, QGoLinkResponse> = new Map();
    for (const link of links) {
      if (!idMap.has(link.data.name)) {
        idMap.set(link.data.name, link)
      } else if (link.record.author === this.did) {
        const existingRec = idMap.get(link.data.name);
        if (existingRec && new Date(link.record.dateCreated) > new Date(existingRec.record.dateCreated)) {
          idMap.set(link.data.name, link)
        }
      }
    }
    let recs = Array.from(idMap.values());
    return recs
  }

}

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
