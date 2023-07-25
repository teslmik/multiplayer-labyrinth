import { CellPosType } from '../types/types';

export const drawRedSquare = (
  ctx: CanvasRenderingContext2D,
  position: CellPosType = { x: 0, y: 0 },
  cellSize: number | undefined
) => {
  if (position && cellSize) {
    ctx.fillStyle = 'red';
    ctx.fillRect(
      position.x * cellSize +
      (cellSize - cellSize * 0.8) / 2,
      position.y * cellSize +
      (cellSize - cellSize * 0.8) / 2,
      cellSize * 0.8,
      cellSize * 0.8,
    );
  }
};
