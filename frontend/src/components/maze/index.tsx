import React from 'react';
import {
  drawCanvas,
  drawFinishFlag,
  drawMaze,
  drawRedSquare,
  drawVisitedCells,
  isValidCell,
  updateVisitedCells,
} from '../../helpers/helpers';
import { CellPosType, UserType } from '../../types/types';
import * as config from './config';

type Properties = {
  maze: boolean[][];
  player: UserType | undefined;
  handleNextStep: () => void;
  handleGetWinner: (squerPosition: CellPosType, player: UserType) => void;
};

export const Maze: React.FC<Properties> = ({
  maze,
  player,
  handleNextStep,
  handleGetWinner,
}) => {
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
  const [redSquarePos, setRedSquarePos] = React.useState<CellPosType>(
    player?.startPoint as {
      x: number;
      y: number;
    },
  );
  const [keyPrressCount, setKeyPrressCount] = React.useState(0);
  const [featureStep, setFeatureStep] = React.useState<CellPosType>();

  const moveRedSquare = React.useCallback(() => {
    if (
      directionRef.current === 'up' &&
      isValidCell(redSquarePos?.y - 1, redSquarePos?.x, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, y: prevPos.y - 1 }));
      updateVisitedCells(redSquarePos?.y - 1, redSquarePos?.x, setVisitedCells);
    } else if (
      directionRef.current === 'down' &&
      isValidCell(redSquarePos?.y + 1, redSquarePos?.x, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, y: prevPos.y + 1 }));
      updateVisitedCells(redSquarePos?.y + 1, redSquarePos?.x, setVisitedCells);
    } else if (
      directionRef.current === 'left' &&
      isValidCell(redSquarePos?.y, redSquarePos?.x - 1, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, x: prevPos.x - 1 }));
      updateVisitedCells(redSquarePos?.y, redSquarePos?.x - 1, setVisitedCells);
    } else if (
      directionRef.current === 'right' &&
      isValidCell(redSquarePos?.y, redSquarePos?.x + 1, maze)
    ) {
      setRedSquarePos((prevPos) => ({ ...prevPos, x: prevPos.x + 1 }));
      updateVisitedCells(redSquarePos?.y, redSquarePos?.x + 1, setVisitedCells);
    }
  }, [maze, redSquarePos]);

  const writeHistory = React.useCallback(() => {
    if (keyPrressCount) {
      if (directionRef.current === 'up') {
        setFeatureStep({ x: redSquarePos?.x, y: redSquarePos?.y - 1 });
      } else if (directionRef.current === 'down') {
        setFeatureStep({ x: redSquarePos?.x, y: redSquarePos?.y + 1 });
      } else if (directionRef.current === 'left') {
        setFeatureStep({ x: redSquarePos?.x - 1, y: redSquarePos?.y });
      } else if (directionRef.current === 'right') {
        setFeatureStep({ x: redSquarePos?.x + 1, y: redSquarePos?.y });
      }
    }
  }, [keyPrressCount, redSquarePos]);

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      const { key } = event;
      if (config.ArrowKey.includes(key) && player?.canMove) {
        directionRef.current = key.replace('Arrow', '').toLowerCase();

        setKeyPrressCount((prev) => prev + 1);
        moveRedSquare();
        handleNextStep();
      }
    },
    [handleNextStep, moveRedSquare, player?.canMove],
  );

  React.useEffect(() => {
    if (player && player.startPoint && !redSquarePos)
      setRedSquarePos(player.startPoint);

    if (
      player &&
      redSquarePos.x === player.finishPoint?.x &&
      redSquarePos.y === player.finishPoint?.y
    ) {
      handleGetWinner(redSquarePos, player);
      console.log('Игра завершена!');
    }
  }, [handleGetWinner, player, redSquarePos]);

  React.useEffect(() => {
    if (featureStep) {
      drawMaze(canvasDataRef, featureStep.y, featureStep.x, maze);
    }
  }, [featureStep, maze]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    updateVisitedCells(redSquarePos.y, redSquarePos.x, setVisitedCells);
    writeHistory();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, redSquarePos, writeHistory]);

  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && player?.finishPoint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCanvas(ctx, canvasDataRef);
        drawVisitedCells(ctx, visitedCells);
        drawRedSquare(ctx, redSquarePos);
        drawFinishFlag(ctx, player.finishPoint);
      }
    }
  }, [player?.finishPoint, redSquarePos, visitedCells]);

  return (
    <canvas
      ref={canvasRef}
      width={config.MAZE_SIZE * config.CELL_SIZE}
      height={config.MAZE_SIZE * config.CELL_SIZE}
      style={{
        border: '4px solid grey',
        opacity: `${player?.canMove ? 1 : 0.5}`,
      }}
    />
  );
};
