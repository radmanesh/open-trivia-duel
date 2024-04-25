import { createContext, useContext, ReactNode, useReducer } from "react";

// --- game context types
interface GroupedScores {
  [round: number]: {
    wrong: number;
    correct: number;
    skipped: number;
  };
}

type GameProviderProps = {
  children: ReactNode;
};
export type GameLevel = "easy" | "medium" | "hard";
export type GameRound = { id: number; name: string; categoryId: number };

type Game = {
  player: string;
  level: GameLevel;
  duration: number;
  finished: boolean;
  totalRounds: number;
  nextRound: GameRound;
  answers: RoundAnswer[];
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

type RoundAnswer = {
  round: number;
  wrong: number;
  correct: number;
  skipped: number;
};

type IGameContext = {
  game: Game;
  getScore: () => { correct: number; wrong: number; skipped: number };
  resetGame: () => void;
  startGame: ({
    level,
    player,
    totalRounds,
    questionsPerRound,
  }: ICreateGame) => void;
  finishGame: () => void;
  getAnswers: () => RoundAnswer[];
  getTotalQuestions: () => number;
  addQuestionTime: (time: number) => void;
  updateScore: (answers: RoundAnswer[]) => void;
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
  | { type: "UPDATE_SCORE"; payload: RoundAnswer[] }
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
        nextRound: { id: 1, name: "", categoryId: 0 },
        questionsPerRound: action.payload.questionsPerRound,
        answers: [
          ...state.answers,
          ...Array.from({ length: action.payload.totalRounds }).map((_, i) => ({
            wrong: 0,
            correct: 0,
            skipped: 0,
            round: i + 1,
          })),
        ],
      };
    case "RESET_GAME":
      return initialGameState;
    case "FINISH_GAME":
      return { ...state, finished: true };
    case "UPDATE_SCORE":
      return { ...state, answers: [...state.answers, ...action.payload] };
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
  answers: [],
  duration: 0,
  level: "easy",
  totalRounds: 3,
  finished: false,
  questionsPerRound: 5,
  crossedCategories: [],
  questionsTimeMatrix: [],
  nextRound: { id: 0, name: "", categoryId: 0 },
};

// --- game context provider
export const GameProvider = ({ children }: GameProviderProps) => {
  const [game, dispatch] = useReducer(gameReducer, initialGameState);

  const getScore = () => ({
    wrong: game.answers.reduce((cur, acc) => cur + acc.wrong, 0),
    skipped: game.answers.reduce((cur, acc) => cur + acc.skipped, 0),
    correct: game.answers.reduce((curr, acc) => curr + acc.correct, 0),
  });

  const startGame = (payload: ICreateGame) => {
    dispatch({ type: "START_GAME", payload });
  };

  const resetGame = () => dispatch({ type: "RESET_GAME" });

  const finishGame = () => dispatch({ type: "FINISH_GAME" });

  const getTotalQuestions = () => {
    return game.totalRounds * game.questionsPerRound;
  };

  const updateScore = (payload: RoundAnswer[]) =>
    dispatch({ type: "UPDATE_SCORE", payload });

  const setNextRound = (payload: { id: number; previousRoundTime: number }) =>
    dispatch({ payload, type: "SET_NEXT_ROUND" });

  const setCategoryForNextRound = (payload: {
    category: string;
    categoryId: number;
  }) => dispatch({ payload, type: "SET_CATEGORY_FOR_NEXT_ROUND" });

  const addQuestionTime = (payload: number) =>
    dispatch({ payload, type: "ADD_QUESTION_TIME" });

  const getAnswers = (): RoundAnswer[] => {
    const groupedScores: GroupedScores = game.answers.reduce(
      (accumulator: GroupedScores, current: RoundAnswer) => {
        const round = current.round;
        if (!accumulator[round]) {
          accumulator[round] = {
            wrong: 0,
            correct: 0,
            skipped: 0,
          };
        }
        accumulator[round].wrong += current.wrong;
        accumulator[round].correct += current.correct;
        accumulator[round].skipped += current.skipped;
        return accumulator;
      },
      {}
    );

    const result = Object.entries(groupedScores).map(
      ([round, { ...rest }]) => ({
        round: parseInt(round),
        ...rest,
      })
    );

    return result;
  };

  return (
    <GameContext.Provider
      value={{
        game,
        getScore,
        resetGame,
        startGame,
        getAnswers,
        finishGame,
        updateScore,
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
