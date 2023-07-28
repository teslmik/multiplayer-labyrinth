// TODO refactor
import { Server, Socket } from "socket.io"
import RoomService from "../services/room.service.js";
import { Room } from "../entities/index.js";
import { RoomEvents } from "../enums/index.js";
import { removeMazeFromRoom } from "../helpers/index.js";
import userHandlers from "./handlers/user-handlers.js";
import roomHandlers from "./handlers/room-handlers.js";
import socketHandlers from "./handlers/socket-handlers.js";
import gameHandlers from "./handlers/game-handlers.js";

const roomService = new RoomService();

export default async function onConnection(io: Server, socket: Socket, appRooms: Room[]) {
  if (!appRooms) {
    const allRooms = await roomService.findAll();
    appRooms = allRooms;
    socket.emit(RoomEvents.UPDATE, removeMazeFromRoom(appRooms));
  }

  userHandlers(io, socket, appRooms);

  roomHandlers(io, socket, appRooms);

  socketHandlers(io, socket, appRooms);

  gameHandlers(io, socket, appRooms);
}