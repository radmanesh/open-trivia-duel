import { useQuery } from "@tanstack/react-query";

export type Question = {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
};

type QuestionAPIResponse = {
  response_code: 0 | 1 | 2 | 3 | 4;
  results: Array<Question>;
};

const getQuestions = async (
  amount: number,
  category: number,
  difficulty: "easy" | "medium" | "hard"
): Promise<Question[]> => {
  const req = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`
  );

  if (!req.ok) {
    throw new Error("Failed to fetch questions");
  }

  const res = (await req.json()) as QuestionAPIResponse;

  return res.results;
};

export const useQuestions = ({
  amount,
  category,
  difficulty,
}: {
  amount: number;
  category: number;
  difficulty: "easy" | "medium" | "hard";
}) => {
  return useQuery({
    queryKey: ["questions", category],
    queryFn: () => getQuestions(amount, category, difficulty),
  });
};
