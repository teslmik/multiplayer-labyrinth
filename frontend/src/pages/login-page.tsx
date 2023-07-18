import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space } from 'antd';
import { APP_ROUTES, UserEvents } from '../common/enums';
import { SocketContext } from '../context/socket';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');
  const socket = React.useContext(SocketContext);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
  };

  const handleOnSubmit = () => {
    if (!userName) {
      return;
    }

    sessionStorage.setItem('username', userName);
    socket.emit(UserEvents.LOGIN, userName);
    navigate(APP_ROUTES.DASHDOARD);
  };

  React.useEffect(() => {
    const user = sessionStorage.getItem('username');
    if (user) navigate(APP_ROUTES.DASHDOARD);
  }, [navigate]);

  return (
    <Space size="large" align="center" style={{ margin: '0 auto' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder="User name"
          onChange={handleOnChange}
          onPressEnter={handleOnSubmit}
        />
        <Button type="primary" onClick={handleOnSubmit}>
          Submit
        </Button>
      </Space.Compact>
    </Space>
  );
};
