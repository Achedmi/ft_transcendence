import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { Outlet, useActionData, useParams } from 'react-router-dom';
import { useUserStore } from '../../user/userStore';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { SubNavBar } from '../SubNavBar';
import { userFriendsStore } from './Profile/Friends';
import toastConfig from '../../utils/toastConf';
import { AddFriendIcon, UnfriendIcon } from '../icons/icons';

function Users() {
  const [isLoaded, setIsLoaded] = useState(false);
  const friendsStore = userFriendsStore();
  const { username } = useParams<{ username: string }>();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { data, refetch, isLoading } = useQuery('users', () => friendsStore.fetchUserAndFriends(username || ''));
  const game = useUserStore((state) => state.socket?.game);
  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
    console.log('loaded');
  }, [isLoaded]);

  useEffect(() => {
    refetch();
  }, [username]);

  useEffect(() => {

    if (!isLoading && data && username === user.username) navigate('/profile');
  }, [isLoading, data, username]);

  const friendToggle = useCallback(async () => {
    try {
      toast.promise(
        async () => {
          if (data?.isFriend) await friendsStore.unfriend(data.id);
          else await friendsStore.beFriends(data.id);
          await refetch();
        },
        toastConfig({
          success: !data?.isFriend ? 'Friend added!' : 'Friend removed!',
          error: !data?.isFriend ? 'Error adding friend' : 'Error removing friend',
          pending: !data?.isFriend ? 'Sending friend request...' : 'Removing friend...',
        }),
      );
    } catch (error) {
      console.log(error);
    }
  }, [data?.isFriend]);


  const sendGameInvite = useCallback(() => {
    console.log('sending invite');
      game?.emit('createInvite', { userId: data?.id });
  }, [data?.id, game]);

  return (
    <>
      {isLoading && (
        <div className='h-full w-full flex justify-center items-center'>
          <SyncLoader color='#433650' />
        </div>
      )}
      {data && (
        <div className='flex flex-col  bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl  h-full w-full relative overflow-y-scroll no-scrollbar'>
          <div className='z-0'>
            <div className='bg-dark-cl h-40  relative'>
              <motion.div>
                {!isLoaded && (
                  <div className='h-44 w-44 max-h-44 max-w-44 rounded-full absolute top-[65px] left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px] bg-dark-cl'>
                    <SyncLoader className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' color='#ffffff' />
                  </div>
                )}
                <img
                  src={data.avatar}
                  alt=''
                  className='object-cover h-44 w-44 max-h-44 max-w-44 rounded-full absolute top-[65px] left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px]'
                  onLoad={handleLoaded}
                  onClick={sendGameInvite}
                />
              </motion.div>
              {data.isFriend ? (
                <motion.div
                  className='bg-red-cl hover:cursor-pointer text-white flex justify-center gap-2 items-center rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 right-0 mr-4 p-2 h-11'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title='Unfriend'
                  onClick={friendToggle}
                >
                  <UnfriendIcon />
                  <span className='hidden sm:block non-selectable'>Unfriend</span>
                </motion.div>
              ) : (
                <motion.div
                  className='bg-blue-cl text-white hover:cursor-pointer  flex justify-center gap-2 items-center rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 right-0 mr-4 p-2 h-11'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title='Be Friends'
                  onClick={friendToggle}
                >
                  <AddFriendIcon className='h-5 w-5 fill-white' />
                  <span className='hidden sm:block non-selectable'>Add Friend</span>
                </motion.div>
              )}
            </div>
            <div className='flex flex-col justify-center items-center '>
              <span className='text-3xl sm:text-4xl font-bold text-center mt-24 '>{data.displayName}</span>
              <span className='text-md opacity-75'>{'@' + data.username}</span>
              <div className='flex gap-8 w-full justify-center mt-8 sm:text-xl'>
                <span> {`${data.wins} Win${data.wins != 1 ? 's' : ''}`}</span>
                <span>|</span>
                <span>{`${data.losses} Loss${data.losses != 1 ? 'es' : ''}`}</span>
              </div>

              <div className='BIO  h-16 w-[80%] max-w-3xl bg-dark-cl border-solid border-dark-cl rounded-xl border-[4px] mt-8 relative flex justify-center items-center'>
                <span className='absolute -top-8 left-0 text-xl'>About me</span>
                <span className='text-white text-sm sm:text-lg'>{data.bio}</span>
              </div>
              <div className=' flex flex-col content-center w-[80%] max-w-3xl h-80 border-solid border-dark-cl border-[4px] mt-8 rounded-xl overflow-hidden'>
                <SubNavBar />
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
