import { motion } from 'framer-motion';
import { useUserStore } from '../../../stores/userStore';
import { PropagateLoader } from 'react-spinners';
import { useCallback, useEffect, useState } from 'react';
import useGameStore from '../../../game/gameStore';
import axios from '../../../utils/axios';
import { toast } from 'react-toastify';
import toastConfig from '../../../utils/toastConf';
import Game from './Game';

const Play = () => {
  const [gameEnded, setGameEnded] = useState(false);
  const { socket, user, setUserData, abelToPlay, setAbelToPlay } = useUserStore();
  const [winner, setWinner] = useState<string>('');
  const game = useGameStore();
  const handleClassicMode = useCallback(async () => {
    const fetchedAbleToPlay = (await axios.get('/user/isAbleToPlay'))?.data;
    if (fetchedAbleToPlay == abelToPlay) return;
    console.log('isAbleToPlay', fetchedAbleToPlay);
    setAbelToPlay(fetchedAbleToPlay);
    if (!fetchedAbleToPlay) {
      toast.promise(
        async () => {
          throw new Error();
        },
        toastConfig({
          success: '',
          pending: '',
          error: "you're already playing or in queue.",
        }),
      );
      return;
    } else {
      socket?.game?.emit('readyToPlay', { userId: user.id });
      console.log('readyToPlay sent');
    }
  }, [abelToPlay, socket?.game]);

  useEffect(() => {
    socket?.game?.on('updateStatus', (status: string) => {
      console.log('updateStatus', status);
      setUserData({ status });
    });

    // socket?.game?.on('gameIsReady', (data: any) => {
    //   game.setId(data.gameId);
    // });

    socket?.game?.on('countdown', (count: number) => {
      game.setCounter(count);
      console.log('countdown', count);
    });

    socket?.game?.on('gameEnded', (data: any) => {
      if (data?.winner) setWinner(data.winner);
      else setWinner('');
      setGameEnded(true);
      setAbelToPlay(false);
      game.setCounter(5);
    });

    return () => {
      socket?.game?.off('updateStatus');
      socket?.game?.off('countdown');
      socket?.game?.off('gameEnded');
    };
  }, [user.status, game.counter, socket?.game, game.myScore, game.opponentScore, gameEnded, winner, game.counter]);

  useEffect(() => {}, []);

  if (gameEnded)
    return (
      <div className='bg-[#D9D9D9] border-solid border-dark-cl border-[4px] rounded-2xl h-full w-full flex justify-center items-center md:gap-24 gap-7 md:flex-row flex-col relative'>
        <div className='flex flex-col gap-7 items-center'>
          <span className='text-dark-cl text-2xl sm:text-2xl  lg:text-3xl font-bold'>Game Over</span>
          {winner &&
            (winner === user.username ? (
              <span className='text-blue-cl text-2xl sm:text-2xl  lg:text-3xl font-bold'>You Won</span>
            ) : (
              <span className='text-red-cl text-2xl sm:text-2xl  lg:text-3xl font-bold'>You Lost</span>
            ))}
          <button
            className='h-10 w-24 bg-red-cl rounded-xl border-2 border-solid border-dark-cl text-white '
            onClick={() => {
              setGameEnded(false);
            }}
          >
            Leave
          </button>
        </div>
      </div>
    );

  // return (
  //   <div className='h-full w-full flex gap-4'>
  //     <div className='bg-[rgb(217,217,217)] border-solid border-dark-cl border-[4px] rounded-2xl h-full w-full flex justify-center items-center md:gap-24 gap-7 md:flex-row flex-col relative'>
  //       <div className='flex flex-col justify-center items-center h-full w-full'>
  //         <div className='flex gap-10 pt-10'>
  //           <span>{`${user.displayName}: ${game.myScore} `}</span>
  //           <span>{`Opponent: ${game.opponentScore} `}</span>
  //         </div>
  //         <Game />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className='h-full w-full flex gap-4'>
      <div className='bg-[rgb(217,217,217)] border-solid border-dark-cl border-[4px] rounded-2xl h-full w-full flex justify-center items-center md:gap-24 gap-7 md:flex-row flex-col relative'>
        {!abelToPlay && (
          <>
            <motion.div
              className='red relative aspect-[3/4] w-[40%]  md:w-[35%] max-w-[400px] border-solid border-[4px] border-dark-cl  flex flex-col hover:cursor-pointer'
              initial={{ rotate: 6, y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{
                rotate: 0,
                y: 0,
                transition: { type: 'spring', stiffness: 300, damping: 15 },
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              whileTap={{ scale: 1.1 }}
              onClick={handleClassicMode}
            >
              <div className='bg-[#CACACA] rounded-full border-solid border-dark-cl border-[2px] md:border-[3px] absolute aspect-[1] h-[8%] top-[-5%] left-[50%]'>
                <div className='bg-white rounded-full border-[2px] absolute aspect-[1] h-[30%] top-[5%] left-[15%]'></div>
              </div>
              <div className='bg-[#C84D46] aspect-w-4 aspect-h-5 h-[80%] border-b-[4px] border-solid border-dark-cl'></div>
              <div className='h-[20%] bg-white flex justify-center items-center text-md sm:text-xgameSocketl md:text-2xl lg:text-3xl text-dark-cl'>Classic Mode</div>
            </motion.div>

            <motion.div
              className='blue relative aspect-[3/4] w-[40%]  md:w-[35%] max-w-[400px] border-solid border-[4px] border-dark-cl  flex flex-col hover:cursor-pointer'
              initial={{ rotate: -6, y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{
                rotate: 0,
                y: 0,
                transition: { type: 'spring', stiffness: 300, damping: 15 },
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <div className='bg-[#CACACA] rounded-full border-solid border-dark-cl border-[2px] md:border-[3px] absolute aspect-[1] h-[8%] top-[-5%] left-[30%]'>
                <div className='bg-white rounded-full border-[2px] absolute aspect-[1] h-[30%] top-[5%] left-[15%]'></div>
              </div>
              <div className='bg-blue-cl aspect-w-4 aspect-h-5 h-[80%] border-b-[4px]  border-solid border-dark-cl'></div>
              <div className='h-[20%] bg-white flex  justify-center items-center text-md sm:text-xl md:text-2xl lg:text-3xl text-dark-cl'>Powerups Mode</div>
            </motion.div>
          </>
        )}
        {user.status?.startsWith('INQUEUE') && abelToPlay && (
          <div className='flex flex-col justify-center items-center gap-4'>
            <div className='text-dark-cl text-2xl sm:text-2xl  lg:text-3xl font-bold'>Looking for a game...</div>
            <PropagateLoader color='#433650' speedMultiplier={0.8}></PropagateLoader>
          </div>
        )}
        {user.status?.startsWith('STARTINGGAME') && abelToPlay && (
          <div className='flex flex-col justify-center items-center gap-4'>
            {<span className='text-dark-cl text-xl sm:text-xl  lg:text-2xl font-bold'>Starting in {game.counter} seconds...</span>}
          </div>
        )}
        {user.status?.startsWith('INGAME') && abelToPlay && (
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <div className='flex mt-1  w-[90%] max-w-6xl justify-between gap-10'>
              <div
                className='flex justify-between w-1/2 bg-dark-cl px-5 py-2 rounded-full text-white
              '
              >
                <div
                  className='flex gap-2 items-center 
                '
                >
                  <img className='h-10 w-10 rounded-full' src={game.player1.userId === user.id ? game.player1.avatar : game.player2.avatar} alt='user avatar' />
                  <span>{game.player1.userId === user.id ? game.player1.displayName : game.player2.displayName}</span>
                </div>
                <div className='flex  items-center'>
                  <span>{`${game.player1.userId === user.id ? game.player1.score : game.player2.score} `}</span>
                </div>
              </div>

              <div
                className='flex justify-between w-1/2 bg-dark-cl px-5 py-2 rounded-full text-white
              '
              >
                <div className='flex  items-center'>
                  <span>{`${game.player2.userId === user.id ? game.player1.score : game.player2.score} `}</span>
                </div>
                <div
                  className='flex gap-2 items-center 
                '
                >
                  <span>{`${game.player2.userId === user.id ? game.player1.displayName : game.player2.displayName}`}</span>
                  <img className='h-10 w-10 rounded-full' src={`${game.player2.userId === user.id ? game.player1.avatar : game.player2.avatar}`} alt='user avatar' />
                </div>
              </div>
            </div>

            <Game></Game>
          </div>
        )}
      </div>
    </div>
  );
};

export { Play };
