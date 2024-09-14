import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Change from "./components/auth/change";
import Header from "./components/header";
import Home from "./components/home";
import Tour from "./components/tour";
import Profile from "./components/profile";

import { AuthProvider } from "./contexts/authContext";
import { useRoutes } from "react-router-dom";

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/change",
      element: <Change />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "/tour",
      element: <Tour />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <Header />
      <div className="w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
