import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Play = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className='h-full w-full flex gap-4'>
      <div className='bg-[#D9D9D9] border-solid border-dark-cl border-[4px] rounded-2xl h-full w-full flex justify-center items-center md:gap-24 gap-7 md:flex-row flex-col relative'>
        <motion.div
          className='red relative aspect-[3/4] w-[40%]  md:w-[35%] max-w-[400px] border-solid border-[4px] border-dark-cl  flex flex-col hover:cursor-pointer'
          initial={{ rotate: 6, y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{
            rotate: 0,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 15 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <div className='bg-[#CACACA] rounded-full border-solid border-dark-cl border-[2px] md:border-[3px] absolute aspect-[1] h-[8%] top-[-5%] left-[50%]'>
            <div className='bg-white rounded-full border-[2px] absolute aspect-[1] h-[30%] top-[5%] left-[15%]'></div>
          </div>
          <div className='bg-[#C84D46] aspect-w-4 aspect-h-5 h-[80%] border-b-[4px] border-solid border-dark-cl'></div>
          <div className='h-[20%] bg-white flex justify-center items-center text-md sm:text-xl md:text-2xl lg:text-3xl text-dark-cl'>Classic Mode</div>
        </motion.div>

        <motion.div
          className={
            !isChatOpen
              ? 'blue relative aspect-[3/4] w-[40%]  md:w-[35%] max-w-[400px] border-solid border-[4px] border-dark-cl  flex flex-col hover:cursor-pointer'
              : 'w-3/4 blue relative aspect-[3/4]  max-w-[250px] border-solid border-[4px] border-dark-cl  flex flex-col hover:cursor-pointer'
          }
          initial={{ rotate: -6, y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{
            rotate: 0,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 15 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <div className='bg-[#CACACA] rounded-full border-solid border-dark-cl border-[2px] md:border-[3px] absolute aspect-[1] h-[8%] top-[-5%] left-[30%]'>
            <div className='bg-white rounded-full border-[2px] absolute aspect-[1] h-[30%] top-[5%] left-[15%]'></div>
          </div>
          <div className='bg-blue-cl aspect-w-4 aspect-h-5 h-[80%] border-b-[4px]  border-solid border-dark-cl'></div>
          <div className='h-[20%] bg-white flex  justify-center items-center text-md sm:text-xl md:text-2xl lg:text-3xl text-dark-cl'>Powerups Mode</div>
        </motion.div>
        <Outlet />
      </div>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className='w-1/2 bg-[#D9D9D9] border-solid border-dark-cl border-[4px] rounded-2xl relative '
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
              transition: { type: 'tween' },
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { type: 'tween' } }}
          >
            <motion.div
              className=' bg-dark-cl h-8  w-8 absolute -top-4 -right-3 hover:cursor-pointer rounded-full flex justify-center items-center hover:bg-red-cl'
              onClick={() => setIsChatOpen(false)}
              whileHover={{ scale: 1.2 }}
            >
              <span className='text-white mt-1 text-2xl'>X</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Play };
