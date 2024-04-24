import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useReducer,
} from "react";

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
  questionsTimeMatrix: number[];
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
  addQuestionTime: (time: number) => void;
  setAnswers: (answers: Answers) => void;
  setNextRound: (payload: { id: number; previousRoundTime: number }) => void;
  setCategoryForNextRound: (payload: {
    category: string;
    categoryId: number;
  }) => void;
};

// --- game reducer action types
type Action =
  | { type: "START_GAME"; payload: ICreateGame }
  | { type: "RESET_GAME" }
  | { type: "FINISH_GAME" }
  | { type: "SET_ANSWERS"; payload: Answers }
  | {
      type: "SET_NEXT_ROUND";
      payload: { id: number; previousRoundTime: number };
    }
  | {
      type: "SET_CATEGORY_FOR_NEXT_ROUND";
      payload: { category: string; categoryId: number };
    }
  | {
      type: "ADD_QUESTION_TIME";
      payload: number;
    };

// --- game reducer function
const gameReducer = (state: Game, action: Action): Game => {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        level: action.payload.level,
        player: action.payload.player,
        totalRounds: action.payload.totalRounds,
        questionsPerRound: action.payload.questionsPerRound,
        nextRound: { id: 1, name: "", categoryId: 0 },
      };
    case "RESET_GAME":
      return initialGameState;
    case "FINISH_GAME":
      return { ...state, finished: true };
    case "SET_ANSWERS":
      return { ...state, answers: action.payload };
    case "SET_NEXT_ROUND":
      return {
        ...state,
        nextRound: { ...state.nextRound, id: action.payload.id },
        duration: state.duration + action.payload.previousRoundTime,
      };
    case "ADD_QUESTION_TIME":
      return {
        ...state,
        questionsTimeMatrix: [...state.questionsTimeMatrix, action.payload],
      };
    case "SET_CATEGORY_FOR_NEXT_ROUND":
      return {
        ...state,
        crossedCategories: [
          ...state.crossedCategories,
          action.payload.categoryId,
        ],
        nextRound: {
          ...state.nextRound,
          name: action.payload.category,
          categoryId: action.payload.categoryId,
        },
      };
    default:
      return state;
  }
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
  questionsTimeMatrix: [],
  nextRound: { id: 0, name: "", categoryId: 0 },
  answers: { wrong: 0, correct: 0, skipped: 0 },
};

// --- game context provider
export const GameProvider = ({ children }: GameProviderProps) => {
  const [game, dispatch] = useReducer(gameReducer, initialGameState);

  const startGame = (payload: ICreateGame) => {
    dispatch({ type: "START_GAME", payload });
  };

  const resetGame = () => dispatch({ type: "RESET_GAME" });

  const finishGame = () => dispatch({ type: "FINISH_GAME" });

  const getTotalQuestions = () => {
    return game.totalRounds * game.questionsPerRound;
  };

  const setAnswers = (payload: Answers) =>
    dispatch({ type: "SET_ANSWERS", payload });

  const setNextRound = (payload: { id: number; previousRoundTime: number }) =>
    dispatch({ payload, type: "SET_NEXT_ROUND" });

  const setCategoryForNextRound = (payload: {
    category: string;
    categoryId: number;
  }) => dispatch({ payload, type: "SET_CATEGORY_FOR_NEXT_ROUND" });

  const addQuestionTime = (payload: number) =>
    dispatch({ payload, type: "ADD_QUESTION_TIME" });

  return (
    <GameContext.Provider
      value={{
        game,
        resetGame,
        startGame,
        setAnswers,
        finishGame,
        setNextRound,
        addQuestionTime,
        getTotalQuestions,
        setCategoryForNextRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
