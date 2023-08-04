import { useState } from "react";
import { qGoProtocol as QGoProtocol } from "../protocols";
import { useWeb5 } from "./useWeb5";
import { QGoApi, QGoLink, QGoLinkResponse } from "../types";
import { linksRecordsQuery, parseAndFilterLinkQueryRes } from "../util";

export function useQNav(): QGoApi {
  const [links, setLinks] = useState<any[]>([]);

  const { web5, isLoading, error } = useWeb5();

  const queryLinks = async (): Promise<boolean> => {
    const recordsRes = web5?.web5 && (await linksRecordsQuery(web5?.web5));
    if (recordsRes?.status.code !== 200) {
      // console.log('error getting records')
      return false;
    }
    let recs: QGoLinkResponse[] = await parseAndFilterLinkQueryRes(recordsRes);
    setLinks(recs);
    return true;
  };

  const queryFollowed = async () => {
    const recordsRes = web5?.web5 && (await linksRecordsQuery(web5?.web5));
    let recs: any[] = [];
    for (const record of recordsRes?.records || []) {
      const data = await record.data.json();
      const id = record.id;
      recs.push({ record, data, id });
    }
    setLinks(recs);
  };

  const addLink = async (value: QGoLink): Promise<boolean> => {
    const record = await web5?.web5?.dwn.records.create({
      data: value,
      message: {
        dataFormat: "application/json",
        protocol: QGoProtocol.protocol,
        protocolPath: "qGoLink",
        schema: "qGoLinkSchema",
      },
    });
    console.log(record);
    if (record?.status.code !== 202) {
      return false;
    }
    const { status: sendStatus } = await record?.record?.send(web5?.did || "");
    if (sendStatus.code !== 202) {
      console.warn("unable to send record to remote dwn");
    }
    queryLinks();
    return true;
  };

  const deleteLink = async (link: any): Promise<boolean> => {
    const updatedShowData = { ...link.data };
    updatedShowData.isDeleted = true;
    const deleteRes = await link.record.update({ data: updatedShowData });
    if (deleteRes?.status.code !== 202) {
      console.warn("Unable to delete link");
      console.log(deleteRes);
      return false;
    }
    queryLinks();
    return true;
  };

  return {
    web5,
    isLoading,
    error,
    links,
    addLink,
    queryLinks,
    deleteLink,
  };
}
