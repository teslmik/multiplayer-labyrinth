import { RoomType, RoomInfoType } from "../types/types.js";

export const removeMazeFromRoom = (rooms: RoomType[]): RoomInfoType[] => {
  return rooms.map((room) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { maze, ...roomWithoutMaze } = room;
    return roomWithoutMaze;
  });
};