/**
 * 🔍 HOOK DE DIAGNÓSTICO INTEGRADO
 * Hook para monitorar e diagnosticar o editor em tempo real
 */

import { runCompleteDiagnostics } from '@/utils/editorDiagnostics';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { useCallback, useEffect, useState } from 'react';

type DiagnosticStatus = 'success' | 'warning' | 'error';

interface SimpleDiagnosticResult {
  category: string;
  status: DiagnosticStatus;
  message: string;
  details: any;
}

interface DiagnosticState {
  isRunning: boolean;
  results: SimpleDiagnosticResult[];
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
    setState(prev => ({ ...prev, isRunning: true }));

    try {
      console.log('🔍 Iniciando diagnóstico do editor...');
      const { summary, details } = await runCompleteDiagnostics();

      // Normaliza em uma lista simples com status
      const results: SimpleDiagnosticResult[] = Object.entries(details).map(([category, data]: [string, any]) => ({
        category,
        status: data?.success ? 'success' : 'error',
        message: data?.message || 'Sem mensagem',
        details: data,
      }));
      // Garante inclusão do resumo
      results.push({
        category: 'summary',
        status: summary?.success ? 'success' : 'error',
        message: summary?.message || 'Resumo',
        details: summary,
      });

      setState(prev => ({
        ...prev,
        results,
        lastRun: new Date(),
        isRunning: false,
      }));

      // Auto-fix (placeholder): hoje não há rotina automática no módulo editorDiagnostics.
      // Podemos plugar futuramente uma rotina aqui.

      return results;
    } catch (error) {
      console.error('❌ Erro no diagnóstico:', error);
      setState(prev => ({ ...prev, isRunning: false }));
      throw error;
    }
  }, [autoFix]);

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
      // Placeholder: sem fix automático central aqui; apenas reexecuta o diagnóstico
      const fixes: any[] = [];

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
    const { results, lastRun } = state as any;
    const lines = [
      '📋 RELATÓRIO DE DIAGNÓSTICO DO EDITOR',
      '====================================',
      lastRun ? `Última execução: ${lastRun.toISOString()}` : 'Ainda não executado',
      ''
    ];
    for (const r of results as any[]) {
      const icon = r.status === 'success' ? '✅' : r.status === 'warning' ? '⚠️' : '❌';
      lines.push(`${icon} ${r.category}: ${r.message}`);
    }
    return lines.join('\n');
  }, [state]);

  // 🔄 Auto-run periódico
  useEffect(() => {
    if (!autoRun) return;

    // Executar diagnóstico inicial
    const runInitialDiagnostic = () => {
      PerformanceOptimizer.schedule(
        () => {
          runDiagnostic().catch(error => {
            console.error('❌ Erro no diagnóstico automático:', error);
          });
        },
        2000,
        'timeout'
      ); // Aguardar 2s para o editor carregar
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
      'timeout'
    );

    return () => {
      if (typeof intervalId === 'number') {
        clearInterval(intervalId);
      }
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
