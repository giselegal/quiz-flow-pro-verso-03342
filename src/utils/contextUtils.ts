// Safe context hook that provides fallback values
import React from 'react';

export const createSafeContext = <T,>(
  contextName: string,
  defaultValue?: T
) => {
  const Context = React.createContext<T | undefined>(defaultValue);
  
  const Provider = Context.Provider;
  
  const useContext = (): T => {
    const context = React.useContext(Context);
    if (context === undefined && !defaultValue) {
      console.warn(`${contextName} context not found, using fallback`);
      // Return a minimal fallback instead of throwing
      return {} as T;
    }
    return context || defaultValue!;
  };
  
  return { Provider, useContext, Context };
};

// Safe hook wrapper for existing contexts
export const createSafeHook = <T,>(
  hookFn: () => T,
  fallbackValue: T,
  hookName: string
) => {
  return (): T => {
    try {
      return hookFn();
    } catch (error) {
      console.warn(`${hookName} hook failed, using fallback:`, error);
      return fallbackValue;
    }
  };
};