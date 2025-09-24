/**
 * Security Provider - Contexto global de segurança
 * Fase 5: Security & Production Hardening
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';

interface SecurityContextType {
  systemStatus: any;
  healthStatus: any;
  performanceMetrics: any;
  isLoading: boolean;
  error: string | null;
  recordMetric: (metric: any) => Promise<any>;
  logSecurityEvent: (event: any) => Promise<any>;
  checkHealth: () => Promise<any>;
  getSystemStatus: () => Promise<any>;
  getMetrics: (serviceName?: string, hours?: number) => Promise<any>;
  isSystemHealthy: boolean;
  hasCriticalIssues: boolean;
  hasWarnings: boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const securityMonitor = useSecurityMonitor();

  return (
    <SecurityContext.Provider value={securityMonitor}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityProvider;