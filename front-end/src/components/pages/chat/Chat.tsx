import { useCallback, useEffect, useRef, useState } from 'react';
import { BlockIcon, Game, Profile, SendIcon } from '../../icons/icons';
import useChatStore, { ChatInterface, ChatType } from '../../../stores/chatStore';
import { useUserStore } from '../../../stores/userStore';
import { useQuery } from 'react-query';
import axios from '../../../utils/axios';

function DmColumn({ chat, CurrentUserId }: { chat: ChatInterface; CurrentUserId: number }) {
  const chatStore = useChatStore();
  return (
    <div
      className=' flex justify-start m-2  items-center gap-2 hover:bg-gray-cl hover:rounded-full cursor-pointer'
      onClick={() => {
        if (chat.id) chatStore.setSelectedChatId(chat.id);
      }}
    >
      <img className='h-10 w-10 rounded-full border-2 border-solid border-dark-cl ' src={chat.image} />
      <div className='name and message flex flex-col max-w-sm'>
        <span className='name text-xl'>{chat.name}</span>
        <span className='message opacity-75 text-sm overflow-hidden truncate w-36'>{`${CurrentUserId == chat.lastMessageSender ? 'You: ' : ''} ${chat.lastMessage}`}</span>
      </div>
    </div>
  );
}

function Chats({ currentUserId }: { currentUserId: number } | any) {
  const chatStore = useChatStore();

  return (
    <div className='flex flex-col gap-2'>
      {chatStore.chats.map((chat: ChatInterface) => {
        return <DmColumn key={chat.id} chat={chat} CurrentUserId={currentUserId} />;
      })}
    </div>
  );
}

interface Message {
  id: number;
  userId: number;
  message: string;
  avatar?: string;
  user?: {
    avatar: string;
  };
}

let messagess = [
  {
    id: 1,
    semder: 'scratch',
    content: 'alo fay9 ?',
    time: '12:00',
    type: 'text',
    avatar: 'https://res.cloudinary.com/dwrysd8sm/image/upload/v1702374192/wp8ylrz4ejczvz8gthwr.png',
  },
  {
    id: 2,
    sender: 'sgamraou',
    content: 'wa9ila hhh',
    time: '12:01',
    type: 'text',
    avatar: '',
  },
  {
    id: 3,
    sender: 'scratch',
    content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    time: '12:01',
    type: 'text',
    avatar: 'https://res.cloudinary.com/dwrysd8sm/image/upload/v1702374192/wp8ylrz4ejczvz8gthwr.png',
  },
  {
    id: 4,
    sender: 'sgamraou',
    content: 'Khyaaaar hhhh 💀',
    time: '12:01',
    type: 'text',
    avatar: '',
  },
];

