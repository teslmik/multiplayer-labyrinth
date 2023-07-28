import { CellPosType } from '../types/index.js';
import { isValidCell } from './index.js';

export const checkNextPosition = (
  direction: string,
  position: CellPosType,
  maze: boolean[][],
) => {
  if (direction === 'up' && isValidCell(position.x, position.y - 1, maze)) {
    return { x: position.x, y: position.y - 1 };
  } else if (
    direction === 'down' &&
    isValidCell(position.x, position.y + 1, maze)
  ) {
    return { x: position.x, y: position.y + 1 };
  } else if (
    direction === 'left' &&
    isValidCell(position.x - 1, position.y, maze)
  ) {
    return { x: position.x - 1, y: position.y };
  } else if (
    direction === 'right' &&
    isValidCell(position.x + 1, position.y, maze)
  ) {
    return { x: position.x + 1, y: position.y };
  }
  return position;
};
