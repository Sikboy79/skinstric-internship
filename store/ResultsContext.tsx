"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface Data {
  age: Record<string, number>;
  gender: Record<string, number>;
  race: Record<string, number>;
}

interface ResultsContextType {
  data: Data | null;
  setData: (data: Data) => void;
  clearData: () => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

const STORAGE_KEY = "ai_results";

export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<Data | null>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setDataState(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load stored results:", err);
    }
  }, []);
  const setData = (newData: Data) => {
    setDataState(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (err) {
      console.error("Failed to save results:", err);
    }
  };
  const clearData = () => {
    setDataState(null);
    localStorage.removeItem(STORAGE_KEY);
  };
  return (
    <ResultsContext.Provider value={{ data, setData, clearData }}>
      {children}
    </ResultsContext.Provider>
  );
};
export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) {
    throw new Error("useResults must be used within ResultsProvider");
  }
  return context;
};
