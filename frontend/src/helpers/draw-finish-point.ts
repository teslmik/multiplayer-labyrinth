import { CellPosType } from '../types';

export const drawFinishFlag = (
  ctx: CanvasRenderingContext2D,
  position: CellPosType,
  cellSize: number | undefined
) => {
  if (position && cellSize) {
    const flagSize = cellSize * 0.8;
    const squareSize = flagSize / 5;

    const offsetX = (cellSize - flagSize) / 2;
    const offsetY = (cellSize - flagSize) / 2;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const isWhite = (row + col) % 2 === 0;

        ctx.fillStyle = isWhite ? 'transparent' : 'black';
        ctx.fillRect(
          position.x * cellSize + offsetX + col * squareSize,
          position.y * cellSize + offsetY + row * squareSize,
          squareSize,
          squareSize
        );
      }
    }

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0, 5;
    ctx.strokeRect(
      position.x * cellSize + offsetX,
      position.y * cellSize + offsetY,
      flagSize,
      flagSize
    );
  }
};


