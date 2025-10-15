/**
 * UnifiedFunnelContext Stub
 */
import React, { ReactNode, createContext, useContext } from 'react';

interface UnifiedFunnelContextType {
  loading: boolean;
  error: string | null;
}

const UnifiedFunnelContext = createContext<UnifiedFunnelContextType | null>(null);

export function UnifiedFunnelProvider({ children }: { children: ReactNode }) {
  const value: UnifiedFunnelContextType = {
    loading: false,
    error: null
  };

  return (
    <UnifiedFunnelContext.Provider value={value}>
      {children}
    </UnifiedFunnelContext.Provider>
  );
}

export function useUnifiedFunnel() {
  const context = useContext(UnifiedFunnelContext);
  if (!context) {
    return { loading: false, error: null };
  }
  return context;
}

export default UnifiedFunnelProvider;
