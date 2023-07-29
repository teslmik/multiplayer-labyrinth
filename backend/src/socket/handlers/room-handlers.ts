// TODO refactor
import { Server, Socket } from 'socket.io';
import RoomService from '../../services/room.service.js';
import { Room } from '../../entities/index.js';
import { RoomEvents } from '../../enums/index.js';
import { CellPosType, RoomType } from '../../types/index.js';
import {
  checkNextPosition,
  generateFinishPoint,
  generateMaze,
  generateStartPoints,
  getCurrentTime,
  removeMazeFromRoom,
} from '../../helpers/index.js';

const roomService = new RoomService();

export default function roomHandlers(
  io: Server,
  socket: Socket,
  appRooms: Room[],
) {
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
        `User ${userName} joined room ${appRooms[findRoomIndex]?.name}`,
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
      appRooms[findRoomIndex].players = appRooms[findRoomIndex].players.filter(
        (player) => {
          return player.name !== userName;
        },
      );

      if (
        appRooms[findRoomIndex].players.length === 0 &&
        !appRooms[findRoomIndex].isGameEnd
      ) {
        const restRooms = await roomService.delete(appRooms[findRoomIndex].id);

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

      io.to(currentRoom.id).emit(
        RoomEvents.OPEN,
        removeMazeFromRoom(appRooms[index]),
      );
      io.sockets.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
    }
  });

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
          const checkPosition = checkNextPosition(text, previosPosition, maze);

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
}
