import React, { PropsWithChildren } from "react";
import GlobalLoader from "./GlobalLoader";

interface QGoRecordsComponent extends React.FC<PropsWithChildren> {
  Item: React.FC<{ name: string; url: string }>;
}

const QGoRecords: QGoRecordsComponent = ({ children }) => {
  return <div className="mt-1 flex flex-col">{children}</div>;
};

QGoRecords.Item = ({ name, url }) => {
  return (
    <GlobalLoader>
      <div className="overflow-x-none my-1 flex h-20 flex-col items-center whitespace-pre-wrap rounded-lg bg-primary-700 px-3">
        <p className="text-xl">{name}</p>
        <p className="text-xs font-thin">{url}</p>
      </div>
    </GlobalLoader>
  );
};

export default QGoRecords;
