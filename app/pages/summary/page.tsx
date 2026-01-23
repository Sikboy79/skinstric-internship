"use client";

import React from "react";
import { useResults } from "@/store/ResultsContext";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";

const SummaryPage: React.FC = () => {
  const { data } = useResults();

  const topRace = data?.race
    ? Object.entries(data.race).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  const topRacePct = data?.race
    ? Object.entries(data.race).sort((a, b) => b[1] - a[1])[0][1] * 100
    : 0;

  const topAge = data?.age
    ? Object.entries(data.age).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  const sex = data?.gender
    ? Object.entries(data.gender).sort((a, b) => b[1] - a[1])[0][0]
    : "N/A";

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <section className="flex flex-col flex-1 px-12 py-12 gap-8">
        <h2 className="text-2xl font-semibold">A.I. ANALYSIS</h2>
        <h1 className="text-6xl font-bold">DEMOGRAPHICS</h1>
        <p className="text-sm text-gray-600">PREDICTED RACE & AGE</p>

        <div className="flex gap-12 mt-12">
          {/* Circle with main race % */}
          <div className="relative w-64 h-64 rounded-full border-8 border-black flex items-center justify-center">
            <span className="text-3xl font-semibold">{topRacePct.toFixed(0)}%</span>
          </div>

          {/* Side panel */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col border p-4">
              <span className="text-xs font-semibold text-gray-500">RACE</span>
              <span className="text-xl font-medium">{topRace}</span>
            </div>
            <div className="flex flex-col border p-4">
              <span className="text-xs font-semibold text-gray-500">AGE</span>
              <span className="text-xl font-medium">{topAge}</span>
            </div>
            <div className="flex flex-col border p-4">
              <span className="text-xs font-semibold text-gray-500">SEX</span>
              <span className="text-xl font-medium">{sex}</span>
            </div>
          </div>

          {/* Full race confidence list */}
          <div className="flex flex-col border p-4">
            <div className="flex justify-between font-semibold border-b pb-2">
              <span>RACE</span>
              <span>A.I. CONFIDENCE</span>
            </div>
            {data?.race &&
              Object.entries(data.race)
                .sort((a, b) => b[1] - a[1])
                .map(([race, pct]) => (
                  <div
                    key={race}
                    className={`flex justify-between py-1 ${
                      race === topRace ? "font-bold bg-black text-white px-2" : ""
                    }`}
                  >
                    <span>{race}</span>
                    <span>{(pct * 100).toFixed(0)}%</span>
                  </div>
                ))}
          </div>
        </div>

        <DiamondArrowButton direction="left" label="BACK" onClick={() => history.back()} />
      </section>
    </main>
  );
};

export default SummaryPage;