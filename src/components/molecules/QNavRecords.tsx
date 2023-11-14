import React, { PropsWithChildren, useContext } from "react";
import { toast } from "react-toastify";
import { QNavContext } from "@contexts/QNavContext";
import { HiTrash as TrashIconFilled } from "react-icons/hi2";
import { HiUsers, HiLockClosed } from "react-icons/hi2";
import { QNavFollowsResponse, QNavLinkResponse } from "@src/types";

interface QNavRecordsComponent extends React.FC<PropsWithChildren> {
  Link: React.FC<{ link: QNavLinkResponse }>;
  Follow: React.FC<{ follow: QNavFollowsResponse }>;
}

const QNavRecords: QNavRecordsComponent = ({ children }) => {
  return <div className="mt-1 flex flex-col">{children}</div>;
};

QNavRecords.Link = ({ link }) => {
  const qNav = useContext(QNavContext);
  const handleDelete = async () => {
    const success = await qNav.deleteLink(link);
    if (success) {
      toast.success("Link deleted!");
    } else {
      toast.error("Unable to delete link");
    }
  };
  return (
    <div className="my-1 flex h-20 flex-col justify-center rounded-lg bg-primary-500 px-3">
      <div className="flex flex-row justify-between">
        <div className="flex min-w-0 basis-10/12 flex-col">
          {link.isExternal && (
            <HiUsers className="mr-1" size={12} title="From followed user" />
          )}
          {link.record.protocolPath === "privateLink" && (
            <HiLockClosed className="mr-1" size={12} title="Private link" />
          )}
          <p className="max-w-full text-xl">
            <span className="mr-1 inline">{link.data.name}</span>
          </p>
          <p className="max-w-full truncate text-xs font-thin">
            {link.data.url}
          </p>
        </div>
        <div className="flex min-w-0 basis-1/12 flex-col items-center justify-center">
          {!link.isExternal && (
            <button onClick={handleDelete}>
              <TrashIconFilled size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

QNavRecords.Follow = ({ follow }) => {
  const qNav = useContext(QNavContext);
  const handleDelete = async () => {
    const success = await qNav.deleteFollow(follow);
    if (success) {
      toast.success("Followed DID deleted!");
    } else {
      toast.error("Unable to delete followed DID");
    }
  };
  return (
    <div className="my-1 flex h-20 flex-col justify-center rounded-lg bg-primary-500 px-3">
      <div className="flex flex-row justify-between">
        <div className="flex min-w-0 basis-10/12 flex-col">
          <p className="max-w-full text-xl">
            {follow.data.nickname || follow.data.did}
          </p>
          <p className="max-w-full truncate text-xs font-thin">
            {follow.data.nickname ? follow.data.did : ""}
          </p>
        </div>
        <div className="flex min-w-0 basis-1/12 flex-col items-center justify-center">
          <button onClick={handleDelete}>
            <TrashIconFilled size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QNavRecords;
