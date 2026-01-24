"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResults } from "@/store/ResultsContext";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import CircularSlider from "@/app/components/CircularSlider";

const SummaryPage: React.FC = () => {
  const router = useRouter();
  const { data } = useResults();
  const topKey = (obj?: Record<string, number>) => {
    if (!obj || Object.keys(obj).length === 0) return "N/A";
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0][0];
  };

  const topRace = topKey(data?.race);
  const topRaceValue = data?.race ? data.race[topRace] : 0;
  const topAge = topKey(data?.age);
  const topGender = topKey(data?.gender);

  useEffect(() => {
    console.log("Summary data:", data);
  }, [data]);

  // Show loading state if data is not ready
  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-xl">Loading results...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      <section className="flex flex-col flex-1 px-10 py-24 gap-3">
        <h2 className="text-xl font-semibold">A.I. ANALYSIS</h2>
        <h1 className="text-7xl font-normal">DEMOGRAPHICS</h1>
        <p className="text-m text-gray-800">PREDICTED RACE & AGE</p>

        <div className="flex gap-6 mt-12">
          {/* Side panel */}
          <div className="flex flex-col w-60 gap-6">
            <div className="flex flex-col p-4 border-t-2 bg-gray-100 gap-6">
              <span className="text-xl font-medium">{topRace}</span>
              <span className="text-s font-semibold text-gray-800">RACE</span>
            </div>

            <div className="flex flex-col p-4 border-t-2 bg-gray-100 gap-3">
              <span className="text-xl font-medium">{topAge}</span>
              <span className="text-s font-semibold text-gray-800">AGE</span>
            </div>

            <div className="flex flex-col p-4 border-t-2 bg-gray-100 gap-3">
              <span className="text-xl font-medium">{topGender}</span>
              <span className="text-s font-semibold text-gray-800">SEX</span>
            </div>
          </div>
          <div className="flex gap-6 md:w-6xl md:h-130">
            {/* Circle with main race % */}
            <div className="relative border-t-2 bg-gray-100">
              <span className="relative text-xl font-medium top-4 left-6">
                {topRace}
              </span>
              <div className="relative top-36 left-45">
                <CircularSlider />
              </div>
            </div>

            {/* Full race confidence list */}
            <div className="flex flex-col border-t-2 p-4 w-1/3 bg-gray-100">
              <div className="flex justify-between font-semibold border-b pb-2">
                <span>RACE</span>
                <span>A.I. CONFIDENCE</span>
              </div>

              {Object.entries(data.race)
                .sort((a, b) => b[1] - a[1])
                .map(([race, pct]) => (
                  <div
                    key={race}
                    className={`flex justify-between py-1 ${
                      race === topRace
                        ? "font-bold bg-black text-white px-2"
                        : ""
                    }`}
                  >
                    <span>{race}</span>
                    <span>{(pct * 100).toFixed(0)}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="fixed bottom-6 left-6 z-50">
          <DiamondArrowButton
            direction="left"
            label="BACK"
            onClick={() => router.back()}
          />
        </div>
        <div className="flex gap-3 justify-end mr-20 mt-10 pr-1">
          <button className="border w-20 border-black bg-white text-black font-bold px-4 py-2 text-xs hover:bg-black hover:text-white transition">
            RESET
          </button>
          <button className="border w-20 border-black bg-black text-white px-3 py-2 text-xs font-medium hover:bg-white hover:text-black transition">
            CONFIRM
          </button>
        </div>
      </section>
    </main>
  );
};

export default SummaryPage;
