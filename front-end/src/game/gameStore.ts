import { create } from 'zustand';

export type Player = {
  socketId: string;
  displayName: string;
  avatar: string;
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
  hit: "1" | "2" | "0";
  scored: boolean;
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
  winner: string;
  setWinner: (winner: string) => void;
  setCounter: (counter: number) => void;
  setMyScore: (myScore: number) => void;
  setOpponentScore: (opponentScore: number) => void;
  setId: (gameId: number) => void;
  updateGame: (gameData: GameData) => void;
  setPlayersData: (player1: Player, player2: Player) => void;
}

const useGameStore: any = create<GameStore>((set) => ({
  id: 0,
  counter: 5,
  myScore: 0,
  opponentScore: 0,
  player1: {
    avatar: '',
    displayName: '',
    socketId: '',
    userId: 0,
    score: 0,
    x: 0,
    y: 720 / 2 - 60,
    width: 20,
    height: 120,
  },
  player2: {
    avatar: '',
    displayName: '',
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
    hit: "0",
    scored: false,
  },
  winner: '',
  setWinner: (winner: string) => set((state) => ({ ...state, winner })),
  setMyScore: (myScore: number) => set((state) => ({ ...state, myScore })),
  setOpponentScore: (opponentScore: number) => set((state) => ({ ...state, opponentScore })),
  setCounter: (counter: number) => set((state) => ({ ...state, counter })),
  setId: (id: number) => set((state) => ({ ...state, id })),
  setPlayersData: (player1, player2) =>
    set((state) => ({
      ...state,
      player1: {
        ...state.player1,
        avatar: player1.avatar,
        displayName: player1.displayName,
      },
      player2: {
        ...state.player2,
        avatar: player2.avatar,
        displayName: player2.displayName,
      },
    })),
  updateGame: (gameData: GameData) =>
    set((state) => ({
      ...state,
      player1: {
        ...state.player1,
        ...gameData.player1,
      },
      player2: {
        ...state.player2,
        ...gameData.player2,
      },
      ball: {
        ...state.ball,
        ...gameData.ball,
      },
    })),
}));

export default useGameStore;
