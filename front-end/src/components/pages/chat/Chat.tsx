import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BlockIcon, Edit, Game, GroupMembersIcon, Profile, SendIcon } from '../../icons/icons';
import useChatStore, { ChatInterface, ChatType } from '../../../stores/chatStore';
import { useUserStore } from '../../../stores/userStore';
import { useQuery } from 'react-query';
import axios from '../../../utils/axios';

function InfoButton({ text, Icon, onClick }: { text: string; Icon: any; onClick?: any }) {
  return (
    <div className='flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-cl rounded-full px-2'>
      <div className='h-10 w-10 flex bg-dark-cl/30 rounded-full justify-center items-center'>
        {Icon == Edit ? <Icon size='30' fillColor='#433650' /> : <Icon className='fill-dark-cl w-8 h-8' />}
      </div>
      <span className='text-md'>{text}</span>
    </div>
  );
}

function DmColumn({ chat, CurrentUserId }: { chat: ChatInterface; CurrentUserId: number }) {
  const chatStore = useChatStore();

  const handleSelectChat = useCallback(() => {
    if (chat.id) chatStore.setSelectedChatId(chat.id);
  }, [chat.id]);

  return (
    <div className=' flex justify-start m-2  items-center gap-2 hover:bg-gray-cl hover:rounded-full cursor-pointer relative' onClick={handleSelectChat}>
      <img
        className='h-10 w-10 rounded-full border-2 border-solid border-dark-cl object-cover
       '
        src={chat.image}
      />
      <div className='name and message flex flex-col max-w-sm'>
        <span className='name text-xl'>{chat.name}</span>
        <span className='message opacity-75 text-sm overflow-hidden truncate w-36'>{`${CurrentUserId == chat.lastMessageSender ? 'You: ' : ''} ${chat.lastMessage}`}</span>
      </div>
      {chat.id != chatStore.selectedChatId && chat.newMessages > 0 && (
        <div className='absolute right-1 h-5 w-5 rounded-full bg-red-cl flex justify-center'>
          <span className='text-white absolute top-1'>{chat.newMessages > 10 ? '+10' : chat.newMessages}</span>
        </div>
      )}
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
  user?: {
    avatar?: string;
  };
}

function Dms({ CurrentUserId }: { CurrentUserId: number | undefined }) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { socket } = useUserStore();
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const chatStore = useChatStore();

  useEffect(() => {
    socket?.chat?.on('message', (data: any) => {
      if (data.chatId == chatStore.selectedChatId) {
        chatStore.pushNewMessage(data);
      }
      chatStore.updateChat(data.chatId, { lastMessage: data.message, lastMessageSender: data.from });
    });

    return () => {
      socket?.chat?.off('message');
    };
  }, [socket?.chat, socket]);

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
                  <img className='h-8 w-8 rounded-full border-2 border-solid border-dark-cl object-cover' src={message.user?.avatar} />
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

function GroupMembers({ members }: { members: any }) {
  const chatStore = useChatStore();
  return (
    <div className='h-full m-3 ml-2 flex flex-col gap-2'>
      {members.map((member: any) => {
        let isAdmin = member.isAdmin;
        let isOwner = member.user.id == chatStore.selectedChat.ownerId;
        return (
          <div key={member.user.id} className='hover:bg-gray-cl h-12 w-full flex justify-between items-center relative rounded-xl'>
            <div className='flex justify-center items-center'>
              <img className='h-10 w-10 rounded-full border-2 border-solid border-dark-cl object-cover' src={member.user.avatar} />
              <div className='flex flex-col  ml-2'>
                <span>{member.user.displayName}</span>
                {isOwner ? <span className='text-sm text-red-cl'>Owner</span> : <span className='text-sm text-blue-cl'>{isAdmin ? 'Admin' : ''} </span>}
              </div>
            </div>
            <span className='text-4xl cursor-pointer absolute right-1 top-0'>...</span>
          </div>
        );
      })}
    </div>
  );
}

function Chat() {
  const [chatType, setChatType] = useState<ChatType>(ChatType.DM);

  const [message, setMessage] = useState<string>('');
  const { user } = useUserStore();
  const chatStore = useChatStore();

  const { isLoading: chatsLoading, isRefetching: chatsRefreching } = useQuery(['chats', chatType], chatStore.getChats, { refetchOnWindowFocus: false });
  const { isLoading: selectedChatLoading, isRefetching: selectedChatRefetching } = useQuery(['chat', chatStore.selectedChatId], chatStore.getSelectedChat, {
    refetchOnWindowFocus: false,
  });

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
        sender: user.username,
        content: buffer,
        time: '12:01',
        type: 'text',
        avatar: '',
      };

      await axios.post('/message/sendMessage', {
        message: newMessage.content,
        chatId: chatStore.selectedChatId,
      });

      setMessage('');
    }
  }, [message]);

  return (
    <div className='h-full w-full bg-gray-cl border-solid border-[4px] border-dark-cl rounded-xl  flex justify-center items-center'>
      <div className='text-dark-cl p-2 h-full w-full flex justify-center'>
        <div className=' LEFT  md:flex flex-col gap-4  w-72 m-2 hidden'>
          <div className='buttons w-full h-14 flex gap-2 m-0'>
            <div
              onClick={() => {
                setChatType(ChatType.DM);
              }}
              className={`text-xl flex justify-center items-center rounded-3xl w-1/2 h-full cursor-pointer
               ${chatType == ChatType.DM ? 'bg-[#ECE8E8]   border-2 border-solid border-dark-cl' : ''}`}
            >
              <span>Dms</span>
            </div>
            <div
              onClick={() => {
                setChatType(ChatType.CHANNEL);
              }}
              className={`text-xl flex justify-center items-center rounded-3xl w-1/2 h-full  cursor-pointer
              ${chatType == ChatType.CHANNEL ? 'bg-[#ECE8E8]  border-2 border-solid border-dark-cl' : ''}`}
            >
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

        <div className='RIGHT bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2  lg:flex-col hidden overflow-hidden overflow-y-auto scrollbar-none'>
          <div className='flex justify-center mt-10'>
            <img className='h-36 w-36 rounded-full border-2 border-solid border-dark-cl object-cover' src={chatStore.selectedChat.image} alt='pfp' />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <span className='mt-4 text-2xl'>{chatStore.selectedChat.name}</span>
            {chatType == ChatType.DM && <span className='text-sm  text-dark-cl/75'>{`@${chatStore.selectedChat.username}`}</span>}
          </div>
          <div className='flex flex-wrap gap-3 mt-4'>
            {chatType == ChatType.DM ? (
              <>
                <InfoButton text='Profile' Icon={Profile} />
                <InfoButton text='Block' Icon={BlockIcon} />
                <InfoButton text='Invite to play' Icon={Game} />
              </>
            ) : (
              <>
                <InfoButton text='Edit Group' Icon={Edit} />
                <InfoButton text={`Group Members (${chatStore.selectedChat.users.length})`} Icon={GroupMembersIcon} />
              </>
            )}
          </div>
          {chatType == ChatType.CHANNEL && !chatsLoading && !selectedChatLoading && <GroupMembers members={chatStore.selectedChat.users} />}
        </div>
      </div>
    </div>
  );
}

export default Chat;
