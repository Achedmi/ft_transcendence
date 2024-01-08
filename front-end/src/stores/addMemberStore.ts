import { create } from 'zustand';
import axiosInstance from '../utils/axios';
import useChatStore from './chatStore';

interface User {
  username: string;
  displayName: string;
  avatar: string;
}

interface searchState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  filteredUsers: User[];
  setFilteredUsers: (filteredUsers: User[]) => void;
  fetchFilteredUsers: (search: string, chatId: number) => Promise<void>;
}

export const useAddGroupStore = create<searchState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  filteredUsers: [],
  setFilteredUsers: (filteredUsers: User[]) => set({ filteredUsers }),
  fetchFilteredUsers: async (search: string, chatId: number) => {
    const chatStore = useChatStore.getState();
    try {
      if (search.length > 2) {
        set({ isLoading: true });
        const response = await axiosInstance.get(`/search?search=${search}&type=users`);
        chatStore.getChannelsPreview();
        const usersToAdd = response.data?.users.filter((user: any) => !chatStore.isMemberOfChat(chatId, user.id));
        set({ filteredUsers: usersToAdd || [], isLoading: false });
      } else {
        set({ filteredUsers: [], isLoading: false });
      }
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
    }
  },
}));

export default useAddGroupStore;
