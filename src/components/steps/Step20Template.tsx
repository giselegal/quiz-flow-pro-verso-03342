import React, { useEffect, useState, useRef, useMemo } from 'react';
import { computeEffectivePrimaryPercentage } from '@/core/result/percentage';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { cn } from '@/lib/utils';
import { getBestUserName } from '@/core/user/name';
import { getStyleConfig } from '@/config/styleConfig';
import { ResultDisplay } from '@/components/ui/ResultDisplay';
// 🎯 FASE 1: Usar apenas o motor principal e cache
import { quizResultsService } from '@/services/quizResultsService';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';
import { resultCacheService } from '@/services/core/ResultCacheService';

interface Step20TemplateProps {
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  blocks?: Array<{
    id: string;
    type: string;
    properties: Record<string, any>;
  }>;
}

const Step20Template: React.FC<Step20TemplateProps> = ({
  className = '',
  onPropertyChange: _onPropertyChange,
  blocks = []
}) => {
  // 🎯 FASE 1: Usar apenas useQuizResult (que deve ser otimizado) e evitar múltiplos motores
  const { primaryStyle, secondaryStyles } = useQuizResult();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [neutralFixTried, setNeutralFixTried] = useState(false);
  // Evitar recálculos concorrentes/duplicados (StrictMode)
  const inFlightRef = useRef(false);
  const triedInitialRecalcRef = useRef(false);

  // 🎯 OTIMIZAÇÃO: Validação memoizada para evitar recálculos desnecessários
  const validationResult = useMemo(() => {
    const data = unifiedQuizStorage.loadData();
    const hasEnoughData = unifiedQuizStorage.hasEnoughDataForResult();
    const selectionCount = Object.keys(data.selections).length;
    const formHasName = Boolean(data.formData.userName || data.formData.name);
    
    const errors: string[] = [];
    if (selectionCount === 0) {
      errors.push('Nenhuma resposta foi registrada');
    }
    if (selectionCount < 5) {
      errors.push(`Apenas ${selectionCount} perguntas respondidas (mínimo 5)`);
    }
    if (!formHasName) {
      errors.push('Dados do usuário não encontrados');
    }

    return {
      isValid: hasEnoughData && errors.length === 0,
      errors,
      selectionCount,
      data
    };
  }, []);

  // Validar dados ao montar
  useEffect(() => {
    setValidationErrors(validationResult.errors);

    // 1) Se não há resultado válido, tentar recalcular apenas uma vez (por montagem)
    if (!primaryStyle && validationResult.isValid && !triedInitialRecalcRef.current) {
      triedInitialRecalcRef.current = true;
      handleRecalculate();
      return;
    }

    // 2) Se veio um fallback "Neutro" mas temos dados válidos, forçar um recálculo uma única vez
    const isNeutral = Boolean(primaryStyle &&
      ((primaryStyle.style || '').toLowerCase() === 'neutro' || (primaryStyle.category || '').toLowerCase() === 'neutro'));
    if (validationResult.isValid && isNeutral && !neutralFixTried) {
      setNeutralFixTried(true);
      handleRecalculate();
    }
  }, [primaryStyle, neutralFixTried, validationResult]);

  // 🎯 FASE 1: Usar apenas quizResultsService como motor principal com cache
  const handleRecalculate = async () => {
    if (inFlightRef.current) return; // evita concorrência e double-fire do StrictMode
    inFlightRef.current = true;
    setIsLoading(true);
    
    try {
      const { data } = validationResult;
      const userName = data.formData.userName || data.formData.name || '';

      // 1. Verificar cache primeiro
      const cachedResult = resultCacheService.get(data.selections, userName);
      if (cachedResult) {
        console.log('✅ Resultado recuperado do cache');
        // Atualizar armazenamento unificado com resultado do cache
        unifiedQuizStorage.saveResult(cachedResult);
        setValidationErrors([]);
        return;
      }

      // 2. Calcular usando apenas o motor principal
      console.log('🔄 Calculando resultado usando motor principal...');
      const session = {
        id: data.metadata?.currentStep?.toString() || 'step20',
        session_id: 'step20-session',
        responses: convertSelectionsToResponses(data.selections),
        current_step: 20
      };

      const results = await quizResultsService.calculateResults(session);
      
      if (results) {
        // 3. Converter para formato compatível e armazenar no cache
        const compatibleResult = convertToCompatibleFormat(results, userName);
        
        // 4. Armazenar no cache para evitar recálculos futuros
        resultCacheService.set(data.selections, compatibleResult, userName);
        
        // 5. Salvar no armazenamento unificado
        unifiedQuizStorage.saveResult(compatibleResult);
        
        setValidationErrors([]);
        console.log('✅ Resultado calculado e armazenado com sucesso');
      } else {
        setValidationErrors(['Falha ao calcular resultado']);
      }
    } catch (error) {
      console.error('❌ Erro durante recálculo:', error);
      setValidationErrors(['Erro durante recálculo']);
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  };

  // Métodos auxiliares para conversão de dados
  const convertSelectionsToResponses = (selections: Record<string, string[]>): Record<string, any> => {
    const responses: Record<string, any> = {};
    
    Object.entries(selections).forEach(([questionId, selectedOptions]) => {
      // Extrair número da etapa do questionId (ex: "step-3" -> "3")
      const stepMatch = questionId.match(/step-?(\d+)/);
      const stepNumber = stepMatch ? stepMatch[1] : questionId;
      
      responses[stepNumber] = {
        questionId,
        selectedOptions
      };
    });
    
    return responses;
  };

  const convertToCompatibleFormat = (results: any, userName: string) => {
    return {
      version: 'v1',
      primaryStyle: {
        style: results.styleProfile.primaryStyle,
        category: results.styleProfile.primaryStyle,
        score: Math.round(results.styleProfile.confidence * 100),
        percentage: Math.round(results.styleProfile.confidence * 100),
        rank: 1,
      },
      secondaryStyles: results.styleProfile.secondaryStyle ? [{
        style: results.styleProfile.secondaryStyle,
        category: results.styleProfile.secondaryStyle,
        score: 50,
        percentage: 50,
        rank: 2,
      }] : [],
      scores: results.styleProfile.styleScores || {},
      totalQuestions: results.metadata.totalQuestions,
      userData: { name: userName },
      styleProfile: results.styleProfile,
      recommendations: results.recommendations
    };
  };

  // Fallback robusto quando não há resultado
  if (!primaryStyle) {
    return (
      <div className={cn('max-w-4xl mx-auto p-6', className)}>
        <AnimatedWrapper show={true}>
          <div className="text-center space-y-6">
            <div className="text-2xl font-bold text-[#432818]">
              {isLoading ? 'Calculando seu resultado...' : 'Resultado não disponível'}
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Problemas encontrados:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleRecalculate}
                disabled={isLoading}
                className="bg-[#B89B7A] hover:bg-[#aa6b5d] text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Recalculando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Tentar Novamente
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowDebug(!showDebug)}
                className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A]/10"
              >
                {showDebug ? 'Ocultar Debug' : 'Mostrar Debug'}
              </Button>
            </div>

            {showDebug && (
              <div className="text-left bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-2">Dados de Depuração:</h4>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {JSON.stringify({
                    primaryStyle,
                    validationErrors,
                    timestamp: new Date().toISOString()
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </AnimatedWrapper>
      </div>
    );
  }

  // Resultado válido encontrado
  const styleLabel = primaryStyle.style || primaryStyle.category || 'Seu Estilo';
  const rawPct = typeof primaryStyle.percentage === 'number' ? primaryStyle.percentage : 0;
  const effectivePct = computeEffectivePrimaryPercentage(primaryStyle as any, secondaryStyles as any[], rawPct);
  const displayPct = effectivePct > 0 ? effectivePct : 0;

  // Nome saneado para exibição
  const normalizeName = (name?: string) => {
    const s = (name || '').trim();
    if (s.length <= 1) return '';
    return s
      .split(/\s+/)
      .map(w => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(' ');
  };
  const userName = normalizeName(getBestUserName());

  // Obter configuração do estilo para imagens e dicas
  const styleConfig = getStyleConfig(styleLabel);

  return (
    <div className={cn('max-w-4xl mx-auto p-6', className)}>
      <AnimatedWrapper show={true}>
        {/* ✅ USAR O NOVO RESULTADO DISPLAY ESTRUTURADO */}
        <ResultDisplay
          username={userName || 'Usuário'}
          styleName={styleLabel}
          percentage={displayPct}
          image={styleConfig?.image || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'}
          guideImage={styleConfig?.guideImage || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'}
          description={styleConfig?.description || 'Seu estilo único foi revelado com base nas suas respostas.'}
          tips={styleConfig?.specialTips || []}
          category={styleConfig?.category}
        />

        {/* Render additional blocks if provided */}
        {blocks.map((block) => (
          <div key={block.id} className="w-full mt-8">
            {/* Placeholder for block rendering - would integrate with UniversalBlockRenderer */}
            <div className="text-sm text-gray-500 text-center p-4 bg-gray-50 rounded-lg">
              Block: {block.type} (ID: {block.id})
            </div>
          </div>
        ))}
      </AnimatedWrapper>
    </div>
  );
};

export default Step20Template;