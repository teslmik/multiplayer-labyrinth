import React from 'react';
import { Navigate } from 'react-router-dom';
import { APP_ROTES } from '../../common/enums';

export const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('username') !== null;

  return isAuthenticated ? <Navigate to={APP_ROTES.DASHDOARD} replace /> : children;
};
