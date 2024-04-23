import { Question } from "@/services/use-questions";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Button } from "./ui/button";

const shuffle = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5);
};

type QuestionProps = {
  question: Question;
  isAnswered: boolean;
  setIsAnswered: Dispatch<SetStateAction<boolean>>;
};

const QuestionCard = ({
  question,
  setIsAnswered,
  isAnswered,
}: QuestionProps) => {
  const [selectedOption, setSelectedOption] = useState("");

  const selectOption = (opt: string) => {
    setSelectedOption(opt);
    setIsAnswered(true);
  };

  const displayedOptions = useMemo(
    () => shuffle([question.correct_answer, ...question.incorrect_answers]),
    [question]
  );

  return (
    <div className="p-2">
      <h2
        className="font-bold text-lg mb-3"
        dangerouslySetInnerHTML={{ __html: `Q: ${question.question}` }}
      />
      <div className="grid grid-cols-2 gap-2">
        {isAnswered
          ? displayedOptions.map((opt, i) => (
              <Button
                key={i}
                disabled
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
