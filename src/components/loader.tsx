import { CircleEllipsisIcon } from "lucide-react";

export function Loader({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-slate-50/95">
      <CircleEllipsisIcon className="text-primary/95 h-10 w-10 animate-spin" />
      <p className="text-primary/95 font-bold">{message}</p>
    </main>
  );
}
