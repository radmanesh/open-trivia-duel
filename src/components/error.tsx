// --- 3rd party deps
import { CircleAlertIcon } from "lucide-react";

// --- internal deps
import { Button } from "./ui/button";

interface ErrorProps {
  errorMessage: string;
  onClickTryAgain: () => void;
}

export function PageError({ errorMessage, onClickTryAgain }: ErrorProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-3 bg-slate-50/95">
      <CircleAlertIcon className="text-red-500/95 h-10 w-10" />
      <p className="text-red-500/95">{errorMessage}</p>
      <Button variant="destructive" onClick={onClickTryAgain}>
        Try again
      </Button>
    </main>
  );
}
