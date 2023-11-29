import { create } from "zustand";

export type User = {
  username: string;
  picture: {
    large: string;
    medium: string;
    small: string;
  };

  bio: string;
  wins: number;
  losses: number;
  loggedIn: boolean;
  isTFAVerified: boolean;
};

interface UserState {
  username: string;
  setUsername: (username: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  image: string;
  setImage: (image: string) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  isTFAVerified: boolean;
  setIsTFAVerified: (isTFAVerified: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: "",
  setUsername: (username: string) => set({ username }),
  bio: "",
  setBio: (bio: string) => set({ bio }),
  image: "",
  setImage: (image: string) => set({ image }),
  loggedIn: true,
  setLoggedIn: (loggedIn: boolean) => set({ loggedIn }),
  isTFAVerified: true,
  setIsTFAVerified: (isTFAVerified: boolean) => set({ isTFAVerified }),
}));
