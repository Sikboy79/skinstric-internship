"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type ResultsData = {
  race: Record<string, number>;
  age: Record<string, number>;
  gender: Record<string, number>;
};

interface ResultsContextType {
  data: ResultsData | null;
  setData: React.Dispatch<React.SetStateAction<ResultsData | null>>;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

const STORAGE_KEY = "resultsData";

export const ResultsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<ResultsData | null>(null);

  // Load stored data safely after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ResultsData = JSON.parse(stored);
        setDataState(parsed);
      }
    } catch (err) {
      console.error("Failed to load stored results:", err);
    }
  }, []); // run once on mount

  const setData: React.Dispatch<React.SetStateAction<ResultsData | null>> = (value) => {
    setDataState((prev) => {
      const newData = typeof value === "function" ? value(prev) : value;
      try {
        if (newData) localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch (err) {
        console.error("Failed to save results:", err);
      }
      return newData;
    });
  };

  return (
    <ResultsContext.Provider value={{ data, setData }}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = (): ResultsContextType => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error("useResults must be used within a ResultsProvider");
  }
  return context;
};