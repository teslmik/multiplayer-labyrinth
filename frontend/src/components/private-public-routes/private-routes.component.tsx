import React from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '../../common/enums';

export const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('username') !== null;

  return isAuthenticated ? children : <Navigate to={APP_ROUTES.ROOT} replace />;
};
