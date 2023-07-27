import { Server } from 'socket.io';
import { Room } from '../entities/index.js';
import { GameEvents, RoomEvents, SocketEvents, UserEvents } from '../enums/index.js';
import {
  checkNextPosition,
  generateFinishPoint,
  generateMaze,
  generateStartPoints,
  getCurrentTime,
  removeMazeFromRoom,
} from '../helpers/helpers.js';
import { CellPosType, RoomInfoType, RoomType } from '../types/index.js';
import RoomService from '../services/room.service.js';

const roomService = new RoomService();
let appRooms: Room[];

export default (io: Server) => {
  io.on(SocketEvents.CONNECTION, async (socket) => {
    if (!appRooms) {
      const allRooms = await roomService.findAll();
      console.log('appRooms-in-if: ', appRooms);
      appRooms = allRooms;
    }

    socket.on(SocketEvents.RECONNECT, async (currentRoom: RoomInfoType) => {
      const rooms = await roomService.findAll();

      if (currentRoom) {
        socket.join(currentRoom.id);
        socket.emit(RoomEvents.OPEN, currentRoom);
      }
      console.log('appRooms: ', appRooms);

      if (appRooms.length === 0) {
        console.log('appRooms-in-if: ', appRooms);
        appRooms = rooms;
      }
      console.log('rooms: ', rooms);

      socket.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
    });

    socket.on(RoomEvents.CREATE, async (createdRoom: Room) => {
      const rooms = await roomService.findAll();
      appRooms = rooms;

      socket.join(createdRoom.id);

      socket.emit(RoomEvents.OPEN, removeMazeFromRoom(createdRoom));
      io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));

      socket.broadcast.emit(
        RoomEvents.NOTIFICATION,
        `User ${createdRoom.owner.name} created a room ${createdRoom.name}`,
      );
    });

    socket.on(
      RoomEvents.JOIN,
      async (selectedRoomId: string, userName: string) => {
        const rooms = await roomService.findAll();
        const findRoomIndex = appRooms.findIndex(
          (room) => room.id === selectedRoomId,
        );

        appRooms = rooms;

        if (findRoomIndex !== -1) {
          socket.join(selectedRoomId);
          io.to(selectedRoomId).emit(
            RoomEvents.OPEN,
            removeMazeFromRoom(appRooms[findRoomIndex]),
          );
        }

        io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
        socket.broadcast.emit(
          RoomEvents.NOTIFICATION,
          `User ${userName} joined room ${appRooms[findRoomIndex].name}`,
        );
      },
    );

    socket.on(
      UserEvents.GIVE_UP,
      (currentRoom: RoomInfoType, userName: string) => {
        const index = appRooms?.findIndex((room) => room.id === currentRoom.id);
        const findNoGiveUpPlayer = appRooms[index].players.find(
          (player) => player.name !== userName,
        );

        io.to(currentRoom.id).emit(
          GameEvents.GIVE_UP_END,
          findNoGiveUpPlayer?.finishPoint,
        );
      },
    );

    socket.on(RoomEvents.EXIT, async (roomId: string, userName: string) => {
      const findRoomIndex = appRooms.findIndex((room) => room.id === roomId);

      if (roomId) {
        await roomService.update(roomId, appRooms[findRoomIndex]);
      }

      socket.broadcast.emit(
        RoomEvents.NOTIFICATION,
        `User ${userName} left room ${appRooms[findRoomIndex].name}`,
      );

      if (findRoomIndex !== -1) {
        appRooms[findRoomIndex].players.forEach(
          (player) => (player.canMove = false),
        );
        appRooms[findRoomIndex].players = appRooms[
          findRoomIndex
        ].players.filter((player) => {
          return player.name !== userName;
        });

        if (
          appRooms[findRoomIndex].players.length === 0 &&
          !appRooms[findRoomIndex].isGameEnd
        ) {
          const restRooms = await roomService.delete(
            appRooms[findRoomIndex].id,
          );

          io.to(roomId).emit(
            RoomEvents.OPEN,
            removeMazeFromRoom(appRooms[findRoomIndex]),
          );

          appRooms = restRooms;
        } else {
          io.to(roomId).emit(
            RoomEvents.OPEN,
            removeMazeFromRoom(appRooms[findRoomIndex]),
          );
        }
      }

      socket.leave(roomId);

      io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
    });

    socket.on(RoomEvents.FULL, (currentRoom: RoomType) => {
      const index = appRooms.findIndex((room) => room.id === currentRoom.id);

      if (
        index !== -1 &&
        appRooms[index].players.every((player) => !player.canMove) &&
        appRooms[index].maze.length !== 0
      ) {
        const maze = generateMaze(appRooms[index].config.mazeSize);
        const finishPosition = generateFinishPoint(maze);
        const startPosition = generateStartPoints(maze, finishPosition);

        appRooms[index].maze = maze;
        appRooms[index].isGameStarted = true;
        appRooms[index].players[Math.random() < 0.5 ? 0 : 1].canMove = true;

        appRooms[index].players.forEach((player, i) => {
          player.startPoint = startPosition[i];
          player.finishPoint = finishPosition;
        });

        io.to(currentRoom.id).emit(GameEvents.STARTED, true);
        io.to(currentRoom.id).emit(
          RoomEvents.OPEN,
          removeMazeFromRoom(appRooms[index]),
        );
        io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
      }
    });

    socket.on(
      GameEvents.STEP,
      (currentRoom: RoomInfoType, direction: string, position: CellPosType) => {
        const index = appRooms.findIndex((room) => room.id === currentRoom.id);
        const maze = appRooms[index].maze;
        const checkPosition = checkNextPosition(direction, position, maze);
        const isPass = checkPosition !== position ? true : false;

        for (let i = 0; i < appRooms[index].players.length; i++) {
          const { canMove } = appRooms[index].players[i];
          appRooms[index].players[i].canMove = !canMove;
        }

        io.to(currentRoom.id).emit(
          RoomEvents.OPEN,
          removeMazeFromRoom(appRooms[index]),
        );
        socket.emit(GameEvents.CHECK, isPass, checkPosition);
      },
    );

    socket.on(
      GameEvents.END,
      (currentRoom: RoomInfoType, position: CellPosType, isGiveUP: boolean) => {
        const roomIndex = appRooms.findIndex(
          (room) => room.id === currentRoom.id,
        );

        const winner = currentRoom.players.find(
          (player) =>
            player?.finishPoint?.x === position?.x &&
            player?.finishPoint?.y === position?.y,
        );
        const looser = currentRoom.players.find(
          (player) => player.id !== winner?.id,
        );

        appRooms[roomIndex].players.forEach(
          (player) => (player.canMove = false),
        );
        appRooms[roomIndex].players.forEach(
          (player) => (player.finishedAt = new Date()),
        );
        appRooms[roomIndex].isGameStarted = false;
        appRooms[roomIndex].isGameEnd = true;

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
          removeMazeFromRoom(appRooms[roomIndex]),
        );
        io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
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
        const index = appRooms.findIndex((room) => room.id === id);

        if (index !== -1 && playerName) {
          appRooms[index].history.push({
            time: getCurrentTime(),
            playerName,
            text,
            moves: undefined,
          });

          const lastHistoryItem = appRooms[index].history.slice(-1)[0];

          if (previosPosition) {
            const maze = appRooms[index].maze;
            const checkPosition = checkNextPosition(
              text,
              previosPosition,
              maze,
            );

            lastHistoryItem.moves = {
              from: previosPosition,
              to: checkPosition,
            };
          }

          io.to(id).emit(RoomEvents.OPEN, removeMazeFromRoom(appRooms[index]));

          if (
            appRooms[index].players.find((player) => player.name === playerName)
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
