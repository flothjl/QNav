import { useRef, useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import { QNavContext } from "@contexts/QNavContext";
import QNavRecords from "@components/molecules/QNavRecords";
import { getActiveTabUrl, isValidUrl } from "@src/util";
import Input from "@components/atoms/Input";

const Home = () => {
  const qNav = useContext(QNavContext);
  const nameRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const [nameError, setNameError] = useState<boolean | string>(false);
  const [urlError, setUrlError] = useState<boolean | string>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameHasError = nameRef.current?.value
      ? false
      : "Name for link is required";
    const urlHasError =
      urlRef.current?.value && isValidUrl(urlRef.current?.value)
        ? false
        : "Invalid URL";
    setNameError(nameHasError);
    setUrlError(urlHasError);
    if (
      !nameHasError &&
      !urlHasError &&
      nameRef?.current?.value &&
      urlRef?.current?.value
    ) {
      const success = await qNav?.addLink({
        name: nameRef.current.value,
        url: urlRef.current.value,
      });
      if (success) {
        toast.success("Link saved!");
      } else {
        toast.error("Unable to save link");
      }
    }
  };

  useEffect(() => {
    const makeQueries = async () => {
      qNav.queryLinks();
    };
    if (!qNav.web5) return;
    makeQueries();
  }, [qNav.web5, qNav.follows]);

  useEffect(() => {
    getActiveTabUrl((url) => {
      urlRef.current && (urlRef.current.value = url);
    });
  }, [urlRef.current]);

  return (
    <div className="flex items-center justify-center">
      <div className="h-full w-full px-3">
      <h1 className="text-lg mb-1 text-center">Save a Link</h1>
        <form onSubmit={handleSubmit}>
          <Input ref={nameRef} label="Name:" error={nameError} />
          <Input ref={urlRef} label="URL:" error={urlError} />
          <button className="w-full rounded-full bg-gradient-to-tr from-orange-400 to-cyan-600 px-10 py-1 text-base hover:to-cyan-400">
            Save QNav!
          </button>
        </form>
        <div className="mt-2 border-t-2 border-gray-300"></div>
        <QNavRecords>
          {qNav?.links?.map((link, i) => {
            return <QNavRecords.Link key={i} link={link} />;
          })}
        </QNavRecords>
      </div>
    </div>
  );
};

export default Home;
