import * as config from '../components/maze/config';

export const drawMaze = (
  ref: React.MutableRefObject<boolean[][]>,
  i: number,
  j: number,
  maze: boolean[][],
) => {
  if (
    i >= 0 &&
    i < config.MAZE_SIZE &&
    j >= 0 &&
    j < config.MAZE_SIZE &&
    !maze[i][j]
  ) {
    ref.current[i][j] = false;
  }
};
