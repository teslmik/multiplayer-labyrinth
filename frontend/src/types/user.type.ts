import { CellPosType } from "./types";

export type UserType = {
  id: string;
  name: string;
  canMove: boolean;
  startPoint: CellPosType | null;
  finishPoint: CellPosType | null | undefined;
  finishedAt: number | null;
}