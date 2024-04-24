import { createContext, useContext, useState, ReactNode } from "react";

// --- game context types
type GameProviderProps = {
  children: ReactNode;
};
export type GameLevel = "easy" | "medium" | "hard";
export type GameRound = { id: number; name: string; categoryId: number };

type Game = {
  player: string;
  level: GameLevel;
  answers: Answers;
  duration: number;
  finished: boolean;
  totalRounds: number;
  nextRound: GameRound;
  questionsPerRound: number;
  crossedCategories: number[];
};

type ICreateGame = {
  player: string;
  level: GameLevel;
  totalRounds: number;
  questionsPerRound: number;
};

type Answers = {
  wrong: number;
  correct: number;
  skipped: number;
};

type IGameContext = {
  game: Game;
  resetGame: () => void;
  startGame: ({
    level,
    player,
    totalRounds,
    questionsPerRound,
  }: ICreateGame) => void;
  finishGame: () => void;
  getTotalQuestions: () => number;
  setAnswers: (answers: Answers) => void;
  setNextRound: (id: number, previousRoundTime: number) => void;
  setCategoryForNextRound: (category: string, categoryId: number) => void;
};

// --- game context
const GameContext = createContext<IGameContext | undefined>(undefined);

// --- game context hooks
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

// --- game initial state
const initialGameState: Game = {
  player: "",
  duration: 0,
  level: "easy",
  totalRounds: 3,
  finished: false,
  questionsPerRound: 5,
  crossedCategories: [],
  nextRound: { id: 0, name: "", categoryId: 0 },
  answers: { wrong: 0, correct: 0, skipped: 0 },
};

// --- game context provider
export const GameProvider = ({ children }: GameProviderProps) => {
  const [game, setGame] = useState<Game>(initialGameState);

  const startGame = ({
    level,
    player,
    totalRounds,
    questionsPerRound,
  }: ICreateGame) => {
    setGame({
      ...game,
      level,
      player,
      totalRounds,
      questionsPerRound,
      nextRound: { id: 1, name: "", categoryId: 0 },
    });
  };

  const resetGame = () => setGame(initialGameState);

  const finishGame = () => setGame({ ...game, finished: true });

  const getTotalQuestions = () => {
    return game.totalRounds * game.questionsPerRound;
  };

  const setAnswers = (answers: Answers) => setGame({ ...game, answers });

  const setNextRound = (id: number, previousRoundTime: number) =>
    setGame({
      ...game,
      nextRound: { ...game.nextRound, id },
      duration: game.duration + previousRoundTime,
    });

  const setCategoryForNextRound = (category: string, categoryId: number) =>
    setGame({
      ...game,
      crossedCategories: [...game.crossedCategories, categoryId],
      nextRound: { ...game.nextRound, name: category, categoryId },
    });

  return (
    <GameContext.Provider
      value={{
        game,
        resetGame,
        startGame,
        setAnswers,
        finishGame,
        setNextRound,
        getTotalQuestions,
        setCategoryForNextRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
