"use client";

// --- 3rd party deps
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

// --- internal deps
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGameContext } from "@/contexts/game-provider";

type CategoryFormProps = {
  categories: { id: number; name: string }[];
};

const MIN = 9;
const MAX = 32;

// --- valid category ids are 9:32
const validCategoryIds = Array.from({ length: MAX - MIN + 1 }).map(
  (_, i) => i + MIN
);

const categoryFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
});

// --- component
export const CategoryForm = ({ categories }: CategoryFormProps) => {
  const router = useRouter();

  // fetch game details
  const { game, setCategoryForNextRound } = useGameContext();

  // form hook
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { category: "" },
  });

  const getRandom = () => {
    // filter ids for selected categories before
    const categoryIds = [
      ...validCategoryIds.filter(
        (item) => !game.crossedCategories.includes(item)
      ),
    ];
    return Math.floor(Math.random() * categoryIds.length);
  };

  // helpers
  const getCategoryId = (categoryName: string) => {
    if (categoryName === "Random") {
      return getRandom();
    }

    return categories.filter((category) => category.name === categoryName)[0]
      .id;
  };

  // form onSubmit
  const onSubmit = (values: z.infer<typeof categoryFormSchema>) => {
    // get selected category id
    const selectedCategoryId = getCategoryId(values.category);

    // update game state
    setCategoryForNextRound({
      category: values.category,
      categoryId: selectedCategoryId,
    });

    // go to round quiz
    router.push("/quiz");
  };

  // render form and go to round quiz

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/95">
      <Card className="w-[400px] space-y-2 min-h-full max-h-full">
        <CardHeader>
          <CardTitle>Round {game.nextRound.id}</CardTitle>
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
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
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
