"use client";

// --- 3rd party deps
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { redirect, useRouter } from "next/navigation";

// --- internal deps
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTime } from "@/lib/format-time";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/contexts/game-provider";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ScorePage() {
  const router = useRouter();

  // --- game state
  const { game, getScore, getAnswers, resetGame, getTotalQuestions } =
    useGameContext();

  // --- #of wrong, correct & skipped answers for each round
  const data = useMemo(() => getAnswers(), [getAnswers]);

  // --- extracting data for each category
  const rounds = useMemo(() => data.map((item) => item.round), [data]);
  const correct = useMemo(() => data.map((item) => item.correct), [data]);
  const incorrect = useMemo(
    () => data.map((item) => -(item.wrong + item.skipped)),
    [data]
  );

  useEffect(() => {
    // user has refreshed the page, so no game object
    if (game.player === "") {
      redirect("/");
    }
  }, [game.player]);

  // --- total #of questions
  const totalQuestions = useMemo(
    () => game.questionsPerRound * game.totalRounds,
    [game]
  );

  // --- new game click handler
  const handleNewGameClick = () => {
    resetGame();
    router.push("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-slate-50/95">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-full max-w-full">
        <Card className="space-y-3">
          <CardHeader>
            <CardTitle>{game.player}</CardTitle>
            <CardDescription>
              You completed the game in{" "}
              <span className="font-bold text-primary">
                {formatTime(game.duration)}
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
              colors: ["#22c55e", "#ef4444"],
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
              { name: "Wrong/Skipped", data: incorrect },
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
                min: 0,
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
