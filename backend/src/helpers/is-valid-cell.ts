export const isValidCell = (
  x: number,
  y: number,
  maze: boolean[][],
): boolean => {
  return (
    x >= 0 && x < maze.length && y >= 0 && y < maze.length && maze[y][x]
  );
};
