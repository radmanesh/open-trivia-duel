import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import MaxWidthWrapper from "@/components/max-width-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Open Trivia",
  description: "A multi round trivia game built with Open Trivia API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={`${inter.className} bg-slate-50/95`}>
          <MaxWidthWrapper>{children}</MaxWidthWrapper>
        </body>
      </Providers>
    </html>
  );
}
