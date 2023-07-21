import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameEvents } from '../enums/game-events.enum.js';
import { RoomEvents } from '../enums/room-events.enum.js';
import { SocketEvents } from '../enums/socket-events.enum.js';
import { UserEvents } from '../enums/user-events.enum.js';
import {
  generateFinishPoint,
  generateMaze,
  generateStartPoints,
  removeMazeFromRoom,
} from '../helpers/helpers.js';
import {
  CellPosType,
  RoomInfoType,
  RoomType,
  UserType,
} from '../types/types.js';

const users: UserType[] = [];
const rooms: RoomType[] = [];

export default (io: Server) => {
  io.on(SocketEvents.CONNECTION, (socket) => {
    socket.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));

    socket.on(UserEvents.LOGIN, (userName: string) => {
      const findUser = users.find((user) => user.name === userName);

      if (!findUser) {
        users.push({
          id: uuidv4(),
          name: userName,
          canMove: false,
          startPoint: null,
          finishPoint: null,
          finishedAt: null,
        });

        io.sockets.emit(UserEvents.UPDATE, users);
        io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
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
            players: [findUser],
            isGameStarted: false,
            maze: null,
            history: [''],
          };
          rooms.push(findRoom);

          socket.join(currentRoom.id);
          socket.emit(RoomEvents.OPEN, findRoom);
          io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
        }
      },
    );

    socket.on(RoomEvents.JOIN, (selectedRoomId: string, userName: string) => {
      const findUser = users.find((user) => user.name === userName);
      const findRoomIndex = rooms.findIndex(
        (room) => room.id === selectedRoomId,
      );

      if (findUser && findRoomIndex !== -1) {
        rooms[findRoomIndex].players.push(findUser);
      }

      socket.join(selectedRoomId);
      io.to(selectedRoomId).emit(RoomEvents.OPEN, rooms[findRoomIndex]);
      io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
    });

    socket.on(RoomEvents.EXIT, (roomId: string, userName: string) => {
      const findRoomIndex = rooms.findIndex((room) => room.id === roomId);

      if (findRoomIndex !== -1) {
        rooms[findRoomIndex].players.forEach(
          (player) => (player.canMove = false),
        );
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
      io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
    });

    socket.on(RoomEvents.FULL, (currentRoom: RoomType, mazeSize: number) => {
      const index = rooms.findIndex((room) => room.id === currentRoom.id);

      if (
        index !== -1 &&
        !rooms[index].players.some((player) => player.canMove)
      ) {
        const maze = generateMaze(mazeSize);
        const startPosition = generateStartPoints(maze);
        const finishPosition = generateFinishPoint(maze, startPosition);

        rooms[index].maze = maze;
        rooms[index].isGameStarted = true;
        rooms[index].players[Math.random() < 0.5 ? 0 : 1].canMove = true;

        rooms[index].players.forEach((player, i) => {
          player.startPoint = startPosition[i];
          player.finishPoint = finishPosition;
        });

        const roomInfo = {
          players: rooms[index].players,
          id: rooms[index].id,
          name: rooms[index].name,
        };

        io.to(currentRoom.id).emit(GameEvents.STARTED, maze);
        io.to(currentRoom.id).emit(RoomEvents.OPEN, roomInfo);
        io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
      }
    });

    socket.on(GameEvents.STEP, (room: RoomInfoType) => {
      const { players, ...restRoom } = room;
      const updRoom = {
        ...restRoom,
        players: players.map((player) => ({
          ...player,
          canMove: !player.canMove,
        })),
      };

      io.to(room.id).emit(RoomEvents.OPEN, updRoom);
      io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
    });

    socket.on(
      GameEvents.END,
      (currentRoom: RoomInfoType, player: UserType, position: CellPosType) => {
        const roomIndex = rooms.findIndex((room) => room.id === currentRoom.id);
        // const playerIndex = currentRoom.players.findIndex(
        //   (_player) => _player.id === player.id,
        // );
        const winner = currentRoom.players.find(
          (player) =>
            player?.finishPoint?.x === position.x &&
            player.finishPoint.y === position.y,
        );

        rooms[roomIndex].players.forEach(player => player.canMove = false);
        rooms[roomIndex].players.forEach(player => player.finishedAt = new Date());
        rooms[roomIndex].isGameStarted = false;

        io.to(currentRoom.id).emit(RoomEvents.MESSAGE, winner);
        io.to(currentRoom.id).emit(RoomEvents.OPEN, rooms[roomIndex]);
      },
    );

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
