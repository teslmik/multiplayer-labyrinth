// TODO refactor
import { Server, Socket } from "socket.io";
import { checkNextPosition, removeMazeFromRoom } from "../../helpers/index.js";
import { Room } from "../../entities/index.js";
import { GameEvents, RoomEvents } from "../../enums/index.js";
import { CellPosType, RoomInfoType } from "../../types/index.js";

export default function gameHandlers(io: Server, socket: Socket, appRooms: Room[]) {
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
}