import { Modal, Typography } from 'antd';
import React from 'react';
import { SocketContext } from '../../context/socket';
import { RoomEvents } from '../../enums';
import { CellPosType, RoomInfoType } from '../../types/types';
import { Maze } from '../components';

import styles from './styles.module.scss';

type Properties = {
  room: RoomInfoType | undefined;
  userName: string | null;
  handleGetWinner: (squerPosition: CellPosType) => void;
};

export const Room: React.FC<Properties> = ({
  userName,
  room,
  handleGetWinner,
}) => {
  const [message, setMessage] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const socket = React.useContext(SocketContext);
  const findUser = React.useMemo(
    () => room?.players.find((player) => player.name === userName),
    [room?.players, userName],
  );

  const mazeProps = {
    player: findUser,
    handleGetWinner,
    room
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleWiinerModal = (message: string) => {
    setMessage(message);
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
        <p>{message}</p>
      </Modal>
    </div>
  );
};
