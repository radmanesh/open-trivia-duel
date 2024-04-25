"use client";

// --- 3rd party deps
import { useRouter } from "next/navigation";

// --- internal deps
import { CategoryForm } from "./category";
import { Loader } from "@/components/loader";
import { PageError } from "@/components/error";
import { useCategories } from "@/services/use-categories";
import { useGameContext } from "@/contexts/game-provider";

export default function CategoryPage() {
  const router = useRouter();

  // --- current game state
  const { game } = useGameContext();

  // --- fetch game categories
  const { data: gameCategories, isError, isLoading } = useCategories();

  // --- handle loading state
  if (isLoading) {
    return <Loader message="Loading question categories..." />;
  }

  // --- handle error or no returned data state
  if (isError || !gameCategories || gameCategories === undefined) {
    return (
      <PageError
        onClickTryAgain={() => router.push("/")}
        errorMessage="Failed to load question categories!"
      />
    );
  }

  // --- prepare categories, append random and remove previously selected ones
  const allCategories = [...gameCategories, { id: 8, name: "Random" }]
    .filter((category) => !game.crossedCategories.includes(category.id))
    .sort((catA, catB) => catA.name.localeCompare(catB.name));

  return <CategoryForm categories={allCategories} />;
}
