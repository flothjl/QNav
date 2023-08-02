import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Root from "./Root";
import Social from "@components/screens/Social";
import Info from "@components/screens/Info";
import Home from "@components/screens/Home";

const App = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "/social",
          element: <Social />
        },
        {
          path: "/info",
          element: <Info/>
        },
        {
          path: "/",
          element: <Home />
        }
      ]
    }
  ]

  return (
    <RouterProvider router={createMemoryRouter(routes)}/>
  );
};

export default App;
