import { CellPosType } from "../types/types.js";

const euclideanDistance = (point1: CellPosType, point2: CellPosType) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const generateFinishPoint = (maze: boolean[][], startPoints: CellPosType[]) => {
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

  let maxSumDistance = -1;
  let farthestPoint: CellPosType | undefined;

  for (const cell of edgeCells) {
    const distance1 = euclideanDistance(startPoints[0], cell);
    const distance2 = euclideanDistance(startPoints[1], cell);
    const sumDistance = distance1 + distance2;
    if (sumDistance > maxSumDistance) {
      maxSumDistance = sumDistance;
      farthestPoint = cell;
    }
  }

  return farthestPoint;
};