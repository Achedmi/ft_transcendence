import { useQuery } from "react-query";
import axios from "../../../utils/axios";
import { useUserStore } from "../../../user/userStore";

function FriendRow({
	username,
	displayName,
	avatar,
}: {
	username: string;
	displayName: string;
	avatar: string;
}) {
	return (
		<>
			<div className="min-w-[300px] h-16 bg-[#433550]   px-10   flex justify-between items-center ">
				<div className="flex items-center  w-1/6 gap-3 ">
					<img
						src={avatar}
						alt=""
						className="h-12 w-12 rounded-full"
					/>
					<div>
						<p className="text-xl ">{displayName}</p>
						<p className="text-zinc-300 font-light text-sm">
							@{username}
						</p>
					</div>
				</div>
				<div className="flex justify-center h-full items-center gap-5 w-1/6">
					<div
						onClick={() => {
							console.log("hi");
						}}
						className=" bg-red-cl  rounded-xl h-1/2 w-24 text-center flex items-center justify-center  cursor-pointer"
					>
						<p className="p-4">Unfriend</p>
					</div>
					<div
						onClick={() => {
							console.log("hi");
						}}
						className=" bg-blue-cl  rounded-xl h-1/2 w-20 text-center flex items-center justify-center  cursor-pointer"
					>
						<p className="p-4">Message</p>
					</div>
				</div>
			</div>
		</>
	);
}

export default function () {
	// const userData = useUserStore();
	const { data: firends, isLoading } = useQuery("friends", async () => {
		try {
			const response = await axios.get(`/user/friendsOf/achedmi`);
			return response.data;
		} catch (error) {
			console.log(error);
		}
	});
	return !isLoading && firends.length ? (
		<div className="flex flex-col  ">
			{firends.map((friend: any) => {
				return (
					<FriendRow
						username={friend.username}
						avatar={friend.avatar}
						displayName={friend.displayName}
						key={friend.id}
					/>
				);
			})}
		</div>
	) : (
		<div className="w-full h-full bg-slate-400 flex items-center justify-center">
			No Friends Yet
		</div>
	);
}
