import { useCallback, useEffect, useRef, useState } from 'react';
import { BlockIcon, Close, Edit, Game, GroupMembersIcon, Profile, SendIcon } from '../../icons/icons';
import useChatStore, { ChatType, Member, ChatPreview } from '../../../stores/chatStore';
import { useUserStore } from '../../../stores/userStore';
import { useQuery } from 'react-query';
import axios from '../../../utils/axios';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { SyncLoader } from 'react-spinners';
import EditGroup from './EditGroup';

function InfoButton({ text, Icon, onClick }: { text: string; Icon: any; onClick?: any }) {
  return (
    <div className='flex justify-start items-center gap-1 cursor-pointer hover:bg-gray-cl rounded-full px-2' onClick={onClick}>
      <div className='h-10 w-10 flex bg-dark-cl/30 rounded-full justify-center items-center'>
        {Icon == Edit ? <Icon size='30' fillColor='#433650' /> : <Icon className='fill-dark-cl w-8 h-8' />}
      </div>
      <span className='text-md'>{text}</span>
    </div>
  );
}

function ChatPreviewColumn({ chat, CurrentUserId }: { chat: ChatPreview; CurrentUserId: number }) {
  const chatStore = useChatStore();
  const handleChatClick = useCallback(() => {
    chatStore.setSelectedChatId(chat.id);
  }, [chatStore, chat.id]);

  return (
    <div
      className={`flex justify-start m-2  items-center gap-2 hover:bg-gray-cl rounded-full cursor-pointer relative
    ${chatStore.selectedChatId == chat.id ? 'bg-gray-cl' : ''}
    
    `}
      onClick={handleChatClick}
    >
      <img
        className='h-10 w-10 rounded-full border-2 border-solid border-dark-cl object-cover
       '
        src={chat.image}
      />
      <div className='name and message flex flex-col max-w-sm'>
        <span className='name text-xl'>{chat.name}</span>
        <span className='message opacity-75 text-sm overflow-hidden truncate w-36'>{`${CurrentUserId == chat.lastMessage.sender.id ? 'You: ' : ''} ${
          chat.lastMessage.content
        }`}</span>
      </div>
    </div>
  );
}

function ChatPreviews({ currentUserId, chatType }: { currentUserId: number; chatType: ChatType } | any) {
  const chatStore = useChatStore();

  return (
    <>
      {(chatType == ChatType.DM && chatStore.DmsLoading) || (chatType == ChatType.CHANNEL && chatStore.ChannelsLoading) ? (
        <div className='flex justify-center items-center h-full'>
          <SyncLoader color='#433650' />
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {chatType == ChatType.DM
            ? chatStore.DmsPreview.map((chat: ChatPreview) => {
                return <ChatPreviewColumn key={chat.id} chat={chat} CurrentUserId={currentUserId} />;
              })
            : chatStore.ChannelsPreview.map((chat: ChatPreview) => {
                return <ChatPreviewColumn key={chat.id} chat={chat} CurrentUserId={currentUserId} />;
              })}
        </div>
      )}
    </>
  );
}

