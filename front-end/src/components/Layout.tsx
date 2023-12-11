import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useUserStore } from '../user/userStore';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { Profile, Home, Game } from './icons/icons';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './Command';
import SearchFilter from './SearchFilter';
export function CommandDialogDemo() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleCmdk = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const handleCmdp = (e: KeyboardEvent) => {
      if (open && (e.metaKey || e.ctrlKey)) {
        if (e.key === 'escape') {
          e.preventDefault();
          setOpen(false);
        }
        if (e.key === 'g') {
          e.preventDefault();
          navigate('/play');
          setOpen(false);
        }
        if (e.key === 'h') {
          e.preventDefault();
          navigate('/');
          setOpen(false);
        }
        if (e.key === 'p') {
          e.preventDefault();
          navigate('/profile');
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleCmdk);
    document.addEventListener('keydown', handleCmdp);
    return () => {
      document.removeEventListener('keydown', handleCmdk);
      document.removeEventListener('keydown', handleCmdp);
    };
  }, [open]);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Search...' className=''  />
      <CommandList
        className=' font-bold text-dark-cl bg-[#D9D9D9] overflow-y-scroll scrollbar-thin scrollbar-thumb-dark-cl/70 scrollbar-thumb-rounded-full 
      '
      >
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Users' className=''>
          <SearchFilter />
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading='Pages'>
          <CommandItem>
            <Profile className='mr-2 h-4 w-4' size={16} />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Game className='mr-2 h-4 w-4' size={16} />
            <span>Game</span>
            <CommandShortcut>⌘G</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Home className='mr-2 h-4 w-4' />
            <span>Home</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

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
          <CommandDialogDemo />
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
