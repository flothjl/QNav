// import { HomeIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  HomeIcon as HomeIconFilled,
  UserIcon as UserIconFilled,
} from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";

const NavThumbBar = () => {
  const activeClass = clsx("bg-primary-600");
  const navLinkClass = clsx(
    "flex items-center justify-center px-6 py-2 font-semibold text-white hover:bg-primary-600"
  );
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 flex h-16 justify-center bg-gradient-to-br from-primary-500 to-primary-600">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? clsx(navLinkClass, activeClass) : navLinkClass
        }
      >
        <HomeIconFilled className="h-6 w-6" />
      </NavLink>
      <NavLink
        to="/social"
        className={({ isActive }) =>
          isActive ? clsx(navLinkClass, activeClass) : navLinkClass
        }
      >
        <UserIconFilled className="h-6 w-6" />
      </NavLink>
    </footer>
  );
};

export default NavThumbBar;
