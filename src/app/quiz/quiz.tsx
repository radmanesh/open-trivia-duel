"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/question";
import { Question } from "@/services/use-questions";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { useGameContext } from "@/contexts/game-provider";

const timeoutDict = {
  easy: 90_000,
  hard: 30_000,
  medium: 60_000,
};

const Quiz = ({ questions }: { questions: Question[] }) => {
  const router = useRouter();
  const { game, setAnswers, finishGame, setNextRound } = useGameContext();

  const [roundTime, setRoundTime] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionTimeout, setQuestionTimeOut] = useState(
    timeoutDict[game.level]
  );

  // handlers
  const nextQuestion = () => {
    setAnswered(false);
    setCurrentQuestion((prev) => prev + 1);
    setRoundTime((prev) => prev + questionTimeout);
    setQuestionTimeOut(timeoutDict[game.level]);
  };

  const skipQuestion = useCallback(() => {
    setCurrentQuestion((prev) => prev + 1);
    setAnswers({ ...game.answers, skipped: game.answers.skipped + 1 });
    setRoundTime((prev) => prev + questionTimeout);
    setQuestionTimeOut(timeoutDict[game.level]);
  }, [setAnswers, game.answers, game.level, questionTimeout]);

  const handleNetRoundClick = () => {
    if (game.totalRounds === game.nextRound.id) {
      // game finished
      finishGame();

      // go to score screen
      router.push("/score");
    } else {
      // update next round id
      setNextRound({ id: game.nextRound.id + 1, previousRoundTime: roundTime });

      // go to next round
      router.push("/round");
    }
  };

  // effects
  useEffect(() => {
    const timeoutInterval = setInterval(() => {
      setQuestionTimeOut((prev) => {
        if (prev === 0) {
          // Timer finished
          clearInterval(timeoutInterval);
          // Perform actions when timer finishes (e.g., skip question)
          skipQuestion();
          return timeoutDict[game.level]; // Reset timer to 5 minutes (300 seconds)
        } else {
          return prev - 1_000; // Decrement time by 1 second
        }
      });
    }, 1_000);

    return () => clearInterval(timeoutInterval);
  }, [currentQuestion, game.level, skipQuestion]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/95">
      <Card className="min-w-[900px] max-w-[900px] min-h-[400px] max-h-[400px] space-y-4">
        <CardHeader>
          <CardDescription className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <Badge variant="outline" className="uppercase">
                {game.nextRound.name}
              </Badge>
              <Badge
                className="uppercase"
                variant={
                  game.level === "easy"
                    ? "success"
                    : game.level === "medium"
                    ? "warning"
                    : "destructive"
                }
              >
                {game.level}
              </Badge>
            </div>
            <p
              className={cn(
                "text-center text-2xl font-bold",
                Math.floor(questionTimeout / 1_000) <= 10 && "text-red-500/95"
              )}
            >
              {Math.floor(questionTimeout / 1_000)}s
            </p>
          </CardDescription>
        </CardHeader>
        <Separator orientation="horizontal" />
        <CardContent>
          <QuestionCard
            isAnswered={answered}
            setIsAnswered={setAnswered}
            question={questions[currentQuestion]}
          />
        </CardContent>
        <Separator orientation="horizontal" />
        <CardFooter className="flex flex-row items-center justify-between space-x-4">
          <p className="text-lg font-semibold text-primary">
            {currentQuestion + 1} of {game.questionsPerRound}{" "}
            {game.questionsPerRound > 1 ? "Questions" : "Question"}
          </p>
          {questions.length === currentQuestion + 1 ? (
            <Button disabled={!answered} onClick={handleNetRoundClick}>
              {game.totalRounds === game.nextRound.id ? "Finish" : "Next Round"}
            </Button>
          ) : (
            <div className="flex flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={answered}
                onClick={skipQuestion}
              >
                Skip Question
              </Button>
              <Button disabled={!answered} onClick={nextQuestion}>
                Next Question
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  );
};

export default Quiz;
