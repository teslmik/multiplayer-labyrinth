import { Button } from 'antd';
import React from 'react';
import { RoomType } from '../../../../types/room.type';

type Properties = {
  handleBack: () => void;
  selectedRoom: Omit<RoomType, 'maze'> | undefined;
};

export const GameSidePanelItems: React.FC<Properties> = ({
  handleBack,
  selectedRoom,
}) => {
  return (
    <>
      <Button type="primary" size="large" onClick={handleBack}>
        Give up
      </Button>
      <div>
        <ul style={{listStyle: 'none'}}>
          {selectedRoom?.players.map((player) => (
            <li key={player.id}>
              {player.name}{' '}{selectedRoom.players.length === 2 && player.canMove ? 'your move' : ''}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
