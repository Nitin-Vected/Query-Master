import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const localStorageToken = localStorage.getItem("user_token");
  const isLoggedIn = !!localStorageToken; // Convert to boolean

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
