
import Logo from '../assets/logo.svg?react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavBar() {
    const location = useLocation();
    return (
        <div className="">
            <div className="flex  justify-between bg-[#D9D9D9] text-dark-cl font-Baloo font-bold h-16 border-solid border-dark-cl border-[4px] rounded-2xl items-center" >
                <Link to="/home" className=''>
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.5 }}>
                    <Logo className='h-12 terminw-12 ml-1'/>
                </motion.div>
                    </Link>
                <div className='text-2xl '>
                    <Link to="/home" className={location.pathname.startsWith('/home') ? 'p-2' : "p-2 opacity-50 hover:opacity-100"}>Home</Link>
                    <Link to="/play" className={location.pathname.startsWith('/play') ? 'p-2' : "p-2 opacity-50 hover:opacity-100"}>Play</Link>
                    <Link to="/ranking" className={location.pathname.startsWith('/ranking') ? 'p-2' : "p-2 opacity-50 hover:opacity-100"}>Ranking</Link>
                </div>
                <img  className='h-12 w-12 mr-1 rounded-full border-solid border-dark-cl border-[4px]' src="https://i.pinimg.com/564x/90/74/c0/9074c097723d1832ea5c80cafa384104.jpg" alt="profile" />
            </div>
        </div>
 
 );
}


export default NavBar;
