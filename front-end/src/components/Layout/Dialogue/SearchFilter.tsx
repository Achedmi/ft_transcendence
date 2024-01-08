import axios from '../../../utils/axios';
import { create } from 'zustand';

import { CommandGroup, CommandInput, CommandItem, CommandShortcut } from './Command';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useCommandState } from 'cmdk';
import { debounce } from '../../../utils/ui';
import { LockIcon } from '../../icons/icons';
import useChatStore, { ChatPreview } from '../../../stores/chatStore';
import { useUserStore } from '../../../stores/userStore';
import axiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';
import toastConfig from '../../../utils/toastConf';
import { useSearchStore } from '../../../stores/searchStore';



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
  const { user } = useUserStore();
  const handleSelectChat = useCallback(
    async (channelId: number) => {
      chatStore.getChannelsPreview();

      if (!chatStore.isMemberOfChat(channelId, user.id)) {
        console.log('not a member');
        toast.promise(
          async () => {
            try {
              const response = await axiosInstance.post(`chat/joinChannel`, { channelId });
              console.log('response', response);

              chatStore.getChannelsPreview();
              chatStore.setSelectedChatId(response.data.id);
              chatStore.getChatInfo(channelId);
              return response;
            } catch (error) {
              throw error;
            }
          },
          toastConfig({
            success: 'Joined!',
            error: 'Error Joining',
            pending: 'Joining...',
          }),
        );
      } else {
        chatStore.setSelectedChatId(channelId);
        navigate(`/chat`);
      }

      searchStore.setIsOpen(false);
    },
    [chatStore, navigate, searchStore],
  );

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
              onSelect={async () => {
                await handleSelectChat(channel.id);
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
