import React, { PropsWithChildren } from "react";
import { toast } from "react-toastify";
import { QNavContext } from "@contexts/QNavContext";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  const handleDidCopy = async (did: string) => {
    try {
      await navigator.clipboard.writeText(did || "");
      toast.success("DID copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy DID to clipboard");
    }
  };
  const qNav = React.useContext(QNavContext);
  return (
    <header className="fixed left-0 top-0 z-50 h-12 w-full bg-gradient-to-tr from-orange-400 to-cyan-600 px-3">
      <nav className="h-full">
        <div className="flex h-full flex-row items-center justify-between">
          <p className="text-bold text-xl">QNav</p>
          {qNav.did && (
            <button
              onClick={() => handleDidCopy(qNav.did || "")}
              className="rounded-full bg-primary-600 px-2 py-1 hover:bg-primary-400"
            >
              Copy DID
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
