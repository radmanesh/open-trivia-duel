import { useQuery } from "@tanstack/react-query";

type Category = {
  id: number;
  name: string;
};

type CategoryAPIResponse = {
  trivia_categories: Array<Category>;
};

const getCategories = async (): Promise<Category[]> => {
  const req = await fetch(`https://opentdb.com/api_category.php`, {
    method: "GET",
  });

  if (!req.ok) {
    throw new Error("Failed to fetch categories.");
  }

  const res = (await req.json()) as CategoryAPIResponse;

  return res.trivia_categories;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
