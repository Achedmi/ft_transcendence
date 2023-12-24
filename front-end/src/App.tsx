import ReactDOM from 'react-dom/client';
import Login from './components/pages/login/Login.tsx';
import Layout from './components/Layout.tsx';
import Home from './components/pages/Home.tsx';
import Profile from './components/pages/Profile/Profile.tsx';
import { Play } from './components/pages/Play.tsx';
import VerifyTfa from './components/2fa/VerifyTfa.tsx';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Users from './components/pages/Users.tsx';
import Friends from './components/pages/Profile/Friends.tsx';
import NotFound404 from './components/pages/errorPages/NotFound404.tsx';
import MatchHistory from './components/pages/Profile/MatchHistory.tsx';
import { useEffect } from 'react';
import { useUserStore } from './user/userStore.tsx';
import Chat from './components/pages/chat/Chat.tsx';
import Ranking from './components/pages/Ranking.tsx';
import { AnimatePresence } from 'framer-motion';

const queryClient = new QueryClient();

function App() {
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

  if (isLoading) return null;

  return !isLoggedIn ? (
    <Routes>
      <Route path='login' element={<Login />} />
      <Route path='tfa' element={<VerifyTfa />} />
    </Routes>
  ) : (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='play' element={<Play />} />
        <Route path='ranking' element={<Ranking />} />
        <Route path='chat' element={<Chat />} />
        <Route path='profile' element={<Profile />}>
          <Route index element={<MatchHistory />} />
          <Route path='friends' element={<Friends />} />
        </Route>
        <Route path='user/:username' element={<Users />}>
          <Route index element={<MatchHistory />} />
          <Route path='friends' element={<Friends />} />
        </Route>
        <Route path='login' element={<Navigate to='/' />} />
        <Route path='tfa' element={<Navigate to='/' />} />
      </Route>
      <Route path='*' element={<NotFound404 />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Router>
      <ToastContainer />
        <App />
    </Router>
  </QueryClientProvider>,
  // </React.StrictMode>,
);
