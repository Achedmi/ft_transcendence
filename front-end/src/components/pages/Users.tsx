import { motion } from "framer-motion";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserStore } from "../../user/userStore";
import { Navigate } from "react-router-dom";


function Users() {
  const { username } = useParams<{ username: string }>();
  const { userData } = useUserStore();
  const { data, isLoading } = useQuery("users", async () => {
    try {
      const response = await axios.get(
        `http://localhost:9696/user/${username}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: AxiosError | any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error("user not found");
          window.location.href = "/";
      }
    }
  });

  
  if (isLoading) return <></>;
  if (data.username === userData.username) return <Navigate to="/profile" />;

  return (
    <div className="flex flex-col  bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl  h-full w-full relative">
      <div className="z-0">
        <div className="bg-dark-cl h-48  relative">
          <motion.div>
            <img
              src={data.avatar}
              alt=""
              className="h-44 w-44 max-h-44 max-w-44 rounded-full absolute top-24 left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px]"
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
            <span className="text-white text-sm sm:text-lg">{data.bio}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
