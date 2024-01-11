import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './config/Command';
import useAddGroupStore from '../../../stores/addMemberStore';
import { useCommandState } from 'cmdk';
import { useCallback, useEffect } from 'react';
import { debounce } from '../../../utils/ui';
import useChatStore from '../../../stores/chatStore';
import { toast } from 'react-toastify';
import toastConfig from '../../../utils/toastConf';
import axiosInstance from '../../../utils/axios';

function CommandSearchResults() {
  const searchStore = useAddGroupStore();
  const chatStore = useChatStore();

  const handleSelectUser = useCallback(
    async (userId: number) => {
      toast.promise(
        async () => {
          try {
            const response = await axiosInstance.post(`chat/addMember`, { userId, chatId: chatStore.selectedChatId });
            chatStore.updateChatInfo(chatStore.selectedChatId, response.data);
            searchStore.setIsOpen(false);
            return response;
          } catch (error) {
            throw error;
          }
        },
        toastConfig({
          success: 'Added!',
          pending: 'Adding...',
          error: 'Error Adding',
        }),
      );
    },
    [chatStore.selectedChatId],
  );

  return (
    <>
      {searchStore.filteredUsers.length ? (
        <CommandGroup heading='Users'>
          {searchStore.filteredUsers.map((user: any) => (
            <CommandItem key={user.id} onSelect={() => handleSelectUser(user.id)}>
              <img className='mr-2 h-4 w-4 rounded-full' src={user.avatar} alt={user.username} />
              <span>{user.username}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      ) : null}
    </>
  );
}

function CommandSearch() {
  const search = useCommandState((state) => state.search);
  const searchStore = useAddGroupStore();
  const chatStore = useChatStore();

  const debouncedSearch = useCallback(debounce(searchStore.fetchFilteredUsers, 500), []);
  useEffect(() => {
    if (search && search.length) {
      debouncedSearch(search, chatStore.selectedChatId);
    } else {
      searchStore.setFilteredUsers([]);
    }
  }, [search, debouncedSearch]);

  return <CommandInput placeholder='Search user to add...' className='' />;
}

export default function AddMemberDialogue() {
  const searchStore = useAddGroupStore();

  return (
    <CommandDialog open={searchStore.isOpen} onOpenChange={searchStore.setIsOpen}>
      <CommandSearch />
      <CommandList className='font-bold text-dark-cl bg-[#D9D9D9] overflow-y-scroll scrollbar-thin scrollbar-thumb-dark-cl/70 scrollbar-thumb-rounded-full'>
        <CommandSearchResults />
      </CommandList>
    </CommandDialog>
  );
}
