import { ToastContainer, toast } from "react-toastify";
import { FaGithub, FaClipboard } from "react-icons/fa";
import QNavContext from "@contexts/QNavContext";
import { useQNav } from "@hooks/useQNav";
import NavBar from "@components/molecules/NavBar";
import { Outlet } from "react-router-dom";

const Root = () => {
  const qNav = useQNav();
  const handleDidCopy = async () => {
    try {
      await navigator.clipboard.writeText(qNav.did || "");
      toast.success("DID copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy DID to clipboard");
    }
  };
  return (
    <div className="h-128 w-80 bg-primary-700">
      <QNavContext.Provider value={qNav}>
        <div className="flex h-full flex-col bg-primary-700 text-slate-50">
          <header className="fixed left-0 top-0 z-50 h-12 w-full bg-gradient-to-tr from-orange-400 to-cyan-600 px-3">
            <nav className="h-full">
              <div className="flex flex-row items-center h-full justify-between">
                <p className="text-bold text-xl">QNav</p>
                <button onClick={handleDidCopy} className="rounded-full bg-primary-600 hover:bg-primary-400 px-2 py-1">Copy DID</button>
              </div>
            </nav>
          </header>
          <main className="h-screen overflow-y-scroll pb-20 pt-14">
            <Outlet />
          </main>
          <NavBar />
        </div>
      </QNavContext.Provider>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Root;
