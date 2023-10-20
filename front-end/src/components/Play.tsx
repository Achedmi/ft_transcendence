import { Link, Outlet } from "react-router-dom";


import { motion } from "framer-motion";

const Play = () => {

    return (
        <div className="h-full w-full flex justify-center items-center md:gap-24 gap-7 md:flex-row flex-col">
            <motion.div
            className="relative aspect-[3/4] w-[40%]  md:w-[35%] max-w-[400px] border-solid border-[4px] border-dark-cl  flex flex-col" 
            
            initial={{ rotate: 6 } }
            whileHover={{ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 15 } }}>
                <div className="bg-[#CACACA] rounded-full border-solid border-dark-cl border-[2px] md:border-[3px] absolute aspect-[1] h-[8%] top-[-5%] left-[50%]">
                    <div className="bg-white rounded-full border-[2px] absolute aspect-[1] h-[30%] top-[5%] left-[15%]"></div>
                </div>
                <div className="bg-[#C84D46] aspect-w-4 aspect-h-5 h-[80%] border-b-[4px] border-solid border-dark-cl"></div>
                <div className="h-[20%] bg-white flex justify-center items-center text-xl md:text-2xl lg:text-3xl text-dark-cl">
                    Classic Mode
                </div> 
            </motion.div>
            <motion.div className=" relative aspect-[3/4] w-[40%]  md:w-[35%] max-w-[400px] border-solid border-[4px] border-dark-cl md:-rotate-6  flex flex-col"
            initial={{ rotate: -6 }}
            whileHover={{ rotate: 0, y: 0, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
            >
                <div className="bg-[#CACACA] rounded-full border-solid border-dark-cl border-[2px] md:border-[3px] absolute aspect-[1] h-[8%] top-[-5%] left-[30%]">
                    <div className="bg-white rounded-full border-[2px] absolute aspect-[1] h-[30%] top-[5%] left-[15%]"></div>
                </div>
                <div className="bg-blue-cl aspect-w-4 aspect-h-5 h-[80%] border-b-[4px]  border-solid border-dark-cl"></div>
                <div className="h-[20%] bg-white flex justify-center items-center text-xl md:text-2xl lg:text-3xl text-dark-cl">
                    Powerups Mode
                </div>
                
            </motion.div>
            <Outlet/>
        </div>
    )
}



export { Play};
