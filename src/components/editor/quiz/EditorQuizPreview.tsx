// @ts-nocheck
/**
 * 🎯 PÁGINA PRINCIPAL DO FLUXO MODULAR DO QUIZ
 *
 * Orquestra todos os componentes modulares com suporte
 * para editor, preview e produção
 */

import { QuizPropertiesPanelModular } from '@/components/editor/quiz/QuizPropertiesPanelModular';
import { useEditor } from '@/components/editor/provider-alias';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { Block } from '@/types/editor';
import React, { useState } from 'react';
import { QuizRenderEngineModular } from './QuizRenderEngineModular';
import { QuizSidebarModular } from './QuizSidebarModular';
import { QuizStepManagerModular } from './QuizStepManagerModular';
import { QuizToolbarModular } from './QuizToolbarModular';

export const QuizFlowPageModular: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  const { quizState } = useQuizFlow();
  const mode = (quizState.mode || 'preview') as 'editor' | 'preview' | 'production';
  const setMode = (nextMode: string) => {
    // Mode switching pode ser implementado se necessário
    console.log('Mode toggle para:', nextMode);
  };
  const { blockActions } = useEditor();

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    blockActions.updateBlock(blockId, updates);
  };

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
    setPropertiesOpen(true);
  };

  const toggleMode = () => {
    const nextMode = mode === 'editor' ? 'preview' : mode === 'preview' ? 'production' : 'editor';
    setMode(nextMode);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <QuizToolbarModular
        mode={mode}
        onModeToggle={toggleMode}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onPropertiesToggle={() => setPropertiesOpen(!propertiesOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Components */}
        {sidebarOpen && mode === 'editor' && (
          <QuizSidebarModular onClose={() => setSidebarOpen(false)} />
        )}

        {/* Central Canvas */}
        <div className="flex-1 overflow-auto bg-background">
          <div className="min-h-full p-6">
            <QuizStepManagerModular>
              {({ blocks, currentStep, isValid, progress }) => (
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* Progress Indicator */}
                  <div className="bg-card rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Etapa {currentStep.stepNumber} de 21
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        {progress}% completo
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="bg-card rounded-lg border overflow-hidden">
                    <QuizRenderEngineModular
                      blocks={blocks}
                      mode={mode}
                      onBlockUpdate={handleBlockUpdate}
                      onBlockSelect={handleBlockSelect}
                      selectedBlockId={selectedBlockId}
                    />
                  </div>

                  {/* Step Info - Only in editor mode */}
                  {mode === 'editor' && (
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h3 className="font-semibold text-sm mb-2">Informações da Etapa</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="ml-2 font-medium">{currentStep.type}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Válida:</span>
                          <span
                            className={`ml-2 font-medium ${isValid ? 'text-green-600' : 'text-red-600'
                              }`}
                          >
                            {isValid ? 'Sim' : 'Não'}
                          </span>
                        </div>
                        {currentStep.maxSelections && (
                          <div>
                            <span className="text-muted-foreground">Max. seleções:</span>
                            <span className="ml-2 font-medium">{currentStep.maxSelections}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Obrigatória:</span>
                          <span className="ml-2 font-medium">
                            {currentStep.isRequired ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </QuizStepManagerModular>
          </div>
        </div>

        {/* Properties Panel */}
        {propertiesOpen && mode === 'editor' && selectedBlockId && (
          <div className="fixed right-0 top-0 h-full w-80 border-l bg-background z-50">
            <QuizPropertiesPanelModular
              selectedBlock={null} // Será passado os dados do bloco quando disponível
              onClose={() => {
                setPropertiesOpen(false);
                setSelectedBlockId(null);
              }}
              onUpdate={handleBlockUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
};
