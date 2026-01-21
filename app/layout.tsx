import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as Roobert alternative
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"], // Regular + Bold
  variable: "--font-roobert", // keep variable name for Tailwind
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
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}