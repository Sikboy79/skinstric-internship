"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useResults } from "@/store/ResultsContext";
import Header from "@/app/components/Header";
import DiamondArrowButton from "@/app/components/DiamondButton";
import CircularSlider from "@/app/components/CircularSlider";

type Mode = "race" | "age";
const SummaryPage: React.FC = () => {
  const router = useRouter();
  const { data } = useResults();
  const originalRace = useRef<Record<string, number> | null>(null);
  const originalAge = useRef<Record<string, number> | null>(null);
  const [raceData, setRaceData] = useState<Record<string, number>>({});
  const [ageData, setAgeData] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<Mode>("race");
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedSex, setSelectedSex] = useState<string>("male");

  useEffect(() => {
    if (data) {
      originalRace.current = data.race;
      originalAge.current = data.age;
      setRaceData(data.race);
      setAgeData(data.age);
      // default sex
      const topGender = Object.entries(data.gender).sort(
        (a, b) => b[1] - a[1],
      )[0][0];
      setSelectedSex(topGender);
    }
  }, [data]);
  if (!data || !originalRace.current || !originalAge.current) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600 text-xl">Loading results...</p>
      </main>
    );
  }

  const getTop = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1])[0];
  const [topRace] = getTop(raceData);
  const [topAge] = getTop(ageData);
  const activeKey =
    mode === "race" ? (selectedRace ?? topRace) : (selectedAge ?? topAge);
  const activeValue =
    mode === "race" ? raceData[activeKey] : ageData[activeKey];
  const redistribute = (
    obj: Record<string, number>,
    active: string,
    value: number,
  ) => {
    const oldValue = obj[active];
    const delta = value - oldValue;
    const keys = Object.keys(obj).filter((k) => k !== active);
    if (keys.length === 0) {
      return { ...obj, [active]: value };
    }
    const nextLargestKey = keys.sort((a, b) => obj[b] - obj[a])[0];
    const nextValue = Math.max(obj[nextLargestKey] - delta, 0);
    const updated = { ...obj, [active]: value, [nextLargestKey]: nextValue };
    const total = Object.values(updated).reduce((a, b) => a + b, 0);
    return Object.fromEntries(
      Object.entries(updated).map(([k, v]) => [k, v / total]),
    );
  };
  const handleSliderChange = (value: number) => {
    if (mode === "race") {
      setRaceData((prev) => redistribute(prev, activeKey, value));
    } else {
      setAgeData((prev) => redistribute(prev, activeKey, value));
    }
  };
  const resetAll = () => {
    setRaceData({ ...originalRace.current! });
    setAgeData({ ...originalAge.current! });
    setSelectedRace(null);
    setSelectedAge(null);
    setSelectedSex(
      Object.entries(data.gender).sort((a, b) => b[1] - a[1])[0][0],
    );
    setMode("race");
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <section className="flex flex-col flex-1 px-10 py-24 gap-3 select-none">
        <h2 className="text-xl font-semibold">A.I. ANALYSIS</h2>
        <h1 className="text-7xl font-normal">DEMOGRAPHICS</h1>
        <p className="text-m text-gray-800">PREDICTED RACE, AGE & SEX</p>
        <div className="flex gap-6 mt-12">
          {/* LEFT PANEL */}
          <div className="flex flex-col w-60 gap-6">
            {/* RACE */}
            <div
              onClick={() => setMode("race")}
              className={`flex flex-col p-4 border-t-2 cursor-pointer transition
                ${mode === "race" ? "bg-black text-white" : "bg-gray-100"}`}
            >
              <span className="text-xl font-medium capitalize">
                {activeKey && mode === "race" ? activeKey : topRace}
              </span>
              <span className="text-sm font-semibold">RACE</span>
            </div>
            {/* AGE */}
            <div
              onClick={() => setMode("age")}
              className={`flex flex-col p-4 border-t-2 cursor-pointer transition
                ${mode === "age" ? "bg-black text-white" : "bg-gray-100"}`}
            >
              <span className="text-xl font-medium">
                {activeKey && mode === "age" ? activeKey : topAge}
              </span>
              <span className="text-sm font-semibold">AGE</span>
            </div>
            {/* SEX */}
            <div className="flex flex-col border-t-2 bg-gray-100 p-4 gap-2">
              <div className="flex gap-2 mt-1">
                {["male", "female"].map((sex) => (
                  <button
                    key={sex}
                    onClick={() => setSelectedSex(sex)}
                    className={`px-3 py-1 text-xs font-medium border w-20 transition
                      ${
                        selectedSex === sex
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300"
                      }`}
                  >
                    {sex.toUpperCase()}
                  </button>
                ))}
              </div>
              <span className="text-sm font-semibold">SEX</span>
            </div>
          </div>
          {/* CENTER + RIGHT */}
          <div className="flex gap-6 md:w-6xl md:h-130">
            {/* SLIDER */}
            <div className="relative border-t-2 bg-gray-100 md:w-6xl">
              <span className="absolute top-4 left-6 text-xl font-medium capitalize">
                {activeKey}
              </span>
              <div className="absolute top-40 left-120">
                <CircularSlider
                  value={activeValue}
                  onChange={handleSliderChange}
                />
              </div>
            </div>
            {/* LIST */}
            <div className="flex flex-col border-t-2 p-4 w-1/3 bg-gray-100">
              <div className="flex justify-between font-semibold border-b pb-2">
                <span>{mode.toUpperCase()}</span>
                <span>A.I. CONFIDENCE</span>
              </div>
              {(mode === "race" ? raceData : ageData) &&
                Object.entries(mode === "race" ? raceData : ageData)
                  .sort((a, b) => b[1] - a[1])
                  .map(([key, val]) => {
                    const isSelected =
                      mode === "race"
                        ? key === selectedRace
                        : key === selectedAge;
                    const isTop =
                      mode === "race" ? key === topRace : key === topAge;
                    return (
                      <div
                        key={key}
                        onClick={() =>
                          mode === "race"
                            ? setSelectedRace(key)
                            : setSelectedAge(key)
                        }
                        className={`flex justify-between py-1 px-2 cursor-pointer transition
                          ${
                            isSelected
                              ? "bg-black text-white font-bold"
                              : isTop
                                ? "bg-gray-300 font-semibold"
                                : "hover:bg-gray-200"
                          }`}
                      >
                        <span className="capitalize">{key}</span>
                        <span>{Math.round(val * 100)}%</span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
        {/* BACK */}
        <div className="fixed bottom-6 left-6 z-50">
          <DiamondArrowButton
            direction="left"
            label="BACK"
            onClick={() => router.back()}
          />
        </div>
        {/* ACTIONS */}
        <div className="flex gap-3 justify-end mr-20 mt-10 pr-1">
          <button
            onClick={resetAll}
            className="border w-20 border-black bg-white text-black font-bold px-4 py-2 text-xs hover:bg-black hover:text-white transition"
          >
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
