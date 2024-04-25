"use client";

// --- 3rd party deps
import { useCallback, useEffect, useMemo, useState } from "react";

// --- internal deps
import {
  Card,
  CardContent,
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
import { useGameContext } from "@/contexts/game-provider";

// --- default timeout value for each level
const timeoutDict = {
  easy: 90_000,
  hard: 30_000,
  medium: 60_000,
};

export const Quiz = ({ questions }: { questions: Question[] }) => {
  const router = useRouter();

  // --- current game state
  const { game, updateScore, finishGame, setNextRound, addQuestionTime } =
    useGameContext();

  // --- get current round details
  const currentRoundScore = useMemo(
    () => game.answers.filter((ans) => ans.round === game.nextRound.id)[0],
    [game.answers, game.nextRound.id]
  );

  const [answered, setAnswered] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionTimeout, setQuestionTimeOut] = useState(
    timeoutDict[game.level]
  );

  const elapsedQuestionTime = useMemo(
    () => timeoutDict[game.level] - questionTimeout,
    [game.level, questionTimeout]
  );

  // --- next question handler
  const nextQuestion = () => {
    setAnswered(false);

    // append question elapsed time to game state
    addQuestionTime(elapsedQuestionTime);

    // update current question index
    setCurrentQuestion((prev) => prev + 1);

    // reset timeout for the next question
    setQuestionTimeOut(timeoutDict[game.level]);
  };

  // --- skip question handler
  const skipQuestion = useCallback(() => {
    // update current question index
    setCurrentQuestion((prev) => prev + 1);

    // append question elapsed time to game state
    addQuestionTime(elapsedQuestionTime);

    // update current game score
    // increase the # of skipped answers for the round
    updateScore([
      { ...currentRoundScore, skipped: currentRoundScore.skipped + 1 },
    ]);
    setQuestionTimeOut(timeoutDict[game.level]);
  }, [
    addQuestionTime,
    elapsedQuestionTime,
    updateScore,
    currentRoundScore,
    game.level,
  ]);

  const handleNextRoundClick = () => {
    // add last answered round question time
    addQuestionTime(elapsedQuestionTime);

    // update next round id
    setNextRound(game.nextRound.id + 1);

    // go to next round
    router.push("/round");
  };

  const handleFinishGameClick = () => {
    // add last question time
    addQuestionTime(elapsedQuestionTime);

    // game finished
    finishGame();

    // go to score screen
    router.push("/score");
  };

  // --- handle question timeout timer
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
  }, [
    currentQuestion,
    game.level,
    game.nextRound.id,
    game.questionsPerRound,
    game.totalRounds,
    skipQuestion,
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/95">
      <Card className="min-w-full max-w-full min-h-[750px] max-h-[750px] md:min-h-[450px] md:max-h-[450px] space-y-24 md:space-y-8">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
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
            {currentQuestion + 1 <= game.questionsPerRound && (
              <p
                className={cn(
                  "text-center text-2xl font-bold",
                  Math.floor(questionTimeout / 1_000) <= 10 && "text-red-500/95"
                )}
              >
                {Math.floor(questionTimeout / 1_000)}s
              </p>
            )}
          </div>
        </CardHeader>
        <Separator orientation="horizontal" />
        <CardContent className="py-4">
          {questions[currentQuestion] ? (
            <QuestionCard
              isAnswered={answered}
              setIsAnswered={setAnswered}
              question={questions[currentQuestion]}
            />
          ) : (
            <div className="p-2 space-y-4 min-h-[150px] max-h-[150px] flex flex-col items-center justify-center w-full">
              <h2 className="font-bold text-sm md:text-lg text-center">
                No more questions!
              </h2>
            </div>
          )}
        </CardContent>
        <Separator orientation="horizontal" />
        <CardFooter className="flex flex-row items-center justify-between space-x-4">
          <p className="text-lg font-semibold text-primary">
            {currentQuestion + 1 < game.questionsPerRound
              ? currentQuestion + 1
              : game.questionsPerRound}{" "}
            of {game.questionsPerRound}{" "}
            {game.questionsPerRound > 1 ? "Questions" : "Question"}
          </p>
          {currentQuestion + 1 >= questions.length ? (
            game.totalRounds === game.nextRound.id ? (
              <Button disabled={!answered} onClick={handleFinishGameClick}>
                Finish
              </Button>
            ) : (
              <Button disabled={!answered} onClick={handleNextRoundClick}>
                Next Round
              </Button>
            )
          ) : (
            <div className="flex flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={answered}
                onClick={skipQuestion}
              >
                Skip
              </Button>
              <Button disabled={!answered} onClick={nextQuestion}>
                Next
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </main>
  );
};
