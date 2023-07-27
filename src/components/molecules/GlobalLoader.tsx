import React, { PropsWithChildren } from "react";
import QNavContext from "@contexts/QNavContext";

const GlobalLoader: React.FC<PropsWithChildren> = ({ children }) => {
  const qNav = React.useContext(QNavContext);
  
  return (qNav.isLoading || !qNav) ? <p>Loading!</p> : <>{children}</>
};


export default GlobalLoader;
