import { create } from "zustand";

import axios from "../utils/axios";
import { AxiosError } from "axios";

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
	setUserData: (userData: Partial<User>) => void;
	fetchUserProfile: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set) => ({
	userData: {
		username: "",
		displayName: "",
		bio: "",
		avatar: "",
		isTfaVerified: false,
		isTFAenabled: false,
	},
	setUserData: (userData: User) => {
		set({ userData });
	},
	fetchUserProfile: async () => {
		try {
			const response = await axios.get("/user/me");
			set({ userData: { ...response.data } });
			return true;
		} catch (error) {
			return false;
		}
	},
}));
