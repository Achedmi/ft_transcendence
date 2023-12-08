import { create } from "zustand";

export interface UserState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  username: string;
  setUsername: (username: string) => void;
  displayName: string;
  setDisplayName: (displayName: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  image: string;
  setImage: (image: string) => void;
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  isTfaVerified: boolean;
  setisTfaVerified: (isTfaVerified: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoading: true,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  username: "",
  setUsername: (username: string) => set({ username }),
  displayName: "",
  setDisplayName: (displayName: string) => set({ displayName }),
  bio: "",
  setBio: (bio: string) => set({ bio }),
  image: "",
  setImage: (image: string) => set({ image }),
  loggedIn: true,
  setLoggedIn: (loggedIn: boolean) => set({ loggedIn }),
  isTfaVerified: false,
  setisTfaVerified: (isTfaVerified: boolean) => set({ isTfaVerified }),
}));
