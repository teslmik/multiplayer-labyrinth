import { UserType } from "./user.type.js";

export type RoomType = {
  id: string;
  name: string;
  players: UserType[];
  isGameStarted: boolean;
  maze: boolean[][] | null;
  history: string[];
  isGameEnd: boolean;
}