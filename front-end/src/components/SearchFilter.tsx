import { useQuery } from 'react-query';
import axios from '../utils/axios';
import { create } from 'zustand';
import { useUserStore } from '../user/userStore';

import { CommandItem } from './Command';
import { useEffect } from 'react';

interface User {
  username: string;
  displayName: string;
  avatar: string;
}

interface SearchState {
  filteredUsers: User[];
  setFilteredUsers: (filteredUsers: User[]) => void;
  fetchFilteredUsers: (userName: string) => Promise<Array<User>>;
  stringToMatch: string;
  setStringToMatch: (stringToMatch: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filteredUsers: [],
  setFilteredUsers: (filteredUsers: User[]) => {
    set({ filteredUsers });
  },
  fetchFilteredUsers: async (stringtomatch: string) => {
    try {
      if (stringtomatch.length > 2) {
        const response = await axios.get(`/search?search=${stringtomatch}&type=users`);
        set({ filteredUsers: response.data.users });
        return response.data.users;
      }
    } catch (error) {
      console.log(error);
    }
  },
  stringToMatch: '',
  setStringToMatch: (stringToMatch: string) => {
    set({ stringToMatch });
  },
}));

function SearchedUsersRow({ username, displayName, avatar }: { username: string; displayName: string; avatar: string }) {

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
  const searchStore = useSearchStore();
  useEffect(() => {
    console.log('searchFiler:', searchStore.filteredUsers);
  });
  return (
    <>
      {searchStore.filteredUsers.map((user: any) => (
        <p>{user.username}</p>
        // <SearchedUsersRow key={user.username} username={user.username} displayName={user.displayName} avatar={user.avatar} />
      ))}
    </>
  );
}

export default SearchFilter;
//hht....../search?search=an&type=users