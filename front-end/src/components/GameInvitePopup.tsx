import { useEffect, useState } from 'react';
import { useUserStore } from '../user/userStore';

const img = 'https://res.cloudinary.com/dwrysd8sm/image/upload/v1702374192/wp8ylrz4ejczvz8gthwr.png';

function GameInvitePopup() {
  const game = useUserStore((state) => state.socket?.game);
  const [open, setOpen] = useState(false);
  const [inviteOwner, setInviteOwner] = useState(0);
  const [token, setToken] = useState('');
  const { user } = useUserStore();

  const handleAccept = () => {
    game?.emit('acceptInvite', { token: token, from: user.id, inviteOwner });
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  useEffect(() => {
    game?.on('invite', (data: any) => {
      console.log(data);
      setToken(data.token);
      setInviteOwner(data.from);
      setOpen(true);
    });

    game?.on('invalidInvite', (data: any) => {
      console.log('invalid invite');
      console.log(data);
    });

    return () => {
      game?.off('invite');
      game?.off('invalidInvite');
    };
  }, [game, open, token]);

  if (!open) return null;

  return (
    <div
      className='absolute z-50
	  text-dark-cl font-bold
		flex justify-center items-center gap-2 
		 w-56 h-14
		left-10 top-28 bg-light-gray-cl border-solid border-2 border-dark-cl rounded-l-full rounded-r-xl'
    >
      <img
        src={img}
        alt='Achedmi'
        className='
	 absolute 
	  w-14 h-14 rounded-full left-[-2px] border-2 border-solid border-dark-cl'
      />

      <p className='w-28 ml-16 h-12  '>Achedmi invited you</p>
      <div className='flex flex-col h-full text-light-gray w-full'>
        <button className='bg-blue-cl  h-full' onClick={handleAccept}>
          Play
        </button>
      </div>
    </div>
  );
}

export default GameInvitePopup;
