import * as config from '../components/maze/config';

export const drawVisitedCells = (
  ctx: CanvasRenderingContext2D,
  visitedCells: boolean[][],
) => {
  ctx.fillStyle = 'lightgreen';
  for (let i = 0; i < config.MAZE_SIZE; i++) {
    for (let j = 0; j < config.MAZE_SIZE; j++) {
      if (visitedCells[i][j]) {
        ctx.fillRect(
          j * config.CELL_SIZE,
          i * config.CELL_SIZE,
          config.CELL_SIZE,
          config.CELL_SIZE,
        );
      }
    }
  }
};
