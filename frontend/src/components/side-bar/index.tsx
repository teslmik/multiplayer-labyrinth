import { Button, Input, Layout, List, Modal, theme } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES, RoomEvents } from '../../common/enums';
import { RoomType } from '../../common/types/room.type';
import { SocketContext } from '../../context/socket';
import { RoomItem } from '../components';

import styles from './styles.module.scss';

type Properties = {
  rooms: RoomType[];
};

export const SideBar: React.FC<Properties> = ({ rooms }) => {
  console.log('rooms: ', rooms);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const socket = React.useContext(SocketContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [roomName, setRoomName] = React.useState('');

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

    socket.emit(RoomEvents.CREATE, roomName, userName);
    navigate('game/sdsdd');
    setIsModalOpen(false);
  };

  const handleBack = () => {
    navigate(APP_ROUTES.DASHDOARD);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout.Sider style={{ background: colorBgContainer, maxWidth: '300px' }}>
      <div className={styles.sideBar}>
        {pathname === `${APP_ROUTES.DASHDOARD}` ? (
          <>
            <Button type="primary" size="large" onClick={showModal}>
              New game
            </Button>
            <List
              style={{width: '100%'}}
              dataSource={rooms}
              renderItem={(item, index) => (
                <RoomItem room={item} index={index} />
              )}
            />
          </>
        ) : (
          <Button type="primary" size="large" onClick={handleBack}>
            Give up
          </Button>
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
        />
      </Modal>
    </Layout.Sider>
  );
};
