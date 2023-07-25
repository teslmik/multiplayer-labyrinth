export const drawCanvas = (
  ctx: CanvasRenderingContext2D,
  canvasRef: React.MutableRefObject<boolean[][]>,
  config: { mazeSize: number; cellSize: number } | undefined,
) => {
  const canvasData = canvasRef.current;
  if (!config) {
    return;
  }

  for (let i = 0; i < config.mazeSize; i++) {
    for (let j = 0; j < config.mazeSize; j++) {
      if (canvasData[i][j]) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
          j * config.cellSize,
          i * config.cellSize,
          config.cellSize,
          config.cellSize,
        );
      } else {
        ctx.fillStyle = 'black';
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
