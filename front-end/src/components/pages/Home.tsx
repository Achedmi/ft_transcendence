import RedBlock from '../../assets/redblock.svg?react';
import HomePong from '../../assets/homepong.svg?react';
import BlueBlock from '../../assets/blueblock.svg?react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useUserStore } from '../../stores/userStore';

function Home() {
  // const { socket } = useUserStore();

  // const [token, setToken] = useState('');
  // const { user } = useUserStore();
  // const [inviteOwner, setInviteOwner] = useState(0);

  // const handleAccept = useCallback(() => {
  //   console.log('token:', token);
  //   console.log('user:', user);
  //   console.log('inviteOwner:', inviteOwner);
  //   socket?.game?.emit('acceptInvite', { token: token, from: user.id, inviteOwner });
  // }, []);

  // useEffect(() => {
  //   socket?.game?.on('invite', (data: any) => {
  //     console.log(data);
  //     setToken(data.token);
  //     setInviteOwner(data.from);
  //   });

  //   socket?.game?.on('invalidInvite', (data: any) => {
  //     console.log('invalid invite');
  //     console.log(data);
  //   });

  //   return () => {
  //     socket?.game?.off('invite');
  //     socket?.game?.off('invalidInvite');
  //     socket?.game?.off('gameIsReady');
  //   };
  // }, [socket?.game, open, token, user, inviteOwner]);

  return (
    <div className='zwa9 bg-[#D9D9D9] border-solid border-dark-cl border-[4px] rounded-2xl flex items-center h-full justify-around '>
      <div className='red sm:flex flex-end h-full justify-center  hidden'>
        <motion.div
          className='w-full mt-48 max-h-[180px] h-[calc(100%-12rem)] hover:cursor-grab active:cursor-grabbing'
          drag='y'
          dragConstraints={{ top: -75, bottom: 120 }}
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          // onClick={handleAccept}
        >
          <RedBlock />
        </motion.div>
      </div>

      <div className='pong flex  h-full flex-col  justify-center gap-6 items-center'>
        <Link to='/play' className='w-72 sm:w-full  h-[20%]'>
          <motion.div className='h-full w-full' whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
            <HomePong className='w-full h-full' />
          </motion.div>
        </Link>
        <span className='text-xl text-dark-cl opacity-75'>click Pong to play</span>
      </div>

      <div className='blue sm:flex  items-end h-full justify-center  hidden'>
        <motion.div
          className='w-full mb-48 max-h-[180px] h-[calc(100%-12rem)] hover:cursor-grab active:cursor-grabbing'
          drag='y'
          dragConstraints={{ top: -100, bottom: 75 }}
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BlueBlock />
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
