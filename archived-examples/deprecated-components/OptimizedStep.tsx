// @ts-nocheck
/**
 * 🚀 EXEMPLO DE STEP OTIMIZADO COM HOOKS COMPOSTOS
 * ===============================================
 *
 * Demonstra como usar os novos hooks compostos para
 * maximizar performance e funcionalidade.
 */

import {
  useOptimizedQuizStep,
  useQuizStepContainer,
  useSmartDebounce,
  useTemplateActions,
} from '@/hooks';

interface OptimizedStepProps {
  stepId: number;
  onNext: () => void;
  onBlockAdd: (block: any) => void;
  onAnswer: (answer: any) => void;
  userAnswers: Record<string, any>;
}

/**
 * 🎯 Step otimizado usando todos os hooks compostos
 */
export const OptimizedStep: React.FC<OptimizedStepProps> = ({
  stepId,
  onNext,
  onBlockAdd,
  onAnswer,
  userAnswers,
}) => {
  // 🏗️ Container com otimizações automáticas
  const container = useQuizStepContainer(stepId, {
    containerWidth: 'large',
    spacing: 'comfortable',
    enableMobileOptimizations: true,
    enablePerformanceOptimizations: true,
  });

  // ⚡ Performance completa para o step
  const performance = useOptimizedQuizStep(stepId, {
    preloadNext: true,
    trackProgress: true,
    enableAnimations: !container.isMobile,
  });

  // 📝 Templates para reutilização
  const templates = useTemplateActions('quiz-step');

  // 🔄 Debounce inteligente para respostas
  const debouncedAnswer = useSmartDebounce(userAnswers[stepId], 300);

  // 📊 Efeito para tracking de mudanças
  React.useEffect(() => {
    if (debouncedAnswer) {
      onAnswer(debouncedAnswer);
    }
  }, [debouncedAnswer, onAnswer]);

  // 🎨 Renderização condicional baseada na performance
  if (!performance.shouldRender) {
    return (
      <div ref={performance.intersectionRef} className="h-96 flex items-center justify-center">
        <div className="animate-pulse">Carregando step {stepId}...</div>
      </div>
    );
  }

  return (
    <div
      ref={performance.intersectionRef}
      className={performance.quizStepClasses}
      style={container.inlineStyles}
    >
      {/* 📊 Debug info (apenas em desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && container.stats && (
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <strong>🔧 Hook Stats:</strong>
          <ul>
            <li>📱 Mobile: {container.isMobile ? 'Sim' : 'Não'}</li>
            <li>⚡ Otimizações: {container.stats.totalOptimizations}</li>
            <li>📈 Render: {performance.metrics?.renderCount || 0}x</li>
            <li>🔮 Preload: {performance.preloadStatus.nextStepReady ? '✅' : '⏳'}</li>
            <li>📝 Templates: {templates.availableTemplates.length}</li>
          </ul>
        </div>
      )}

      {/* 🏷️ Cabeçalho do Step */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-2">Step {stepId}</h2>

        {/* 📝 Botão para salvar como template */}
        {templates.hasTemplates && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                const currentBlock = {
                  type: 'quiz-step',
                  properties: { stepId, ...userAnswers[stepId] },
                };
                templates.saveAsTemplate(currentBlock, `Step ${stepId} Template`);
              }}
              style={{ backgroundColor: '#B89B7A' }}
            >
              💾 Salvar como Template ({templates.availableTemplates.length} disponíveis)
            </button>
          </div>
        )}
      </div>

      {/* 🎯 Conteúdo do Step */}
      <div className={container.containerClasses}>
        {/* Aqui vai o conteúdo real do step */}
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <p style={{ color: '#6B4F43' }}>Este é um step otimizado usando hooks compostos!</p>

            {/* 📊 Informações de performance */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Device:</span>
                <span className={container.isMobile ? 'text-orange-600' : 'text-green-600'}>
                  {container.isMobile ? ' 📱 Mobile' : ' 💻 Desktop'}
                </span>
              </div>

              <div>
                <span className="font-medium">Performance:</span>
                <span
                  className={
                    performance.device.shouldOptimize ? 'text-orange-600' : 'text-green-600'
                  }
                >
                  {performance.device.shouldOptimize ? ' ⚡ Otimizado' : ' 🚀 Normal'}
                </span>
              </div>
            </div>
          </div>

          {/* 🔮 Status do preload */}
          {performance.preloadStatus.isPreloading && (
            <div style={{ color: '#8B7355' }}>🔮 Preparando próximo step...</div>
          )}
        </div>
      </div>

      {/* 🎛️ Controles */}
      <div className="mt-8 flex justify-between items-center">
        <div style={{ color: '#8B7355' }}>Debounce: {performance.debounceTime}ms</div>

        <button
          onClick={onNext}
          disabled={!performance.preloadStatus.nextStepReady}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            performance.preloadStatus.nextStepReady
              ? 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {performance.preloadStatus.nextStepReady ? '➡️ Próximo' : '⏳ Carregando...'}
        </button>
      </div>
    </div>
  );
};

/**
 * 🎯 Exemplo de uso simples (para casos básicos)
 */
export const SimpleOptimizedStep: React.FC<OptimizedStepProps> = ({ stepId, onNext }) => {
  // 🏗️ Apenas container básico
  const { stepClasses, isMobile } = useQuizStepContainer(stepId);

  return (
    <div className={stepClasses}>
      <h2 className="text-xl font-bold mb-4">
        Step {stepId} {isMobile && '📱'}
      </h2>

      <p className="mb-6">Este é um exemplo simples de step otimizado!</p>

      <button onClick={onNext} style={{ backgroundColor: '#B89B7A' }}>
        Continuar
      </button>
    </div>
  );
};

export default OptimizedStep;
