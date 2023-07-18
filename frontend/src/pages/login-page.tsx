import React from 'react';
import { Button, Input, Space } from 'antd';

export const LoginPage: React.FC = () => {
  const [userName, setUserName] = React.useState('');

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUserName(value);
  };

  const handleOnSubmit = () => {
    sessionStorage.setItem('username', userName);
  }

  return (
    <Space size='large' align='center' style={{ margin: '0 auto' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input placeholder='User name' onChange={handleOnChange} />
        <Button type="primary" onClick={handleOnSubmit}>Submit</Button>
      </Space.Compact>
    </Space>
  )
}
