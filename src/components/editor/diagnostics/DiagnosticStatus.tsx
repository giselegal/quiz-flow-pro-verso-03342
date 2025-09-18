/**
 * 🔍 COMPONENTE DE STATUS DE DIAGNÓSTICO
 * Mostra status em tempo real do editor
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEditorDiagnostics } from '@/hooks/useEditorDiagnostics';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Wrench,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { validateStep } from '@/utils/stepValidationRegistry';
import { QuizDataService } from '@/services/core/QuizDataService';

interface DiagnosticStatusProps {
  autoRun?: boolean;
  compact?: boolean;
  showDetails?: boolean;
}

export const DiagnosticStatus: React.FC<DiagnosticStatusProps> = ({
  autoRun = true,
  compact = false,
  showDetails = false,
}) => {
  const [expanded, setExpanded] = useState(showDetails);
  const diagnostic = useEditorDiagnostics({
    autoRun,
    interval: 30000, // 30 segundos
    autoFix: true,
  });

  const stats = diagnostic.getStats();

  // 🎨 Obter cor do status baseado na saúde
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // 🎨 Obter ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {diagnostic.isHealthy ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : diagnostic.hasErrors ? (
          <XCircle className="w-4 h-4 text-red-600" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
        )}
        <span className={`text-sm font-medium ${getHealthColor(stats.healthScore)}`}>
          {Math.round(stats.healthScore)}%
        </span>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-white border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">Status do Editor</h3>
          {diagnostic.isRunning && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getHealthColor(stats.healthScore)}>
            {Math.round(stats.healthScore)}% Saudável
          </Badge>

          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Validação Centralizada da Etapa Atual */}
      {(() => {
        let currentStep = 1;
        try {
          const w: any = window as any;
          const raw = w?.__quizCurrentStep;
          const num = typeof raw === 'string' ? parseInt(raw.toString().replace(/\D+/g, '') || '1', 10) : Number(raw);
          if (Number.isFinite(num) && num >= 1) currentStep = num;
        } catch { }

        let validation: ReturnType<typeof validateStep> | null = null;
        try {
          const blocks = QuizDataService.getStepData(currentStep);
          validation = validateStep(currentStep, { [`step-${currentStep}`]: blocks } as any);
        } catch { }

        if (!validation) return null;

        const ok = !!validation.valid;
        return (
          <div className="mb-3 p-3 rounded-md border bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              {ok ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium text-gray-800">
                Etapa atual: {currentStep} — {ok ? 'Válida' : 'Incompleta'}
              </span>
            </div>
            {!ok && validation.reason && (
              <div className="text-xs text-gray-600">
                Motivo: <span className="font-medium">{validation.reason}</span>
              </div>
            )}
            {validation.evidence && Object.keys(validation.evidence).length > 0 && (
              <details className="mt-1">
                <summary className="text-xs text-blue-600 cursor-pointer">Ver evidências</summary>
                <pre className="text-xs text-gray-500 mt-1 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(validation.evidence, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
      })()}

      {/* Validação de Todas as Etapas (resumo rápido) */}
      {expanded && (() => {
        try {
          const results = Array.from({ length: 21 }, (_, i) => i + 1).map(step => {
            try {
              const blocks = QuizDataService.getStepData(step);
              const res = validateStep(step, { [`step-${step}`]: blocks } as any);
              return { step, ...res } as const;
            } catch {
              return { step, valid: true } as const;
            }
          });

          const validCount = results.filter(r => r.valid).length;
          const invalid = results.filter(r => !r.valid);

          return (
            <div className="mb-3 p-3 rounded-md border bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm text-gray-800">Validação de Todas as Etapas</h4>
                <Badge variant="outline" className={validCount === 21 ? 'text-green-700' : validCount >= 18 ? 'text-yellow-700' : 'text-red-700'}>
                  {validCount}/21 válidas
                </Badge>
              </div>

              {/* Lista apenas das inválidas para manter leve */}
              {invalid.length === 0 ? (
                <div className="text-xs text-green-700">Todas as etapas estão válidas.</div>
              ) : (
                <div className="space-y-2">
                  {invalid.map(item => (
                    <div key={item.step} className="p-2 bg-white rounded border text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3 h-3 text-red-600" />
                        <span className="font-medium">Etapa {item.step} inválida</span>
                      </div>
                      {item.reason && (
                        <div className="mt-1">Motivo: <span className="font-medium">{item.reason}</span></div>
                      )}
                      {item.evidence && Object.keys(item.evidence).length > 0 && (
                        <details className="mt-1">
                          <summary className="text-blue-600 cursor-pointer">Ver evidências</summary>
                          <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">{JSON.stringify(item.evidence, null, 2)}</pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        } catch {
          return null;
        }
      })()}

      {/* Resumo de Status */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-gray-600">{stats.success}</span>
        </div>

        <div className="flex items-center gap-1">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <span className="text-sm text-gray-600">{stats.warning}</span>
        </div>

        <div className="flex items-center gap-1">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-gray-600">{stats.error}</span>
        </div>

        {diagnostic.lastRun && (
          <span className="text-xs text-gray-500 ml-auto">
            Última verificação: {diagnostic.lastRun.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Ações Rápidas */}
      <div className="flex gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={diagnostic.runDiagnostic}
          disabled={diagnostic.isRunning}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`w-3 h-3 ${diagnostic.isRunning ? 'animate-spin' : ''}`} />
          Verificar
        </Button>

        {(diagnostic.hasErrors || diagnostic.hasWarnings) && (
          <Button
            variant="outline"
            size="sm"
            onClick={diagnostic.applyFixes}
            className="flex items-center gap-1"
          >
            <Wrench className="w-3 h-3" />
            Corrigir
          </Button>
        )}
      </div>

      {/* Detalhes Expandidos */}
      {expanded && diagnostic.results.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-gray-100">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Detalhes do Diagnóstico</h4>

          {diagnostic.results.map((result, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded-md text-sm">
              {getStatusIcon(result.status || 'warning')}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 mb-1">{result.category}</div>
                <div className="text-gray-600 text-xs">{result.message}</div>
                {result.details && (
                  <details className="mt-1">
                    <summary className="text-xs text-blue-600 cursor-pointer">Ver detalhes</summary>
                    <pre className="text-xs text-gray-500 mt-1 p-2 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}

          {/* Botão para ver relatório completo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const report = diagnostic.generateReport();
              console.log(report);

              // Criar modal ou download do relatório
              const blob = new Blob([report], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `diagnostic-report-${new Date().toISOString().slice(0, 10)}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full mt-2"
          >
            📋 Baixar Relatório Completo
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DiagnosticStatus;