function Dms({ CurrentUserId }: { CurrentUserId: number | undefined }) {
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const chatStore = useChatStore();

  console.log('gta: ', chatStore.selectedChatId);

  useEffect(() => {
    scrollToBottom();
  }, [chatStore.selectedChat.messages]);

  return (
    <div className='flex flex-col space-y-2'>
      {chatStore.selectedChat.messages &&
        chatStore.selectedChat.messages.map((message: Message) => {
          return (
            <div
              key={message.id}
              className={
                message.userId != CurrentUserId
                  ? 'self-start flex justify-center items-start  gap-2'
                  : 'bg-blue-cl rounded-3xl self-end flex justify-center items-center p-3 max-w-xs '
              }
            >
              {message.userId != CurrentUserId ? (
                <>
                  <img className='h-8 w-8 rounded-full border-2 border-solid border-dark-cl ' src={message.user?.avatar} />
                  <p className='text-md bg-gray-cl rounded-3xl flex justify-center items-start p-3 max-w-xs break-words'>{message.message}</p>
                </>
              ) : (
                <p className='text-md break-words px-2 '>{message.message}</p>
              )}
            </div>
          );
        })}
      <div ref={lastMessageRef}></div>
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState(messagess);
  const [message, setMessage] = useState<string>('');
  const user = useUserStore((state) => state.user);
  const chatStore = useChatStore();

  const { isLoading: chatsLoading, isRefetching: chatsRefreching } = useQuery(['chats', ChatType.DM], chatStore.getChats);
  const { isLoading: selectedChatLoading, isRefetching: selectedChatRefetching } = useQuery(['chat', chatStore.selectedChatId], chatStore.getSelectedChat);
  const handleNewMessage = useCallback(async () => {
    if (message) {
      let buffer = '';
      if (message.length > 34) {
        let words = message.split(' ');
        words.forEach((word) => {
          if (word.length > 34) {
            let newWord = '';
            for (let i = 0; i < word.length; i++) {
              if (i % 34 == 0) {
                newWord += ' ';
              }
              newWord += word[i];
            }
            buffer += newWord + ' ';
          } else {
            buffer += word + ' ';
          }
        });
      } else {
        buffer = message;
      }

      const newMessage = {
        id: messages.length + 1,
        sender: 'sgamraou',
        content: buffer,
        time: '12:01',
        type: 'text',
        avatar: '',
      };

      await axios.post('/message/sendMessage', {
        message: newMessage.content,
        chatId: 11,
      });

      let newMessages = [...messages, newMessage];
      setMessages(newMessages);
    }
  }, [message, messages]);

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
          <div className='bg-[#ECE8E8] w-full h-full rounded-3xl border-2 border-solid border-dark-cl flex flex-col'>
            {chatsLoading || chatsRefreching ? <div className='w-full h-[85%]  flex items-center justify-center  '>Loading...</div> : <Chats currentUserId={user.id} />}
          </div>
        </div>

        <div className='MIDDLE flex flex-col gap-4  border-2   w-[40rem] m-2 relative overflow-hidden'>
          <div className='header h-14 m-0 w-full bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-3xl flex items-center justify-center flex-none'>
            <div className='h-2 w-2 rounded-full bg-blue-cl '></div>
            <span className='text-2xl mx-2'>{selectedChatLoading || selectedChatRefetching || !chatStore.selectedChat ? '...' : chatStore.selectedChat.name}</span>
          </div>

          <div
            className='CHAT w-full flex bg-[#ECE8E8]  border-2 border-solid border-dark-cl rounded-3xl p-4 flex-col  gap-4 grow 
          scroll-smooth
          overflow-y-auto scrollbar-none'
          >
            {selectedChatLoading || selectedChatRefetching ? <div className='w-full h-[85%]  flex items-center justify-center  ' /> : <Dms CurrentUserId={user.id} />}
          </div>

          <div className='input h-14 w-full  flex justify-center items-center flex-none'>
            <div className='px-2 h-full w-full flex justify-center items-center bg-[#ECE8E8]  border-2 border-solid border-dark-cl rounded-3xl '>
              <input
                type='text'
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    handleNewMessage();
                    setMessage('');
                  }
                }}
                onChange={(e: any) => {
                  setMessage(e.target.value);
                }}
                className='px-7 w-full h-full rounded-3xl bg-[#ECE8E8] focus:outline-none'
                placeholder='Write a reply...'
                value={message}
              ></input>
              <button className=' flex justify-center items-center' onClick={handleNewMessage}>
                <SendIcon className='fill-dark-cl w-10 h-10 mt-2 ' />
              </button>
            </div>
          </div>
        </div>
        <div className='RIGHT bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2 hidden flex-col p-2 gap-4'>
          <div className='flex justify-center mt-10'>
            <img className='h-36 w-36 rounded-full border-2 border-solid border-dark-cl' src={chatStore.selectedChat.image} alt='pfp' />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <span className='text-2xl'>{chatStore.selectedChat.name}</span>
            <span className='text-sm  text-dark-cl/75'>{`@${chatStore.selectedChat.name}`}</span>
          </div>
          <div className='flex flex-wrap gap-3 mt-4'>
            <div className='flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-cl rounded-full px-2'>
              <div className='h-10 w-10 flex bg-dark-cl/30 rounded-full justify-center items-center'>
                <Profile className='fill-dark-cl w-8 h-8' />
              </div>
              <span className='text-lg'>Profile</span>
            </div>
            <div className='flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-cl rounded-full px-2'>
              <div className='h-10 w-10 flex bg-dark-cl/30 rounded-full justify-center items-center'>
                <BlockIcon className='fill-dark-cl w-7 h-7' />
              </div>
              <span className='text-lg'>Block</span>
            </div>
            <div className='flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-cl rounded-full px-2'>
              <div className='h-10 w-10 flex bg-dark-cl/30 rounded-full justify-center items-center'>
                <Game className='fill-dark-cl w-8 h-8' />
              </div>
              <span className='text-lg'>Invite to play</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
