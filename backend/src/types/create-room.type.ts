export type CreateRoomType = {
  id: string;
  name: string;
  config: {
    mazeSize: number;
    cellSize: number;
  }
};
