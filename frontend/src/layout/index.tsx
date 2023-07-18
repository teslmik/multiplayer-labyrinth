import React from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { APP_ROTES } from '../common/enums';
import { AppHeader } from '../components/app-header';
import { SideBar } from '../components/side-bar';

const { Footer, Content } = Layout;

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const user = sessionStorage.getItem('username');

  return (
    <Layout>
      {pathname === APP_ROTES.ROOT || !user ? null : (
        <AppHeader username={user} />
      )}
      <Layout hasSider>
        <SideBar/>
        <Content>
          <Outlet />
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>
        ©2023 Created by Teslenko Mikhaylo
      </Footer>
    </Layout>
  );
};

export default MainLayout;
