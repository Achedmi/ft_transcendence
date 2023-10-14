import { useEffect } from 'react';
import Logo from '../assets/logo.svg?react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
    const location = useLocation();

    return (
        <div className="p-3">
            <div className="flex  justify-between bg-[#D9D9D9] text-dark-cl font-Baloo font-bold h-16 border-solid border-dark-cl border-[4px] rounded-2xl items-center" >
                <Logo className='p-1 ml-1'/>
                <div className='text-2xl '>
                    <Link to="/home" className={location.pathname.startsWith('/home') ? 'p-2' : "p-2 opacity-50 hover:opacity-100"}>Home</Link>
                    <Link to="/play" className={location.pathname.startsWith('/play') ? 'p-2' : "p-2 opacity-50 hover:opacity-100"}>Play</Link>
                    <Link to="/ranking" className={location.pathname.startsWith('/ranking') ? 'p-2' : "p-2 opacity-50 hover:opacity-100"}>Ranking</Link>
                </div>
                <img  className='h-12 w-12 mr-1 rounded-full border-solid border-dark-cl border-[4px]' src="https://lh3.googleusercontent.com/a/ACg8ocL-9Y2bO5GlwD6lzd9VA_4ikVLfDUoouDR_C1WzO4hFVYY=s576-c-no" alt="profile" />
            </div>
        </div>
 
 );
}


export default NavBar;

