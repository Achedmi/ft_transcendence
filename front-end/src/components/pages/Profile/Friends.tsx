import { useQuery } from "react-query";
import axios from "../../../utils/axios";
import { useCallback } from "react";
import { create } from "zustand";
import { toast } from "react-toastify";
import { useUserStore } from "../../../user/userStore";
import { MessageIcon, UnfriendIcon } from "../../icons/icons";

interface Friends {
	username: string;
	displayName: string;
	avatar: string;
}

interface FriendsState {
	friends: Friends[];
	setFriends: (friends: Friends[]) => void;
	fetchFriendsOf: (userName: string) => Promise<Array<Friends>>;
	removeFriend: (id: number) => Promise<void>;
}

const userFriendsStore = create<FriendsState>((set) => ({
	friends: [],
	setFriends: (friends: Friends[]) => {
		set({ friends });
	},
	fetchFriendsOf: async (userName: string) => {
		try {
			const response = await axios.get(`/user/friendsOf/${userName}`);
			set({ friends: response.data });
			return response.data;
		} catch (error) {
			console.log(error);
		}
	},
	removeFriend: async (id: number) => {
		try {
			await axios.delete(`/user/unfriend/${id}`);
		} catch (error) {
			console.log(error);
		}
	},
}));

function FriendRow({
	username,
	displayName,
	avatar,
	id,
	refetch,
	unfriend,
}: {
	username: string;
	displayName: string;
	avatar: string;
	id: number;
	refetch: any;
	unfriend: any;
}) {
	const handleUnfriend = useCallback(async () => {
		try {
			toast.promise(
				async () => {
					await unfriend(id);
					await refetch();
				},
				{
					pending: "Removing friend...",
					success: "Friend removed successfully",
					error: "Error removing friend",
				}
			);
		} catch (error) {
			console.log(error);
		}
	}, []);
	return (
		<div className="min-w-[300px] px-10   flex justify-between items-center   ">
			<div className="flex items-center  w-1/6 gap-3 ">
				<img
					src={avatar}
					alt=""
					className="h-12 w-12 rounded-full border-solid border-dark-cl border-[2px]"
				/>
				<div>
					<a href={`/user/${username}`}>
						<p className="text-xl ">{displayName}</p>
						<p className=" font-light text-sm">@{username}</p>
					</a>
				</div>
			</div>
			<div className="flex justify-end h-full items-center gap-5 w-1/2">
				<div
					onClick={handleUnfriend}
					className=" bg-red-cl  rounded-2xl h-9 gap-2 text-center flex items-center justify-center  cursor-pointer text-white border-solid border-dark-cl border-[2px] p-2"
				>
					<UnfriendIcon />
					<p className="pt-[2px] hidden sm:block">Unfriend</p>
				</div>
				<div
					onClick={() => {
						console.log("hi");
					}}
					className=" bg-blue-cl gap-2 rounded-2xl h-9  text-center flex items-center justify-center  cursor-pointer text-white border-solid border-dark-cl border-[2px] p-2"
				>
					<MessageIcon />
					<p className="pt-[2px] hidden sm:block">Message</p>
				</div>
			</div>
		</div>
	);
}

export default function () {
	const friendsStore = userFriendsStore();
	const userName = useUserStore((state) => state.userData.username);
	const { isLoading, refetch } = useQuery("friends", () =>
		friendsStore.fetchFriendsOf(userName || "")
	);
	return !isLoading && friendsStore.friends?.length ? (
		<div className="flex flex-col h-[85%] overflow-scroll gap-3 py-4  ">
			{friendsStore.friends.map((friend: any) => {
				return (
					<FriendRow
						username={friend.username}
						avatar={friend.avatar}
						displayName={friend.displayName}
						id={friend.id}
						refetch={refetch}
						unfriend={friendsStore.removeFriend}
						key={friend.id}
					/>
				);
			})}
			{friendsStore.friends.map((friend: any) => {
				return (
					<FriendRow
						username={friend.username}
						avatar={friend.avatar}
						displayName={friend.displayName}
						id={friend.id}
						refetch={refetch}
						unfriend={friendsStore.removeFriend}
						key={friend.id}
					/>
				);
			})}
		</div>
	) : (
		<div className="w-full h-[85%]  flex items-center justify-center  ">
			No Friends Yet
		</div>
	);
}
