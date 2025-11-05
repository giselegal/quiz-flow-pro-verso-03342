import { useState, useCallback } from 'react';

export interface A11yIssue {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: string[];
}

export interface AuditResult {
  issues: A11yIssue[];
  passes: number;
  incomplete: number;
  timestamp: Date;
}

/**
 * Hook para executar auditorias de acessibilidade com axe-core
 * 
 * @example
 * ```tsx
 * const { runAudit, result, isRunning, error } = useAccessibilityAudit();
 * 
 * // Executar auditoria
 * await runAudit();
 * 
 * // Acessar resultados
 * console.log(result?.issues);
 * ```
 */
export function useAccessibilityAudit() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAudit = useCallback(async (element?: HTMLElement) => {
    setIsRunning(true);
    setError(null);

    try {
      // Importar axe-core dinamicamente
      const axe = await import('axe-core');

      // Configurar regras WCAG 2.1 AA
      const config = {
        runOnly: {
          type: 'tag' as const,
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      };

      // Executar análise
      const target = element || document;
      const axeResults = await axe.default.run(target, config);

      // Processar violações
      const issues: A11yIssue[] = axeResults.violations.map((violation) => ({
        id: violation.id,
        impact: (violation.impact || 'minor') as A11yIssue['impact'],
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map((node) => {
          const html = node.html;
          return html.length > 150 ? html.substring(0, 150) + '...' : html;
        }),
      }));

      // Ordenar por severidade
      const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
      issues.sort((a, b) => severityOrder[a.impact] - severityOrder[b.impact]);

      const auditResult: AuditResult = {
        issues,
        passes: axeResults.passes.length,
        incomplete: axeResults.incomplete.length,
        timestamp: new Date(),
      };

      setResult(auditResult);
      return auditResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('❌ Erro ao executar auditoria:', err);
      throw err;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    runAudit,
    clear,
    result,
    isRunning,
    error,
  };
}
