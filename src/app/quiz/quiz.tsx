"use client";

import QuestionCard from "@/components/question";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/contexts/game-provider";
import { Question } from "@/services/use-questions";
import { useState } from "react";

const Quiz = ({ questions }: { questions: Question[] }) => {
  const { gameDetails } = useGameContext();
  const [answered, setAnswered] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const nextQuestion = () => {
    setAnswered(false);
    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/95">
      <Card className="min-w-[800px] max-w-[800px] min-h-[400px] max-h-[400px] space-y-4">
        <CardHeader>
          <CardTitle>Round {gameDetails.currentRound}</CardTitle>
          <CardDescription>Category: {questions[0].category}</CardDescription>
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
        <CardFooter className="flex flex-row items-center justify-center space-x-4">
          <Button variant="outline">Skip</Button>
          {questions.length === currentQuestion + 1 ? (
            <Button
              className={`btn btn-primary align-self-end ${
                answered === false && "disabled"
              }`}
              onClick={() => console.log("quiz finished")}
            >
              Finish
            </Button>
          ) : (
            <Button
              className={`btn btn-primary align-self-end ${
                answered === false && "disabled"
              }`}
              onClick={nextQuestion}
            >
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
};

export default Quiz;
