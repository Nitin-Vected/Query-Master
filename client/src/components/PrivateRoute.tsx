import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from '../app/store'; // Import the RootState type

const PrivateRoute: React.FC = () => {
  // Get user data from Redux store
  const userData = useSelector((state: RootState) => state.auth.userData);

  // Check if user is logged in
  const isLoggedIn = !!userData; // Convert to boolean

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
