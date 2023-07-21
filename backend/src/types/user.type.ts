import { CellPosType } from "./types.js";

export type UserType = {
  id: string;
  name: string;
  canMove: boolean;
  startPoint: CellPosType | null;
  finishPoint: CellPosType | null | undefined;
  finishedAt: Date | null;
}