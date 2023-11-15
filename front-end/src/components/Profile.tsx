import { Edit } from "./icons/icons";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "react-query";
import EditProfile from "./EditProfile";
import { useState } from "react";

const fetchProfile = async () => {
  const response = await axios.get("https://randomuser.me/api/");
  return response.data;
};

const handleEditProfile = () => {
  alert("edit profile");
};

function Profile() {
  const { data, isLoading } = useQuery("profile", fetchProfile);
  type User = {
    username: string;
    picture: {
      large: string;
      medium: string;
      small: string;
    };
    bio: string;
    wins: number;
    losses: number;
  };
  const imgSrc: string =
    "https://i.pinimg.com/564x/90/74/c0/9074c097723d1832ea5c80cafa384104.jpg";

  const user: User = {
    username: isLoading ? "..." : data.results[0].login.username,
    picture: {
      large: isLoading ? imgSrc : data.results[0].picture.large,
      medium: isLoading ? imgSrc : data.results[0].picture.medium,
      small: isLoading ? imgSrc : data.results[0].picture.thumbnail,
    },
    bio: isLoading ? "..." : data.results[0].login.password,
    wins: isLoading ? 0 : Math.floor(Math.random() * 100),
    losses: isLoading ? 0 : Math.floor(Math.random() * 100),
  };

  const [showEditProfile, setShowEditProfile] = useState(false);

  return (
    <div className="flex flex-col  bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl  h-full w-full relative">
      {showEditProfile && (
        <motion.div className="absolute h-[600px] w-[500px] max-h-[80%] max-w-[75%] bg-[#D9D9D9] z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-dark-cl border-[3px] border-solid rounded-xl">
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
            <span className="hidden sm:block non-selectable">Edit profile</span>
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
            <span className="absolute -top-8 left-0 text-xl">About me</span>
            <span className="text-white text-sm sm:text-lg">{user.bio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
