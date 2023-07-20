import { Button, Input, Layout, List, Modal, theme } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES, RoomEvents } from '../../enums';
import { RoomType } from '../../types/room.type';
import { SocketContext } from '../../context/socket';
import { SideBarItems } from '../components';

import styles from './styles.module.scss';

export const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const socket = React.useContext(SocketContext);
  const [rooms, setRooms] = React.useState<RoomType[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [roomName, setRoomName] = React.useState('');
  const [selectedRoom, setSelectedRoom] = React.useState<RoomType | undefined>(
    undefined,
  );

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

    const { id: roomId } = socket.emit(
      RoomEvents.CREATE,
      { id: socket.id, name: roomName },
      userName,
    );

    navigate(`game/${roomId}`);
    setIsModalOpen(false);
    setRoomName('');
  };

  const handleBack = () => {
    socket.emit(RoomEvents.EXIT, selectedRoom?.id, userName);
    navigate(APP_ROUTES.DASHDOARD);
    setSelectedRoom(undefined);
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
    socket.on(RoomEvents.OPEN, (room: RoomType) => setSelectedRoom(room));
    navigate(`game/${selectedRoomId}`);
  };


  React.useEffect(() => {
    const currentRoom = rooms.find(
      (room) => room.id === pathname.split('/')[3],
    );

    if (currentRoom) setSelectedRoom(currentRoom);

    const handleOpenRoom = (room: RoomType) => setSelectedRoom(room);
    const handleUpdateRooms = (updatedRooms: RoomType[]) =>
      setRooms(updatedRooms);

    socket.on(RoomEvents.OPEN, handleOpenRoom);
    socket.on(RoomEvents.UPDATE, handleUpdateRooms);

    return () => {
      socket.off(RoomEvents.OPEN, handleOpenRoom);
      socket.off(RoomEvents.UPDATE, handleUpdateRooms);
    };
  }, [pathname, rooms, socket]);

  return (
    <Layout.Sider style={{ background: colorBgContainer, maxWidth: '300px' }}>
      <div className={styles.sideBar}>
        {pathname === `${APP_ROUTES.DASHDOARD}` ? (
          <>
            <Button type="primary" size="large" onClick={showModal}>
              New game
            </Button>
            <List
              style={{ width: '100%' }}
              bordered
              dataSource={rooms}
              renderItem={(item, index) => (
                <SideBarItems
                  room={item}
                  index={index}
                  handleJoinRoom={handleJoinRoom}
                />
              )}
            />
          </>
        ) : (
          <>
            <Button type="primary" size="large" onClick={handleBack}>
              Give up
            </Button>
            <div>
              <ul>
                {selectedRoom?.players.map((player) => (
                  <li key={player.id}>{player.name}</li>
                ))}
              </ul>
            </div>
          </>
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
