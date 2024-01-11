import { useCallback, useState } from 'react';
import { useUserStore } from '../../stores/userStore';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import toastConfig from '../../utils/toastConf';
import { motion } from 'framer-motion';
import { Edit } from '../icons/icons';
import { useNavigate } from 'react-router-dom';

type newProfile = {
  displayName: string;
  bio: string;
  avatar: string;
};

function SetupProfile() {
  const { setUserData } = useUserStore();
  const navigate = useNavigate();
  const [newImage, setNewImage] = useState<File>();

  const [newProfile, setNewProfile] = useState<newProfile>({
    displayName: '',
    bio: '',
    avatar: 'https://i.imgur.com/VLTROAT.png',
  });

  const handleEditClick = useCallback(() => {
    const fileInput = document.getElementById('pfpInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  const handleOnSave = async () => {
    const formData = new FormData();
    if (newProfile.displayName) formData.append('displayName', newProfile.displayName);
    if (newProfile.bio) formData.append('bio', newProfile.bio);
    if (newImage) formData.append('image', newImage);
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.post('/user/finishSetup', formData);
          setUserData(response.data);
          //   window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:6969/`);
          navigate('/');
        } catch (error) {
          setNewProfile({
            displayName: '',
            bio: '',
            avatar: 'https://i.imgur.com/VLTROAT.png',
          });
          throw error;
        }
      },
      toastConfig({
        success: 'Setup completed!',
        error: 'Error setting up profile',
        pending: 'setting up...',
      }),
    );
  };

  return (
    <div className='h-screen bg-white flex justify-center items-center w-full '>
      <motion.div className='font-Baloo font-bold text-dark-cl bg-gray-cl border-solid border-4 border-dark-cl rounded-lg  flex flex-col mt-1 w-[600px] '>
        {/* <form onSubmit={handleOnSave}> */}
        <div className='flex justify-between items-center px-1 pb-2 border-b-2 border-solid border-dark-cl'>
          <h1 className='text-xl mt-2 ml-4'>Setup your profile</h1>
          <Edit size='38' fillColor='#433650' />
        </div>

        <div className='flex justify-center items-center pt-4 pb-2 border-b-2 border-solid border-dark-cl'>
          <motion.div className='relative'>
            <img className='object-cover w-40 h-40 rounded-full border-solid border-4 border-dark-cl' src={newProfile.avatar} alt='pfp' />
            <motion.div
              className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-gray-800 flex  items-center justify-center bg-opacity-75 
		  hover:cursor-pointer hover:bg-opacity-100 hover:h-12 hover:w-12 transition-all'
              onClick={handleEditClick}
            >
              <input
                type='file'
                className='hidden'
                id='pfpInput'
                accept='image/*'
                onChange={(e) => {
                  setNewImage(e.target.files![0]);
                  setNewProfile({
                    ...newProfile,
                    avatar: URL.createObjectURL(e.target.files![0]),
                  });
                }}
              />

              <Edit size='28' fillColor='#ffffff' />
            </motion.div>
          </motion.div>
        </div>
        <div className='username and bio flex flex-col border-b-2 border-solid border-dark-cl'>
          <div className='flex  justify-center items-center gap-8 py-4 '>
            <div className='text-xl w-10 text-center '>Name:</div>
            <input
              className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64'
              type='text'
              placeholder={'Enter your display name'}
              onChange={(e) =>
                setNewProfile({
                  ...newProfile,
                  displayName: e.target.value,
                })
              }
              required
            />
          </div>
          <div className='flex  justify-center items-center gap-8 py-4'>
            <div className='text-xl w-10 text-center'>Bio:</div>
            <input
              type='text'
              className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64 overflow-hidden'
              placeholder={'Enter your bio (optional)'}
              onChange={(e) =>
                setNewProfile({
                  ...newProfile,
                  bio: e.target.value,
                })
              }
            />
          </div>
        </div>
        <button onClick={handleOnSave} type='submit' className='bg-dark-cl text-white sm:text-2xl rounded-b-lg w-full h-10  ml-auto mr-auto hover:bg-blue-cl transition-all'>
          Save
        </button>
        {/* </form> */}
      </motion.div>
    </div>
  );
}

export default SetupProfile;
