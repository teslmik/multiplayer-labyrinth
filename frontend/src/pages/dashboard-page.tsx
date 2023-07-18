import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { RoomEvents, UserEvents } from '../common/enums';
import { RoomType, UserType } from '../common/types/types';
import { SideBar } from '../components/components';
import { SocketContext } from '../context/socket';

export const DashboardPage: React.FC = () => {
  const socket = React.useContext(SocketContext);

  const [users, setUsers] = React.useState<UserType[]>([]);
  const [rooms, setRooms] = React.useState<RoomType[]>([]);
  console.log('rooms: ', rooms);

  React.useEffect(() => {
    socket.on(UserEvents.UPDATE, (users: UserType[]) => setUsers(users));
    socket.on(RoomEvents.UPDATE, (rooms: RoomType[]) => setRooms(rooms));
  }, [socket]);

  return (
    <Layout hasSider>
      <SideBar rooms={rooms} />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
