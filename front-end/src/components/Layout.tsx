import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useCallback, useEffect, useState } from 'react';
import { Profile, Home, Game, MessageIcon } from './icons/icons';
import { CommandDialog, CommandGroup, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './Command';
import CommandSearchResults, { CommandSearch } from './SearchFilter';
import { useSearchStore } from './SearchFilter';
import io from 'socket.io-client';
import { useUserStore } from '../stores/userStore';
import axios from '../utils/axios';
import GameInvitePopup from './GameInvitePopup';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../game/gameStore';
import { useQuery } from 'react-query';
import useChatStore from '../stores/chatStore';

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

  const handleSelectChat = useCallback(() => {
    navigate('/chat');
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
        if (e.key === 'c') {
          e.preventDefault();
          handleSelectChat();
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
          <CommandItem onSelect={handleSelectChat}>
            <MessageIcon className='mr-2 h-4 w-4' />
            <span>Chat</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function PrivateRoutes() {
  const { socket, setSocket, setAbelToPlay, abelToPlay } = useUserStore();
  const game = useGameStore();
  const navigate = useNavigate();
  const chatStore = useChatStore();
  useEffect(() => {
    const gameSocket = io(`http://${import.meta.env.VITE_ADDRESS}:9696/game`, {
      withCredentials: true,
      transports: ['websocket'],
    });

    const chatSocket = io(`http://${import.meta.env.VITE_ADDRESS}:9696/chat`, {
      withCredentials: true,
      transports: ['websocket'],
    });

    setSocket({ chat: chatSocket, game: gameSocket });

    chatSocket?.on('connect', () => {
      console.log('connected');
    });

    return () => {
      if (socket?.game) socket.game.disconnect();
      if (socket?.chat) socket.chat.disconnect();
    };
  }, []);

  useQuery('DmsPreview', chatStore.getDmsPreview, {
    refetchOnWindowFocus: false,
  });
  useQuery('ChannelsPreview', chatStore.getChannelsPreview, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    socket?.chat?.on('message', (data: any) => {
      console.log('new message', data);
      chatStore.pushMessage(data, data.chatId);
      chatStore.updateLastDM(data, data.chatId);
      chatStore.updateLastGroupMessage(data, data.chatId);
    });
    return () => {
      socket?.chat?.off('message');
    };
  }, [socket?.chat, socket, chatStore, chatStore.selectedChatId, chatStore.messages?.get(chatStore.selectedChatId)?.length, chatStore.messages]);

  useEffect(() => {
    socket?.game?.on('gameIsReady', (data: any) => {
      console.log(data);
      game.setId(data.gameId);
      console.log('gameIsReady');
      navigate('/play');
      setAbelToPlay(true);
    });
    console.log('gameIsReady');
    return () => {
      socket?.game?.off('gameIsReady');
    };
  }, [socket?.game, game.id, abelToPlay, socket?.chat]);

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
