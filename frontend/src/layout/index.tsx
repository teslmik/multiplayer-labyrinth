import React from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { APP_ROUTES, SocketEvents } from '../enums';
import { AppFooter, AppHeader } from '../components';
import { SocketContext } from '../context/socket';

const MainLayout: React.FC = () => {
  const { pathname } = useLocation();
  const socket = React.useContext(SocketContext);

  const user = sessionStorage.getItem('username');
  const isAuth = pathname === APP_ROUTES.ROOT || !user;

  React.useEffect(() => {
    socket.emit(SocketEvents.CONNECTION);
  }, []);

  return (
    <Layout>
      {isAuth ? null : <AppHeader username={user} />}
      <Outlet />
      <AppFooter />
    </Layout>
  );
};

export default MainLayout;
