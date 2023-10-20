import RedBlock from '../assets/redblock.svg?react';
import HomePong from '../assets/homepong.svg?react';
import BlueBlock from '../assets/blueblock.svg?react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


function Home () {
    return (
        <div className='zwa9 flex items-center h-full justify-around '>

            <div className='flex flex-end h-full justify-center'>
                <RedBlock className='w-full mt-48 max-h-[180px] h-[calc(100%-12rem)]'/>
            </div>


            <div className='flex  h-full flex-col items-center justify-center gap-6'>
                <motion.div 
                    className="w-full h-[20%]"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.5 }}
                    >
                    <Link to="/play">
                        <HomePong className='w-full h-full'/>
                    </Link>
                </motion.div>
                <span className='text-xl text-dark-cl opacity-75'>click Pong to play</span>
            </div>


            <div className='flex  items-end h-full justify-center '>
                <BlueBlock className='w-full mb-48 max-h-[180px] h-[calc(100%-12rem)]'/>
            </div>


        </div>

    );
}


export default Home; 
