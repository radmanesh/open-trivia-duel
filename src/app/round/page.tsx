"use client";

import { CategoryForm } from "./category";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/game-provider";
import { useCategories } from "@/services/use-categories";

import { CircleEllipsisIcon, CircleAlertIcon } from "lucide-react";

export default function CategoryPage() {
  // get game state from game context
  const { game } = useGameContext();

  // get available game categories
  const { data: gameCategories, isError, isLoading } = useCategories();

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-slate-50/95">
        <CircleEllipsisIcon className="text-primary/95 h-10 w-10 animate-spin" />
        <p className="text-primary/95 font-bold">Loading categories</p>
      </main>
    );
  }

  if (isError || !gameCategories) {
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

  // prepare all categories
  const allCategories = [...gameCategories, { id: 8, name: "Random" }]
    .filter((category) => !game.crossedCategories.includes(category.id))
    .sort((catA, catB) => catA.name.localeCompare(catB.name));

  return <CategoryForm categories={allCategories} />;
}
