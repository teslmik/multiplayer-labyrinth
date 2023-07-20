import React from 'react';
import {
  drawCanvas,
  drawMaze,
  drawRedSquare,
  drawVisitedCells,
  generateMaze,
  isValidCell,
  updateVisitedCells,
} from '../../helpers/helpers';
import { CellPosType } from '../../types/types';
import * as config from './config';

export const Maze: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const directionRef = React.useRef<string>('');
  const canvasDataRef = React.useRef<boolean[][]>(
    Array.from({ length: config.MAZE_SIZE }, () =>
      Array(config.MAZE_SIZE).fill(true),
    ),
  );
  const [visitedCells, setVisitedCells] = React.useState<boolean[][]>(() =>
    Array.from({ length: config.MAZE_SIZE }, () =>
      Array(config.MAZE_SIZE).fill(false),
    ),
  );
  const [redSquarePos, setRedSquarePos] = React.useState<CellPosType>({
    x: 0,
    y: 0,
  });
  const [keyPrressCount, setKeyPrressCount] = React.useState(0);
  const [featureStep, setFeatureStep] = React.useState<CellPosType>();
  const [maze, setMaze] = React.useState<boolean[][]>([[]]);

  const moveRedSquare = React.useCallback(() => {
    if (
      directionRef.current === 'up' &&
      isValidCell(redSquarePos.y - 1, redSquarePos.x, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, y: prevPos.y - 1 }));
      updateVisitedCells(redSquarePos.y - 1, redSquarePos.x, setVisitedCells);
    } else if (
      directionRef.current === 'down' &&
      isValidCell(redSquarePos.y + 1, redSquarePos.x, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, y: prevPos.y + 1 }));
      updateVisitedCells(redSquarePos.y + 1, redSquarePos.x, setVisitedCells);
    } else if (
      directionRef.current === 'left' &&
      isValidCell(redSquarePos.y, redSquarePos.x - 1, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, x: prevPos.x - 1 }));
      updateVisitedCells(redSquarePos.y, redSquarePos.x - 1, setVisitedCells);
    } else if (
      directionRef.current === 'right' &&
      isValidCell(redSquarePos.y, redSquarePos.x + 1, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, x: prevPos.x + 1 }));
      updateVisitedCells(redSquarePos.y, redSquarePos.x + 1, setVisitedCells);
    }
  }, [maze, redSquarePos]);

  const writeHistory = React.useCallback(() => {
    if (keyPrressCount) {
      if (directionRef.current === 'up') {
        setFeatureStep({ x: redSquarePos.x, y: redSquarePos.y - 1 });
      } else if (directionRef.current === 'down') {
        setFeatureStep({ x: redSquarePos.x, y: redSquarePos.y + 1 });
      } else if (directionRef.current === 'left') {
        setFeatureStep({ x: redSquarePos.x - 1, y: redSquarePos.y });
      } else if (directionRef.current === 'right') {
        setFeatureStep({ x: redSquarePos.x + 1, y: redSquarePos.y });
      }
    }
  }, [keyPrressCount, redSquarePos]);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      setKeyPrressCount((prev) => prev + 1);
      const { key } = event;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        directionRef.current = key.replace('Arrow', '').toLowerCase();
        moveRedSquare();
      }
    },
    [moveRedSquare],
  );

  React.useEffect(() => {
    setMaze(generateMaze(config.MAZE_SIZE));
  }, []);

  React.useEffect(() => {
    if (featureStep) {
      drawMaze(canvasDataRef, featureStep.y, featureStep.x, maze);
    }
  }, [featureStep, maze]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    writeHistory();
    updateVisitedCells(0, 0, setVisitedCells);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, writeHistory]);

  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCanvas(ctx, canvasDataRef);
        drawVisitedCells(ctx, visitedCells);
        drawRedSquare(ctx, redSquarePos);
      }
    }
  }, [redSquarePos, visitedCells]);

  return (
    <canvas
      ref={canvasRef}
      width={config.MAZE_SIZE * config.CELL_SIZE}
      height={config.MAZE_SIZE * config.CELL_SIZE}
      style={{ border: '4px solid grey' }}
    />
  );
};
