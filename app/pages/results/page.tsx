"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import { useResults } from "@/store/ResultsContext";

const ResultsPage: React.FC = () => {
  const router = useRouter();
  const { data } = useResults();
  const topKey = (obj?: Record<string, number>) => {
    if (!obj || Object.keys(obj).length === 0) return "N/A";
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0][0];
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <Header />
      <section className="flex flex-col items-center justify-center flex-1 gap-6 mt-8 px-6 relative">
        <h2 className="text-2xl font-bold mb-2">A.I. ANALYSIS</h2>
        <p className="text-sm text-center mb-8">
          A.I. HAS ESTIMATED THE FOLLOWING.
          <br />
          FIX ESTIMATED INFORMATION IF NEEDED.
        </p>

        {/* Diamond Grid */}
        <div className="grid grid-cols-2 gap-0 transform rotate-45">
          {[
            {
              label: "DEMOGRAPHICS",
              value: `${topKey(data?.age)}, ${topKey(data?.gender)}, ${topKey(data?.race)}`,
              onClick: () => router.push("/pages/summary"), 
            },
            { label: "COSMETIC CONCERNS", value: "N/A" },
            { label: "SKIN TYPE DETAILS", value: "N/A" },
            { label: "WEATHER", value: "N/A" },
          ].map((item) => (
            <div
              key={item.label}
              className="w-40 h-40 bg-gray-100 flex flex-col items-center justify-center text-center font-bold text-black border border-gray-300 p-2 cursor-pointer hover:scale-105 transition"
              style={{ transform: "rotate(-45deg)" }}
              onClick={item.onClick}
            >
              <span className="mb-2">{item.label}</span>
              <span className="text-sm font-normal">{item.value}</span>
            </div>
          ))}
        </div>
        <DiamondArrowButton
          direction="left"
          label="BACK"
          onClick={() => router.back()}
          className="mt-8"
        />
      </section>
    </main>
  );
};

export default ResultsPage;
