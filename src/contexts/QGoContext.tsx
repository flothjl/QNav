import { createContext } from "react";
import { QGoApi } from "../types";

const QGoContext = createContext<QGoApi>({
  web5: null,
  isLoading: true,
  error: null,
  links: [],
  addLink: async () => {},
  queryLinks: async () => {},
});

export default QGoContext;
