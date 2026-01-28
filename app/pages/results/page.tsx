"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import { useResults } from "@/store/ResultsContext";
import TripleDiamond from "@/app/components/TripleDiamond";
import EnterCode from "@/app/components/EnterCode";

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const { data } = useResults();
  const topKey = (obj?: Record<string, number>) => {
    if (!obj || Object.keys(obj).length === 0) return "N/A";
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0][0];
  };

  const topRace = topKey(data?.race);
  const topAge = topKey(data?.age);
  const topGender = topKey(data?.gender);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-xl">Loading results...</p>
      </main>
    );
  }
  console.log(data);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <EnterCode/>
      <section className="flex flex-col items-center justify-center flex-1 gap-6 mt-8 px-6 relative">
        <div className="absolute top-12 left-8">
          <h2 className="text-xl font-bold mb-2 justify-start hidden md:block">
            A.I. ANALYSIS
          </h2>
          <p className="text-md mb-8 ">
            A.I. HAS ESTIMATED THE FOLLOWING.
            <br />
            FIX ESTIMATED INFORMATION IF NEEDED.
          </p>
        </div>

        {/* Diamond Grid */}
        <div className="relative flex items-center justify-center mt-20 ">
          {/* TripleDiamond behind the 2x2 button grid */}
          <div className="absolute flex items-center justify-center">
            <TripleDiamond size={400} gap={20} padding={60}>
              {/* Optional center content if needed */}
            </TripleDiamond>
          </div>

          {/* 2x2 Button Grid */}
          <div className="grid grid-cols-2 gap-2 rotate-45">
            {[
              {
                label: "DEMOGRAPHICS",
                enabled: true,
                onClick: () => router.push("/pages/summary"),
              },
              { label: "SKIN TYPE DETAILS", enabled: false },
              { label: "COSMETIC CONCERNS", enabled: false },
              { label: "WEATHER", enabled: false },
            ].map((item) => (
              <div
                key={item.label}
                onClick={item.onClick}
                className={`
          w-40 h-40
          flex items-center justify-center
          transition-all duration-200
          ${
            item.enabled
              ? "bg-gray-200 hover:bg-gray-300 cursor-pointer hover:scale-105"
              : "bg-gray-100 hover:bg-gray-300 cursor-not-allowed"
          }
        `}
              >
                {/* Counter-rotate text so it's upright */}
                <div className="-rotate-45 flex flex-col items-center justify-center text-center px-3">
                  <span className="mb-2 text-lg font-semibold text-[#1a1b1c]">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="fixed bottom-6 left-6 z-50">
          <DiamondArrowButton
            direction="left"
            label="BACK"
            onClick={() => router.back()}
          />
        </div>
        <div className="fixed bottom-6 right-6 z-50">
          <DiamondArrowButton
            direction="right"
            label="GET SUMMARY"
            onClick={() => router.back()}
          />
        </div>
      </section>
    </main>
  );
};

export default ResultsPage;
