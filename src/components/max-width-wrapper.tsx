import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl px-4 lg:px-20 pt-4 md:pt-10",
        className
      )}
    >
      {children}
    </div>
  );
}
