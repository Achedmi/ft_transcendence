import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../user/userStore";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { SyncLoader } from "react-spinners";

function Users() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { username } = useParams<{ username: string }>();
  const { userData } = useUserStore();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery("users", async () => {
    try {
      const response = await axios.get(`/user/${username}`);
      return response.data;
    } catch (error) {
      navigate("/404");
    }
  });

  const handleLoaded = useCallback(() => {
    setIsLoaded(true);
	console.log("loaded");
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoading && data && data.username === userData.username)
      navigate("/profile");
  }, [isLoading, data]);

  return (
    <>
      {isLoading && (
        <div className="h-full w-full flex justify-center items-center">
          <SyncLoader color="#433650" />
        </div>
      )}
      {data && (
        <div className="flex flex-col  bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl  h-full w-full relative">
          <div className="z-0">
            <div className="bg-dark-cl h-40  relative">
              <motion.div>
                {!isLoaded && (
                  <div className="h-44 w-44 max-h-44 max-w-44 rounded-full absolute top-24 left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px] bg-dark-cl">
                    <SyncLoader
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      color="#ffffff"
                    />
                  </div>
                )}
                <img
                  src={data.avatar}
                  alt=""
                  className="h-44 w-44 max-h-44 max-w-44 rounded-full absolute top-[65px] left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px]"
                  onLoad={handleLoaded}
                />
              </motion.div>
            </div>
            <div className="flex flex-col justify-center items-center ">
              <span className="text-3xl sm:text-4xl font-bold text-center mt-24 ">
                {data.displayName}
              </span>
              <span className="text-md opacity-75">{"@" + data.username}</span>
              <div className="flex gap-8 w-full justify-center mt-8 sm:text-xl">
                <span> {Math.floor(Math.random() * 100)} Wins</span>
                <span>|</span>
                <span>{Math.floor(Math.random() * 100)} Losses</span>
              </div>

              <div className="BIO  h-16 w-[50%] bg-dark-cl border-solid border-dark-cl rounded-xl border-[4px] mt-14 relative flex justify-center items-center">
                <span className="absolute -top-8 left-0 text-xl">About me</span>
                <span className="text-white text-sm sm:text-lg">
                  {data.bio}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;
