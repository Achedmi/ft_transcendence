import { create } from 'zustand';

export interface GameStore {
  id: number;
  counter: number;
  myScore: number;
  opponentScore: number;
  setCounter: (counter: number) => void;
  setMyScore: (myScore: number) => void;
  setOpponentScore: (opponentScore: number) => void;
  setId: (gameId: number) => void;
}


export const useGameStore = create<GameStore>((set) => ({
  id: 0,
  counter: 5,
  myScore: 0,
  opponentScore: 0,
  setMyScore : (myScore: number) => set((state) => ({ ...state, myScore })),
  setOpponentScore : (opponentScore: number) => set((state) => ({ ...state, opponentScore })),
  setCounter : (counter: number) => set((state) => ({ ...state, counter })),
  setId : (id: number) => set((state) => ({ ...state, id })),
}));
