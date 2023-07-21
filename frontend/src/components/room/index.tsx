import { Typography } from 'antd';
import React from 'react';
import { CellPosType, RoomInfoType, UserType } from '../../types/types';
import { Maze } from '../components';

import styles from './styles.module.scss';

type Properties = {
  room: RoomInfoType | undefined;
  maze: boolean[][];
  userName: string | null;
  handleNextStep: () => void;
  handleGetWinner: (squerPosition: CellPosType, player: UserType) => void;
};

export const Room: React.FC<Properties> = ({
  userName,
  room,
  maze,
  handleNextStep,
  handleGetWinner,
}) => {
  const findUser = React.useMemo(
    () => room?.players.find((player) => player.name === userName),
    [room?.players, userName],
  );

  const mazeProps = {
    maze,
    player: findUser,
    handleNextStep,
    handleGetWinner,
  };

  return (
    <div className={styles.container}>
      <Typography.Title level={2}>Room {room?.name}</Typography.Title>
      <div className={styles.canvasContainer}>
        <Maze {...mazeProps} />
      </div>
    </div>
  );
};
