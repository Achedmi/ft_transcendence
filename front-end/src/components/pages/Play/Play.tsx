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
  const { socket, user, setUserData, abelToPlay, setAbelToPlay, gameEnded, setGameEnded } = useUserStore();
  const game = useGameStore();

  const handleGameMode = useCallback(
    async (type: string) => {
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
        socket?.game?.emit('readyToPlay', { userId: user.id, type });
        console.log('readyToPlay sent');
      }
    },
    [abelToPlay, socket?.game],
  );

  function QueueMusic() {
    return (
      <audio autoPlay loop>
        <source src='/sounds/queue.mp3' type='audio/mpeg' />
      </audio>
    );
  }

  if (gameEnded)
    return (
      <div className='bg-[#D9D9D9] border-solid border-dark-cl border-[4px] rounded-2xl h-full w-full flex justify-center items-center md:gap-24 gap-7 md:flex-row flex-col relative'>
        <div className='flex flex-col gap-7 items-center'>
          <span className='text-dark-cl text-2xl sm:text-2xl  lg:text-3xl font-bold'>Game Over</span>
          {game.winner &&
            (game.winner === user.username ? (
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
              onClick={() => {
                handleGameMode('classic');
              }}
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
              onClick={() => {
                handleGameMode('power');
              }}
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
            <QueueMusic />
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
            <Game></Game>
          </div>
        )}
      </div>
    </div>
  );
};

export { Play };
