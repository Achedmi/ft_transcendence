import { motion } from 'framer-motion';
import axiosInstance from '../../../utils/axios';
import { useQuery } from 'react-query';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Row({ match }: any) {
  const [ongoing] = useState(match.status == 'ongoing');
  const navigate = useNavigate();

  const visitPlayer1Profile = useCallback(() => {
    navigate(`/user/${match.player1.username}`);
  }, []);

  const visitPlayer2Profile = useCallback(() => {
    navigate(`/user/${match.player2.username}`);
  }, []);
  return (
    <motion.div className={'row  p-2  w-full border-b-4 border-solid border-dark-cl group hover:bg-dark-cl'}>
      <div className='flex justify-between items-center w-full group-hover:text-white'>
        <div className='one w-[33%] flex flex-row flex-start gap-2 items-center cursor-pointer' onClick={visitPlayer1Profile}>
          <img
            className={
              'border-4 border-solid h-10 w-10 rounded-full aspect-square object-cover ' +
              (ongoing ? 'border-dark-cl' : match.winnerPlayer?.username == match.player1.username ? 'border-blue-cl' : 'border-red-cl')
            }
            src={match.player1.avatar}
          />
          <div
            className='player1
          hidden
          xs:flex
          text-lg text-dark-cl flex-col justify-start group-hover:text-white'
          >
            <span>{match.player1.displayName}</span>
            <span className='text-xs opacity-70 '>{`@${match.player1.username}`}</span>
          </div>
        </div>
        <div className='two w-[33%] text-2xl flex justify-center group-hover:text-white'>{ongoing ? 'Ongoing' : `${match.player1Score} | ${match.player2Score}`}</div>
        <div className='three  w-[33%] flex justify-end group-hover:text-white cursor-pointer' onClick={visitPlayer2Profile}>
          <div className='flex flex-row gap-2 items-center group-hover:text-white'>
            <div
              className='player2 
            hidden
            xs:flex
            text-lg text-dark-cl flex-col justify-start group-hover:text-white'
            >
              <span>{match.player2.displayName}</span>
              <span className='text-xs opacity-70 '>{`@${match.player2.username}`}</span>
            </div>
            <img
              className={
                'border-4 border-solid h-10 w-10 rounded-full aspect-square object-cover ' +
                (ongoing ? 'border-dark-cl' : match.winnerPlayer.username == match.player2.username ? 'border-blue-cl' : 'border-red-cl')
              }
              src={match.player2.avatar}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function () {
  const { data, isLoading } = useQuery('matchHistory', async () => {
    return await axiosInstance.get('/user/games').then((res) => res.data);
  });

  useEffect(() => {
    if (!isLoading) console.log(data);
  }, []);

  if (isLoading) {
    return <div className='w-full h-[85%]  flex items-center justify-center  '>Loading...</div>;
  }

  return (
    <div className='flex flex-col items-center  h-full w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-[rgba(67,54,80,0.75)] scrollbar-thumb-rounded-full hover:scrollbar-thumb-dark-cl'>
      {data.length == 0 ? (
        <div className='w-full h-[85%]  flex items-center justify-center  '>
          <div className=' text-dark-cl'>No matches yet</div>
        </div>
      ) : (
        <div className='flex flex-col items-center  w-full h-full '>
          {data.map((game: any) => {
            return <Row match={game} key={game.id} />;
          })}
        </div>
      )}
    </div>
  );
}
