import { HistoryType, UserType } from "./types.js";

export type RoomType = {
  id: string;
  name: string;
  players: UserType[];
  isGameStarted: boolean;
  config: { mazeSize: number; cellSize: number };
  maze: boolean[][];
  history: HistoryType[];
  isGameEnd: boolean;
};
