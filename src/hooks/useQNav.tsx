import { useEffect, useState } from "react";
import { qGoProtocol } from "../protocols";
import {
  QNavHook,
  QGoFollow,
  QGoFollowsResponse,
  QGoLink,
  QGoLinkResponse,
} from "../types";
import { QGoApi } from "../util";

export function useQNav(): QNavHook {
  const [links, setLinks] = useState<QGoLinkResponse[]>([]);
  const [follows, setFollows] = useState<QGoFollowsResponse[]>([]);
  const [qGoApi, setQGoApi] = useState<QGoApi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const createApi = async () => {
      try {
        setQGoApi(await QGoApi.create());
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    createApi();
  }, [])

  const queryLinks = async (): Promise<boolean> => {
    const links = await qGoApi?.queryAllLinks();
    if (links?.status.code !== 200) {
      return false;
    }
    setLinks(links.recs || []);
    return true;
  };

  const queryFollows = async () => {
    const follows = await qGoApi?.followRecordsQuery();
    if (follows?.status.code !== 200) {
      return false;
    }
    setFollows(follows?.recs || []);
    return true;
  };

  const addFollow = async (data: QGoFollow) => {
    const record = await qGoApi?.web5.dwn.records.create({
      data,
      message: {
        dataFormat: "application/json",
        protocol: qGoProtocol.protocol,
        protocolPath: "qGoFollow",
        schema: "qGoFollowSchema",
      },
    });
    if (record?.status.code !== 202) {
      return false;
    }
    const { status: sendStatus } = await record?.record?.send(qGoApi?.did || "");
    if (sendStatus.code !== 202) {
      console.warn("unable to send record to remote dwn");
    }
    queryFollows();
    return true;
  };

  const addLink = async (value: QGoLink): Promise<boolean> => {
    const record = await qGoApi?.web5.dwn.records.create({
      data: value,
      message: {
        dataFormat: "application/json",
        protocol: qGoProtocol.protocol,
        protocolPath: "qGoLink",
        schema: "qGoLinkSchema",
      },
    });
    if (record?.status.code !== 202) {
      return false;
    }
    const { status: sendStatus } = await record?.record?.send(qGoApi?.did || "");
    if (sendStatus.code !== 202) {
      console.warn("unable to send record to remote dwn");
    }
    queryLinks();
    return true;
  };

  const deleteLink = async (link: QGoLinkResponse): Promise<boolean> => {
    const isSuccess = await qGoApi?.deleteRecord(link.id);
    queryLinks();
    return isSuccess || false;
  };

  const deleteFollow = async (link: QGoFollowsResponse): Promise<boolean> => {
    const isSuccess = await qGoApi?.deleteRecord(link.id);
    queryFollows();
    return isSuccess || false;
  };

  return {
    web5: qGoApi?.web5 || null,
    did: qGoApi?.did || null,
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
