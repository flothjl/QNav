import { createContext, useState } from "react";
import { QNavHook } from "../types";
import { useQNav } from "@src/hooks/useQNav";

export const QNavContext = createContext<QNavHook>({} as QNavHook);

export const QNavContextProvider = ({ children }: React.PropsWithChildren) => {
  const qNav = useQNav();
  return <QNavContext.Provider value={qNav}>{children}</QNavContext.Provider>;
};
