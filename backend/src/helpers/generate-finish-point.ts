import { CellPosType } from "../types/index.js";

export const generateFinishPoint = (maze: boolean[][]) => {
  const rows = maze.length;
  const cols = maze[0].length;
  const edgeCells: CellPosType[] = [];

  for (let i = 0; i < rows; i++) {
    if (maze[i][0]) edgeCells.push({ x: 0, y: i });
    if (maze[i][cols - 1]) edgeCells.push({ x: cols - 1, y: i });
  }

  for (let j = 1; j < cols - 1; j++) {
    if (maze[0][j]) edgeCells.push({ x: j, y: 0 });
    if (maze[rows - 1][j]) edgeCells.push({ x: j, y: rows - 1 });
  }

  const randomIndex = Math.floor(Math.random() * edgeCells.length);
  const finishPoint = edgeCells[randomIndex];

  return finishPoint;
};
