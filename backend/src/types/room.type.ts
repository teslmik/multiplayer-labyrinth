import { HistoryType, UserType } from "./types.js";

export type RoomType = {
  id: string;
  name: string;
  players: UserType[];
  isGameStarted: boolean;
  maze: boolean[][] | null;
  history: HistoryType[];
  isGameEnd: boolean;
};
