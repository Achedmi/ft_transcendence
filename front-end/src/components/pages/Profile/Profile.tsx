import { Edit, Toggle } from "../../icons/icons";
import { motion } from "framer-motion";
import EditProfile from "./EditProfile";
import { useState } from "react";
import { useUserStore } from "../../../user/userStore";
import HandleTfa from "../../2fa/HandleTfa";
import axios, { AxiosError } from "axios";
import { SubNavBar } from "../../Stats";
import { Outlet } from "react-router-dom";

function Profile() {
	const [showEditProfile, setShowEditProfile] = useState(false);
	const [showTfa, setShowTfa] = useState(false);
	const { userData } = useUserStore();

	console.log("userData", userData);

	async function hanfleToggleTfa() {
		if (userData.isTFAenabled) {
			try {
				await axios.post(
					"http://localhost:9696/auth/disableTFA",
					{},
					{
						headers: {
							"Content-Type": "application/json",
						},
						withCredentials: true,
					}
				);
				window.location.reload();
			} catch (error: AxiosError | any) {
				console.log(error);
			}
		} else setShowTfa(true);
	}

	return (
		<div className="flex flex-col  bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl   h-full w-full relative overflow-scroll pb-10">
			{showEditProfile && (
				<motion.div className="absolute  w-[500px]  max-w-[75%] bg-[#D9D9D9] z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-dark-cl border-[3px] border-solid rounded-xl">
					<EditProfile
						showEditProfile={showEditProfile}
						setShowEditProfile={setShowEditProfile}
					/>
				</motion.div>
			)}
			{showTfa && (
				<motion.div className="absolute  w-[500px]  max-w-[75%] bg-[#D9D9D9] z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-dark-cl border-[3px] border-solid rounded-xl">
					<HandleTfa showTfa={showTfa} setShowTfa={setShowTfa} />
				</motion.div>
			)}

			<div
				className={
					showEditProfile || showTfa
						? "blur-md z-0 non-selectable pointer-events-none"
						: "z-0"
				}
			>
				<div className="bg-dark-cl h-48  relative">
					<motion.div>
						<img
							src={userData.avatar}
							alt=""
							className="h-44 w-44 max-h-44 max-w-44 rounded-full absolute top-24 left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px]"
						/>
					</motion.div>
					<motion.div
						className="bg-[#D9D9D9] hover:cursor-pointer  flex justify-center gap-2 items-center rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 right-0 mr-4 p-2 h-11"
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
					<div className="bg-[#D9D9D9] flex justify-center gap-2 items-center rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 left-0 ml-4 p-2 h-11">
						<span className="non-selectable ">2FA</span>
						<div onClick={hanfleToggleTfa}>
							<Toggle on={userData.isTFAenabled} />
						</div>
					</div>
				</div>
				<div className="flex flex-col justify-center items-center ">
					<span className="text-3xl sm:text-4xl font-bold text-center mt-24 ">
						{userData.displayName}
					</span>
					<span className="text-md opacity-75">
						{"@" + userData.username}
					</span>
					<div className="flex gap-8 w-full justify-center mt-8 sm:text-xl">
						<span> {Math.floor(Math.random() * 100)} Wins</span>
						<span>|</span>
						<span>{Math.floor(Math.random() * 100)} Losses</span>
					</div>

					<div className="BIO  h-16 w-[50%] bg-dark-cl border-solid border-dark-cl rounded-xl border-[4px] mt-14 relative flex justify-center items-center">
						<span className="absolute -top-8 left-0 text-xl">
							About me
						</span>
						<span className="text-white text-sm sm:text-lg">
							{userData.bio}
						</span>
					</div>
					<div className=" flex flex-col content-center w-[70%]  max-w-6xl h-96 border-solid border-dark-cl border-[4px] mt-14 rounded-3xl overflow-hidden">
						<SubNavBar />
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
