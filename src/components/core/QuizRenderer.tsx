import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { Block } from '@/types/editor';
import React from 'react';

interface StepData {
  blocks: Block[];
  stepNumber: number;
  stepType: 'form' | 'question' | 'transition' | 'result' | 'offer';
}

interface QuizRendererProps {
  mode?: 'production' | 'preview' | 'editor';
  onStepChange?: (step: number) => void;
  initialStep?: number;
  className?: string;
  // Overrides para uso no editor: renderizar blocos reais do EditorProvider e sincronizar etapa
  blocksOverride?: Block[];
  currentStepOverride?: number;
  // Callback opcional para seleção de bloco no modo editor
  onBlockClick?: (blockId: string) => void;
  // Permitir seleção e uso de overrides também em preview (sem mudar o visual)
  previewEditable?: boolean;
  // Id do bloco selecionado (para destacar com moldura no preview editável)
  selectedBlockId?: string | null;
}

/**
 * 🎨 RENDERIZADOR UNIVERSAL DO QUIZ
 *
 * Renderiza etapas usando dados reais do template
 * Funciona idêntico em produção e preview
 */
export const QuizRenderer: React.FC<QuizRendererProps> = ({
  mode = 'production',
  onStepChange,
  initialStep = 1,
  className = '',
  blocksOverride,
  currentStepOverride,
  onBlockClick,
  previewEditable = false,
  selectedBlockId = null,
}) => {
  const { quizState, actions } = useQuizFlow({
    mode,
    onStepChange,
    initialStep,
  });

  const { currentStep, totalSteps, userName, progress, isLoading } = quizState;
  const { prevStep, getStepData } = actions; // Em preview editável, usaremos onStepChange direto

  // Buscar dados da etapa atual
  const canUseOverrides =
    (mode === 'editor' || (mode === 'preview' && previewEditable)) && Array.isArray(blocksOverride);

  const stepBlocks = canUseOverrides ? (blocksOverride as Block[]) : getStepData();

  // Determinar tipo da etapa
  const getStepType = (step: number): StepData['stepType'] => {
    if (step === 1) return 'form';
    if (step >= 2 && step <= 11) return 'question';
    if (step === 12 || step === 19) return 'transition';
    if (step >= 13 && step <= 18) return 'question';
    if (step === 20) return 'result';
    if (step === 21) return 'offer';
    return 'question';
  };

  const stepData: StepData = {
    blocks: stepBlocks,
    stepNumber: currentStepOverride ?? currentStep,
    stepType: getStepType(currentStep),
  };

  // Renderizar header com progresso
  const renderHeader = () => (
    <div className="quiz-header mb-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          Etapa {currentStepOverride ?? currentStep} de {totalSteps}
        </span>
        {/* Navegação no header: mostrar em modos não-preview, e também em preview quando previewEditable */}
        {mode !== 'preview' ? (
          <div className="flex gap-2">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              ← Voltar
            </button>
          </div>
        ) : previewEditable ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                const step = currentStepOverride ?? currentStep;
                const target = Math.max(1, step - 1);
                onStepChange?.(target);
              }}
              disabled={(currentStepOverride ?? currentStep) === 1}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              ← Voltar
            </button>
            <button
              onClick={() => {
                const step = currentStepOverride ?? currentStep;
                const target = Math.min(totalSteps, step + 1);
                onStepChange?.(target);
              }}
              disabled={(currentStepOverride ?? currentStep) >= totalSteps}
              className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            >
              Avançar →
            </button>
          </div>
        ) : null}
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  // Renderizar conteúdo da etapa
  const renderStepContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Calculando seus resultados...</h2>
          <p className="text-gray-600">Analisando suas respostas...</p>
        </div>
      );
    }

    // Renderizar blocos da etapa usando UniversalBlockRenderer
    return (
      <div className="step-content space-y-6">
        {stepBlocks.map((block: any, index: number) => {
          const isSelectable = mode === 'editor' || (mode === 'preview' && previewEditable);
          const isSelected = isSelectable && selectedBlockId === block.id;
          return (
            <div
              key={block.id || index}
              className={
                'block-container relative transition-all ' +
                (isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg' : '')
              }
              onClick={() => {
                if (isSelectable && block.id && onBlockClick) {
                  onBlockClick(String(block.id));
                }
              }}
            >
              <UniversalBlockRenderer
                block={block}
                isSelected={isSelected}
                mode={mode}
                onClick={() => {
                  if (isSelectable && block.id && onBlockClick) {
                    onBlockClick(String(block.id));
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`quiz-renderer ${className}`}>
      <div className="max-w-4xl mx-auto p-6">
        {renderHeader()}
        {renderStepContent()}

        {/* Debug info em modo preview */}
        {mode === 'preview' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
            <strong>Debug:</strong> Step {currentStep} | Type: {stepData.stepType} | Blocks:{' '}
            {stepBlocks.length} | User: {userName || 'None'}
          </div>
        )}
      </div>
    </div>
  );
};
