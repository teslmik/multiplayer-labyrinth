import { Typography } from 'antd';
import React from 'react';
import { RoomType } from '../../types/types';
import { Maze } from '../components';

import styles from './styles.module.scss';

export const Room: React.FC<{ room: RoomType | undefined }> = ({ room }) => {
  return (
    <div className={styles.container}>
      <Typography.Title level={2}>Room {room?.name}</Typography.Title>
      <div className={styles.canvasContainer}>
        <Maze />
      </div>
    </div>
  )
};
