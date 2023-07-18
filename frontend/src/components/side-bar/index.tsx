import { Button, Layout, theme } from 'antd';
import React from 'react';

import styles from './styles.module.scss';

export const SideBar: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Sider style={{ background: colorBgContainer }}>
      <div className={styles.sideBar}>
        <p>Join game or create new</p>
        <Button type='primary' size='large'>New game</Button>
      </div>
    </Layout.Sider>
  )
};
