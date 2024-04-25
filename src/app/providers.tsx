"use client";

import { GameProvider } from "@/contexts/game-provider";
import ReactQueryProvider from "@/contexts/react-query-provider";
import React from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProvider>
      <GameProvider>{children}</GameProvider>
    </ReactQueryProvider>
  );
};
