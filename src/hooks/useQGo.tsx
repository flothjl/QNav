import { useState } from "react";
import { toast } from "react-toastify";
import { qGoProtocol as QGoProtocol } from "../protocols";
import { useWeb5 } from "./useWeb5";
import { QGoApi, QGoLink } from "../types";
import { linksRecordsQuery } from "../util";

export function useQGo(): QGoApi {
  const [links, setLinks] = useState<any[]>([]);

  const { web5, isLoading, error } = useWeb5();

  const queryLinks = async () => {
    const recordsRes = web5?.web5 && (await linksRecordsQuery(web5?.web5));
    let recs: any[] = [];
    for (const record of recordsRes?.records || []) {
      const data = await record.data.json();
      const id = record.id;
      recs.push({ record, data, id });
    }
    setLinks(recs);
  };

  const addLink = async (value: QGoLink) => {
    const record = await web5?.web5?.dwn.records.create({
      data: value,
      message: {
        dataFormat: "application/json",
        protocol: QGoProtocol.protocol,
        protocolPath: "qGoLink",
        schema: "qGoLinkSchema",
      },
    });
    await record?.record?.send(web5?.did || "");
    toast.success("Link added!");
  };

  const deleteLink = async (link: any) => {
    const updatedShowData = { ...link.data };
    updatedShowData.isComplete = true;
    await link.record.update({ data: updatedShowData });
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
