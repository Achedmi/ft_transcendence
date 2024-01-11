import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../../stores/searchStore';
import { useUserStore } from '../../../stores/userStore';
import useGameStore from '../../../game/gameStore';
import { useCallback, useEffect } from 'react';
import { Command, CommandDialog, CommandGroup, CommandItem, CommandList, CommandSeparator, CommandShortcut } from './config/Command';
import CommandSearchResults, { CommandSearch } from './SearchFilter';
import { Game, Home, MessageIcon, Profile } from '../../icons/icons';

export function GlobalCommandDialog() {
  const navigate = useNavigate();
  const searchStore = useSearchStore();
  const { socket, user, setUserData, setAbelToPlay, gameEnded, setGameEnded } = useUserStore();
  const game = useGameStore();

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
        if (e.key === 'm') {
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

  useEffect(() => {
    socket?.game?.on('updateStatus', (status: string) => {
      setUserData({ status });
    });

    socket?.game?.on('countdown', (count: number) => {
      game.setCounter(count);
    });

    socket?.game?.on('gameEnded', (data: any) => {
      if (data?.winner) game.setWinner(data.winner);
      else game.setWinner('');
      setGameEnded(true);
      setAbelToPlay(false);
      game.setCounter(5);
    });

    return () => {
      socket?.game?.off('updateStatus');
      socket?.game?.off('countdown');
      socket?.game?.off('gameEnded');
    };
  }, [user.status, game.counter, socket?.game, game.myScore, game.opponentScore, gameEnded, game.winner, game.counter]);

  return (
    <CommandDialog open={searchStore.isOpen} onOpenChange={searchStore.setIsOpen}>
      <Command
        loop
        filter={(value, search) => {
          if (value.includes(search)) return 1;
          return 0;
        }}
      >
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
              <CommandShortcut>⌘M</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
