import * as config from '../components/maze/config';
import { CellPosType } from '../types/types';

export const drawFinishFlag = (
  ctx: CanvasRenderingContext2D,
  position: CellPosType,
) => {
  if (position) {
    const flagSize = config.RED_SQUARE_SIZE;
    const squareSize = flagSize / 5;

    const offsetX = (config.CELL_SIZE - flagSize) / 2;
    const offsetY = (config.CELL_SIZE - flagSize) / 2;

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const isWhite = (row + col) % 2 === 0;

        ctx.fillStyle = isWhite ? 'transparent' : 'black';
        ctx.fillRect(
          position.x * config.CELL_SIZE + offsetX + col * squareSize,
          position.y * config.CELL_SIZE + offsetY + row * squareSize,
          squareSize,
          squareSize
        );
      }
    }

    // Тонкая черная обводка
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0,5;
    ctx.strokeRect(
      position.x * config.CELL_SIZE + offsetX,
      position.y * config.CELL_SIZE + offsetY,
      flagSize,
      flagSize
    );
  }
};


