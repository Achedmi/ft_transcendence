import { create } from 'zustand';
import axios from '../utils/axios';

export enum ChatType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}

export interface Member {
  id: number;
  username?: string;
  avatar?: string;
  displayName?: string;
}

export interface Message {
  id: number;
  content: string;
  sender: Member;
  chatId: number;
}

export interface ChatPreview {
  id: number;
  type: ChatType;
  name?: string;
  image?: string;
  lastMessage: Message;
  visibility?: string;
  members: Member[];
  isCached: boolean;
}

interface ChatState {
  DmsPreview: ChatPreview[];
  DmsLoading: boolean;
  ChannelsPreview: ChatPreview[];
  ChannelsLoading: boolean;
  selectedChatId: number;
  messages?: Map<number, Message[]>;
  setSelectedChatId: (id: number) => void;
  getDmsPreview: () => void;
  getChannelsPreview: () => void;
  getMessages: ({ queryKey }: any) => void;
}

const useChatStore = create<ChatState>()((set) => {
  return {
    DmsPreview: [],
    ChannelsPreview: [],
    DmsLoading: true,
    ChannelsLoading: true,
    selectedChatId: -1,
    setSelectedChatId: (id: number) => {
      set({ selectedChatId: id });
    },
    messages: new Map<number, Message[]>(),
    getDmsPreview: async () => {
      set({ DmsLoading: true });
      const Dms = await axios.get('/chat/getDms');
      set({ DmsLoading: false });
      set({
        DmsPreview: Dms.data.map((dm: any) => ({
          id: dm.id,
          type: ChatType.DM,
          name: dm.members[0].displayName,
          image: dm.members[0].avatar,
          lastMessage: {
            id: dm.messages[0].id,
            content: dm.messages[0].message,
            sender: {
              id: dm.messages[0].userId,
            },
            chatId: dm.id,
          },
          members: dm.members,
          isCached: false,
        })),
      });
    },
    getChannelsPreview: async () => {
      set({ ChannelsLoading: true });
      const Channels = await axios.get('/chat/getChannels');
      set({ ChannelsLoading: false });
      set({
        ChannelsPreview: Channels.data.map((channel: any) => ({
          id: channel.id,
          type: ChatType.CHANNEL,
          name: channel.name,
          image: channel.image,
          lastMessage: {
            id: channel.messages[0].id,
            content: channel.messages[0].message,
            sender: {
              id: channel.messages[0].userId,
            },
            chatId: channel.id,
          },
          members: channel.members,
          isCached: false,
        })),
      });
    },
    getMessages: async ({ queryKey }: any) => {
      const [_ , id] = queryKey;
      const messages = await axios.get(`/chat/getChatMessages/${id}`);
      set({
        messages: useChatStore.getState().messages?.set(id, messages.data),
      });
    },
  };
});

export default useChatStore;
