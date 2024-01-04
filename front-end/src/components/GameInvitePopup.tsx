import { useEffect, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';

function GameInvitePopup() {
  const game = useUserStore((state) => state.socket?.game);
  const [open, setOpen] = useState(false);
  const [inviteOwner, setInviteOwner] = useState(0);
  const [token, setToken] = useState('');
  const { user } = useUserStore();
  const [inviter, setInviter] = useState({} as any);

  const handleAccept = () => {
    game?.emit('acceptInvite', { token: token, from: user.id, inviteOwner });
    setOpen(false);
  };

  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     setOpen(false);
  //   }, 9000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [open]);

  useEffect(() => {
    game?.on('invite', (data: any) => {
      setToken(data.token);
      setInviteOwner(data.from);
      setInviter({ username: data.username, avatar: data.avatar });
      setOpen(true);
    });

    game?.on('invalidInvite', () => {
      toast.error('Invalid invite');
    });

    return () => {
      game?.off('invite');
      game?.off('invalidInvite');
    };
  }, [game, open, token]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30, transition: { duration: 0.1 } }}
          className='absolute z-50
	  text-dark-cl font-bold
		flex justify-center items-center gap-2 
		 w-50 h-14
		left-10 top-28 bg-white  rounded-xl shadow-xl '
        >
          <img
            src={inviter.avatar}
            alt='Achedmi'
            className='
	 absolute 
	  w-14 h-14 rounded-full left-[-14px] border- border-solid border-dark-cl'
          />

          <p className='w-28 ml-16 h-12  mr-2 text-sm'>
            {' '}
            <span className='text-blue-cl text-xl'>{inviter.username}</span> invited you
          </p>
          <div className='flex flex-col h-full text-light-gray w-full rounded-r-xl'>
            <button className='bg-blue-cl  h-full rounded-r-xl' onClick={handleAccept}>
              Play
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GameInvitePopup;
