import { Dispatch, SetStateAction } from "react";
import { Close, Edit } from "./icons/icons";
import { motion } from "framer-motion";
import { useState } from "react";
interface EditProfileProps {
  showEditProfile: boolean;
  setShowEditProfile: Dispatch<SetStateAction<boolean>>;
}

function EditProfile(props: EditProfileProps) {
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <motion.div className="flex flex-col mt-1 w-full h-full">
      <div className="flex justify-between items-center px-1 pb-2 border-b-2 border-solid border-dark-cl">
        <Edit size="38" />
        <h1 className="text-2xl">Edit Profile</h1>
        <motion.div
          className="hover:cursor-pointer"
          onHoverStart={() => setCloseHovered(true)}
          onHoverEnd={() => setCloseHovered(false)}
          onClick={() => props.setShowEditProfile(false)}
        >
          <Close size="38" fillColor={!closeHovered ? "#433650" : "#C84D46"} />
        </motion.div>
      </div>
      <div className="flex justify-center items-center gap-8 pt-4 pb-2 border-b-2 border-solid border-dark-cl">
        <img
          className="w-40 h-40 rounded-full border-solid border-4 border-dark-cl"
          src="https://i.pinimg.com/564x/90/74/c0/9074c097723d1832ea5c80cafa384104.jpg"
          alt="pfp"
        />
        <motion.div
          className=" h-14  bg-dark-cl rounded-full flex flex-center items-center hover:cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Edit size="30" fillColor="#ffffff" />
          <h1 className="hidden sm:block text-white sm:mx-3">
            Import profile picture
          </h1>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default EditProfile;
