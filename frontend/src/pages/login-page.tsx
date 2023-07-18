import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space } from 'antd';
import { APP_ROTES } from '../common/enums';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
  };

  const handleOnSubmit = () => {
    sessionStorage.setItem('username', userName);
    navigate(APP_ROTES.DASHDOARD);
  }

  React.useEffect(() => {
    const user = sessionStorage.getItem('username');
    if (user) navigate(APP_ROTES.DASHDOARD);
  }, [navigate]);

  return (
    <Space size='large' align='center' style={{ margin: '0 auto' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input placeholder='User name' onChange={handleOnChange} />
        <Button type="primary" onClick={handleOnSubmit}>Submit</Button>
      </Space.Compact>
    </Space>
  )
}
