import { CellPosType } from "../types/types.js";

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const euclideanDistance = (point1: CellPosType, point2: CellPosType) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const generateStartPoints = (maze: boolean[][], finishPoint: CellPosType) => {
  const rows = maze.length;
  const cols = maze[0].length;
  const passages = [];

  let x1, y1, x2, y2;
  let distance;

  do {
    do {
      x1 = getRandomNumber(0, cols - 1);
      y1 = getRandomNumber(0, rows - 1);
    } while (!maze[y1][x1]);

    do {
      x2 = getRandomNumber(0, cols - 1);
      y2 = getRandomNumber(0, rows - 1);
    } while (!maze[y2][x2] || (x2 === x1 && y2 === y1));

    const distance1 = euclideanDistance({ x: x1, y: y1 }, finishPoint);
    const distance2 = euclideanDistance({ x: x2, y: y2 }, finishPoint);

    distance = Math.abs(distance1 - distance2);
  } while (distance > 0 || (x1 === finishPoint.x && y1 === finishPoint.y) || (x2 === finishPoint.x && y2 === finishPoint.y));

  passages.push({ x: x1, y: y1 });
  passages.push({ x: x2, y: y2 });

  return passages;
};

