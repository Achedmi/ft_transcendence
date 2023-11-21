import { Edit } from "./icons/icons";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import EditProfile from "./EditProfile";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "./user/userStore";
import { getUser } from "./user/fetchUser";

function Profile() {
  const { loggedIn, setLoggedIn, setImage } = useUserStore();

  const [showEditProfile, setShowEditProfile] = useState(false);

  const { data, isLoading } = useQuery("profile", () =>
    getUser(setLoggedIn, setImage)
  );

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

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
                src={isLoading ? "" : data.avatar}
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
            <span className="hidden sm:block non-selectable">Edit profile</span>
          </motion.div>
        </div>
        <div className="flex flex-col justify-center items-center ">
          <span className="text-3xl sm:text-4xl font-bold text-center mt-24">
            {isLoading ? "..." : data.username}
          </span>
          <div className="flex gap-8 w-full justify-center mt-8 sm:text-xl">
            <span> {isLoading ? 0 : Math.floor(Math.random() * 100)} Wins</span>
            <span>|</span>
            <span>
              {isLoading ? 0 : Math.floor(Math.random() * 100)} Losses
            </span>
          </div>

          <div className="BIO  h-16 w-[50%] bg-dark-cl border-solid border-dark-cl rounded-xl border-[4px] mt-14 relative flex justify-center items-center">
            <span className="absolute -top-8 left-0 text-xl">About me</span>
            <span className="text-white text-sm sm:text-lg">
              {isLoading ? "..." : data.bio}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
