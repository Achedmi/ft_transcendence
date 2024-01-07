import { useNavigate } from 'react-router-dom';
import useChatStore, { ChatType, Member } from '../../../stores/chatStore';
import { useCallback, useEffect, useState } from 'react';
import { AdminIcon, BlockIcon, CrownIcon, Edit, Game, GroupMembersIcon, KickIcon, MuteIcon, Profile } from '../../icons/icons';
import { useQuery } from 'react-query';
import { SyncLoader } from 'react-spinners';
import { useUserStore } from '../../../stores/userStore';
import { AnimatePresence, motion } from 'framer-motion';

function ActionDropDown({ member }: { member: Member }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -20 }}
      exit={{ opacity: 0, y: -20 }}
      className=' bg-gray-cl border-2 border-solid border-dark-cl rounded-lg absolute right-2 top-11 z-50 rounded-tr-none'
    >
      <ul>
        <li className='flex gap-2  p-1 justify-around items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
          <Game className='h-6 w-6  fill-dark-cl group-hover:fill-white' />
          <span className='text-sm text-dark-cl group-hover:text-white'>Invite to game</span>
        </li>
        <li className='flex gap-2  p-1 justify-around items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
          <CrownIcon className='ml-1 h-5 w-5  fill-dark-cl group-hover:fill-white' />
          <span className='text-sm text-dark-cl group-hover:text-white'>Give Ownership</span>
        </li>
        <li className='flex gap-2  p-1 justify-around items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
          <AdminIcon className='h-6 w-6  fill-dark-cl group-hover:fill-white' />
          <span className='text-sm text-dark-cl group-hover:text-white mr-2'>Make Admin</span>
        </li>
        <li className='flex gap-2  p-1 justify-start items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
          <KickIcon className='h-5 w-5  ml-1 fill-dark-cl group-hover:fill-white' />
          <span className='text-sm text-dark-cl group-hover:text-white ml-6'>Kick</span>
        </li>
        <li className='flex gap-2  p-1 justify-start items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
          <BlockIcon className='h-6 w-6  ml-1 fill-dark-cl group-hover:fill-white' />
          <span className='text-sm text-dark-cl group-hover:text-white ml-6'>Ban</span>
        </li>
        <li className='flex gap-2  p-1 justify-start items-center  group hover:bg-dark-cl cursor-pointer'>
          <MuteIcon className='h-6 w-6  ml-1 fill-dark-cl group-hover:fill-white' />
          <span className='text-sm text-dark-cl group-hover:text-white ml-6'>Mute</span>
        </li>
      </ul>
    </motion.div>
  );
}

function GroupMemberCol({ member, activeDropDown, setActiveDropDown }: { member: Member; activeDropDown: number; setActiveDropDown: any }) {
  const navigate = useNavigate();
  const [openActionsDropDown, setOpenActionsDropDown] = useState(false);
  return (
    <div key={member.id} className='hover:bg-gray-cl h-12 w-full flex justify-between items-center relative rounded-xl'>
      <div
        className='flex justify-center items-center cursor-pointer '
        onClick={() => {
          navigate(`/user/${member.username}`);
        }}
      >
        <img className='h-10 w-10 rounded-full border-2 border-solid border-dark-cl object-cover' src={member.avatar} />
        <div className='flex flex-col  ml-2'>
          <span>{member.displayName}</span>
          {member.isowner == 'true' ? <span className='text-sm text-red-cl'>Owner</span> : <span className='text-sm text-blue-cl'>{member.isAdmin ? 'Admin' : ''} </span>}
        </div>
      </div>
      <span
        onClick={() => {
          setActiveDropDown(member.id);
          setOpenActionsDropDown(activeDropDown == member.id ? false : true);
        }}
        className='text-3xl cursor-pointer absolute right-1  select-none '
      >
        {openActionsDropDown && activeDropDown == member.id ? '⌅' : '⌄'}
      </span>
      <AnimatePresence>{openActionsDropDown && activeDropDown == member.id && <ActionDropDown member={member} />}</AnimatePresence>
    </div>
  );
}

function GroupMembers({ members }: { members: Member[] | undefined }) {
  const [activeDropDown, setActiveDropDown] = useState(0);
  useEffect(() => {
    console.log('members', members);
  }, [members]);
  return (
    <div className='h-full m-3 ml-2 flex flex-col gap-2'>
      {members?.map((member: any) => {
        return <GroupMemberCol member={member} activeDropDown={activeDropDown} setActiveDropDown={setActiveDropDown} />;
      })}
    </div>
  );
}
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

function ChatInfo({ setEditGroupOpen }: { setEditGroupOpen: any }) {
  const chatStore = useChatStore();
  const { socket, user } = useUserStore();
  function handleEditGroup() {
    console.log('edit group');
    setEditGroupOpen(true);
  }
  useQuery(['ChatInfo', chatStore.selectedChatId], chatStore.getChatInfo, {
    refetchOnWindowFocus: false,
  });
  const navigate = useNavigate();

  const handleGotToProfile = useCallback(() => {
    navigate(`/user/${chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.find((member) => member.id != user.id)?.username}`);
  }, [chatStore.chatInfo?.get(chatStore.selectedChatId)?.members, navigate]);

  const sendGameInvite = useCallback(
    (usertoInviteId: any) => {
      socket.game?.emit('createInvite', { userId: usertoInviteId });
    },
    [socket.game],
  );

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
    <div className='RIGHT hidden bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2  lg:flex-col  overflow-hidden overflow-y-auto scrollbar-none'>
      {chatStore.chatInfoLoading ? (
        <div className='h-full w-full bg-red-cl flex justify-center items-center'>
          <SyncLoader color='#433650' />
        </div>
      ) : (
        <>
          <div className='flex justify-center mt-10'>
            <img className='h-36 w-36 rounded-full border-2 border-solid border-dark-cl object-cover' src={chatStore.chatInfo?.get(chatStore.selectedChatId)?.image} alt='pfp' />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <span className='mt-4 text-2xl'>{chatStore.chatInfo?.get(chatStore.selectedChatId)?.name}</span>
          </div>
          <div className='flex flex-wrap gap-3 mt-4'>
            {chatStore.chatInfo?.get(chatStore.selectedChatId)?.type == ChatType.DM ? (
              <>
                <InfoButton text='Profile' Icon={Profile} onClick={handleGotToProfile} />
                <InfoButton text='Block' Icon={BlockIcon} />
                <InfoButton
                  text='Invite to play'
                  Icon={Game}
                  onClick={() => {
                    sendGameInvite(chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.find((member) => member.id != user.id)?.id);
                  }}
                />
              </>
            ) : (
              <>
                {chatStore.chatInfo?.get(chatStore.selectedChatId)?.ownerId === user.id && <InfoButton text='Edit Group' Icon={Edit} onClick={handleEditGroup} />}
                <InfoButton text={`Group Members (${chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.length})`} Icon={GroupMembersIcon} />
              </>
            )}
          </div>
          {chatStore.chatInfo?.get(chatStore.selectedChatId)?.type == ChatType.CHANNEL && <GroupMembers members={chatStore.chatInfo?.get(chatStore.selectedChatId)?.members} />}
        </>
      )}
    </div>
  );
}

export default ChatInfo;
