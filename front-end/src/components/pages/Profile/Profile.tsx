import { Edit, Toggle } from '../../icons/icons';
import { motion } from 'framer-motion';
import EditProfile from './EditProfile';
import { useState, useCallback } from 'react';
import { useUserStore } from '../../../user/userStore';
import HandleTfa from '../../2fa/HandleTfa';
// import axios, { AxiosError } from 'axios';
import axios from '../../../utils/axios';
import { SubNavBar } from '../../SubNavBar';
import { Outlet } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import toastConfig from '../../../utils/toastConf';

function Profile() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showTfa, setShowTfa] = useState(false);
  const { userData, setUserData } = useUserStore();
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, [isLoaded]);

  const hanfleToggleTfa = useCallback(async () => {
    if (userData.isTFAenabled) {
      try {
        toast.promise(
          async () => {
            await axios.post('http://localhost:9696/auth/disableTFA');
            setUserData({ isTFAenabled: false, isTfaVerified: false });
          },
          toastConfig({
            success: '2FA Disabled!',
            error: 'Error Disabling 2FA',
            pending: 'Disabling 2FA...',
          }),
        );
      } catch (error) {
        console.log(error);
      }
    } else setShowTfa(true);
  }, [userData?.isTFAenabled]);

  return (
    <div className='flex flex-col  bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl   h-full w-full relative overflow-y-scroll no-scrollbar pb-10'>
      {showEditProfile && (
        <motion.div className='absolute  w-[500px]  max-w-[75%] bg-[#D9D9D9] z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-dark-cl border-[3px] border-solid rounded-xl'>
          <EditProfile showEditProfile={showEditProfile} setShowEditProfile={setShowEditProfile} />
        </motion.div>
      )}
      {showTfa && (
        <motion.div className='absolute  w-[500px]  max-w-[75%] bg-[#D9D9D9] z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-dark-cl border-[3px] border-solid rounded-xl'>
          <HandleTfa showTfa={showTfa} setShowTfa={setShowTfa} />
        </motion.div>
      )}

      <div className={showEditProfile || showTfa ? 'blur-md z-0 non-selectable pointer-events-none' : 'z-0'}>
        <div className='bg-dark-cl h-40  relative'>
          <motion.div>
            {!isLoaded && (
              <div className='xs:h-44 xs:w-44 xs:top-[65px] h-36 w-36 max-h-44 max-w-44 rounded-full absolute top-[85px] left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px] bg-dark-cl'>
                <SyncLoader className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' color='#ffffff' />
              </div>
            )}

            <img
              src={userData.avatar}
              alt=''
              className='xs:h-44 xs:w-44 xs:top-[65px] h-36 w-36 max-h-44 max-w-44 rounded-full absolute top-[85px]  left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px] duration-200'
              onLoad={handleLoaded}
            />
          </motion.div>
          <motion.div
            className='bg-[#D9D9D9] hover:cursor-pointer  flex justify-center gap-2 items-center rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 right-0 mr-4 p-2 h-11'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title='Edit profile'
            onClick={() => setShowEditProfile(true)}
          >
            <Edit size='26' fillColor='#433650' />
            <span className='hidden sm:block non-selectable'>Edit profile</span>
          </motion.div>
          <div className='bg-[#D9D9D9] flex justify-center gap-2 items-center flex-col  rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 left-0 ml-4 p-2 h-16 xs:flex-row xs:h-11 duration-300'>
            <span className='non-selectable '>2FA</span>
            <div onClick={hanfleToggleTfa}>
              <Toggle on={userData.isTFAenabled} />
            </div>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center '>
          <span className='text-3xl sm:text-4xl font-bold text-center mt-24 '>{userData.displayName}</span>
          <span className='text-md opacity-75'>{'@' + userData.username}</span>
          <div className='flex gap-8 w-full justify-center mt-8 sm:text-xl'>
            <span> {Math.floor(Math.random() * 100)} Wins</span>
            <span>|</span>
            <span>{Math.floor(Math.random() * 100)} Losses</span>
          </div>

          <div className='BIO  h-16 w-[80%] max-w-3xl bg-dark-cl border-solid border-dark-cl rounded-xl border-[4px] mt-8 relative flex justify-center items-center'>
            <span className='absolute -top-8 left-0 text-xl'>About me</span>
            <span className='text-white text-sm sm:text-lg'>{userData.bio}</span>
          </div>
          <div className=' flex flex-col content-center w-[80%] max-w-3xl h-80 border-solid border-dark-cl border-[4px] mt-8 rounded-xl overflow-hidden'>
            <SubNavBar />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
