import { Button, Popconfirm } from 'antd';
import React from 'react';
import { RoomInfoType } from '../../../../types/types';
import { HistoryList } from '../history-list';

import styles from './styles.module.scss';

type Properties = {
  handleExit: () => void;
  handleGiveUp: () => void;
  selectedRoom: RoomInfoType | undefined;
  userName: string | null;
};

export const GameSidePanelItems: React.FC<Properties> = ({
  handleExit,
  handleGiveUp,
  selectedRoom,
  userName,
}) => {
  return (
    <>
      <Popconfirm
        placement="rightTop"
        title="Are you sure you want to give up?"
        onConfirm={handleGiveUp}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="primary"
          size="large"
          block
          disabled={!selectedRoom?.isGameStarted}
        >
          Give up
        </Button>
      </Popconfirm>
      {/* <Popconfirm
        placement="rightTop"
        title="Are you sure you want to exit?"
        onConfirm={handleExit}
        okText="Yes"
        cancelText="No"
      > */}
        <Button
          type="primary"
          size="large"
          block
          onClick={handleExit}
          disabled={selectedRoom?.isGameStarted}
        >
          Exit
        </Button>
      {/* </Popconfirm> */}
      <div className={styles.listContainer}>
        <ul style={{ listStyle: 'none' }}>
          {selectedRoom?.players.map((player) => (
            <li key={player.id}>
              {player.name}{' '}
              {selectedRoom.players.length === 2 && player.canMove
                ? 'your move'
                : ''}
            </li>
          ))}
        </ul>
      </div>
      <HistoryList currentRoom={selectedRoom} userName={userName} />
    </>
  );
};
