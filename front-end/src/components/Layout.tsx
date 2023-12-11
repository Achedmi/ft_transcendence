import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { useUserStore } from '../user/userStore';
import { useQuery } from 'react-query';
import { useEffect } from 'react';

function Layout() {
  const location = useLocation();
  const userStore = useUserStore();

  const {
    data: isLoggedIn,
    refetch,
    isLoading,
  } = useQuery('profile', userStore.fetchUserProfile, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [location.pathname]);

  return (
    <>
      {!isLoading && isLoggedIn && (
        <div className='flex flex-col p-3 gap-4 h-screen font-Baloo font-bold z-0 '>
          <NavBar />
          <div className='outlet  h-full w-full min-w-[300px] overflow-y-scroll no-scrollbar'>
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export default Layout;
