/**
 * 🎯 FASE 4 - Monitoramento e Otimização
 * 
 * Sistema completo de monitoramento de performance e erros
 * 
 * MÓDULOS:
 * - PerformanceMonitor: Métricas de performance (TTI, re-renders, memory, bundle)
 * - ErrorTracker: Rastreamento de erros com categorização
 * - NetworkMonitor: Monitoramento de requisições de rede (já existente)
 * 
 * @phase FASE 4 - Monitoramento e Otimização
 */

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export {
  performanceMonitor,
  type PerformanceMetric,
  type PerformanceAlert,
  type PerformanceReport,
} from './PerformanceMonitor';

// ============================================================================
// ERROR TRACKING
// ============================================================================

export {
  errorTracker,
  type ErrorSeverity,
  type ErrorCategory,
  type ErrorContext,
  type TrackedError,
  type ErrorStats,
} from './ErrorTracker';

// ============================================================================
// NETWORK MONITORING (já existente)
// ============================================================================

export { networkMonitor } from './NetworkMonitor';

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

import { performanceMonitor } from './PerformanceMonitor';
import { errorTracker } from './ErrorTracker';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Inicializar todo o sistema de monitoramento
 */
export function initializeMonitoring(options?: {
  sentryDsn?: string;
  environment?: string;
}) {
  performanceMonitor.initialize();
  errorTracker.initialize(options);
  
  appLogger.info('Sistema de monitoramento inicializado');
}

/**
 * Obter relatório completo de monitoramento
 */
export function getMonitoringReport(periodMs: number = 60000) {
  return {
    performance: performanceMonitor.getReport(periodMs),
    errors: errorTracker.getStats(periodMs),
    timestamp: Date.now(),
  };
}

/**
 * Limpar todos os dados de monitoramento
 */
export function clearMonitoringData() {
  performanceMonitor.clear();
  errorTracker.clear();
  
  appLogger.info('Dados de monitoramento limpos');
}

/**
 * Export relatório em JSON
 */
export function exportMonitoringReport(periodMs: number = 60000): string {
  const report = getMonitoringReport(periodMs);
  return JSON.stringify(report, null, 2);
}

// ============================================================================
// AUTO-INITIALIZE (se em browser)
// ============================================================================

if (typeof window !== 'undefined') {
  // Auto-initialize em desenvolvimento
  if ((import.meta as any).env?.DEV) {
    initializeMonitoring();
    appLogger.info('Monitoramento auto-inicializado (DEV mode)');
  }
}
