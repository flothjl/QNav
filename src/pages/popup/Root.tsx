import { ToastContainer } from "react-toastify";

import QNavContext from "@contexts/QNavContext";
import { useQNav } from "@hooks/useQNav";
import NavThumbBar from "@components/molecules/NavThumbBar";
import { Outlet } from "react-router-dom";

const Root = () => {
  const qNav = useQNav();

  return (
    <div className="h-128 w-80 bg-primary-700">
      <QNavContext.Provider value={qNav}>
        <div className="flex h-full flex-col bg-primary-700 text-slate-50">
          <header className="fixed left-0 top-0 z-50 h-12 w-full bg-gradient-to-tr from-orange-400 to-cyan-600 px-3">
            <nav className="grid h-full items-center">
              <p className="text-bold text-xl">QNav</p>
            </nav>
          </header>
          <main className="h-screen overflow-y-scroll pb-20 pt-14">
            <Outlet />
          </main>
          <NavThumbBar />
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
