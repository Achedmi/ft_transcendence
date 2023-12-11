import { useQuery } from 'react-query';
import axios from '../../../utils/axios';
import { useCallback } from 'react';
import { create } from 'zustand';
import { toast } from 'react-toastify';

interface FilteredUsers {
  username: string;
  displayName: string;
  avatar: string;
}

interface FilteredUsersState {
  filteredUsers: FilteredUsers[];
  setFilteredUsers: (filteredUsers: FilteredUsers[]) => void;
  fetchFilteredUsers: (userName: string) => Promise<Array<FilteredUsers>>;
// }

// const usefilteredUsersStore = create<FilteredUsersState>((set) => ({
//   filteredUsers: [],
//   setFilteredUsers: (filteredUsers: FilteredUsers[]) => {
//     set({ filteredUsers });
//   },
//   fetchFilteredUsers: async (userName: string) => {
//     try {
//       const response = await axios.get(`/user/friendsOf/${userName}`);
//       set({ filteredUsers: response.data });
//       return response.data;
//     } catch (error) {
//       console.log(error);
//     }
//   },
// }));

// function SearchedUsersRow({ username, displayName, avatar, id }: { username: string; displayName: string; avatar: string; id: number }) {
//   return (
//     <div>
//       <img src={avatar} alt='avatar' className='w-6 h-6 rounded-full' />
//       <div className='flex flex-col'>
//         <span className='text-sm font-bold text-dark-cl'>{displayName}</span>
//         <span className='text-xs font-medium text-gray-cl'>{username}</span>
//       </div>
//     </div>
//   );
// }

// function SearchFilter() {
//   const filteredUsersStore = usefilteredUsersStore();
//   const userName = 
// }
