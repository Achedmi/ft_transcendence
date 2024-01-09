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
  isowner?: string;
  isAdmin?: boolean;
  isMuted?: boolean;
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
  name: string;
  image?: string;
  lastMessage: Message;
  visibility?: string;
  members: Member[];
  isCached: boolean;
  unreadMessages?: number;
}

export interface ChatInfo {
  id?: number;
  type?: ChatType;
  name?: string;
  image?: string;
  visibility?: string;
  password?: string;
  members?: Member[];
  ownerId?: number;
}

interface ChatState {
  DmsPreview: ChatPreview[];
  DmsLoading: boolean;
  ChannelsPreview: ChatPreview[];
  ChannelsLoading: boolean;
  selectedChatId: number;
  messages?: Map<number, Message[]>;
  chatInfo?: Map<number, ChatInfo>;
  chatInfoLoading?: boolean;
  setSelectedChatId: (id: number) => void;
  getDmsPreview: () => void;
  getChannelsPreview: () => void;
  getMessages: ({ queryKey }: any) => void;
  getChatInfo: ({ queryKey }: any) => void;
  pushMessage: (message: any, chatId: number) => void;
  updateLastDM: (message: any, chatId: number) => void;
  updateLastGroupMessage: (message: any, chatId: number) => void;
  updateChatInfo: (chatId: number, chatInfo: ChatInfo) => void;
  isMemberOfChat: (chatId: number, userId: number | undefined) => boolean;
  addNewUnreadMessage: (chatId: number, chatType: ChatType) => void;
  resetNewUnreadMessage: (chatId: number, chatType: ChatType) => void;
}

const useChatStore = create<ChatState>()((set) => {
  return {
    DmsPreview: [],
    ChannelsPreview: [],
    DmsLoading: true,
    ChannelsLoading: true,
    chatInfoLoading: true,
    selectedChatId: -1,
    setSelectedChatId: (id: number) => {
      set({ selectedChatId: id });
    },
    messages: new Map<number, Message[]>(),
    chatInfo: new Map<number, ChatInfo>(),
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
          unreadMessages: 0,
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
            id: channel.messages[0]?.id,
            content: channel.messages[0]?.message,
            sender: {
              id: channel.messages[0]?.userId,
            },
            chatId: channel.id,
          },
          members: channel.members,
          unreadMessages: 0,
          isCached: false,
          visibility: channel.visibility,
        })),
      });
    },
    getMessages: async ({ queryKey }: any) => {
      const [_, id] = queryKey;
      if (id) {
        if (useChatStore.getState().messages?.has(id)) return;
        const messages = await axios.get(`/chat/getChatMessages/${id}`);
        set({
          messages: useChatStore.getState().messages?.set(id, messages.data),
        });
      }
    },
    getChatInfo: async ({ queryKey }: any) => {
      const [_, id] = queryKey;
      if (useChatStore.getState().chatInfo?.has(id)) return;
      set({ chatInfoLoading: true });
      const chatInfo = await axios.get(`/chat/getChatInfos/${id}`);
      set({ chatInfoLoading: false });
      set({
        chatInfo: useChatStore.getState().chatInfo?.set(id, {
          id: chatInfo.data.id,
          type: chatInfo.data.type,
          name: chatInfo.data.name,
          image: chatInfo.data.image,
          visibility: chatInfo.data.visibility,
          password: chatInfo.data.password,
          members: chatInfo.data.members.map((member: any) => ({
            id: member.userId,
            username: member.username,
            avatar: member.avatar,
            displayName: member.displayName,
            isowner: member.isowner,
            isAdmin: member.isAdmin,
            isMuted: member.isMuted,
          })),
          ownerId: chatInfo.data.ownerId,
        }),
      });
    },
    pushMessage: (message: any, chatId: number) => {
      const messages = useChatStore.getState().messages?.get(chatId);
      if (messages) {
        set({
          messages: useChatStore.getState().messages?.set(chatId, [...messages, message]),
        });
      }
    },
    updateLastDM: (message: any, chatId: number) => {
      console.log('updateLastDM', message, chatId);
      const DmsPreview = useChatStore.getState().DmsPreview;
      const index = DmsPreview.findIndex((dm) => dm.id === chatId);
      if (index !== -1) {
        DmsPreview[index].lastMessage = {
          id: message.id,
          content: message.message,
          sender: {
            id: message.userId,
          },
          chatId: chatId,
        };
        set({ DmsPreview });
      }
    },
    updateLastGroupMessage: (message: any, chatId: number) => {
      const ChannelsPreview = useChatStore.getState().ChannelsPreview;
      const index = ChannelsPreview.findIndex((channel) => channel.id === chatId);
      if (index !== -1) {
        ChannelsPreview[index].lastMessage = {
          id: message.id,
          content: message.message,
          sender: {
            id: message.userId,
          },
          chatId: chatId,
        };
        set({ ChannelsPreview });
      }
    },
    updateChatInfo: (chatId: number, chatInfo: ChatInfo) => {
      set({ chatInfoLoading: true });
      const chatInfos = useChatStore.getState().chatInfo;
      if (chatInfos) {
        set({
          chatInfo: useChatStore.getState().chatInfo?.set(chatId, {
            id: chatInfo.id,
            type: chatInfo.type,
            name: chatInfo.name,
            image: chatInfo.image,
            visibility: chatInfo.visibility,
            password: chatInfo.password,
            members: chatInfo.members?.map((member: any) => ({
              id: member.userId,
              username: member.username,
              avatar: member.avatar,
              displayName: member.displayName,
              isowner: member.isowner,
              isAdmin: member.isAdmin,
              isMuted: member.isMuted,
            })),
            ownerId: chatInfo.ownerId,
          }),
        });
      }
      set({ chatInfoLoading: false });
    },
    isMemberOfChat: (chatId: number, userId: number | undefined) => {
      const channels = useChatStore.getState().ChannelsPreview;
      const chat = channels.find((channel) => channel.id === chatId);
      if (chat) {
        const member = chat.members.find((member) => member.id === userId);
        if (member) return true;
      }
      return false;
    },
    addNewUnreadMessage: (chatId: number, chatType: ChatType) => {
      console.log('addNewUnreadMessage', chatId, chatType);
      if (chatType === ChatType.DM) {
        const dms = useChatStore.getState().DmsPreview;
        const dm = dms.find((dm) => dm.id === chatId);
        if (dm) {
          dm.unreadMessages = dm.unreadMessages ? dm.unreadMessages + 1 : 1;
        }
      } else {
        const channels = useChatStore.getState().ChannelsPreview;
        const channel = channels.find((channel) => channel.id === chatId);
        if (channel) {
          channel.unreadMessages = channel.unreadMessages ? channel.unreadMessages + 1 : 1;
        }
      }
    },
    resetNewUnreadMessage: (chatId: number, chatType: ChatType) => {
      if (chatType === ChatType.DM) {
        const dms = useChatStore.getState().DmsPreview;
        const dm = dms.find((dm) => dm.id === chatId);
        if (dm) {
          dm.unreadMessages = 0;
        }
      } else {
        const channels = useChatStore.getState().ChannelsPreview;
        const channel = channels.find((channel) => channel.id === chatId);
        if (channel) {
          channel.unreadMessages = 0;
        }
      }
    },
  };
});

export default useChatStore;
