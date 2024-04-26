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

  const handleNextRoundClick = useCallback(() => {
    // add last answered round question time
    addQuestionTime(elapsedQuestionTime);

    // update next round id
    setNextRound(game.nextRound.id + 1);

    // go to next round
    router.push("/round");
  }, [
    addQuestionTime,
    elapsedQuestionTime,
    game.nextRound.id,
    router,
    setNextRound,
  ]);

  const handleFinishGameClick = useCallback(() => {
    // add last question time
    addQuestionTime(elapsedQuestionTime);

    // game finished
    finishGame();

    // go to score screen
    router.push("/score");
  }, [addQuestionTime, elapsedQuestionTime, finishGame, router]);

  // --- handle question timeout timer
  useEffect(() => {
    const timeoutInterval = setInterval(() => {
      if (questionTimeout === 0) {
        // if not last question, skip
        if (currentQuestion < questions.length - 1) {
          skipQuestion();
        } else {
          if (game.nextRound.id === game.totalRounds) {
            // game is finished
            updateScore([
              { ...currentRoundScore, skipped: currentRoundScore.skipped + 1 },
            ]);
            handleFinishGameClick();
          } else {
            updateScore([
              { ...currentRoundScore, skipped: currentRoundScore.skipped + 1 },
            ]);
            handleNextRoundClick();
          }
        }
        // clear interval
        clearInterval(timeoutInterval);

        // reset count down
        setQuestionTimeOut(timeoutDict[game.level]);
      } else {
        setQuestionTimeOut((p) => p - 1_000);
      }
    }, 1_000);

    return () => clearInterval(timeoutInterval);
  }, [
    currentQuestion,
    currentRoundScore,
    game.level,
    game.nextRound.id,
    game.questionsPerRound,
    game.totalRounds,
    handleFinishGameClick,
    handleNextRoundClick,
    questionTimeout,
    questions.length,
    skipQuestion,
    updateScore,
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/95">
      <Card className="min-w-full max-w-full min-h-[750px] max-h-[750px] md:min-h-[450px] md:max-h-[450px] space-y-24 md:space-y-8">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <Badge variant="outline" className="uppercase text-sm">
                {game.nextRound.name}
              </Badge>
              <Badge
                className="uppercase text-sm"
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
            <span
              className={cn(
                "text-center text-green-500/95 text-2xl font-bold",
                Math.floor(questionTimeout / 1_000) <= 20 &&
                  "text-orange-500/95",
                Math.floor(questionTimeout / 1_000) <= 10 &&
                  "text-destructive/95"
              )}
            >
              {Math.floor(questionTimeout / 1_000)}s
            </span>
          </div>
        </CardHeader>
        <Separator orientation="horizontal" />
        <CardContent className="py-4">
          <QuestionCard
            isAnswered={answered}
            setIsAnswered={setAnswered}
            question={questions[currentQuestion]}
          />
        </CardContent>
        <Separator orientation="horizontal" />
        <CardFooter>
          <div className="flex flex-row items-center justify-between w-full">
            <span className="space-x-2">
              <span className="font-normal text-primary text-2xl">
                {currentQuestion + 1}
              </span>
              /{game.questionsPerRound}
            </span>

            <div className="flex flex-row gap-2">
              {/* display skip as long as we haven't reached the last question */}
              {currentQuestion < questions.length - 1 ? (
                <>
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
                </>
              ) : game.nextRound.id === game.totalRounds ? (
                <Button disabled={!answered} onClick={handleFinishGameClick}>
                  Finish
                </Button>
              ) : (
                <Button disabled={!answered} onClick={handleNextRoundClick}>
                  Next Round
                </Button>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};
