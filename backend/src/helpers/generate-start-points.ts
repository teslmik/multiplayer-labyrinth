const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateStartPoints = (maze: boolean[][]) => {
  const rows = maze.length;
  const cols = maze[0].length;
  const passages = [];

  let x1, y1;

  do {
    x1 = getRandomNumber(0, cols - 1);
    y1 = getRandomNumber(0, rows - 1);
  } while (!maze[y1][x1]);

  passages.push({ x: x1, y: y1 });

  let x2, y2;
  do {
    x2 = getRandomNumber(0, cols - 1);
    y2 = getRandomNumber(0, rows - 1);
  } while (!maze[y2][x2] || (x2 === x1 && y2 === y1));

  passages.push({ x: x2, y: y2 });

  return passages;
};
