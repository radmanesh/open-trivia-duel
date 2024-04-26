import { Button } from "./ui/button";
import { Question } from "@/services/use-questions";
import { shuffleAnswers } from "@/lib/shuffle";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useGameContext } from "@/contexts/game-provider";
import { cn } from "@/lib/utils";

type QuestionProps = {
  question: Question;
  isAnswered: boolean;
  setIsAnswered: Dispatch<SetStateAction<boolean>>;
};

const QuestionCard = ({
  question,
  isAnswered,
  setIsAnswered,
}: QuestionProps) => {
  const { game, updateScore } = useGameContext();

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const currentRoundScore = useMemo(
    () => game.answers.filter((ans) => ans.round === game.nextRound.id)[0],
    [game.answers, game.nextRound.id]
  );

  const selectOption = (option: string) => {
    setSelectedAnswer(option);
    const isCorrect = option === question.correct_answer;
    setIsAnswered(true);
    updateScore([
      {
        ...currentRoundScore,
        wrong: currentRoundScore.wrong + (isCorrect ? 0 : 1),
        correct: currentRoundScore.correct + (isCorrect ? 1 : 0),
      },
    ]);
  };

  const shuffledOptions = useMemo(
    () =>
      question &&
      shuffleAnswers([question.correct_answer, ...question.incorrect_answers]),
    [question]
  );

  return (
    <div className="p-2 space-y-4 min-h-[150px] max-h-[150px] flex flex-col items-start justify-center w-full">
      <h2
        className="font-bold text-sm md:text-base"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
        {isAnswered
          ? shuffledOptions.map((option, i) => (
              <Button
                key={i}
                disabled
                variant="outline"
                onClick={() => selectOption(option)}
                className={cn(
                  "w-full text-wrap md:min-h-[65px]",
                  option === question.correct_answer &&
                    "text-green-500 font-bold border border-green-500 bg-green-500/5 hover:bg-green-500/10 hover:text-green-500/90",
                  option === selectedAnswer &&
                    option !== question.correct_answer &&
                    "text-destructive font-bold border border-destructive bg-destructive/5 hover:bg-destructive/10 hover:text-destructive/90"
                )}
              >
                <span dangerouslySetInnerHTML={{ __html: option }} />
              </Button>
            ))
          : shuffledOptions.map((option, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                onClick={() => selectOption(option)}
                className="w-full text-wrap md:min-h-[65px]"
              >
                <span dangerouslySetInnerHTML={{ __html: option }} />
              </Button>
            ))}
      </div>
    </div>
  );
};

export default QuestionCard;
