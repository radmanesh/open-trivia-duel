"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/contexts/react-query-provider";
import { GameProvider } from "@/contexts/game-provider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <title>Open Trivia</title>
      </Head>
      <ReactQueryProvider>
        <GameProvider>
          <body className={inter.className}>{children}</body>
        </GameProvider>
      </ReactQueryProvider>
    </html>
  );
}
