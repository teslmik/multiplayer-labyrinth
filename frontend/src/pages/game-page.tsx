import React from 'react';
import { RoomEvents } from '../common/enums';
import { RoomType } from '../common/types/types';
import { Room } from '../components/components';
import { SocketContext } from '../context/socket';

export const GamePage: React.FC = () => {
  const socket = React.useContext(SocketContext);
  const [rooms, setRooms] = React.useState<RoomType[]>([]);

  React.useEffect(() => {
    socket.on(RoomEvents.UPDATE, (rooms: RoomType[]) => setRooms(rooms));
  }, [socket]);
  return (
    <Room />
  );
}
