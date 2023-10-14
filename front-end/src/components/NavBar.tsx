import Logo from '../assets/logo.svg?react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div className="p-3">
            <div className="flex  justify-between bg-[#D9D9D9] text-dark-cl font-Baloo font-bold h-16 border-solid border-dark-cl border-[4px] rounded-2xl items-center" >
                <Logo className='p-1 ml-1'/>
                <div className='text-2xl'>
                    <Link to="/home" className="p-2">Home</Link>
                    <Link to="/play" className="p-2">Play</Link>
                    <Link to="/ranking" className="p-2">Ranking</Link>
                </div>
                <img  className='h-12 w-12 mr-1 rounded-full border-solid border-dark-cl border-[4px]' src="https://lh3.googleusercontent.com/a/ACg8ocL-9Y2bO5GlwD6lzd9VA_4ikVLfDUoouDR_C1WzO4hFVYY=s576-c-no" alt="profile" />
            </div>
        </div>
 
 );
}


export default NavBar;

