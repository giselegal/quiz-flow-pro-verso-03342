import React, { createContext, useContext, ReactNode } from 'react';

interface ResultContextType {
  result: any | null;
  setResult: (result: any) => void;
  clearResult: () => void;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = React.useState<any | null>(null);

  const clearResult = () => {
    setResult(null);
  };

  return (
    <ResultContext.Provider value={{ result, setResult, clearResult }}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResult must be used within ResultProvider');
  }
  return context;
};
