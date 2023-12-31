import { create } from 'zustand';
import axios from '../utils/axios';

import { AxiosError } from 'axios';

export enum ChatType {
  DM = 'DM',
  CHANNEL = 'CHANNEL',
}

export interface ChatInterface {
  id?: number;
  name?: string;
  image: string;
  lastMessage?: string;
  lastMessageSender?: number;
  type: ChatType;
  newMessages: number;
}

interface ChatStore {
  chats: ChatInterface[];
  updateChat: (id: number, data: any) => void;
  selectedChatId?: number;
  selectedChat?: any;
  pushNewMessage: (message: any) => void;
  getChats: ({ queryKey }: { queryKey: any[] }) => void;
  setSelectedChatId: (id: number) => void;
  getSelectedChat: ({ queryKey }: { queryKey: any[] }) => void;
}

const useChatStore = create<ChatStore>((set) => ({
  chats: [], // list of chats (like pointers to later select which chat to show the messages of)
  updateChat: (id: number, data: any) => {
    set((state) => {
      const chats = state.chats.map((chat) => {
        if (chat.id === id && state.selectedChatId !== id) {
          data.newMessages = chat.newMessages + 1;
          return { ...chat, ...data };
        }
        return chat;
      });
      return { chats };
    });
  },
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
    newMessages: 0,
    ownerId: 0,
  },

  pushNewMessage: (message: any) => {
    set((state) => {
      message.userId = message.from;
      message.user = {};
      message.user.avatar = state.selectedChat.members[message.from].user.avatar;
      console.log(message);
      return {
        selectedChat: {
          ...state.selectedChat,
          messages: [...state.selectedChat.messages, message],
        },
      };
    });
  },
  getChats: async ({ queryKey }: { queryKey: any[] }) => {
    const [_, type] = queryKey;
    try {
      const { data } = await axios.get(`/chat/${type === ChatType.DM ? 'getDms' : 'getChannels'}`);
      console.log('doto', data);
      const chats = data.map((chat: any) => ({
        id: chat.id,
        name: type === ChatType.DM ? chat.members[0].displayName : chat.name,
        image: type === ChatType.DM ? chat.members[0].avatar : chat.image,
        lastMessage: chat.messages[0]?.message,
        lastMessageSender: chat.messages[0]?.userId,
        type: chat.type,
        newMessages: 0,
      }));
      set({ chats });
      set({ selectedChatId: chats[0].id });
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

      set({ selectedChat: { id: data.id, users: data.chatUser, members: data.members, messages: data.messages, name: data.name, image: data.image, username: data.username, ownerId: data.ownerId } });
    } catch (error) {
      const err = error as AxiosError;
      console.log(err.response?.data);
    }
  },
  setSelectedChatId: (id: number) => {
    set({ selectedChatId: id })
    set ((state) => { 
      return {
        chats: state.chats.map((chat) => {
          if (chat.id === id) {
            chat.newMessages = 0;
            return chat;
          }
          return chat;
        }),
      }
    } )
  },


}));

export default useChatStore;
