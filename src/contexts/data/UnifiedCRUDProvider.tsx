/**
 * UnifiedCRUDProvider Stub
 */
import React, { ReactNode, createContext, useContext } from 'react';

interface UnifiedCRUDContextType {
  loading: boolean;
  error: string | null;
  currentFunnel: any;
  funnelContext: any;
  setCurrentFunnel: (funnel: any) => void;
  saveFunnel: (data?: any) => Promise<void>;
  loadFunnel: (id: string) => Promise<void>;
  createFunnel: (data: any, context?: any) => Promise<any>;
  isLoading: boolean;
  isSaving: boolean;
}

const UnifiedCRUDContext = createContext<UnifiedCRUDContextType | null>(null);

export function UnifiedCRUDProvider({ children }: { children: ReactNode }) {
  const value: UnifiedCRUDContextType = {
    loading: false,
    error: null,
    currentFunnel: null,
    funnelContext: null,
    setCurrentFunnel: () => {},
    saveFunnel: async () => {},
    loadFunnel: async () => {},
    createFunnel: async () => null,
    isLoading: false,
    isSaving: false
  };

  return (
    <UnifiedCRUDContext.Provider value={value}>
      {children}
    </UnifiedCRUDContext.Provider>
  );
}

export function useUnifiedCRUD() {
  const context = useContext(UnifiedCRUDContext);
  if (!context) {
    return { 
      loading: false, 
      error: null,
      currentFunnel: null,
      funnelContext: null,
      setCurrentFunnel: () => {},
      saveFunnel: async () => {},
      loadFunnel: async () => {},
      createFunnel: async () => null,
      isLoading: false,
      isSaving: false
    };
  }
  return context;
}

export function useUnifiedCRUDOptional() {
  return useUnifiedCRUD();
}

export default UnifiedCRUDProvider;
