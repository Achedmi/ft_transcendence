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
  userData: User;
  isRefreshed: boolean;
  setUserData: (userData: Partial<User>) => void;
  fetchUserProfile: () => Promise<boolean> | any;
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
    set((state) => ({ userData: { ...state.userData, ...userData } }));
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
    } catch (error: AxiosError | any) {
      if (error.response?.status === 403 && window.location.pathname == '/login') window.location.replace('/tfa');
      else return false;
      return null;
    }
  },
}));
