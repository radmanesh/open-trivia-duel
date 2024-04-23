import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Round = {
  number: number;
  category: string;
  score: number;
  timeTaken: number;
};

type GameDetails = {
  rounds: Round[];
  totalRounds: number;
  playerName: string;
  totalScore: number;
  currentRound: number;
  numberOfRounds: number;
  totalTimeTaken: number;
  wrongQuestions: number;
  skippedQuestions: number;
  correctQuestions: number;
  questionsPerRound: number;
  categoriesSelected: Array<number>;
  difficulty: "easy" | "medium" | "difficult";
};

type GameContextType = {
  gameDetails: GameDetails;
  setPlayerName: (name: string) => void;
  setCurrentRound: (round: number) => void;
  updateRoundDetails: (round: Partial<Round>) => void;
  addToSelectedCategories: (categoryId: number) => void;
  updateGameDetails: (details: Partial<GameDetails>) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

type GameProviderProps = {
  children: ReactNode;
};

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameDetails, setGameDetails] = useState<GameDetails>({
    playerName: "",
    rounds: [],
    totalScore: 0,
    wrongQuestions: 0,
    skippedQuestions: 0,
    correctQuestions: 0,
    totalTimeTaken: 0,
    numberOfRounds: 0,
    questionsPerRound: 0,
    currentRound: 0,
    totalRounds: 0,
    difficulty: "easy",
    categoriesSelected: [],
  });

  const setPlayerName = (name: string) => {
    setGameDetails((prevDetails) => ({ ...prevDetails, playerName: name }));
  };

  const setCurrentRound = (round: number) => {
    setGameDetails((prevDetails) => ({ ...prevDetails, currentRound: round }));
  };

  const updateRoundDetails = (round: Partial<Round>) => {
    setGameDetails((prevDetails) => {
      const updatedRounds = [...prevDetails.rounds];
      updatedRounds[prevDetails.currentRound - 1] = {
        ...updatedRounds[prevDetails.currentRound - 1],
        ...round,
      };
      return { ...prevDetails, rounds: updatedRounds };
    });
  };

  const updateGameDetails = (details: Partial<GameDetails>) => {
    setGameDetails((prevDetails) => ({ ...prevDetails, ...details }));
  };

  const addToSelectedCategories = (categoryId: number) => {
    setGameDetails((prev) => ({
      ...prev,
      categoriesSelected: [...prev.categoriesSelected, categoryId],
    }));
  };

  return (
    <GameContext.Provider
      value={{
        gameDetails,
        setPlayerName,
        setCurrentRound,
        updateRoundDetails,
        updateGameDetails,
        addToSelectedCategories,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
