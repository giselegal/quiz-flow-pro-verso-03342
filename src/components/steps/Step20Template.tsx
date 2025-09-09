import React, { useEffect, useState, useRef } from 'react';
import { computeEffectivePrimaryPercentage } from '@/core/result/percentage';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { validateQuizData, recalculateQuizResult } from '@/utils/quizResultCalculator';
import { cn } from '@/lib/utils';
import { getBestUserName } from '@/core/user/name';
import { getStyleConfig } from '@/config/styleConfig';
import { ResultDisplay } from '@/components/ui/ResultDisplay';

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
  const { primaryStyle, secondaryStyles } = useQuizResult();
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [neutralFixTried, setNeutralFixTried] = useState(false);
  // Evitar recálculos concorrentes/duplicados (StrictMode)
  const inFlightRef = useRef(false);
  const triedInitialRecalcRef = useRef(false);

  // Validar dados ao montar
  useEffect(() => {
    const { isValid, errors } = validateQuizData();
    setValidationErrors(errors);

    // 1) Se não há resultado válido, tentar recalcular apenas uma vez (por montagem)
    if (!primaryStyle && isValid && !triedInitialRecalcRef.current) {
      triedInitialRecalcRef.current = true;
      handleRecalculate();
      return;
    }

    // 2) Se veio um fallback "Neutro" mas temos dados válidos, forçar um recálculo uma única vez
    const isNeutral = Boolean(primaryStyle &&
      ((primaryStyle.style || '').toLowerCase() === 'neutro' || (primaryStyle.category || '').toLowerCase() === 'neutro'));
    if (isValid && isNeutral && !neutralFixTried) {
      setNeutralFixTried(true);
      handleRecalculate();
    }
  }, [primaryStyle, neutralFixTried]);

  const handleRecalculate = async () => {
    if (inFlightRef.current) return; // evita concorrência e double-fire do StrictMode
    inFlightRef.current = true;
    setIsLoading(true);
    try {
      // Aguardar o recálculo para refletir estado corretamente e capturar falhas
      const success = await recalculateQuizResult();
      if (!success) {
        setValidationErrors(['Falha ao recalcular resultado']);
      }
    } catch (error) {
      setValidationErrors(['Erro durante recálculo']);
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
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