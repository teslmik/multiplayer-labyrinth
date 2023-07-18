import { Button, Layout, theme } from 'antd';
import React from 'react';

import styles from './styles.module.scss';

export const SideBar: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout.Sider className={styles.sideBar} style={{ background: colorBgContainer }}>
      <Button size='large'>New game</Button>
    </Layout.Sider>
  )
};
