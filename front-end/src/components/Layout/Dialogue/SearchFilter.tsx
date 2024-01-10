import { CommandGroup, CommandInput, CommandItem, CommandShortcut } from './config/Command';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useCommandState } from 'cmdk';
import { debounce } from '../../../utils/ui';
import { LockIcon } from '../../icons/icons';
import useChatStore from '../../../stores/chatStore';
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
    async (channelId: number, visibility: string) => {
      chatStore.getChannelsPreview();

      if (!chatStore.isMemberOfChat(channelId, user.id)) {
        if (visibility === 'PROTECTED') {
          chatStore.setChannelToJoinId(channelId);
          chatStore.setPromptPasswordOpen(true);
          searchStore.setIsOpen(false);
          return;
        }

        const response = await axiosInstance.post(`chat/joinChannel`, { channelId });
        toast.promise(
          async () => {
            try {
              console.log('response', response);

              chatStore.getChannelsPreview();
              chatStore.setSelectedChatId(response.data.id);
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
        chatStore.setSelectedChatId(response.data.id);
        navigate(`/chat`);
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
          {searchStore.filteredChannels.map((channel: any) => {
            console.log('id', channel.id, 'name', channel.name);
            return (
              <CommandItem
                key={'search-channel-' + channel.id}
                onSelect={async () => {
                  console.log('cnd', channel);
                  await handleSelectChat(channel.id, channel.visibility);
                }}
                className=''
                value={'search-channel-' + channel.id}
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
            );
          })}
        </CommandGroup>
      )}
    </>
  );
}

//hht....../search?search=an&type=users
