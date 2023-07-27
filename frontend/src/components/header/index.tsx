import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Layout } from 'antd';

import styles from './styles.module.scss';
import { APP_ROUTES, UserEvents } from '../../enums';

type Properties = {
  username: string;
};

export const AppHeader: React.FC<Properties> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(APP_ROUTES.ROOT);
  };

  return (
    <Layout.Header className={styles.header}>
      <div>Find your way out of the maze</div>
      <div className={styles.user}>
        <p>Hello, <b>{username}</b></p>
        <Button onClick={handleLogout} >Log Out</Button>
      </div>
    </Layout.Header>
  );
};
