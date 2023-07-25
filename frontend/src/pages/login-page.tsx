import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space } from 'antd';
import { APP_ROUTES, UserEvents, ModalType, SocketEvents } from '../enums';
import { SocketContext } from '../context/socket';
import { ModalApp } from '../components/components';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');
  const socket = React.useContext(SocketContext);

  // const userExist = () => {
  //   ModalApp('User exist', 'User with the same name already exists, please try again', ModalType.WARNING);
  //   sessionStorage.clear();
  //   navigate(APP_ROUTES.ROOT);
  // };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
  };

  const handleOnSubmit = () => {
    if (!userName) {
      return;
    }

    socket.emit(UserEvents.LOGIN, userName);
    // socket.on(UserEvents.EXIST, userExist);
    sessionStorage.setItem('username', userName);

    navigate(APP_ROUTES.DASHDOARD);
  };

  React.useEffect(() => {
    const user = sessionStorage.getItem('username');

    if (user) navigate(APP_ROUTES.DASHDOARD);
  }, [navigate]);

  return (
    <Space
      size="large"
      align="center"
      style={{ margin: '0 auto', flex: '1 1 auto' }}
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="User name"
          onChange={handleOnChange}
          onPressEnter={handleOnSubmit}
        />
        <Button
          type="primary"
          onClick={handleOnSubmit}
          // disabled={!socket.connected}
        >
          Submit
        </Button>
      </Space.Compact>
    </Space>
  );
};
