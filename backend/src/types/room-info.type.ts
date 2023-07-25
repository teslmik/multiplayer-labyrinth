import { HistoryType, UserType } from "./types.js";

export type RoomInfoType = {
  id: string;
  name: string;
  players: UserType[];
  isGameStarted: boolean;
  config: { mazeSize: number; cellSize: number };
  history: HistoryType[];
  isGameEnd: boolean;
}
