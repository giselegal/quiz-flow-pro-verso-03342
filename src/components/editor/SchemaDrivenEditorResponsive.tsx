import RegistryPropertiesPanel from '@/components/universal/RegistryPropertiesPanel';
import { useEditor } from './EditorProvider';
import { BlockType } from '@/types/editor';
import { QuizMainDemo } from './QuizMainDemo';
import { CanvasDropZone } from './canvas/CanvasDropZone.simple';
import ComponentsSidebar from './components/ComponentsSidebar';
import FunnelStagesPanel from './funnel/FunnelStagesPanelUnified';
import './interactive/styles/quiz-animations.css';
import { FourColumnLayout } from './layout/FourColumnLayout';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { Step20EditorFallback } from './fallback/Step20EditorFallback';
import { StepDndProvider } from './dnd/StepDndProvider';
import { calculateAndSaveQuizResult } from '@/utils/quizResultCalculator';

import React, { useState } from 'react';
import { createBlockFromComponent } from '@/utils/editorUtils';

interface SchemaDrivenEditorResponsiveProps {
  funnelId?: string;
  className?: string;
  mode?: 'editor' | 'preview' | 'interactive';
  userName?: string;
}

const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  funnelId: _funnelId,
  className = '',
  mode = 'editor',
  userName,
}) => {
  const { state, actions } = useEditor();

  // Derivações com base no novo EditorProvider
  const currentStepKey = `step-${state.currentStep}`;
  const currentBlocks = state.stepBlocks[currentStepKey] || [];
  const selectedBlockId = state.selectedBlockId;
  const selectedBlock = currentBlocks.find(b => b.id === selectedBlockId) || null;
  const setSelectedBlockId = actions.setSelectedBlockId;

  const [isInteractiveMode, setIsInteractiveMode] = useState(mode === 'interactive');

  // 🎯 FASE 2: Integrar fallback para etapa 20
  const isStep20 = state.currentStep === 20;
  const hasResultHeaderBlock = currentBlocks.some(block => block.type === 'result-header-inline');

  // Garantir cálculo do resultado quando entrar na etapa 20 (paridade com EditorPro)
  React.useEffect(() => {
    const step = state.currentStep;
    if (step !== 20) return;

    let cancelled = false;
    (async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.info('🧮 [SchemaEditor] Etapa 20: forçando cálculo de resultado');
        }
        await calculateAndSaveQuizResult();
        if (!cancelled) {
          try { window.dispatchEvent(new Event('quiz-result-refresh')); } catch { }
        }
        // Segunda tentativa breve para cobrir condições de corrida
        setTimeout(async () => {
          if (cancelled) return;
          try {
            if (process.env.NODE_ENV === 'development') {
              console.info('🧮 [SchemaEditor] Etapa 20: segunda tentativa de cálculo');
            }
            await calculateAndSaveQuizResult();
            try { window.dispatchEvent(new Event('quiz-result-refresh')); } catch { }
          } catch (err) {
            console.error('[SchemaEditor] Falha na segunda tentativa de cálculo:', err);
          }
        }, 800);
      } catch (err) {
        console.error('[SchemaEditor] Falha ao calcular resultado na etapa 20:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [state.currentStep]);

  const handleComponentSelect = async (type: string) => {
    try {
      const newBlock = createBlockFromComponent(type as BlockType, currentBlocks);
      if (newBlock) {
        await actions.addBlock(currentStepKey, newBlock);
        setSelectedBlockId(newBlock.id);
        console.log(`➕ Bloco ${type} adicionado via editor responsivo`);
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar bloco:', error);
    }
  };

  const handleUpdateSelectedBlock = async (blockId: string, updates: any) => {
    if (blockId) {
      try {
        await actions.updateBlock(currentStepKey, blockId, updates);
        console.log('✅ Bloco atualizado via editor responsivo:', blockId);
      } catch (error) {
        console.error('❌ Erro ao atualizar bloco:', error);
      }
    }
  };

  const handleModeToggle = () => {
    setIsInteractiveMode(!isInteractiveMode);
  };

  // Modo Interativo - Renderiza o Quiz Canvas
  if (isInteractiveMode || mode === 'interactive') {
    return (
      <div className={`h-full w-full bg-background ${className}`}>
        {/* Toolbar com botão para voltar ao editor */}
        <div className="h-14 border-b bg-white flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-800">🎯 Quiz Interativo</h1>
            {userName && <span className="text-sm text-gray-600">Olá, {userName}!</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleModeToggle}
              className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              ✏️ Voltar ao Editor
            </button>
          </div>
        </div>

        {/* Canvas Interativo */}
        <div className="h-[calc(100%-56px)]">
          <QuizMainDemo />
        </div>
      </div>
    );
  }

  return (
    <div className={`editor-mobile-layout h-full w-full bg-background ${className}`}>
      {/* 🎨 TOOLBAR SUPERIOR */}
      <div className="h-14 border-b bg-white flex items-center justify-between px-4">
        <EditorToolbar />

        {/* Botão para Modo Interativo */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleModeToggle}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${isInteractiveMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
          >
            {isInteractiveMode ? '✏️ Editor' : '🎮 Quiz Interativo'}
          </button>
        </div>
      </div>

      {/* 📐 LAYOUT DE 4 COLUNAS */}
      <div className="editor-main-content h-[calc(100%-56px)]">
        <FourColumnLayout
          stagesPanel={<FunnelStagesPanel />}
          componentsPanel={<ComponentsSidebar onComponentSelect={handleComponentSelect} />}
          canvas={
            <StepDndProvider stepNumber={state.currentStep}>
              {/* 🛡️ FASE 2: Fallback robusto para etapa 20 */}
              {isStep20 && (!hasResultHeaderBlock || currentBlocks.length === 0) ? (
                <Step20EditorFallback
                  blocks={currentBlocks}
                  onSelectBlock={setSelectedBlockId}
                  selectedBlockId={selectedBlockId}
                  onUpdateBlock={(id, updates) => actions.updateBlock(currentStepKey, id, updates)}
                  onDeleteBlock={id => actions.removeBlock(currentStepKey, id)}
                />
              ) : (
                <CanvasDropZone
                  blocks={currentBlocks}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onUpdateBlock={(id, updates) => actions.updateBlock(currentStepKey, id, updates)}
                  onDeleteBlock={id => actions.removeBlock(currentStepKey, id)}
                  scopeId={state.currentStep}
                />
              )}
            </StepDndProvider>
          }
          propertiesPanel={
            <RegistryPropertiesPanel
              selectedBlock={selectedBlock || null}
              onUpdate={handleUpdateSelectedBlock}
              onClose={() => setSelectedBlockId(null)}
              onDelete={blockId => actions.removeBlock(currentStepKey, blockId)}
            />
          }
        />
      </div>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
