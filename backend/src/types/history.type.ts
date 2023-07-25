import { CellPosType } from "./cell-position.type.js";

export type HistoryType = {
  time: string;
  playerName: string;
  text: string;
  moves: { from: CellPosType; to: CellPosType } | undefined;
};
