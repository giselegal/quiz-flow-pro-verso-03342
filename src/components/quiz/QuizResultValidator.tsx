/**
 * 🔍 VALIDADOR DE RESULTADO DO QUIZ
 * 
 * Componente para diagnosticar e corrigir problemas com cálculo de resultado
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  fix?: () => void;
  fixLabel?: string;
}

export const QuizResultValidator: React.FC = () => {
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-check na montagem e quando houver mudanças relevantes
  useEffect(() => {
    checkValidation();

    const handleChange = () => checkValidation();
    window.addEventListener('quiz-result-updated', handleChange);
    window.addEventListener('quiz-answer-updated', handleChange);
    
    return () => {
      window.removeEventListener('quiz-result-updated', handleChange);
      window.removeEventListener('quiz-answer-updated', handleChange);
    };
  }, []);

  const checkValidation = async () => {
    setIsChecking(true);
    const foundIssues: ValidationIssue[] = [];

    try {
      const { StorageService } = await import('@/services/core/StorageService');
      const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
      
      // 1. Verificar resultado nos storages
      const legacyResult = StorageService.safeGetJSON('quizResult');
      const unifiedResult = unifiedQuizStorage.loadData().result;
      
      if (!legacyResult && !unifiedResult) {
        foundIssues.push({
          type: 'error',
          message: 'Nenhum resultado encontrado em ambos os sistemas de storage',
          fix: async () => {
            const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
            await calculateAndSaveQuizResult();
            checkValidation();
          },
          fixLabel: 'Calcular Resultado'
        });
      } else if (legacyResult && !unifiedResult) {
        foundIssues.push({
          type: 'warning',
          message: 'Resultado existe apenas no sistema legado',
          fix: () => {
            unifiedQuizStorage.saveResult(legacyResult);
            checkValidation();
          },
          fixLabel: 'Sincronizar'
        });
      } else if (unifiedResult && !legacyResult) {
        foundIssues.push({
          type: 'warning',
          message: 'Resultado existe apenas no sistema unificado',
          fix: () => {
            StorageService.safeSetJSON('quizResult', unifiedResult);
            checkValidation();
          },
          fixLabel: 'Sincronizar'
        });
      }

      // 2. Verificar qualidade do resultado
      const result = legacyResult || unifiedResult;
      if (result) {
        if (!result.primaryStyle) {
          foundIssues.push({
            type: 'error',
            message: 'Resultado existe mas não tem estilo primário',
          });
        } else if (!result.primaryStyle.style) {
          foundIssues.push({
            type: 'warning',
            message: 'Estilo primário sem nome definido',
          });
        }

        if (!result.secondaryStyles || result.secondaryStyles.length === 0) {
          foundIssues.push({
            type: 'info',
            message: 'Nenhum estilo secundário encontrado',
          });
        }
      }

      // 3. Verificar dados de entrada
      const unifiedData = unifiedQuizStorage.loadData();
      const stats = unifiedQuizStorage.getDataStats();
      
      if (stats.selectionsCount < 5) {
        foundIssues.push({
          type: 'warning',
          message: `Apenas ${stats.selectionsCount} perguntas respondidas (recomendado: 10+)`,
        });
      }

      if (!unifiedData.formData.userName && !unifiedData.formData.name) {
        foundIssues.push({
          type: 'info',
          message: 'Nome do usuário não foi coletado',
        });
      }

      // 4. Verificar inconsistências entre sistemas
      const legacySelections = StorageService.safeGetJSON('userSelections') || {};
      const unifiedSelections = unifiedData.selections;
      
      const legacyCount = Object.keys(legacySelections).length;
      const unifiedCount = Object.keys(unifiedSelections).length;
      
      if (legacyCount > 0 && unifiedCount > 0 && Math.abs(legacyCount - unifiedCount) > 2) {
        foundIssues.push({
          type: 'warning',
          message: `Inconsistência de dados: Legacy(${legacyCount}) vs Unificado(${unifiedCount})`,
          fix: () => {
            // Sincronizar dados (priorizar sistema com mais dados)
            if (legacyCount > unifiedCount) {
              Object.entries(legacySelections).forEach(([key, value]) => {
                unifiedQuizStorage.updateSelections(key, value as string[]);
              });
            } else {
              StorageService.safeSetJSON('userSelections', unifiedSelections);
            }
            checkValidation();
          },
          fixLabel: 'Sincronizar Dados'
        });
      }

    } catch (error: any) {
      foundIssues.push({
        type: 'error',
        message: `Erro durante validação: ${(error as Error)?.message || 'Erro desconhecido'}`,
      });
    }

    setIssues(foundIssues);
    setIsVisible(foundIssues.length > 0);
    setIsChecking(false);
  };

  const getIssueIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getIssueColor = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Validação do Quiz
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0"
        >
          ✕
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            Tudo funcionando corretamente!
          </div>
        ) : (
          issues.map((issue, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-2 p-2 rounded border text-sm',
                getIssueColor(issue.type)
              )}
            >
              {getIssueIcon(issue.type)}
              <div className="flex-1">
                <p className="text-gray-800">{issue.message}</p>
                {issue.fix && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={issue.fix}
                    className="mt-1 h-6 text-xs"
                  >
                    {issue.fixLabel || 'Corrigir'}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={checkValidation}
          disabled={isChecking}
          className="flex-1"
        >
          {isChecking ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" />
              Verificar Novamente
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuizResultValidator;