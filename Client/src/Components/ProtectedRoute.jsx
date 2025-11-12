import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  try {
    return !!localStorage.getItem('token');
  } catch (e) {
    return false;
  }
};

const ProtectedRoute = ({ redirectTo = "/login" }) => {
  return isAuthenticated() ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
