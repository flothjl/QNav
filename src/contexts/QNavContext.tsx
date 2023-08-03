import { createContext } from "react";
import { QGoApi } from "../types";

const QNavContext = createContext<QGoApi>({
  web5: null,
  isLoading: true,
  error: null,
  links: [],
  addLink: async () => {return false},
  queryLinks: async () => {return false},
  deleteLink: async () => {return false},
});

export default QNavContext;
