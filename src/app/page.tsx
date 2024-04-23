"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useGameContext } from "@/contexts/game-provider";

const formSchema = z.object({
  rounds: z.number().min(1).max(3),
  playerName: z.string().min(4).max(15),
  questionsPerRound: z.number().min(1).max(10),
  gameDifficulty: z.union([
    z.literal("easy"),
    z.literal("medium"),
    z.literal("difficult"),
  ]),
});

export default function Home() {
  const router = useRouter();
  const { updateGameDetails, gameDetails } = useGameContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rounds: 1,
      playerName: "",
      questionsPerRound: 5,
      gameDifficulty: "easy",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // prepare game object
    const { rounds, playerName, questionsPerRound, gameDifficulty } = values;

    // update game context
    updateGameDetails({
      playerName,
      questionsPerRound,
      totalRounds: rounds,
      difficulty: gameDifficulty,
      currentRound: gameDetails.currentRound + 1,
    });

    // navigate to select a category screen
    router.push(`/category`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50/95">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Open Trivia</CardTitle>
          <CardDescription>A multi-round trivia game</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="playerName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name</FormLabel>
                    <FormControl>
                      <Input placeholder="player name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="rounds"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Rounds</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value.toString()}
                        placeholder="number of rounds..."
                        onChange={({ target }) =>
                          field.onChange(target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormDescription>Min is 1 and max is 3</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="questionsPerRound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questions Per Round</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value.toString()}
                        placeholder="questions per round..."
                        onChange={({ target }) =>
                          field.onChange(target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    <FormDescription>Min is 1 and max is 10</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="gameDifficulty"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Difficulty</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select game difficulty" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="difficult">Difficult</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Play</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
