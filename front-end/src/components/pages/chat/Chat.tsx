import { SendIcon } from '../../icons/icons';

function Chat() {
  return (
    <div className='h-full w-full bg-gray-cl border-solid border-[4px] border-dark-cl rounded-xl  flex justify-center items-center'>
      <div className='text-dark-cl p-2 h-full w-full flex justify-center'>
        <div className=' LEFT  md:flex flex-col gap-4  w-72 m-2 hidden'>
          <div className='buttons w-full h-14 flex gap-2 m-0'>
            <div className='text-xl flex justify-center items-center rounded-3xl bg-[#ECE8E8] w-1/2 h-full border-2 border-solid border-dark-cl'>
              <span>Dms</span>
            </div>
            <div className='text-xl flex justify-center items-center rounded-3xl w-1/2 h-full'>
              <span>Groups</span>
            </div>
          </div>
          <div className='bg-[#ECE8E8] w-full h-full rounded-3xl border-2 border-solid border-dark-cl'></div>
        </div>

        <div className='MIDDLE flex flex-col gap-4  border-2   w-[40rem] m-2'>
          <div className='header h-14 m-0 w-full bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-3xl flex items-center justify-center'>
            <div className='h-2 w-2 rounded-full bg-blue-cl '></div>
            <span className='text-2xl mx-2'>Achedmi</span>
          </div>
          <div className='CHAT w-full h-full flex flex-col  gap-4'>
            <div className=' w-full h-full bg-[#ECE8E8]  border-2 border-solid border-dark-cl rounded-3xl'></div>
            <div className='input h-14 w-full  flex justify-center items-center '>
              <form className='px-2 h-full w-full flex justify-center items-center bg-[#ECE8E8]  border-2 border-solid border-dark-cl rounded-3xl '>
                <input type='text' className='px-7 w-full h-full rounded-3xl bg-[#ECE8E8] focus:outline-none' placeholder='Write a reply...'></input>
                <button className=' flex justify-center items-center'>
                  <SendIcon className='fill-dark-cl w-10 h-10 mt-2 ' />
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className='RIGHT bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2 hidden'></div>
      </div>
    </div>
  );
}

export default Chat;
