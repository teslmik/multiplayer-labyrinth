import { User } from "../entities/index.js";
import { HistoryType } from "./index.js";

export type RoomType = {
  id: string;
  name: string;
  players: User[];
  isGameStarted: boolean;
  config: { mazeSize: number; cellSize: number };
  maze: boolean[][];
  history: HistoryType[];
  isGameEnd: boolean;
};
