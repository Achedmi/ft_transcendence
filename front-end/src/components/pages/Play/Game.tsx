import { useCallback, useEffect, useRef, useState } from 'react';
import useGameStore, { Ball, GameData, Player } from '../../../game/gameStore';
import { useUserStore } from '../../../stores/userStore';

function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  const game = useGameStore();
  const ctx = canvas?.getContext('2d');
  const { socket, user } = useUserStore();
  const keyState = useRef({
    ArrowUp: false,
    ArrowDown: false,
  }).current;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      keyState[e.key] = true;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      keyState[e.key] = false;
    }
  }, []);

  const sendMovementUpdate = useCallback(() => {
    if (keyState.ArrowUp) {
      socket?.game.emit('move', { userId: user.id, gameId: game.id, direction: 'up' });
    } else if (keyState.ArrowDown) {
      socket?.game.emit('move', { userId: user.id, gameId: game.id, direction: 'down' });
    }
    requestAnimationFrame(sendMovementUpdate);
  }, [socket?.game, user.id, game.id]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(sendMovementUpdate);
    return () => cancelAnimationFrame(animationFrame);
  }, [sendMovementUpdate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const renderPlayer = useCallback((ctx: CanvasRenderingContext2D, player: Player, color?: string) => {
    ctx.fillStyle = color || 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }, []);

  const renderBall = useCallback((ctx: CanvasRenderingContext2D, ball: Ball, color?: string) => {
    ctx.fillStyle = color || 'white';
    const ballSize = ball.size * 2;
    ctx.fillRect(ball.x - ball.size, ball.y - ball.size, ballSize, ballSize);
  }, []);

  const renderGame = useCallback(() => {
    if (ctx) {
      ctx.clearRect(0, 0, 1280, 720);
      ctx.fillStyle = '#695d71';
      // draw the net
      ctx.fillRect(640 - 5, 0, 10, 720);
      //player 1 color #C84D46
      //player 2 color #67B9D3
      renderPlayer(ctx, game.player1, '#C84D46');
      renderPlayer(ctx, game.player2, '#67B9D3');
      renderBall(ctx, game.ball, 'white');
    }
  }, [game.player1, ctx, game.player2, game.ball]);

  useEffect(() => {
    let frameId: number;
    if (ctx) {
      renderGame();
      frameId = requestAnimationFrame(renderGame);
      return () => {
        cancelAnimationFrame(frameId);
      };
    }
  }, [ctx, renderGame]);

  useEffect(() => {
    socket?.game.on('gameUpdates', (gameData: GameData) => {
      game.updateGame(gameData);
    });
    return () => {
      socket?.game.off('gameUpdates');
    };
  }, [socket?.game, game, canvas]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [socket?.game, game]);

  return (
    <div className='h-full w-full flex flex-col gap-4 justify-center items-center '>
      <div className=' scoreBoard flex   w-[80%]   justify-between gap-10  '>
        <div className='leftplayer flex justify-between w-1/2 bg-dark-cl px-5 py-2 rounded-full text-white'>
          <div className='flex gap-2 items-center '>
            <img className='h-10 w-10 rounded-full' src={game.player1.userId < game.player2.userId ? game.player1.avatar : game.player2.avatar} alt='user avatar' />
            <span>{game.player1.userId < game.player2.userId ? game.player1.displayName : game.player2.displayName}</span>
          </div>
          <div className='flex  items-center'>
            <span>{`${game.player1.userId < game.player2.userId ? game.player1.score : game.player2.score} `}</span>
          </div>
        </div>

        <div className='right player flex justify-between w-1/2 bg-dark-cl px-5 py-2 rounded-full text-white'>
          <div className='flex  items-center'>
            <span>{`${game.player2.userId < game.player1.userId ? game.player1.score : game.player2.score} `}</span>
          </div>
          <div className='flex gap-2 items-center '>
            <span>{`${game.player2.userId < game.player1.userId ? game.player1.displayName : game.player2.displayName}`}</span>
            <img className='h-10 w-10 rounded-full' src={`${game.player2.userId < game.player1.userId ? game.player1.avatar : game.player2.avatar}`} alt='user avatar' />
          </div>
        </div>
      </div>
      <div className='max-h-[75%] max-w-[80%]  aspect-video flex  justify-center bg-dark-cl p-4 rounded-xl '>
        <canvas className='aspect-video relative z-50 border-4 border-solid border-gray-cl/25 ' width={1280} height={720} ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default Game;
