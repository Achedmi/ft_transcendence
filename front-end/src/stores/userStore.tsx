import { create } from 'zustand';

import axios from '../utils/axios';

import { AxiosError } from 'axios';
import { Socket } from 'socket.io-client';

export interface User {
  id?: number;
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  isTfaVerified?: boolean;
  isTFAenabled?: boolean;
  status?: string;
  wins?: number;
  losses?: number;
}

export interface UserState {
  user: User;
  isRefreshed: boolean;
  abelToPlay: boolean;
  gameEnded?: boolean;

  socket?: any;
  setSocket: (socket: { game?: Socket; chat?: Socket }) => void;
  setUserData: (user: Partial<User>) => void;
  fetchUserProfile: () => Promise<boolean> | any;
  setAbelToPlay: (abelToPlay: boolean) => void;
  setGameEnded: (gameEnded: boolean) => void;
}
//

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: 0,
    username: '',
    displayName: '',
    bio: '',
    avatar: '',
    isTfaVerified: false,
    isTFAenabled: false,
    status: '',
    wins: 0,
    losses: 0,
  },
  isRefreshed: false,
  setUserData: (user: User) => {
    set((state) => ({ user: { ...state.user, ...user } }));
  },
  abelToPlay: false,
  socket: {},
  setSocket: (socket: any) => {
    set({ socket });
  },
  gameEnded: false,
  setGameEnded: (gameEnded: boolean) => {
    set({ gameEnded });
  },

  refreshToken: async () => {
    try {
      await axios.get('/auth/refresh');
      return true;
    } catch (error) {
      return false;
    }
  },

  fetchUserProfile: async () => {
    try {
      const response = await axios.get('/user/me');
      set({ user: { ...response.data } });
      
      return true;
    } catch (error: AxiosError | any) {
      return false;
    }
  },
  setAbelToPlay: (abelToPlay: boolean) => {
    set({ abelToPlay });
  },
}));
