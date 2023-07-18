import React from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROTES } from '../../common/enums';

export const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('username') !== null;

  return isAuthenticated ? children : <Navigate to={APP_ROTES.ROOT} replace />;
};
