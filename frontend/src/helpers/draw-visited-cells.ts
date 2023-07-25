export const drawVisitedCells = (
  ctx: CanvasRenderingContext2D,
  visitedCells: boolean[][],
  config: { mazeSize: number; cellSize: number } | undefined,
) => {
  ctx.fillStyle = 'lightgreen';
  if (!config) {
    return;
  }

  for (let i = 0; i < config.mazeSize; i++) {
    for (let j = 0; j < config.mazeSize; j++) {
      if (visitedCells[i][j]) {
        ctx.fillRect(
          j * config.cellSize,
          i * config.cellSize,
          config.cellSize,
          config.cellSize,
        );
      }
    }
  }
};
