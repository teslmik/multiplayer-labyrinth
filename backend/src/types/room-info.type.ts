import { User } from "../entities/index.js";
import { HistoryType } from "./index.js";

export type RoomInfoType = {
  id: string;
  name: string;
  players: User[];
  isGameStarted: boolean;
  config: { mazeSize: number; cellSize: number };
  history: HistoryType[];
  isGameEnd: boolean;
}
