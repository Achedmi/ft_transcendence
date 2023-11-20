import { Edit } from "./icons/icons";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "react-query";
import EditProfile from "./EditProfile";
import { useState } from "react";
import { User } from "./store/userStore";
import { Navigate } from "react-router-dom";

const fetchProfile = async () => {
	const response = await axios.get("https://randomuser.me/api/");
	return response.data;
};

const getUser = async () => {
	try {
		const response = await axios.get("http://localhost:9696/user/whoami", {
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.log(error);
		return {
			username: "asdasd",
			bio: "",
			image: "",
			wins: 0,
			losses: 0,
			loggedIn: false,
		};
	}
};

function Profile() {
	const [showEditProfile, setShowEditProfile] = useState(false);
	// const { loggedIn } = useUserStore();
	const { data, isLoading, isError } = useQuery("profile", getUser);

	const user: User = {
		loggedIn: true,
		username: isLoading ? "..." : isError ? "hamid" : data.username,
		picture: {
			large: isLoading ? "" : data.image,
			medium: isLoading ? "" : data.image,
			small: isLoading ? "" : data.image,
		},
		bio: isLoading ? "..." : data.bio,
		wins: isLoading ? 0 : data.wins,
		losses: isLoading ? 0 : data.losses,
	};
	console.log(user);
	if (!user.loggedIn) {
		return <Navigate to="/login" />;
	}
	// const { data, isLoading } = useQuery("profile", fetchProfile);

	// const imgSrc: string =
	// 	"https://i.pinimg.com/564x/90/74/c0/9074c097723d1832ea5c80cafa384104.jpg";

	// const user: User = {
	// 	username: isLoading ? "..." : data.results[0].login.username,
	// 	picture: {
	// 		large: isLoading ? imgSrc : data.results[0].picture.large,
	// 		medium: isLoading ? imgSrc : data.results[0].picture.medium,
	// 		small: isLoading ? imgSrc : data.results[0].picture.thumbnail,
	// 	},
	// 	bio: isLoading ? "..." : data.results[0].login.password,
	// 	wins: isLoading ? 0 : Math.floor(Math.random() * 100),
	// 	losses: isLoading ? 0 : Math.floor(Math.random() * 100),
	// };

	return (
		<div className="flex flex-col  bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl  h-full w-full relative">
			{showEditProfile && (
				<motion.div className="absolute  w-[500px]  max-w-[75%] bg-[#D9D9D9] z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-dark-cl border-[3px] border-solid rounded-xl">
					<EditProfile
						showEditProfile={showEditProfile}
						setShowEditProfile={setShowEditProfile}
					/>
				</motion.div>
			)}

			<div className={showEditProfile ? "blur-sm z-0" : "z-0"}>
				<div className="bg-dark-cl h-48  relative">
					<motion.div>
						{isLoading ? (
							<div className="h-44 w-44 max-h-44 max-w-44 rounded-full overflow-hidden absolute top-24 left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px] bg-dark-cl">
								<div className="bg-[#D9D9D9] h-20 w-20 rounded-full absolute top-7 left-1/2 -translate-x-1/2"></div>
								<div className="issue bg-[#D9D9D9] h-40 w-40 rounded-full absolute left-1/2 -translate-x-1/2 top-[70%] "></div>
							</div>
						) : (
							<img
								src={user.picture.large}
								alt=""
								className="h-44 w-44 max-h-44 max-w-44 rounded-full absolute top-24 left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px]"
							/>
						)}
					</motion.div>
					<motion.div
						className="bg-[#D9D9D9] hover:cursor-pointer  flex justify-center gap-2 items-center rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 right-0 mr-4 p-2"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						title="Edit profile"
						onClick={() => setShowEditProfile(true)}
					>
						<Edit size="26" fillColor="#433650" />
						<span className="hidden sm:block non-selectable">
							Edit profile
						</span>
					</motion.div>
				</div>
				<div className="flex flex-col justify-center items-center ">
					<span className="text-3xl sm:text-4xl font-bold text-center mt-24">
						{user.username}
					</span>
					<div className="flex gap-8 w-full justify-center mt-8 sm:text-xl">
						<span> {user.wins} Wins</span>
						<span>|</span>
						<span> {user.losses} Losses</span>
					</div>

					<div className="BIO  h-16 w-[50%] bg-dark-cl border-solid border-dark-cl rounded-xl border-[4px] mt-14 relative flex justify-center items-center">
						<span className="absolute -top-8 left-0 text-xl">
							About me
						</span>
						<span className="text-white text-sm sm:text-lg">
							{user.bio}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
