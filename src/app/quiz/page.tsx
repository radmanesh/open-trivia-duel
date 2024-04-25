"use client";

// --- 3rd party deps
import { useRouter } from "next/navigation";

// --- internal deps
import { Quiz } from "./quiz";
import { Loader } from "@/components/loader";
import { PageError } from "@/components/error";
import { useQuestions } from "@/services/use-questions";
import { useGameContext } from "@/contexts/game-provider";

export default function QuizPage() {
  const router = useRouter();

  // --- current game state
  const { game } = useGameContext();

  // --- fetch questions for the selected category and level
  const {
    isError,
    isLoading,
    data: categoryQuestions,
  } = useQuestions({
    amount: Number(game.questionsPerRound),
    category: Number(game.nextRound.categoryId),
    difficulty: game.level,
  });

  // --- handle loading state
  if (isLoading) {
    return <Loader message="Loading questions..." />;
  }

  // --- handle error or no returned data state
  if (isError || !categoryQuestions) {
    return (
      <PageError
        onClickTryAgain={() => router.push("/")}
        errorMessage="Failed to load questions for this round!"
      />
    );
  }

  // --- render questions to the user
  return <Quiz questions={categoryQuestions} />;
}
