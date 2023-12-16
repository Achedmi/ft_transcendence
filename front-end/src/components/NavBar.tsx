import Logo from '../assets/logo.svg?react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Profile, Logout } from './icons/icons';
import { useUserStore } from '../user/userStore';
import axios, { AxiosError } from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../../src/styles/customToastStyles.css';

interface DropDownItemProps {
  Icon: any;
  text: string;
}

const DropDownItem = (prop: DropDownItemProps) => {
  return (
    <motion.div
      className='group flex flex-start gap-4 items-center w-full p-2  hover:cursor-pointer hover:bg-[#433650] hover:text-[#D9D9D9] non-selectable '
      whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
    >
      <prop.Icon size='2rem' className='fill-dark-cl group-hover:fill-light-gray-cl' />
      <span>{prop.text}</span>
    </motion.div>
  );
};

const DropDown = ({ setShowDropDown }: any) => {
  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:9696/auth/logout',
        {},
        {
          withCredentials: true,
        },
      );
      window.location.href = '/';
    } catch (error: AxiosError | any) {
      console.log(error);
      if (error instanceof AxiosError) alert(error.response?.data.message);
    }
  };

  const dropShadowStyle = {
    filter: 'drop-shadow(2px 3px 0 #433650)',
  };
  return (
    <motion.div
      className='flex flex-col justify-center items-center text-2xl bg-[#D9D9D9]  w-44 absolute right-6 top-[5rem] z-20 border-solid border-dark-cl border-[4px] rounded-2xl '
      style={dropShadowStyle}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, transition: { duration: 0.1 } }}
    >
      <Link
        to='/profile'
        className='w-full'
        onClick={() => {
          setShowDropDown();
        }}
      >
        <DropDownItem Icon={Profile} text='Profile'/>
      </Link>
      <Link to='/login' className='w-full' onClick={handleLogout}>
        <DropDownItem Icon={Logout} text='Logout' />
      </Link>
    </motion.div>
  );
};

function NavBar() {
  const { user } = useUserStore();
  const location = useLocation();
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <div className=''>
      <div className='min-w-[300px]  flex  justify-between bg-[#D9D9D9] text-dark-cl font-Baloo font-bold h-16 border-solid border-dark-cl border-[4px] rounded-2xl items-center'>
        <Link to='/' className=''>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.5 }}>
            <Logo className='h-12 terminw-12 ml-1' />
          </motion.div>
        </Link>

        <div className='text-lg sm:text-2xl flex sm:gap-6'>
          <Link to='/' className={location.pathname === '/' ? 'p-2' : 'p-2 opacity-50 hover:opacity-100'}>
            Home
          </Link>
          <Link to='play' className={location.pathname.startsWith('/play') ? 'p-2' : 'p-2 opacity-50 hover:opacity-100'}>
            Play
          </Link>
          <Link to='ranking' className={location.pathname.startsWith('/ranking') ? 'p-2' : 'p-2 opacity-50 hover:opacity-100'}>
            Ranking
          </Link>
          <Link to='chat' className={location.pathname.startsWith('/chat') ? 'p-2' : 'p-2 opacity-50 hover:opacity-100'}>
            Chat
          </Link>
        </div>
        <motion.div
          className='hover:cursor-pointer'
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setShowDropDown(!showDropDown);
          }}
        >
          <img className='h-12 w-12 mr-1 rounded-full border-solid border-dark-cl border-[4px]' src={user.avatar} alt='profile' />
        </motion.div>
        <AnimatePresence>{showDropDown && <DropDown setShowDropDown={setShowDropDown} />}</AnimatePresence>
      </div>
    </div>
  );
}

export default NavBar;
