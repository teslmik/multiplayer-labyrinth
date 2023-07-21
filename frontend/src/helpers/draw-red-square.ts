import * as config from '../components/maze/config';
import { CellPosType } from '../types/types';

export const drawRedSquare = (
  ctx: CanvasRenderingContext2D,
  position: CellPosType = { x: 0, y: 0 },
) => {
  if (position) {
    ctx.fillStyle = 'red';
    ctx.fillRect(
      position.x * config.CELL_SIZE +
      (config.CELL_SIZE - config.RED_SQUARE_SIZE) / 2,
      position.y * config.CELL_SIZE +
      (config.CELL_SIZE - config.RED_SQUARE_SIZE) / 2,
      config.RED_SQUARE_SIZE,
      config.RED_SQUARE_SIZE,
    );
  }
};
