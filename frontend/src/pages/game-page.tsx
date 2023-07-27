import React from 'react';
import { GameEvents, RoomEvents } from '../enums';
import { CellPosType, RoomInfoType } from '../types/types';
import { Room, RoomTimer } from '../components/components';
import { SocketContext } from '../context/socket';
import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

export const GamePage: React.FC = () => {
  const { id } = useParams();
  const socket = React.useContext(SocketContext);
  const [currentRoom, setCurrentRoom] = React.useState<
  RoomInfoType | undefined
  >();
  console.log('currentRoom: ', currentRoom);

  const userName = sessionStorage.getItem('username');

  const handleGetWinner = React.useCallback(
    (squerPosition: CellPosType) =>
      socket.emit(GameEvents.END, currentRoom, squerPosition, false),
    [currentRoom],
  );

  const handleGiveUP = React.useCallback(
    (finishPosition: CellPosType) =>
      socket.emit(GameEvents.END, currentRoom, finishPosition, true),
    [currentRoom],
  );

  const handlSetCurrentRoom = React.useCallback(
    (room: RoomInfoType) => {
      setCurrentRoom(room);
    },
    [],
  );

  const roomProps = {
    room: currentRoom,
    userName,
    handleGetWinner,
  };

  React.useEffect(() => {
    const handleUpdateRooms = (updRooms: RoomInfoType[]) => {
      if (!currentRoom && id) {
        const room = updRooms.find(room => room.id === id);
        setCurrentRoom(room);
      }
    };

    socket.on(RoomEvents.OPEN, handlSetCurrentRoom);
    socket.on(GameEvents.GIVE_UP_END, handleGiveUP);
    socket.on(RoomEvents.UPDATE, handleUpdateRooms);

    return () => {
      socket.off(RoomEvents.OPEN, handlSetCurrentRoom);
      socket.off(GameEvents.GIVE_UP_END, handleGiveUP);
      socket.off(RoomEvents.UPDATE, handleUpdateRooms);
    };
  }, [currentRoom, handlSetCurrentRoom, handleGiveUP, socket]);

  React.useEffect(() => {
    if (
      !currentRoom?.isGameEnd &&
      !currentRoom?.isGameStarted &&
      currentRoom?.players?.length === 2
    ) {
      socket.emit(RoomEvents.FULL, currentRoom);
    }
  }, [currentRoom, socket]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography.Title level={2}>Room {currentRoom?.name}</Typography.Title>
      <div style={{display: 'flex', flex: '1 1 auto', alignItems: 'center'}}>
        {currentRoom?.players?.length === 2 || currentRoom?.isGameStarted ? (
          <Room {...roomProps} />
        ) : (
          <RoomTimer room={currentRoom} />
        )}
      </div>
    </div>
  );
};
