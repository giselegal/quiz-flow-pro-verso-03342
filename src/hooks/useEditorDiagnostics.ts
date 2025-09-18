/**
 * 🔍 HOOK DE DIAGNÓSTICO INTEGRADO
 * Hook para monitorar e diagnosticar o editor em tempo real
 */

import * as DiagnosticsModule from '@/utils/editorDiagnostics';
import type { DiagnosticResult as CoreDiagnosticResult, DiagnosticDetails as CoreDiagnosticDetails } from '@/utils/editorDiagnostics';

type DiagnosticResult = {
  success: boolean;
  message: string;
  data?: any;
  timestamp: number;
  status?: 'success' | 'warning' | 'error';
  category?: string;
  details?: any;
};

const EditorDiagnostics = {
  runFullDiagnostic: async (): Promise<DiagnosticResult[]> => {
    try {
      const core: CoreDiagnosticResult = await DiagnosticsModule.runCompleteDiagnostics();
      const { summary, details, timestamp } = core;

      const summaryMessage = `Issues: total=${summary.totalIssues}, critical=${summary.criticalIssues}, warnings=${summary.warningIssues}, info=${summary.infoIssues}, fixable=${summary.fixableIssues}, fixed=${summary.fixedIssues}`;

      const items: DiagnosticResult[] = [];

      // Item de resumo (considera sucesso quando não há críticos)
      items.push({
        success: summary.criticalIssues === 0,
        message: summaryMessage,
        data: summary,
        timestamp: timestamp || Date.now(),
        status: summary.criticalIssues === 0 ? 'success' : 'error',
        category: 'Editor Health',
        details,
      });

      // Mapear cada detalhe como item separado
      if (Array.isArray(details)) {
        for (const d of details as CoreDiagnosticDetails[]) {
          items.push({
            success: d.type !== 'critical',
            message: d.message,
            data: { location: d.location, code: d.code, fixable: d.fixable, fixed: d.fixed },
            timestamp: timestamp || Date.now(),
            status: d.type === 'critical' ? 'error' : d.type === 'warning' ? 'warning' : 'success',
            category: d.type.toUpperCase(),
            details: d,
          });
        }
      }

      return items;
    } catch (e: any) {
      return [
        {
          success: false,
          message: e?.message || String(e),
          timestamp: Date.now(),
          status: 'error',
          category: 'Editor Health',
        },
      ];
    }
  },
  applyAutomaticFixes: async (): Promise<DiagnosticResult[]> => [
    { success: true, message: 'No auto-fixes available', timestamp: Date.now() },
  ],
  generateReport: (): string => {
    try { return JSON.stringify((window as any).__EDITOR_DIAGNOSTICS__ || {}, null, 2); } catch { return '{}'; }
  },
};
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { useCallback, useEffect, useState } from 'react';

interface DiagnosticState {
  isRunning: boolean;
  results: DiagnosticResult[];
  lastRun: Date | null;
  autoFix: boolean;
}

export const useEditorDiagnostics = (options?: {
  autoRun?: boolean;
  interval?: number;
  autoFix?: boolean;
}) => {
  const { autoRun = false, interval = 30000, autoFix = true } = options || {};

  const [state, setState] = useState<DiagnosticState>({
    isRunning: false,
    results: [],
    lastRun: null,
    autoFix,
  });

  // 🔍 Executar diagnóstico
  const runDiagnostic = useCallback(async () => {
    // Evitar concorrência de execuções
    // Ref local para checar e bloquear reentradas
    // Não usamos state.isRunning diretamente para evitar stale closures
    const runningRef = (runDiagnostic as any)._runningRef || ((runDiagnostic as any)._runningRef = { current: false });
    if (runningRef.current) {
      return state.results;
    }
    runningRef.current = true;

    setState(prev => ({ ...prev, isRunning: true }));

    try {
      console.log('🔍 Iniciando diagnóstico do editor...');
      const results = await EditorDiagnostics.runFullDiagnostic();

      setState(prev => ({
        ...prev,
        results,
        lastRun: new Date(),
        isRunning: false,
      }));

      // Auto-fix se habilitado e há erros
      if (autoFix && results.some(r => r.status === 'error')) {
        console.log('🔧 Aplicando correções automáticas...');
        await EditorDiagnostics.applyAutomaticFixes();
      }

      return results;
    } catch (error) {
      console.error('❌ Erro no diagnóstico:', error);
      setState(prev => ({ ...prev, isRunning: false }));
      throw error;
    } finally {
      // Libera o lock de execução
      runningRef.current = false;
    }
  }, [autoFix, state.results]);

  // 📊 Obter estatísticas
  const getStats = useCallback(() => {
    const { results } = state;
    return {
      total: results.length,
      success: results.filter(r => r.status === 'success').length,
      warning: results.filter(r => r.status === 'warning').length,
      error: results.filter(r => r.status === 'error').length,
      healthScore:
        results.length > 0
          ? (results.filter(r => r.status === 'success').length / results.length) * 100
          : 0,
    };
  }, [state.results]);

  // 🔧 Aplicar correções manuais
  const applyFixes = useCallback(async () => {
    try {
      console.log('🔧 Aplicando correções manuais...');
      const fixes = await EditorDiagnostics.applyAutomaticFixes();

      // Re-executar diagnóstico após correções
      await runDiagnostic();

      return fixes;
    } catch (error) {
      console.error('❌ Erro ao aplicar correções:', error);
      throw error;
    }
  }, [runDiagnostic]);

  // 📋 Gerar relatório
  const generateReport = useCallback(() => {
    return EditorDiagnostics.generateReport();
  }, []);

  // 🔄 Auto-run periódico
  useEffect(() => {
    if (!autoRun) return;

    const initialTimeoutRef = { id: null as null | number };
    const intervalRef = { id: null as null | number };

    // Executar diagnóstico inicial
    const runInitialDiagnostic = () => {
      const id = PerformanceOptimizer.schedule(
        () => {
          runDiagnostic().catch(error => {
            console.error('❌ Erro no diagnóstico automático:', error);
          });
        },
        2000,
        'timeout',
        { cancelOnNav: true, label: 'editor-diagnostic-initial' }
      ); // Aguardar 2s para o editor carregar
      if (typeof id === 'number') initialTimeoutRef.id = id;
    };

    runInitialDiagnostic();

    // Configurar execução periódica
    const intervalId = PerformanceOptimizer.scheduleInterval(
      () => {
        runDiagnostic().catch(error => {
          console.error('❌ Erro no diagnóstico periódico:', error);
        });
      },
      interval,
      'timeout',
      { cancelOnNav: true, label: 'editor-diagnostic-interval' }
    );
    if (typeof intervalId === 'number') intervalRef.id = intervalId;

    return () => {
      if (typeof intervalRef.id === 'number') {
        PerformanceOptimizer.cancelInterval(intervalRef.id);
      }
      if (typeof initialTimeoutRef.id === 'number') {
        PerformanceOptimizer.cancelTimeout(initialTimeoutRef.id);
      }
      // Segurança extra: cancelar timers marcados para navegação
      try { PerformanceOptimizer.cancelOnNavigation(); } catch { }
    };
  }, [autoRun, interval, runDiagnostic]);

  return {
    // Estado
    ...state,

    // Ações
    runDiagnostic,
    applyFixes,
    generateReport,

    // Utilitários
    getStats,

    // Status helpers
    hasErrors: state.results.some(r => r.status === 'error'),
    hasWarnings: state.results.some(r => r.status === 'warning'),
    isHealthy: state.results.length > 0 && !state.results.some(r => r.status === 'error'),
  };
};

export default useEditorDiagnostics;
