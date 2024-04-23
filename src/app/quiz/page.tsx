"use client";

import { Button } from "@/components/ui/button";
import { useQuestions } from "@/services/use-questions";
import { CircleAlertIcon, CircleEllipsisIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Quiz from "./quiz";
import { Suspense } from "react";

export default function QuizPage() {
  const params = useSearchParams();

  const { data, isError, isLoading } = useQuestions({
    amount: Number(params.get("amount")),
    category: Number(params.get("category")),
    difficulty: params.get("difficulty") as "easy" | "medium" | "difficult",
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-slate-50/95">
        <CircleEllipsisIcon className="text-blue-500/95 h-10 w-10 animate-spin" />
        <p className="text-blue-500/95">
          Loading questions for round {params.get("round")}
        </p>
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

  return (
    <Suspense>
      <Quiz questions={data} />;
    </Suspense>
  );
}
