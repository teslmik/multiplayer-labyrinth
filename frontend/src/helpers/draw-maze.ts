export const drawMaze = (
  ref: React.MutableRefObject<boolean[][]>,
  i: number,
  j: number,
  maze: boolean,
  mazeSize: number | undefined,
) => {
  if (
    mazeSize &&
    i >= 0 &&
    i < mazeSize &&
    j >= 0 &&
    j < mazeSize &&
    !maze
  ) {
    ref.current[i][j] = false;
  }
};
