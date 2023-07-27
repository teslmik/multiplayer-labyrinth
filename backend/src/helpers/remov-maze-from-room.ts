/* eslint-disable @typescript-eslint/no-unused-vars */
import { Room } from "../entities/index.js";
import { RoomInfoType } from "../types/index.js";

export const removeMazeFromRoom = (rooms: Room | Room[]): RoomInfoType | RoomInfoType[] => {
  if (Array.isArray(rooms)) {
    return rooms.map((room) => {
      const { maze, ...restRoom } = room;
      return restRoom as RoomInfoType;
    });
  } else {
    const { maze, ...restRoom } = rooms;
    return restRoom as RoomInfoType;
  }
};