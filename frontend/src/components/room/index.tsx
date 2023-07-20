import { Typography } from 'antd';
import React from 'react';
import { Maze } from '../components';

import styles from './styles.module.scss';

export const Room: React.FC = () => {
  return (
    <div className={styles.container}>
      <Typography.Title level={2}>Room</Typography.Title>
      <Maze/>
    </div>
  )
}
