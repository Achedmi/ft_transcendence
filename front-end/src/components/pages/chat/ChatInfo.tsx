import { useNavigate } from 'react-router-dom';
import useChatStore, { ChatType, Member } from '../../../stores/chatStore';
import { useCallback, useState } from 'react';
import { AddMemberIcon, AdminIcon, BlockIcon, Check, CrownIcon, Edit, Game, GroupMembersIcon, KickIcon, MuteIcon, Profile } from '../../icons/icons';
import { useQuery } from 'react-query';
import { SyncLoader } from 'react-spinners';
import { useUserStore } from '../../../stores/userStore';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axios';
import toastConfig from '../../../utils/toastConf';
import AddMemberDialogue from '../../Layout/Dialogue/AddMemberDialogue';
import useAddGroupStore from '../../../stores/addMemberStore';

function ActionDropDown({ member, currentMember, setActiveDropDown }: { member: Member; currentMember: Member; setActiveDropDown: any }) {
  const chatStore = useChatStore();
  const { socket } = useUserStore();

  const sendGameInvite = useCallback(
    (usertoInviteId: any) => {
      socket.game?.emit('createInvite', { userId: usertoInviteId });
      toast.success('Game invite sent', {
        className: 'toast-success',
        icon: Check,
        progressClassName: 'Toastify__progress-bar-success',
      });
      setActiveDropDown(0);
    },
    [socket.game],
  );

  const KickMember = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.post(`chat/kickMember`, {
            userId: member.id,
            chatId: chatStore.selectedChatId,
          });
          chatStore.updateChatInfo(chatStore.selectedChatId, response.data);
        } catch (error) {
          throw error;
        }
      },
      toastConfig({
        pending: 'Kicking...',
        success: 'Kicked',
        error: 'Failed to kick member',
      }),
    );
  }, [
    chatStore.selectedChatId,
    member.id,
    member.isowner,
    member.isAdmin,
    currentMember.isAdmin,
    currentMember.isowner,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
  ]);

  const MuteMember = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.post(`chat/mute`, {
            userId: member.id,
            chatId: chatStore.selectedChatId,
            time: 5,
          });
          console.log(response);
          chatStore.updateChatInfo(chatStore.selectedChatId, response.data);
        } catch (error) {
          throw error;
        }
      },
      toastConfig({
        pending: 'Muting...',
        success: 'Muted',
        error: 'Failed to mute member',
      }),
    );
  }, [
    chatStore.selectedChatId,
    member.id,
    member.isowner,
    member.isAdmin,
    currentMember.isAdmin,
    currentMember.isowner,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
  ]);

  const BanMember = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.post(`chat/banMember`, {
            userId: member.id,
            chatId: chatStore.selectedChatId,
          });
          console.log(response);
          chatStore.updateChatInfo(chatStore.selectedChatId, response.data);
        } catch (error) {
          throw error;
        }
      },
      toastConfig({
        pending: 'Banning...',
        success: 'Banned',
        error: 'Failed to ban member',
      }),
    );
  }, [
    chatStore.selectedChatId,
    member.id,
    member.isowner,
    member.isAdmin,
    currentMember.isAdmin,
    currentMember.isowner,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
  ]);

  const GiveOwnership = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.post(`chat/giveOwnership`, {
            userId: member.id,
            chatId: chatStore.selectedChatId,
          });
          console.log(response);
          chatStore.updateChatInfo(chatStore.selectedChatId, response.data);
        } catch (error) {
          throw error;
        }
      },
      toastConfig({
        pending: 'Giving ownership...',
        success: 'Ownership given',
        error: 'Failed to give ownership',
      }),
    );
  }, [
    chatStore.selectedChatId,
    member.id,
    member.isowner,
    member.isAdmin,
    currentMember.isAdmin,
    currentMember.isowner,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
  ]);

  const MakeAdmin = useCallback(async () => {
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.post(`chat/addAdmin`, {
            userId: member.id,
            chatId: chatStore.selectedChatId,
          });
          console.log(response);
          chatStore.updateChatInfo(chatStore.selectedChatId, response.data);
        } catch (error) {
          throw error;
        }
      },
      toastConfig({
        pending: 'Making admin...',
        success: 'Admin made',
        error: 'Failed to make admin',
      }),
    );
  }, [
    chatStore.selectedChatId,
    member.id,
    member.isowner,
    member.isAdmin,
    currentMember.isAdmin,
    currentMember.isowner,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
    chatStore.selectedChatId,
  ]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: -20 }}
      exit={{ opacity: 0, y: -20 }}
      className=' bg-gray-cl border-2 border-solid border-dark-cl rounded-lg absolute right-2 top-11 z-50 rounded-tr-none border-b-'
    >
      <ul>
        <li
          key={1}
          className='flex gap-2  p-1 justify-around items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'
          onClick={() => {
            sendGameInvite(member.id);
          }}
        >
          <Game className='h-6 w-6  fill-dark-cl group-hover:fill-white' />
          <span className='text-sm text-dark-cl group-hover:text-white'>Invite to game</span>
        </li>
        {currentMember.isowner == 'true' && member.isowner == 'false' && (
          <li key={2} onClick={GiveOwnership} className='flex gap-2  p-1 justify-around items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
            <CrownIcon className='ml-1 h-5 w-5  fill-dark-cl group-hover:fill-white' />
            <span className='text-sm text-dark-cl group-hover:text-white'>Give Ownership</span>
          </li>
        )}
        {currentMember.isowner == 'true' && !member.isAdmin && (
          <li key={3} onClick={MakeAdmin} className='flex gap-2  p-1 justify-around items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
            <AdminIcon className='h-6 w-6  fill-dark-cl group-hover:fill-white' />
            <span className='text-sm text-dark-cl group-hover:text-white mr-2'>Make Admin</span>
          </li>
        )}
        {currentMember.isAdmin && member.isowner != 'true' && (
          <li key={4} onClick={KickMember} className='flex gap-2  p-1 justify-start items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
            <KickIcon className='h-5 w-5  ml-1 fill-dark-cl group-hover:fill-white' />
            <span className='text-sm text-dark-cl group-hover:text-white ml-6'>Kick</span>
          </li>
        )}
        {currentMember.isAdmin && member.isowner != 'true' && (
          <li key={5} onClick={BanMember} className='flex gap-2  p-1 justify-start items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
            <BlockIcon className='h-6 w-6  ml-1 fill-dark-cl group-hover:fill-white' />
            <span className='text-sm text-dark-cl group-hover:text-white ml-6'>Ban</span>
          </li>
        )}
        {currentMember.isAdmin && member.isowner != 'true' && (
          <li key={6} onClick={MuteMember} className='flex gap-2  p-1 justify-start items-center border-b-2 border-solid border-dark-cl group hover:bg-dark-cl cursor-pointer'>
            <MuteIcon className='h-6 w-6  ml-1 fill-dark-cl group-hover:fill-white' />
            <span className='text-sm text-dark-cl group-hover:text-white ml-6'>Mute</span>
          </li>
        )}
      </ul>
    </motion.div>
  );
}

