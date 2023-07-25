import React from 'react';
import { GameEvents, RoomEvents } from '../enums';
import { CellPosType, RoomInfoType } from '../types/types';
import { Room, RoomTimer } from '../components/components';
import { SocketContext } from '../context/socket';

export const GamePage: React.FC = () => {
  const socket = React.useContext(SocketContext);
  const [currentRoom, setCurrentRoom] = React.useState<
    RoomInfoType | undefined
  >();

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
    (room: RoomInfoType) => setCurrentRoom(room),
    [],
  );

  const roomProps = {
    room: currentRoom,
    userName,
    handleGetWinner,
  };

  React.useEffect(() => {
    socket.on(RoomEvents.OPEN, handlSetCurrentRoom);
    socket.on(GameEvents.GIVE_UP_END, handleGiveUP);

    return () => {
      socket.off(RoomEvents.OPEN, handlSetCurrentRoom);
      socket.off(GameEvents.GIVE_UP_END, handleGiveUP);
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
    <>
      {currentRoom?.players?.length === 2 || currentRoom?.isGameStarted ? (
        <Room {...roomProps} />
      ) : (
        <RoomTimer />
      )}
    </>
  );
};
