import { motion } from 'framer-motion';
import { useUserStore } from '../../user/userStore';
import { PropagateLoader } from 'react-spinners';
import { useEffect } from 'react';
import { useGameStore } from '../../game/gameStore';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import toastConfig from '../../utils/toastConf';

const Play = () => {
  const { socket, user, setUserData, abelToPlay, setAbelToPlay } = useUserStore();
  const game = useGameStore();
  const handleClassicMode = async () => {
    // axios.get('/user/isAbleToPlay').then((res) => {
    //   setAbelToPlay(res?.data);
    //   console.log(res?.data);
    // });
    console.log('isAbleToPlay', abelToPlay);
    const isAbleToPlay = (await axios.get('/user/isAbleToPlay'))?.data;
    setAbelToPlay(isAbleToPlay);
    if (!isAbleToPlay)
    {
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
    } 
    socket?.game?.emit('readyToPlay', { userId: user.id });
    console.log('readyToPlay sent');
  };

  // useEffect(() => {
  //   axios.get('/user/isAbleToPlay').then((res) => {
  //     setAbelToPlay(res?.data);
  //     console.log(res?.data);
  //   });
  // }, [abelToPlay]);

  const handleIncrement = () => {
    socket?.game?.emit('incrementScore', { userId: user.id, gameId: game.id });
    console.log('increment sent');
  };

  useEffect(() => {
    socket?.game?.on('updateStatus', (status: string) => {
      console.log('updateStatus', status);
      setUserData({ status });
    });

    socket?.game?.on('gameIsReady', (data: any) => {
      game.setId(data.gameId);
    });

    socket?.game?.on('countdown', (count: number) => {
      game.setCounter(count);
      console.log('countdown', count);
    });

    socket?.game?.on('gameUpdates', (data: any) => {
      game.setMyScore(data.player1.userId === user.id ? data.player1.score : data.player2.score);
      game.setOpponentScore(data.player1.userId === user.id ? data.player2.score : data.player1.score);
    });

    return () => {
      socket?.game?.off('updateStatus');
      socket?.game?.off('countdown');
      socket?.game?.off('gameUpdates');
    };
  }, [user.status, game.counter, socket?.game, game.myScore, game.opponentScore]);

  
  return (
    <div className='h-full w-full flex gap-4'>
      <div className='bg-[#D9D9D9] border-solid border-dark-cl border-[4px] rounded-2xl h-full w-full flex justify-center items-center md:gap-24 gap-7 md:flex-row flex-col relative'>
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
            playing
            <div className='flex gap-10'>
              <span>{`${user.displayName}: ${game.myScore} `}</span>
              <span>{`Opponent: ${game.opponentScore} `}</span>
            </div>
            <div className='bg-dark-cl aspect-video w-[90%] max-w-6xl flex justify-center items-center'>
              <button onClick={handleIncrement}>add score</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Play };
