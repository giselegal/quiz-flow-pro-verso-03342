import React from 'react';
import { cn } from '../../lib/utils';
import { QuizRenderer } from '../core/QuizRenderer';
import CanvasDropZone from './canvas/CanvasDropZone';
import { DndProvider } from './DndProvider';
import { EnhancedComponentsSidebar } from './EnhancedComponentsSidebar';
import { useEditor } from './EditorProvider';

interface EditorProProps {
  className?: string;
}

const EditorPro: React.FC<EditorProProps> = ({ className = '' }) => {
  const { state, actions } = useEditor();
  const [mode, setMode] = React.useState<'edit' | 'preview'>('edit');

  const safeCurrentStep = Math.max(1, Math.min(state.currentStep || 1, 21));
  const currentStepKey = `step_${safeCurrentStep}`;
  const currentStepData = state.stepBlocks?.[currentStepKey] || [];

  /* -------------------------
     Handlers de ações dos blocos
     ------------------------- */

  const handleStepSelect = React.useCallback(
    (step: number) => {
      actions.setCurrentStep(step);
      console.log('Step selecionado:', step);
    },
    [actions]
  );

  /* -------------------------
     Componentes de layout
     ------------------------- */

  const StepSidebar: React.FC = () => (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Passos</h2>
        <p className="text-sm text-gray-600 mt-1">Quiz de 21 etapas</p>
      </div>
      <div className="p-4">
        {Array.from({ length: 21 }, (_, i) => i + 1).map(step => (
          <button
            key={step}
            onClick={() => handleStepSelect(step)}
            className={cn(
              'w-full text-left p-2 rounded mb-2 transition-colors',
              step === safeCurrentStep
                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                : 'hover:bg-gray-100 text-gray-700'
            )}
          >
            Passo {step}
          </button>
        ))}
      </div>
    </div>
  );

  const CanvasArea: React.FC = () => (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Editor - Passo {safeCurrentStep}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('edit')}
              className={cn(
                'px-3 py-1 rounded text-sm',
                mode === 'edit'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Editar
            </button>
            <button
              onClick={() => setMode('preview')}
              className={cn(
                'px-3 py-1 rounded text-sm',
                mode === 'preview'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {mode === 'edit' ? (
            <div
              className={cn(
                'flex items-center justify-between text-sm p-3 rounded mb-4',
                currentStepData.length === 0
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              )}
            >
              <div>
                <strong>🎯 Modo Edição:</strong>{' '}
                {currentStepData.length === 0
                  ? 'Arraste componentes da sidebar para começar'
                  : `${currentStepData.length} blocos disponíveis - Clique para editar`}
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'flex items-center justify-between text-sm p-3 rounded mb-4',
                'bg-green-50 border-green-200 text-green-900'
              )}
            >
              <div>
                <strong>👁️ Modo Preview:</strong> Visualização idêntica à produção final
              </div>
              <div className="text-green-700">Navegação e interações funcionais</div>
            </div>
          )}
        </div>
      </div>

      <CanvasDropZone
        isEmpty={currentStepData.length === 0 && mode === 'edit'}
        data-testid="canvas-dropzone"
      >
        <QuizRenderer
          mode={mode === 'preview' ? 'preview' : 'editor'}
          onStepChange={handleStepSelect}
          initialStep={safeCurrentStep}
        />

        {mode === 'edit' && currentStepData.length === 0 && (
          <div className="flex items-center justify-center min-h-[400px] text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-medium mb-2">Canvas vazio</h3>
              <p className="text-sm">
                Arraste componentes da sidebar para criar seu quiz
              </p>
            </div>
          </div>
        )}
      </CanvasDropZone>
    </div>
  );

  const PropertiesColumn: React.FC = () => {
    return (
      <div className="w-[380px] bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-sm text-gray-900">Painel de Propriedades</h3>
          <p className="text-xs text-gray-500 mt-1">Selecione um bloco para editar</p>
        </div>

        <div className="flex-1 p-4">
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-4">⚙️</div>
            <p className="text-sm">
              Selecione um bloco no canvas para ver suas propriedades
            </p>
          </div>
        </div>
      </div>
    );
  };

  /* -------------------------
     Render principal com estrutura DnD correta
     ------------------------- */
  return (
    <>
      <DndProvider currentStepData={currentStepData} currentStepKey={currentStepKey}>
        <div className={`editor-pro h-screen bg-gray-50 flex ${className}`}>
          <StepSidebar />
          <EnhancedComponentsSidebar />
          <CanvasArea />
          <PropertiesColumn />
        </div>
      </DndProvider>
    </>
  );
};

export { EditorPro };
