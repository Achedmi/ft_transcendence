import { Edit } from "./icons/icons";
import { motion } from "framer-motion";

function Profile() {
  return (
    <div className="flex flex-col bg-[#D9D9D9]  text-dark-cl border-solid border-dark-cl border-[4px] rounded-xl  h-full w-full">
      <div className="bg-dark-cl h-48 relative">
        <motion.div>
          <img
            src="https://i.pinimg.com/564x/90/74/c0/9074c097723d1832ea5c80cafa384104.jpg"
            alt=""
            className="min-h-44 min-w-44 max-h-44 max-w-44 rounded-full absolute top-24 left-1/2 transform -translate-x-1/2 border-solid border-dark-cl border-[4px]"
          />
        </motion.div>

        <motion.div
          className="bg-[#D9D9D9] hover:cursor-pointer  flex justify-center gap-2 items-center rounded-3xl border-solid border-dark-cl border-[4px] absolute -bottom-5 right-0 mr-4 p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Edit profile"
        >
          <Edit />
          <span className="hidden sm:block non-selectable">Edit profile</span>
        </motion.div>
      </div>
      <span className="text-3xl sm:text-4xl font-bold text-center mt-24">
        ainzsoup
      </span>
      <div className="flex gap-8 w-full justify-center mt-8 sm:text-xl">
        <span>666 Wins</span>
        <span>|</span>
        <span>17 Losses</span>
      </div>
    </div>
  );
}

export default Profile;
