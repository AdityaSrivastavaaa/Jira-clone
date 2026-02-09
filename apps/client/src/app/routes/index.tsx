import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

import Login from "../../features/auth/Login";
import Register from "../../features/auth/Register";
import AppLayout from "../layouts/AppLayout";
import type { JSX } from "react";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return null; // or loader
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
