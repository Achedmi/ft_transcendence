import { AnimatePresence, motion } from 'framer-motion';
import useChatStore from '../../../stores/chatStore';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axios';
import { Close, Edit } from '../../icons/icons';

type newGroup = {
  name: string;
  visibility: string;
  image: string;
  password: string;
};

const defaultGroupImage = 'https://i.imgur.com/IcOBgKC.png';

function CreateGroup({ open, setOpen }: { open: boolean; setOpen: any }) {
  const chatStore = useChatStore();
  const [newImage, setNewImage] = useState<File | null>(null);

  const [newGroup, setNewGroup] = useState<newGroup>({
    name: '',
    visibility: 'PUBLIC',
    image: defaultGroupImage,
    password: '',
  });

  const uploadImage = useCallback(() => {
    const fileInput = document.getElementById('imgInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  const handleOnSave = useCallback(async () => {
    console.log('newGroup', newGroup);
    console.log('newImage', newImage);
    const formData = new FormData();
    if (newImage) formData.append('image', newImage);
    if (newGroup.name) formData.append('name', newGroup.name);
    if (newGroup.visibility) formData.append('visibility', newGroup.visibility);
    if (newGroup.password) formData.append('password', newGroup.password);
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.post(`chat/create`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('response', response);
          chatStore.getChannelsPreview();
          return response;
        } catch (error) {
          setNewGroup({ ...newGroup, image: defaultGroupImage });
          setNewImage(null);
          throw error;
        }
      },
      {
        success: 'Group created!',
        error: 'Error creating group!',
        pending: 'Creating group...',
      },
    );
  }, [newImage, newGroup, chatStore.selectedChatId]);

  const close = useCallback(() => {
    setOpen(false);
    setNewGroup({
      name: '',
      visibility: 'PUBLIC',
      image: defaultGroupImage,
      password: '',
    });
  }, [setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className='h-full  w-full   absolute backdrop-blur-sm z-40  flex justify-center items-center'
        >
          <div className='w-[400px] bg-gray-cl rounded-xl border-2 border-solid border-dak-cl flex flex-col '>
            <div className='header flex justify-between items-center w-full h-12 gap-2 border-b-2 border-solid border-dark-cl'>
              <div className='h-full   flex items-center'>
                <Edit size='35' fillColor='#433650' />
              </div>
              <div className='h-full   flex justify-center items-center'>
                <span className='text-lg text-dark-cl'>Create Group</span>
              </div>
              <div className='h-full   flex justify-end items-center'>
                <div onClick={close} className='button'>
                  <Close className='h-9 w-9 fill-dark-cl hover:fill-red-cl cursor-pointer mr-1' />
                </div>
              </div>
            </div>
            <form
              className='FORM h-full w-full flex flex-col items-center '
              onSubmit={(e) => {
                e.preventDefault();
                handleOnSave();
              }}
            >
              <div className='picture relative'>
                <motion.div
                  className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-gray-800 flex  items-center justify-center bg-opacity-75
		  hover:cursor-pointer hover:bg-opacity-100 hover:h-12 hover:w-12 transition-all'
                  onClick={uploadImage}
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgInput'
                    accept='image/*'
                    onChange={(e) => {
                      setNewImage(e.target.files![0]);
                      setNewGroup({
                        ...newGroup,
                        image: URL.createObjectURL(e.target.files![0]),
                      });
                    }}
                  />

                  <Edit size='28' fillColor='#ffffff' />
                </motion.div>
                <img src={newGroup.image} alt='group icon' className='object-cover aspect-square w-36 f-36 rounded-full mt-4 border-2 border-solid border-dark-cl' />
              </div>
              <div className=' flex flex-col text-dark-cl '>
                <div className='flex  justify-center items-center gap-8 pt-4 '>
                  <div className='text-md w-10 text-center'>Name:</div>
                  <input
                    className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64'
                    type='text'
                    placeholder={'Group Name'}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setNewGroup({
                        ...newGroup,
                        name: e.target.value,
                      });
                    }}
                    value={newGroup.name}
                    required
                  />
                </div>

                <div className='flex  justify-center items-center gap-8 py-4 '>
                  <div className='text-md w-10 text-center'>Visibility:</div>
                  <div className=' h-10 py-1 w-64 flex justify-around items-center gap-2 '>
                    <div
                      className={` h-full w-full rounded-lg  text-sm flex justify-center items-center   cursor-pointer
                       ${newGroup.visibility == 'PUBLIC' ? 'bg-dark-cl text-white' : 'hover:bg-dark-cl/25'}`}
                      onClick={() => {
                        setNewGroup({
                          ...newGroup,
                          visibility: 'PUBLIC',
                        });
                      }}
                    >
                      Public
                    </div>
                    <div
                      className={` h-full w-full rounded-lg  text-sm flex justify-center items-center   cursor-pointer 
					   ${newGroup.visibility == 'PRIVATE' ? 'bg-dark-cl text-white' : 'hover:bg-dark-cl/25'}`}
                      onClick={() => {
                        setNewGroup({
                          ...newGroup,
                          visibility: 'PRIVATE',
                        });
                      }}
                    >
                      Private
                    </div>
                    <div
                      className={` h-full w-full rounded-lg  text-sm flex justify-center items-center   cursor-pointer
					   ${newGroup.visibility == 'PROTECTED' ? 'bg-dark-cl text-white' : 'hover:bg-dark-cl/25'}`}
                      onClick={() => {
                        setNewGroup({
                          ...newGroup,
                          visibility: 'PROTECTED',
                        });
                      }}
                    >
                      Protected
                    </div>
                  </div>
                </div>

                {newGroup.visibility == 'PROTECTED' && (
                  <div className='flex  justify-center items-center gap-8 pb-4'>
                    <div className='text-md w-10 text-center'>code:</div>
                    <input
                      type='text'
                      className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64 overflow-hidden'
                      placeholder={'#459aBc'}
                      onChange={(e) => {
                        setNewGroup({
                          ...newGroup,
                          password: e.target.value,
                        });
                      }}
                      value={newGroup.password}
                      required
                    />
                  </div>
                )}
              </div>
              <button
                className='border-t-2 border-solid border-dark-cl  bg-dark-cl text-white sm:text-2xl rounded-b-lg w-full h-10  ml-auto mr-auto hover:bg-blue-cl transition-all'
                type='submit'
              >
                Create
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateGroup;
