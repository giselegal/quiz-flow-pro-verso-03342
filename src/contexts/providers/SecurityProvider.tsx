/**
 * 🔒 SECURITY PROVIDER - STUB
 * Stub temporário para desbloquear build
 */

import React, { createContext, useContext } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

interface SecurityContextType {
  isSecure: boolean;
  validateAccess: (resource: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  appLogger.warn('[SecurityProvider] Usando stub temporário');

  const value: SecurityContextType = {
    isSecure: true,
    validateAccess: () => true,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};

export default SecurityProvider;
