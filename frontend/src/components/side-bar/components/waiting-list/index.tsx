import { Button, List } from 'antd';
import React from 'react';
import { RoomType } from '../../../../types/room.type';
import { SideBarItems } from '../components';

type Properties = {
  showModal: () => void;
  rooms: Omit<RoomType, 'maze'>[];
  handleJoinRoom: (id: string) => void;
}

export const WaitingList: React.FC<Properties> = ({ showModal, rooms, handleJoinRoom }) => {
  return (
    <>
      <Button type="primary" size="large" onClick={showModal}>
        New game
      </Button>
      <List
        style={{ width: '100%' }}
        bordered
        dataSource={rooms}
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
