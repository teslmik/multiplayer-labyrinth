import React from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { APP_ROTES } from '../common/enums';
import { AppFooter, AppHeader, SideBar } from '../components/components';

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const user = sessionStorage.getItem('username');

  return (
    <Layout>
      {pathname === APP_ROTES.ROOT || !user ? null : (
        <AppHeader username={user} />
      )}
      <Layout hasSider>
        {pathname === APP_ROTES.ROOT || !user ? null : (
          <SideBar />
        )}
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout>
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
