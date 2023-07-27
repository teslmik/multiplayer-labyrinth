import { HistoryType, UserType } from "./index.js";

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
