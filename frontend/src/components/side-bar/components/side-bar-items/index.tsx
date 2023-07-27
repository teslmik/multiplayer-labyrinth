import { Avatar, List } from 'antd';
import React from 'react';
import { formatTime } from '../../../../helpers';
import { RoomInfoType } from '../../../../types';

import styles from './styles.module.scss';

type Properties = {
  room: RoomInfoType;
  index: number;
  handleJoinRoom: (roomId: string) => void;
};

export const SideBarItems: React.FC<Properties> = ({
  room,
  index,
  handleJoinRoom,
}) => {
  const listItemStyle =
    room.isGameStarted || room.players?.length === 2
      ? styles.roomItem
      : `${styles.roomItem} ${styles.hover}`;

  const listItemDescription = (
    <div>Created by {room.owner.name} at {formatTime(room.createdAt)}</div>
  );

  const listItemBottomMessage = () => {
    if (room.isGameStarted) {
      return 'game started...';
    } else if (!room.isGameStarted && room.players?.length === 2) {
      return 'game error!';
    } else {
      return 'waiting player...';
    }
  };

  const handleOnClick = () => {
    if (room.players && room.players?.length < 2) {
      handleJoinRoom(room.id);
    }
  };

  return (
    <List.Item className={listItemStyle} onClick={handleOnClick}>
      <List.Item.Meta
        avatar={
          <Avatar
            src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
          />
        }
        title={room.name}
        description={listItemDescription}
      />
      {`Status: ${listItemBottomMessage()}`}
    </List.Item>
  );
};
