import React from 'react';
import { GameEvents, RoomEvents } from '../enums';
import { CellPosType, RoomInfoType, UserType } from '../types/types';
import { Room, RoomTimer } from '../components/components';
import { SocketContext } from '../context/socket';
import * as config from '../components/maze/config';

export const GamePage: React.FC = () => {
  const socket = React.useContext(SocketContext);
  const [currentRoom, setCurrentRoom] = React.useState<
    RoomInfoType | undefined
  >();
  const [maze, setMaze] = React.useState<boolean[][]>([[]]);

  const userName = sessionStorage.getItem('username');

  const handleNextStep = () => {
    if (currentRoom?.isGameStarted) socket.emit(GameEvents.STEP, currentRoom);
  };

  const handleGetWinner = (squerPosition: CellPosType, user: UserType) =>
    socket.emit(GameEvents.END, currentRoom, user, squerPosition);

  const roomProps = {
    room: currentRoom,
    maze,
    userName,
    handleNextStep,
    handleGetWinner,
  };

  React.useEffect(() => {
    socket.on(RoomEvents.OPEN, (room) => setCurrentRoom(room));
    socket.on(GameEvents.STARTED, (maze: boolean[][]) => setMaze(maze));
  }, [socket]);

  React.useEffect(() => {
    if (currentRoom?.players?.length === 2) {
      socket.emit(RoomEvents.FULL, currentRoom, config.MAZE_SIZE);
    }
  }, [currentRoom, socket]);

  return (
    <>
      {currentRoom && currentRoom.players?.length === 2 ? (
        <Room {...roomProps} />
      ) : (
        <RoomTimer />
      )}
    </>
  );
};
