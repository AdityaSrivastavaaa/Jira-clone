import Login from "../../features/auth/Login";
import Register from "../../features/auth/Register";

export const authRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];
