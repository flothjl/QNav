import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Root from "./Root";
import Social from "@components/screens/Social";
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
