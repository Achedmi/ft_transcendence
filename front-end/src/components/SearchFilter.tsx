import axios from '../utils/axios';
import { create } from 'zustand';

import { CommandGroup, CommandInput, CommandItem, CommandShortcut } from './Command';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useCommandState } from 'cmdk';
import { debounce } from '../utils/ui';
import { LockIcon } from './icons/icons';
import useChatStore from '../stores/chatStore';

interface User {
  username: string;
  displayName: string;
  avatar: string;
}

interface Channel {
  id: number;
  visibility: string;
  name: string;
  image: string;
}

interface SearchState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  filteredUsers: User[];
  setFilteredUsers: (filteredUsers: User[]) => void;
  filteredChannels: Channel[];
  setFilteredChannels: (filteredChannels: Channel[]) => void;
  // Actions
  fetchFilteredUsers: (search: string) => Promise<void>;
  fetchFilteredChannels: (search: string) => Promise<void>;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  filteredUsers: [],
  filteredChannels: [],
  setFilteredUsers: (filteredUsers: User[]) => set({ filteredUsers }),
  setFilteredChannels: (filteredChannels: Channel[]) => set({ filteredChannels }),
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
  fetchFilteredChannels: async (search: string) => {
    try {
      if (search.length > 2) {
        set({ isLoading: true });
        const response = await axios.get(`/search?search=${search}&type=chat`);
        set({ filteredChannels: response.data?.chat || [], isLoading: false });
      } else {
        set({ filteredChannels: [], isLoading: false });
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
  const debouncedSearchChannels = useCallback(debounce(searchStore.fetchFilteredChannels, 500), []);
  useEffect(() => {
    if (search && search.length) {
      debouncedSearch(search);
      debouncedSearchChannels(search);
    } else {
      searchStore.setFilteredUsers([]);
      searchStore.setFilteredChannels([]);
    }
  }, [search, debouncedSearch, debouncedSearchChannels]);

  return <CommandInput placeholder='Search...' className='' />;
}

export default function CommandSearchResults() {
  const navigate = useNavigate();
  const searchStore = useSearchStore();
  const chatStore = useChatStore();

  if (searchStore.isLoading)
    return (
      <CommandItem>
        <div className='flex flex-col'>
          <span className='text-sm font-bold'>Loading...</span>
        </div>
      </CommandItem>
    );

  return (
    <>
      {searchStore.filteredUsers.length > 0 && (
        <CommandGroup heading='Users' className=''>
          {searchStore.filteredUsers.map((user: any) => (
            <CommandItem
              key={'search-user-' + user.username}
              onSelect={() => {
                navigate(`/user/${user.username}`);
                searchStore.setIsOpen(false);
              }}
            >
              <img src={user.avatar} alt='avatar' className='object-cover  mr-2 w-8 h-8 rounded-full' />
              <div className='flex flex-col'>
                <span className='text-sm font-bold'>{user.displayName}</span>
                <span className='text-xs font-medium'>{user.username}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
      {searchStore.filteredChannels.length > 0 && (
        <CommandGroup heading='Channels' className=''>
          {searchStore.filteredChannels.map((channel: any) => (
            <CommandItem
              key={'search-channel-' + channel.id}
              onSelect={() => {
                chatStore.getChannelsPreview();
                chatStore.setSelectedChatId(channel.id);
                navigate(`/chat`);
                searchStore.setIsOpen(false);
              }}
              className=''
            >
              <img src={channel.image} alt='avatar' className='object-cover  mr-2 w-8 h-8 rounded-full' />
              <div className='flex flex-col'>
                <span className='text-sm font-bold'>{channel.name}</span>
              </div>
              {channel.visibility === 'PROTECTED' && (
                <CommandShortcut>
                  <LockIcon className='h-4 w-4' />
                </CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  );
}

//hht....../search?search=an&type=users
