import { create } from 'zustand';

export interface GameStore {
  gameId: number;
  counter: number;
  setCounter: (counter: number) => void;
}


export const useGameStore = create<GameStore>((set) => ({
  gameId: 0,
  counter: 5,
  setCounter : (counter: number) => set((state) => ({ ...state, counter })),
}));
