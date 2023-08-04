import React, { PropsWithChildren, useContext } from "react";
import { toast } from "react-toastify";
import QNavContext from "@contexts/QNavContext";
import GlobalLoader from "./GlobalLoader";
import {
  HiTrash as TrashIconFilled,
} from "react-icons/hi2";
import { QGoLinkResponse } from "@src/types";

interface QNavRecordsComponent extends React.FC<PropsWithChildren> {
  Item: React.FC<{ link: QGoLinkResponse }>;
}

const QNavRecords: QNavRecordsComponent = ({ children }) => {
  return (
    <GlobalLoader>
      <div className="mt-1 flex flex-col">{children}</div>
    </GlobalLoader>
  );
};

QNavRecords.Item = ({ link }) => {
  const qNav = useContext(QNavContext);
  const handleDelete = async () => {
    const success = await qNav?.deleteLink(link);
    if (success) {
      toast.success("Link deleted!");
    } else {
      toast.error("Unable to delete link");
    }
  };
  return (
    <div className="my-1 flex h-20 flex-col justify-center rounded-lg bg-primary-500 px-3">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col min-w-0 basis-10/12">
          <p className="text-xl max-w-full">{link.data.name}</p>
          <p className="truncate text-xs font-thin max-w-full">{link.data.url}</p>
        </div>
        <div className="flex flex-col justify-center items-center min-w-0 basis-1/12">
          <button onClick={handleDelete}><TrashIconFilled size={20}/></button>
        </div>
      </div>
    </div>
  );
};

export default QNavRecords;