function GroupMemberCol({ member, activeDropDown, setActiveDropDown, currentMember }: { member: Member; activeDropDown: number; setActiveDropDown: any; currentMember: Member }) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  return (
    <div className='hover:bg-gray-cl h-12 w-full flex justify-between items-center relative rounded-xl'>
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
      {user.id != member.id && (
        <span
          onClick={() => {
            if (activeDropDown == member.id) setActiveDropDown(0);
            else setActiveDropDown(member.id);
          }}
          className='text-3xl cursor-pointer absolute right-1  select-none '
        >
          {activeDropDown == member.id ? '⌅' : '⌄'}
        </span>
      )}
      <AnimatePresence>{activeDropDown == member.id && <ActionDropDown member={member} currentMember={currentMember} setActiveDropDown={setActiveDropDown} />}</AnimatePresence>
    </div>
  );
}

function GroupMembers({ members, currentMember }: { members: Member[] | undefined; currentMember: Member }) {
  const [activeDropDown, setActiveDropDown] = useState(0);
  console.log('membersssss: ', members);
  return (
    <div className='h-full m-3 ml-2 flex flex-col gap-2'>
      {members?.map((member: any) => {
        return <GroupMemberCol key={member.id} member={member} activeDropDown={activeDropDown} setActiveDropDown={setActiveDropDown} currentMember={currentMember} />;
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
  const addMemberStore = useAddGroupStore();
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
        className='RIGHT hidden  bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2  lg:justify-center lg:items-center  overflow-hidden overflow-y-auto scrollbar-none
      '
      >
        <SyncLoader color='#433650' />
      </div>
    );
  }

  return (
    <div className='RIGHT hidden  bg-[#ECE8E8] border-2 border-solid border-dark-cl rounded-2xl lg:flex w-72 m-2  lg:flex-col  overflow-hidden overflow-y-auto scrollbar-none'>
      {chatStore.chatInfoLoading ? (
        <div className='h-full w-full bg-red-cl flex justify-center items-center'>
          <SyncLoader color='#433650' />
        </div>
      ) : (
        <>
          {chatStore.chatInfo?.get(chatStore.selectedChatId)?.type == ChatType.CHANNEL && <AddMemberDialogue />}

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
                {chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.find((member) => member.id == user.id)?.isAdmin && (
                  <InfoButton text='Add User' Icon={AddMemberIcon} onClick={() => addMemberStore.setIsOpen(true)} />
                )}
                <InfoButton text={`Group Members (${chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.length})`} Icon={GroupMembersIcon} />
              </>
            )}
          </div>
          {chatStore.chatInfo?.get(chatStore.selectedChatId)?.type == ChatType.CHANNEL && (
            <GroupMembers
              members={chatStore.chatInfo?.get(chatStore.selectedChatId)?.members}
              currentMember={chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.find((member) => member.id == user.id) as Member}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ChatInfo;
