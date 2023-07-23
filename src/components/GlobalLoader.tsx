import React, { PropsWithChildren } from "react";
import QGoContext from "../contexts/QGoContext";

const GlobalLoader: React.FC<PropsWithChildren> = ({ children }) => {
  const qGo = React.useContext(QGoContext);
  console.log('loading component')
  console.log(qGo.isLoading)
  
  return (qGo.isLoading || !qGo) ? <p>Loading!</p> : <>{children}</>
};


export default GlobalLoader;
