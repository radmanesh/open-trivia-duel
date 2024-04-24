"use client";

import Quiz from "./quiz";
import { Button } from "@/components/ui/button";
import { useQuestions } from "@/services/use-questions";
import { CircleAlertIcon, CircleEllipsisIcon } from "lucide-react";
import { useGameContext } from "@/contexts/game-provider";

export default function QuizPage() {
  const { game } = useGameContext();

  const { data, isError, isLoading } = useQuestions({
    amount: Number(game.questionsPerRound),
    category: Number(game.nextRound.categoryId),
    difficulty: game.level,
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-slate-50/95">
        <CircleEllipsisIcon className="text-primary/95 h-10 w-10 animate-spin" />
        <p className="text-primary/95 font-bold">Loading questions</p>
      </main>
    );
  }

  if (isError || data === undefined) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-slate-50/95">
        <CircleAlertIcon className="text-red-500/95 h-10 w-10" />
        <p className="text-red-500/95">
          Failed to get questions for this round
        </p>
        <Button onClick={() => location.reload()}>Try again</Button>
      </main>
    );
  }

  return <Quiz questions={data} />;
}
