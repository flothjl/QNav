import { useContext, useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { QNavContext } from "@contexts/QNavContext";
import QNavRecords from "@components/molecules/QNavRecords";
import { isValidDid } from "@src/util";
import Input from "@components/atoms/Input";

const Social = () => {
  const qNav = useContext(QNavContext);
  const nameRef = useRef<HTMLInputElement>(null);
  const didRef = useRef<HTMLInputElement>(null);
  const [didError, setDidError] = useState<boolean | string>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const didHasError =
      didRef.current?.value && isValidDid(didRef.current?.value)
        ? false
        : "Invalid DID";
    setDidError(didHasError);
    if (!didHasError && didRef?.current?.value) {
      const success = await qNav?.addFollow({
        nickname: nameRef.current?.value,
        did: didRef.current.value,
      });
      if (success) {
        toast.success("DID followed!");
      } else {
        toast.error("Unable to follow DID");
      }
    }
  };

  useEffect(() => {
    const makeQueries = async () => {
      qNav.queryFollows();
    };
    if (!qNav.web5) return;
    makeQueries();
  }, [qNav.web5]);

  return (
    <div className="flex items-center justify-center">
      <div className="h-full w-full px-3">
        <h1 className="text-lg mb-1 text-center">Follow a DID</h1>
        <form onSubmit={handleSubmit}>
          <Input ref={nameRef} label="Name:" />
          <Input ref={didRef} label="DID:" error={didError} />
          <button className="w-full rounded-full bg-gradient-to-tr from-orange-400 to-cyan-600 px-10 py-1 text-base hover:to-cyan-400">
            Follow DID
          </button>
        </form>
        <div className="mt-2 border-t-2 border-gray-300"></div>
        <QNavRecords>
          {qNav?.follows?.map((follow, i) => {
            return <QNavRecords.Follow key={i} follow={follow} />;
          })}
        </QNavRecords>
      </div>
    </div>
  );
};

export default Social;
