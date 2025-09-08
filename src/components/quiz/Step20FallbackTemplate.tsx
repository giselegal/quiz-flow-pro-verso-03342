/**
 * 🎯 TEMPLATE ROBUSTO PARA ETAPA 20
 * 
 * Fallback inteligente que funciona mesmo quando result-header-inline falha
 */

import React, { useEffect, useState } from 'react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStyleConfig } from '@/config/styleConfig';
import { getBestUserName } from '@/core/user/name';
import { ResultDisplay } from '@/components/ui/ResultDisplay';

interface Step20FallbackTemplateProps {
  className?: string;
  onRetry?: () => void;
}

const Step20FallbackTemplate: React.FC<Step20FallbackTemplateProps> = ({ 
  className,
  onRetry 
}) => {
  const { primaryStyle, secondaryStyles, isLoading, error, retry, hasResult } = useQuizResult();
  const [showDebug, setShowDebug] = useState(false);
  const [fallbackData, setFallbackData] = useState<any>(null);

  // Tentar carregar dados de múltiplas fontes se hook falhar
  useEffect(() => {
    if (!hasResult && !isLoading) {
      loadFallbackData();
    }
  }, [hasResult, isLoading]);

  const loadFallbackData = async () => {
    try {
      // Fonte 1: Tentar storage legado
      const legacyResult = localStorage.getItem('quizResult');
      if (legacyResult) {
        const parsed = JSON.parse(legacyResult);
        if (parsed.primaryStyle) {
          setFallbackData(parsed);
          return;
        }
      }

      // Fonte 2: Tentar sistema unificado
      const { unifiedQuizStorage } = await import('@/services/core/UnifiedQuizStorage');
      const unifiedData = unifiedQuizStorage.loadData();
      if (unifiedData.result?.primaryStyle) {
        setFallbackData(unifiedData.result);
        return;
      }

      // Fonte 3: Tentar recalcular se há seleções
      const stats = unifiedQuizStorage.getDataStats();
      if (stats.selectionsCount >= 3) {
        console.log('🔄 [Step20Fallback] Tentando recálculo automático...');
        const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
        const result = await calculateAndSaveQuizResult();
        if (result) {
          setFallbackData(result);
        }
      }
    } catch (error) {
      console.error('❌ [Step20Fallback] Erro ao carregar dados:', error);
    }
  };

  const handleForceRecalculate = async () => {
    try {
      console.log('🔄 [Step20Fallback] Forçando recálculo...');
      const { calculateAndSaveQuizResult } = await import('@/utils/quizResultCalculator');
      await calculateAndSaveQuizResult();
      retry?.();
      onRetry?.();
      window.location.reload(); // Fallback final
    } catch (error) {
      console.error('❌ [Step20Fallback] Falha no recálculo forçado:', error);
    }
  };

  // Determinar fonte de dados
  const resultData = primaryStyle ? { primaryStyle, secondaryStyles } : fallbackData;
  const resultStyle = resultData?.primaryStyle;

  // Estados de erro
  if (error && !fallbackData) {
    return (
      <div className={cn('max-w-4xl mx-auto p-6', className)}>
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Problema no Cálculo do Resultado
          </h2>
          <p className="text-red-700 mb-6">{error}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleForceRecalculate}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Forçar Recálculo
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowDebug(!showDebug)}
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              {showDebug ? 'Ocultar' : 'Mostrar'} Debug
            </Button>
          </div>

          {showDebug && (
            <div className="mt-6 text-left bg-white rounded p-4 text-sm">
              <h4 className="font-medium mb-2">Informações de Debug:</h4>
              <pre className="text-xs text-gray-600 overflow-auto">
                {JSON.stringify({
                  error,
                  hasResult,
                  isLoading,
                  fallbackData: Boolean(fallbackData),
                  timestamp: new Date().toISOString()
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Estado de loading
  if (isLoading && !resultData) {
    return (
      <div className={cn('max-w-4xl mx-auto p-6', className)}>
        <div className="text-center p-8">
          <div className="animate-spin w-12 h-12 border-4 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-[#432818] mb-2">
            Calculando Seu Resultado...
          </h2>
          <p className="text-[#6B4F43]">
            Analisando suas respostas para descobrir seu estilo único.
          </p>
        </div>
      </div>
    );
  }

  // Fallback final: resultado genérico
  if (!resultStyle) {
    return (
      <div className={cn('max-w-4xl mx-auto p-6', className)}>
        <div className="text-center bg-gray-50 border border-gray-200 rounded-lg p-8">
          <Gift className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Seu Resultado Está Quase Pronto!
          </h2>
          <p className="text-gray-600 mb-6">
            Estamos finalizando a análise do seu perfil de estilo.
          </p>
          
          <Button
            onClick={handleForceRecalculate}
            className="bg-[#B89B7A] hover:bg-[#A08966] text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Finalizar Análise
          </Button>
        </div>
      </div>
    );
  }

  // Resultado válido encontrado
  const styleLabel = resultStyle.style || resultStyle.category || 'Seu Estilo';
  const percentage = resultStyle.percentage || 0;
  const userName = resultData?.userData?.name || getBestUserName() || 'Você';

  // Obter configuração do estilo
  const styleConfig = getStyleConfig(styleLabel);

  return (
    <div className={cn('max-w-4xl mx-auto p-6 space-y-8', className)}>
      {/* ✅ USAR O NOVO RESULTADO DISPLAY ESTRUTURADO */}
      <ResultDisplay
        username={userName}
        styleName={styleLabel}
        percentage={percentage}
        image={styleConfig?.image || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'}
        guideImage={styleConfig?.guideImage || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'}
        description={styleConfig?.description || 'Seu estilo único foi revelado com base nas suas respostas.'}
        tips={styleConfig?.specialTips || []}
        category={styleConfig?.category}
      />
    </div>
  );
};

export default Step20FallbackTemplate;