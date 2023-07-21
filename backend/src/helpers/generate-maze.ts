import { CellPosType } from "../types/types.js";

export const generateMaze = (MAZE_SIZE: number) => {
  const createMatrix = (size: number) => {
    const matrix = [];

    for (let y = 0; y < size; y++) {
      const row = [];

      for (let x = 0; x < size; x++) {
        row.push(false);
      }

      matrix.push(row);
    }

    return matrix;
  }

  const getRandomItem = <T>(array: Array<T>) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  const moveTractor = (tractor: CellPosType) => {
    const directions = [];

    if (tractor.x > 0) {
      directions.push([-2, 0]);
    }

    if (tractor.x < MAZE_SIZE - 1) {
      directions.push([2, 0]);
    }

    if (tractor.y > 0) {
      directions.push([0, -2]);
    }

    if (tractor.y < MAZE_SIZE - 1) {
      directions.push([0, 2]);
    }

    const [dx, dy] = getRandomItem(directions);

    tractor.x += dx;
    tractor.y += dy;

    if (!matrix[tractor.y][tractor.x]) {
      matrix[tractor.y][tractor.x] = true;
      matrix[tractor.y - dy / 2][tractor.x - dx / 2] = true;
    }
  }

  const isValidMaze = <T>(matrix: Array<T>[]) => {
    for (let y = 0; y < MAZE_SIZE; y += 2) {
      for (let x = 0; x < MAZE_SIZE; x += 2) {
        if (!matrix[y][x]) {
          return false;
        }
      }
    }

    return true;
  }

  const matrix = createMatrix(MAZE_SIZE);
  const tractor = { x: 0, y: 0 };
  matrix[tractor.y][tractor.x] = true;

  while (!isValidMaze(matrix)) {
    moveTractor(tractor);
  }

  return matrix;
};