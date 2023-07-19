import { Server } from 'socket.io';
import { RoomEvents } from '../enums/room-events.enum.js';
import { SocketEvents } from '../enums/socket-events.enum.js';
import { UserEvents } from '../enums/user-events.enum.js';
import { RoomType, UserType } from '../types/types.js';
// import * as config from './config.js';

const users: UserType[] = [];
const rooms: RoomType[] = [];

export default (io: Server) => {
  io.on(SocketEvents.CONNECTION, (socket) => {
    socket.emit(RoomEvents.UPDATE, rooms);

    socket.on(UserEvents.LOGIN, (userName: string) => {
      const findUser = users.find((user) => user.name === userName);

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
      const findUser = users.find((user) => user.name === userName);
      const index = users.findIndex((user) => user.name === findUser?.name);

      if (index !== -1) {
        users.splice(index, 1);
      }
    });

    socket.on(
      RoomEvents.CREATE,
      (currentRoom: { id: string; name: string }, userName: string) => {
        const findUser = users.find((user) => user.name === userName);
        let findRoom = rooms.find((room) => room.id === currentRoom.id);

        if (findUser && !findRoom) {
          findRoom = {
            id: currentRoom.id,
            name: currentRoom.name,
            players: [
              {
                id: findUser.id,
                name: userName,
                ready: false,
                progress: 0,
                finishedAt: null,
              },
            ],
            isGameStarted: false,
          };
          rooms.push(findRoom);

          socket.join(currentRoom.id);
          socket.emit(RoomEvents.OPEN, findRoom);
          io.sockets.emit(RoomEvents.UPDATE, rooms);
        }
      },
    );

    socket.on(RoomEvents.JOIN, (selectedRoomId: string, userName: string) => {
      const findUser = users.find((user) => user.name === userName);
      const findRoomIndex = rooms.findIndex(
        (room) => room.id === selectedRoomId,
      );

      if (findUser && findRoomIndex !== -1) {
        rooms[findRoomIndex].players.push({
          id: findUser.id,
          name: userName,
          ready: false,
          progress: 0,
          finishedAt: null,
        });
      }

      socket.join(selectedRoomId);
      socket.emit(RoomEvents.OPEN, rooms[findRoomIndex]);
      io.sockets.emit(RoomEvents.UPDATE, rooms);
    });

    socket.on(RoomEvents.EXIT, (roomId: string, userName: string) => {
      const findRoomIndex = rooms.findIndex((room) => room.id === roomId);

      if (findRoomIndex !== -1) {
        rooms[findRoomIndex].players = rooms[findRoomIndex].players.filter(
          (player) => {
            return player.name !== userName;
          },
        );

        if (rooms[findRoomIndex].players.length === 0) {
          rooms.splice(findRoomIndex, 1);
        }
      }

      socket.leave(roomId);
      io.sockets.emit(RoomEvents.UPDATE, rooms);
    });

    console.log('Новый клиент подключился');

    socket.on(SocketEvents.DISCONNECT, () => {
      // const user = users.find((player) => player.id !== socket.id);
      // const findRoom = rooms.find((room) => room.players.some((player) => player.id === socket.id));

      // socket.emit(RoomEvents.EXIT, findRoom?.id, user?.name);
      // socket.emit(UserEvents.LOGOUT, user?.name);

      console.log('Клиент отключился');
    });
  });
};
