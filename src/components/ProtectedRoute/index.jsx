import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem("accessToken");

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export const PublicRoute = () => {
  const isAuthenticated = localStorage.getItem("accessToken");
  return isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Outlet />;
};
