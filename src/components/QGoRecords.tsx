import React, { PropsWithChildren } from "react";

interface QGoRecordsComponent extends React.FC<PropsWithChildren> {
  Item: React.FC<{ name: string; url: string }>;
}

const QGoRecords: QGoRecordsComponent = ({ children }) => {
  return <div className="mt-1 flex flex-col">{children}</div>;
};

QGoRecords.Item = ({ name, url }) => {
  return (
    <div className="my-1 flex h-20 flex-col items-center overflow-x-none whitespace-pre-wrap rounded-lg bg-primary-700 px-3">
        <p className="text-xl">{name}</p>
        <p className="text-xs font-thin">{url}</p>
    </div>
  );
};

export default QGoRecords;
