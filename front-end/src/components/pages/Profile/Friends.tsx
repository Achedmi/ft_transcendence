import { useQuery } from 'react-query';
import axios from '../../../utils/axios';
import { useCallback, useState } from 'react';
import { create } from 'zustand';
import { toast } from 'react-toastify';
import { useUserStore } from '../../../stores/userStore';
import { AddFriendIcon, MessageIcon, UnfriendIcon } from '../../icons/icons';
import { useLocation, useParams } from 'react-router-dom';
import toastConfig from '../../../utils/toastConf';
import { Shimmer } from 'react-shimmer';

interface Friends {
  username: string;
  displayName: string;
  avatar: string;
  isFriend: boolean;
}

interface FriendsState {
  friends: Friends[];
  setFriends: (friends: Friends[]) => void;
  fetchFriendsOf: (userName: string) => Promise<Array<Friends>>;
  fetchUserAndFriends: (userName: string) => Promise<any>;
  unfriend: (id: number) => Promise<void>;
  beFriends: (id: number) => Promise<void>;
  block: (id: number) => Promise<void>;
  unBlock: (id: number) => Promise<void>;
}

export const userFriendsStore = create<FriendsState>((set) => ({
  friends: [],
  setFriends: (friends: Friends[]) => {
    set({ friends });
  },
  fetchFriendsOf: async (userName: string) => {
    try {
      const response = await axios.get(`/user/friendsOf/${userName}`);
      set({ friends: response.data });
      return response.data;
    } catch (error) {
    }
  },
  fetchUserAndFriends: async (userName: string) => {
    try {
      const response = await axios.get(`/user/${userName}`);
      set({ friends: response.data?.friends });
      return response.data;
    } catch (error) {
    }
  },
  unfriend: async (id: number) => {
    try {
      await axios.delete(`/user/unfriend/${id}`);
    } catch (error) {
    }
  },
  beFriends: async (id: number) => {
    try {
      await axios.post(`/user/addfriend/${id}`);
    } catch (error) {
      throw error;
    }
  },
  block: async (id: number) => {
    try {
      await axios.post(`/user/block/`, { userId: id });
    } catch (error) {
    }
  },
  unBlock: async (id: number) => {
    try {
      await axios.post(`/user/block/`, { userId: id });
    } catch (error) {
    }
  },
}));

function FriendRow({
  username,
  displayName,
  avatar,
  id,
  refetch,
  unfriend,
  beFriends,
  me,
  isFriend,
  status,
}: {
  username: string;
  displayName: string;
  avatar: string;
  id: number;
  refetch: any;
  unfriend: any;
  beFriends: any;
  me: string | undefined;
  isFriend: boolean;
  status: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  const color = useCallback(() => {
    switch (status) {
      case 'ONLINE':
        return 'text-blue-cl';
      case 'OFFLINE':
        return 'text-dark-cl/50';
      case 'INGAME':
        return 'text-dark-cl';
      case 'STARTINGGAME':
        return 'text-red-cl';
      default:
        return 'text-red-cl';
    }
  }, [status]);
  const handleUnfriend = useCallback(async () => {
    try {
      toast.promise(
        async () => {
          await unfriend(id);
          await refetch();
        },
        toastConfig({ success: 'Friend removed successfully', pending: 'Removing friend...', error: 'Error removing friend' }),
      );
    } catch (error) {
    }
  }, [id]);

  const handleBeFriends = useCallback(async () => {
    try {
      toast.promise(
        async () => {
          await beFriends(id);
          await refetch();
        },
        toastConfig({
          pending: 'Sending friend request...',
          success: 'Friend added!',
          error: 'Error adding friend',
        }),
      );
    } catch (error) {
    }
  }, [id]);

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
  }, [isLoaded]);

  return (
    <div className='min-w-[300px] px-5  flex justify-between items-center   '>
      <div className='flex items-center  w-full gap-3 '>
        {!isLoaded && <Shimmer className='h-12 w-12 rounded-full border-solid border-dark-cl border-[2px]' width={48} height={48} />}
        <img src={avatar} className={isLoaded ? 'object-cover h-12 w-12 rounded-full border-solid border-dark-cl border-[2px]' : 'hidden'} alt='' onLoad={handleLoaded} />
        <div>
          <a href={`/user/${username}`}>
            <p className='text-xl '>{displayName}</p>
            {/* <p className=' text-sm opacity-75'>@{username}</p> */}
            <p className={`text-sm  ${color()}`}>{status.toLocaleLowerCase()}</p>
          </a>
        </div>
      </div>
      {me !== username && (
        <div className='flex justify-end h-full items-center gap-2 w-full'>
          {isFriend ? (
            <div
              onClick={handleUnfriend}
              className=' bg-red-cl  rounded-2xl h-9 gap-2 text-center flex items-center justify-center  cursor-pointer text-white border-solid border-dark-cl border-[2px] p-2'
            >
              <UnfriendIcon />
              <p className='pt-[2px] hidden sm:block'>Unfriend </p>
            </div>
          ) : (
            <div
              onClick={handleBeFriends}
              className=' bg-blue-cl  rounded-2xl h-9 gap-2 text-center flex items-center justify-center  cursor-pointer text-white border-solid border-dark-cl border-[2px] p-2'
            >
              <AddFriendIcon className='w-6 h-6  min-h-max min-w-max fill-white' />
              <p className='pt-[2px] hidden sm:block'>Add friend</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function () {
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const friendsStore = userFriendsStore();
  const me = useUserStore((state) => state.user.username);
  const { isLoading, refetch } = useQuery('friends', () => friendsStore.fetchFriendsOf((location.pathname.startsWith('/user/') ? username : me) || ''));

  if (isLoading) {
    return <div className='w-full h-[85%]  flex items-center justify-center  '>Loading...</div>;
  }

  return !isLoading && friendsStore.friends?.length ? (
    <div
      className='flex flex-col h-[85%]  gap-3 py-2 
    overflow-y-scroll scrollbar-thin scrollbar-thumb-[rgba(67,54,80,0.75)] scrollbar-thumb-rounded-full hover:scrollbar-thumb-dark-cl
    '
    >
      {friendsStore.friends.map((friend: any) => {
        return (
          <FriendRow
            username={friend.username}
            avatar={friend.avatar}
            displayName={friend.displayName}
            id={friend.id}
            me={me}
            refetch={refetch}
            unfriend={friendsStore.unfriend}
            beFriends={friendsStore.beFriends}
            key={friend.id}
            isFriend={friend.isFriend}
            status={friend.status}
          />
        );
      })}
    </div>
  ) : (
    <div className='w-full h-[85%]  flex items-center justify-center  '>No Friends Yet</div>
  );
}
