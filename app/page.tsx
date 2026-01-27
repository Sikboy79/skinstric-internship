"use client";

import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiagonalLines from "@/app/components/DiagonalLines";
import DiamondFrame from "@/app/components/DiamondFrame";
import DiamondArrowButton from "@/app/components/DiamondButton";
import EnterCode from "./components/EnterCode";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-transparent overflow-hidden font-roobert">
      <Header />
      <EnterCode/>
      <DiagonalLines />
      <DiamondFrame />
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-xl flex flex-col items-center">
          {/* Heading */}
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light leading-tight">
            Sophisticated
            <br />
            skincare
          </h1>

          {/* Mobile / Tablet description */}
          <p className="mt-6 text-gray-500 text-sm font-bold md:text-base max-w-md xl:hidden">
            Skinstric developed an A.I. that creates a highly-personalized
            routine tailored to what your skin needs.
          </p>

          {/* MOBILE / TABLET BUTTON */}
          <div className="mt-8 block xl:hidden">
            <div className="w-full">
              {" "}
              {/* wrapper enforces Tailwind visibility */}
              <DiamondArrowButton
                direction="right"
                label="ENTER EXPERIENCE"
                onClick={() => router.push("/pages/start")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* LOWER-LEFT TEXT FOR XL (DESKTOP / FULL SCREEN) */}
      <div className="hidden xl:block fixed bottom-10 left-10 z-50 text-gray-500 text-xs md:text-sm max-w-[18rem] leading-snug">
        Skinstric developed an A.I. that creates a highly-personalized routine
        tailored to what your skin needs.
      </div>

      {/* DESKTOP SIDE NAV */}
      <div className="fixed bottom-80 left-8 hidden xl:flex  items-center gap-6 z-50">
        {/* Left diamond button */}
        <DiamondArrowButton
          direction="left"
          label="DISCOVER A.I."
          disabled
          // onClick={() => router.push("/pages/discover")}
        />
      </div>
      <div className="fixed bottom-80 right-8 hidden xl:flex  items-center gap-6 z-50">
        {/* Right diamond button */}
        <DiamondArrowButton
          direction="right"
          label="TAKE TEST"
          onClick={() => router.push("/pages/start")}
        />
      </div>
    </main>
  );
}
