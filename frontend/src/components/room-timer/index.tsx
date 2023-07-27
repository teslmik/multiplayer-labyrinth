import React from 'react';
import { Typography } from 'antd';
import { RoomInfoType } from '../../types/room-info.type';

export const RoomTimer: React.FC<{ room: RoomInfoType | undefined }> = ({ room }) => {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return `${minutes} minutes ${remainingSeconds} seconds`;
  };

  return (
    <Typography.Text style={{ fontSize: '20px' }}>
      You started a new game{' '}
      <Typography.Text strong style={{ fontSize: '24px' }}>
        {formatTime(seconds)}
      </Typography.Text>{' '}
      ago. Waiting for a second player...
    </Typography.Text>
  );
};
