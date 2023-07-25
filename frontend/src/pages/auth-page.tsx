import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space, Typography } from 'antd';
import { APP_ROUTES, UserEvents } from '../enums';
import { SocketContext } from '../context/socket';
import { UserService } from '../services/user.service';
import { APP_KEYS } from '../constants';
import { UserType } from '../types/user.type';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [userName, setUserName] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);
  const socket = React.useContext(SocketContext);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
  };

  const handleOnSubmitRegister = async () => {
    if (!userName) {
      return;
    }

    const { data } = await UserService.registration(userName);

    socket.emit(UserEvents.LOGIN, userName);
    sessionStorage.setItem('username', userName);

    navigate(APP_ROUTES.DASHDOARD);
  };

  const handleOnSubmitLogin = async () => {
    if (!userName) {
      return;
    }
    
    const { data } = await UserService.login(userName);

    socket.emit(UserEvents.LOGIN, userName);
    sessionStorage.setItem('username', userName);

    navigate(APP_ROUTES.DASHDOARD);
  };

  const handleChangeAuth = () => setIsLogin(!isLogin);

  React.useEffect(() => {
    const user = sessionStorage.getItem('username');

    if (user) navigate(APP_ROUTES.DASHDOARD);
  }, [navigate]);

  return (
    <Space
      size="large"
      align="center"
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '0 auto',
        flex: '1 1 auto',
      }}
    >
      <Typography.Title underline level={1}>
        {isLogin ? 'Login' : 'Registration'}
      </Typography.Title>
      <Form
        form={form}
        onFinish={isLogin ? handleOnSubmitLogin : handleOnSubmitRegister}
      >
        <Form.Item
          rules={[{ required: true, message: 'Name is required' }]}
          required
          name="name"
          label="Name"
        >
          <Input
            style={{ width: 300 }}
            placeholder="Enter your name"
            onChange={handleOnChange}
            onPressEnter={
              isLogin ? handleOnSubmitLogin : handleOnSubmitRegister
            }
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
      {isLogin ? (
        <p>
          Don't have an account?{' '}
          <Typography.Link onClick={handleChangeAuth} underline>
            Registration
          </Typography.Link>
        </p>
      ) : (
        <p>
          Already have an account?{' '}
          <Typography.Link onClick={handleChangeAuth} underline>
            Login
          </Typography.Link>
        </p>
      )}
    </Space>
  );
};
