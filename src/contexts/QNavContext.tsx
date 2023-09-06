import { createContext } from "react";
import { QNavHook } from "../types";

const QNavContext = createContext<QNavHook>({} as QNavHook);

export default QNavContext;
