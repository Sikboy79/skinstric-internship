import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ResultsProvider } from "@/store/ResultsContext";

<body className="font-roobert text-black bg-white"></body>

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roobert",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skinstric AI",
  description: "Highly-personalized skincare routines",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body className="antialiased bg-white text-black">
        <ResultsProvider>
          {children}
        </ResultsProvider>
      </body>
    </html>
  );
}