import * as config from '../components/maze/config';

export const drawCanvas = (ctx: CanvasRenderingContext2D, canvasRef: React.MutableRefObject<boolean[][]>) => {
  const canvasData = canvasRef.current;
  for (let i = 0; i < config.MAZE_SIZE; i++) {
    for (let j = 0; j < config.MAZE_SIZE; j++) {
      if (canvasData[i][j]) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
          j * config.CELL_SIZE,
          i * config.CELL_SIZE,
          config.CELL_SIZE,
          config.CELL_SIZE,
        );
      } else {
        ctx.fillStyle = 'black';
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