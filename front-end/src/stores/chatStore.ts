import { create } from 'zustand';
import axios from '../utils/axios';

import { AxiosError } from 'axios';

export enum ChatType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}

export interface ChatInterface {
  id?: number;
  name: string;
  image: string;
  lastMessage?: string;
  lastMessageSender?: number;
  type: ChatType;
}

interface ChatStore {
  chats: ChatInterface[];
  selectedChatId?: number;
  selectedChat?: any;
  pushNewMessage: (message: any) => void;
  getChats: ({ queryKey }: { queryKey: any[] }) => void;
  setSelectedChatId: (id: number) => void;
  getSelectedChat: ({ queryKey }: { queryKey: any[] }) => void;
}

const useChatStore = create<ChatStore>((set) => ({
  chats: [], // list of chats (like pointers to later select which chat to show the messages of)

  selectedChatId: 0, // id of the chat that is currently selected

  selectedChat: {
    // chat that is currently selected
    id: 0,
    users: [],
    members: {},
    messages: [],
    name: '',
    image: '',
    username: '',
  },

  pushNewMessage: (message: any) => {
    set((state) => {
      message.userId = message.from;
      message.avatar = state.selectedChat.members[message.from].avatar;
      return {
        selectedChat: {
          ...state.selectedChat,
          messages: [...state.selectedChat.messages, message],
        },
      };
    });
  },
  getChats: async ({ queryKey }: { queryKey: any[] }) => {
    const [_, type, socket] = queryKey;
    try {
      const { data } = await axios.get(`/chat/${type === ChatType.DM ? 'getDms' : 'getChannels'}`);
      const chats = data.map((chat: any) => ({
        id: chat.id,
        name: chat.members[0].displayName,
        image: chat.members[0].avatar,
        lastMessage: chat.messages[0]?.message,
        lastMessageSender: chat.messages[0]?.userId,
        type: chat.type,
      }));
      set({ chats });
      set({ selectedChatId: chats[0].id });
      if (socket) socket.emit('joinChat', { chatId: chats[0].id });
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  },
  getSelectedChat: async ({ queryKey }: { queryKey: any[] }) => {
    const [_, id] = queryKey;
    try {
      if (id == 0) return;
      const { data } = await axios.get(`/chat/${id}`);
      console.log('dataaaaa', data);
      set({ selectedChat: { id: data.id, users: data.chatUser, members: data.members, messages: data.messages, name: data.name, image: data.image, username: data.username } });
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  },
  setSelectedChatId: (id: number) => set({ selectedChatId: id }),
}));

export default useChatStore;
