import { useQuery } from 'react-query';
import axios from '../../../utils/axios';
import { useCallback } from 'react';
import { create } from 'zustand';
import { toast } from 'react-toastify';
import { useUserStore } from '../../../user/userStore';
import { MessageIcon, UnfriendIcon } from '../../icons/icons';
import { useLocation, useParams } from 'react-router-dom';
import toastConfig from '../../../utils/toastConf';

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
      console.log(error);
    }
  },
  fetchUserAndFriends: async (userName: string) => {
    try {
      const response = await axios.get(`/user/${userName}`);
      set({ friends: response.data?.friends });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  unfriend: async (id: number) => {
    try {
      await axios.delete(`/user/unfriend/${id}`);
    } catch (error) {
      console.log(error);
    }
  },
  beFriends: async (id: number) => {
    try {
      await axios.post(`/user/addfriend/${id}`);
    } catch (error) {
      console.log(error);
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
}) {
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
      console.log(error);
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
      console.log(error);
    }
  }, [id]);

  return (
    <div className='min-w-[300px] px-5  flex justify-between items-center   '>
      <div className='flex items-center  w-full gap-3 '>
        <img src={avatar} alt='' className='h-12 w-12 rounded-full border-solid border-dark-cl border-[2px]' />
        <div>
          <a href={`/user/${username}`}>
            <p className='text-xl '>{displayName}</p>
            <p className=' text-sm opacity-75'>@{username}</p>
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
              {/* <UnfriendIcon /> */}
              <p className='pt-[2px] hidden sm:block'>Be friends</p>
            </div>
          )}
          <div
            onClick={() => {
              console.log('hi');
            }}
            className=' bg-blue-cl gap-2 rounded-2xl h-9  text-center flex items-center justify-center  cursor-pointer text-white border-solid border-dark-cl border-[2px] p-2'
          >
            <MessageIcon />
            <p className='pt-[2px] hidden sm:block'>Message</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function () {
  const location = useLocation();
  const { username } = useParams<{ username: string }>();
  const friendsStore = userFriendsStore();
  const me = useUserStore((state) => state.userData.username);
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
          />
        );
      })}
    </div>
  ) : (
    <div className='w-full h-[85%]  flex items-center justify-center  '>No Friends Yet</div>
  );
}
