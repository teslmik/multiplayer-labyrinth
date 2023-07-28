import { Button, Popconfirm } from 'antd';
import React from 'react';
import { RoomInfoType } from '../../../../types';
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
          disabled={
            !selectedRoom?.isGameStarted || selectedRoom?.players?.length !== 2
          }
        >
          Give up
        </Button>
      </Popconfirm>
      <Button
        type="primary"
        size="large"
        block
        onClick={handleExit}
        disabled={
          selectedRoom?.isGameStarted && selectedRoom?.players?.length === 2
        }
      >
        Exit
      </Button>
      <div className={styles.listContainer}>
        <ul className={styles.list} style={{ listStyle: 'none' }}>
          {selectedRoom?.players?.map((player) => (
            <li
              key={player.id}
              className={
                player.canMove
                  ? `${styles.userItem} ${styles.move}`
                  : styles.userItem
              }
            >
              {player.name}{' '}
              {selectedRoom.players?.length === 2 && player.canMove
                ? '- move'
                : ''}
            </li>
          ))}
        </ul>
      </div>
      <HistoryList currentRoom={selectedRoom} userName={userName} />
    </>
  );
};
