import React from 'react';
import { useParams } from 'react-router-dom';
import { DIRECTIONS } from '../../constants';
import { SocketContext } from '../../context/socket';
import { GameEvents, RoomEvents } from '../../enums';
import {
  drawCanvas,
  drawFinishFlag,
  drawMaze,
  drawRedSquare,
  drawVisitedCells,
} from '../../helpers';
import { CellPosType, HistoryType, RoomInfoType, UserType } from '../../types';
import * as config from './config';

type PrefixType = 'up' | 'down' | 'left' | 'right';

type Properties = {
  player: UserType | undefined;
  handleGetWinner: (squerPosition: CellPosType) => void;
  room: RoomInfoType | undefined;
};

export const Maze: React.FC<Properties> = ({
  player,
  handleGetWinner,
  room,
}) => {
  const { id } = useParams();
  const socket = React.useContext(SocketContext);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const directionRef = React.useRef<string>('');
  const canvasDataRef = React.useRef<boolean[][]>(
    Array.from({ length: room?.config.mazeSize ?? 5 }, () =>
      Array(room?.config.mazeSize).fill(true),
    ),
  );
  const [maze, setMaze] = React.useState<boolean>(true);
  const [visitedCells, setVisitedCells] = React.useState<boolean[][]>(() =>
    Array.from({ length: room?.config.mazeSize ?? 5 }, () =>
      Array(room?.config.mazeSize).fill(false),
    ),
  );
  const [redSquarePos, setRedSquarePos] = React.useState<
    CellPosType | undefined
  >();
  const [keyPrressCount, setKeyPrressCount] = React.useState(0);
  const [featureStep, setFeatureStep] = React.useState<
    CellPosType | undefined
  >();

  const handleCheck = React.useCallback(
    (maze: boolean, position: CellPosType) => {
      setMaze(maze);

      if (maze) {
        setVisitedCells((prev) => {
          const newVisitedCells = [...prev];
          newVisitedCells[position.y][position.x] = true;
          return newVisitedCells;
        });
      }

      setRedSquarePos(position);
    },
    [],
  );

  const handleNextStep = React.useCallback(() => {
    if (room?.isGameStarted && player?.canMove) {
      socket.emit(GameEvents.STEP, room, directionRef.current, redSquarePos);
    }
  }, [player?.canMove, redSquarePos, room, socket]);

  const getFeatureStep = React.useCallback(() => {
    if (keyPrressCount && redSquarePos) {
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
      const { key } = event;
      if (config.ArrowKey.includes(key) && player?.canMove) {
        directionRef.current = key.replace('Arrow', '').toLowerCase();

        setKeyPrressCount((prev) => prev + 1);
        handleNextStep();

        socket.emit(
          RoomEvents.HISTORY,
          `(going ${directionRef.current})`,
          id,
          player.name,
          redSquarePos,
        );
      }
    },
    [handleNextStep, player?.canMove, player?.name],
  );

  const handleChatMessage = React.useCallback(
    (historyItem: HistoryType) => {
      const { text, playerName } = historyItem;
      if (text) {
        const direction = text
          .trim()
          .split(' ')[1]
          .replace(')', '') as PrefixType;

        if (
          DIRECTIONS['/'].includes(direction) &&
          player?.name === playerName &&
          player.canMove
        ) {
          directionRef.current = direction;

          setKeyPrressCount((prev) => prev + 1);
          handleNextStep();
        }
      }
    },
    [handleNextStep, player?.canMove, player?.name],
  );

  React.useEffect(() => {
    if (keyPrressCount === 0 && player?.startPoint) {
      setRedSquarePos(player.startPoint);
      setVisitedCells((prev) => {
        const newVisitedCells = [...prev];
        const y = player?.startPoint?.y;
        const x = player?.startPoint?.x;

        if (x !== undefined && y !== undefined) {
          newVisitedCells[y][x] = true;
        }

        return newVisitedCells;
      });
    }
  }, [keyPrressCount, player]);

  React.useEffect(() => {
    if (
      redSquarePos &&
      !player?.finishedAt &&
      redSquarePos.x === player?.finishPoint?.x &&
      redSquarePos.y === player.finishPoint?.y
    ) {
      console.log('Game over!');
      handleGetWinner(redSquarePos);
      socket.emit(
        RoomEvents.HISTORY,
        `Player ${player.name} has won!`,
        room?.id
      );
    }
  }, [player, redSquarePos]);

  React.useEffect(() => {
    if (featureStep) {
      drawMaze(
        canvasDataRef,
        featureStep.y,
        featureStep.x,
        maze,
        room?.config?.mazeSize,
      );
    }
  }, [featureStep, maze]);

  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && player?.finishPoint) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCanvas(ctx, canvasDataRef, room?.config);
        drawVisitedCells(ctx, visitedCells, room?.config);
        drawRedSquare(ctx, redSquarePos, room?.config.cellSize);
        drawFinishFlag(ctx, player.finishPoint, room?.config.cellSize);
      }
    }
  }, [player?.finishPoint, redSquarePos, visitedCells]);

  React.useEffect(() => {
    socket.on(RoomEvents.SEND_HISTORY, handleChatMessage);
    socket.on(GameEvents.CHECK, handleCheck);

    return () => {
      socket.off(RoomEvents.SEND_HISTORY, handleChatMessage);
      socket.off(GameEvents.CHECK, handleCheck);
    };
  }, [handleChatMessage, handleCheck]);

  React.useEffect(() => {
    getFeatureStep();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, redSquarePos, getFeatureStep]);

  return (
    <>
      {room && (
        <canvas
          ref={canvasRef}
          width={room.config.mazeSize * room.config.cellSize}
          height={room.config.mazeSize * room.config.cellSize}
          style={{
            border: '4px solid grey',
            opacity: `${player?.canMove ? 1 : 0.5}`,
          }}
        />
      )}
    </>
  );
};
