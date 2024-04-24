"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/contexts/game-provider";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ScorePage() {
  const router = useRouter();
  const { game, resetGame, getTotalQuestions } = useGameContext();

  const totalQuestions = useMemo(
    () => game.questionsPerRound * game.totalRounds,
    [game]
  );

  const handleNewGameClick = () => {
    resetGame();
    router.push("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-slate-50/95">
      <div className="grid grid-cols-2 gap-4">
        <Card className="space-y-3">
          <CardHeader>
            <CardTitle>{game.player}</CardTitle>
            <CardDescription>
              You completed the game in{" "}
              <span className="font-bold text-primary">
                {Math.round(game.duration / 60_000)} mins
              </span>
            </CardDescription>
          </CardHeader>
          <Separator orientation="horizontal" />
          <CardContent>
            <p className="text-4xl font-semibold text-center">
              Score: {game.answers.correct}/{totalQuestions}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <Chart
            type="pie"
            width={300}
            height={300}
            series={[
              game.answers.wrong,
              game.answers.correct,
              game.answers.skipped,
            ]}
            options={{
              labels: ["Wrong", "Correct", "Skipped"],
              colors: ["#ef4444", "#22c55e", "#64748b"],
            }}
          />
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <Chart
            type="line"
            width={500}
            height={300}
            options={{
              chart: { zoom: { enabled: true } },
              stroke: { curve: "smooth" },
              title: { text: "Time taken for each question", align: "center" },
              xaxis: {
                title: { text: "question" },
                categories: [
                  ...Array.from({ length: getTotalQuestions() }).map(
                    (_, i) => i + 1
                  ),
                ],
              },
              yaxis: {
                min: 30,
                max: 90,
                title: { text: "time (S)" },
              },
            }}
            series={[
              { data: game.questionsTimeMatrix.map((time) => time / 1_000) },
            ]}
          />
        </Card>
      </div>
      <Button size="lg" onClick={handleNewGameClick}>
        New Game
      </Button>
    </main>
  );
}