function Messages({ CurrentUserId }: { CurrentUserId: number | undefined }) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
  };
  const chatStore = useChatStore();
  useQuery(['Messages', chatStore.selectedChatId], chatStore.getMessages, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    scrollToBottom();
  }, [chatStore.messages?.get(chatStore.selectedChatId)?.length, chatStore.selectedChatId, chatStore.messages]);

  return (
    <div className='flex flex-col space-y-2'>
      {chatStore.messages?.get(chatStore.selectedChatId)?.map((message: any) => {
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

function GroupMembers({ members }: { members: Member[] | undefined }) {
  useEffect(() => {
    console.log('members', members);
  }, [members]);
  return (
    <div className='h-full m-3 ml-2 flex flex-col gap-2'>
      {members?.map((member: any) => {
        return (
          <div key={member.id} className='hover:bg-gray-cl h-12 w-full flex justify-between items-center relative rounded-xl'>
            <div className='flex justify-center items-center'>
              <img className='h-10 w-10 rounded-full border-2 border-solid border-dark-cl object-cover' src={member.avatar} />
              <div className='flex flex-col  ml-2'>
                <span>{member.displayName}</span>
                {member.isowner == 'true' ? <span className='text-sm text-red-cl'>Owner</span> : <span className='text-sm text-blue-cl'>{member.isAdmin ? 'Admin' : ''} </span>}
              </div>
            </div>
            <span className='text-4xl cursor-pointer absolute right-1 top-0'>...</span>
          </div>
        );
      })}
    </div>
  );
}

function ChatInfo({ setEditGroupOpen }: { setEditGroupOpen: any }) {
  const chatStore = useChatStore();
  function handleEditGroup() {
    console.log('edit group');
    setEditGroupOpen(true);
  }
  useQuery(['ChatInfo', chatStore.selectedChatId], chatStore.getChatInfo, {
    refetchOnWindowFocus: false,
  });

  if (chatStore.chatInfoLoading) {
    return (
      <div
        className='RIGHT hidden bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2  lg:justify-center lg:items-center  overflow-hidden overflow-y-auto scrollbar-none
      '
      >
        <SyncLoader color='#433650' />
      </div>
    );
  }

  return (
    <div className='RIGHT  bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2  lg:flex-col  overflow-hidden overflow-y-auto scrollbar-none'>
      <div className='flex justify-center mt-10'>
        <img className='h-36 w-36 rounded-full border-2 border-solid border-dark-cl object-cover' src={chatStore.chatInfo?.get(chatStore.selectedChatId)?.image} alt='pfp' />
      </div>
      <div className='flex flex-col items-center justify-center'>
        <span className='mt-4 text-2xl'>{chatStore.chatInfo?.get(chatStore.selectedChatId)?.name}</span>
      </div>
      <div className='flex flex-wrap gap-3 mt-4'>
        {chatStore.chatInfo?.get(chatStore.selectedChatId)?.type == ChatType.DM ? (
          <>
            <InfoButton text='Profile' Icon={Profile} />
            <InfoButton text='Block' Icon={BlockIcon} />
            <InfoButton text='Invite to play' Icon={Game} />
          </>
        ) : (
          <>
            <InfoButton text='Edit Group' Icon={Edit} onClick={handleEditGroup} />
            {chatStore.chatInfo?.get(chatStore.selectedChatId)?.type == ChatType.CHANNEL && (
              <InfoButton text={`Group Members (${chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.length})`} Icon={GroupMembersIcon} />
            )}
          </>
        )}
      </div>
      {chatStore.chatInfo?.get(chatStore.selectedChatId)?.type == ChatType.CHANNEL && <GroupMembers members={chatStore.chatInfo?.get(chatStore.selectedChatId)?.members} />}
    </div>
  );
}

function Chat() {
  const [chatType, setChatType] = useState<ChatType>(ChatType.DM);
  const [editGroupOpen, setEditGroupOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { user } = useUserStore();
  const chatStore = useChatStore();

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
    <div className='h-full w-full bg-gray-cl border-solid border-[4px] border-dark-cl rounded-xl  flex justify-center items-center relative'>
      <EditGroup open={editGroupOpen} setOpen={setEditGroupOpen} />
      <div className={`text-dark-cl p-2 h-full w-full flex justify-center`}>
        <div className=' LEFT  md:flex flex-col gap-4  w-72 m-2  '>
          <div className='buttons w-full h-14 flex gap-2 m-0'>
            <div
              onClick={() => {
                setChatType(ChatType.DM);
              }}
              className={`text-xl flex justify-center items-center rounded-3xl w-1/2 h-full cursor-pointer hover:bg-[#ECE8E8]
               ${chatType == ChatType.DM ? 'bg-[#ECE8E8]   border-2 border-solid border-dark-cl' : ''}`}
            >
              <span>Dms</span>
            </div>
            <div
              onClick={() => {
                setChatType(ChatType.CHANNEL);
              }}
              className={`text-xl flex justify-center items-center rounded-3xl w-1/2 h-full  cursor-pointer hover:bg-[#ECE8E8]
              ${chatType == ChatType.CHANNEL ? 'bg-[#ECE8E8]  border-2 border-solid border-dark-cl' : ''}`}
            >
              <span>Groups</span>
            </div>
          </div>
          <div className='bg-[#ECE8E8] w-full h-full rounded-3xl border-2 border-solid border-dark-cl flex flex-col overflow-y-auto scrollbar-none'>
            <ChatPreviews currentUserId={user.id} chatType={chatType} />
          </div>
        </div>

        {/* <div className='MIDDLE flex flex-col gap-4  border-2   w-[40rem] m-2 relative overflow-hidden'>
          {chatStore.selectedChatId < 0 ? (
            <div className=' w-full h-full bg-[#ECE8E8] flex justify-center items-center bg-da  border-2 border-solid border-dark-cl rounded-3xl'>
              <span className='text-2xl text-dark-cl'>No Chat Selected</span>
            </div>
          ) : (
            <>
              <div className='header h-14 m-0 w-full bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-3xl flex items-center justify-center flex-none'>
                <div className='h-2 w-2 rounded-full bg-blue-cl '></div>
                <span className='text-2xl mx-2'>{chatStore.chatInfo?.get(chatStore.selectedChatId)?.name}</span>
              </div>

              <div
                className='CHAT w-full flex bg-[#ECE8E8]  border-2 border-solid border-dark-cl rounded-3xl p-4 flex-col  gap-4 grow 
          scroll-smooth
          overflow-y-auto scrollbar-none'
              >
                <Messages CurrentUserId={user.id} />
              </div>
            </>
          )}
          {chatStore.selectedChatId > 0 && (
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
          )}
        </div> */}
        {chatStore.selectedChatId > 0 && <ChatInfo setEditGroupOpen={setEditGroupOpen} />}
      </div>
    </div>
  );
}

export default Chat;
