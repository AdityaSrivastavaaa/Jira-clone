import { useEffect } from "react";
import AppRoutes from "./app/routes";
import { useAuthStore } from "./store/auth.store";

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, []);

  return <AppRoutes />;
}
