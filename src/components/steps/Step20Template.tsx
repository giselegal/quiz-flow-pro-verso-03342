import React, { useEffect, useState } from 'react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { useQuizResult } from '@/hooks/useQuizResult';
import { validateQuizData, recalculateQuizResult } from '@/utils/quizResultCalculator';
import { cn } from '@/lib/utils';

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

  // Validar dados ao montar
  useEffect(() => {
    const { isValid, errors } = validateQuizData();
    setValidationErrors(errors);
    
    // Se não há resultado válido, tentar recalcular
    if (!primaryStyle && isValid) {
      handleRecalculate();
    }
  }, [primaryStyle]);

  const handleRecalculate = async () => {
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
  const percentage = primaryStyle.percentage || 0;

  return (
    <div className={cn('max-w-4xl mx-auto p-6', className)}>
      <AnimatedWrapper show={true}>
        <div className="text-center space-y-8">
          {/* Success indicator */}
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Resultado calculado com sucesso!</span>
          </div>

          {/* Primary Style Display */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#B89B7A]/20">
            <h1 className="text-3xl md:text-4xl font-bold text-[#432818] mb-4">
              Seu Estilo: {styleLabel}
            </h1>
            
            <div className="text-xl text-[#6B4F43] mb-6">
              {percentage}% de compatibilidade
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#F3E8E6] rounded-full h-3 mb-8">
              <div
                className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] h-3 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Secondary Styles */}
          {secondaryStyles.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#B89B7A]/20">
              <h2 className="text-xl font-semibold text-[#432818] mb-4">
                Estilos Secundários
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {secondaryStyles.slice(0, 4).map((style, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-[#FAF9F7] rounded-lg">
                    <span className="font-medium text-[#432818]">
                      {style.style || style.category}
                    </span>
                    <span className="text-[#6B4F43]">
                      {style.percentage || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render additional blocks if provided */}
          {blocks.map((block) => (
            <div key={block.id} className="w-full">
              {/* Placeholder for block rendering - would integrate with UniversalBlockRenderer */}
              <div className="text-sm text-gray-500">
                Block: {block.type} (ID: {block.id})
              </div>
            </div>
          ))}
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default Step20Template;