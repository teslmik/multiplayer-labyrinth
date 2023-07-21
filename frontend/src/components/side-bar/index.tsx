import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input, Layout, Modal, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES, RoomEvents, UserEvents } from '../../enums';
import { SocketContext } from '../../context/socket';
import { GameSidePanelItems, WaitingList } from './components/components';
import { RoomType, UserType } from '../../types/types';

import styles from './styles.module.scss';

export const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const socket = React.useContext(SocketContext);
  const [rooms, setRooms] = React.useState<Omit<RoomType, 'maze'>[]>([]);
  const [users, setUsers] = React.useState<UserType[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [roomName, setRoomName] = React.useState('');
  const [selectedRoom, setSelectedRoom] = React.useState<
    Omit<RoomType, 'maze'> | undefined
  >(undefined);

  const userName = sessionStorage.getItem('username');

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setRoomName(value);
  };

  const handleNewGame = () => {
    if (!roomName.trim()) {
      return;
    }

    const roomId = uuidv4();

    socket.emit(RoomEvents.CREATE, { id: roomId, name: roomName }, userName);

    navigate(`game/${roomId}`);
    setIsModalOpen(false);
    setRoomName('');
  };

  const handleBack = () => {
    socket.emit(RoomEvents.EXIT, selectedRoom?.id, userName);
    navigate(APP_ROUTES.DASHDOARD);
    setSelectedRoom(undefined);
  };

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    setRoomName('');
  };

  const handleJoinRoom = (selectedRoomId: string) => {
    socket.emit(RoomEvents.JOIN, selectedRoomId, userName);
    socket.on(RoomEvents.OPEN, (room: RoomType) => setSelectedRoom(room));
    navigate(`game/${selectedRoomId}`);
  };

  React.useEffect(() => {
    const currentRoom = rooms.find(
      (room) => room.id === pathname.split('/')[3],
    );

    if (currentRoom) setSelectedRoom(currentRoom);

    const handleUpdateUsers = (users: UserType[]) => setUsers(users);
    const handleOpenRoom = (room: RoomType) => setSelectedRoom(room);
    const handleUpdateRooms = (updRooms: Omit<RoomType, 'maze'>[]) =>
      setRooms(updRooms);

    socket.on(RoomEvents.OPEN, handleOpenRoom);
    socket.on(RoomEvents.UPDATE, handleUpdateRooms);
    socket.on(UserEvents.UPDATE, handleUpdateUsers);

    return () => {
      socket.off(RoomEvents.OPEN, handleOpenRoom);
      socket.off(RoomEvents.UPDATE, handleUpdateRooms);
      socket.off(UserEvents.UPDATE, handleUpdateUsers);
    };
  }, [pathname, rooms, socket]);

  return (
    <Layout.Sider style={{ background: colorBgContainer, maxWidth: '300px' }}>
      <div className={styles.sideBar}>
        {pathname === `${APP_ROUTES.DASHDOARD}` ? (
          <WaitingList
            showModal={showModal}
            rooms={rooms}
            handleJoinRoom={handleJoinRoom}
          />
        ) : (
          <GameSidePanelItems
            handleBack={handleBack}
            selectedRoom={selectedRoom}
          />
        )}
      </div>
      <Modal
        title="Enter game room name"
        open={isModalOpen}
        onOk={handleNewGame}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Game room name"
          onChange={handleOnChange}
          onPressEnter={handleNewGame}
          value={roomName}
        />
      </Modal>
    </Layout.Sider>
  );
};