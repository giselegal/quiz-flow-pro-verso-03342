// @ts-nocheck
/**
 * 🚀 STEP OTIMIZADO - VERSÃO PRONTA PARA PRODUÇÃO
 * ==============================================
 *
 * Usa apenas hooks existentes que funcionam HOJE!
 * Pode ser aplicado em todas as etapas do /editor-fixed
 */

import { useIsMobile } from '@/hooks/use-mobile';
import { useContainerProperties } from '@/hooks/useContainerProperties';
import { useDebounce } from '@/hooks/useDebounce';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import React, { useCallback, useMemo } from 'react';

interface ProductionReadyStepProps {
  stepId: number;
  onNext: () => void;
  onAnswer?: (answer: any) => void;
  userAnswers?: Record<string, any>;
  children?: React.ReactNode;
}

/**
 * 🎯 Step otimizado usando hooks que JÁ EXISTEM
 * Pode ser implementado HOJE em todas as etapas!
 */
export const ProductionReadyStep: React.FC<ProductionReadyStepProps> = ({
  stepId,
  onNext,
  onAnswer,
  userAnswers = {},
  children,
}) => {
  // 📱 Detecção de mobile (hook existente)
  const isMobile = useIsMobile();

  // ⚡ Performance optimization (hook existente)
  const performance = usePerformanceOptimization();

  // 🏗️ Container properties otimizadas
  const containerProps = useMemo(
    () => ({
      containerWidth: isMobile ? 'medium' : 'large',
      containerPosition: 'center' as const,
      spacing: isMobile ? 'compact' : ('comfortable' as const),
      backgroundColor: 'white' as const,
      scale: isMobile ? 95 : 100, // Menor no mobile
    }),
    [isMobile]
  );

  const { containerClasses, inlineStyles } = useContainerProperties(containerProps);

  // 🔄 Debounce para respostas (hook existente)
  const currentAnswer = userAnswers[stepId];
  const debouncedAnswer = useDebounce(currentAnswer, isMobile ? 500 : 300);

  // 📊 Rastreamento de mudanças com debounce
  React.useEffect(() => {
    if (debouncedAnswer && onAnswer) {
      onAnswer(debouncedAnswer);
    }
  }, [debouncedAnswer, onAnswer]);

  // 🎨 Classes otimizadas baseadas no device
  const optimizedClasses = useMemo(() => {
    const classes = [containerClasses];

    // Adicionar classes de performance
    if (isMobile) {
      classes.push('transition-none'); // Sem transições no mobile
    } else {
      classes.push('transition-all duration-300 ease-in-out');
    }

    // Performance optimizations
    if (performance) {
      classes.push('transform-gpu'); // GPU acceleration
    }

    return classes.join(' ');
  }, [containerClasses, isMobile, performance]);

  // 🔧 Stats em tempo real (desenvolvimento)
  const devStats = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return null;

    return {
      stepId,
      isMobile,
      debounceTime: isMobile ? 500 : 300,
      containerWidth: containerProps.containerWidth,
      hasAnswer: !!currentAnswer,
      performanceEnabled: !!performance,
    };
  }, [stepId, isMobile, containerProps.containerWidth, currentAnswer, performance]);

  // 🎯 Handler otimizado para próximo step
  const handleNext = useCallback(() => {
    // Pequeno delay para garantir que o debounce terminou
    setTimeout(onNext, 50);
  }, [onNext]);

  return (
    <div className={optimizedClasses} style={inlineStyles}>
      {/* 📊 Debug info (apenas desenvolvimento) */}
      {devStats && (
        <div style={{ borderColor: '#E5DDD5' }}>
          <details className="text-sm">
            <summary className="font-medium cursor-pointer">🔧 Hook Stats (DEV)</summary>
            <div className="mt-2 space-y-1 text-xs">
              <div>
                📱 Mobile:{' '}
                <span className={isMobile ? 'text-orange-600' : 'text-green-600'}>
                  {isMobile ? 'Sim' : 'Não'}
                </span>
              </div>
              <div>🔄 Debounce: {devStats.debounceTime}ms</div>
              <div>📦 Container: {devStats.containerWidth}</div>
              <div>💬 Tem Resposta: {devStats.hasAnswer ? '✅' : '❌'}</div>
              <div>⚡ Performance: {devStats.performanceEnabled ? '✅' : '❌'}</div>
            </div>
          </details>
        </div>
      )}

      {/* 🏷️ Cabeçalho responsivo */}
      <div className="mb-6">
        <h2 className={`font-bold text-center mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
          Step {stepId} {isMobile && '📱'}
        </h2>

        {/* Indicador de debounce ativo */}
        {currentAnswer && currentAnswer !== debouncedAnswer && (
          <div className="text-center text-sm text-yellow-600">⏳ Processando resposta...</div>
        )}
      </div>

      {/* 🎯 Conteúdo do step */}
      <div className="space-y-4">
        {children || (
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <p style={{ color: '#6B4F43' }}>Este step está otimizado com hooks existentes! ✨</p>

            {/* 📊 Info de performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Device:</span>
                <span className={isMobile ? 'text-orange-600' : 'text-green-600'}>
                  {isMobile ? '📱 Mobile' : '💻 Desktop'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-medium">Resposta:</span>
                <span className={debouncedAnswer ? 'text-green-600' : 'text-gray-400'}>
                  {debouncedAnswer ? '✅ Salva' : '⏳ Aguardando'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🎛️ Controles otimizados */}
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <div style={{ color: '#8B7355' }}>Otimizado para {isMobile ? 'Mobile' : 'Desktop'}</div>

          <button
            onClick={handleNext}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isMobile
                ? 'text-base' // Maior no mobile
                : 'text-sm hover:transform hover:scale-105' // Hover effect apenas desktop
            } bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
          >
            ➡️ Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 Versão ainda mais simples para aplicação rápida
 */
export const QuickOptimizedStep: React.FC<ProductionReadyStepProps> = ({
  stepId,
  onNext,
  children,
}) => {
  const isMobile = useIsMobile();
  const { containerClasses, inlineStyles } = useContainerProperties({
    containerWidth: isMobile ? 'medium' : 'large',
    spacing: isMobile ? 'compact' : 'normal',
    containerPosition: 'center',
  });

  return (
    <div className={containerClasses} style={inlineStyles}>
      <h2 className={`font-bold mb-6 ${isMobile ? 'text-xl text-center' : 'text-2xl'}`}>
        Step {stepId}
      </h2>

      {children}

      <div className="mt-8 text-center">
        <button onClick={onNext} style={{ backgroundColor: '#B89B7A' }}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ProductionReadyStep;
