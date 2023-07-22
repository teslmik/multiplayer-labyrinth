import { HistoryType, UserType } from "./types.js";

export type RoomInfoType = {
  id: string;
  name: string;
  players: UserType[];
  isGameStarted: boolean;
  history: HistoryType[];
  isGameEnd: boolean;
}
