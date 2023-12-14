import { useEffect, useState } from "react";
import {
  QNavHook,
  QNavFollow,
  QNavFollowsResponse,
  QNavLink,
  QNavLinkResponse,
  QNavLinkRequest,
} from "@src/types";
import { QNavApi } from "@src/qNavApi";

export function useQNav(): QNavHook {
  const [links, setLinks] = useState<QNavLinkResponse[]>([]);
  const [follows, setFollows] = useState<QNavFollowsResponse[]>([]);
  const [qNavApi, setQNavApi] = useState<QNavApi | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const createApi = async () => {
      try {
        setQNavApi(await QNavApi.create());
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
    const links = await qNavApi?.queryAllLinks();
    if (links?.status.code !== 200) {
      return false;
    }
    setLinks(links.recs || []);
    return true;
  };

  const queryFollows = async () => {
    const follows = await qNavApi?.followRecordsQuery();
    if (follows?.status.code !== 200) {
      return false;
    }
    setFollows(follows?.recs || []);
    return true;
  };

  const addFollow = async (data: QNavFollow) => {
    const record = await qNavApi?.followDid(data);
    if (record?.status.code !== 202) {
      return false;
    }
    const sendStatus = await record?.record?.send(qNavApi?.did || "");
    if (sendStatus?.status.code !== 202) {
      console.warn("unable to send record to remote dwn");
    }
    queryFollows();
    return true;
  };

  const addLink = async (data: QNavLink, isPrivate: boolean = false): Promise<boolean> => {
    const request: QNavLinkRequest = {data, isPrivate}
    const record = await qNavApi?.addLink(request);
    if (record?.status.code !== 202) {
      return false;
    }
    const sendStatus = await record?.record?.send(qNavApi?.did || "");
    if (sendStatus?.status.code !== 202) {
      console.warn("unable to send record to remote dwn");
    }
    queryLinks();
    return true;
  };

  const deleteLink = async (link: QNavLinkResponse): Promise<boolean> => {
    const isSuccess = await qNavApi?.deleteRecord(link.id);
    queryLinks();
    return isSuccess || false;
  };

  const deleteFollow = async (link: QNavFollowsResponse): Promise<boolean> => {
    const isSuccess = await qNavApi?.deleteRecord(link.id);
    queryFollows();
    return isSuccess || false;
  };

  return {
    web5: qNavApi?.web5,
    did: qNavApi?.did,
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
