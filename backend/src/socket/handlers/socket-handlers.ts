// TODO refactor
import { Server, Socket } from "socket.io";
import RoomService from "../../services/room.service.js";
import { Room } from "../../entities/index.js";
import { RoomEvents, SocketEvents } from "../../enums/index.js";
import { RoomInfoType } from "../../types/index.js";
import UserService from "../../services/user.service.js";
import { removeMazeFromRoom } from "../../helpers/index.js";

const roomService = new RoomService();
const userService = new UserService();

export default function socketHandlers(io: Server, socket: Socket, appRooms: Room[]) {
  socket.on(
    SocketEvents.RECONNECT,
    async (currentRoom: RoomInfoType, userName: string) => {
      const rooms = await roomService.findAll();
      await userService.update(socket.id, userName);

      if (currentRoom) {
        socket.join(currentRoom.id);
        socket.emit(RoomEvents.OPEN, currentRoom);
      }

      if (appRooms.length === 0) {
        appRooms = rooms;
      }

      socket.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
    },
  );

  socket.on(SocketEvents.DISCONNECTING, async () => {
    if (socket.handshake.query.username !== 'null') {
      const user = await userService.findUserByName(
        socket.handshake.query.username as string,
      );

      const updatePromises = appRooms.map(async (room, index) => {
        if (!room.isGameEnd) {
          const filterPlayer = room.players.filter(
            (player) => player.id !== user.id,
          );
          if (filterPlayer.length === 0) {
            socket.leave(room.id);
            socket.broadcast.emit(
              RoomEvents.NOTIFICATION,
              `User ${user.name} left room ${room.name}`,
            );
            return roomService.delete(room.id);
          } else {
            appRooms[index].players = filterPlayer;
            appRooms[index].isGameEnd = true;
            appRooms[index].isGameStarted = false;

            socket.leave(room.id);
            socket.broadcast.emit(
              RoomEvents.NOTIFICATION,
              `User ${user.name} left room ${room.name}`,
            );
            io.to(appRooms[index].id).emit(
              RoomEvents.OPEN,
              removeMazeFromRoom(appRooms[index]),
            );
            io.sockets.emit(
              RoomEvents.UPDATE,
              removeMazeFromRoom(appRooms),
            );

            return roomService.update(room.id, appRooms[index]);
          }
        }
        return null;
      });

      await Promise.all(updatePromises);

      const rooms = await roomService.findAll();

      appRooms = rooms;
    }
  });

  socket.on(SocketEvents.DISCONNECT, () => {
    console.log('Client disconnected');
  });
}