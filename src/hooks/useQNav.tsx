import { useState } from "react";
import { qGoProtocol } from "../protocols";
import { useWeb5 } from "./useWeb5";
import {
  QGoApi,
  QGoFollow,
  QGoFollowsResponse,
  QGoLink,
  QGoLinkResponse,
} from "../types";
import {
  deleteRecord,
  followRecordsQuery,
  linksRecordsQuery,
  filterLinkQueryRes,
} from "../util";

export function useQNav(): QGoApi {
  const [links, setLinks] = useState<QGoLinkResponse[]>([]);
  const [follows, setFollows] = useState<QGoFollowsResponse[]>([]);

  const { web5, isLoading, error } = useWeb5();

  const queryLinks = async (): Promise<boolean> => {
    const followsRes = web5?.web5 && (await followRecordsQuery(web5.web5));
    const recordsRes = web5?.web5 && (await linksRecordsQuery(web5.web5));
    if (recordsRes?.status.code !== 200) {
      return false;
    }

    let recs: QGoLinkResponse[] = recordsRes.recs;

    for (const follow of followsRes?.recs || []) {
      const recordsRes =
        web5?.web5 && (await linksRecordsQuery(web5.web5, follow.data.did));
      if (recordsRes?.status.code !== 200) {
        console.log(`unable to get links for followed DID: ${follow.data.did}`);
        continue;
      }
      recs = [...recs, ...recordsRes.recs];
    }

    recs = await filterLinkQueryRes(recs);
    setLinks(recs);
    return true;
  };

  const queryFollows = async () => {
    const follows = web5?.web5 && (await followRecordsQuery(web5.web5));
    if (follows?.status.code !== 200) {
      return false;
    }
    setFollows(follows?.recs || []);
    return true;
  };

  const addFollow = async (data: QGoFollow) => {
    const record = await web5?.web5?.dwn.records.create({
      data,
      message: {
        dataFormat: "application/json",
        protocol: qGoProtocol.protocol,
        protocolPath: "qGoFollow",
        schema: "qGoFollowSchema",
      },
    });
    if (record?.status.code !== 202) {
      console.log(record)
      return false;
    }
    const { status: sendStatus } = await record?.record?.send(web5?.did || "");
    if (sendStatus.code !== 202) {
      console.warn("unable to send record to remote dwn");
    }
    queryFollows();
    return true;
  };

  const addLink = async (value: QGoLink): Promise<boolean> => {
    const record = await web5?.web5?.dwn.records.create({
      data: value,
      message: {
        dataFormat: "application/json",
        protocol: qGoProtocol.protocol,
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

  const deleteLink = async (link: QGoLinkResponse): Promise<boolean> => {
    const isSuccess = web5?.web5 && (await deleteRecord(web5.web5, link.id));
    queryLinks();
    return isSuccess || false;
  };

  const deleteFollow = async (link: QGoFollowsResponse): Promise<boolean> => {
    const isSuccess = web5?.web5 && (await deleteRecord(web5.web5, link.id));
    queryFollows();
    return isSuccess || false;
  };

  return {
    web5,
    isLoading,
    error,
    links,
    follows,
    addLink,
    queryLinks,
    deleteLink,
    deleteFollow,
    queryFollows,
    addFollow,
  };
}
