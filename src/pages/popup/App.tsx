import { useRef, useEffect } from "react";
import QGoContext from "../../contexts/QGoContext";
import { useQGo } from "../../hooks/useQGo";
import QGoRecords from "../../components/QGoRecords";
import { getActiveTabUrl } from "../../util";

const App = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const qGo = useQGo();
  const handleSubmit = () => {
    console.log("click");
    qGo?.addLink({
      name: nameRef.current?.value || "",
      url: urlRef.current?.value || "",
    });
  };

  useEffect(() => {
    const makeQueries = async () => {
      qGo.queryLinks();
    };
    if (!qGo.web5) return;
    makeQueries();
    const interval = setInterval(() => {
      makeQueries();
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [qGo.web5]);

  useEffect(()=> {
    getActiveTabUrl(
      (url) => {
        urlRef.current && (urlRef.current.value = url);
      }
    )
  }, [urlRef.current])

  return (
    <QGoContext.Provider value={qGo}>
      <div className="h-96 w-72 text-slate-50">
        <header className="fixed left-0 top-0 z-50 h-12 w-full bg-gradient-to-tr from-orange-400 to-cyan-600 px-3">
          <nav className="grid h-full items-center">
            <p className="text-bold text-xl">QNav</p>
          </nav>
        </header>
        <div className="flex h-screen w-screen items-center justify-center overflow-y-auto bg-gray-800 pt-14">
          <div className="h-full w-full px-3">
            <label className="mb-2 block">
              Name:
              <input
                ref={nameRef}
                type="text"
                className="w-full rounded bg-gray-600 px-3 py-2"
              />
            </label>
            <label className="mb-2 block">
              URL:
              <input
                ref={urlRef}
                type="text"
                className="w-full rounded bg-gray-600 px-3 py-2"
              />
            </label>
            <button
              className="rounded-full bg-gradient-to-tr from-orange-400 to-cyan-600 px-10 py-1 hover:to-cyan-400"
              onClick={handleSubmit}
            >
              Add QNav!
            </button>
            <div className="mt-2 border-t-2 border-gray-300"></div>
            <QGoRecords>
              {qGo?.links?.map((link, i) => {
                return (
                  <QGoRecords.Item
                    key={i}
                    url={link.data.url}
                    name={link.data.name}
                  />
                );
              })}
            </QGoRecords>
          </div>
        </div>
      </div>
    </QGoContext.Provider>
  );
};

export default App;
