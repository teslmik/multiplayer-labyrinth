import React from 'react';
import { Form, Input, Layout, Modal, Select, Spin, theme } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { APP_ROUTES, RoomEvents, SocketEvents, UserEvents } from '../../enums';
import { SocketContext } from '../../context/socket';
import { GameSidePanelItems, WaitingList } from './components';
import { ModalInputType, RoomInfoType } from '../../types';
import { CELL_SIZE, MAZE_SIZE } from '../../constants';
import { RoomService } from '../../services/room.service';
import { useAppMessage } from '../../hooks/use-app-message';

import styles from './styles.module.scss';

export const SideBar: React.FC = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const socket = React.useContext(SocketContext);
  const [form] = Form.useForm<ModalInputType>();
  const { appMessage, contextHolder } = useAppMessage();
  const [isLoading, setIsLoading] = React.useState(false);
  const [rooms, setRooms] = React.useState<RoomInfoType[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState<
    RoomInfoType | undefined
  >(undefined);

  const userName = sessionStorage.getItem('username');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const showModal = () => setIsModalOpen(true);
  const info = (message: string) => appMessage(message, 'info');

  const handleNewGame = () => {
    form.validateFields().then(async (values) => {
      const { cellSize, mazeSize, roomName } = values;

      try {
        setIsLoading(true);
        setIsModalOpen(false);

        const { data: room } = await RoomService.create({
          cellSize,
          mazeSize,
          name: roomName,
          userName,
        });

        socket.emit(RoomEvents.CREATE, room);

        setSelectedRoom(room);
        navigate(`game/${room.id}`);

        form.resetFields();
      } catch (err: any) {
        appMessage(err.response.data.message, 'error');
      } finally {
        setIsLoading(false);
      }
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

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleJoinRoom = async (selectedRoomId: string) => {
    try {
      setIsLoading(true);
      await RoomService.join(selectedRoomId, userName);

      socket.emit(RoomEvents.JOIN, selectedRoomId, userName);
      socket.on(RoomEvents.OPEN, (room: RoomInfoType) => setSelectedRoom(room));
      navigate(`game/${selectedRoomId}`);
    } catch (err: any) {
      appMessage(err.response.data.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const currentRoom = rooms?.find((room) => room.id === id);

    if (!rooms.length && !currentRoom) {
      socket.emit(SocketEvents.RECONNECT, currentRoom, userName);
    }
  }, [id]);

  React.useEffect(() => {
    const handleOpenRoom = (room: RoomInfoType) => setSelectedRoom(room);
    const handleUpdateRooms = (updRooms: RoomInfoType[]) => {
      setRooms(updRooms);

      if (!selectedRoom && id) {
        const currentRoom = updRooms.find(room => room.id === id);
        setSelectedRoom(currentRoom);
      }
    };

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
      {isLoading && <Spin spinning={isLoading} tip="Loading" size="large" className={styles.spinner} />}
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
              <Form.Item
                name="mazeSize"
                label="Maze size:"
                rules={[{ required: true, message: 'Maze size is required' }]}
              >
                <Select options={MAZE_SIZE} />
              </Form.Item>
              <Form.Item
                name="cellSize"
                label="Cell size:"
                rules={[{ required: true, message: 'Cell size is required' }]}
              >
                <Select options={CELL_SIZE} />
              </Form.Item>
            </div>
          </Form>
        </Modal>

      </Layout.Sider>
    </>
  );
};
