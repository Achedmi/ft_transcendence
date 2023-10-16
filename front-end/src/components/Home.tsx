import RedBlock from '../assets/RedBlock.svg?react';
import HomePong from '../assets/HomePong.svg?react';
import BlueBlock from '../assets/BlueBlock.svg?react';
function Home () {
    return (
        <div className='zwa9 flex items-center h-full justify-around'>

            <div className='flex flex-end h-full justify-center'>
                <RedBlock className='w-full mt-48 max-h-[180px] h-[calc(100%-12rem)]'/>
            </div>


            <div className='flex  h-full items-center'>
                <HomePong className='w-full max-h-[180px] h-[100%] hover:transform hover:scale-125 '/>
            </div>


            <div className='flex  items-end h-full justify-center '>
                <BlueBlock className='w-full mb-48 max-h-[180px] h-[calc(100%-12rem)]'/>
            </div>


        </div>

    );
}


export default Home; 