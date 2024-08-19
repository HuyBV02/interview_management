import { createBrowserRouter } from "react-router-dom";

import Candidate from "../pages/Candidate";
import Job from "../pages/Job";
import Interview from "../pages/Interview";
import User from "../pages/User";
import Root from "../pages/Root";
// import Login from "../pages/Login";
import SignIn from "../pages/SignIn";
import Offer from "../pages/Offer";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [

      {
        path: "/job",
        element: <Job />,
      },
      {
        path: "/interview",
        element: <Interview />,
      },
      {
        path: "/candidate",
        element: <Candidate />,
      },
      {
        path: "/offer",
        element: <Offer />,
      },
      {
        path: "/user",
        element: <User />,
      },
    ]
  },
  {
    path: "/login",
    // element: <Login />,
    element: <SignIn />,
  },
]);
