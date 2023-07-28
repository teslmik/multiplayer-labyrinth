import { CellPosType } from ".";

export type UserType = {
  id: string;
  socketId: string;
  name: string;
  canMove: boolean;
  startPoint: CellPosType | null;
  finishPoint: CellPosType | null | undefined;
  finishedAt: number | null;
}