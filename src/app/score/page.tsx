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
  const { game, getScore, getAnswers, resetGame, getTotalQuestions } =
    useGameContext();

  const data = useMemo(() => getAnswers(), [getAnswers]);

  // Extracting data for each category
  const rounds = useMemo(() => data.map((item) => item.round), [data]);
  const correct = useMemo(() => data.map((item) => item.correct), [data]);
  const wrong = useMemo(() => data.map((item) => -item.wrong), [data]);
  const skipped = useMemo(() => data.map((item) => -item.skipped), [data]);

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
              Score: {getScore().correct}/{totalQuestions}
            </p>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <Chart
            type="pie"
            width={300}
            height={300}
            series={[getScore().wrong, getScore().correct, getScore().skipped]}
            options={{
              labels: ["Wrong", "Correct", "Skipped"],
              colors: ["#ef4444", "#22c55e", "#64748b"],
            }}
          />
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <Chart
            type="bar"
            width={300}
            height={300}
            options={{
              chart: { stacked: true, toolbar: { show: false } },
              colors: ["#22c55e", "#ef4444", "#64748b"],
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
              xaxis: {
                categories: rounds,
                title: { text: "Round" },
              },
              yaxis: {
                title: { text: "questions" },
              },
            }}
            series={[
              { name: "Correct", data: correct },
              { name: "Wrong", data: wrong },
              {
                name: "Skipped",
                data: skipped,
              },
            ]}
          />
        </Card>
        <Card className="flex flex-col items-center justify-center">
          <Chart
            type="line"
            width={300}
            height={300}
            options={{
              stroke: { curve: "smooth" },
              chart: { toolbar: { show: false }, zoom: { enabled: true } },
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
