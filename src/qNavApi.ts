import { Web5, RecordsWriteResponse } from "@web5/api";
import { QNavLinkResponse, QNavFollowsResponse, QNavFollow, QNavLink, Web5Connection, QNavLinkRequest } from "./types";
import { qNavProtocol } from "./protocols";

export class QNavApi {
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
    const web5: Web5Connection = await Web5.connect({
      sync: "10s"
    });
    web5.web5 && await QNavApi.configureProtocol(web5.web5, qNavProtocol);
    return new QNavApi(web5);
  }

  /**
   * Adds a Link.
   *
   * @param {QNavLinkRequest} request - The data of the Link to add.
   * @returns {Promise<RecordsWriteResponse>} - An object containing the status of the request.
   */
  async addLink(request: QNavLinkRequest): Promise<RecordsWriteResponse> {
    const { data, isPrivate } = request;
    const protocolPath = isPrivate ? "privateLink" : "link";
    const schema = isPrivate ? qNavProtocol.types.privateLink.schema : qNavProtocol.types.link.schema;
    const recordRes = await this.web5.dwn.records.create({
      data,
      message: {
        dataFormat: "application/json",
        protocol: qNavProtocol.protocol,
        protocolPath,
        schema,
        published: !isPrivate
      },
    });
    return recordRes;
  }

  /**
   * Adds a DID to the user's follow list.
   *
   * @param {QNavFollow} data - The data of the DID to follow.
   * @returns {Promise<RecordsWriteResponse>} - An object containing the status of the request.
   */
  async followDid(data: QNavFollow): Promise<RecordsWriteResponse> {
    const recordRes = await this.web5.dwn.records.create({
      data,
      message: {
        dataFormat: "application/json",
        protocol: qNavProtocol.protocol,
        protocolPath: "follow",
        schema: qNavProtocol.types.follow.schema,
      },
    });
    return recordRes;
  }

  /**
   * Queries all links for connected user.
   *
   * @param {any} from - The DID to query links from (optional).
   * @returns {Promise<{status: any, recs: QNavLinkResponse[]}>} - An object containing the status and an array of link records (QNavLinkResponse[]).
   */
  async linksRecordsQuery(from?: string): Promise<{ status: any, recs: QNavLinkResponse[] }> {
    const recordsRes = await this.web5.dwn.records.query({
      from,
      message: {
        filter: {
          protocol: qNavProtocol.protocol,
          schema: qNavProtocol.types.link.schema,
          dataFormat: "application/json",
        },
        // TODO: import proper enum to avoid having to ts-ignore
        // @ts-ignore
        dateSort: "createdDescending",
      },
    });
    if(from){
      console.log(recordsRes)
    }
    let recs: QNavLinkResponse[] = [];
    for (const record of recordsRes?.records || []) {
      const data: QNavLink = await record.data.json();
      const id = record.id;
      // Passing isExternal: !!from because right now the author record is being set to eht requestor's did
      // https://github.com/TBD54566975/web5-js/blob/cd2425668d31f0f797bfea594dacea0fca50241d/packages/api/src/dwn-api.ts#L275
      // Issue being tracked here https://github.com/TBD54566975/web5-js/issues/231
      recs.push({ record, data, id, isExternal: !!from });
    }
    return { status: recordsRes.status, recs };
  }


  /**
   * Queries all links for connected user and all followed dids.
   *
   * @returns {Promise<{status: any, recs: QNavLinkResponse[]}>} - An object containing the status and an array of link records (QNavLinkResponse[]).
   */
  async queryAllLinks(): Promise<{ status: any, recs: QNavLinkResponse[] }> {

    const followsRes = await this.followRecordsQuery();
    const recordsRes = await this.linksRecordsQuery();

    let recs: QNavLinkResponse[] = recordsRes.recs;

    for (const follow of followsRes?.recs || []) {
      const recordsRes = await this.linksRecordsQuery(follow.data.did);
      if (recordsRes?.status.code !== 200) {
        console.log(`unable to get links for followed DID: ${follow.data.did}`);
        continue;
      }
      recs = [...recs, ...recordsRes.recs];
    }

    return { status: recordsRes.status, recs };
  }

  /**
   * Queries all followed dids for connected user.
   *
   * @returns {Promise<{status: any, recs: QNavFollowsResponse[]}>}
   */
  async followRecordsQuery(): Promise<{ status: any, recs: QNavFollowsResponse[] }> {
    // Get records of followed dids and their links
    const recordsRes = await this.web5.dwn.records.query({
      message: {
        filter: {
          protocol: qNavProtocol.protocol,
          schema: qNavProtocol.types.follow.schema,
          dataFormat: "application/json",
        },
        // TODO: import proper enum to avoid having to ts-ignore
        // @ts-ignore
        dateSort: "createdDescending",
      },
    });

    let recs: QNavFollowsResponse[] = [];
    for (const record of recordsRes?.records || []) {
      const data: QNavFollow = await record.data.json();
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

}
