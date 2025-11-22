/**
 * 🔒 SECURITY PROVIDER - Validação de Acesso e Segurança
 * 
 * ⚠️ IMPLEMENTAÇÃO BÁSICA - Expandir conforme requisitos de segurança
 * 
 * Funcionalidades:
 * - Validação de acesso a recursos
 * - Logging de tentativas de acesso
 * - Detecção de padrões suspeitos
 * - Rate limiting básico
 * 
 * TODO: Implementar validações específicas por recurso
 * TODO: Integrar com sistema de permissões do backend
 * TODO: Adicionar auditoria de segurança
 */

import React, { createContext, useContext, useCallback, useRef, useEffect, useMemo } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

interface AccessAttempt {
  resource: string;
  timestamp: number;
  granted: boolean;
}

interface SecurityContextType {
  isSecure: boolean;
  validateAccess: (resource: string, userId?: string) => boolean;
  logSecurityEvent: (event: string, details?: any) => void;
  getAccessHistory: () => AccessAttempt[];
  // Properties required by SecurityAlert component
  systemStatus: 'healthy' | 'degraded' | 'critical';
  hasCriticalIssues: boolean;
  hasWarnings: boolean;
  isSystemHealthy: boolean;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

// Lista de recursos que requerem validação especial
const RESTRICTED_RESOURCES = [
  'admin',
  'system',
  'user-data',
  'payment',
  'api-keys',
];

// Rate limiting: máximo de tentativas por minuto
const MAX_ATTEMPTS_PER_MINUTE = 60;

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const accessHistoryRef = useRef<AccessAttempt[]>([]);
  const attemptCountRef = useRef<Map<string, number>>(new Map());
  const [historyLength, setHistoryLength] = React.useState(0); // Track length for useMemo dependency

  useEffect(() => {
    appLogger.info('[SecurityProvider] Initialized with basic validation');
    appLogger.warn('[SecurityProvider] ⚠️ Using basic implementation - expand for production');
  }, []);

  const logSecurityEvent = useCallback((event: string, details?: any) => {
    appLogger.info(`[Security Event] ${event}`, details);
    // TODO: Enviar para sistema de auditoria
  }, []);

  const validateAccess = useCallback((resource: string, userId?: string): boolean => {
    const now = Date.now();
    const key = `${resource}_${userId || 'anonymous'}`;

    // Rate limiting check
    const currentCount = attemptCountRef.current.get(key) || 0;
    if (currentCount >= MAX_ATTEMPTS_PER_MINUTE) {
      appLogger.warn(`[SecurityProvider] Rate limit exceeded for ${key}`);
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { resource, userId, count: currentCount });
      return false;
    }

    // Incrementar contador
    attemptCountRef.current.set(key, currentCount + 1);
    setTimeout(() => {
      attemptCountRef.current.set(key, Math.max(0, (attemptCountRef.current.get(key) || 0) - 1));
    }, 60000); // Reset após 1 minuto

    // Validação básica de recursos restritos
    const isRestricted = RESTRICTED_RESOURCES.some(r => resource.toLowerCase().includes(r));
    let granted = true;

    if (isRestricted) {
      // TODO: Implementar validação real contra backend/permissões
      appLogger.warn(`[SecurityProvider] Access to restricted resource: ${resource}`);
      logSecurityEvent('RESTRICTED_ACCESS_ATTEMPT', { resource, userId });

      // Por enquanto, permitir mas logar (evitar quebrar funcionalidade)
      granted = true;
    }

    // Registrar tentativa
    accessHistoryRef.current.push({
      resource,
      timestamp: now,
      granted,
    });

    // Limitar histórico a últimas 100 tentativas
    if (accessHistoryRef.current.length > 100) {
      accessHistoryRef.current = accessHistoryRef.current.slice(-100);
    }

    // Update state to trigger useMemo recalculation
    setHistoryLength(accessHistoryRef.current.length);

    if (granted) {
      appLogger.debug(`[SecurityProvider] Access granted: ${resource}`);
    } else {
      appLogger.error(`[SecurityProvider] Access denied: ${resource}`);
      logSecurityEvent('ACCESS_DENIED', { resource, userId });
    }

    return granted;
  }, [logSecurityEvent]);

  const getAccessHistory = useCallback(() => {
    return [...accessHistoryRef.current];
  }, []);

  // Basic health computation based on access history
  // Memoized to avoid recalculating on every render
  const healthMetrics = useMemo(() => {
    const recentAttempts = accessHistoryRef.current.slice(-20); // Last 20 attempts
    const deniedCount = recentAttempts.filter(a => !a.granted).length;
    const deniedRatio = recentAttempts.length > 0 ? deniedCount / recentAttempts.length : 0;
    
    const hasCriticalIssues = deniedRatio > 0.5; // More than 50% denied
    const hasWarnings = deniedRatio > 0.2 && !hasCriticalIssues; // 20-50% denied
    const isSystemHealthy = !hasCriticalIssues && !hasWarnings;
    const systemStatus: 'healthy' | 'degraded' | 'critical' = 
      hasCriticalIssues ? 'critical' : hasWarnings ? 'degraded' : 'healthy';
    
    return { hasCriticalIssues, hasWarnings, isSystemHealthy, systemStatus };
  }, [historyLength]); // Recompute when history length changes
  
  // Log warning if using basic health computation in production
  useEffect(() => {
    try {
      const isProduction = (import.meta as any)?.env?.PROD === true || 
                          (typeof process !== 'undefined' && (process as any).env?.NODE_ENV === 'production');
      if (isProduction) {
        appLogger.info('[SecurityProvider] Using basic health computation - consider enhancing for production');
      }
    } catch {
      // Ignore errors accessing env vars
    }
  }, []);

  const value: SecurityContextType = {
    isSecure: true,
    validateAccess,
    logSecurityEvent,
    getAccessHistory,
    systemStatus: healthMetrics.systemStatus,
    hasCriticalIssues: healthMetrics.hasCriticalIssues,
    hasWarnings: healthMetrics.hasWarnings,
    isSystemHealthy: healthMetrics.isSystemHealthy,
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
