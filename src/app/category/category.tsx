"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/contexts/game-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CategoryFormProps = {
  round: number;
  categories: { id: number; name: string }[];
};

const categoryFormSchema = z.object({ category: z.string() });

export const CategoryForm = ({ round, categories }: CategoryFormProps) => {
  const router = useRouter();

  // fetch game details
  const { updateGameDetails, gameDetails } = useGameContext();

  // form hook
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { category: "" },
  });

  // helpers
  const getCategoryId = (categoryName: string) => {
    if (categoryName === "Random") {
      const availableIds = categories.map(({ id }) => id);
      return availableIds[Math.floor(Math.random() * availableIds.length)];
    }

    return categories.filter((category) => category.name === categoryName)[0]
      .id;
  };

  // form onSubmit
  const onSubmit = (values: z.infer<typeof categoryFormSchema>) => {
    // get selected category id
    const selectedCategoryId = getCategoryId(values.category);

    // update game details object
    updateGameDetails({
      currentRound: round,
      rounds: [
        ...gameDetails.rounds,
        { number: round, category: values.category, score: 0, timeTaken: 0 },
      ],
      categoriesSelected: [
        ...gameDetails.categoriesSelected,
        selectedCategoryId,
      ],
    });

    // go to round quiz
    router.push(
      `/quiz?amount=${gameDetails.questionsPerRound}&category=${selectedCategoryId}&difficulty=${gameDetails.difficulty}`
    );
  };
  // render form and go to round quiz

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/95">
      <Card className="w-[400px] space-y-2">
        <CardHeader>
          <CardTitle>Round {round}</CardTitle>
          <CardDescription>Select a category for this round</CardDescription>
        </CardHeader>
        <Separator orientation="horizontal" />
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {[...categories, { id: 100, name: "Random" }]
                            .filter(
                              (category) =>
                                !gameDetails.categoriesSelected.includes(
                                  category.id
                                )
                            )
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-row justify-end">
                <Button type="submit">Start Round</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};
