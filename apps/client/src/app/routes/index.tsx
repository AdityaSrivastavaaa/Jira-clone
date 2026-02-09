import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, type JSX } from "react";
import { useAuthStore } from "../../store/auth.store";

import AppLayout from "../layouts/AppLayout";
import Login from "../../features/auth/Login";
import Register from "../../features/auth/Register";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading, fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
