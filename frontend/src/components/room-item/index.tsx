import { Avatar, List } from 'antd';
import React from 'react';
import { RoomType } from '../../common/types/room.type';

import styles from './styles.module.scss';

type Properties = {
  room: RoomType;
  index: number;
};

export const RoomItem: React.FC<Properties> = ({ room, index }) => {
  // const
  return (
    <List.Item
      className={
        room.isGameStarted ? styles.roomItem : `${styles.roomItem} ${styles.hover}`
      }
    >
      <List.Item.Meta
        avatar={
          <Avatar
            src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
          />
        }
        title={room.name}
        description={`players: ${room.players
          .map((player) => player.name)
          .join(', ')}`}
      />
      {room.isGameStarted ? 'Game started' : 'Waiting player...'}
    </List.Item>
  );
};
