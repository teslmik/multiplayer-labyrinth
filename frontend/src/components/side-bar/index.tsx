import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input, Layout, message, Modal, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES, RoomEvents, UserEvents } from '../../enums';
import { SocketContext } from '../../context/socket';
import { GameSidePanelItems, WaitingList } from './components/components';
import { RoomInfoType } from '../../types/types';

import styles from './styles.module.scss';

export const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const socket = React.useContext(SocketContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [rooms, setRooms] = React.useState<RoomInfoType[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [roomName, setRoomName] = React.useState('');
  const [selectedRoom, setSelectedRoom] = React.useState<
    RoomInfoType | undefined
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

  const handleExit = () => {
    socket.emit(RoomEvents.EXIT, selectedRoom?.id, userName);
    navigate(APP_ROUTES.DASHDOARD);
    setSelectedRoom(undefined);
  };

  const handleGiveUp = () => {
    if (userName) {
      socket.emit(UserEvents.GIVE_UP, selectedRoom, userName);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setRoomName('');
  };

  const handleJoinRoom = (selectedRoomId: string) => {
    socket.emit(RoomEvents.JOIN, selectedRoomId, userName);
    socket.on(RoomEvents.OPEN, (room: RoomInfoType) => setSelectedRoom(room));
    navigate(`game/${selectedRoomId}`);
  };

  const info = (message: string) => {
    console.log('message: ', message);
    messageApi.info(message);
  };

  React.useEffect(() => {
    const currentRoom = rooms.find(
      (room) => room.id === pathname.split('/')[3],
    );

    if (currentRoom) setSelectedRoom(currentRoom);

    const handleOpenRoom = (room: RoomInfoType) => setSelectedRoom(room);
    const handleUpdateRooms = (updRooms: RoomInfoType[]) =>
      setRooms(updRooms);

    socket.on(RoomEvents.OPEN, handleOpenRoom);
    socket.on(RoomEvents.UPDATE, handleUpdateRooms);
    socket.on(RoomEvents.NOTIFICATION, info);

    return () => {
      socket.off(RoomEvents.OPEN, handleOpenRoom);
      socket.off(RoomEvents.UPDATE, handleUpdateRooms);
      socket.off(RoomEvents.NOTIFICATION, info);
    };
  }, [pathname, rooms]);

  return (
    <>
      {contextHolder}
      <Layout.Sider width={250} style={{ background: colorBgContainer }}>
        <div className={styles.sideBar}>
          {pathname === `${APP_ROUTES.DASHDOARD}` ? (
            <WaitingList
              showModal={showModal}
              rooms={rooms}
              handleJoinRoom={handleJoinRoom}
            />
          ) : (
            <GameSidePanelItems
              handleExit={handleExit}
              handleGiveUp={handleGiveUp}
              selectedRoom={selectedRoom}
              userName={userName}
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
            autoFocus
          />
        </Modal>
      </Layout.Sider>
    </>
  );
};
