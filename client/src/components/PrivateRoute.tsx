import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Import the RootState type

const PrivateRoute: React.FC = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  console.log("userData", userData);
  const isLoggedIn = !!userData;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
