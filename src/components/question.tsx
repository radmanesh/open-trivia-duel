import { Button } from "./ui/button";
import { Question } from "@/services/use-questions";
import { shuffleAnswers } from "@/lib/shuffle";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useGameContext } from "@/contexts/game-provider";

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

  const currentRoundScore = useMemo(
    () => game.answers.filter((ans) => ans.round === game.nextRound.id)[0],
    [game.answers, game.nextRound.id]
  );

  const selectOption = (option: string) => {
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

  const displayedOptions = useMemo(
    () =>
      question &&
      shuffleAnswers([question.correct_answer, ...question.incorrect_answers]),
    [question]
  );

  return (
    <div className="p-2 space-y-4 min-h-[150px] max-h-[150px] flex flex-col items-center justify-center w-full">
      <h2
        className="font-bold text-lg text-center"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />
      <div className="grid grid-cols-2 gap-2">
        {isAnswered
          ? displayedOptions.map((opt, i) => (
              <Button
                key={i}
                disabled
                className="w-full"
                variant={
                  opt === question.correct_answer ? "success" : "destructive"
                }
              >
                <span dangerouslySetInnerHTML={{ __html: opt }} />
              </Button>
            ))
          : displayedOptions.map((opt, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => selectOption(opt)}
              >
                <div dangerouslySetInnerHTML={{ __html: opt }} />
              </Button>
            ))}
      </div>
    </div>
  );
};

export default QuestionCard;
