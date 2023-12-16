import { create } from 'zustand';

import axios from '../utils/axios';

import { AxiosError } from 'axios';

export interface User {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  isTfaVerified?: boolean;
  isTFAenabled?: boolean;
}

export interface UserState {
  user: User;
  isRefreshed: boolean;
  setUserData: (user: Partial<User>) => void;
  fetchUserProfile: () => Promise<boolean> | any;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    username: '',
    displayName: '',
    bio: '',
    avatar: '',
    isTfaVerified: false,
    isTFAenabled: false,
  },
  isRefreshed: false,
  setUserData: (user: User) => {
    set((state) => ({ user: { ...state.user, ...user } }));
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
}));
