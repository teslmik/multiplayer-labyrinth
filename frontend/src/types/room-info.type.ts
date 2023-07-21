import { UserType } from "./user.type.js";

export type RoomInfoType = {
  id: string;
  name: string;
  players: UserType[];
  isGameStarted: boolean;
  history: string[];
}
