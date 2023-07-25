import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameEvents } from '../enums/game-events.enum.js';
import { RoomEvents } from '../enums/room-events.enum.js';
import { SocketEvents } from '../enums/socket-events.enum.js';
import { UserEvents } from '../enums/user-events.enum.js';
import {
  checkNextPosition,
  generateFinishPoint,
  generateMaze,
  generateStartPoints,
  getCurrentTime,
  removeMazeFromRoom,
} from '../helpers/helpers.js';
import {
  CellPosType,
  CreateRoomType,
  RoomInfoType,
  RoomType,
  UserType,
} from '../types/types.js';

const users: UserType[] = [];
const rooms: RoomType[] = [];

export default (io: Server) => {
  io.on(SocketEvents.CONNECTION, (socket) => {
    socket.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));

    socket.on(SocketEvents.RECONNECT, (currentRoom: RoomInfoType) => {
      socket.join(currentRoom.id);
      socket.emit(RoomEvents.OPEN, currentRoom);
    });

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
      (createdRoom: CreateRoomType, userName: string) => {
        const findUser = users.find((user) => user.name === userName);
        let findRoom = rooms.find((room) => room.id === createdRoom.id);

        if (findUser && !findRoom) {
          findUser.canMove = false;
          findUser.finishedAt = null;

          findRoom = {
            id: createdRoom.id,
            name: createdRoom.name,
            players: [findUser],
            isGameStarted: false,
            isGameEnd: false,
            config: createdRoom.config,
            maze: [[]],
            history: [],
          };
          rooms.push(findRoom);

          socket.join(createdRoom.id);
          socket.emit(RoomEvents.OPEN, findRoom);
          io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
          socket.broadcast.emit(
            RoomEvents.NOTIFICATION,
            `User ${userName} created a room ${findRoom.name}`,
          );
        }
      },
    );

    socket.on(RoomEvents.JOIN, (selectedRoomId: string, userName: string) => {
      const findUser = users.find((user) => user.name === userName);
      const findRoomIndex = rooms.findIndex(
        (room) => room.id === selectedRoomId,
      );

      if (findUser && findRoomIndex !== -1) {
        findUser.canMove = false;
        findUser.finishedAt = null;
        rooms[findRoomIndex].players.push(findUser);
      }

      socket.join(selectedRoomId);
      io.to(selectedRoomId).emit(
        RoomEvents.OPEN,
        removeMazeFromRoom(rooms)[findRoomIndex],
      );
      io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
      socket.broadcast.emit(
        RoomEvents.NOTIFICATION,
        `User ${userName} joined room ${rooms[findRoomIndex].name}`,
      );
    });

    socket.on(
      UserEvents.GIVE_UP,
      (currentRoom: RoomInfoType, userName: string) => {
        const index = rooms.findIndex((room) => room.id === currentRoom.id);
        const findNoGiveUpPlayer = rooms[index].players.find(
          (player) => player.name !== userName,
        );

        io.to(currentRoom.id).emit(
          GameEvents.GIVE_UP_END,
          findNoGiveUpPlayer?.finishPoint,
        );
      },
    );

    socket.on(RoomEvents.EXIT, (roomId: string, userName: string) => {
      const findRoomIndex = rooms.findIndex((room) => room.id === roomId);

      socket.broadcast.emit(
        RoomEvents.NOTIFICATION,
        `User ${userName} left room ${rooms[findRoomIndex].name}`,
      );

      if (findRoomIndex !== -1) {
        rooms[findRoomIndex].isGameStarted = false;
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

    socket.on(RoomEvents.FULL, (currentRoom: RoomType) => {
      const index = rooms.findIndex((room) => room.id === currentRoom.id);

      if (
        index !== -1 &&
        rooms[index].players.every((player) => !player.canMove) &&
        rooms[index].maze.length !== 0
      ) {
        const maze = generateMaze(rooms[index].config.mazeSize);
        const finishPosition = generateFinishPoint(maze);
        const startPosition = generateStartPoints(maze, finishPosition);

        rooms[index].maze = maze;
        rooms[index].isGameStarted = true;
        rooms[index].players[Math.random() < 0.5 ? 0 : 1].canMove = true;

        rooms[index].players.forEach((player, i) => {
          player.startPoint = startPosition[i];
          player.finishPoint = finishPosition;
        });

        io.to(currentRoom.id).emit(GameEvents.STARTED, true);
        io.to(currentRoom.id).emit(
          RoomEvents.OPEN,
          removeMazeFromRoom(rooms)[index],
        );
        io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
      }
    });

    socket.on(
      GameEvents.STEP,
      (currentRoom: RoomInfoType, direction: string, position: CellPosType) => {
        const index = rooms.findIndex((room) => room.id === currentRoom.id);
        const maze = rooms[index].maze;
        const checkPosition = checkNextPosition(direction, position, maze);
        const isPass = checkPosition !== position ? true : false;

        rooms[index].players = currentRoom.players.map((player) => ({
          ...player,
          canMove: !player.canMove,
        }));

        io.to(currentRoom.id).emit(
          RoomEvents.OPEN,
          removeMazeFromRoom(rooms)[index],
        );
        socket.emit(GameEvents.CHECK, isPass, checkPosition);
      },
    );

    socket.on(
      GameEvents.END,
      (currentRoom: RoomInfoType, position: CellPosType, isGiveUP: boolean) => {
        const roomIndex = rooms.findIndex((room) => room.id === currentRoom.id);

        const winner = currentRoom.players.find(
          (player) =>
            player?.finishPoint?.x === position?.x &&
            player?.finishPoint?.y === position?.y,
        );
        const looser = currentRoom.players.find(
          (player) => player.id !== winner?.id,
        );

        rooms[roomIndex].players.forEach((player) => (player.canMove = false));
        rooms[roomIndex].players.forEach(
          (player) => (player.finishedAt = new Date()),
        );
        rooms[roomIndex].isGameStarted = false;
        rooms[roomIndex].isGameEnd = true;

        if (isGiveUP) {
          io.to(currentRoom.id).emit(
            RoomEvents.MESSAGE,
            `Player ${looser?.name} give up!`,
          );
        } else {
          io.to(currentRoom.id).emit(
            RoomEvents.MESSAGE,
            `Player ${winner?.name} has won!`,
          );
        }

        io.to(currentRoom.id).emit(
          RoomEvents.OPEN,
          removeMazeFromRoom(rooms)[roomIndex],
        );
        io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(rooms));
      },
    );

    socket.on(
      RoomEvents.HISTORY,
      (
        text: string,
        id: string,
        playerName: string | null,
        previosPosition: CellPosType | undefined,
      ) => {
        const index = rooms.findIndex((room) => room.id === id);

        if (index !== -1 && playerName) {
          rooms[index].history.push({
            time: getCurrentTime(),
            playerName,
            text,
            moves: undefined
          });

          const lastHistoryItem = rooms[index].history.slice(-1)[0];

          if (previosPosition) {
            const maze = rooms[index].maze;
            const checkPosition = checkNextPosition(text, previosPosition, maze);

            lastHistoryItem.moves = { from: previosPosition, to: checkPosition }
          }

          io.to(id).emit(RoomEvents.OPEN, removeMazeFromRoom(rooms)[index]);

          if (
            rooms[index].players.find((player) => player.name === playerName)
              ?.canMove
          ) {
            io.to(id).emit(RoomEvents.SEND_HISTORY, lastHistoryItem);
          }
        }
      },
    );

    console.log('New client connected');

    socket.on(SocketEvents.DISCONNECT, () => {
      console.log('Client disconnected');
    });
  });
};
