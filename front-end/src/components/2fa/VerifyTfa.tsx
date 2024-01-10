import React, { useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { Error } from '../icons/icons';

function VerifyTfa() {
  const codeInputRef = useRef<HTMLInputElement>(null);

  const handleVerify: React.FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();
      const code = codeInputRef.current?.value;
      if (!code || code.length !== 6) {
        toast.error('invalid code. must be 6 digits', {
          className: 'toast-error',
          icon: Error,
          progressClassName: 'Toastify__progress-bar-error',
        });
        return;
      }
      try {
        await axios.post('/auth/verifyTFAcode', { TFAcode: code });
        window.location.replace(`http://${import.meta.env.VITE_ADDRESS}:6969/`);
      } catch (error) {
        toast.error('invalid code', {
          className: 'toast-error',
          icon: Error,
          progressClassName: 'Toastify__progress-bar-error',
        });
      }
    },
    [codeInputRef],
  );

  const handleNumberInput: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    if (!e.key.match(/[0-9]/) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') {
      e.preventDefault();
    }
  }, []);

  return (
    <div className='bg-white w-screen h-screen flex justify-center items-center font-bold text-dark-cl font-Baloo'>
      <div className='border-4 rounded-xl border-solid border-dark-cl h-72 w-[30rem] bg-[#D9D9D9] flex flex-col p-6 '>
        <form onSubmit={handleVerify} className='flex flex-col h-full justify-evenly'>
          <p className='text-5xl font-bold'>Verify 2FA</p>
          <p className='text-xl opacity-75'>Enter the code from your authenticator app</p>
          <input
            ref={codeInputRef}
            className='border-2 border-solid border-dark-cl rounded-md p-2'
            type='text'
            maxLength={6}
            placeholder='XXXXXX'
            onKeyDown={handleNumberInput}
          ></input>
          <button className='bg-blue-cl border-2 border-solid border-dark-cl  text-white rounded-md h-10 text-2xl' type='submit'>
            verify
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyTfa;
