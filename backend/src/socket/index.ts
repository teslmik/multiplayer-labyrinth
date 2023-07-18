import { Server } from 'socket.io';
import { RoomEvents } from '../enums/room-events.enum.js';
import { SocketEvents } from '../enums/socket-events.enum.js';
import { UserEvents } from '../enums/user-events.enum.js';
import { RoomType, UserType } from '../types/types.js';
import * as config from './config.js';

const users: UserType[] = [
  {
    id: '123',
    name: 'teslmik',
    ready: false,
    progress: 0,
    finishedAt: null
  },
  {
    id: '1435',
    name: 'teslmik1',
    ready: false,
    progress: 0,
    finishedAt: null
  },
];
const rooms: RoomType[] = [{
  id: '123456',
  isGameStarted: false,
  name: 'First room',
  players: [
    {
      id: '123',
      name: 'teslmik',
      ready: false,
      progress: 0,
      finishedAt: null
    },
    {
      id: '1435',
      name: 'teslmik1',
      ready: false,
      progress: 0,
      finishedAt: null
    }
  ]
}];

export default (io: Server) => {
  io.on(SocketEvents.CONNECTION, (socket) => {
    socket.emit(RoomEvents.UPDATE, rooms);

    socket.on(UserEvents.LOGIN, (userName: string) => {
      const findUser = users.find(user => user.name === userName);

      if (!findUser) {
        users.push({
          id: socket.id,
          name: userName,
          ready: false,
          progress: 0,
          finishedAt: null,
        });

        io.sockets.emit(UserEvents.UPDATE, users);
        io.sockets.emit(RoomEvents.UPDATE, rooms);
      } else {
        socket.emit(UserEvents.EXIST);
      }
    });

    socket.on(UserEvents.LOGOUT, (userName: string) => {
      const findUser = users.find(user => user.name === userName);
      const index = users.findIndex((user) => user.name === findUser?.name);

      if (index !== -1) {
        users.splice(index, 1);
      }
    });

    socket.on(RoomEvents.CREATE, (roomName: string, userName: string) => {
      const findUser = users.find(user => user.name === userName);
      const findRoom = rooms.find(room => room.name === roomName);

      if (findUser && !findRoom) {
        rooms.push({
          id: socket.id,
          name: roomName,
          players: [{
            id: findUser.id,
            name: userName,
            ready: false,
            progress: 0,
            finishedAt: null,
          }],
          isGameStarted: false,
        });

        io.sockets.emit(RoomEvents.UPDATE, rooms);
        socket.join(roomName);
        // socket.emit('OPEN_ROOM', [{ id: findUser.id, name: userName }]);
      } else if (findRoom) {
        socket.emit(RoomEvents.EXIST);
      }
    });

    console.log('Новый клиент подключился');

    socket.on('disconnect', () => {
      console.log('Клиент отключился');
    });
  });
}