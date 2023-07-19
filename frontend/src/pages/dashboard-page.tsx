import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { SideBar } from '../components/components';

export const DashboardPage: React.FC = () => {
  return (
    <Layout hasSider>
      <SideBar />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
