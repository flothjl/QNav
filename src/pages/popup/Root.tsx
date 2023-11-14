import { ToastContainer } from "react-toastify";
import { QNavContextProvider } from "@contexts/QNavContext";
import NavBar from "@components/molecules/NavBar";
import { Outlet } from "react-router-dom";
import Header from "@src/components/molecules/Header";
import GlobalLoader from "@src/components/molecules/GlobalLoader";

const Root = () => {
  return (
    <div className="h-128 w-80 bg-primary-700">
      <QNavContextProvider>
        <div className="flex h-full flex-col bg-primary-700 text-slate-50">
          <Header />
          <main className="h-screen overflow-y-scroll pb-20 pt-14">
            <GlobalLoader>
              <Outlet />
            </GlobalLoader>
          </main>
          <NavBar />
        </div>
      </QNavContextProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="light"
      />
    </div>
  );
};

export default Root;
