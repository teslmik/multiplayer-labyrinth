import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Space, Spin, Typography } from 'antd';
import { APP_ROUTES, UserEvents } from '../enums';
import { UserService } from '../services/user.service';
import { useAppMessage } from '../hooks/use-app-message';
import { SocketContext } from '../context/socket';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const socket = React.useContext(SocketContext);
  const [userName, setUserName] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const { appMessage, contextHolder } = useAppMessage();

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
  };

  const handleOnSubmit = async () => {
    if (!userName) {
      return;
    }

    try {
      setIsLoading(true);
      const { data: user } = isLogin
        ? (await UserService.login(userName))
        : (await UserService.registration(userName));
      
      await UserService.update(socket.id, user.name);

      sessionStorage.setItem('username', user.name);
      navigate(APP_ROUTES.DASHDOARD);
    } catch (err: any) {
      appMessage(err.response.data.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAuth = () => setIsLogin(!isLogin);

  React.useEffect(() => {
    const user = sessionStorage.getItem('username');

    if (user) navigate(APP_ROUTES.DASHDOARD);
  }, [navigate]);

  return (
    <>
      {contextHolder}
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
        <Spin spinning={isLoading} tip="Loading" size="large">
          <Typography.Title underline level={1} style={{textAlign: 'center'}}>
            {isLogin ? 'Login' : 'Registration'}
          </Typography.Title>
          <Form form={form} onFinish={handleOnSubmit}>
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
                onPressEnter={handleOnSubmit}
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
        </Spin>
      </Space>
    </>
  );
};
