import { Button } from 'antd';
import React from 'react';
import { RoomInfoType } from '../../../../types/types';
import { HistoryList } from '../history-list';

import styles from './styles.module.scss';

type Properties = {
  handleBack: () => void;
  selectedRoom: RoomInfoType | undefined;
  userName: string | null;
};

export const GameSidePanelItems: React.FC<Properties> = ({
  handleBack,
  selectedRoom,
  userName
}) => {
  return (
    <>
      <Button type="primary" size="large" onClick={handleBack}>
        Give up
      </Button>
      <div className={styles.listContainer}>
        <ul style={{ listStyle: 'none' }}>
          {selectedRoom?.players.map((player) => (
            <li key={player.id}>
              {player.name}{' '}{selectedRoom.players.length === 2 && player.canMove ? 'your move' : ''}
            </li>
          ))}
        </ul>
      </div>
      <HistoryList currentRoom={selectedRoom} userName={userName} />
    </>
  );
};
