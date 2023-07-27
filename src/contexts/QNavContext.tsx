import { createContext } from "react";
import { QGoApi } from "../types";

const QNavContext = createContext<QGoApi>({
  web5: null,
  isLoading: true,
  error: null,
  links: [],
  addLink: async () => {},
  queryLinks: async () => {},
  deleteLink: async () => {},
});

export default QNavContext;
