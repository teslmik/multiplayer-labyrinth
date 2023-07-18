import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainLayout from './layout';
import { APP_ROUTES } from './common/enums';
import { PrivateRoute, PublicRoute } from './components/components';
import { DashboardPage, GamePage, LoginPage } from './pages';

import './App.scss';
import { Empty } from 'antd';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.ROOT} element={<MainLayout />}>
          <Route
            index
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path={APP_ROUTES.DASHDOARD}
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          >
            <Route
              index
              element={
                <PrivateRoute>
                  <Empty description="Join game or create new" />
                </PrivateRoute>
              }
            />
            <Route
              path={`${APP_ROUTES.DASHDOARD}${APP_ROUTES.GAME}`}
              element={
                <PrivateRoute>
                  <GamePage />
                </PrivateRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
