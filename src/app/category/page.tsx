"use client";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/game-provider";
import { useCategories } from "@/services/use-categories";
import { CircleEllipsisIcon, CircleAlertIcon } from "lucide-react";
import { CategoryForm } from "./category";

export default function CategoryPage() {
  const { gameDetails } = useGameContext();
  const { data, isError, isLoading } = useCategories();

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-slate-50/95">
        <CircleEllipsisIcon className="text-blue-500/95 h-10 w-10 animate-spin" />
        <p className="text-blue-500/95">
          Loading questions for round {gameDetails.currentRound}
        </p>
      </main>
    );
  }

  if (isError || !data) {
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

  return <CategoryForm round={gameDetails.currentRound} categories={data} />;
}
