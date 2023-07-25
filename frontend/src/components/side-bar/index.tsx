import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  Input,
  Layout,
  message,
  Modal,
  Select,
  theme,
} from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { APP_ROUTES, RoomEvents, SocketEvents, UserEvents } from '../../enums';
import { SocketContext } from '../../context/socket';
import { GameSidePanelItems, WaitingList } from './components/components';
import { ModalInputType, RoomInfoType } from '../../types/types';
import { CELL_SIZE, MAZE_SIZE } from '../../constants';

import styles from './styles.module.scss';

export const SideBar: React.FC = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const socket = React.useContext(SocketContext);
  const [form] = Form.useForm<ModalInputType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [rooms, setRooms] = React.useState<RoomInfoType[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState<
    RoomInfoType | undefined
  >(undefined);

  const userName = sessionStorage.getItem('username');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleNewGame = () => {
    form.validateFields().then((values) => {
      const { cellSize, mazeSize, roomName } = values;
      const id = uuidv4();

      socket.emit(
        RoomEvents.CREATE,
        { id, name: roomName, config: { mazeSize, cellSize } },
        userName,
      );

      navigate(`game/${id}`);
      setIsModalOpen(false);
      form.resetFields();
    });
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

  const showModal = () => setIsModalOpen(true);
  const info = (message: string) => messageApi.info(message);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleJoinRoom = (selectedRoomId: string) => {
    socket.emit(RoomEvents.JOIN, selectedRoomId, userName);
    socket.on(RoomEvents.OPEN, (room: RoomInfoType) => setSelectedRoom(room));
    navigate(`game/${selectedRoomId}`);
  };

  React.useEffect(() => {
    const currentRoom = rooms.find(
      (room) => room.id === id,
    );

    if (currentRoom) {
      setSelectedRoom(currentRoom);
      socket.emit(SocketEvents.RECONNECT, currentRoom);
    }

    const handleOpenRoom = (room: RoomInfoType) => setSelectedRoom(room);
    const handleUpdateRooms = (updRooms: RoomInfoType[]) => setRooms(updRooms);

    socket.on(RoomEvents.OPEN, handleOpenRoom);
    socket.on(RoomEvents.UPDATE, handleUpdateRooms);
    socket.on(RoomEvents.NOTIFICATION, info);

    return () => {
      socket.off(RoomEvents.OPEN, handleOpenRoom);
      socket.off(RoomEvents.UPDATE, handleUpdateRooms);
      socket.off(RoomEvents.NOTIFICATION, info);
    };
  }, [id, pathname, rooms, socket]);

  React.useEffect(() => {
    form.setFieldsValue({ roomName: '', mazeSize: 5, cellSize: 70 });
  }, []);

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
          <Form form={form} layout="vertical" onFinish={handleNewGame}>
            <Form.Item
              name="roomName"
              label="Room name:"
              rules={[{ required: true, message: 'Room name is required' }]}
            >
              <Input placeholder="Game room name" autoFocus />
            </Form.Item>
            <div className={styles.configContainer}>
              <Form.Item name="mazeSize" label="Maze size:">
                <Select options={MAZE_SIZE} />
              </Form.Item>
              <Form.Item name="cellSize" label="Cell size:">
                <Select options={CELL_SIZE} />
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </Layout.Sider>
    </>
  );
};
