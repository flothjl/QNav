import { FaGithub } from "react-icons/fa";
const Info = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="h-full w-full px-3">
        <h1 className="text-xl font-bold">Welcome to Qnav</h1>
        <p className="text-md">
          Qnav is a quick-navigation tool built on top of web5. It's simple:
        </p>
        <ol className="list-inside list-decimal">
          <li>Click the extension on the page you want to save.</li>
          <li>Choose a name. Can be as simple or complex as you like.</li>
          <li>
            Access your link! If your link name is "google", type "go google" in
            your address bar and hit enter!
          </li>
        </ol>
      </div>
      <div className="mt-1 justify-self-end">
        <div className="flex w-full justify-center align-middle">
          <a
            href="https://github.com/flothjl/QNav"
            target="_blank"
            className="grid place-items-center"
          >
            <FaGithub size={30} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Info;
