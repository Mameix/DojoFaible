export interface Candidate {
  id: string;
  name: string;
  isActive: boolean;
  isCurrentPlayer: boolean;
}

export interface GameState {
  currentAmount: number;
  bankAmount: number;
  timeRemaining: number;
  isPlaying: boolean;
  candidates: Candidate[];
  currentLevel: number;
}

export const MONEY_LEVELS = [
  0,
  50,
  100,
  200,
  400,
  1000,
  2000,
  3000,
  4000,
  5000
];