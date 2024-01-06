import { Dispatch, SetStateAction } from 'react';
import { Close, Edit, Check, Error } from '../../icons/icons';
import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useUserStore } from '../../../stores/userStore';
import { toast } from 'react-toastify';
import axios from '../../../utils/axios';
import '../../../styles/customToastStyles.css';
import toastConfig from '../../../utils/toastConf';

interface EditProfileProps {
  showEditProfile: boolean;
  setShowEditProfile: Dispatch<SetStateAction<boolean>>;
}

type newProfile = {
  displayName: string;
  bio: string;
  avatar: string;
};

function EditProfile(props: EditProfileProps) {
  const { user, setUserData } = useUserStore();
  const [newImage, setNewImage] = useState<File>();

  const [newProfile, setNewProfile] = useState<newProfile>({
    displayName: user.displayName || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
  });

  const handleEditClick = useCallback(() => {
    const fileInput = document.getElementById('pfpInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  const handleOnSave = useCallback(async () => {
    const formData = new FormData();
    if (newProfile.displayName) formData.append('displayName', newProfile.displayName);
    if (newProfile.bio) formData.append('bio', newProfile.bio);
    if (newImage) formData.append('image', newImage);
    toast.promise(
      async () => {
        try {
          const response = await axios.patch('/user', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log(response);
          setUserData(response.data);
          props.setShowEditProfile(false);
          return response;
        } catch (error) {
          setNewProfile({ ...newProfile, ...user });
          throw error;
        }
      },
      toastConfig({
        success: 'User updated!',
        error: 'Error updating user!',
        pending: 'Updating user...',
      }),
    );
  }, [newImage, newProfile, setUserData, user]);

  return (
    <motion.div className='flex flex-col mt-1 w-full h-full'>
      <div className='flex justify-between items-center px-1 pb-2 border-b-2 border-solid border-dark-cl'>
        <Edit size='38' fillColor='#433650' />
        <h1 className='text-xl mt-2'>Edit Profile</h1>
        <motion.div className='hover:cursor-pointer' onClick={() => props.setShowEditProfile(false)}>
          <Close className='fill-dark-cl hover:fill-red-cl  h-10 w=10' />
        </motion.div>
      </div>

      <div className='flex justify-center items-center pt-4 pb-2 border-b-2 border-solid border-dark-cl'>
        <motion.div className='relative'>
          <img className='object-cover w-40 h-40 rounded-full border-solid border-4 border-dark-cl' src={newProfile.avatar || user.avatar} alt='pfp' />
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
          <div className='text-xl w-10 text-center'>Name:</div>
          <input
            className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64'
            type='text'
            placeholder={user.displayName}
            onChange={(e) =>
              setNewProfile({
                ...newProfile,
                displayName: e.target.value,
              })
            }
          />
        </div>
        <div className='flex  justify-center items-center gap-8 py-4'>
          <div className='text-xl w-10 text-center'>Bio:</div>
          <input
            type='text'
            className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64 overflow-hidden'
            placeholder={user.bio}
            onChange={(e) =>
              setNewProfile({
                ...newProfile,
                bio: e.target.value,
              })
            }
          />
        </div>
      </div>
      <button className='bg-dark-cl text-white sm:text-2xl rounded-b-lg w-full h-10  ml-auto mr-auto hover:bg-blue-cl transition-all' onClick={handleOnSave}>
        Save
      </button>
    </motion.div>
  );
}

export default EditProfile;
