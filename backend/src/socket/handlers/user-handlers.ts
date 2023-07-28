// TODO refactor
import { Server, Socket } from "socket.io";
import { Room } from "../../entities/index.js";
import { UserEvents, GameEvents } from "../../enums/index.js";
import { RoomInfoType } from "../../types/index.js";

export default function userHandlers(io: Server, socket: Socket, appRooms: Room[]) {
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