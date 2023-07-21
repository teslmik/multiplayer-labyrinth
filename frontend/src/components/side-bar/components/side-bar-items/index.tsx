import { Avatar, List } from 'antd';
import React from 'react';
import { RoomType } from '../../../../types/room.type';

import styles from './styles.module.scss';

type Properties = {
  room: Omit<RoomType, 'maze'>;
  index: number;
  handleJoinRoom: (roomId: string) => void;
};

export const SideBarItems: React.FC<Properties> = ({
  room,
  index,
  handleJoinRoom,
}) => {
  const listItemStyle =
    room.isGameStarted || room.players.length >= 2
      ? styles.roomItem
      : `${styles.roomItem} ${styles.hover}`;

  const listItemDescription = (
    <ul>
      <li>players:</li>
      {room.players.map((player, index) => (
        <li key={player.id}>{index + 1}. {player.name}</li>
      ))}
    </ul>
  );

  const listItemBottomMessage =
    room.isGameStarted || room.players.length >= 2
      ? 'game started...'
      : 'waiting player...';

  const handleOnClick = () => {
    if (room.players.length < 2) {
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
      {`Status: ${listItemBottomMessage}`}
    </List.Item>
  );
};
