import { Modal, Typography } from 'antd';
import React from 'react';
import { SocketContext } from '../../context/socket';
import { RoomEvents } from '../../enums';
import { CellPosType, RoomInfoType, UserType } from '../../types/types';
import { Maze } from '../components';

import styles from './styles.module.scss';

type Properties = {
  room: RoomInfoType | undefined;
  maze: boolean[][];
  userName: string | null;
  handleNextStep: () => void;
  handleGetWinner: (squerPosition: CellPosType) => void;
};

export const Room: React.FC<Properties> = ({
  userName,
  room,
  maze,
  handleNextStep,
  handleGetWinner,
}) => {
  const [winner, setWinner] = React.useState<UserType | undefined>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const socket = React.useContext(SocketContext);
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleWiinerModal = (winner: UserType) => {
    setWinner(winner);
    setIsModalOpen(true);
  };
  React.useEffect(() => {
    socket.on(RoomEvents.MESSAGE, handleWiinerModal);

    return () => {
      socket.off(RoomEvents.MESSAGE, handleWiinerModal);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Typography.Title level={2}>Room {room?.name}</Typography.Title>
      <div className={styles.canvasContainer}>
        <Maze {...mazeProps} />
      </div>
      <Modal
        destroyOnClose
        title="Game over"
        open={isModalOpen}
        onOk={handleOk}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Player {winner?.name} has won!</p>
      </Modal>
    </div>
  );
};
