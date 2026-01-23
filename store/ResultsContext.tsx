"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Data {
  age: Record<string, number>;
  gender: Record<string, number>;
  race: Record<string, number>;
}

interface ResultsContextType {
  data: Data | null;
  setData: (data: Data) => void;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export const ResultsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Data | null>(null);
  return (
    <ResultsContext.Provider value={{ data, setData }}>
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  const context = useContext(ResultsContext);
  if (!context) throw new Error("useResults must be used within ResultsProvider");
  return context;
};
