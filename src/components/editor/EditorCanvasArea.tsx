import QuizRunnerShell from '@/components/quiz/QuizRunnerShell';
import type { Block } from '@/types/editor';
import React, { memo } from 'react';
import { CanvasDropZone } from './canvas/CanvasDropZone.simple';

interface EditorCanvasAreaProps {
  safeCurrentStep: number;
  viewportWidth: number | string;
  editorStepValidation: Record<number, boolean>;
  currentStepData: Block[];
  state: any;
  actions: any;
  getStepAnalysis: (step: number) => { label: string; desc: string };
}

const EditorCanvasArea: React.FC<EditorCanvasAreaProps> = ({
  safeCurrentStep,
  viewportWidth,
  editorStepValidation,
  currentStepData,
  state,
  actions,
  getStepAnalysis,
}) => {
  const currentStepKey = `step-${safeCurrentStep}`;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full">
        <div
          className="mx-auto transition-all editor-pro-canvas"
          style={{ width: viewportWidth as number | string, maxWidth: '100%' }}
        >
          <QuizRunnerShell
            currentStep={safeCurrentStep}
            totalSteps={21}
            progress={Math.round((safeCurrentStep / 21) * 100)}
            variant="embedded"
            matchFullStyle={true}
            showHeader={true}
            navPosition="bottom"
            canGoPrev={safeCurrentStep > 1}
            canGoNext={!!editorStepValidation[safeCurrentStep]}
            onPrev={() => actions.setCurrentStep(Math.max(1, safeCurrentStep - 1))}
            onNext={() => actions.setCurrentStep(Math.min(21, safeCurrentStep + 1))}
          >
            <div className="quiz-content p-8 space-y-6">
              <CanvasDropZone
                blocks={currentStepData}
                selectedBlockId={state.selectedBlockId}
                onSelectBlock={(id: string) => actions.setSelectedBlockId(id)}
                onUpdateBlock={(id: string, updates: any) =>
                  actions.updateBlock(currentStepKey, id, updates)
                }
                onDeleteBlock={(id: string) => actions.removeBlock(currentStepKey, id)}
              />
            </div>
          </QuizRunnerShell>

          <div className="text-xs mt-2 px-2">
            Clique em um bloco no canvas para ver suas propriedades
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Estatísticas da Etapa {safeCurrentStep}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Blocos configurados:</span>
                <span className="font-medium">{currentStepData.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipo da etapa:</span>
                <span className="font-medium">{getStepAnalysis(safeCurrentStep).label}</span>
              </div>
              <div className="flex justify-between">
                <span>Função:</span>
                <span className="font-medium">{getStepAnalysis(safeCurrentStep).desc}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(EditorCanvasArea);
