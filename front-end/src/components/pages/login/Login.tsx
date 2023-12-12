import LoginForm from './LoginForm';
import Drawing from '../../../assets/art.svg?react';
import { useUserStore } from '../../../user/userStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';

function Login() {
  const { fetchUserProfile } = useUserStore();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery('user', fetchUserProfile);

  useEffect(() => {
    if (data) navigate('/');
  }, [data]);

  return (
    <>
      {!isLoading && (
        <div className='flex flex-start bg-light-gray-cl h-screen justify-center items-center gap-9 '>
          <LoginForm />
          <Drawing className='min-h-screen hidden lg:block ' />
        </div>
      )}
    </>
  );
}

export default Login;
