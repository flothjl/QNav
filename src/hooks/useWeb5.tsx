import { useEffect, useState } from "react";
import { Web5Connection } from "../types";
import { connectWeb5 } from "../util";

export function useWeb5() {
  const [web5, setWeb5] = useState<Web5Connection>({web5: undefined, did: undefined});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    console.log("connecting to Web5...");
    const connect = async () => {
      try {
        const connectResp = await connectWeb5();
        setWeb5(connectResp);
      } catch (err) {
        setError(err);
        console.error("There was an error connecting to Web5 💔");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    connect();
  }, []);

  return { web5, isLoading, error };
}
