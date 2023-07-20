import React from 'react';
import { RoomEvents } from '../enums';
import { RoomType } from '../types/types';
import { Room, RoomTimer } from '../components/components';
import { SocketContext } from '../context/socket';
import { useLocation } from 'react-router-dom';

export const GamePage: React.FC = () => {
  const { pathname } = useLocation();
  const socket = React.useContext(SocketContext);
  const [rooms, setRooms] = React.useState<RoomType[]>([]);
  const [currentRoom, setCurrentRoom] = React.useState<RoomType | undefined>();

  React.useEffect(() => {
    socket.on(RoomEvents.UPDATE, (rooms: RoomType[]) => setRooms(rooms));
    const room = rooms.find((room) => room.id === pathname.split('/')[3]);
    if (room) setCurrentRoom(room);
  }, [pathname, rooms, socket]);

  return (
    <>
      {currentRoom && currentRoom.players.length === 2 ? (
        <Room room={currentRoom} />
      ) : (
        <RoomTimer />
      )}
    </>
  );
};
