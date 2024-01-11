import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import useChatStore from '../../../stores/chatStore';
import { Close, LockIcon } from '../../icons/icons';
import toastConfig from '../../../utils/toastConf';
import { toast } from 'react-toastify';
import axiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';

function PromptPassword({ setOpen }: { setOpen: any }) {
  const navigate = useNavigate();
  const inputElement = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);
  const [password, setPassword] = useState('');
  const chatStore = useChatStore();

  const submitPassword = async () => {
    try {
      
      if (password && chatStore.channelToJoinId) {
        const response = await axiosInstance.post(`chat/joinChannel`, { channelId: chatStore.channelToJoinId, password });
        toast.promise(
          async () => {
          try {
            chatStore.getChannelsPreview();
            chatStore.setSelectedChatId(response.data.id);
            chatStore.setPromptPasswordOpen(false);
            navigate(`/chat`);
            
            return response;
          } catch (error) {
            throw error;
          }
        },
        toastConfig({
          success: 'Joined!',
          error: 'Error Joining',
          pending: 'Joining...',
        }),
        );
      }
    } catch (error) {
      
    }
    };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className='h-full  w-full   absolute backdrop-blur-sm z-40  flex justify-center items-center'
    >
      <div className='w-[400px] bg-gray-cl rounded-xl border-2 border-solid border-dak-cl flex flex-col '>
        <div className='header flex justify-between items-center w-full h-12 gap-2 border-b-2 border-solid border-dark-cl'>
          <div className='h-full   flex items-center'>
            <LockIcon className='fill-dark-cl h-10 w-10' />
          </div>
          <div className='h-full   flex justify-center items-center'>
            <span className='text-lg text-dark-cl'>Join Protected Channel</span>
          </div>
          <div className='h-full   flex justify-end items-center'>
            <div
              onClick={() => {
                setPassword('');
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
            submitPassword();
            setPassword('');
          }}
        >
          <div className=' flex flex-col text-dark-cl w-full'>
            <div className='flex  justify-center items-center gap-8 p-4 w-full '>
              <div className='input bg-white flex  rounded-xl border-2 border-solid border-dark-cl '>
                <input
                  ref={inputElement}
                  className=' px-2 py-1 w-full rounded-xl focus:outline-none'
                  type='password'
                  placeholder={'Enter password...'}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default PromptPassword;
