import * as config from '../components/maze/config';

export const isValidCell = (
  row: number,
  col: number,
  maze: boolean[][],
): boolean => {
  return (
    row >= 0 &&
    row < config.MAZE_SIZE &&
    col >= 0 &&
    col < config.MAZE_SIZE &&
    maze[row][col]
  );
};
