import { Dispatch, SetStateAction } from "react";
import { Close, Edit } from "./icons/icons";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useUserStore } from "./store/userStore";

interface EditProfileProps {
  showEditProfile: boolean;
  setShowEditProfile: Dispatch<SetStateAction<boolean>>;
}

function EditProfile(props: EditProfileProps) {
  const { image } = useUserStore();
  const [closeHovered, setCloseHovered] = useState(false);
  const [file, setFile] = useState(image);

  const [newImage, setNewImage] = useState<File>();

  const [username, setUsername] = useState("ainzsoup");
  const [bio, setBio] = useState("i have autism please slow down");

  const handleImageChange = (file: File) => {
    setNewImage(file);
    setFile(URL.createObjectURL(file));
  };

  const handleEditClick = () => {
    const fileInput = document.getElementById("pfpInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleOnSave = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (newImage) formData.append("image", newImage);
    try {
      const response = await axios.patch(
        "http://localhost:9696/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
    } catch (error: AxiosError | any) {
      console.log(error);
      if (error instanceof AxiosError) alert(error.response?.data.message);
    }
  };

  return (
    <motion.div className="flex flex-col mt-1 w-full h-full">
      <div className="flex justify-between items-center px-1 pb-2 border-b-2 border-solid border-dark-cl">
        <Edit size="38" fillColor="#433650" />
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

      <div className="flex justify-center items-center pt-4 pb-2 border-b-2 border-solid border-dark-cl">
        <motion.div className="relative">
          <img
            className="w-40 h-40 rounded-full border-solid border-4 border-dark-cl"
            src={file}
            alt="pfp"
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-gray-800 flex  items-center justify-center bg-opacity-75 
		  hover:cursor-pointer hover:bg-opacity-100 hover:h-12 hover:w-12 transition-all"
            onClick={handleEditClick}
          >
            <input
              type="file"
              className="hidden"
              id="pfpInput"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files![0])}
            />

            <Edit size="28" fillColor="#ffffff" />
          </motion.div>
        </motion.div>
      </div>
      <div className="username and bio flex flex-col border-b-2 border-solid border-dark-cl">
        <div className="flex  justify-around items-center gap-2 py-4 ">
          <div className="text-xl w-10 text-center">Name</div>
          <input
            className="border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64"
            type="text"
            placeholder={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex  justify-around items-center gap-2 py-4">
          <div className="text-xl w-10 text-center">Bio</div>
          <input
            type="text"
            className="border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64 overflow-hidden"
            placeholder={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>
      <button
        className="bg-dark-cl text-white sm:text-2xl rounded-b-lg w-full h-10  ml-auto mr-auto hover:bg-blue-cl transition-all"
        onClick={handleOnSave}
      >
        Save
      </button>
    </motion.div>
  );
}

export default EditProfile;
