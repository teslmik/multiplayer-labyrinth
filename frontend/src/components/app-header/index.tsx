import { Layout } from 'antd';
import React from 'react';

import styles from './styles.module.scss';

type Properties = {
  username: string;
};

export const AppHeader: React.FC<Properties> = ({ username }) => {
  return (
    <Layout.Header className={styles.header}>
      <div>Find your way out of the maze</div>
      <div>
        Hello, <b>{username}</b>
      </div>
    </Layout.Header>
  );
};
