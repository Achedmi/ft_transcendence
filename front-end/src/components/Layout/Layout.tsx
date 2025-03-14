import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import io from 'socket.io-client';
import { useUserStore } from '../../stores/userStore';
import GameInvitePopup from './GameInvitePopup';
import useGameStore from '../../game/gameStore';
import { useQuery } from 'react-query';
import useChatStore, { ChatType } from '../../stores/chatStore';
import NavBar from '../NavBar';
import { GlobalCommandDialog } from './Dialogue/GlobalSearchDialogue';
import PromptPassword from './Dialogue/PromptPassword';
import { AnimatePresence } from 'framer-motion';

function PrivateRoutes() {
  const { socket, setSocket, setAbelToPlay, user } = useUserStore();
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
    });

    return () => {
      if (socket?.game) socket.game.disconnect();
      if (socket?.chat) socket.chat.disconnect();
    };
  }, []);

  useQuery('DmsPreview', chatStore.getDmsPreview, {
    refetchOnWindowFocus: false,
  });
  const { refetch } = useQuery('ChannelsPreview', chatStore.getChannelsPreview, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    socket?.chat?.on('message', (data: any) => {

      if (!chatStore.DmsPreview.find((chat: any) => chat.id == data.chatId)) {
        chatStore.getDmsPreview();
        if (chatStore.selectedChatId != data.chatId) {
          chatStore.addNewUnreadMessage(data.chatId, ChatType.CHANNEL);
        }
      }
      if (!chatStore.ChannelsPreview.find((chat: any) => chat.id == data.chatId)) {
        chatStore.getChannelsPreview();
        if (chatStore.selectedChatId != data.chatId) {
          chatStore.addNewUnreadMessage(data.chatId, ChatType.DM);
        }
      }
      chatStore.pushMessage(data, data.chatId);
      chatStore.updateLastDM(data, data.chatId);
      chatStore.updateLastGroupMessage(data, data.chatId);
    });
    socket?.chat?.on('chatUpdated', (chatInfo: any) => {
      refetch();
      chatStore.updateChatInfo(chatInfo.chatId, chatInfo.infos);
      if (!chatStore.chatInfo?.get(chatStore.selectedChatId)?.members?.find((member) => member.id == user.id)) {
        chatStore.setSelectedChatId(-1);
      }
    });

    return () => {
      socket?.chat?.off('message');
      socket?.chat?.off('chatUpdated');
    };
  }, [
    socket?.chat,
    socket,
    chatStore,
    chatStore.selectedChatId,
    chatStore.messages?.get(chatStore.selectedChatId)?.length,
    chatStore.messages,
    chatStore.DmsPreview,
    chatStore.ChannelsPreview,
    refetch,
  ]);

  useEffect(() => {
    socket?.game?.on('gameIsReady', (data: any) => {
      game.setId(data.gameId);
      game.setPlayersData(data.player1, data.player2);
      navigate('/play');
      setAbelToPlay(true);
    });
    return () => {
      socket?.game?.off('gameIsReady');
    };
  }, [socket?.game, game, navigate, setAbelToPlay]);

  return (
    <>
      <div className='flex flex-col p-3 gap-4 h-screen font-Baloo font-bold z-0 '>
        <GlobalCommandDialog />
        <AnimatePresence>{chatStore.promptPasswordOpen && <PromptPassword setOpen={chatStore.setPromptPasswordOpen} />}</AnimatePresence>

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
