import React from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from '../../enums';

export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('username') !== null;

  return isAuthenticated ? <Navigate to={APP_ROUTES.DASHDOARD} replace /> : children;
};
