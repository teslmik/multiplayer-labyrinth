import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('username') !== null;

  return isAuthenticated ? children : <Navigate to={'/'} replace />;
};
