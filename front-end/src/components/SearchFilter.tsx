import { useQuery } from 'react-query';
import axios from '../utils/axios';
import { create } from 'zustand';
import { useUserStore } from '../user/userStore';

import { CommandItem} from './Command';


interface FilteredUsers {
  username: string;
  displayName: string;
  avatar: string;
}

interface FilteredUsersState {
  filteredUsers: FilteredUsers[];
  setFilteredUsers: (filteredUsers: FilteredUsers[]) => void;
  fetchFilteredUsers: (userName: string) => Promise<Array<FilteredUsers>>;
}

const usefilteredUsersStore = create<FilteredUsersState>((set) => ({
  filteredUsers: [],
  setFilteredUsers: (filteredUsers: FilteredUsers[]) => {
    set({ filteredUsers });
  },
  fetchFilteredUsers: async (userName: string) => {
    try {
      const response = await axios.get(`/user/friendsOf/${userName}`);
      set({ filteredUsers: response.data });
      return response.data.users;
    } catch (error) {
      console.log(error);
    }
  },
}));

function SearchedUsersRow({ username, displayName, avatar, id }: { username: string; displayName: string; avatar: string; id: number }) {
  return (
    <CommandItem>
      <img src={avatar} alt='avatar' className='mr-2 w-6 h-6 rounded-full' />
      <div className='flex flex-col'>
        <span className='text-sm font-bold'>{displayName}</span>
        <span className='text-xs font-medium '>{username}</span>
      </div>
    </CommandItem>
  );
}

function SearchFilter() {
  const filteredUsersStore = usefilteredUsersStore();
  const userName = useUserStore((state) => state.userData.username);
  const { isLoading } = useQuery('friends', () => filteredUsersStore.fetchFilteredUsers(userName || ''));
  return (
    <>
      {!isLoading &&
        filteredUsersStore.filteredUsers.map((user: any) => (
          <SearchedUsersRow key={user.username} username={user.username} displayName={user.displayName} avatar={user.avatar} id={user.id} />
        ))}
    </>
  );
}

export default SearchFilter;
