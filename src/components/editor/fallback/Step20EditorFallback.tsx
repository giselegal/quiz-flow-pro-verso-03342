import React, { useEffect, useState } from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import Step20FallbackTemplate from '@/components/quiz/Step20FallbackTemplate';

interface Step20EditorFallbackProps {
  blocks: any[];
  onSelectBlock?: (id: string) => void;
  selectedBlockId?: string | null;
  onUpdateBlock?: (id: string, updates: any) => void;
  onDeleteBlock?: (id: string) => void;
}

/**
 * 🛡️ FALLBACK INTELIGENTE PARA ETAPA 20 NO EDITOR
 * 
 * FASE 2: Sistema de fallback robusto para o editor
 * - Detecta se result-header-inline está falhando
 * - Usa Step20FallbackTemplate quando necessário
 * - Monitora loading states do EditorPro
 * - Garante que a etapa 20 sempre tenha conteúdo
 */
export const Step20EditorFallback: React.FC<Step20EditorFallbackProps> = ({
  blocks,
}) => {
  const { primaryStyle, isLoading, error } = useQuizResult();
  const [showFallback, setShowFallback] = useState(false);

  // 🔍 Monitor storage and result state
  useEffect(() => {
    // Determine if we should show fallback
    const hasResultHeaderBlock = blocks.some(block => block.type === 'result-header-inline');
    const hasValidResult = Boolean(primaryStyle) && !error;
    const isStillLoading = isLoading;
    
    // Show fallback if:
    // 1. No result-header-inline block found in template
    // 2. Error in calculation
    // 3. Loading for too long (indicates problem)
    // 4. No blocks at all (template loading failed)
    
    const shouldShowFallback = 
      !hasResultHeaderBlock || 
      error || 
      blocks.length === 0 ||
      (!hasValidResult && !isStillLoading);

    if (shouldShowFallback) {
      console.log('🛡️ [Step20EditorFallback] Ativando fallback:', {
        hasResultHeaderBlock,
        hasValidResult,
        isStillLoading,
        blocksCount: blocks.length,
        error: typeof error === 'string' ? error : 'Erro no cálculo'
      });
      setShowFallback(true);
    } else {
      setShowFallback(false);
    }
  }, [blocks, primaryStyle, isLoading, error]);

  // If we have valid blocks and no issues, render normally
  if (!showFallback && blocks.length > 0) {
    return null; // Let normal rendering proceed
  }

  // Show loading state while calculating
  if (isLoading && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mb-4"></div>
        <h2 className="text-xl font-semibold text-[#432818] mb-2">Calculando seu resultado...</h2>
        <p className="text-[#8F7A6A] text-center">
          Analisando suas respostas para descobrir seu estilo predominante
        </p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-800 mb-2">Erro no Cálculo</h2>
        <p className="text-red-600 text-center mb-4">
          {typeof error === 'string' ? error : 'Não foi possível calcular o resultado do quiz.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Recarregar Página
        </button>
      </div>
    );
  }

  // Show robust fallback template
  return (
    <div className="w-full">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-sm text-blue-800 font-medium">
            🛡️ Modo Fallback Ativo - Template de resultado robusto carregado
          </p>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Template original não disponível. Usando fallback para garantir funcionalidade.
        </p>
      </div>

      <Step20FallbackTemplate />
    </div>
  );
};