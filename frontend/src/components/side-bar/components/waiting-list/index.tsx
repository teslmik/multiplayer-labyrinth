import { Button, List } from 'antd';
import React from 'react';
import { RoomInfoType } from '../../../../types';
import { SideBarItems } from '..';

type Properties = {
  showModal: () => void;
  rooms: RoomInfoType[];
  handleJoinRoom: (id: string) => void;
}

export const WaitingList: React.FC<Properties> = ({ showModal, rooms, handleJoinRoom }) => {
  console.log('rooms: ', rooms);
  return (
    <>
      <Button type="primary" size="large" onClick={showModal}>
        New game
      </Button>
      <List
        style={{ width: '100%' }}
        bordered
        dataSource={rooms?.filter(room => (!room.isGameEnd))}
        renderItem={(item, index) => (
          <SideBarItems
            room={item}
            index={index}
            handleJoinRoom={handleJoinRoom}
          />
        )}
      />
    </>
  )
};
