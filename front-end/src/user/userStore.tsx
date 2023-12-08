import { create } from "zustand";

export interface User {
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  loggedIn?: boolean;
  isTfaVerified?: boolean;
  isTFAenabled?: boolean;
}

export interface UserState {
  userData: User;
  setUserData: (userData: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userData: {
    username: "",
    displayName: "",
    bio: "",
    avatar: "",
    loggedIn: false,
    isTfaVerified: false,
    isTFAenabled: false,
  },
  setUserData: (userData: User) => {
    set((state) => ({
      ...state,
      userData: { ...state.userData, ...userData },
    }));
  },
}));

/*
state => {
    userData: =>{
      username: "",
      displayName: "",
      bio: "",
      avatar: "",
      loggedIn: false,
      isTfaVerified: false,
      isTFAenabled: false,
    },
    setUserData:=>fun
  }
}


*/
