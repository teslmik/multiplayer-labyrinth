import React from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { APP_ROUTES } from '../enums';
import { AppFooter, AppHeader } from '../components/components';

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();

  const user = sessionStorage.getItem('username');
  const isAuth = pathname === APP_ROUTES.ROOT || !user;

  return (
    <Layout>
      {isAuth ? null : <AppHeader username={user} />}
      <Outlet />
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
