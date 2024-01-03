import { useCallback, useState } from 'react';
import useChatStore from '../../../stores/chatStore';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Close, Edit } from '../../icons/icons';

type updatedGroup = {
  name: string;
  visibility: string;
  image: string;
  password: string;
};

function EditGroup({ open, setOpen }: { open: boolean; setOpen: any }) {
  const chatStore = useChatStore();
  const [newImage, setNewImage] = useState<File | null>(null);

  const [updatedGroup, setUpdatedGroup] = useState<updatedGroup>({
    name: chatStore.chatInfo?.get(chatStore.selectedChatId)?.name || '',
    visibility: chatStore.chatInfo?.get(chatStore.selectedChatId)?.visibility || '',
    image: chatStore.chatInfo?.get(chatStore.selectedChatId)?.image || '',
    password: '',
  });

  //   console.log(updatedGroup);
  const handleEditClick = useCallback(() => {
    const fileInput = document.getElementById('imgInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }, []);

  const handleOnSave = useCallback(async () => {
    const formData = new FormData();
    if (newImage) formData.append('image', newImage);
    if (updatedGroup.name) formData.append('name', updatedGroup.name);
    if (updatedGroup.visibility) formData.append('visibility', updatedGroup.visibility);
    if (updatedGroup.password) formData.append('password', updatedGroup.password);
    toast.promise(
      async () => {
        try {
          const response = await axiosInstance.patch(`/chat/${chatStore.selectedChatId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('response', response);
		  chatStore.updateChatInfo(chatStore.selectedChatId, response.data);
          return response;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      {
        success: 'Group updated!',
        error: 'Error updating group!',
        pending: 'Updating group...',
      },
    );
  }, [newImage, updatedGroup, chatStore.selectedChatId]);

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
                <Edit size='26' fillColor='#433650' />
              </div>
              <div className='h-full   flex justify-center items-center'>
                <span className='text-lg text-dark-cl'>Edit Group</span>
              </div>
              <div className='h-full   flex justify-end items-center'>
                <div
                  onClick={() => {
                    setOpen(false);
                  }}
                  className='button'
                >
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
                  onClick={handleEditClick}
                >
                  <input
                    type='file'
                    className='hidden'
                    id='imgInput'
                    accept='image/*'
                    onChange={(e) => {
                      setNewImage(e.target.files![0]);
                      setUpdatedGroup({
                        ...updatedGroup,
                        image: URL.createObjectURL(e.target.files![0]),
                      });
                    }}
                  />

                  <Edit size='28' fillColor='#ffffff' />
                </motion.div>
                <img
                  src={updatedGroup.image || chatStore.chatInfo?.get(chatStore.selectedChatId)?.image}
                  alt='group icon'
                  className='object-cover aspect-square w-36 f-36 rounded-full mt-4 border-2 border-solid border-dark-cl'
                />
              </div>
              <div className=' flex flex-col text-dark-cl '>
                <div className='flex  justify-center items-center gap-8 py-4 '>
                  <div className='text-xl w-10 text-center'>Name:</div>
                  <input
                    className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64'
                    type='text'
                    placeholder={chatStore.chatInfo?.get(chatStore.selectedChatId)?.name}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setUpdatedGroup({
                        ...updatedGroup,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
                {updatedGroup.visibility === 'PUBLIC' && (
                  <div className='flex  justify-center items-center gap-8 py-4'>
                    <div className='text-xl w-10 text-center'>code:</div>
                    <input
                      type='text'
                      className='border-solid border-2 border-dark-cl rounded-lg px-2 py-1 w-64 overflow-hidden'
                      placeholder={'#459aBc'}
                      onChange={(e) => {
                        setUpdatedGroup({
                          ...updatedGroup,
                          password: e.target.value,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                className='border-t-2 border-solid border-dark-cl  bg-dark-cl text-white sm:text-2xl rounded-b-lg w-full h-10  ml-auto mr-auto hover:bg-blue-cl transition-all'
                type='submit'
              >
                Save
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditGroup;
