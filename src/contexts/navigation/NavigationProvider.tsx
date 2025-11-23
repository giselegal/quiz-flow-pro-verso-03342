import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  goToStep: (step: number) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <NavigationContext.Provider value={{ currentStep, setCurrentStep, goToStep }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
