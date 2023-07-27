import React, { PropsWithChildren } from "react";
import GlobalLoader from "./GlobalLoader";

interface QNavRecordsComponent extends React.FC<PropsWithChildren> {
  Item: React.FC<{ name: string; url: string }>;
}

const QNavRecords: QNavRecordsComponent = ({ children }) => {
  return (
    <GlobalLoader>
      <div className="mt-1 flex flex-col">{children}</div>
    </GlobalLoader>
  );
};

QNavRecords.Item = ({ name, url }) => {
  return (
    <div className="my-1 flex h-20 flex-col justify-center rounded-lg bg-primary-500 px-3">
      <p className="text-xl">{name}</p>
      <p className="text-xs font-thin truncate max-w-full">{url}</p>
    </div>
  );
};

export default QNavRecords;
