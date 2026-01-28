"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResults } from "@/store/ResultsContext";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import CircularSlider from "@/app/components/CircularSlider";
import EnterCode from "@/app/components/EnterCode";

type Mode = "race" | "age" | "sex";

const SummaryPage: React.FC = () => {
  const router = useRouter();
  const { data } = useResults();

  const originalRace = useRef<Record<string, number> | null>(null);
  const originalAge = useRef<Record<string, number> | null>(null);
  const originalSex = useRef<Record<string, number> | null>(null);

  const [raceData, setRaceData] = useState<Record<string, number>>({});
  const [ageData, setAgeData] = useState<Record<string, number>>({});
  const [sexData, setSexData] = useState<Record<string, number>>({});

  const [mode, setMode] = useState<Mode>("race");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedSex, setSelectedSex] = useState<string | null>(null);

  // Initialize state once data is loaded
  useEffect(() => {
    if (!data) return;

    setRaceData(data.race);
    setAgeData(data.age);
    setSexData(data.gender);

    originalRace.current = data.race;
    originalAge.current = data.age;
    originalSex.current = data.gender;
  }, [data]);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-xl">Loading results...</p>
      </main>
    );
  }

  // Helper to get top entry
  const getTop = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])[0];

  const [topRace] = getTop(raceData);
  const [topAge] = getTop(ageData);
  const [topSex] = getTop(sexData);

  const activeKey =
    mode === "race"
      ? selectedRace ?? topRace
      : mode === "age"
      ? selectedAge ?? topAge
      : selectedSex ?? topSex;

  const activeValue =
    mode === "race"
      ? raceData[activeKey]
      : mode === "age"
      ? ageData[activeKey]
      : sexData[activeKey];

  const redistribute = (
    obj: Record<string, number>,
    active: string,
    value: number
  ) => {
    const oldValue = obj[active];
    const delta = value - oldValue;
    const keys = Object.keys(obj).filter((k) => k !== active);
    if (!keys.length) return { ...obj, [active]: value };
    const target = keys.sort((a, b) => obj[b] - obj[a])[0];
    const updated = {
      ...obj,
      [active]: value,
      [target]: Math.max(obj[target] - delta, 0),
    };
    const total = Object.values(updated).reduce((a, b) => a + b, 0);
    return Object.fromEntries(
      Object.entries(updated).map(([k, v]) => [k, v / total])
    );
  };

  const handleSliderChange = (value: number) => {
    if (mode === "race") setRaceData((p) => redistribute(p, activeKey, value));
    else if (mode === "age") setAgeData((p) => redistribute(p, activeKey, value));
    else setSexData((p) => redistribute(p, activeKey, value));
  };

  const resetAll = () => {
    setRaceData({ ...originalRace.current! });
    setAgeData({ ...originalAge.current! });
    setSexData({ ...originalSex.current! });
    setSelectedRace(null);
    setSelectedAge(null);
    setSelectedSex(null);
    setMode("race");
  };

  const currentData =
    mode === "race" ? raceData : mode === "age" ? ageData : sexData;

  const setSelected =
    mode === "race"
      ? setSelectedRace
      : mode === "age"
      ? setSelectedAge
      : setSelectedSex;

  const topKey = mode === "race" ? topRace : mode === "age" ? topAge : topSex;

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <EnterCode />
      <section className="flex flex-col flex-1 px-6 sm:px-10 py-16 lg:py-24 gap-3 select-none text-[#1a1b1c]">
        <h2 className="text-lg sm:text-xl font-semibold">A.I. ANALYSIS</h2>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal">DEMOGRAPHICS</h1>
        <p className="text-sm sm:text-base">PREDICTED RACE, AGE & SEX</p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <div className="flex lg:flex-col gap-4 lg:gap-6">
            {(["race", "age", "sex"] as Mode[]).map((m) => (
              <div
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 lg:flex-none flex flex-col p-4 border-t-2 cursor-pointer transition ${
                  mode === m ? "bg-[#1a1b1c] text-white" : "bg-gray-100"
                }`}
              >
                <span className="text-lg sm:text-xl font-medium capitalize">
                  {m === "race"
                    ? selectedRace ?? topRace
                    : m === "age"
                    ? selectedAge ?? topAge
                    : selectedSex ?? topSex}
                </span>
                <span className="text-xs sm:text-sm font-semibold">{m.toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
            <div className="relative border-t-2 bg-gray-100 min-h-80 flex items-center justify-center">
              <span className="absolute top-4 left-6 text-lg sm:text-xl font-medium capitalize">
                {activeKey}
              </span>
              <div className="flex items-center justify-center">
                <CircularSlider value={activeValue} onChange={handleSliderChange} />
              </div>
            </div>

            <div className="flex flex-col border-t-2 p-4 bg-gray-100">
              <div className="flex justify-between font-semibold border-b pb-2 text-sm">
                <span>{mode.toUpperCase()}</span>
                <span>A.I. CONFIDENCE</span>
              </div>

              {Object.entries(currentData)
                .sort((a, b) => b[1] - a[1])
                .map(([key, val]) => {
                  const isSelected = key === activeKey;
                  const isTop = key === topKey;

                  return (
                    <div
                      key={key}
                      onClick={() => setSelected(key)}
                      className={`flex justify-between py-2 px-2 cursor-pointer transition text-sm ${
                        isSelected
                          ? "bg-[#1a1b1c] text-white font-bold"
                          : isTop
                          ? "bg-gray-300 font-semibold"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rotate-45 inline-block border ${
                            isSelected ? "border-white" : "border-black"
                          }`}
                        />
                        <span className="capitalize">{key}</span>
                      </div>

                      <span>{Math.round(val * 100)}%</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 left-8 z-50">
          <DiamondArrowButton direction="left" label="BACK" onClick={() => router.back()} />
        </div>

        <div className="flex gap-3 justify-end mt-10">
          <button
            onClick={resetAll}
            className="border w-24 border-[#1a1b1c] bg-white text-[#1a1b1c] font-bold px-4 py-2 text-xs hover:bg-[#1a1b1c] hover:text-white transition"
          >
            RESET
          </button>
          <button className="border w-24 border-[#1a1b1c] bg-[#1a1b1c] text-white px-3 py-2 text-xs font-medium hover:bg-white hover:text-[#1a1b1c] transition">
            CONFIRM
          </button>
        </div>
      </section>
    </main>
  );
};

export default SummaryPage;