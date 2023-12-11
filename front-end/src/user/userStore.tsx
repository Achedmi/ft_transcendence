import { create } from 'zustand';

import axios from '../utils/axios';

export interface User {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  isTfaVerified?: boolean;
  isTFAenabled?: boolean;
}

export interface UserState {
  userData: User;
  isRefreshed: boolean;
  setUserData: (userData: Partial<User>) => void;
  fetchUserProfile: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set) => ({
  userData: {
    username: '',
    displayName: '',
    bio: '',
    avatar: '',
    isTfaVerified: false,
    isTFAenabled: false,
  },
  isRefreshed: false,
  setUserData: (userData: User) => {
    set({ userData });
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
      set({ userData: { ...response.data } });
      return true;
    } catch (error) {
      return false;
    }
  },
}));
