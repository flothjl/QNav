import { createContext } from "react";
import { QNavHook } from "../types";

const QNavContext = createContext<QNavHook>({
  web5: null,
  did: null,
  isLoading: true,
  error: null,
  links: [],
  follows: [],
  addLink: async () => {
    return false;
  },
  queryLinks: async () => {
    return false;
  },
  deleteLink: async () => {
    return false;
  },
  addFollow: async () => {
    return false;
  },
  queryFollows: async () => {
    return false;
  },
  deleteFollow: async () => {
    return false;
  },
});

export default QNavContext;
