import React from 'react';
import { GameEvents, RoomEvents } from '../enums';
import { CellPosType, RoomInfoType, RoomType, UserType } from '../types/types';
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
    if (currentRoom?.isGameStarted) {
      socket.emit(GameEvents.STEP, currentRoom);
    }
  };

  const handleGetWinner = React.useCallback((squerPosition: CellPosType) =>
    socket.emit(GameEvents.END, currentRoom, squerPosition), [currentRoom]);

  const handlSetCurrentRoom = React.useCallback((room: RoomType) => setCurrentRoom(room), []);
  const handleStartedGame = React.useCallback((maze: boolean[][]) => setMaze(maze), []);

  const roomProps = {
    room: currentRoom,
    maze,
    userName,
    handleNextStep,
    handleGetWinner,
  };

  React.useEffect(() => {
    socket.on(RoomEvents.OPEN, handlSetCurrentRoom);
    if (!currentRoom?.isGameStarted && !currentRoom?.isGameEnd) {
      socket.on(GameEvents.STARTED, handleStartedGame);
    }

    return () => {
      socket.off(RoomEvents.OPEN, handlSetCurrentRoom);
      socket.off(GameEvents.STARTED, handleStartedGame);
    }
  }, [currentRoom?.isGameEnd, currentRoom?.isGameStarted]);

  React.useEffect(() => {
    console.log(RoomEvents.FULL, (!currentRoom?.isGameEnd && !currentRoom?.isGameStarted && currentRoom?.players?.length === 2));
    if (!currentRoom?.isGameEnd && !currentRoom?.isGameStarted && currentRoom?.players?.length === 2) {
      socket.emit(RoomEvents.FULL, currentRoom, config.MAZE_SIZE);
    }
  }, [currentRoom]);

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
