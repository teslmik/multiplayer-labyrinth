import { HistoryType, UserType } from "./types.js";

export type RoomInfoType = {
  config: { mazeSize: number; cellSize: number };
  createdAt: string;
  history: HistoryType[] | null;
  id: string;
  isGameEnd: boolean;
  isGameStarted: boolean;
  name: string;
  owner: UserType;
  players: UserType[] | null;
}
