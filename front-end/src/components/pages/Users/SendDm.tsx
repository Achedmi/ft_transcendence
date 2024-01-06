import { AnimatePresence, motion } from 'framer-motion';
import { Close, MessageIcon, SendIcon } from '../../icons/icons';
import { useCallback, useState } from 'react';
import axiosInstance from '../../../utils/axios';
import useChatStore from '../../../stores/chatStore';

function SendDm({ open, setOpen, id }: { open: boolean; setOpen: any; id: number }) {
  const [message, setMessage] = useState<string>('');
  const chatStore = useChatStore();

  const sendMessage = useCallback(async () => {
    if (message) {
      let buffer = '';
      if (message.length > 34) {
        let words = message.split(' ');
        words.forEach((word) => {
          if (word.length > 34) {
            let newWord = '';
            for (let i = 0; i < word.length; i++) {
              if (i % 34 == 0) {
                newWord += ' ';
              }
              newWord += word[i];
            }
            buffer += newWord + ' ';
          } else {
            buffer += word + ' ';
          }
        });
      } else {
        buffer = message;
      }

      setMessage('');
      const response = await axiosInstance.post('/message/sendDm', {
        message: buffer,
        to: id,
      });
      if (response.data) {
        if (!chatStore.DmsPreview.find((dm) => dm.id == response.data.chatId)) {
          chatStore.getDmsPreview();
        }
      }
    }
  }, [message, id, chatStore.DmsPreview, chatStore.selectedChatId, chatStore, setMessage, setOpen]);

  const close = useCallback(() => {
    setOpen(false);
    setMessage('');
  }, [setOpen, setMessage]);

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
                <MessageIcon className='fill-dark-cl h-10 w-10' />
              </div>
              <div className='h-full   flex justify-center items-center'>
                <span className='text-lg text-dark-cl'>Send DM</span>
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
                sendMessage();
              }}
            >
              <div className=' flex flex-col text-dark-cl w-full'>
                <div className='flex  justify-center items-center gap-8 p-4 w-full '>
                  <div className='input bg-white flex  rounded-xl border-2 border-solid border-dark-cl '>
                    <input
                      className=' px-2 py-1 w-full rounded-xl focus:outline-none'
                      type='text'
                      placeholder={'Start a new message'}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      value={message}
                      autoFocus
                    />
                    <button type='submit'>
                      <SendIcon className='fill-dark-cl w-10 h-10 mt-2 hover:fill-blue-cl' />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SendDm;
