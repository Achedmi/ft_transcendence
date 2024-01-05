import { create } from 'zustand';

export type Player = {
  socketId: string;
  userId: number;
  score: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Ball = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  speed: number;
};

export type GameData = {
  player1: Player;
  player2: Player;
  gameId: number;
  status: string;
  ball: Ball;
};

export interface GameStore {
  id: number;
  counter: number;
  myScore: number;
  opponentScore: number;
  player1: Player;
  player2: Player;
  ball: Ball;
  setCounter: (counter: number) => void;
  setMyScore: (myScore: number) => void;
  setOpponentScore: (opponentScore: number) => void;
  setId: (gameId: number) => void;
  updateGame: (gameData: GameData) => void;
}

const useGameStore: any = create<GameStore>((set) => ({
  id: 0,
  counter: 5,
  myScore: 0,
  opponentScore: 0,
  player1: {
    socketId: '',
    userId: 0,
    score: 0,
    x: 0,
    y: 720 / 2 - 60,
    width: 20,
    height: 120,
  },
  player2: {
    socketId: '',
    userId: 0,
    score: 0,
    x: 1280 - 20,
    y: 720 / 2 - 60,
    width: 20,
    height: 120,
  },
  ball: {
    x: 1280 / 2 - 10,
    y: 720 / 2 - 10,
    dx: 1,
    dy: 1,
    size: 20,
    speed: 5,
  },
  setMyScore: (myScore: number) => set((state) => ({ ...state, myScore })),
  setOpponentScore: (opponentScore: number) => set((state) => ({ ...state, opponentScore })),
  setCounter: (counter: number) => set((state) => ({ ...state, counter })),
  setId: (id: number) => set((state) => ({ ...state, id })),
  updateGame: (gameData: GameData) =>
    set((state) => ({
      ...state,
      player1: gameData.player1,
      player2: gameData.player2,
      ball: gameData.ball,
      id: gameData.gameId,
    })),
}));

export default useGameStore;
