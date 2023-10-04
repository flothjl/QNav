import React, { PropsWithChildren } from "react";
import { QNavContext } from "@contexts/QNavContext";

const GlobalLoader: React.FC<PropsWithChildren> = ({ children }) => {
  const qNav = React.useContext(QNavContext);

  if (qNav.isLoading || !qNav) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="h-full w-full px-3 py-3 text-center">
          <p className="text-md">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>
};

export default GlobalLoader;
