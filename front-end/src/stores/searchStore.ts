import { create } from "zustand";
import axiosInstance from "../utils/axios";
import useChatStore, { ChatPreview } from "./chatStore";

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
        const response = await axiosInstance.get(`/search?search=${search}&type=users`);
        set({ filteredUsers: response.data?.users || [], isLoading: false });
      } else {
        set({ filteredUsers: [], isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
  fetchFilteredChannels: async (search: string) => {
    const chatStore = useChatStore.getState();
    try {
      if (search.length > 2) {
        set({ isLoading: true });
        const publicAndProtectedChats = await axiosInstance.get(`/search?search=${search}&type=chat`);
        const privateChats = chatStore.ChannelsPreview.filter(
          (channel: ChatPreview) => channel.visibility === 'PRIVATE' && channel.name.toLowerCase().includes(search.toLowerCase()),
        );

        set({ filteredChannels: [...publicAndProtectedChats.data?.chat, ...privateChats] || [], isLoading: false });
      } else {
        set({ filteredChannels: [], isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
