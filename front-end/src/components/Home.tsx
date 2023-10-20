import RedBlock from '../assets/redblock.svg?react';
import HomePong from '../assets/homepong.svg?react';
import BlueBlock from '../assets/blueblock.svg?react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';




function Home () {
    return (
        <div className='zwa9 flex items-center h-full justify-around '>

            <div className='flex flex-end h-full justify-center'>
                <motion.div 
                    className='w-full mt-48 max-h-[180px] h-[calc(100%-12rem)] hover:cursor-grab active:cursor-grabbing'
                    drag = 'y'
                    dragConstraints={{ top: -75, bottom: 120 }}
                    >
                    <RedBlock />
                </motion.div>
            </div>


            <div className='flex  h-full flex-col items-center justify-center gap-6'>
                <Link to="/play" className='w-full h-[20%]'>
                    <motion.div 
                        className="h-full w-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.5 }}
                        >
                            <HomePong className='w-full h-full'/>
                    </motion.div>
                </Link>
                <span className='text-xl text-dark-cl opacity-75'>click Pong to play</span>
            </div>


            <div className='flex  items-end h-full justify-center '>
                <motion.div
                    className='w-full mb-48 max-h-[180px] h-[calc(100%-12rem)] hover:cursor-grab active:cursor-grabbing'
                    drag = 'y'
                    dragConstraints={{ top: -100, bottom: 75 }}
                    >
                    <BlueBlock/>
                </motion.div>
            </div>


        </div>

    );
}


export default Home; 
