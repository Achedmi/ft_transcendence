import axios from '../utils/axios';
import { create } from 'zustand';

import { CommandGroup, CommandInput, CommandItem } from './Command';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useCommandState } from 'cmdk';
import { debounce } from '../utils/ui';

interface User {
  username: string;
  displayName: string;
  avatar: string;
}

interface SearchState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  filteredUsers: User[];
  setFilteredUsers: (filteredUsers: User[]) => void;
  // Actions
  fetchFilteredUsers: (search: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  filteredUsers: [],
  setFilteredUsers: (filteredUsers: User[]) => set({ filteredUsers }),
  fetchFilteredUsers: async (search: string) => {
    try {
      if (search.length > 2) {
        set({ isLoading: true });
        const response = await axios.get(`/search?search=${search}&type=users`);
        set({ filteredUsers: response.data?.users || [], isLoading: false });
      } else {
		set({ filteredUsers: [], isLoading: false });
	  }
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
}));

export function CommandSearch() {
  const search = useCommandState((state) => state.search);
  const searchStore = useSearchStore();

  const debouncedSearch = useCallback(debounce(searchStore.fetchFilteredUsers, 500), []);

  useEffect(() => {
    if (search && search.length) debouncedSearch(search);
  }, [search]);

  return <CommandInput placeholder='Search...' className='' />;
}

export default function CommandSearchResults() {
  const navigate = useNavigate();
  const searchStore = useSearchStore();

  return (
    <>
      {!searchStore.isLoading && searchStore.filteredUsers.length > 0 && (
        <CommandGroup heading='Users' className=''>
          {searchStore.filteredUsers.map((user: any) => (
            <CommandItem
			  key={'search-user-' + user.username}
              onSelect={() => {
                navigate(`/user/${user.username}`);
                searchStore.setIsOpen(false);
              }}
            >
              <img src={user.avatar} alt='avatar' className='object-cover  mr-2 w-6 h-6 rounded-full' />
              <div className='flex flex-col'>
                <span className='text-sm font-bold'>{user.displayName}</span>
                <span className='text-xs font-medium'>{user.username}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
      {searchStore.isLoading && (
        <CommandItem>
          <div className='flex flex-col'>
            <span className='text-sm font-bold'>Loading...</span>
          </div>
        </CommandItem>
      )}
    </>
  );
}

//hht....../search?search=an&type=users
