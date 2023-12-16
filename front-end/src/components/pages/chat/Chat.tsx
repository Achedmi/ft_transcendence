import { NoChatIcon } from "../../icons/icons";

function Chat() {
  return (
    <div className='h-full w-full bg-gray-cl border-solid border-[4px] border-dark-cl rounded-xl '>
      <div className='h-full w-full flex justify-center items-center text-3xl text-dark-cl'>
		
		<div className="flex flex-col items-center gap-6 ">
		<NoChatIcon className="h-28 w-28 fill-dark-cl"/>
		<span>
			No Chats, Yet.
		</span>

		</div>
		
		
		</div>
    </div>
  );
}

export default Chat;
