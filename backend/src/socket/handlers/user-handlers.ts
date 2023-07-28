// TODO refactor
import { Server, Socket } from "socket.io";
import RoomService from "../../services/room.service.js";
import { Room } from "../../entities/index.js";
import { UserEvents, GameEvents, RoomEvents } from "../../enums/index.js";
import { RoomInfoType } from "../../types/index.js";
import { removeMazeFromRoom } from "../../helpers/index.js";

const roomService = new RoomService();

export default function userHandlers(io: Server, socket: Socket, appRooms: Room[]) {
  socket.on(UserEvents.LOGIN, async () => {
    if (!appRooms) {
      const allRooms = await roomService.findAll();
      appRooms = allRooms;
      socket.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
    }
  });

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
}