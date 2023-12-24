import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useCallback, useEffect, useState } from 'react';
import { Profile, Home, Game } from './icons/icons';
import { CommandDialog, CommandGroup, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './Command';
import CommandSearchResults, { CommandSearch } from './SearchFilter';
import { useSearchStore } from './SearchFilter';
import io from 'socket.io-client';
import { useUserStore } from '../user/userStore';
import axios from '../utils/axios';
import GameInvitePopup from './GameInvitePopup';

export function CommandDialogDemo() {
  const navigate = useNavigate();
  const searchStore = useSearchStore();

  const handleSelectPlay = useCallback(() => {
    navigate('/play');
    searchStore.setIsOpen(false);
  }, [navigate]);

  const handleSelectProfile = useCallback(() => {
    navigate('/profile');
    searchStore.setIsOpen(false);
  }, [navigate]);

  const handleSelectHome = useCallback(() => {
    navigate('/');
    searchStore.setIsOpen(false);
  }, [navigate]);

  useEffect(() => {
    const handleCmdk = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchStore.setIsOpen(!searchStore.isOpen);
      }
    };

    const handleCmdp = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'escape') {
          e.preventDefault();
          if (searchStore.isOpen) searchStore.setIsOpen(false);
        }
        if (e.key === 'g') {
          e.preventDefault();
          handleSelectPlay();
        }
        if (e.key === 'h') {
          e.preventDefault();
          handleSelectHome();
        }
        if (e.key === 'p') {
          e.preventDefault();
          handleSelectProfile();
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
    <CommandDialog open={searchStore.isOpen} onOpenChange={searchStore.setIsOpen}>
      <CommandSearch />
      <CommandList className='font-bold text-dark-cl bg-[#D9D9D9] overflow-y-scroll scrollbar-thin scrollbar-thumb-dark-cl/70 scrollbar-thumb-rounded-full'>
        <CommandSearchResults />
        <CommandSeparator />
        <CommandGroup heading='Pages'>
          <CommandItem onSelect={handleSelectProfile}>
            <Profile className='mr-2 h-4 w-4' size={16} />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={handleSelectPlay}>
            <Game className='mr-2 h-4 w-4' size={16} />
            <span>Game</span>
            <CommandShortcut>⌘G</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={handleSelectHome}>
            <Home className='mr-2 h-4 w-4' />
            <span>Home</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function PrivateRoutes() {
  const { socket, setSocket } = useUserStore();

  useEffect(() => {
    const gameSocket = io(`http://${import.meta.env.VITE_ADDRESS}:9696/game`, {
      withCredentials: true,
      transports: ['websocket'],
    });

    setSocket({ game: gameSocket });
    return () => {
      if (socket?.game) socket.game.disconnect();
      if (socket?.chat) socket.chat.disconnect();
    };
  }, []);

  return (
    <>
      <div className='flex flex-col p-3 gap-4 h-screen font-Baloo font-bold z-0 '>
        <CommandDialogDemo />
        <NavBar />
        <GameInvitePopup />
        <div className='outlet  h-full w-full min-w-[300px] overflow-y-scroll no-scrollbar'>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default PrivateRoutes;
