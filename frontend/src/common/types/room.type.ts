import { UserType } from "./user.type.js";

export type RoomType = {
  id: string;
  name: string;
  players: UserType[];
  isGameStarted: boolean;
}